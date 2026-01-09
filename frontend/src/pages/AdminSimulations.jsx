import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Calculator, User, Phone, DollarSign, Trash2, LogOut, Calendar } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminSimulations = () => {
  const navigate = useNavigate();
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchSimulations();
  }, [navigate]);

  const fetchSimulations = async () => {
    try {
      const response = await axios.get(`${API}/admin/simulations`);
      setSimulations(response.data);
    } catch (error) {
      console.error('Error fetching simulations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta simulação?')) {
      try {
        await axios.delete(`${API}/admin/simulations/${id}`);
        fetchSimulations();
      } catch (error) {
        alert('Erro ao excluir simulação');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (value) => {
    if (!value) return 'N/A';
    return `R$ ${parseFloat(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e0e0e0' }}>
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src="/logo.jpg" alt="JM Engenharia" className="h-10 w-auto object-contain" />
            <h1 className="text-2xl font-bold" style={{ color: '#00537C' }}>Simulações dos Clientes</h1>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {simulations.length} simulações
            </span>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/admin/dashboard')} variant="outline">
              Voltar ao Dashboard
            </Button>
            <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
              <LogOut size={18} />
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Carregando...</div>
        ) : simulations.length === 0 ? (
          <Card className="p-8 text-center bg-white">
            <Calculator size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Nenhuma simulação realizada ainda</p>
            <p className="text-gray-400 text-sm mt-2">
              As simulações aparecerão aqui quando os clientes utilizarem a ferramenta de simulação no site.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {simulations.map((sim) => (
              <Card key={sim.id} className="bg-white overflow-hidden">
                <div className="p-4">
                  {/* Header Row */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#00537C20' }}>
                        <User size={24} style={{ color: '#00537C' }} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg" style={{ color: '#00537C' }}>{sim.client_name}</h3>
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Phone size={14} />
                          {sim.client_phone}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-gray-500 text-sm mb-1">
                        <Calendar size={14} />
                        {formatDate(sim.created_at)}
                      </div>
                      <Button
                        onClick={() => handleDelete(sim.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>

                  {/* Summary Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Renda Familiar</p>
                      <p className="font-bold" style={{ color: '#00537C' }}>{sim.income_label}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Valor do Imóvel</p>
                      <p className="font-bold" style={{ color: '#00537C' }}>{sim.property_value_label}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Taxa de Juros</p>
                      <p className="font-bold" style={{ color: '#00537C' }}>
                        {sim.result_data?.taxaJuros || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Status</p>
                      <p className={`font-bold ${sim.result_data?.rendaInsuficiente ? 'text-red-600' : 'text-green-600'}`}>
                        {sim.result_data?.rendaInsuficiente ? 'Renda Insuficiente' : 'Aprovado'}
                      </p>
                    </div>
                  </div>

                  {/* Expandable Details */}
                  <button
                    onClick={() => setExpandedId(expandedId === sim.id ? null : sim.id)}
                    className="text-sm font-medium hover:underline"
                    style={{ color: '#00537C' }}
                  >
                    {expandedId === sim.id ? '▲ Ocultar detalhes' : '▼ Ver detalhes da simulação'}
                  </button>

                  {expandedId === sim.id && sim.result_data && !sim.result_data.rendaInsuficiente && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Left Column - Values */}
                        <div className="space-y-3">
                          <h4 className="font-bold text-sm uppercase text-gray-500">Valores</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Valor do Imóvel:</span>
                              <span className="font-medium">{formatCurrency(sim.result_data.valorImovel)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Valor de Entrada:</span>
                              <span className="font-medium">{formatCurrency(sim.result_data.entrada)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Valor Liberado:</span>
                              <span className="font-medium">{formatCurrency(sim.result_data.valorLiberado)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Subsídio:</span>
                              <span className="font-medium">{formatCurrency(sim.result_data.subsidio)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Prazo:</span>
                              <span className="font-medium">{sim.result_data.prazo} meses</span>
                            </div>
                          </div>
                        </div>

                        {/* Right Column - Parcelas */}
                        <div className="space-y-3">
                          <h4 className="font-bold text-sm uppercase text-gray-500">Parcelas</h4>
                          
                          {sim.result_data.sistemaSAC && (
                            <div className="p-3 bg-blue-50 rounded">
                              <p className="font-medium text-blue-800 mb-2">Sistema SAC/TR</p>
                              <div className="text-sm space-y-1">
                                <div className="flex justify-between">
                                  <span>1ª Parcela:</span>
                                  <span className="font-medium">{formatCurrency(sim.result_data.sistemaSAC.primeiraParcela)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Última Parcela:</span>
                                  <span className="font-medium">{formatCurrency(sim.result_data.sistemaSAC.ultimaParcela)}</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {sim.result_data.sistemaPRICE && (
                            <div className="p-3 bg-green-50 rounded">
                              <p className="font-medium text-green-800 mb-2">Sistema PRICE/TR</p>
                              <div className="text-sm space-y-1">
                                <div className="flex justify-between">
                                  <span>Parcela Fixa:</span>
                                  <span className="font-medium">{formatCurrency(sim.result_data.sistemaPRICE.parcelaFixa)}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {expandedId === sim.id && sim.result_data?.rendaInsuficiente && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="p-4 bg-red-50 rounded-lg">
                        <p className="text-red-700 font-medium">
                          A renda familiar informada ({sim.income_label}) não é suficiente para financiar um imóvel de {sim.property_value_label}.
                        </p>
                        <p className="text-red-600 text-sm mt-2">
                          {sim.result_data.mensagem || 'Sugerimos entrar em contato para avaliar outras opções.'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSimulations;
