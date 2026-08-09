'use client';

import React, { useState } from 'react';
import { WhatsAppIcon } from '@/components/ui/Icons';
import { useData } from '@/context/DataContext';
import { X } from 'lucide-react';

export default function WhatsAppFloatingButton() {
  const { siteSettings } = useData();
  const [isOpen, setIsOpen] = useState(false);

  const cleanPhone = (siteSettings.whatsappPhone || '+905344902557').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    'Merhaba Vera Eşarp, ürünleriniz ve yeni sezon koleksiyonunuz hakkında canlı bilgi almak istiyorum.'
  )}`;

  return (
    // bottom-20 on mobile elevates floating WhatsApp button neatly above MobileNav (z-40), avoiding any overlap with "Hesabım"
    <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end space-y-3 pointer-events-auto">
      {/* Expanded Quick Message Popup Box */}
      {isOpen && (
        <div className="bg-[#1C1B1A] border border-[#B49A6A] p-5 rounded-lg shadow-2xl max-w-xs w-full text-[#F8F5EF] space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between pb-2 border-b border-[#2A2825]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0">
                <WhatsAppIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-semibold">Vera Canlı Destek</h4>
                <span className="text-[10px] text-emerald-400 font-medium">● Çevrimiçi (Yanıt Süresi: Anında)</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#8C857B] hover:text-[#F8F5EF] p-1"
              aria-label="Kapat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-[#242321] p-3 text-xs text-[#E8DED1] leading-relaxed border-l-2 border-[#B49A6A]">
            <p>👋 Merhaba! Vera Eşarp Canlı Müşteri Hizmetlerine Hoş Geldiniz.</p>
            <p className="mt-1 text-[#8C857B]">
              İpek eşarp kargo takibi, özel hediye kutusu veya stok durumu hakkında doğrudan WhatsApp'tan bize yazabilirsiniz.
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white font-semibold text-xs uppercase tracking-wider hover:bg-emerald-500 transition-colors shadow-lg rounded-md"
          >
            <WhatsAppIcon className="w-4 h-4" />
            <span>WhatsApp Sohbeti Başlat</span>
          </a>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95 group relative"
        aria-label="WhatsApp Destek Hattı"
      >
        <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7" />
        <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-20 pointer-events-none" />
      </button>
    </div>
  );
}
