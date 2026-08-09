'use client';

import React, { useState, useMemo, use } from 'react';
import Link from 'next/link';
import { SlidersHorizontal, ChevronRight, X, Sparkles, Filter } from 'lucide-react';
import ProductGrid from '@/components/product/ProductGrid';
import { useData } from '@/context/DataContext';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = use(params);
  const categorySlug = resolvedParams.category;

  const { products } = useData();

  // Filters State
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(3000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  // Filtered Products Calculation
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (categorySlug !== 'tum-urunler' && p.category !== categorySlug) {
        return false;
      }
      // Fabric filter
      if (selectedFabrics.length > 0 && !selectedFabrics.includes(p.fabric)) {
        return false;
      }
      // Style filter
      if (selectedStyles.length > 0 && !selectedStyles.includes(p.styleCategory)) {
        return false;
      }
      // Price filter
      if (p.price > maxPriceFilter) {
        return false;
      }
      // Stock filter
      if (inStockOnly && p.stock <= 0) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });
  }, [products, categorySlug, selectedFabrics, selectedStyles, maxPriceFilter, inStockOnly, sortBy]);

  const toggleFabric = (fabric: string) => {
    setSelectedFabrics((prev) =>
      prev.includes(fabric) ? prev.filter((f) => f !== fabric) : [...prev, fabric]
    );
  };

  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const getCategoryTitle = () => {
    if (categorySlug === 'esarp') return 'İpek & Twill Eşarp Koleksiyonu';
    if (categorySlug === 'sal') return 'Medine İpeği & Bambu Şal Serisi';
    if (categorySlug === 'aksesuar') return 'Altın Kaplama & Özel Aksesuarlar';
    return 'Tüm Vera Eşarp Koleksiyonları';
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://veraesarp.com' },
      { '@type': 'ListItem', position: 2, name: 'Koleksiyonlar', item: 'https://veraesarp.com/kategori' },
      { '@type': 'ListItem', position: 3, name: getCategoryTitle(), item: `https://veraesarp.com/kategori/${categorySlug}` },
    ],
  };

  return (
    <div className="bg-[#F8F5EF] min-h-screen py-12">
      {/* SEO Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs text-[#8C857B] uppercase tracking-wider">
          <Link href="/" className="hover:text-[#242321]">Ana Sayfa</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/kategori" className="hover:text-[#242321]">Koleksiyonlar</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#242321] font-semibold">{getCategoryTitle()}</span>
        </nav>

        {/* Page Banner Header */}
        <div className="bg-[#1C1B1A] text-[#F8F5EF] p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="text-xs uppercase tracking-[0.3em] text-[#B49A6A] font-semibold">
              VERA LUXURY CATALOG
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-normal leading-tight">
              {getCategoryTitle()}
            </h1>
            <p className="text-xs sm:text-sm text-[#E8DED1] leading-relaxed">
              Özel İtalyan dokuma tezgahlarında hazırlanan saf twill ipekler, nefes alan Medine iplikleri ve 24K altın kaplama detaylar.
            </p>
          </div>
        </div>

        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 py-4 border-b border-[#E6DFD5]">
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-[#FFFFFF] border border-[#E6DFD5] text-xs font-semibold uppercase tracking-wider text-[#242321]"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#B49A6A]" />
            <span>Filtreleri Göster ({selectedFabrics.length + selectedStyles.length})</span>
          </button>

          <span className="text-xs text-[#8C857B] uppercase font-semibold">
            Toplam <strong className="text-[#242321]">{filteredProducts.length}</strong> Özel Model Listeleniyor
          </span>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#8C857B] uppercase hidden sm:inline">Sıralama:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#FFFFFF] border border-[#E6DFD5] text-xs text-[#242321] py-2 px-3 focus:outline-none focus:border-[#B49A6A]"
            >
              <option value="featured">Öne Çıkanlar</option>
              <option value="newest">En Yeniler</option>
              <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
              <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
            </select>
          </div>
        </div>

        {/* Main Content Layout (Sidebar Filters + Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block lg:col-span-3 space-y-8 pr-4 border-r border-[#E6DFD5]">
            {/* Price Filter Slider */}
            <div className="space-y-3">
              <h4 className="font-serif text-lg font-normal text-[#242321]">Fiyat Aralığı (₺)</h4>
              <div className="space-y-2">
                <input
                  type="range"
                  min="500"
                  max="3500"
                  step="50"
                  value={maxPriceFilter}
                  onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                  className="w-full accent-[#B49A6A]"
                />
                <div className="flex justify-between text-xs font-semibold text-[#B49A6A]">
                  <span>₺500</span>
                  <span>Maks: ₺{maxPriceFilter.toLocaleString('tr-TR')}</span>
                </div>
              </div>
            </div>

            {/* Fabric Filters */}
            <div className="space-y-3">
              <h4 className="font-serif text-lg font-normal text-[#242321]">Kumaş Türü</h4>
              <div className="space-y-2 text-xs">
                {[
                  { id: 'twill', label: 'Twill İpek' },
                  { id: 'saten', label: 'Saten İpek' },
                  { id: 'ipek', label: 'Saf İpek' },
                  { id: 'medine-ipegi', label: 'Medine İpeği' },
                  { id: 'pamuk', label: 'Pamuk & Bambu' },
                ].map((f) => (
                  <label key={f.id} className="flex items-center gap-2 cursor-pointer text-[#5A5652] hover:text-[#242321]">
                    <input
                      type="checkbox"
                      checked={selectedFabrics.includes(f.id)}
                      onChange={() => toggleFabric(f.id)}
                      className="accent-[#B49A6A] w-4 h-4"
                    />
                    <span>{f.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Style Filters */}
            <div className="space-y-3">
              <h4 className="font-serif text-lg font-normal text-[#242321]">Kullanım Stili</h4>
              <div className="space-y-2 text-xs">
                {[
                  { id: 'ofis', label: 'Ofis & İş Hayatı' },
                  { id: 'gunluk', label: 'Günlük Şıklık' },
                  { id: 'davet', label: 'Gece & Davet' },
                  { id: 'ozel-gun', label: 'Özel Gün & Düğün' },
                ].map((s) => (
                  <label key={s.id} className="flex items-center gap-2 cursor-pointer text-[#5A5652] hover:text-[#242321]">
                    <input
                      type="checkbox"
                      checked={selectedStyles.includes(s.id)}
                      onChange={() => toggleStyle(s.id)}
                      className="accent-[#B49A6A] w-4 h-4"
                    />
                    <span>{s.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center bg-[#FFFFFF] border border-[#E6DFD5] space-y-3">
                <p className="text-base font-serif text-[#242321]">Seçilen filtrelere uygun ürün bulunamadı.</p>
                <button
                  onClick={() => {
                    setSelectedFabrics([]);
                    setSelectedStyles([]);
                    setMaxPriceFilter(3500);
                  }}
                  className="text-xs text-[#B49A6A] uppercase font-semibold underline"
                >
                  Filtreleri Temizle
                </button>
              </div>
            ) : (
              <ProductGrid products={filteredProducts} columns={3} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
