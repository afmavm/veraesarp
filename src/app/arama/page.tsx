'use client';

import React, { useState, useMemo, use } from 'react';
import { Search as SearchIcon, Sparkles, Zap } from 'lucide-react';
import ProductGrid from '@/components/product/ProductGrid';
import { useData } from '@/context/DataContext';
import { Product } from '@/lib/types/ecommerce';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

function normalizeTr(str: string): string {
  if (!str) return '';
  return str
    .replace(/İ/g, 'i')
    .replace(/I/g, 'ı')
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .trim();
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = use(searchParams);
  const initialQuery = resolvedSearchParams.q || '';
  const [query, setQuery] = useState(initialQuery);

  const { products } = useData();

  const searchResults = useMemo(() => {
    const rawQuery = query.trim();
    if (!rawQuery) return [];
    const qNormalized = normalizeTr(rawQuery);

    const scoredProducts: { product: Product; score: number }[] = [];

    products.forEach((product) => {
      let score = 0;
      const normName = normalizeTr(product.name);
      const normSku = normalizeTr(product.sku);
      const normCat = normalizeTr(product.category || '');
      const normFabric = normalizeTr(product.fabric || '');
      const normStyle = normalizeTr(product.styleCategory || '');
      const normDesc = normalizeTr(product.description || '');
      const normColl = product.collection ? normalizeTr(product.collection) : '';

      // Title starts with query (Highest Relevance Priority)
      if (normName.startsWith(qNormalized)) score += 100;
      else if (normName.includes(qNormalized)) score += 80;

      // Category / Fabric exact/partial match
      if (normCat.includes(qNormalized)) score += 60;
      if (normFabric.includes(qNormalized)) score += 50;

      // SKU / Code match
      if (normSku.includes(qNormalized)) score += 40;

      // Collection or Style match
      if (normColl.includes(qNormalized) || normStyle.includes(qNormalized)) score += 30;

      // Colors match
      if ((product.colors || []).some((c: any) => normalizeTr(c.name || '').includes(qNormalized))) score += 25;

      // Description match
      if (normDesc.includes(qNormalized)) score += 15;

      if (score > 0) {
        scoredProducts.push({ product, score });
      }
    });

    // Sort by relevance score descending
    scoredProducts.sort((a, b) => b.score - a.score);

    return scoredProducts.map((item) => item.product);
  }, [query, products]);

  const recommendedProducts = useMemo(() => products.slice(0, 4), [products]);

  return (
    <div className="py-12 bg-[#F8F5EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Input Box */}
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-[#B49A6A] font-semibold flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            VERA ANLIK İNDEKSLİ ARAMA MOTORU
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-[#242321]">
            Ürün Arama
          </h1>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="relative"
          >
            <input
              type="text"
              placeholder="Harf yazmaya başlayın (Ör: İpek, Twill, Medine, Broş)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full py-4 px-6 pr-14 bg-[#FFFFFF] border border-[#E6DFD5] text-sm text-[#242321] placeholder-[#8C857B] focus:outline-none focus:border-[#B49A6A] shadow-sm font-sans"
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#242321] hover:text-[#B49A6A] p-2"
            >
              <SearchIcon className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Results */}
        {query.trim() && searchResults.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#B49A6A] animate-pulse" />
              <h2 className="text-xs uppercase tracking-widest text-[#8C857B] font-semibold">
                "{query}" İle Anlık İndekslendi: <strong className="text-[#242321]">{searchResults.length}</strong> Ürün Bulundu
              </h2>
            </div>
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

        {/* Initial Search Helper Tags when query is empty */}
        {!query.trim() && (
          <div className="py-8 text-center space-y-4 max-w-xl mx-auto border-t border-[#E6DFD5]">
            <span className="text-[11px] uppercase tracking-wider text-[#8C857B] block font-semibold">Popüler Arama Terimleri</span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {['Saf İpek Eşarp', 'Twill İpek', 'Medine İpeği', 'Saten Şal', 'Altın Broş', 'Desenli Eşarp'].map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-3.5 py-1.5 bg-[#FFFFFF] border border-[#E6DFD5] text-xs text-[#242321] hover:border-[#B49A6A] hover:text-[#B49A6A] transition-colors shadow-sm font-sans"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
