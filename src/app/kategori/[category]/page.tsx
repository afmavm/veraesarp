'use client';

import React, { useState, useMemo, use } from 'react';
import Link from 'next/link';
import { SlidersHorizontal, ChevronRight, X, RotateCcw } from 'lucide-react';
import ProductGrid from '@/components/product/ProductGrid';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/lib/data/mock-data';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const resolvedParams = use(params);
  const resolvedSearchParams = use(searchParams);
  const categorySlug = resolvedParams.category;

  // Filter States
  const [selectedFabric, setSelectedFabric] = useState<string[]>(
    typeof resolvedSearchParams.fabric === 'string' ? [resolvedSearchParams.fabric] : []
  );
  const [selectedStyle, setSelectedStyle] = useState<string[]>(
    typeof resolvedSearchParams.styleCategory === 'string' ? [resolvedSearchParams.styleCategory] : []
  );
  const [selectedColor, setSelectedColor] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Category Info
  const currentCategory = MOCK_CATEGORIES.find((c) => c.slug === categorySlug) || {
    name: categorySlug === 'yeni-gelenler' ? 'Yeni Gelenler' : categorySlug === 'kampanyalar' ? 'Kampanyalar' : 'Tüm Ürünler',
    description: 'Vera Eşarp’ın en seçkin kumaş ve tasarımlardan oluşan lüks koleksiyonu.',
    slug: categorySlug,
  };

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      // Category match
      if (categorySlug !== 'yeni-gelenler' && categorySlug !== 'kampanyalar') {
        if (product.category !== categorySlug && product.subcategory !== categorySlug) {
          // If category slug is a subcategory or fabric slug
          if (product.fabric !== categorySlug && product.subcategory !== categorySlug) {
            return false;
          }
        }
      }

      if (categorySlug === 'yeni-gelenler' && !product.isNew) return false;

      // Fabric filter
      if (selectedFabric.length > 0 && !selectedFabric.includes(product.fabric)) {
        return false;
      }

      // Style filter
      if (selectedStyle.length > 0 && !selectedStyle.includes(product.styleCategory)) {
        return false;
      }

      // Color filter
      if (selectedColor.length > 0) {
        const hasColor = product.colors.some((c) => selectedColor.some((sc) => c.name.toLowerCase().includes(sc.toLowerCase())));
        if (!hasColor) return false;
      }

      // Stock filter
      if (inStockOnly && product.stock <= 0) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'bestselling') return (b.reviewCount || 0) - (a.reviewCount || 0);
      return 0; // featured default
    });
  }, [categorySlug, selectedFabric, selectedStyle, selectedColor, inStockOnly, sortBy]);

  const toggleFabric = (fabric: string) => {
    setSelectedFabric((prev) => (prev.includes(fabric) ? prev.filter((f) => f !== fabric) : [...prev, fabric]));
  };

  const toggleStyle = (style: string) => {
    setSelectedStyle((prev) => (prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]));
  };

  const toggleColor = (color: string) => {
    setSelectedColor((prev) => (prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]));
  };

  const clearAllFilters = () => {
    setSelectedFabric([]);
    setSelectedStyle([]);
    setSelectedColor([]);
    setInStockOnly(false);
    setSortBy('featured');
  };

  const fabricOptions = [
    { label: 'Saf İpek', value: 'ipek' },
    { label: 'Twill İpek', value: 'twill' },
    { label: 'Saten İpek', value: 'saten' },
    { label: 'Medine İpeği', value: 'medine-ipegi' },
    { label: 'Organik Pamuk & Bambu', value: 'pamuk' },
  ];

  const styleOptions = [
    { label: 'Günlük', value: 'gunluk' },
    { label: 'Ofis / İş', value: 'ofis' },
    { label: 'Davet', value: 'davet' },
    { label: 'Özel Gün', value: 'ozel-gun' },
  ];

  const colorOptions = [
    { name: 'Krem', hex: '#F4EBE1' },
    { name: 'Bej', hex: '#D6C5B3' },
    { name: 'Ekru', hex: '#F9F6F0' },
    { name: 'Vizon', hex: '#C8A9A5' },
    { name: 'Siyah', hex: '#1C1B1A' },
    { name: 'Lacivert', hex: '#0F1E36' },
    { name: 'Bordo', hex: '#581825' },
    { name: 'Altın', hex: '#D4AF37' },
  ];

  return (
    <div className="py-10 bg-[#F8F5EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-[#8C857B] mb-6 uppercase tracking-wider">
          <Link href="/" className="hover:text-[#242321]">Ana Sayfa</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/kategori/esarp" className="hover:text-[#242321]">Katalog</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#242321] font-semibold">{currentCategory.name}</span>
        </nav>

        {/* Category Header */}
        <div className="pb-8 border-b border-[#E6DFD5] mb-8">
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-[#242321]">
            {currentCategory.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#5A5652] max-w-2xl mt-3 leading-relaxed font-light">
            {currentCategory.description}
          </p>
        </div>

        {/* Top Control Bar (Mobile Filter Toggle & Sorting) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#E6DFD5]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-[#242321] text-[#F8F5EF] text-xs font-semibold uppercase tracking-wider"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filtrele ({selectedFabric.length + selectedStyle.length + selectedColor.length})</span>
            </button>

            <span className="text-xs text-[#8C857B]">
              Toplam <strong className="text-[#242321] font-semibold">{filteredProducts.length}</strong> ürün listeleniyor
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#5A5652] font-medium hidden sm:inline">Sıralama:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#FFFFFF] border border-[#E6DFD5] py-2 px-3 text-xs text-[#242321] focus:outline-none focus:border-[#B49A6A]"
            >
              <option value="featured">Öne Çıkanlar</option>
              <option value="newest">En Yeniler</option>
              <option value="bestselling">Çok Satanlar</option>
              <option value="price-asc">Fiyat (Düşükten Yükseğe)</option>
              <option value="price-desc">Fiyat (Yüksekten Düşüğe)</option>
            </select>
          </div>
        </div>

        {/* Main Content Grid with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-8 pr-4 border-r border-[#E6DFD5]">
            <div className="flex items-center justify-between pb-4 border-b border-[#E6DFD5]">
              <h3 className="font-serif text-xl text-[#242321] font-medium">Filtreler</h3>
              {(selectedFabric.length > 0 || selectedStyle.length > 0 || selectedColor.length > 0 || inStockOnly) && (
                <button
                  onClick={clearAllFilters}
                  className="text-[11px] text-[#B49A6A] hover:underline flex items-center gap-1 font-medium"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Temizle</span>
                </button>
              )}
            </div>

            {/* Fabric Filter */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-widest font-semibold text-[#242321]">Kumaş &amp; Doku</h4>
              <div className="space-y-2">
                {fabricOptions.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2.5 text-xs text-[#5A5652] cursor-pointer hover:text-[#242321]">
                    <input
                      type="checkbox"
                      checked={selectedFabric.includes(opt.value)}
                      onChange={() => toggleFabric(opt.value)}
                      className="accent-[#B49A6A] w-4 h-4 rounded-none"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Style Category Filter */}
            <div className="space-y-3 pt-6 border-t border-[#E6DFD5]">
              <h4 className="text-xs uppercase tracking-widest font-semibold text-[#242321]">Stil &amp; Kullanım</h4>
              <div className="space-y-2">
                {styleOptions.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2.5 text-xs text-[#5A5652] cursor-pointer hover:text-[#242321]">
                    <input
                      type="checkbox"
                      checked={selectedStyle.includes(opt.value)}
                      onChange={() => toggleStyle(opt.value)}
                      className="accent-[#B49A6A] w-4 h-4 rounded-none"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div className="space-y-3 pt-6 border-t border-[#E6DFD5]">
              <h4 className="text-xs uppercase tracking-widest font-semibold text-[#242321]">Renk Paleti</h4>
              <div className="grid grid-cols-4 gap-2">
                {colorOptions.map((color) => {
                  const isSelected = selectedColor.includes(color.name);
                  return (
                    <button
                      key={color.name}
                      onClick={() => toggleColor(color.name)}
                      title={color.name}
                      className={`flex flex-col items-center gap-1 p-1.5 border transition-all ${
                        isSelected ? 'border-[#B49A6A] bg-[#E8DED1]/50' : 'border-transparent hover:border-[#E6DFD5]'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full border border-[#D6C5B3]" style={{ backgroundColor: color.hex }} />
                      <span className="text-[10px] text-[#5A5652]">{color.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stock Filter */}
            <div className="pt-6 border-t border-[#E6DFD5]">
              <label className="flex items-center gap-2.5 text-xs text-[#242321] font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-[#B49A6A] w-4 h-4"
                />
                <span>Sadece Stoktaki Ürünler</span>
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-9">
            <ProductGrid products={filteredProducts} columns={3} />
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-[#242321]/60 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-[#F8F5EF] p-6 shadow-2xl overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E6DFD5]">
                <h3 className="font-serif text-2xl text-[#242321]">Filtreler</h3>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 text-[#242321]">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Fabric Filter */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-widest font-semibold text-[#242321]">Kumaş</h4>
                <div className="space-y-2">
                  {fabricOptions.map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2 text-xs text-[#5A5652]">
                      <input
                        type="checkbox"
                        checked={selectedFabric.includes(opt.value)}
                        onChange={() => toggleFabric(opt.value)}
                        className="accent-[#B49A6A]"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E6DFD5] space-y-2">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 bg-[#242321] text-[#F8F5EF] text-xs font-semibold uppercase tracking-widest"
              >
                Sonuçları Göster ({filteredProducts.length})
              </button>
              <button
                onClick={clearAllFilters}
                className="w-full py-2 bg-transparent text-[#8C857B] text-xs underline"
              >
                Tümünü Temizle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
