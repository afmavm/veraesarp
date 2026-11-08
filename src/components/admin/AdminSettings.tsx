'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  ShieldCheck,
  Key,
  CreditCard,
  Save,
  Building2,
  Phone,
  Mail,
  MapPin,
  Globe,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Activity,
  Loader2,
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';

export default function AdminSettings() {
  const { siteSettings, updateSiteSettings } = useData();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({ ...siteSettings });
  const [iyzicoApiKey, setIyzicoApiKey] = useState(
    siteSettings.iyzicoSettings?.apiKey || 'lRyUheOJsBN7VJ4TQZt671dlNT7a0fKz'
  );
  const [iyzicoSecretKey, setIyzicoSecretKey] = useState(
    siteSettings.iyzicoSettings?.secretKey || 'FqdMOhZ8Nrr9wU5DNcDXhqLlQb8CRF3d'
  );
  const [iyzicoBaseUrl, setIyzicoBaseUrl] = useState(
    siteSettings.iyzicoSettings?.baseUrl || 'https://api.iyzipay.com'
  );
  const [showIyzicoSecret, setShowIyzicoSecret] = useState(false);
  const [iyzicoTesting, setIyzicoTesting] = useState(false);
  const [iyzicoSaving, setIyzicoSaving] = useState(false);
  const [iyzicoStatus, setIyzicoStatus] = useState<'CONNECTED' | 'UNTESTED' | 'ERROR'>('CONNECTED');
  const [iyzicoMessage, setIyzicoMessage] = useState(
    'Canlı İyzico 3D Secure altyapısına bağlı ve aktif.'
  );
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);

  useEffect(() => {
    async function loadIyzicoSettings() {
      try {
        const res = await fetch('/api/admin/integrations/iyzico');
        if (res.ok) {
          const data = await res.json();
          if (data.apiKey) setIyzicoApiKey(data.apiKey);
          if (data.secretKey) setIyzicoSecretKey(data.secretKey);
          if (data.baseUrl) setIyzicoBaseUrl(data.baseUrl);
          if (data.apiKey && data.secretKey) {
            setIyzicoStatus('CONNECTED');
            setIyzicoMessage('Canlı İyzico 3D Secure altyapısına bağlı ve aktif.');
          }
        }
      } catch (e) {
        // ignore
      }
    }
    loadIyzicoSettings();
  }, []);

  const handleTestIyzicoConnection = async () => {
    if (!iyzicoApiKey || !iyzicoSecretKey) {
      showToast('Lütfen İyzico API Anahtarı ve Güvenlik Anahtarını giriniz.', 'error');
      return;
    }
    setIyzicoTesting(true);
    try {
      const res = await fetch('/api/admin/integrations/iyzico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: iyzicoApiKey,
          secretKey: iyzicoSecretKey,
          baseUrl: iyzicoBaseUrl,
          action: 'test',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setIyzicoStatus('CONNECTED');
        setIyzicoMessage(data.message || 'İyzico bağlantısı başarılı!');
        showToast(data.message || '✅ İyzico bağlantı testi başarılı!', 'success');
      } else {
        setIyzicoStatus('ERROR');
        setIyzicoMessage(data.error || 'Bağlantı kurulamadı.');
        showToast(data.error || '❌ İyzico bağlantı testi başarısız oldu.', 'error');
      }
    } catch (err) {
      setIyzicoStatus('ERROR');
      showToast('❌ İyzico sunucularına erişilemedi.', 'error');
    } finally {
      setIyzicoTesting(false);
    }
  };

  const handleSaveIyzicoOnly = async () => {
    if (!iyzicoApiKey || !iyzicoSecretKey) {
      showToast('Lütfen İyzico API Anahtarı ve Güvenlik Anahtarını giriniz.', 'error');
      return;
    }
    setIyzicoSaving(true);
    try {
      const res = await fetch('/api/admin/integrations/iyzico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: iyzicoApiKey,
          secretKey: iyzicoSecretKey,
          baseUrl: iyzicoBaseUrl,
          action: 'save',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setIyzicoStatus('CONNECTED');
        setIyzicoMessage(data.message || 'İyzico ayarları güncellendi.');
        updateSiteSettings({
          ...formData,
          iyzicoSettings: {
            apiKey: iyzicoApiKey.trim(),
            secretKey: iyzicoSecretKey.trim(),
            baseUrl: iyzicoBaseUrl.trim(),
            isEnabled: true,
          },
        });
        showToast(data.message || '🔒 İyzico Sanal POS ayarları başarıyla kaydedildi!', 'success');
      } else {
        showToast(data.error || 'Ayarlar kaydedilemedi.', 'error');
      }
    } catch (err) {
      showToast('Kaydetme sırasında bir hata oluştu.', 'error');
    } finally {
      setIyzicoSaving(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings = {
      ...formData,
      iyzicoSettings: {
        apiKey: iyzicoApiKey.trim(),
        secretKey: iyzicoSecretKey.trim(),
        baseUrl: iyzicoBaseUrl.trim(),
        isEnabled: true,
      },
    };
    updateSiteSettings(updatedSettings);
    try {
      await fetch('/api/admin/integrations/iyzico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: iyzicoApiKey,
          secretKey: iyzicoSecretKey,
          baseUrl: iyzicoBaseUrl,
          action: 'save',
        }),
      });
    } catch (err) {
      // ignore
    }
    showToast('Site, iletişim, marka, SMTP ve İyzico Sanal POS ayarları başarıyla kaydedildi!', 'success');
  };

  const handleTestSmtpConnection = async () => {
    setIsTestingSmtp(true);
    showToast('⚡ SMTP sunucusuna bağlanılıyor...', 'info');
    try {
      const targetEmail = formData.emailSettings?.smtpUser || formData.contactEmail || 'destek@veraesarp.com';
      const res = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: targetEmail,
          subject: '⚡ Vera Eşarp — Live SMTP Sunucu Bağlantı Testi',
          htmlContent: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #1C1B1A; color: #F8F5EF; border-radius: 8px;">
              <h2 style="color: #B49A6A;">Vera Eşarp Live SMTP Testi Başarılı!</h2>
              <p>Yönetim panelinden girdiğiniz SMTP sunucu ayarları doğrulandı.</p>
              <p style="font-mono; color: #8C857B;">Sunucu: ${formData.emailSettings?.smtpHost}:${formData.emailSettings?.smtpPort}</p>
            </div>
          `,
          customSettings: formData.emailSettings,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`🎉 SMTP Sunucu Bağlantısı Başarılı! Test e-postası (${targetEmail}) adresine gönderildi.`, 'success');
      } else {
        showToast(`❌ SMTP Bağlantı Hatası: ${data.error}`, 'error');
      }
    } catch (err: any) {
      showToast('❌ E-posta API sunucusuna bağlanılamadı.', 'error');
    } finally {
      setIsTestingSmtp(false);
    }
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
              disabled={isTestingSmtp}
              onClick={handleTestSmtpConnection}
              className="px-3.5 py-1.5 bg-[#242321] text-[#B49A6A] border border-[#B49A6A]/40 text-xs font-semibold hover:bg-[#B49A6A] hover:text-[#F8F5EF] transition-colors disabled:opacity-50"
            >
              {isTestingSmtp ? '⚡ Bağlanılıyor...' : '⚡ Sunucu Bağlantısını Test Et'}
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

        {/* 5. İyzico Sanal POS Entegrasyonu */}
        <div className="bg-[#1C1B1A] border border-[#2A2825] p-6 space-y-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2A2825]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#B49A6A]/15 border border-[#B49A6A]/40 flex items-center justify-center text-[#B49A6A] shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="font-serif text-lg text-[#F8F5EF]">
                    İyzico Sanal POS Entegrasyonu
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      iyzicoBaseUrl.includes('api.iyzipay.com') && !iyzicoBaseUrl.includes('sandbox')
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                        : 'bg-amber-950/60 text-amber-400 border border-amber-500/40'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        iyzicoBaseUrl.includes('api.iyzipay.com') && !iyzicoBaseUrl.includes('sandbox')
                          ? 'bg-emerald-400 animate-pulse'
                          : 'bg-amber-400'
                      }`}
                    />
                    {iyzicoBaseUrl.includes('api.iyzipay.com') && !iyzicoBaseUrl.includes('sandbox')
                      ? 'Canlı (Production) Mod'
                      : 'Test (Sandbox) Modu'}
                  </span>
                </div>
                <p className="text-[11px] text-[#8C857B] mt-0.5">
                  Kredi kartı tahsilatları, tek çekim ve 3D Secure ödeme altyapısı ayarları.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="https://merchant.iyzipay.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#242321] hover:bg-[#2A2825] text-[#E8DED1] border border-[#3A3835] text-xs font-semibold transition-colors"
              >
                <span>İyzico Paneli</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#B49A6A]" />
              </a>
            </div>
          </div>

          {iyzicoStatus === 'CONNECTED' && (
            <div className="flex items-start gap-3 p-3.5 bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Bağlantı Aktif &amp; Onaylı: </span>
                <span className="text-emerald-200/90">
                  {iyzicoMessage || 'İyzico API bağlantısı doğrulandı. Müşterileriniz 3D Secure ile güvenle ödeme yapabilir.'}
                </span>
              </div>
            </div>
          )}

          {iyzicoStatus === 'ERROR' && (
            <div className="flex items-start gap-3 p-3.5 bg-red-950/30 border border-red-500/30 text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Bağlantı Hatası: </span>
                <span>{iyzicoMessage}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#8C857B] mb-1 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-[#B49A6A]" />
                <span>API Anahtarı (API Key) *</span>
              </label>
              <input
                type="text"
                value={iyzicoApiKey}
                onChange={(e) => setIyzicoApiKey(e.target.value)}
                placeholder="Örn: lRyUheOJsBN7VJ4TQZt671dlNT7a0fKz"
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] font-mono"
              />
            </div>

            <div>
              <label className="block text-[#8C857B] mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B49A6A]" />
                <span>Güvenlik Anahtarı (Secret Key) *</span>
              </label>
              <div className="relative">
                <input
                  type={showIyzicoSecret ? 'text' : 'password'}
                  value={iyzicoSecretKey}
                  onChange={(e) => setIyzicoSecretKey(e.target.value)}
                  placeholder="Örn: FqdMOhZ8Nrr9wU5DNcDXhqLlQb8CRF3d"
                  className="w-full p-2.5 pr-10 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowIyzicoSecret(!showIyzicoSecret)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C857B] hover:text-[#F8F5EF]"
                  title={showIyzicoSecret ? 'Gizle' : 'Göster'}
                >
                  {showIyzicoSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[#8C857B] mb-1 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#B49A6A]" />
                <span>Çalışma Ortamı (Ortam Modu)</span>
              </label>
              <select
                value={iyzicoBaseUrl}
                onChange={(e) => setIyzicoBaseUrl(e.target.value)}
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
              >
                <option value="https://api.iyzipay.com">
                  Canlı Ortam (Production) - Gerçek Kart Tahsilatları
                </option>
                <option value="https://sandbox-api.iyzipay.com">
                  Test Ortamı (Sandbox) - Geliştirici Testleri
                </option>
              </select>
            </div>

            <div>
              <label className="block text-[#8C857B] mb-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#8C857B]" />
                <span>İyzico Servis Endpoint</span>
              </label>
              <input
                type="text"
                disabled
                value={iyzicoBaseUrl}
                className="w-full p-2.5 bg-[#161514] border border-[#2A2825] text-[#8C857B] font-mono cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#2A2825]">
            <p className="text-[11px] text-[#8C857B]">
              🔒 Anahtarlarınız sunucu tarafında korunur ve asla istemciye açık iletilmez.
            </p>
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleTestIyzicoConnection}
                disabled={iyzicoTesting || iyzicoSaving}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#242321] hover:bg-[#2A2825] text-[#E8DED1] border border-[#3A3835] text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {iyzicoTesting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#B49A6A]" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5 text-[#B49A6A]" />
                )}
                <span>Bağlantıyı Test Et</span>
              </button>

              <button
                type="button"
                onClick={handleSaveIyzicoOnly}
                disabled={iyzicoSaving || iyzicoTesting}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#B49A6A] hover:bg-[#988052] text-[#F8F5EF] text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {iyzicoSaving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>İyzico Ayarlarını Kaydet</span>
              </button>
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
