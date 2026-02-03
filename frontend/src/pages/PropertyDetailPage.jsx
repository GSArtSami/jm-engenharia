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
            
            <button className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold">
              Agendar Visita
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyDetailPage;
