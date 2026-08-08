import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { MOCK_COLLECTIONS, MOCK_PRODUCTS } from '@/lib/data/mock-data';
import ProductGrid from '@/components/product/ProductGrid';

export const metadata = {
  title: 'Özel Koleksiyonlar | VERA EŞARP',
  description: 'Milano Romance 2026, Minimal Essence ve Soirée Luxury özel tasarım koleksiyonları.',
};

export default function CollectionsPage() {
  return (
    <div className="py-12 bg-[#F8F5EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] text-[#B49A6A] font-semibold flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            ÖZEL DOKUMA SERİLERİ
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-[#242321]">
            Vera Koleksiyonları
          </h1>
          <p className="text-xs sm:text-sm text-[#5A5652] leading-relaxed font-light">
            İtalyan zarafeti, monokrom minimalizm ve gece davetlerinin ışıltısını yansıtan imza koleksiyonlarımız.
          </p>
        </div>

        {/* Collections Stack */}
        <div className="space-y-16">
          {MOCK_COLLECTIONS.map((col, index) => {
            const colProducts = MOCK_PRODUCTS.filter((p) => p.collection === col.slug);

            return (
              <div key={col.id} className="space-y-8">
                {/* Banner Block */}
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FFFFFF] border border-[#E6DFD5] p-6 sm:p-10 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  <div className="lg:col-span-6 space-y-4">
                    <span className="text-xs uppercase tracking-[0.3em] text-[#B49A6A] font-semibold">
                      {col.subtitle}
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#242321]">
                      {col.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#5A5652] leading-relaxed font-light">
                      {col.description}
                    </p>
                    <Link
                      href={`/kategori/esarp?collection=${col.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#242321] hover:text-[#B49A6A] transition-colors pt-2"
                    >
                      <span>Koleksiyon Ürünlerini İncele</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="lg:col-span-6 relative aspect-[16/10] bg-[#E8DED1] overflow-hidden">
                    <Image
                      src={col.bannerImage || col.image}
                      alt={col.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Collection Products Grid */}
                {colProducts.length > 0 && (
                  <div className="pt-4">
                    <ProductGrid products={colProducts} columns={4} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
