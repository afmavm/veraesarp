'use client';

import React from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import ProductGrid from '@/components/product/ProductGrid';

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  return (
    <div className="py-12 bg-[#F8F5EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#242321] mb-8 pb-4 border-b border-[#E6DFD5]">
          Favori Ürünleriniz ({wishlist.length})
        </h1>

        {wishlist.length === 0 ? (
          <div className="py-20 text-center space-y-6 max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-[#E8DED1] flex items-center justify-center text-[#B49A6A] mx-auto">
              <Heart className="w-10 h-10" />
            </div>
            <h2 className="font-serif text-2xl font-normal text-[#242321]">Henüz favori ürününüz yok</h2>
            <p className="text-xs text-[#5A5652] leading-relaxed">
              Beğendiğiniz eşarp, şal ve aksesuarları favorilerinize ekleyerek daha sonra kolayca inceleyebilir ve satın alabilirsiniz.
            </p>
            <Link
              href="/kategori/esarp"
              className="inline-block px-8 py-3.5 bg-[#242321] text-[#F8F5EF] text-xs font-semibold uppercase tracking-widest hover:bg-[#B49A6A] transition-colors shadow-md"
            >
              Koleksiyonu Keşfet
            </Link>
          </div>
        ) : (
          <ProductGrid products={wishlist} columns={4} />
        )}
      </div>
    </div>
  );
}
