'use client';

import React, { useState, useMemo, use } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import ProductGrid from '@/components/product/ProductGrid';
import { MOCK_PRODUCTS } from '@/lib/data/mock-data';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = use(searchParams);
  const initialQuery = resolvedSearchParams.q || '';
  const [query, setQuery] = useState(initialQuery);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();

    return MOCK_PRODUCTS.filter((product) => {
      return (
        product.name.toLowerCase().includes(q) ||
        product.sku.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.fabric.toLowerCase().includes(q) ||
        product.styleCategory.toLowerCase().includes(q) ||
        (product.collection && product.collection.toLowerCase().includes(q)) ||
        product.colors.some((c) => c.name.toLowerCase().includes(q))
      );
    });
  }, [query]);

  const recommendedProducts = MOCK_PRODUCTS.slice(0, 4);

  return (
    <div className="py-12 bg-[#F8F5EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Input Box */}
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-12">
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-[#242321]">
            Ürün Arama
          </h1>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="relative"
          >
            <input
              type="text"
              placeholder="İpek eşarp, Medine ipeği şal, altın broş ara..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full py-4 px-6 pr-14 bg-[#FFFFFF] border border-[#E6DFD5] text-sm text-[#242321] placeholder-[#8C857B] focus:outline-none focus:border-[#B49A6A] shadow-sm"
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#242321] hover:text-[#B49A6A]"
            >
              <SearchIcon className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Results */}
        {query.trim() && searchResults.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xs uppercase tracking-widest text-[#8C857B] font-semibold">
              "{query}" İle İlgili <strong className="text-[#242321]">{searchResults.length}</strong> Sonuç Bulundu
            </h2>
            <ProductGrid products={searchResults} columns={4} />
          </div>
        )}

        {/* Empty State */}
        {query.trim() && searchResults.length === 0 && (
          <div className="py-12 text-center space-y-8">
            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-normal text-[#242321]">Aradığınızı Bulamadınız mı?</h2>
              <p className="text-xs text-[#5A5652]">
                "{query}" aramasıyla eşleşen ürün bulunamadı. Lütfen kelimenizi değiştirin veya sizin için seçtiğimiz popüler ürünleri inceleyin.
              </p>
            </div>

            <div className="pt-6 border-t border-[#E6DFD5]">
              <h3 className="font-serif text-xl font-normal text-[#242321] mb-6">İlginizi Çekebilecek Ürünler</h3>
              <ProductGrid products={recommendedProducts} columns={4} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
