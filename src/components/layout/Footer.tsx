'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, RotateCcw, Award } from 'lucide-react';
import { InstagramIcon, TikTokIcon, PinterestIcon, FacebookIcon, WhatsAppIcon } from '@/components/ui/Icons';
import { useData } from '@/context/DataContext';

export default function Footer() {
  const { siteSettings } = useData();

  const cleanPhone = (siteSettings.whatsappPhone || '+905325558372').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    'Merhaba Vera Eşarp, ürünleriniz ve yeni sezon koleksiyonunuz hakkında bilgi almak istiyorum.'
  )}`;

  return (
    <footer className="bg-[#242321] text-[#F8F5EF] pt-16 pb-24 lg:pb-12 border-t border-[#B49A6A]/20">
      {/* Brand Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 border-b border-[#3A3835]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#B49A6A]/10 flex items-center justify-center text-[#B49A6A]">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg font-normal text-[#F8F5EF]">%100 Saf İpek</h4>
            <p className="text-xs text-[#8C857B] leading-relaxed">Özel dokuma İtalyan twill ve saten kumaş garantisi.</p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#B49A6A]/10 flex items-center justify-center text-[#B49A6A]">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg font-normal text-[#F8F5EF]">Hızlı &amp; Ücretsiz Kargo</h4>
            <p className="text-xs text-[#8C857B] leading-relaxed">₺{siteSettings.freeShippingThreshold.toLocaleString('tr-TR')} ve üzeri tüm siparişlerde aynı gün kargo.</p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#B49A6A]/10 flex items-center justify-center text-[#B49A6A]">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg font-normal text-[#F8F5EF]">Kolay İade &amp; Değişim</h4>
            <p className="text-xs text-[#8C857B] leading-relaxed">14 gün içerisinde koşulsuz ve ücretsiz iade imkanı.</p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#B49A6A]/10 flex items-center justify-center text-[#B49A6A]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg font-normal text-[#F8F5EF]">Güvenli Alışveriş</h4>
            <p className="text-xs text-[#8C857B] leading-relaxed">256-bit SSL korumalı İyzico &amp; PayTR altyapısı.</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-3xl tracking-[0.25em] text-[#F8F5EF] font-semibold uppercase">
                {siteSettings.name.split(' ')[0] || 'VERA'}
              </span>
              <span className="block text-[10px] tracking-[0.4em] text-[#B49A6A] font-sans uppercase -mt-1 font-medium">
                {siteSettings.name.split(' ').slice(1).join(' ') || 'E Ş A R P'}
              </span>
            </Link>
            <p className="text-xs text-[#8C857B] leading-relaxed max-w-sm">
              {siteSettings.tagline}
            </p>
            <div className="text-xs text-[#8C857B] space-y-1.5 pt-2">
              <p><strong className="text-[#E8DED1]">Müşteri Destek:</strong> {siteSettings.contactPhone}</p>
              <p><strong className="text-[#E8DED1]">E-Posta:</strong> {siteSettings.contactEmail}</p>
              <p><strong className="text-[#E8DED1]">Adres:</strong> {siteSettings.address}</p>
            </div>
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
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="hover:text-emerald-400 text-emerald-400 font-semibold transition-colors flex items-center gap-1.5">
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
