'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
      showToast('Vera dünyasına hoş geldiniz! Özel e-posta onayınız gönderildi.', 'success');
      setEmail('');
    }
  };

  return (
    <section className="py-20 bg-[#E8DED1] text-[#242321] border-t border-[#E6DFD5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="w-12 h-12 rounded-full bg-[#242321] text-[#B49A6A] mx-auto flex items-center justify-center shadow-lg">
          <Mail className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-[0.3em] text-[#B49A6A] font-semibold">
            ÖZEL DAVET
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal">
            Vera Dünyasına Katılın
          </h2>
          <p className="text-xs sm:text-sm text-[#5A5652] max-w-lg mx-auto leading-relaxed">
            Yeni sezon Milano koleksiyonlarından, sınırlı sayıda üretilen kapsül serilerden ve size özel stil önerilerinden ilk siz haberdar olun.
          </p>
        </div>

        {isSubmitted ? (
          <div className="p-6 bg-[#F8F5EF] border border-[#B49A6A] max-w-md mx-auto flex items-center justify-center gap-3 text-emerald-800 font-medium text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Tebrikler! Bülten kaydınız başarıyla tamamlandı.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto">
            <input
              type="email"
              required
              placeholder="E-posta adresiniz..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full sm:flex-1 py-3.5 px-5 bg-[#F8F5EF] border border-[#E6DFD5] text-sm text-[#242321] placeholder-[#8C857B] focus:outline-none focus:border-[#B49A6A]"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#242321] text-[#F8F5EF] text-xs font-semibold uppercase tracking-widest hover:bg-[#B49A6A] transition-colors shadow-md"
            >
              Katılın
            </button>
          </form>
        )}

        <p className="text-[11px] text-[#8C857B]">
          Kaydolarak <a href="/kurumsal/gizlilik-ve-cerez" className="underline hover:text-[#242321]">Gizlilik Politikamızı</a> ve KVKK aydınlatma metnini kabul etmiş olursunuz.
        </p>
      </div>
    </section>
  );
}
