import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
import { MOCK_PRODUCTS } from '@/lib/data/mock-data';

export default function HomePage() {
  const newProducts = MOCK_PRODUCTS.filter((p) => p.isNew).slice(0, 4);

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

      {/* SECTION 8: INSTAGRAM / SOSYAL İLHAM */}
      <section className="py-20 bg-[#F8F5EF] border-t border-[#E6DFD5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs uppercase tracking-[0.3em] text-[#B49A6A] font-semibold flex items-center justify-center gap-2">
              <InstagramIcon className="w-4 h-4" />
              @VERAESARP
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#242321]">
              Vera'dan İlham Al
            </h2>
            <p className="text-xs sm:text-sm text-[#5A5652] max-w-md mx-auto">
              Stilinizi #VeraKombinim etiketiyle paylaşın, resmi hesabımızda yerinizi alın.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=600&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=600&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop',
            ].map((imgUrl, i) => (
              <a
                key={i}
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="group relative aspect-square bg-[#E8DED1] overflow-hidden block shadow-sm"
              >
                <Image
                  src={imgUrl}
                  alt={`Vera Instagram ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#242321]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[#F8F5EF]">
                  <InstagramIcon className="w-8 h-8 text-[#B49A6A]" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9: NEWSLETTER */}
      <Newsletter />
    </div>
  );
}
