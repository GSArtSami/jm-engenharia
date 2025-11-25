import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-2xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-gray-700 text-sm">
              Utilizamos cookies essenciais e tecnologias semelhantes e, ao continuar navegando, você concorda com estas condições.
              {' '}
              Para mais informações, confira nossa{' '}
              <a href="#" className="font-medium hover:underline" style={{ color: '#00537C' }}>
                Política de Privacidade
              </a>
              {' e '}
              <a href="#" className="font-medium hover:underline" style={{ color: '#00537C' }}>
                Política de cookies
              </a>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleAccept}
              className="px-6 py-2 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg whitespace-nowrap"
              style={{ backgroundColor: '#00537C' }}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
