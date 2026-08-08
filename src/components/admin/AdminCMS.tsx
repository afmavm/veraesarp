'use client';

import React, { useState } from 'react';
import { Sparkles, Save, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function AdminCMS() {
  const { showToast } = useToast();
  const [heroTitle, setHeroTitle] = useState('Zarafetin Yeni Yorumu');
  const [heroSubtitle, setHeroSubtitle] = useState('Her stile eşlik eden zamansız %100 saf twill ipek renkleri ve özel İtalyan el dikişleri.');
  const [announcementText, setAnnouncementText] = useState("Tüm Türkiye'ye ₺1.500 Üzeri Ücretsiz Kargo & Özel Hediye Kutusu");

  const handleSaveCMS = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('CMS banner ve içerik güncellemeleri başarıyla kaydedildi!', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-[#2A2825]">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#F8F5EF]">CMS &amp; Banner İçerik Paneli</h1>
          <p className="text-xs text-[#8C857B]">Ana sayfa hero görsellerini, metinlerini ve üst duyuru bandını yönetin.</p>
        </div>
      </div>

      <form onSubmit={handleSaveCMS} className="space-y-6 max-w-3xl">
        {/* Announcement Top Bar */}
        <div className="bg-[#1C1B1A] border border-[#2A2825] p-6 space-y-4">
          <h3 className="font-serif text-lg text-[#B49A6A] flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Üst Duyuru Çubuğu (Announcement Bar)</span>
          </h3>
          <div>
            <label className="block text-xs text-[#8C857B] mb-1">Duyuru Metni</label>
            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className="w-full p-3 bg-[#242321] border border-[#3A3835] text-xs text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none"
            />
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-[#1C1B1A] border border-[#2A2825] p-6 space-y-4">
          <h3 className="font-serif text-lg text-[#B49A6A] flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            <span>Ana Sayfa Hero Banner</span>
          </h3>

          <div>
            <label className="block text-xs text-[#8C857B] mb-1">Hero Ana Başlık</label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full p-3 bg-[#242321] border border-[#3A3835] text-xs text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none font-serif text-base"
            />
          </div>

          <div>
            <label className="block text-xs text-[#8C857B] mb-1">Hero Alt Metin / Paragraf</label>
            <textarea
              rows={3}
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="w-full p-3 bg-[#242321] border border-[#3A3835] text-xs text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-8 py-3.5 bg-[#B49A6A] text-[#F8F5EF] text-xs font-semibold uppercase tracking-widest hover:bg-[#988052] transition-colors flex items-center gap-2 shadow-lg"
        >
          <Save className="w-4 h-4" />
          <span>Değişiklikleri Yayınla</span>
        </button>
      </form>
    </div>
  );
}
