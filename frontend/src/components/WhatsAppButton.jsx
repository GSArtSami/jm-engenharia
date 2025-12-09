import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const phoneNumber = '5538998721022'; // Format: country code + area code + number
  const message = 'Olá, gostaria de mais informações sobre financiamento!';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-4 bg-green-500 hover:bg-green-600 text-white font-medium rounded-full shadow-2xl transition-all duration-300 hover:shadow-3xl hover:scale-105 flex items-center gap-3"
        title="Fale conosco no WhatsApp"
      >
        <MessageCircle size={24} />
        <span className="text-lg">Fale Conosco</span>
      </a>
    </div>
  );
};

export default WhatsAppButton;
