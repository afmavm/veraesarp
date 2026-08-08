'use client';

import React from 'react';
import { Product } from '@/lib/types/ecommerce';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
}

export default function ProductGrid({ products, columns = 4 }: ProductGridProps) {
  const gridColsClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }[columns];

  if (products.length === 0) {
    return (
      <div className="py-16 text-center">
        <h3 className="font-serif text-xl text-[#242321]">Aradığınız kriterlere uygun ürün bulunamadı.</h3>
        <p className="text-xs text-[#5A5652] mt-2">Lütfen filtrelerinizi değiştirmeyi veya aramayı temizlemeyi deneyin.</p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridColsClass} gap-x-6 gap-y-10`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
