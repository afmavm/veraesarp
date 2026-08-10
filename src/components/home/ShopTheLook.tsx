'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { MOCK_LOOKS } from '@/lib/data/mock-data';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { useData } from '@/context/DataContext';

export default function ShopTheLook() {
  const [activeLookIndex] = useState(0);
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { products } = useData();
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);

  const currentLook = MOCK_LOOKS[activeLookIndex];

  return (
    <section className="py-20 bg-[#E8DED1]/40 border-y border-[#E6DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Content Description */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase tracking-[0.3em] text-[#B49A6A] font-semibold">
              KOMBİN İLHAMI
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#242321] leading-tight">
              {currentLook.title}
            </h2>
            <p className="text-sm text-[#5A5652] leading-relaxed">
              {currentLook.subtitle} Modellere dokunarak görünümdeki ikonik parçaları keşfedin ve tek tıkla sepetinize ekleyin.
            </p>

            {/* List of items in look */}
            <div className="space-y-4 pt-4 border-t border-[#E6DFD5]">
              {currentLook.hotspots.map((hs) => {
                const product = products.find((p) => p.id === hs.productId);
                if (!product) return null;

                return (
                  <div
                    key={hs.id}
                    onMouseEnter={() => setActiveHotspotId(hs.id)}
                    onMouseLeave={() => setActiveHotspotId(null)}
                    className={`p-4 bg-[#FFFFFF] border transition-all duration-300 flex items-center justify-between gap-4 cursor-pointer ${
                      activeHotspotId === hs.id ? 'border-[#B49A6A] shadow-md' : 'border-[#E6DFD5]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-14 bg-[#E8DED1] shrink-0">
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="font-serif text-sm text-[#242321] font-medium line-clamp-1">{product.name}</h4>
                        <span className="text-xs font-semibold text-[#B49A6A]">₺{product.price.toLocaleString('tr-TR')}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        addToCart(product, product.colors[0]);
                        showToast(`${product.name} sepetinize eklendi.`, 'success');
                      }}
                      className="p-2.5 bg-[#242321] text-[#F8F5EF] hover:bg-[#B49A6A] transition-colors"
                      title="Sepete Ekle"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            <Link
              href="/kategori/esarp"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#242321] hover:text-[#B49A6A] transition-colors pt-2"
            >
              <span>Tüm Kombinleri Keşfet</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right: Interative Hotspot Look Image */}
          <div className="lg:col-span-7 relative aspect-[4/5] bg-[#E8DED1] shadow-2xl overflow-hidden group">
            <Image
              src={currentLook.image}
              alt={currentLook.title}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover object-center"
            />

            {/* Hotspots */}
            {currentLook.hotspots.map((hs) => {
              const product = products.find((p) => p.id === hs.productId);
              if (!product) return null;

              const isHotspotActive = activeHotspotId === hs.id;

              return (
                <div
                  key={hs.id}
                  style={{ top: `${hs.top}%`, left: `${hs.left}%` }}
                  className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
                >
                  <button
                    onClick={() => setActiveHotspotId(isHotspotActive ? null : hs.id)}
                    className="relative w-8 h-8 rounded-full bg-[#242321] text-[#F8F5EF] flex items-center justify-center shadow-lg hotspot-pulse focus:outline-none"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#B49A6A]" />
                  </button>

                  {/* Popover Card */}
                  {isHotspotActive && (
                    <div className="absolute left-1/2 bottom-full mb-3 -translate-x-1/2 w-56 p-3 bg-[#F8F5EF] text-[#242321] shadow-2xl border border-[#B49A6A]/40 rounded-none text-left space-y-2 z-30 animate-fade-in">
                      <div className="relative aspect-square w-full bg-[#E8DED1] overflow-hidden">
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                      </div>
                      <h5 className="font-serif text-xs font-medium text-[#242321] line-clamp-1">{product.name}</h5>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-semibold text-[#B49A6A]">₺{product.price.toLocaleString('tr-TR')}</span>
                        <Link
                          href={`/urun/${product.slug}`}
                          className="text-[10px] uppercase tracking-wider text-[#242321] underline hover:text-[#B49A6A]"
                        >
                          İncele
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
