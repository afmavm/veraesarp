'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Save, Image as ImageIcon, Eye, RefreshCw, Layout, CheckCircle2, Wand2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useData } from '@/context/DataContext';

const PRESETS = [
  {
    name: 'Klasik Zarafet',
    announcement: "Tüm Türkiye'ye ₺1.500 Üzeri Ücretsiz Kargo & Özel Hediye Kutusu",
    heroTitle: 'Zarafetin Yeni Yorumu',
    heroSubtitle: 'Her stile eşlik eden zamansız %100 saf twill ipek renkleri ve özel İtalyan el dikişleri.',
    ctaText: 'Koleksiyonu Keşfet',
    heroImage: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'Sonbahar İpek Festivali',
    announcement: '🍂 Sonbahar İpek Koleksiyonunda Sepette Ekstra %15 İndirim! KOD: SONBAHAR15',
    heroTitle: 'Sonbaharın Sıcak Tonları',
    heroSubtitle: 'Sezonun en seçkin renk paletiyle dokunan saf ipek şal ve eşarplarda sınırlı sayıda özel seri.',
    ctaText: 'Sonbahar Serisini İncele',
    heroImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop',
  },
  {
    name: 'VIP Özel İndirim',
    announcement: '👑 Vera VIP Üyelerine Özel Tüm Siparişlerde Ücretsiz Express Kargo',
    heroTitle: 'Milano Silk Couture 2026',
    heroSubtitle: 'İtalya Como gölü atölyelerinden Erzurum mağazamıza uzanan eşsiz ipek dokuma mirası.',
    ctaText: 'VIP Koleksiyona Git',
    heroImage: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=1200&auto=format&fit=crop',
  },
];

