import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Home } from 'lucide-react';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo and Home Button */}
          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <img 
                src="/logo.jpg" 
                alt="JM Engenharia Logo" 
                className="h-12 w-auto object-contain"
              />
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 font-medium transition-colors duration-200 hover:bg-gray-50 rounded-lg border border-gray-200"
              style={{ color: '#00537C' }}
              onClick={() => navigate('/')}
            >
              <Home size={20} />
              <span>Início</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              className="px-4 py-2 font-medium transition-colors duration-200 hover:bg-gray-50 rounded-lg"
              style={{ color: '#00537C' }}
              onClick={() => navigate('/imoveis')}
            >
              Imóveis
            </button>
            <button
              className="px-4 py-2 font-medium transition-colors duration-200 hover:bg-gray-50 rounded-lg"
              style={{ color: '#00537C' }}
              onClick={() => navigate('/simulacao')}
            >
              Simulação
            </button>
            <a
              href="#sobre"
              className="px-4 py-2 font-medium transition-colors duration-200 hover:bg-gray-50 rounded-lg"
              style={{ color: '#00537C' }}
            >
              Sobre JM Engenharia
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
              <button
                className="px-4 py-3 font-medium text-left transition-colors duration-200 hover:bg-gray-50 rounded-lg flex items-center gap-2"
                style={{ color: '#00537C' }}
                onClick={() => {
                  navigate('/');
                  setMenuOpen(false);
                }}
              >
                <Home size={20} />
                Início
              </button>
              <button
                className="px-4 py-3 font-medium text-left transition-colors duration-200 hover:bg-gray-50 rounded-lg"
                style={{ color: '#00537C' }}
                onClick={() => {
                  navigate('/imoveis');
                  setMenuOpen(false);
                }}
              >
                Imóveis
              </button>
              <button
                className="px-4 py-3 font-medium text-left transition-colors duration-200 hover:bg-gray-50 rounded-lg"
                style={{ color: '#00537C' }}
                onClick={() => {
                  navigate('/simulacao');
                  setMenuOpen(false);
                }}
              >
                Simulação
              </button>
              <a
                href="#sobre"
                className="px-4 py-3 font-medium transition-colors duration-200 hover:bg-gray-50 rounded-lg"
                style={{ color: '#00537C' }}
                onClick={() => setMenuOpen(false)}
              >
                Sobre JM Engenharia
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
