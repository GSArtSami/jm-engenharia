import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SimulationButton from '../components/SimulationButton';
import WhatsAppButton from '../components/WhatsAppButton';
import ScheduleMeetingButton from '../components/ScheduleMeetingButton';
import { Card } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Search, Home, MapPin, Bed, Image } from 'lucide-react';
import { Button } from '../components/ui/button';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const PropertiesPage = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedBedrooms, setSelectedBedrooms] = useState('all');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 12;

  const bedroomOptions = [
    { id: 'all', name: 'Todos' },
    { id: '1', name: '1 Quarto' },
    { id: '2', name: '2 Quartos' },
    { id: '3', name: '3 Quartos' }
  ];

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/properties`);
      setProperties(response.data);
      setFilteredProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = properties;

    if (selectedBedrooms !== 'all') {
      filtered = filtered.filter(
        (prop) => prop.bedrooms?.toString() === selectedBedrooms
      );
    }

    setFilteredProperties(filtered);
    setCurrentPage(1);
  }, [selectedBedrooms, properties]);

  // Pagination
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = filteredProperties.slice(
    indexOfFirstProperty,
    indexOfLastProperty
  );
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  const getImageUrl = (property) => {
    if (property.images && property.images.length > 0) {
      const img = property.images[0];
      return img.startsWith('/api') ? `${BACKEND_URL}${img}` : img;
    }
    if (property.image) {
      return property.image.startsWith('/api') ? `${BACKEND_URL}${property.image}` : property.image;
    }
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#e0e0e0' }}>
      <Header />

      {/* Search Section */}
      <div className="bg-white shadow-sm py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: '#00537C' }}>
            Casas Prontas
          </h2>
          
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Dormitórios */}
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2" style={{ color: '#2c3e50' }}>
                  Número de Dormitórios
                </label>
                <Select value={selectedBedrooms} onValueChange={setSelectedBedrooms}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {bedroomOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  className="w-full md:w-auto px-8 py-3 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg flex items-center gap-2"
                  style={{ backgroundColor: '#00537C' }}
                >
                  <Search size={20} />
                  Buscar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-8 flex-grow">
        <p className="text-gray-600 mb-6">
          {filteredProperties.length} imóveis encontrados
        </p>

        {loading ? (
          <div className="text-center py-16 text-gray-500">Carregando imóveis...</div>
        ) : filteredProperties.length === 0 ? (
          <Card className="p-12 text-center bg-white">
            <Home size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg mb-2">Nenhum imóvel disponível no momento</p>
            <p className="text-gray-400">Entre em contato conosco para mais informações.</p>
          </Card>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentProperties.map((property) => (
                <Card 
                  key={property.id} 
                  className="bg-white overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/imoveis/${property.id}`)}
                >
                  <div className="aspect-video bg-gray-100 relative">
                    {getImageUrl(property) ? (
                      <img
                        src={getImageUrl(property)}
                        alt={property.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image size={48} className="text-gray-300" />
                      </div>
                    )}
                    {property.badge && (
                      <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        {property.badge}
                      </span>
                    )}
                    {property.images && property.images.length > 1 && (
                      <span className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                        +{property.images.length - 1} fotos
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1" style={{ color: '#00537C' }}>
                      {property.name}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                      <MapPin size={14} />
                      {property.location}
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                      <Bed size={14} />
                      {property.bedrooms} {property.bedrooms === 1 ? 'quarto' : 'quartos'}
                    </div>
                    <p className="font-bold text-xl" style={{ color: '#00537C' }}>
                      {property.propertyValue}
                    </p>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <span className="flex items-center px-4 text-gray-600">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
      <SimulationButton />
      <WhatsAppButton />
      <ScheduleMeetingButton />
    </div>
  );
};

export default PropertiesPage;
