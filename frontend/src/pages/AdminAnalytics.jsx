import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { BarChart3, Users, Eye, Calendar, TrendingUp, LogOut } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminAnalytics = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [visitData, setVisitData] = useState([]);
  const [period, setPeriod] = useState('day');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchAnalytics();
  }, [navigate, period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [summaryRes, visitsRes] = await Promise.all([
        axios.get(`${API}/admin/analytics/summary`),
        axios.get(`${API}/admin/analytics/visits?period=${period}`)
      ]);
      setSummary(summaryRes.data);
      setVisitData(visitsRes.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <Card className="p-6 bg-white">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold" style={{ color: '#00537C' }}>{value}</p>
          {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
        </div>
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: color + '20' }}
        >
          <Icon size={24} style={{ color }} />
        </div>
      </div>
    </Card>
  );

  const maxVisits = Math.max(...visitData.map(d => d.total_visits || 0), 1);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e0e0e0' }}>
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src="/logo.jpg" alt="JM Engenharia" className="h-10 w-auto object-contain" />
            <h1 className="text-2xl font-bold" style={{ color: '#00537C' }}>Análise de Acessos</h1>
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
          <div className="text-center py-16 text-gray-500">Carregando estatísticas...</div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Visitas Hoje"
                value={summary?.today || 0}
                icon={Eye}
                color="#00537C"
                subtitle={`${summary?.unique_today || 0} visitantes únicos`}
              />
              <StatCard
                title="Esta Semana"
                value={summary?.this_week || 0}
                icon={Calendar}
                color="#10B981"
              />
              <StatCard
                title="Este Mês"
                value={summary?.this_month || 0}
                icon={TrendingUp}
                color="#F59E0B"
              />
              <StatCard
                title="Total de Visitas"
                value={summary?.total || 0}
                icon={Users}
                color="#8B5CF6"
              />
            </div>

            {/* Chart Section */}
            <Card className="p-6 bg-white">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold" style={{ color: '#00537C' }}>
                  <BarChart3 className="inline mr-2" size={20} />
                  Histórico de Visitas
                </h2>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setPeriod('day')}
                    variant={period === 'day' ? 'default' : 'outline'}
                    size="sm"
                    className={period === 'day' ? 'text-white' : ''}
                    style={period === 'day' ? { backgroundColor: '#00537C' } : {}}
                  >
                    Diário
                  </Button>
                  <Button
                    onClick={() => setPeriod('week')}
                    variant={period === 'week' ? 'default' : 'outline'}
                    size="sm"
                    className={period === 'week' ? 'text-white' : ''}
                    style={period === 'week' ? { backgroundColor: '#00537C' } : {}}
                  >
                    Semanal
                  </Button>
                  <Button
                    onClick={() => setPeriod('month')}
                    variant={period === 'month' ? 'default' : 'outline'}
                    size="sm"
                    className={period === 'month' ? 'text-white' : ''}
                    style={period === 'month' ? { backgroundColor: '#00537C' } : {}}
                  >
                    Mensal
                  </Button>
                </div>
              </div>

              {visitData.length === 0 ? (
                <div className="text-center py-16">
                  <BarChart3 size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-2">Nenhum dado de visitas ainda</p>
                  <p className="text-gray-400 text-sm">
                    As estatísticas aparecerão aqui quando os visitantes acessarem o site.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Simple Bar Chart */}
                  <div className="space-y-3">
                    {visitData.slice(-14).map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-24 text-sm text-gray-600 text-right">
                          {item.date || item._id}
                        </div>
                        <div className="flex-1 h-8 bg-gray-100 rounded overflow-hidden">
                          <div
                            className="h-full rounded transition-all duration-500"
                            style={{
                              width: `${(item.total_visits / maxVisits) * 100}%`,
                              backgroundColor: '#00537C'
                            }}
                          />
                        </div>
                        <div className="w-20 text-sm font-medium">
                          {item.total_visits} visitas
                        </div>
                        <div className="w-24 text-sm text-gray-500">
                          {item.unique_visitors} únicos
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="pt-4 border-t mt-6 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold" style={{ color: '#00537C' }}>
                        {visitData.reduce((sum, d) => sum + (d.total_visits || 0), 0)}
                      </p>
                      <p className="text-sm text-gray-500">Total no período</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold" style={{ color: '#10B981' }}>
                        {visitData.reduce((sum, d) => sum + (d.unique_visitors || 0), 0)}
                      </p>
                      <p className="text-sm text-gray-500">Visitantes únicos</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold" style={{ color: '#F59E0B' }}>
                        {visitData.length > 0 
                          ? Math.round(visitData.reduce((sum, d) => sum + (d.total_visits || 0), 0) / visitData.length)
                          : 0}
                      </p>
                      <p className="text-sm text-gray-500">Média por período</p>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Info Box */}
            <Card className="p-6 bg-blue-50 border-blue-200 mt-6">
              <h3 className="font-bold text-blue-800 mb-2">💡 Como funciona o rastreamento</h3>
              <p className="text-blue-700 text-sm">
                As visitas são registradas automaticamente quando os usuários navegam pelo site.
                O sistema rastreia visualizações de páginas e visitantes únicos baseado no endereço IP.
                Os dados são atualizados em tempo real.
              </p>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;
