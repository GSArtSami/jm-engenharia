import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SimulationButton from '../components/SimulationButton';
import WhatsAppButton from '../components/WhatsAppButton';
import ScheduleMeetingButton from '../components/ScheduleMeetingButton';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowLeft, MapPin, Ruler, Home, ChevronLeft, ChevronRight, X, Image } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ConstructionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [construction, setConstruction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    fetchConstruction();
  }, [id]);

  const fetchConstruction = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/constructions`);
      const found = response.data.find(c => c.id === id);
      setConstruction(found);
    } catch (error) {
      console.error('Error fetching construction:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return null;
    return url.startsWith('/api') ? `${BACKEND_URL}${url}` : url;
  };

  const images = construction?.images?.length > 0 
    ? construction.images 
    : (construction?.image ? [construction.image] : []);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#e0e0e0' }}>
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-500">Carregando...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!construction) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#e0e0e0' }}>
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <Card className="p-8 text-center bg-white">
            <p className="text-gray-500 mb-4">Projeto não encontrado</p>
            <Button onClick={() => navigate('/construcao')} variant="outline">
              Voltar para Construções
            </Button>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#e0e0e0' }}>
      <Header />

      <div className="container mx-auto px-4 py-8 flex-grow">
        <Button
          onClick={() => navigate('/construcao')}
          variant="outline"
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Voltar para Construções
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            <Card className="overflow-hidden bg-white">
              <div className="aspect-video relative bg-gray-100">
                {images.length > 0 ? (
                  <>
                    <img
                      src={getImageUrl(images[currentImageIndex])}
                      alt={construction.name}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setShowGallery(true)}
                    />
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                        >
                          <ChevronRight size={24} />
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                          {currentImageIndex + 1} / {images.length}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image size={64} className="text-gray-300" />
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded overflow-hidden border-2 ${
                        index === currentImageIndex ? 'border-blue-500' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={getImageUrl(img)}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Construction Info */}
          <div>
            <Card className="p-6 bg-white">
              <h1 className="text-3xl font-bold mb-4" style={{ color: '#00537C' }}>
                {construction.name}
              </h1>

              <div className="flex items-center gap-2 text-gray-600 mb-6">
                <MapPin size={18} />
                <span>{construction.location}</span>
              </div>

              {construction.description && (
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-2" style={{ color: '#00537C' }}>
                    Descrição
                  </h3>
                  <p className="text-gray-600">{construction.description}</p>
                </div>
              )}

              {/* Details */}
              <div className="space-y-4 mb-6">
                <h3 className="font-bold text-lg" style={{ color: '#00537C' }}>
                  Detalhes do Projeto
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <Ruler size={16} />
                      Área do Terreno
                    </div>
                    <p className="font-bold" style={{ color: '#00537C' }}>{construction.landArea}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <Home size={16} />
                      Área Construída
                    </div>
                    <p className="font-bold" style={{ color: '#00537C' }}>{construction.builtArea}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm mb-1">Valor do Terreno</p>
                    <p className="font-bold" style={{ color: '#00537C' }}>{construction.landPrice}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm mb-1">Valor da Construção</p>
                    <p className="font-bold" style={{ color: '#00537C' }}>{construction.constructionPrice}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <p className="text-gray-500 text-sm mb-1">Valor Total</p>
                <p className="text-4xl font-bold" style={{ color: '#00537C' }}>
                  {construction.totalPrice}
                </p>
              </div>

              <div className="mt-6 space-y-3">
                <Button
                  onClick={() => navigate('/simulacao')}
                  className="w-full py-6 text-white font-medium text-lg"
                  style={{ backgroundColor: '#00537C' }}
                >
                  Simular Financiamento
                </Button>
                <Button
                  onClick={() => navigate('/agendar')}
                  variant="outline"
                  className="w-full py-6 font-medium text-lg"
                >
                  Agendar Visita
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Full Screen Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <button
            onClick={() => setShowGallery(false)}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
          >
            <X size={32} />
          </button>
          
          <button
            onClick={prevImage}
            className="absolute left-4 text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
          >
            <ChevronLeft size={40} />
          </button>
          
          <img
            src={getImageUrl(images[currentImageIndex])}
            alt={construction.name}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
          
          <button
            onClick={nextImage}
            className="absolute right-4 text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
          >
            <ChevronRight size={40} />
          </button>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-lg">
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>
      )}

      <Footer />
      <SimulationButton />
      <WhatsAppButton />
      <ScheduleMeetingButton />
    </div>
  );
};

export default ConstructionDetailPage;
