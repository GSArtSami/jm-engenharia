import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import SimulationButton from '../components/SimulationButton';
import ScheduleMeetingButton from '../components/ScheduleMeetingButton';
import { Card } from '../components/ui/card';
import { Home, MapPin, Hammer, Calculator } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  const options = [
    {
      id: 'ready-houses',
      title: 'Casas Prontas',
      description: 'Imoveis prontos para morar',
      icon: Home,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
      action: () => navigate('/imoveis')
    },
    {
      id: 'land',
      title: 'Terrenos',
      description: 'Terrenos disponiveis',
      icon: MapPin,
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
      action: () => navigate('/terrenos')
    },
    {
      id: 'construction-land',
      title: 'Construcao + Terreno',
      description: 'Construa seu imovel do zero',
      icon: Hammer,
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop',
      action: () => navigate('/construcao')
    },
    {
      id: 'simulation',
      title: 'Simulacao de Financiamento',
      description: 'Calcule suas parcelas',
      icon: Calculator,
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=600&fit=crop',
      action: () => navigate('/simulacao')
    }
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#e0e0e0' }}>
      <Header />

      {/* Hero Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6" style={{ color: '#00537C' }}>
              Bem-vindo à JM Engenharia
            </h1>
            <p className="text-xl text-gray-700 mb-2">
              Escolha uma das opções abaixo para começar:
            </p>
          </div>
        </div>
      </div>

      {/* Options Grid */}
      <div className="container mx-auto px-4 py-16 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {options.map((option) => {
            const Icon = option.icon;
            return (
              <Card
                key={option.id}
                className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group bg-white"
                onClick={option.action}
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={option.image}
                    alt={option.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#00537C' }}
                      >
                        <Icon size={24} className="text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-white">{option.title}</h2>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-700 text-lg">{option.description}</p>
                  <div className="mt-4 flex items-center gap-2" style={{ color: '#00537C' }}>
                    <span className="font-medium">Saiba mais</span>
                    <span className="group-hover:translate-x-2 transition-transform duration-200">→</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
      <SimulationButton />
      <ScheduleMeetingButton />
    </div>
  );
};

export default HomePage;
