'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, RotateCcw, Award } from 'lucide-react';
import { InstagramIcon, TikTokIcon, PinterestIcon } from '@/components/ui/Icons';
import { SITE_CONFIG } from '@/lib/data/mock-data';

export default function Footer() {
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
            <p className="text-xs text-[#8C857B] leading-relaxed">₺1.500 ve üzeri tüm siparişlerde aynı gün kargo.</p>
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
                VERA
              </span>
              <span className="block text-[10px] tracking-[0.4em] text-[#B49A6A] font-sans uppercase -mt-1 font-medium">
                E Ş A R P
              </span>
            </Link>
            <p className="text-xs text-[#8C857B] leading-relaxed max-w-sm">
              {SITE_CONFIG.tagline} Zarafeti ve zamansız moda anlayışını gardırobunuza taşıyoruz.
            </p>
            <div className="text-xs text-[#8C857B] space-y-1 pt-2">
              <p><strong className="text-[#E8DED1]">Müşteri Destek:</strong> {SITE_CONFIG.contactPhone}</p>
              <p><strong className="text-[#E8DED1]">E-Posta:</strong> {SITE_CONFIG.contactEmail}</p>
              <p><strong className="text-[#E8DED1]">Adres:</strong> {SITE_CONFIG.address}</p>
            </div>
          </div>

          {/* Column 1: Alışveriş */}
          <div className="space-y-3">
            <h4 className="font-serif text-lg font-medium text-[#F8F5EF]">Alışveriş</h4>
            <ul className="space-y-2 text-xs text-[#8C857B]">
              <li><Link href="/kategori/yeni-gelenler" className="hover:text-[#B49A6A] transition-colors">Yeni Gelenler</Link></li>
              <li><Link href="/kategori/esarp" className="hover:text-[#B49A6A] transition-colors">İpek Eşarp</Link></li>
              <li><Link href="/kategori/sal" className="hover:text-[#B49A6A] transition-colors">Medine İpeği Şal</Link></li>
              <li><Link href="/kategori/aksesuar" className="hover:text-[#B49A6A] transition-colors">Aksesuar &amp; Broş</Link></li>
              <li><Link href="/koleksiyonlar" className="hover:text-[#B49A6A] transition-colors">Özel Koleksiyonlar</Link></li>
            </ul>
          </div>

          {/* Column 2: Vera & Kurumsal */}
          <div className="space-y-3">
            <h4 className="font-serif text-lg font-medium text-[#F8F5EF]">Vera World</h4>
            <ul className="space-y-2 text-xs text-[#8C857B]">
              <li><Link href="/kurumsal/hakkimizda" className="hover:text-[#B49A6A] transition-colors">Hakkımızda</Link></li>
              <li><Link href="/kurumsal/hikayemiz" className="hover:text-[#B49A6A] transition-colors">Vera'nın Hikâyesi</Link></li>
              <li><Link href="/stil-rehberi" className="hover:text-[#B49A6A] transition-colors">Stil Rehberi</Link></li>
              <li><Link href="/kurumsal/magazalar" className="hover:text-[#B49A6A] transition-colors">Mağazalarımız</Link></li>
              <li><Link href="/kurumsal/iletisim" className="hover:text-[#B49A6A] transition-colors">İletişim</Link></li>
            </ul>
          </div>

          {/* Column 3: Yardım & Müşteri */}
          <div className="space-y-3">
            <h4 className="font-serif text-lg font-medium text-[#F8F5EF]">Müşteri İlişkileri</h4>
            <ul className="space-y-2 text-xs text-[#8C857B]">
              <li><Link href="/kurumsal/kargo-ve-teslimat" className="hover:text-[#B49A6A] transition-colors">Kargo ve Teslimat</Link></li>
              <li><Link href="/kurumsal/iade-ve-degisim" className="hover:text-[#B49A6A] transition-colors">İade ve Değişim</Link></li>
              <li><Link href="/kurumsal/sss" className="hover:text-[#B49A6A] transition-colors">Sık Sorulan Sorular</Link></li>
              <li><Link href="/kurumsal/gizlilik-ve-cerez" className="hover:text-[#B49A6A] transition-colors">Gizlilik &amp; Çerez Politikası</Link></li>
              <li><Link href="/kurumsal/kvkk" className="hover:text-[#B49A6A] transition-colors">KVKK Aydınlatma Metni</Link></li>
              <li><Link href="/kurumsal/mesafeli-satis-sozlesmesi" className="hover:text-[#B49A6A] transition-colors">Mesafeli Satış Sözleşmesi</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Social */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#3A3835] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#8C857B]">
        <p>© 2026 VERA EŞARP. Tüm hakları saklıdır. Premium Kadın Moda &amp; Aksesuar Platformu.</p>
        
        <div className="flex items-center space-x-6 text-[#E8DED1]">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#B49A6A] transition-colors flex items-center gap-1.5">
            <InstagramIcon className="w-4 h-4" />
            <span>Instagram</span>
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="hover:text-[#B49A6A] transition-colors flex items-center gap-1.5">
            <TikTokIcon className="w-4 h-4" />
            <span>TikTok</span>
          </a>
          <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="hover:text-[#B49A6A] transition-colors flex items-center gap-1.5">
            <PinterestIcon className="w-4 h-4" />
            <span>Pinterest</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
