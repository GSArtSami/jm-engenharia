import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header'; // Verifique se é 'components' ou 'componentes'
import Footer from '../components/Footer';
import { Card } from '../components/ui/card';
import { MapPin, Bed, Home } from 'lucide-react';

const BACKEND_URL = "https://jm-engenharia-api.onrender.com";

const PropertiesPage = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/properties`);
        setProperties(response.data);
      } catch (error) {
        console.error('Erro ao buscar imóveis:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h2 className="text-3xl font-bold mb-6 text-blue-900 text-center">Casas Prontas</h2>
        
        {loading ? (
          <div className="text-center py-10 text-gray-500 font-medium">Carregando imóveis...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Card 
                key={property._id || property.id} 
                className="bg-white overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => navigate(`/imoveis/${property._id || property.id}`)}
              >
                {/* ÁREA DA IMAGEM */}
                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                  {property.images && property.images.length > 0 ? (
                    <img 
                      src={property.images[0].startsWith('http') ? property.images[0] : `${BACKEND_URL}${property.images[0]}`}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Home size={40} />
                    </div>
                  )}
                </div>

                {/* CONTEÚDO */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-blue-900 mb-2 truncate">{property.title}</h3>
                  <div className="flex items-center gap-1 text-gray-500 text-sm mb-1">
                    <MapPin size={14} className="text-blue-500" /> {property.location}
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                    <Bed size={14} className="text-blue-500" /> {property.bedrooms} {property.bedrooms === 1 ? 'quarto' : 'quartos'}
                  </div>
                  <div className="border-t pt-3">
                    <p className="font-bold text-xl text-green-600">
                      {typeof property.price === 'number' 
                        ? property.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) 
                        : property.price}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PropertiesPage;
