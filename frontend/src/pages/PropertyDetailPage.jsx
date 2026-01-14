import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card } from '../components/ui/card';
import { MapPin, Bed, Image as LucideImage } from 'lucide-react';

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
          <div className="text-center py-10">Carregando imóveis...</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Card 
                key={property._id || property.id} 
                className="bg-white overflow-hidden cursor-pointer"
                onClick={() => navigate(`/imoveis/${property._id || property.id}`)}
              >
                <div className="p-4">
                  <h3 className="font-bold text-lg">{property.title}</h3>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <MapPin size={14} /> {property.location}
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                    <Bed size={14} /> {property.bedrooms} quartos
                  </div>
                  <p className="font-bold text-xl text-blue-800 mt-2">{property.price}</p>
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
