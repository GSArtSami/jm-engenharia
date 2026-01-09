import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Home, Edit, Trash2, Plus, X, LogOut } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminProperties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
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
  const [newAmenity, setNewAmenity] = useState({ name: '', icon: 'Home' });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchProperties();
  }, [navigate]);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${API}/admin/properties`);
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  const openModal = (property = null) => {
    if (property) {
      setEditingProperty(property);
      setFormData({
        name: property.name,
        location: property.location,
        description: property.description,
        bedrooms: property.bedrooms,
        badge: property.badge,
        image: property.image,
        propertyValue: property.propertyValue,
        amenities: property.amenities || []
      });
    } else {
      setEditingProperty(null);
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
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProperty) {
        await axios.put(`${API}/admin/properties/${editingProperty.id}`, formData);
      } else {
        await axios.post(`${API}/admin/properties`, formData);
      }
      fetchProperties();
      setShowModal(false);
    } catch (error) {
      alert('Erro ao salvar imóvel');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este imóvel?')) {
      try {
        await axios.delete(`${API}/admin/properties/${id}`);
        fetchProperties();
      } catch (error) {
        alert('Erro ao excluir imóvel');
      }
    }
  };

  const addAmenity = () => {
    if (newAmenity.name && newAmenity.icon) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, newAmenity]
      });
      setNewAmenity({ name: '', icon: 'Home' });
    }
  };

  const removeAmenity = (index) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter((_, i) => i !== index)
    });
  };

  const iconOptions = ['Home', 'Waves', 'Flame', 'Wind', 'Sun', 'Sparkles', 'Dumbbell', 'Baby', 'Dog', 'Wine', 'Film', 'Gamepad2', 'Leaf', 'Shirt', 'Trophy', 'PartyPopper', 'TreePine', 'HeartPulse', 'ShoppingCart', 'Laptop', 'UtensilsCrossed', 'Building2', 'Sofa', 'Bike'];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e0e0e0' }}>
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src="/logo.jpg" alt="JM Engenharia" className="h-10 w-auto object-contain" />
            <h1 className="text-2xl font-bold" style={{ color: '#00537C' }}>Gerenciar Imóveis</h1>
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
          <p className="text-gray-700">{properties.length} imóveis cadastrados</p>
          <Button
            onClick={() => openModal()}
            className="flex items-center gap-2 text-white"
            style={{ backgroundColor: '#00537C' }}
          >
            <Plus size={20} />
            Adicionar Imóvel
          </Button>
        </div>

        {/* Properties Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden bg-white">
              <div className="relative h-48">
                <img
                  src={property.image}
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
                {property.badge && (
                  <div className="absolute top-3 left-3 px-3 py-1 bg-blue-600 text-white text-sm font-medium">
                    {property.badge}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-1" style={{ color: '#00537C' }}>
                  {property.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{property.location}</p>
                <p className="text-gray-700 text-sm mb-2">{property.bedrooms} dormitórios</p>
                <p className="font-bold" style={{ color: '#00537C' }}>{property.propertyValue}</p>
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() => openModal(property)}
                    variant="outline"
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Edit size={16} />
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleDelete(property.id)}
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
                {editingProperty ? 'Editar Imóvel' : 'Adicionar Imóvel'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

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
                  <Label>Número de Dormitórios</Label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) })}
                    required
                  />
                </div>

                <div>
                  <Label>Valor</Label>
                  <Input
                    value={formData.propertyValue}
                    onChange={(e) => setFormData({ ...formData, propertyValue: e.target.value })}
                    placeholder="R$ 210.000"
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Badge</Label>
                <Input
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="Lançamento"
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

              {/* Amenities */}
              <div>
                <Label className="mb-2 block">Comodidades</Label>
                <div className="space-y-2 mb-3">
                  {formData.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm">{amenity.name} ({amenity.icon})</span>
                      <button
                        type="button"
                        onClick={() => removeAmenity(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newAmenity.name}
                    onChange={(e) => setNewAmenity({ ...newAmenity, name: e.target.value })}
                    placeholder="Nome da comodidade"
                  />
                  <select
                    value={newAmenity.icon}
                    onChange={(e) => setNewAmenity({ ...newAmenity, icon: e.target.value })}
                    className="p-2 border rounded-lg"
                  >
                    {iconOptions.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                  <Button type="button" onClick={addAmenity} variant="outline">
                    <Plus size={16} />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 text-white"
                  style={{ backgroundColor: '#00537C' }}
                >
                  {editingProperty ? 'Salvar Alterações' : 'Adicionar Imóvel'}
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

export default AdminProperties;
