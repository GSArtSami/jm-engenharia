import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';

const ScheduleMeetingButton = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-24 left-8 z-50">
      <button
        onClick={() => navigate('/agendar')}
        className="px-6 py-4 text-white font-medium rounded-full shadow-2xl transition-all duration-300 hover:shadow-3xl hover:scale-105 flex items-center gap-3"
        style={{ backgroundColor: '#00537C' }}
      >
        <Calendar size={24} />
        <span className="text-lg">Agendar Reunião</span>
      </button>
    </div>
  );
};

export default ScheduleMeetingButton;
