import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { ArrowLeft, Plus, Edit, Trash2, LogOut } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminProperties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    bedrooms: 2,
    badge: 'Lançamento',
    image: '',
    propertyValue: '',
    amenities: []
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${API}/admin/properties`);
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API}/admin/properties/${editingId}`, formData);
      } else {
        await axios.post(`${API}/admin/properties`, formData);
      }
      fetchProperties();
      resetForm();
    } catch (error) {
      console.error('Error saving property:', error);
      alert('Erro ao salvar imóvel');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este imóvel?')) {
      try {
        await axios.delete(`${API}/admin/properties/${id}`);
        fetchProperties();
      } catch (error) {
        console.error('Error deleting property:', error);
      }
    }
  };

  const handleEdit = (property) => {
    setFormData(property);
    setEditingId(property.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      description: '',
      bedrooms: 2,
      badge: 'Lançamento',
      image: '',
      propertyValue: '',
      amenities: []
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e0e0e0' }}>
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/admin/dashboard">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft size={18} />
                Voltar
              </Button>
            </Link>
            <h1 className="text-2xl font-bold" style={{ color: '#00537C' }}>
              Gerenciar Imóveis
            </h1>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut size={18} />
            Sair
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {!showForm ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold" style={{ color: '#00537C' }}>
                Imóveis Cadastrados ({properties.length})
              </h2>
              <Button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 text-white"
                style={{ backgroundColor: '#00537C' }}
              >
                <Plus size={20} />
                Novo Imóvel
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <Card key={property.id} className="overflow-hidden bg-white">
                  <img
                    src={property.image}
                    alt={property.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2" style={{ color: '#00537C' }}>
                      {property.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{property.location}</p>
                    <p className="text-sm text-gray-700 mb-3">{property.description}</p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(property)}
                        variant="outline"
                        size="sm"
                        className="flex-1 flex items-center justify-center gap-1"
                      >
                        <Edit size={16} />
                        Editar
                      </Button>
                      <Button
                        onClick={() => handleDelete(property.id)}
                        variant="outline"
                        size="sm"
                        className="flex-1 flex items-center justify-center gap-1 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                        Excluir
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <Card className="max-w-2xl mx-auto p-8 bg-white">
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#00537C' }}>
              {editingId ? 'Editar Imóvel' : 'Novo Imóvel'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Nome do Imóvel</Label>
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
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Número de Dormitórios</Label>
                <Input
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) })}
                  required
                />
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
              <div>
                <Label>Valor do Imóvel</Label>
                <Input
                  value={formData.propertyValue}
                  onChange={(e) => setFormData({ ...formData, propertyValue: e.target.value })}
                  placeholder="R$ 210.000"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1 text-white"
                  style={{ backgroundColor: '#00537C' }}
                >
                  Salvar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminProperties;