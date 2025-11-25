import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Building2, Tv, TrendingUp, AlertCircle, Briefcase, CreditCard, MapPin, Calculator, Users } from 'lucide-react';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="flex flex-col gap-0.5">
              <div className="flex gap-0.5">
                <div className="w-1 h-1.5" style={{ backgroundColor: '#00537C' }}></div>
                <div className="w-1 h-1.5" style={{ backgroundColor: '#00537C' }}></div>
                <div className="w-1 h-1.5" style={{ backgroundColor: '#00537C' }}></div>
              </div>
              <div className="flex gap-0.5">
                <div className="w-1 h-1.5" style={{ backgroundColor: '#00537C' }}></div>
                <div className="w-1 h-1.5" style={{ backgroundColor: '#00537C' }}></div>
                <div className="w-1 h-1.5" style={{ backgroundColor: '#00537C' }}></div>
              </div>
              <div className="flex gap-0.5">
                <div className="w-1 h-2" style={{ backgroundColor: '#00537C' }}></div>
                <div className="w-1 h-2" style={{ backgroundColor: '#00537C' }}></div>
                <div className="w-1 h-2" style={{ backgroundColor: '#00537C' }}></div>
              </div>
            </div>
            <span className="text-2xl font-bold" style={{ color: '#00537C' }}>CURY</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <div className="relative group">
              <button
                className="px-4 py-2 font-medium transition-colors duration-200 hover:bg-gray-50 rounded-lg flex items-center gap-2"
                style={{ color: '#00537C' }}
              >
                Imóveis
                <ChevronDown size={16} />
              </button>
              <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-lg py-2 min-w-[180px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <button
                  onClick={() => navigate('/imoveis/sp')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                  style={{ color: '#2c3e50' }}
                >
                  São Paulo
                </button>
                <button
                  onClick={() => navigate('/imoveis/rj')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                  style={{ color: '#2c3e50' }}
                >
                  Rio de Janeiro
                </button>
              </div>
            </div>
            <a
              href="#simulacao"
              className="px-4 py-2 font-medium transition-colors duration-200 hover:bg-gray-50 rounded-lg"
              style={{ color: '#00537C' }}
            >
              Simulação
            </a>
            <a
              href="#sobre"
              className="px-4 py-2 font-medium transition-colors duration-200 hover:bg-gray-50 rounded-lg"
              style={{ color: '#00537C' }}
            >
              Sobre a Cury
            </a>
            <button
              className="px-6 py-2 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg"
              style={{ backgroundColor: '#00537C' }}
            >
              Área do Cliente
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ color: '#00537C' }}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-2">
              <div className="px-4 py-2">
                <p className="text-xs font-semibold text-gray-500 mb-2">IMÓVEIS</p>
                <button
                  className="w-full px-4 py-2 font-medium text-left transition-colors duration-200 hover:bg-gray-50 rounded-lg"
                  style={{ color: '#00537C' }}
                  onClick={() => {
                    navigate('/imoveis/sp');
                    setMenuOpen(false);
                  }}
                >
                  São Paulo
                </button>
                <button
                  className="w-full px-4 py-2 font-medium text-left transition-colors duration-200 hover:bg-gray-50 rounded-lg"
                  style={{ color: '#00537C' }}
                  onClick={() => {
                    navigate('/imoveis/rj');
                    setMenuOpen(false);
                  }}
                >
                  Rio de Janeiro
                </button>
              </div>
              <a
                href="#simulacao"
                className="px-4 py-3 font-medium transition-colors duration-200 hover:bg-gray-50 rounded-lg"
                style={{ color: '#00537C' }}
                onClick={() => setMenuOpen(false)}
              >
                Simulação
              </a>
              <a
                href="#sobre"
                className="px-4 py-3 font-medium transition-colors duration-200 hover:bg-gray-50 rounded-lg"
                style={{ color: '#00537C' }}
                onClick={() => setMenuOpen(false)}
              >
                Sobre a Cury
              </a>
              <button
                className="mx-4 mt-2 px-6 py-3 text-white font-medium rounded-lg transition-all duration-200"
                style={{ backgroundColor: '#00537C' }}
              >
                Área do Cliente
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
