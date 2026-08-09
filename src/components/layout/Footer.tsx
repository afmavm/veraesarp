'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, RotateCcw, Award, Mail, Phone, MapPin, Copy, Check } from 'lucide-react';
import { InstagramIcon, PinterestIcon, FacebookIcon, WhatsAppIcon } from '@/components/ui/Icons';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import { sendNewsletterConfirmationEmail } from '@/lib/email/email-service';

export default function Footer() {
  const { siteSettings } = useData();
  const { showToast } = useToast();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const cleanPhone = (siteSettings.whatsappPhone || '+905344902557').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    'Merhaba Vera Eşarp, ürünleriniz ve yeni sezon koleksiyonunuz hakkında bilgi almak istiyorum.'
  )}`;

  const handleCopy = (text: string, label: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(label);
      showToast(`📋 ${label} panoya kopyalandı!`, 'success');
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleNewsletterSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    try {
      sendNewsletterConfirmationEmail(newsletterEmail);
      showToast(`📩 Teşekkürler! ${newsletterEmail} e-bülten grubumuza eklendi ve onay e-postası gönderildi.`, 'success');
      setNewsletterEmail('');
    } catch (err) {
      showToast('Bülten aboneliği sırasında bir hata oluştu.', 'error');
    }
  };

  const defaultBadges = [
    { id: '1', title: '%100 Saf İpek', description: 'Özel dokuma İtalyan twill ve saten kumaş garantisi.', iconName: 'Award' },
    { id: '2', title: 'Hızlı & Ücretsiz Kargo', description: `₺${siteSettings.freeShippingThreshold.toLocaleString('tr-TR')} ve üzeri tüm siparişlerde aynı gün kargo.`, iconName: 'Truck' },
    { id: '3', title: 'Kolay İade & Değişim', description: '14 gün içerisinde koşulsuz ve ücretsiz iade imkanı.', iconName: 'RotateCcw' },
    { id: '4', title: 'Güvenli Alışveriş', description: '256-bit SSL korumalı İyzico & PayTR altyapısı.', iconName: 'ShieldCheck' },
  ];

  const valueProps = siteSettings.valuePropositions && siteSettings.valuePropositions.length > 0
    ? siteSettings.valuePropositions
    : defaultBadges;

  const renderBadgeIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Award': return <Award className="w-6 h-6" />;
      case 'Truck': return <Truck className="w-6 h-6" />;
      case 'RotateCcw': return <RotateCcw className="w-6 h-6" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6" />;
      default: return <Award className="w-6 h-6" />;
    }
  };

  return (
    <footer className="bg-[#242321] text-[#F8F5EF] pt-16 pb-24 lg:pb-12 border-t border-[#B49A6A]/20">
      {/* Brand Trust Badges - Dynamic Value Propositions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 border-b border-[#3A3835]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {valueProps.map((item, idx) => (
            <div key={item.id || idx} className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#B49A6A]/10 flex items-center justify-center text-[#B49A6A]">
                {renderBadgeIcon(item.iconName)}
              </div>
              <h4 className="font-serif text-lg font-normal text-[#F8F5EF]">{item.title}</h4>
              <p className="text-xs text-[#8C857B] leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block group">
              <div className="bg-[#FFFFFF] p-3 rounded-lg shadow-xl transition-transform duration-300 group-hover:scale-105 border border-[#B49A6A]/40 inline-block">
                <img
                  src="/logo.png"
                  alt="Vera Eşarp Logo"
                  className="h-20 sm:h-24 w-auto object-contain"
                />
              </div>
            </Link>
            <p className="text-xs text-[#8C857B] leading-relaxed max-w-sm">
              {siteSettings.tagline}
            </p>
            <div className="text-xs text-[#8C857B] space-y-2 pt-2">

              {/* Telefon — Tıkla & Ara */}
              <div className="group flex items-center justify-between gap-2">
                <a
                  href={`tel:${siteSettings.contactPhone.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center gap-2 hover:text-[#B49A6A] transition-colors"
                  title="Tıklayın, hemen arayın"
                >
                  <Phone className="w-3.5 h-3.5 text-[#B49A6A] shrink-0" />
                  <span>
                    <strong className="text-[#E8DED1]">Müşteri Destek:</strong>{' '}
                    <span className="group-hover:underline">{siteSettings.contactPhone}</span>
                  </span>
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy(siteSettings.contactPhone, 'Telefon numarası')}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-[#B49A6A]"
                  title="Kopyala"
                >
                  {copiedField === 'Telefon numarası' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>

              {/* E-Posta — Tıkla & Mail Gönder */}
              <div className="group flex items-center justify-between gap-2">
                <a
                  href={`mailto:${siteSettings.contactEmail}`}
                  className="flex items-center gap-2 hover:text-[#B49A6A] transition-colors"
                  title="Tıklayın, e-posta gönderin"
                >
                  <Mail className="w-3.5 h-3.5 text-[#B49A6A] shrink-0" />
                  <span>
                    <strong className="text-[#E8DED1]">E-Posta:</strong>{' '}
                    <span className="group-hover:underline">{siteSettings.contactEmail}</span>
                  </span>
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy(siteSettings.contactEmail, 'E-posta adresi')}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-[#B49A6A]"
                  title="Kopyala"
                >
                  {copiedField === 'E-posta adresi' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>

              {/* Adres — Tıkla & Google Maps */}
              <div className="group flex items-center justify-between gap-2">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(siteSettings.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 hover:text-[#B49A6A] transition-colors"
                  title="Google Harita'da göster"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#B49A6A] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#E8DED1]">Adres:</strong>{' '}
                    <span className="group-hover:underline">{siteSettings.address}</span>
                  </span>
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy(siteSettings.address, 'Adres')}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-[#B49A6A] shrink-0"
                  title="Kopyala"
                >
                  {copiedField === 'Adres' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>

            </div>

            {/* Newsletter Subscription Box */}
            <form onSubmit={handleNewsletterSubscribe} className="pt-2 space-y-2 max-w-sm">
              <label className="block text-[11px] uppercase tracking-wider text-[#B49A6A] font-semibold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>E-Bültene Abone Olun (Ayrıcalıkları Kaçırmayın)</span>
              </label>
              <div className="flex">
                <input
                  type="email"
                  required
                  placeholder="E-posta adresiniz..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 p-2.5 bg-[#1C1B1A] border border-[#3A3835] text-xs text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#B49A6A] text-[#F8F5EF] text-xs font-semibold uppercase tracking-wider hover:bg-[#988052] transition-colors shrink-0"
                >
                  Abone Ol
                </button>
              </div>
            </form>
          </div>

          {/* Dynamic Footer Columns */}
          {(siteSettings.footerColumns && siteSettings.footerColumns.length > 0
            ? siteSettings.footerColumns
            : [
                {
                  title: 'Alışveriş',
                  links: [
                    { label: 'Yeni Gelenler', url: '/kategori/yeni-gelenler' },
                    { label: 'İpek Eşarp', url: '/kategori/esarp' },
                    { label: 'Medine İpeği Şal', url: '/kategori/sal' },
                    { label: 'Aksesuar & Broş', url: '/kategori/aksesuar' },
                    { label: 'Özel Koleksiyonlar', url: '/koleksiyonlar' },
                  ],
                },
                {
                  title: 'Vera World',
                  links: [
                    { label: 'Hakkımızda', url: '/kurumsal/hakkimizda' },
                    { label: "Vera'nın Hikâyesi", url: '/kurumsal/hikayemiz' },
                    { label: 'Stil Rehberi', url: '/stil-rehberi' },
                    { label: 'Mağazalarımız', url: '/kurumsal/magazalar' },
                    { label: 'İletişim', url: '/kurumsal/iletisim' },
                  ],
                },
                {
                  title: 'Müşteri İlişkileri',
                  links: [
                    { label: 'Kargo ve Teslimat', url: '/kurumsal/kargo-ve-teslimat' },
                    { label: 'İade ve Değişim', url: '/kurumsal/iade-ve-degisim' },
                    { label: 'Sık Sorulan Sorular', url: '/kurumsal/sss' },
                    { label: 'Gizlilik & Çerez Politikası', url: '/kurumsal/gizlilik-ve-cerez' },
                    { label: 'KVKK Aydınlatma Metni', url: '/kurumsal/kvkk' },
                    { label: 'Mesafeli Satış Sözleşmesi', url: '/kurumsal/mesafeli-satis-sozlesmesi' },
                  ],
                },
              ]
          ).map((col, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="font-serif text-lg font-medium text-[#F8F5EF]">{col.title}</h4>
              <ul className="space-y-2 text-xs text-[#8C857B]">
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link href={link.url} className="hover:text-[#B49A6A] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar: Copyright & Social */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#3A3835] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#8C857B]">
        <p>© 2026 {siteSettings.name}. Tüm hakları saklıdır. Premium Kadın Moda &amp; Aksesuar Platformu.</p>
        
        <div className="flex items-center space-x-6 text-[#E8DED1]">
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="hover:text-[#B49A6A] transition-colors flex items-center gap-1.5">
            <WhatsAppIcon className="w-4 h-4" />
            <span>WhatsApp Destek</span>
          </a>
          {siteSettings.instagramUrl && (
            <a href={siteSettings.instagramUrl} target="_blank" rel="noreferrer" className="hover:text-[#B49A6A] transition-colors flex items-center gap-1.5">
              <InstagramIcon className="w-4 h-4" />
              <span>Instagram</span>
            </a>
          )}
          {siteSettings.facebookUrl && (
            <a href={siteSettings.facebookUrl} target="_blank" rel="noreferrer" className="hover:text-[#B49A6A] transition-colors flex items-center gap-1.5">
              <FacebookIcon className="w-4 h-4" />
              <span>Facebook</span>
            </a>
          )}
          {siteSettings.pinterestUrl && (
            <a href={siteSettings.pinterestUrl} target="_blank" rel="noreferrer" className="hover:text-[#B49A6A] transition-colors flex items-center gap-1.5">
              <PinterestIcon className="w-4 h-4" />
              <span>Pinterest</span>
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
