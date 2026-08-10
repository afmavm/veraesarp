'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { InstagramIcon } from '@/components/ui/Icons';
import Hero from '@/components/home/Hero';
import StyleFinder from '@/components/home/StyleFinder';
import ShopTheLook from '@/components/home/ShopTheLook';
import Bestsellers from '@/components/home/Bestsellers';
import EditorialStory from '@/components/home/EditorialStory';
import StyleGuideSection from '@/components/home/StyleGuideSection';
import Newsletter from '@/components/home/Newsletter';
import ProductGrid from '@/components/product/ProductGrid';
import { useData } from '@/context/DataContext';

export default function HomePage() {
  const { products } = useData();
  const newProducts = products.filter((p) => p.isNew).slice(0, 4);

  return (
    <div className="space-y-0">
      {/* SECTION 1: HERO */}
      <Hero />

      {/* SECTION 2: YENİ KOLEKSİYON */}
      <section className="py-20 bg-[#F8F5EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[#B49A6A] font-semibold flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                MİLANO ROMANCE 2026
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#242321] mt-2">
                Yeni Koleksiyon
              </h2>
            </div>
            <Link
              href="/kategori/yeni-gelenler"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#242321] hover:text-[#B49A6A] transition-colors"
            >
              <span>Tüm Yeni Gelenler</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <ProductGrid products={newProducts} columns={4} />
        </div>
      </section>

      {/* SECTION 3: STİLİNİ BUL */}
      <StyleFinder />

      {/* SECTION 4: SHOP THE LOOK */}
      <ShopTheLook />

      {/* SECTION 5: ÇOK SATANLAR (VERA'NIN FAVORİLERİ) */}
      <Bestsellers />

      {/* SECTION 6: EDITORIAL STORY */}
      <EditorialStory />

      {/* SECTION 7: STİL REHBERİ */}
      <StyleGuideSection />

      {/* SECTION 8: INSTAGRAM & COMMUNITY */}
      <section className="py-20 bg-[#242321] text-[#F8F5EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="flex items-center justify-center gap-2 text-[#B49A6A]">
            <InstagramIcon className="w-5 h-5" />
            <span className="text-xs uppercase tracking-[0.3em] font-semibold">@veraesarp</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal">
            Vera ile Stilini Paylaş
          </h2>
          <p className="text-xs text-[#8C857B] max-w-lg mx-auto leading-relaxed">
            #VeraEşarp etiketiyle stilini paylaş, topluluğumuza katıl. Her ay en güzel kombinleri öne çıkarıyoruz.
          </p>
          <a
            href="https://instagram.com/veraesarp"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 border border-[#B49A6A] text-[#B49A6A] text-xs font-semibold uppercase tracking-widest hover:bg-[#B49A6A] hover:text-[#F8F5EF] transition-all"
          >
            <InstagramIcon className="w-4 h-4" />
            Instagram'da Takip Et
          </a>
        </div>
      </section>

      {/* SECTION 9: NEWSLETTER */}
      <Newsletter />
    </div>
  );
}
