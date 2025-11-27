import React from 'react';
import { Facebook, Instagram, Youtube, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1">
            <div className="mb-4">
              <img 
                src="/logo.jpg" 
                alt="Cury Logo" 
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Uma das maiores construtoras do país. Há 59 anos comprometidos na realização de grandes conquistas.
            </p>
          </div>

          {/* Institucional */}
          <div>
            <h3 className="font-bold mb-4" style={{ color: '#00537C' }}>Institucional</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-[#00537C] transition-colors text-sm">
                  Conheça a Cury
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#00537C] transition-colors text-sm">
                  TV Cury
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#00537C] transition-colors text-sm">
                  Relações com Investidores
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#00537C] transition-colors text-sm">
                  Trabalhe conosco
                </a>
              </li>
            </ul>
          </div>

          {/* Serviços */}
          <div>
            <h3 className="font-bold mb-4" style={{ color: '#00537C' }}>Serviços</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-[#00537C] transition-colors text-sm">
                  Simule seu financiamento
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#00537C] transition-colors text-sm">
                  Análise de Crédito
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#00537C] transition-colors text-sm">
                  Corretor Online
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#00537C] transition-colors text-sm">
                  Área do Cliente
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-bold mb-4" style={{ color: '#00537C' }}>Redes Sociais</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:shadow-lg"
                style={{ backgroundColor: '#00537C' }}
              >
                <Facebook size={20} className="text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:shadow-lg"
                style={{ backgroundColor: '#00537C' }}
              >
                <Instagram size={20} className="text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:shadow-lg"
                style={{ backgroundColor: '#00537C' }}
              >
                <Youtube size={20} className="text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:shadow-lg"
                style={{ backgroundColor: '#00537C' }}
              >
                <Linkedin size={20} className="text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">
            © 2024 Cury Construtora. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-600 hover:text-[#00537C] transition-colors">
              Política de Privacidade
            </a>
            <a href="#" className="text-gray-600 hover:text-[#00537C] transition-colors">
              Política de Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
