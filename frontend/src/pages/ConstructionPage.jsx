import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SimulationButton from '../components/SimulationButton';
import WhatsAppButton from '../components/WhatsAppButton';
import ScheduleMeetingButton from '../components/ScheduleMeetingButton';
import { Card } from '../components/ui/card';
import { Building, MapPin, Ruler, Home, Image } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ConstructionPage = () => {
  const navigate = useNavigate();
  const [constructions, setConstructions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConstructions();
  }, []);

  const fetchConstructions = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/constructions`);
      setConstructions(response.data);
    } catch (error) {
      console.error('Error fetching constructions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (construction) => {
    if (construction.images && construction.images.length > 0) {
      const img = construction.images[0];
      return img.startsWith('/api') ? `${BACKEND_URL}${img}` : img;
    }
    if (construction.image) {
      return construction.image.startsWith('/api') ? `${BACKEND_URL}${construction.image}` : construction.image;
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
              <Building size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#00537C' }}>
              Construção + Terreno
            </h1>
            <p className="text-gray-600">
              Projetos completos com terreno e construção inclusa
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex-grow">
        {loading ? (
          <div className="text-center py-16 text-gray-500">Carregando projetos...</div>
        ) : constructions.length === 0 ? (
          <Card className="p-12 text-center bg-white max-w-2xl mx-auto">
            <Building size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg mb-2">Nenhum projeto disponível no momento</p>
            <p className="text-gray-400">Entre em contato conosco para mais informações sobre nossos projetos de construção.</p>
          </Card>
        ) : (
          <>
            <p className="text-gray-600 mb-6">{constructions.length} projetos disponíveis</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {constructions.map((construction) => (
                <Card key={construction.id} className="bg-white overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gray-100 relative">
                    {getImageUrl(construction) ? (
                      <img
                        src={getImageUrl(construction)}
                        alt={construction.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image size={48} className="text-gray-300" />
                      </div>
                    )}
                    {construction.images && construction.images.length > 1 && (
                      <span className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                        +{construction.images.length - 1} fotos
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2" style={{ color: '#00537C' }}>
                      {construction.name}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                      <MapPin size={14} />
                      {construction.location}
                    </div>
                    
                    {construction.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{construction.description}</p>
                    )}

                    <div className="space-y-2 text-sm border-t pt-3 mt-3">
                      <div className="flex justify-between text-gray-600">
                        <span className="flex items-center gap-1">
                          <Ruler size={14} />
                          Terreno:
                        </span>
                        <span>{construction.landArea} - {construction.landPrice}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span className="flex items-center gap-1">
                          <Home size={14} />
                          Construção:
                        </span>
                        <span>{construction.builtArea} - {construction.constructionPrice}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t">
                      <p className="text-sm text-gray-500">Valor Total</p>
                      <p className="font-bold text-2xl" style={{ color: '#00537C' }}>
                        {construction.totalPrice}
                      </p>
                    </div>
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

export default ConstructionPage;
