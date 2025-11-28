import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { MapPin } from 'lucide-react';

const LandPage = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#e0e0e0' }}>
      <Header />

      <div className="container mx-auto px-4 py-16 flex-grow">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: '#00537C' }}
          >
            <MapPin size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#00537C' }}>
            Terrenos Disponíveis
          </h1>
          <p className="text-gray-700 text-lg mb-8">
            Em breve teremos terrenos disponíveis para você.
          </p>
          <div className="bg-white p-12 rounded-lg shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=400&fit=crop"
              alt="Terrenos"
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
            <p className="text-gray-600">
              Entre em contato conosco para mais informações sobre terrenos disponíveis.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LandPage;
