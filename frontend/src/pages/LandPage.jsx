import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SimulationButton from '../components/SimulationButton';
import WhatsAppButton from '../components/WhatsAppButton';
import ScheduleMeetingButton from '../components/ScheduleMeetingButton';
import { Card } from '../components/ui/card';
import { MapPin, Ruler, Image } from 'lucide-react';

const BACKEND_URL = "https://jm-engenharia-api.onrender.com";

const LandPage = () => {
  const navigate = useNavigate();
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLands();
  }, []);

  const fetchLands = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/lands`);
      setLands(response.data);
    } catch (error) {
      console.error('Error fetching lands:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (land) => {
    if (land.images && land.images.length > 0) {
      const img = land.images[0];
      return img.startsWith('/api') ? `${BACKEND_URL}${img}` : img;
    }
    if (land.image) {
      return land.image.startsWith('/api') ? `${BACKEND_URL}${land.image}` : land.image;
    }
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#e0e0e0' }}>
      <Header />

      <div className="bg-white shadow-sm py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: '#00537C' }}
            >
              <MapPin size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#00537C' }}>
              Terrenos Disponíveis
            </h1>
            <p className="text-gray-600">
              Encontre o terreno ideal para construir o imóvel dos seus sonhos
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex-grow">
        {loading ? (
          <div className="text-center py-16 text-gray-500">Carregando terrenos...</div>
        ) : lands.length === 0 ? (
          <Card className="p-12 text-center bg-white max-w-2xl mx-auto">
            <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg mb-2">Nenhum terreno disponível no momento</p>
            <p className="text-gray-400">Entre em contato conosco para mais informações.</p>
          </Card>
        ) : (
          <>
            <p className="text-gray-600 mb-6">{lands.length} terrenos disponíveis</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lands.map((land) => (
                <Card 
                  key={land.id} 
                  className="bg-white overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/terrenos/${land.id}`)}
                >
                  <div className="aspect-video bg-gray-100 relative">
                    {getImageUrl(land) ? (
                      <img
                        src={getImageUrl(land)}
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
                    <h3 className="font-bold text-lg mb-1" style={{ color: '#00537C' }}>
                      {land.name}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                      <MapPin size={14} />
                      {land.location}
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                      <Ruler size={14} />
                      Área: {land.area}
                    </div>
                    {land.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{land.description}</p>
                    )}
                    <p className="font-bold text-xl" style={{ color: '#00537C' }}>
                      {land.price}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
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

export default LandPage;