export default function AdminCMS() {
  const { showToast } = useToast();
  const { siteSettings, updateSiteSettings } = useData();

  const [announcementText, setAnnouncementText] = useState(
    "Tüm Türkiye'ye ₺1.500 Üzeri Ücretsiz Kargo & Özel Hediye Kutusu"
  );
  const [heroTitle, setHeroTitle] = useState('Zarafetin Yeni Yorumu');
  const [heroSubtitle, setHeroSubtitle] = useState(
    'Her stile eşlik eden zamansız %100 saf twill ipek renkleri ve özel İtalyan el dikişleri.'
  );
  const [ctaText, setCtaText] = useState('Koleksiyonu Keşfet');
  const [heroImage, setHeroImage] = useState(
    'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=1200&auto=format&fit=crop'
  );
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const savedCMS = localStorage.getItem('veraesarp_cms_settings');
      if (savedCMS) {
        const parsed = JSON.parse(savedCMS);
        if (parsed.announcementText) setAnnouncementText(parsed.announcementText);
        if (parsed.heroTitle) setHeroTitle(parsed.heroTitle);
        if (parsed.heroSubtitle) setHeroSubtitle(parsed.heroSubtitle);
        if (parsed.ctaText) setCtaText(parsed.ctaText);
        if (parsed.heroImage) setHeroImage(parsed.heroImage);
      }
    } catch (e) {}
  }, []);

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    setAnnouncementText(preset.announcement);
    setHeroTitle(preset.heroTitle);
    setHeroSubtitle(preset.heroSubtitle);
    setCtaText(preset.ctaText);
    setHeroImage(preset.heroImage);
    showToast(`✨ "${preset.name}" hazır teması şablona uygulandı!`, 'info');
  };

  const handleSaveCMS = (e: React.FormEvent) => {
    e.preventDefault();
    const cmsData = { announcementText, heroTitle, heroSubtitle, ctaText, heroImage };

    try {
      localStorage.setItem('veraesarp_cms_settings', JSON.stringify(cmsData));
    } catch (e) {}

    updateSiteSettings({
      tagline: heroTitle,
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
    showToast('🚀 CMS banner ve mağaza vitrini başarıyla güncellendi & yayınlandı!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-[#2A2825]">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#F8F5EF]">CMS &amp; Banner İçerik Paneli</h1>
          <p className="text-xs text-[#8C857B]">
            Ana sayfa hero görsellerini, vitrin metinlerini ve üst duyuru bandını canlı yönetin.
          </p>
        </div>

        <button
          onClick={handleSaveCMS}
          className="px-6 py-3 bg-[#B49A6A] text-[#1C1B1A] text-xs font-bold uppercase tracking-wider hover:bg-[#988052] transition-colors flex items-center justify-center gap-2 shadow-lg rounded shrink-0"
        >
          {isSaved ? <CheckCircle2 className="w-4 h-4 text-emerald-950" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? 'Yayında!' : 'Değişiklikleri Yayınla'}</span>
        </button>
      </div>

      {/* Quick Presets */}
      <div className="p-4 bg-[#1C1B1A] border border-[#2A2825] rounded space-y-2">
        <div className="flex items-center gap-2 text-xs text-[#B49A6A] font-semibold">
          <Wand2 className="w-4 h-4" />
          <span>Hazır İçerik Konseptleri &amp; Temaları</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => handleApplyPreset(p)}
              className="px-3 py-1.5 bg-[#242321] border border-[#3A3835] text-xs text-[#E8DED1] hover:border-[#B49A6A] hover:text-[#B49A6A] transition-colors rounded"
            >
              + {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Form + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Controls */}
        <form onSubmit={handleSaveCMS} className="lg:col-span-6 space-y-6">
          {/* Announcement Top Bar */}
          <div className="bg-[#1C1B1A] border border-[#2A2825] p-6 space-y-4 rounded shadow-xl">
            <h3 className="font-serif text-lg text-[#B49A6A] flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Üst Duyuru Bandı (Announcement Bar)</span>
            </h3>
            <div>
              <label className="block text-xs text-[#8C857B] mb-1.5">Duyuru Metni *</label>
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="w-full p-3 bg-[#242321] border border-[#3A3835] text-xs text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none rounded"
              />
            </div>
          </div>

          {/* Hero Section */}
          <div className="bg-[#1C1B1A] border border-[#2A2825] p-6 space-y-4 rounded shadow-xl">
            <h3 className="font-serif text-lg text-[#B49A6A] flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              <span>Ana Sayfa Hero Banner Ayarları</span>
            </h3>

            <div>
              <label className="block text-xs text-[#8C857B] mb-1.5">Hero Ana Başlık *</label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full p-3 bg-[#242321] border border-[#3A3835] text-xs text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none font-serif text-base rounded"
              />
            </div>

            <div>
              <label className="block text-xs text-[#8C857B] mb-1.5">Hero Alt Metin / Paragraf *</label>
              <textarea
                rows={3}
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full p-3 bg-[#242321] border border-[#3A3835] text-xs text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none rounded"
              />
            </div>

            <div>
              <label className="block text-[#8C857B] mb-1.5 text-xs">Buton Metni (CTA)</label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                className="w-full p-3 bg-[#242321] border border-[#3A3835] text-xs text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none rounded"
              />
            </div>

            <div>
              <label className="block text-[#8C857B] mb-1.5 text-xs">Hero Arka Plan Görsel URL / Base64</label>
              <input
                type="text"
                value={heroImage}
                onChange={(e) => setHeroImage(e.target.value)}
                className="w-full p-3 bg-[#242321] border border-[#3A3835] text-xs text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none font-mono rounded"
              />
            </div>
          </div>
        </form>

        {/* Live Preview Box */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between text-xs text-[#8C857B]">
            <span className="flex items-center gap-1.5 font-semibold text-[#B49A6A]">
              <Eye className="w-4 h-4" /> Live Vitrin Canlı Önizleme
            </span>
            <span>Müşteri Görünümü</span>
          </div>

          <div className="border border-[#B49A6A]/40 rounded overflow-hidden shadow-2xl bg-[#1C1B1A]">
            {/* Live Announcement Bar */}
            <div className="bg-[#B49A6A] text-[#1C1B1A] text-[11px] font-medium text-center py-2 px-3 tracking-wide">
              {announcementText || 'Duyuru Metni'}
            </div>

            {/* Simulated Header */}
            <div className="bg-[#171615] px-6 py-4 border-b border-[#2A2825] flex justify-between items-center text-xs">
              <span className="font-serif text-lg tracking-[0.2em] font-semibold text-[#F8F5EF]">VERA EŞARP</span>
              <div className="flex gap-4 text-[#8C857B] text-[11px]">
                <span>EŞARP</span>
                <span>ŞAL</span>
                <span>KOLEKSİYON</span>
              </div>
            </div>

            {/* Live Hero Banner Box */}
            <div className="relative h-80 w-full flex items-center justify-center p-8 text-center overflow-hidden bg-black/60">
              {heroImage && (
                <img
                  src={heroImage}
                  alt="Hero Preview"
                  className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay"
                />
              )}
              <div className="relative z-10 max-w-md space-y-3">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#B49A6A] font-semibold block">
                  İTALYAN TWİLL İPEK DOKUMA
                </span>
                <h2 className="font-serif text-2xl text-[#F8F5EF] leading-tight font-normal">
                  {heroTitle || 'Hero Başlık'}
                </h2>
                <p className="text-xs text-[#E8DED1] leading-relaxed opacity-90">
                  {heroSubtitle || 'Hero Alt Metin'}
                </p>
                <div className="pt-2">
                  <span className="inline-block px-6 py-2.5 bg-[#B49A6A] text-[#1C1B1A] text-xs font-bold uppercase tracking-wider rounded shadow-md">
                    {ctaText || 'Keşfet'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
