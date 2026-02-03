import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { X, ChevronLeft, ChevronRight, MapPin, Bed, Home } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Se você não tiver um componente Button/Card pronto, use tags HTML normais ou ajuste os imports
const BACKEND_URL = "https://jm-engenharia-api.onrender.com";

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para a Galeria
  const [showGallery, setShowGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  // Funções da Galeria
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  if (!property) return <div className="min-h-screen flex items-center justify-center">Imóvel não encontrado.</div>;

  const images = property.images || [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* LADO ESQUERDO: IMAGEM PRINCIPAL */}
          <div 
            className="rounded-xl overflow-hidden shadow-lg cursor-pointer bg-white"
            onClick={() => images.length > 0 && setShowGallery(true)}
          >
            {images.length > 0 ? (
              <img 
                src={images[0].startsWith('http') ? images[0] : `${BACKEND_URL}${images[0]}`} 
                alt={property.title} 
                className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-[400px] flex items-center justify-center bg-gray-200">
                <Home size={64} className="text-gray-400" />
              </div>
            )}
            {images.length > 1 && (
              <p className="text-center py-2 text-sm text-gray-500 font-medium">
                Clique para ver mais {images.length} fotos
              </p>
            )}
          </div>

          {/* LADO DIREITO: INFORMAÇÕES */}
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
            <h1 className="text-3xl font-bold text-blue-900 mb-4">{property.title}</h1>
            
            <div className="flex flex-col gap-3 mb-6">
              <p className="flex items-center gap-2 text-gray-600">
                <MapPin size={20} className="text-blue-500" /> {property.location}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <Bed size={20} className="text-blue-500" /> {property.bedrooms} quartos
              </p>
            </div>
            
            <div className="border-t border-gray-100 py-6">
               <h3 className="font-bold text-lg mb-3 text-gray-800">Descrição</h3>
               <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>

            <div className="mt-auto">
              <p className="text-3xl font-extrabold text-green-600 mb-6">
                {property.price?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
              
              <button
                onClick={() => navigate('/agendar')}
                className="w-full py-4 bg-[#00537C] hover:bg-[#003d5c] text-white font-bold text-lg rounded-lg transition-colors shadow-lg"
              >
                Agendar Visita
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Full Screen Gallery Modal */}
      {showGallery && images.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
          <button
            onClick={() => setShowGallery(false)}
            className="absolute top-6 right-6 text-white p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={32} />
          </button>
          
          <button
            onClick={prevImage}
            className="absolute left-4 text-white p-3 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronLeft size={48} />
          </button>
          
          <img
            src={images[currentImageIndex].startsWith('http') ? images[currentImageIndex] : `${BACKEND_URL}${images[currentImageIndex]}`}
            alt={`${property.title} - ${currentImageIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain shadow-2xl"
          />
          
          <button
            onClick={nextImage}
            className="absolute right-4 text-white p-3 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronRight size={48} />
          </button>
          
          <div className="absolute bottom-8 text-white font-medium bg-black/50 px-4 py-2 rounded-full">
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PropertyDetailPage;
