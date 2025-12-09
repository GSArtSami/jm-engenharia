import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator } from 'lucide-react';

const SimulationButton = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-8 left-8 z-50">
      <button
        onClick={() => navigate('/simulacao')}
        className="px-6 py-4 text-white font-medium rounded-full shadow-2xl transition-all duration-300 hover:shadow-3xl hover:scale-105 flex items-center gap-3"
        style={{ backgroundColor: '#00537C' }}
      >
        <Calculator size={24} />
        <span className="text-lg">Faça sua simulação</span>
      </button>
    </div>
  );
};

export default SimulationButton;
