'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, X, TrendingUp, History, ArrowRight, Sparkles, Filter, Check, Tag } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { Product } from '@/lib/types/ecommerce';

interface AdvancedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
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

const TRENDING_TAGS = [
  'Saf İpek Eşarp',
  'Twill İpek',
  'Medine İpeği Şal',
  'Saten İpek',
  'Altın İpek Broşu',
  'Ofis & İş Stili',
  'Özel Gün & Davet',
];

export default function AdvancedSearchModal({ isOpen, onClose }: AdvancedSearchModalProps) {
  const router = useRouter();
  const { products } = useData();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load Recent Searches from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('veraesarp_recent_searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch {}
  }, []);

  // Save Recent Search query
  const addRecentSearch = (term: string) => {
    const clean = term.trim();
    if (!clean) return;
    try {
      const filtered = recentSearches.filter((s) => s.toLowerCase() !== clean.toLowerCase());
      const updated = [clean, ...filtered].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('veraesarp_recent_searches', JSON.stringify(updated));
    } catch {}
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('veraesarp_recent_searches');
  };

  // Live Filtering & Turkish Normalization Search Engine
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const qNormalized = normalizeTr(query);

    let filtered = products.filter((product) => {
      const nameMatch = normalizeTr(product.name).includes(qNormalized);
      const skuMatch = normalizeTr(product.sku).includes(qNormalized);
      const descMatch = normalizeTr(product.description || '').includes(qNormalized);
      const catMatch = normalizeTr(product.category || '').includes(qNormalized);
      const fabricMatch = normalizeTr(product.fabric || '').includes(qNormalized);
      const styleMatch = normalizeTr(product.styleCategory || '').includes(qNormalized);
      const collectionMatch = product.collection ? normalizeTr(product.collection).includes(qNormalized) : false;
      const colorMatch = (product.colors || []).some((c: any) => normalizeTr(c.name || '').includes(qNormalized));

      return nameMatch || skuMatch || descMatch || catMatch || fabricMatch || styleMatch || collectionMatch || colorMatch;
    });

    // Apply category tab filter inside live search modal
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Apply sorting
    if (sortBy === 'price-asc') {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [query, products, selectedCategory, sortBy]);

  // Extract matching category tags from search results
  const matchingCategoryCounts = useMemo(() => {
    if (!query.trim()) return [];
    const qNormalized = normalizeTr(query);
    const counts: Record<string, number> = {};

    products.forEach((p) => {
      const match =
        normalizeTr(p.name).includes(qNormalized) ||
        normalizeTr(p.category || '').includes(qNormalized) ||
        normalizeTr(p.fabric || '').includes(qNormalized);

      if (match) {
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
    });

    return Object.entries(counts).map(([cat, count]) => ({
      category: cat,
      label: cat === 'esarp' ? 'İpek Eşarp' : cat === 'sal' ? 'Şal Koleksiyonu' : 'Aksesuar & Broş',
      count,
    }));
  }, [query, products]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      addRecentSearch(query);
      onClose();
      router.push(`/arama?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelectTag = (tag: string) => {
    setQuery(tag);
    addRecentSearch(tag);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#242321]/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Search Header Container */}
      <div className="bg-[#1C1B1A] border-b border-[#B49A6A]/30 p-4 sm:p-6 shadow-2xl">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#B49A6A] font-semibold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              VERA AKILLI ARAMA MOTORU
            </span>
            <button
              onClick={onClose}
              className="p-2 text-[#8C857B] hover:text-[#F8F5EF] transition-colors rounded-full hover:bg-[#242321]"
              aria-label="Kapat"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Search Input Form */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="absolute left-4 w-6 h-6 text-[#B49A6A] pointer-events-none" />
            <input
              type="text"
              placeholder="Saf İpek Eşarp, Twill, Medine İpeği Şal veya Renk Ara..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full py-4 pl-14 pr-24 bg-[#242321] border border-[#3A3835] focus:border-[#B49A6A] text-base sm:text-lg text-[#F8F5EF] placeholder-[#8C857B] focus:outline-none transition-colors shadow-inner font-sans"
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-14 p-1 text-[#8C857B] hover:text-[#F8F5EF]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-3 px-4 py-2 bg-[#B49A6A] text-[#F8F5EF] text-xs font-semibold uppercase tracking-wider hover:bg-[#988052] transition-colors shadow-md rounded"
            >
              Ara
            </button>
          </form>

          {/* Filter Bar inside Modal (shown when typing) */}
          {query.trim() && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-[#2A2825]">
              <div className="flex items-center gap-2">
                <span className="text-[#8C857B]">Kategori:</span>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1 rounded transition-colors ${
                    selectedCategory === 'all' ? 'bg-[#B49A6A] text-[#F8F5EF]' : 'bg-[#242321] text-[#8C857B] hover:text-[#F8F5EF]'
                  }`}
                >
                  Tümü
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('esarp')}
                  className={`px-3 py-1 rounded transition-colors ${
                    selectedCategory === 'esarp' ? 'bg-[#B49A6A] text-[#F8F5EF]' : 'bg-[#242321] text-[#8C857B] hover:text-[#F8F5EF]'
                  }`}
                >
                  İpek Eşarp
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('sal')}
                  className={`px-3 py-1 rounded transition-colors ${
                    selectedCategory === 'sal' ? 'bg-[#B49A6A] text-[#F8F5EF]' : 'bg-[#242321] text-[#8C857B] hover:text-[#F8F5EF]'
                  }`}
                >
                  Şal
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('aksesuar')}
                  className={`px-3 py-1 rounded transition-colors ${
                    selectedCategory === 'aksesuar' ? 'bg-[#B49A6A] text-[#F8F5EF]' : 'bg-[#242321] text-[#8C857B] hover:text-[#F8F5EF]'
                  }`}
                >
                  Aksesuar
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[#8C857B]">Sırala:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#242321] border border-[#3A3835] text-[#F8F5EF] p-1.5 rounded focus:outline-none"
                >
                  <option value="featured">Öne Çıkanlar</option>
                  <option value="price-asc">Fiyat: Düşükten Yüksek</option>
                  <option value="price-desc">Fiyat: Yüksekten Düşük</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Results & Recommendations Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl w-full mx-auto space-y-8 text-[#F8F5EF]">
        {/* State A: Initial State (No query typed) */}
        {!query.trim() && (
          <div className="space-y-8">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-[#B49A6A] font-semibold flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5" />
                    Son Aramalarınız
                  </span>
                  <button
                    onClick={clearRecentSearches}
                    className="text-[10px] text-[#8C857B] hover:text-rose-400 transition-colors"
                  >
                    Geçmişi Temizle
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectTag(term)}
                      className="px-3 py-1.5 bg-[#1C1B1A] border border-[#3A3835] text-xs text-[#E8DED1] hover:border-[#B49A6A] hover:text-[#B49A6A] transition-colors rounded"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Tags */}
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-wider text-[#B49A6A] font-semibold flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                Popüler Trend Aramalar
              </span>
              <div className="flex flex-wrap gap-2">
                {TRENDING_TAGS.map((tag, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectTag(tag)}
                    className="px-3.5 py-1.5 bg-[#1C1B1A] border border-[#2A2825] text-xs text-[#F8F5EF] hover:border-[#B49A6A] hover:bg-[#242321] transition-colors rounded shadow-sm flex items-center gap-1.5"
                  >
                    <Tag className="w-3 h-3 text-[#B49A6A]" />
                    <span>{tag}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recommended Products Showcase */}
            <div className="space-y-4 pt-4 border-t border-[#2A2825]">
              <span className="text-xs uppercase tracking-wider text-[#8C857B] font-semibold block">
                Sizin İçin Seçtiklerimiz (Öne Çıkanlar)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {products.slice(0, 4).map((product) => (
                  <Link
                    key={product.id}
                    href={`/urun/${product.slug}`}
                    onClick={onClose}
                    className="group bg-[#1C1B1A] border border-[#2A2825] p-3 hover:border-[#B49A6A] transition-all flex flex-col justify-between shadow-md rounded"
                  >
                    <div className="aspect-square relative mb-3 overflow-hidden bg-[#242321]">
                      {product.images[0] && (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          sizes="150px"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                    <div>
                      <h4 className="font-serif text-xs font-normal text-[#F8F5EF] line-clamp-1 group-hover:text-[#B49A6A] transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-xs font-semibold text-[#B49A6A] mt-1">₺{product.price.toLocaleString('tr-TR')}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* State B: Live Search Results */}
        {query.trim() && searchResults.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#2A2825]">
              <h3 className="text-xs uppercase tracking-wider text-[#8C857B]">
                "{query}" Araması İçin <strong className="text-[#F8F5EF] font-semibold">{searchResults.length}</strong> Canlı Ürün Bulundu
              </h3>
              <button
                onClick={handleSearchSubmit}
                className="text-xs text-[#B49A6A] hover:underline font-semibold flex items-center gap-1"
              >
                <span>Tüm Detaylı Sonuç Sayfasını Aç</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Live Search Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.slice(0, 9).map((product) => (
                <Link
                  key={product.id}
                  href={`/urun/${product.slug}`}
                  onClick={() => {
                    addRecentSearch(query);
                    onClose();
                  }}
                  className="group bg-[#1C1B1A] border border-[#2A2825] p-3.5 hover:border-[#B49A6A] transition-all flex items-center gap-4 shadow-lg rounded"
                >
                  <div className="w-16 h-16 relative bg-[#242321] shrink-0 overflow-hidden rounded">
                    {product.images[0] && (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="64px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-[#B49A6A] uppercase tracking-wider block font-semibold">
                      {product.category === 'esarp' ? 'İpek Eşarp' : product.category === 'sal' ? 'Şal' : 'Aksesuar'}
                    </span>
                    <h4 className="font-serif text-xs text-[#F8F5EF] truncate group-hover:text-[#B49A6A] transition-colors mt-0.5">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-[#B49A6A]">₺{product.price.toLocaleString('tr-TR')}</span>
                      {product.compareAtPrice && (
                        <span className="text-[10px] text-[#8C857B] line-through">₺{product.compareAtPrice.toLocaleString('tr-TR')}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {searchResults.length > 9 && (
              <div className="text-center pt-4">
                <button
                  onClick={handleSearchSubmit}
                  className="px-6 py-3 bg-[#B49A6A] text-[#F8F5EF] text-xs font-semibold uppercase tracking-wider hover:bg-[#988052] transition-colors shadow-lg rounded"
                >
                  Tüm {searchResults.length} Sonucu İncele →
                </button>
              </div>
            )}
          </div>
        )}

        {/* State C: No Results Found */}
        {query.trim() && searchResults.length === 0 && (
          <div className="py-12 text-center space-y-6 bg-[#1C1B1A] border border-[#2A2825] p-8 rounded shadow-xl">
            <div className="w-12 h-12 rounded-full bg-[#242321] border border-[#3A3835] flex items-center justify-center mx-auto text-[#B49A6A]">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-normal text-[#F8F5EF]">"{query}" İle Eşleşen Ürün Bulunamadı</h3>
              <p className="text-xs text-[#8C857B] mt-2 max-w-md mx-auto">
                Aradığınız kelimeye uygun bir ürün bulunamadı. Farklı bir kelime deneyebilir veya aşağıdaki popüler terimlerden seçim yapabilirsiniz.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {TRENDING_TAGS.map((tag, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectTag(tag)}
                  className="px-3 py-1.5 bg-[#242321] border border-[#3A3835] text-xs text-[#E8DED1] hover:border-[#B49A6A] hover:text-[#B49A6A] transition-colors rounded"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
