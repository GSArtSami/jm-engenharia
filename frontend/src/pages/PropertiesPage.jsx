import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PropertyCard from '../components/PropertyCard';
import { properties, zones, bedroomOptions } from '../mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Search } from 'lucide-react';
import { Button } from '../components/ui/button';

const PropertiesPage = () => {
  const { region } = useParams();
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedZone, setSelectedZone] = useState('all');
  const [selectedBedrooms, setSelectedBedrooms] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 12;

  useEffect(() => {
    let filtered = properties.filter((prop) => prop.region === region);

    if (selectedZone !== 'all') {
      filtered = filtered.filter((prop) => prop.zone === selectedZone);
    }

    if (selectedBedrooms !== 'all') {
      filtered = filtered.filter(
        (prop) => prop.bedrooms.toString() === selectedBedrooms
      );
    }

    setFilteredProperties(filtered);
    setCurrentPage(1);
  }, [region, selectedZone, selectedBedrooms]);

  // Pagination
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = filteredProperties.slice(
    indexOfFirstProperty,
    indexOfLastProperty
  );
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f5f7f9' }}>
      <Header />

      {/* Search Section */}
      <div className="bg-white shadow-sm py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: '#00537C' }}>
            Encontre seu imóvel
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Estado */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2c3e50' }}>
                  Estado
                </label>
                <Select value={region} disabled>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sp">São Paulo</SelectItem>
                    <SelectItem value="rj">Rio de Janeiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Região */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2c3e50' }}>
                  Região
                </label>
                <Select value={selectedZone} onValueChange={setSelectedZone}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione a região" />
                  </SelectTrigger>
                  <SelectContent>
                    {zones
                      .filter((zone) => zone.region === region)
                      .map((zone) => (
                        <SelectItem key={zone.id} value={zone.id}>
                          {zone.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Dormitórios */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#2c3e50' }}>
                  Dormitórios
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
            </div>

            <div className="flex justify-center mt-6">
              <Button
                className="px-8 py-3 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg flex items-center gap-2"
                style={{ backgroundColor: '#00537C' }}
              >
                <Search size={20} />
                Buscar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="container mx-auto px-4 py-12 flex-grow">
        <h3 className="text-2xl font-bold mb-8" style={{ color: '#00537C' }}>
          Destaques em {region === 'sp' ? 'São Paulo' : 'Rio de Janeiro'}
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
                  Imóveis com a qualidade Cury
                </h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  A Cury Construtora iniciou sua história em 7 de maio de 1963 e desde o início
                  tem o objetivo de buscar sempre melhorias e inovações constantes.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Com 59 anos de experiência, a Cury se consolidou como uma das maiores
                  construtoras do país, comprometida na realização de grandes conquistas.
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

      {/* Simulation Section */}
      <div className="py-16" style={{ backgroundColor: '#E8EDF1' }} id="simulacao">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-4" style={{ color: '#00537C' }}>
              Faça uma simulação
            </h3>
            <p className="text-gray-700 mb-8">
              Quer uma rápida previsão de como pagar seu imóvel? Faça uma simulação:
            </p>
            <Button
              className="px-8 py-4 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-xl text-lg"
              style={{ backgroundColor: '#00537C' }}
            >
              Iniciar simulação
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PropertiesPage;
