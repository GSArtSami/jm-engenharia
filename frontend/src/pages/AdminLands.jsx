import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { MapPin, Edit, Trash2, Plus, X, LogOut } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminLands = () => {
  const navigate = useNavigate();
  const [lands, setLands] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingLand, setEditingLand] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    area: '',
    price: '',
    image: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchLands();
  }, [navigate]);

  const fetchLands = async () => {
    try {
      const response = await axios.get(`${API}/admin/lands`);
      setLands(response.data);
    } catch (error) {
      console.error('Error fetching lands:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const openModal = (land = null) => {
    if (land) {
      setEditingLand(land);
      setFormData({
        name: land.name,
        location: land.location,
        description: land.description,
        area: land.area,
        price: land.price,
        image: land.image
      });
    } else {
      setEditingLand(null);
      setFormData({
        name: '',
        location: '',
        description: '',
        area: '',
        price: '',
        image: ''
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLand) {
        await axios.put(`${API}/admin/lands/${editingLand.id}`, formData);
      } else {
        await axios.post(`${API}/admin/lands`, formData);
      }
      fetchLands();
      setShowModal(false);
    } catch (error) {
      alert('Erro ao salvar terreno');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este terreno?')) {
      try {
        await axios.delete(`${API}/admin/lands/${id}`);
        fetchLands();
      } catch (error) {
        alert('Erro ao excluir terreno');
      }
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e0e0e0' }}>
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src="/logo.jpg" alt="JM Engenharia" className="h-10 w-auto object-contain" />
            <h1 className="text-2xl font-bold" style={{ color: '#00537C' }}>Gerenciar Terrenos</h1>
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

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-700">{lands.length} terrenos cadastrados</p>
          <Button
            onClick={() => openModal()}
            className="flex items-center gap-2 text-white"
            style={{ backgroundColor: '#00537C' }}
          >
            <Plus size={20} />
            Adicionar Terreno
          </Button>
        </div>

        {/* Lands Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lands.map((land) => (
            <Card key={land.id} className="overflow-hidden bg-white">
              <div className="relative h-48">
                <img
                  src={land.image}
                  alt={land.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-1" style={{ color: '#00537C' }}>
                  {land.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{land.location}</p>
                <p className="text-gray-700 text-sm mb-2">Área: {land.area}</p>
                <p className="font-bold" style={{ color: '#00537C' }}>{land.price}</p>
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() => openModal(land)}
                    variant="outline"
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Edit size={16} />
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleDelete(land.id)}
                    variant="outline"
                    className="flex items-center justify-center text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="bg-white p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold" style={{ color: '#00537C' }}>
                {editingLand ? 'Editar Terreno' : 'Adicionar Terreno'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Nome do Terreno</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label>Localização</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label>Descrição</Label>
                <textarea
                  className="w-full p-2 border rounded-lg"
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Área</Label>
                  <Input
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    placeholder="500m²"
                    required
                  />
                </div>

                <div>
                  <Label>Preço</Label>
                  <Input
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="R$ 150.000"
                    required
                  />
                </div>
              </div>

              <div>
                <Label>URL da Imagem</Label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 text-white"
                  style={{ backgroundColor: '#00537C' }}
                >
                  {editingLand ? 'Salvar Alterações' : 'Adicionar Terreno'}
                </Button>
                <Button type="button" onClick={() => setShowModal(false)} variant="outline">
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminLands;
