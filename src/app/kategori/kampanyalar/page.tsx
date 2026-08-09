'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Gift, Tag, Clock, ChevronRight, ArrowRight, ShieldCheck } from 'lucide-react';
import { useData } from '@/context/DataContext';
import ProductGrid from '@/components/product/ProductGrid';

export default function CampaignsPage() {
  const { campaigns, products } = useData();

  const activeCampaigns = campaigns.filter((c) => c.isEnabled);
  const flashSaleProducts = products.filter((p) => p.badges?.includes('Flaş İndirim') || p.badges?.includes('Özel Fiyat'));

  return (
    <div className="bg-[#F8F5EF] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-[#8C857B] uppercase tracking-wider">
          <Link href="/" className="hover:text-[#242321]">Ana Sayfa</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#242321] font-semibold">Aktif Kampanyalar &amp; Fırsatlar</span>
        </nav>

        {/* Page Header Banner */}
        <div className="bg-[#242321] text-[#F8F5EF] p-8 sm:p-12 relative overflow-hidden shadow-2xl space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-[#B49A6A] font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            VERA PROMOSYON &amp; KAMPANYALAR
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal">
            Özel İndirimler &amp; Satış Stratejileri
          </h1>
          <p className="text-xs sm:text-sm text-[#E8DED1] max-w-xl leading-relaxed">
            Yönetim panelimizden anlık yönetilen Flaş İndirimler, Sepette Hediyeli Alışverişler ve Kademeli Çok Al Az Öde avantajları.
          </p>
        </div>

        {/* Active Campaigns Cards Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeCampaigns.map((cmp) => (
            <div key={cmp.id} className="p-8 bg-[#FFFFFF] border border-[#E6DFD5] space-y-4 shadow-md hover:border-[#B49A6A] transition-colors">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#B49A6A] bg-[#F8F5EF] px-2.5 py-1 border border-[#E6DFD5] inline-block">
                {cmp.type === 'flash_sale' ? 'Flaş İndirim' : cmp.type === 'free_gift' ? 'Sepet Hediyesi' : 'Kademeli İndirim'}
              </span>

              <h3 className="font-serif text-2xl font-normal text-[#242321]">{cmp.title}</h3>
              <p className="text-xs text-[#5A5652] leading-relaxed">{cmp.subtitle}</p>

              <div className="pt-4 border-t border-[#E6DFD5] flex items-center justify-between text-xs font-semibold">
                <span className="text-[#B49A6A]">Vitrinde Yayında</span>
                <Link href="/kategori/esarp" className="text-[#242321] flex items-center gap-1 hover:underline">
                  <span>Alışverişe Başla</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Flash Sale Products Grid */}
        <div className="space-y-6 pt-6">
          <div className="border-b border-[#E6DFD5] pb-4 flex justify-between items-end">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[#B49A6A] font-semibold">
                SÜRELİ FIRSATLAR
              </span>
              <h2 className="font-serif text-3xl font-normal text-[#242321]">Flaş İndirimdeki Ürünler</h2>
            </div>
          </div>

          <ProductGrid products={flashSaleProducts.length > 0 ? flashSaleProducts : products.slice(0, 4)} columns={4} />
        </div>
      </div>
    </div>
  );
}
