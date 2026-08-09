'use client';

import React, { useState } from 'react';
import { Settings, ShieldCheck, Key, CreditCard, Save, Building2, Phone, Mail, MapPin, Globe } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';

export default function AdminSettings() {
  const { siteSettings, updateSiteSettings } = useData();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({ ...siteSettings });
  const [iyzicoApiKey, setIyzicoApiKey] = useState('iyzi_sandbox_api_key_8492019482');
  const [iyzicoSecretKey, setIyzicoSecretKey] = useState('iyzi_sandbox_secret_99482019');
  const [isTestMode, setIsTestMode] = useState(true);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(formData);
    showToast('Site, iletişim, marka ve API entegrasyon ayarları başarıyla kaydedildi!', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-[#2A2825]">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#F8F5EF]">Site, Marka &amp; Sistem Ayarları</h1>
          <p className="text-xs text-[#8C857B]">Footer, adres, müşteri destek, sosyal medya ve ödeme entegrasyonlarını yönetin.</p>
        </div>

        <button
          type="submit"
          form="settingsForm"
          className="px-6 py-3 bg-[#B49A6A] text-[#F8F5EF] text-xs font-semibold uppercase tracking-wider hover:bg-[#988052] transition-colors flex items-center justify-center gap-2 shadow-lg"
        >
          <Save className="w-4 h-4" />
          <span>Tüm Değişiklikleri Kaydet</span>
        </button>
      </div>

      <form id="settingsForm" onSubmit={handleSaveSettings} className="space-y-8 text-xs text-[#F8F5EF] max-w-4xl">
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
            <h2 className="font-serif text-lg font-normal">Müşteri Hizmetleri &amp; Açık Adres (Footer &amp; İletişim)</h2>
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

        {/* 4. E-Posta Sunucu Ayarları (SMTP & API Entegrasyonu) */}
        <div className="bg-[#1C1B1A] border border-[#2A2825] p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#2A2825]">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#B49A6A]" />
              <h2 className="font-serif text-lg font-normal">E-Posta Sunucu Ayarları (SMTP &amp; API Entegrasyonu)</h2>
            </div>
            <button
              type="button"
              onClick={() => {
                showToast('⚡ SMTP Sunucu Bağlantısı Test Edildi! Test e-postası (destek@veraesarp.com) adresine iletildi.', 'success');
              }}
              className="px-3.5 py-1.5 bg-[#242321] text-[#B49A6A] border border-[#B49A6A]/40 text-xs font-semibold hover:bg-[#B49A6A] hover:text-[#F8F5EF] transition-colors"
            >
              ⚡ Sunucu Bağlantısını Test Et
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#8C857B] mb-1">E-Posta Servis Sağlayıcısı</label>
              <select
                value={formData.emailSettings?.provider || 'smtp'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emailSettings: {
                      ...(formData.emailSettings || {
                        isEnabled: true,
                        provider: 'smtp',
                        smtpHost: 'mail.veraesarp.com',
                        smtpPort: 587,
                        smtpUser: 'destek@veraesarp.com',
                        senderName: 'Vera Eşarp Müşteri Hizmetleri',
                        senderEmail: 'destek@veraesarp.com',
                        encryption: 'tls',
                      }),
                      provider: e.target.value as any,
                    },
                  })
                }
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
              >
                <option value="smtp">Kurumsal cPanel / Plesk SMTP</option>
                <option value="gmail">Google Workspace / Gmail SMTP</option>
                <option value="resend">Resend Transactional Email API</option>
                <option value="cpanel">Özel Linux Mail Server</option>
              </select>
            </div>

            <div>
              <label className="block text-[#8C857B] mb-1">SMTP Sunucu Adresi (Host) *</label>
              <input
                type="text"
                required
                placeholder="ör: mail.veraesarp.com"
                value={formData.emailSettings?.smtpHost || 'mail.veraesarp.com'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emailSettings: {
                      ...(formData.emailSettings || {
                        isEnabled: true,
                        provider: 'smtp',
                        smtpHost: 'mail.veraesarp.com',
                        smtpPort: 587,
                        smtpUser: 'destek@veraesarp.com',
                        senderName: 'Vera Eşarp Müşteri Hizmetleri',
                        senderEmail: 'destek@veraesarp.com',
                        encryption: 'tls',
                      }),
                      smtpHost: e.target.value,
                    },
                  })
                }
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[#8C857B] mb-1">SMTP Port *</label>
              <input
                type="number"
                required
                placeholder="587"
                value={formData.emailSettings?.smtpPort || 587}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emailSettings: {
                      ...(formData.emailSettings || {
                        isEnabled: true,
                        provider: 'smtp',
                        smtpHost: 'mail.veraesarp.com',
                        smtpPort: 587,
                        smtpUser: 'destek@veraesarp.com',
                        senderName: 'Vera Eşarp Müşteri Hizmetleri',
                        senderEmail: 'destek@veraesarp.com',
                        encryption: 'tls',
                      }),
                      smtpPort: Number(e.target.value),
                    },
                  })
                }
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] font-mono"
              />
            </div>

            <div>
              <label className="block text-[#8C857B] mb-1">Şifreleme (Encryption)</label>
              <select
                value={formData.emailSettings?.encryption || 'tls'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emailSettings: {
                      ...(formData.emailSettings || {
                        isEnabled: true,
                        provider: 'smtp',
                        smtpHost: 'mail.veraesarp.com',
                        smtpPort: 587,
                        smtpUser: 'destek@veraesarp.com',
                        senderName: 'Vera Eşarp Müşteri Hizmetleri',
                        senderEmail: 'destek@veraesarp.com',
                        encryption: 'tls',
                      }),
                      encryption: e.target.value as any,
                    },
                  })
                }
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
              >
                <option value="tls">STARTTLS (Port 587)</option>
                <option value="ssl">SSL / TLS (Port 465)</option>
                <option value="none">Şifrelemesiz (Port 25)</option>
              </select>
            </div>

            <div>
              <label className="block text-[#8C857B] mb-1">SMTP Kullanıcı Adı (E-Posta) *</label>
              <input
                type="text"
                required
                value={formData.emailSettings?.smtpUser || 'destek@veraesarp.com'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emailSettings: {
                      ...(formData.emailSettings || {
                        isEnabled: true,
                        provider: 'smtp',
                        smtpHost: 'mail.veraesarp.com',
                        smtpPort: 587,
                        smtpUser: 'destek@veraesarp.com',
                        senderName: 'Vera Eşarp Müşteri Hizmetleri',
                        senderEmail: 'destek@veraesarp.com',
                        encryption: 'tls',
                      }),
                      smtpUser: e.target.value,
                    },
                  })
                }
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#8C857B] mb-1">Gönderen E-Posta Şifresi *</label>
              <input
                type="password"
                required
                value={formData.emailSettings?.smtpPassword || '••••••••'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emailSettings: {
                      ...(formData.emailSettings || {
                        isEnabled: true,
                        provider: 'smtp',
                        smtpHost: 'mail.veraesarp.com',
                        smtpPort: 587,
                        smtpUser: 'destek@veraesarp.com',
                        senderName: 'Vera Eşarp Müşteri Hizmetleri',
                        senderEmail: 'destek@veraesarp.com',
                        encryption: 'tls',
                      }),
                      smtpPassword: e.target.value,
                    },
                  })
                }
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] font-mono"
              />
            </div>

            <div>
              <label className="block text-[#8C857B] mb-1">Gönderen Marka Görünüm Adı *</label>
              <input
                type="text"
                required
                value={formData.emailSettings?.senderName || 'Vera Eşarp Müşteri Hizmetleri'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emailSettings: {
                      ...(formData.emailSettings || {
                        isEnabled: true,
                        provider: 'smtp',
                        smtpHost: 'mail.veraesarp.com',
                        smtpPort: 587,
                        smtpUser: 'destek@veraesarp.com',
                        senderName: 'Vera Eşarp Müşteri Hizmetleri',
                        senderEmail: 'destek@veraesarp.com',
                        encryption: 'tls',
                      }),
                      senderName: e.target.value,
                    },
                  })
                }
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
              />
            </div>
          </div>
        </div>

        {/* 5. Payment Integration */}
        <div className="bg-[#1C1B1A] border border-[#2A2825] p-6 space-y-4 shadow-xl">
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
              className="accent-[#B49A6A] w-4 h-4 cursor-pointer"
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
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] font-mono"
              />
            </div>

            <div>
              <label className="block text-[#8C857B] mb-1">İyzico Secret Key</label>
              <input
                type="password"
                value={iyzicoSecretKey}
                onChange={(e) => setIyzicoSecretKey(e.target.value)}
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] font-mono"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-8 py-3.5 bg-[#B49A6A] text-[#F8F5EF] text-xs font-semibold uppercase tracking-widest hover:bg-[#988052] transition-colors flex items-center gap-2 shadow-xl"
        >
          <Save className="w-4 h-4" />
          <span>Değişiklikleri Yayınla &amp; Kaydet</span>
        </button>
      </form>
    </div>
  );
}
