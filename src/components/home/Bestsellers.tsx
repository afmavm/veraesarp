'use client';

import React, { useState } from 'react';
import ProductGrid from '../product/ProductGrid';
import { useData } from '@/context/DataContext';

export default function Bestsellers() {
  const { products } = useData();
  const [activeTab, setActiveTab] = useState<'all' | 'esarp' | 'sal' | 'aksesuar'>('all');

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'all') return true;
    return p.category === activeTab;
  });

  return (
    <section className="py-20 bg-[#F8F5EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E6DFD5] pb-6">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#B49A6A] font-semibold block mb-2">
              ÖNE ÇIKAN DOKULAR
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#242321]">
              En Çok Tercih Edilen Vera Modelleri
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 sm:gap-4 text-xs uppercase tracking-wider font-semibold">
            {[
              { id: 'all', label: 'Tüm Koleksiyon' },
              { id: 'esarp', label: 'Saf İpek Eşarp' },
              { id: 'sal', label: 'Medine İpeği Şal' },
              { id: 'aksesuar', label: 'Lüks Aksesuar' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-2 transition-all relative ${
                  activeTab === tab.id
                    ? 'text-[#242321] font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#B49A6A]'
                    : 'text-[#8C857B] hover:text-[#242321]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <ProductGrid products={filteredProducts} columns={4} />
      </div>
    </section>
  );
}
