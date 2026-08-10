'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { MOCK_CATEGORIES } from '@/lib/data/mock-data';
import ProductGrid from '@/components/product/ProductGrid';
import { useData } from '@/context/DataContext';

export default function CategoryIndexPage() {
  const { products } = useData();

  return (
    <div className="py-12 bg-[#F8F5EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] text-[#B49A6A] font-semibold">
            VERA KATALOĞU
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-[#242321]">
            Tüm Kategoriler
          </h1>
          <p className="text-xs sm:text-sm text-[#5A5652] leading-relaxed font-light">
            %100 Saf İpek dokumalar, dökümlü şallar ve el işçiliği aksesuarlarımızla tarzınızı tamamlayın.
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_CATEGORIES.map((cat) => (
            <div key={cat.id} className="group relative bg-[#FFFFFF] border border-[#E6DFD5] overflow-hidden flex flex-col shadow-sm">
              <div className="relative aspect-[3/4] bg-[#E8DED1] overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#242321]/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-[#F8F5EF]">
                  <h3 className="font-serif text-2xl font-normal">{cat.name}</h3>
                  <p className="text-xs text-[#E8DED1] mt-1 line-clamp-2">{cat.description}</p>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#B49A6A] block">
                    Alt Kategoriler
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {cat.subcategories?.map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`/kategori/${sub.slug}`}
                        className="text-xs text-[#5A5652] hover:text-[#242321] px-2.5 py-1 bg-[#F8F5EF] border border-[#E6DFD5]"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/kategori/${cat.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#242321] hover:text-[#B49A6A] transition-colors pt-2"
                >
                  <span>Kategoriyi İncele</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Popular Items — Live from DataContext */}
        <div className="pt-12 border-t border-[#E6DFD5]">
          <h2 className="font-serif text-3xl font-normal text-[#242321] mb-8 text-center">
            Öne Çıkan Ürünler
          </h2>
          <ProductGrid products={products} columns={4} />
        </div>
      </div>
    </div>
  );
}
