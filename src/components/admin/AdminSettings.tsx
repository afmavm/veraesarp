'use client';

import React, { useState } from 'react';
import { Settings, ShieldCheck, Key, CreditCard, Save } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/data/mock-data';
import { useToast } from '@/context/ToastContext';

export default function AdminSettings() {
  const { showToast } = useToast();
  const [storeName, setStoreName] = useState(SITE_CONFIG.name);
  const [freeShippingLimit, setFreeShippingLimit] = useState(SITE_CONFIG.freeShippingThreshold);
  const [contactEmail, setContactEmail] = useState(SITE_CONFIG.contactEmail);
  const [contactPhone, setContactPhone] = useState(SITE_CONFIG.contactPhone);
  const [iyzicoApiKey, setIyzicoApiKey] = useState('iyzi_sandbox_api_key_8492019482');
  const [iyzicoSecretKey, setIyzicoSecretKey] = useState('iyzi_sandbox_secret_99482019');
  const [isTestMode, setIsTestMode] = useState(true);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Sistem ve API entegrasyon ayarları başarıyla kaydedildi.', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-[#2A2825]">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#F8F5EF]">Sistem &amp; API Yapılandırmaları</h1>
          <p className="text-xs text-[#8C857B]">Ödeme sağlayıcıları, kargo limitleri ve mağaza iletişim bilgilerini yönetin.</p>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6 max-w-3xl">
        {/* Store Settings */}
        <div className="bg-[#1C1B1A] border border-[#2A2825] p-6 space-y-4">
          <h3 className="font-serif text-lg text-[#B49A6A] flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span>Mağaza Temel Bilgileri</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#8C857B] mb-1">Mağaza Adı</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[#8C857B] mb-1">Ücretsiz Kargo Limiti (₺)</label>
              <input
                type="number"
                value={freeShippingLimit}
                onChange={(e) => setFreeShippingLimit(Number(e.target.value))}
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#8C857B] mb-1">Destek E-Posta</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[#8C857B] mb-1">Müşteri Destek Telefon</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Payment Integration */}
        <div className="bg-[#1C1B1A] border border-[#2A2825] p-6 space-y-4">
          <h3 className="font-serif text-lg text-[#B49A6A] flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            <span>İyzico &amp; PayTR Ödeme Entegrasyonu</span>
          </h3>

          <div className="flex items-center gap-3 p-3 bg-[#242321] border border-[#3A3835] text-xs">
            <input
              type="checkbox"
              id="testMode"
              checked={isTestMode}
              onChange={(e) => setIsTestMode(e.target.checked)}
              className="accent-[#B49A6A] w-4 h-4"
            />
            <label htmlFor="testMode" className="text-[#F8F5EF] font-medium cursor-pointer">
              Test / Sandbox Modunu Etkinleştir (Canlı Ödeme Alınmaz)
            </label>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[#8C857B] mb-1">İyzico API Key</label>
              <input
                type="text"
                value={iyzicoApiKey}
                onChange={(e) => setIyzicoApiKey(e.target.value)}
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] font-mono focus:border-[#B49A6A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#8C857B] mb-1">İyzico Secret Key</label>
              <input
                type="password"
                value={iyzicoSecretKey}
                onChange={(e) => setIyzicoSecretKey(e.target.value)}
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] font-mono focus:border-[#B49A6A] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-8 py-3.5 bg-[#B49A6A] text-[#F8F5EF] text-xs font-semibold uppercase tracking-widest hover:bg-[#988052] transition-colors flex items-center gap-2 shadow-lg"
        >
          <Save className="w-4 h-4" />
          <span>Tüm Ayarları Kaydet</span>
        </button>
      </form>
    </div>
  );
}
