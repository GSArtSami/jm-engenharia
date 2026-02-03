import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BACKEND_URL = "https://jm-engenharia-api.onrender.com";

const PropertyDetailPage = () => {
  const { id } = useParams(); // Pega o ID da URL
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/properties/${id}`);
        setProperty(response.data);
      } catch (error) {
        console.error("Erro ao buscar detalhes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading) return <div>Carregando...</div>;
  if (!property) return <div>Imóvel não encontrado.</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LADO ESQUERDO: IMAGEM (Igual à foto 3) */}
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img 
              src={property.images?.[0] || 'placeholder.jpg'} 
              alt={property.title} 
              className="w-full h-auto"
            />
          </div>

          {/* LADO DIREITO: INFORMAÇÕES */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-blue-900 mb-4">{property.title}</h1>
            <p className="text-gray-600 mb-2">📍 {property.location}</p>
            <p className="text-gray-600 mb-4">🛏️ {property.bedrooms} quartos</p>
            
            <div className="border-t border-b py-4 my-4">
               <h3 className="font-bold text-lg mb-2">Descrição</h3>
               <p className="text-gray-700">{property.description}</p>
            </div>

            <p className="text-3xl font-bold text-green-600 mb-6">
              {property.price?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
            


             <div className="mt-6 space-y-3">
                <Button
                  onClick={() => navigate('/agendar')}
                  className="w-full py-6 text-white font-medium text-lg"
                  style={{ backgroundColor: '#00537C' }}
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
            alt={land.name}
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

export default PropertyDetailPage;
