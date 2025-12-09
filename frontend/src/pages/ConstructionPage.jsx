import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SimulationButton from '../components/SimulationButton';
import WhatsAppButton from '../components/WhatsAppButton';
import ScheduleMeetingButton from '../components/ScheduleMeetingButton';
import { Hammer } from 'lucide-react';

const ConstructionPage = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#e0e0e0' }}>
      <Header />

      <div className="container mx-auto px-4 py-16 flex-grow">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: '#00537C' }}
          >
            <Hammer size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#00537C' }}>
            Construção + Terreno
          </h1>
          <p className="text-gray-700 text-lg mb-8">
            Construa o imóvel dos seus sonhos do zero.
          </p>
          <div className="bg-white p-12 rounded-lg shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=400&fit=crop"
              alt="Construção"
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
            <p className="text-gray-600">
              Entre em contato conosco para mais informações sobre nossos projetos de construção.
            </p>
          </div>
        </div>
      </div>

      <Footer />
      <SimulationButton />
      <WhatsAppButton />
      <ScheduleMeetingButton />
    </div>
  );
};

export default ConstructionPage;
