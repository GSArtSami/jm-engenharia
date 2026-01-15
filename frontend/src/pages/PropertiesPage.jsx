import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header'; 
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
        <h2 className="text-3xl font-bold mb-6 text-blue-900 text-center">Imóveis Disponíveis</h2>
        
        {loading ? (
          <div className="text-center py-10">Carregando...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Card 
                key={property._id || property.id} 
                className="bg-white overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/imoveis/${property._id || property.id}`)}
              >
                <div className="aspect-video bg-gray-200 flex items-center justify-center">
                   {property.images?.length > 0 ? (
                     <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                   ) : (
                     <Home className="text-gray-400" size={40} />
                   )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-blue-900">{property.title}</h3>
                  <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                    <MapPin size={14} /> {property.location}
                  </div>
                  <p className="font-bold text-xl text-green-700 mt-2">
                    {property.price?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || "Consulte"}
                  </p>
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
