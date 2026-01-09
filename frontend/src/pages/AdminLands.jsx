import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { MapPin, Edit, Trash2, Plus, X, LogOut, Upload, Image } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminLands = () => {
  const navigate = useNavigate();
  const [lands, setLands] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingLand, setEditingLand] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    area: '',
    price: '',
    images: []
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
    navigate('/');
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (formData.images.length + files.length > 5) {
      alert('Máximo de 5 fotos por terreno');
      return;
    }

    setUploading(true);
    const uploadedUrls = [];

    for (const file of files) {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      try {
        const response = await axios.post(`${API}/admin/upload`, formDataUpload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        uploadedUrls.push(response.data.url);
      } catch (error) {
        alert(`Erro ao fazer upload de ${file.name}: ${error.response?.data?.detail || 'Erro desconhecido'}`);
      }
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...uploadedUrls]
    }));
    setUploading(false);
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
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
        images: land.images || (land.image ? [land.image] : [])
      });
    } else {
      setEditingLand(null);
      setFormData({
        name: '',
        location: '',
        description: '',
        area: '',
        price: '',
        images: []
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingLand(null);
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
      closeModal();
    } catch (error) {
      alert('Erro ao salvar terreno: ' + (error.response?.data?.detail || 'Erro desconhecido'));
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

  const getImageUrl = (url) => {
    if (!url) return null;
    return url.startsWith('/api') ? `${BACKEND_URL}${url}` : url;
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

      <div className="container mx-auto px-4 py-8">
        {/* Add Button */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">{lands.length} terrenos cadastrados</p>
          <Button 
            onClick={() => openModal()}
            className="flex items-center gap-2 text-white"
            style={{ backgroundColor: '#00537C' }}
          >
            <Plus size={18} />
            Adicionar Terreno
          </Button>
        </div>

        {/* Lands Grid */}
        {lands.length === 0 ? (
          <Card className="p-8 text-center bg-white">
            <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Nenhum terreno cadastrado</p>
            <Button 
              onClick={() => openModal()} 
              className="mt-4 text-white"
              style={{ backgroundColor: '#00537C' }}
            >
              Cadastrar Primeiro Terreno
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lands.map((land) => (
              <Card key={land.id} className="bg-white overflow-hidden">
                <div className="aspect-video bg-gray-100 relative">
                  {land.images && land.images.length > 0 ? (
                    <img
                      src={getImageUrl(land.images[0])}
                      alt={land.name}
                      className="w-full h-full object-cover"
                    />
                  ) : land.image ? (
                    <img
                      src={getImageUrl(land.image)}
                      alt={land.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image size={48} className="text-gray-300" />
                    </div>
                  )}
                  {land.images && land.images.length > 1 && (
                    <span className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                      +{land.images.length - 1} fotos
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1" style={{ color: '#00537C' }}>{land.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{land.location}</p>
                  <p className="text-sm text-gray-600 mb-2">Área: {land.area}</p>
                  <p className="font-bold text-lg mb-3" style={{ color: '#00537C' }}>
                    {land.price}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => openModal(land)}
                      variant="outline"
                      size="sm"
                      className="flex-1 flex items-center justify-center gap-1"
                    >
                      <Edit size={14} />
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleDelete(land.id)}
                      variant="outline"
                      size="sm"
                      className="flex items-center justify-center gap-1 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="bg-white p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold" style={{ color: '#00537C' }}>
                  {editingLand ? 'Editar Terreno' : 'Novo Terreno'}
                </h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    placeholder="Ex: Terreno Plano Vista Mar"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    required
                    placeholder="Ex: Bairro Praia Grande"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                    placeholder="Descreva o terreno..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Área</label>
                    <Input
                      value={formData.area}
                      onChange={(e) => setFormData({...formData, area: e.target.value})}
                      required
                      placeholder="Ex: 500m²"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço</label>
                    <Input
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                      placeholder="Ex: R$ 120.000"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fotos do Terreno (máx. 5)
                  </label>
                  
                  <div className="grid grid-cols-5 gap-2 mb-2">
                    {formData.images.map((url, index) => (
                      <div key={index} className="relative aspect-square">
                        <img
                          src={getImageUrl(url)}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-full object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    
                    {formData.images.length < 5 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="aspect-square border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center hover:border-gray-400 transition-colors"
                      >
                        {uploading ? (
                          <span className="text-xs text-gray-500">Enviando...</span>
                        ) : (
                          <>
                            <Upload size={20} className="text-gray-400" />
                            <span className="text-xs text-gray-500 mt-1">Adicionar</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 text-white" style={{ backgroundColor: '#00537C' }}>
                    {editingLand ? 'Salvar Alterações' : 'Cadastrar Terreno'}
                  </Button>
                  <Button type="button" onClick={closeModal} variant="outline">
                    Cancelar
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLands;
