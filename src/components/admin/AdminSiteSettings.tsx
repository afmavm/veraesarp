'use client';

import React, { useState } from 'react';
import { Save, Building2, Phone, Mail, MapPin, Globe, ShieldCheck, Clock } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';

export default function AdminSiteSettings() {
  const { siteSettings, updateSiteSettings } = useData();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({ ...siteSettings });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(formData);
    showToast('Site ve kurumsal iletişim bilgileri başarıyla güncellendi ve yayına alındı!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-[#2A2825]">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#F8F5EF]">Site &amp; Marka İletişim Ayarları</h1>
          <p className="text-xs text-[#8C857B]">Footer, iletişim, sosyal medya ve müşteri hizmetleri bilgilerini düzenleyin.</p>
        </div>

        <button
          type="submit"
          form="siteSettingsForm"
          className="px-6 py-3 bg-[#B49A6A] text-[#F8F5EF] text-xs font-semibold uppercase tracking-wider hover:bg-[#988052] transition-colors flex items-center justify-center gap-2 shadow-lg"
        >
          <Save className="w-4 h-4" />
          <span>Değişiklikleri Kaydet</span>
        </button>
      </div>

      <form id="siteSettingsForm" onSubmit={handleSubmit} className="space-y-8 text-xs text-[#F8F5EF]">
        {/* 1. Marka & Kurumsal Tanım */}
        <div className="bg-[#1C1B1A] border border-[#2A2825] p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-[#2A2825]">
            <Building2 className="w-4 h-4 text-[#B49A6A]" />
            <h2 className="font-serif text-lg font-normal">Marka Bilgileri &amp; Slogan</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#8C857B] mb-1">Marka / Mağaza Adı *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] font-semibold"
              />
            </div>

            <div>
              <label className="block text-[#8C857B] mb-1">Ücretsiz Kargo Sepet Eşiği (₺)</label>
              <input
                type="number"
                value={formData.freeShippingThreshold}
                onChange={(e) => setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })}
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#8C857B] mb-1">Marka Sloganı / Footer Açıklama Metni *</label>
            <textarea
              rows={3}
              required
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] leading-relaxed"
            />
          </div>
        </div>

        {/* 2. Müşteri Destek & İletişim */}
        <div className="bg-[#1C1B1A] border border-[#2A2825] p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-[#2A2825]">
            <Phone className="w-4 h-4 text-[#B49A6A]" />
            <h2 className="font-serif text-lg font-normal">Müşteri Hizmetleri &amp; Açık Adres</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#8C857B] mb-1">Müşteri Destek Telefonu *</label>
              <input
                type="text"
                required
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
              />
            </div>

            <div>
              <label className="block text-[#8C857B] mb-1">Destek E-Posta Adresi *</label>
              <input
                type="email"
                required
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#8C857B] mb-1">Mağaza Açık Adresi *</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#8C857B] mb-1">Çalışma Saatleri</label>
              <input
                type="text"
                value={formData.workingHours}
                onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
              />
            </div>

            <div>
              <label className="block text-[#8C857B] mb-1">WhatsApp Danışma Hattı</label>
              <input
                type="text"
                value={formData.whatsappPhone}
                onChange={(e) => setFormData({ ...formData, whatsappPhone: e.target.value })}
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
              />
            </div>
          </div>
        </div>

        {/* 3. Sosyal Medya Bağlantıları */}
        <div className="bg-[#1C1B1A] border border-[#2A2825] p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-[#2A2825]">
            <Globe className="w-4 h-4 text-[#B49A6A]" />
            <h2 className="font-serif text-lg font-normal">Sosyal Medya Bağlantıları</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[#8C857B] mb-1">Instagram URL</label>
              <input
                type="text"
                value={formData.instagramUrl}
                onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
              />
            </div>

            <div>
              <label className="block text-[#8C857B] mb-1">Facebook URL</label>
              <input
                type="text"
                value={formData.facebookUrl}
                onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
              />
            </div>

            <div>
              <label className="block text-[#8C857B] mb-1">Pinterest URL</label>
              <input
                type="text"
                value={formData.pinterestUrl}
                onChange={(e) => setFormData({ ...formData, pinterestUrl: e.target.value })}
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-8 py-3 bg-[#B49A6A] text-[#F8F5EF] text-xs font-semibold uppercase tracking-wider hover:bg-[#988052] transition-colors flex items-center gap-2 shadow-xl"
          >
            <Save className="w-4 h-4" />
            <span>Değişiklikleri Yayınla &amp; Kaydet</span>
          </button>
        </div>
      </form>
    </div>
  );
}
