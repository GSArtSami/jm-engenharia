import React from 'react';
import { useNavigate } from 'react-router-dom';
import { regions } from '../mockData';
import { Card } from './ui/card';

const RegionSelector = () => {
  const navigate = useNavigate();

  const handleRegionClick = (regionId) => {
    navigate(`/imoveis/${regionId}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#E8EDF1' }}>
      {/* Logo */}
      <div className="mb-12">
        <div className="flex items-center gap-2">
          <div className="relative">
            {/* Building icon/logo */}
            <div className="flex flex-col gap-0.5">
              <div className="flex gap-0.5">
                <div className="w-1.5 h-2" style={{ backgroundColor: '#00537C' }}></div>
                <div className="w-1.5 h-2" style={{ backgroundColor: '#00537C' }}></div>
                <div className="w-1.5 h-2" style={{ backgroundColor: '#00537C' }}></div>
              </div>
              <div className="flex gap-0.5">
                <div className="w-1.5 h-2" style={{ backgroundColor: '#00537C' }}></div>
                <div className="w-1.5 h-2" style={{ backgroundColor: '#00537C' }}></div>
                <div className="w-1.5 h-2" style={{ backgroundColor: '#00537C' }}></div>
              </div>
              <div className="flex gap-0.5">
                <div className="w-1.5 h-3" style={{ backgroundColor: '#00537C' }}></div>
                <div className="w-1.5 h-3" style={{ backgroundColor: '#00537C' }}></div>
                <div className="w-1.5 h-3" style={{ backgroundColor: '#00537C' }}></div>
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold" style={{ color: '#00537C' }}>CURY</h1>
        </div>
      </div>

      {/* Welcome Text */}
      <div className="max-w-3xl text-center mb-12 px-4">
        <h2 className="text-2xl font-semibold mb-2" style={{ color: '#2c3e50' }}>
          Bem-vindo ao site da Cury! É um prazer ter você por aqui. Escolha abaixo
        </h2>
        <h2 className="text-2xl font-semibold" style={{ color: '#2c3e50' }}>
          sua região e encontre o imóvel ideal para você:
        </h2>
      </div>

      {/* Region Cards */}
      <div className="flex gap-8 flex-wrap justify-center px-4">
        {regions.map((region) => (
          <Card
            key={region.id}
            className="bg-white p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 w-64 h-64 flex flex-col items-center justify-center"
            onClick={() => handleRegionClick(region.id)}
          >
            <div className="mb-6">
              {/* Map icon for region */}
              <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {region.id === 'sp' ? (
                  // São Paulo state shape (simplified)
                  <path
                    d="M60 20 L90 35 L95 50 L90 70 L80 85 L60 90 L40 85 L30 70 L25 50 L30 35 Z"
                    fill="#00537C"
                  />
                ) : (
                  // Rio de Janeiro state shape (simplified)
                  <path
                    d="M50 30 L80 35 L90 45 L85 65 L75 80 L55 85 L40 75 L35 55 L40 40 Z"
                    fill="#00537C"
                  />
                )}
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-center" style={{ color: '#2c3e50' }}>
              {region.name}
            </h3>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RegionSelector;
