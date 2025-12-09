import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PropertyCard from '../components/PropertyCard';
import SimulationButton from '../components/SimulationButton';
import WhatsAppButton from '../components/WhatsAppButton';
import { properties, bedroomOptions } from '../mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Search } from 'lucide-react';
import { Button } from '../components/ui/button';

const PropertiesPage = () => {
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedBedrooms, setSelectedBedrooms] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 12;

  useEffect(() => {
    let filtered = properties;

    if (selectedBedrooms !== 'all' && selectedBedrooms !== 'studio') {
      filtered = filtered.filter(
        (prop) => prop.bedrooms.toString() === selectedBedrooms
      );
    }

    setFilteredProperties(filtered);
    setCurrentPage(1);
  }, [selectedBedrooms]);

  // Pagination
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = filteredProperties.slice(
    indexOfFirstProperty,
    indexOfLastProperty
  );
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  // Filter bedroom options to only show 1, 2, 3
  const bedroomFilterOptions = bedroomOptions.filter(opt => 
    opt.id === 'all' || opt.id === '1' || opt.id === '2' || opt.id === '3'
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#e0e0e0' }}>
      <Header />

      {/* Search Section */}
      <div className="bg-white shadow-sm py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: '#00537C' }}>
            Encontre seu imóvel
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
                    {bedroomFilterOptions.map((option) => (
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

      {/* Properties Grid */}
      <div className="container mx-auto px-4 py-12 flex-grow">
        <h3 className="text-2xl font-bold mb-8" style={{ color: '#00537C' }}>
          Casas Disponíveis
        </h3>

        {currentProperties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={
                      `w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                        currentPage === index + 1
                          ? 'text-white shadow-lg'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`
                    }
                    style={currentPage === index + 1 ? { backgroundColor: '#00537C' } : {}}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">
              Nenhum imóvel encontrado com os filtros selecionados.
            </p>
          </div>
        )}
      </div>

      {/* About Section */}
      <div className="bg-white py-16" id="sobre">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-6" style={{ color: '#00537C' }}>
                  Imóveis com a qualidade JM Engenharia
                </h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  A JM Engenharia é uma empresa comprometida em realizar sonhos através de
                  imóveis de qualidade e projetos personalizados.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Nossa missão é oferecer as melhores condições de financiamento e atendimento
                  personalizado para cada cliente.
                </p>
                <Button
                  className="px-6 py-3 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg"
                  style={{ backgroundColor: '#00537C' }}
                >
                  Saiba mais
                </Button>
              </div>
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop"
                  alt="Cury Building"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <SimulationButton />
      <WhatsAppButton />
    </div>
  );
};

export default PropertiesPage;
