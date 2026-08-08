'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { MOCK_PRODUCTS } from '@/lib/data/mock-data';
import ProductGrid from '../product/ProductGrid';

export default function Bestsellers() {
  const featuredProducts = MOCK_PRODUCTS.filter((p) => p.isBestseller || p.isFeatured).slice(0, 4);

  return (
    <section className="py-20 bg-[#F8F5EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#B49A6A] font-semibold">
              EN ÇOK TERCİH EDİLENLER
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#242321] mt-2">
              Vera'nın Favorileri
            </h2>
          </div>
          <Link
            href="/kategori/esarp"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#242321] hover:text-[#B49A6A] transition-colors"
          >
            <span>Tüm Ürünleri İncele</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ProductGrid products={featuredProducts} columns={4} />
      </div>
    </section>
  );
}
