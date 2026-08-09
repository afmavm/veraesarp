'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Star,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Check,
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import ProductGrid from '@/components/product/ProductGrid';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const { products } = useData();

  // Match by slug or id
  const product = products.find((p) => p.slug === slug || p.id === slug);

  if (!product) {
    notFound();
  }

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '90x90 cm');
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('ozellikler');

  const isFavorite = isInWishlist(product.id);
  const selectedColor = product.colors[selectedColorIndex] || product.colors[0] || { name: 'Standart', hex: '#242321' };

  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
    showToast(`${quantity}x ${product.name} sepetinize eklendi.`, 'success');
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product);
    if (!isFavorite) {
      showToast('Ürün favorilerinize eklendi.', 'success');
    } else {
      showToast('Ürün favorilerinizden çıkarıldı.', 'info');
    }
  };

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  // Cross-sell & Recommendation products
  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 4);

  // JSON-LD Structured Data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: 'Vera Eşarp',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'TRY',
      price: product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `https://veraesarp.com/urun/${product.slug}`,
    },
  };

  return (
    <div className="py-10 bg-[#F8F5EF] min-h-screen">
      {/* SEO Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-[#8C857B] mb-8 uppercase tracking-wider">
          <Link href="/" className="hover:text-[#242321]">Ana Sayfa</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/kategori/${product.category}`} className="hover:text-[#242321]">
            {product.category.toUpperCase()}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#242321] font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Active Image */}
            <div className="relative aspect-[3/4] w-full bg-[#E8DED1] overflow-hidden shadow-sm group">
              <Image
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.badges?.map((badge) => (
                  <span
                    key={badge}
                    className="text-xs uppercase font-semibold px-3 py-1 bg-[#242321] text-[#F8F5EF] tracking-widest shadow-md"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-24 bg-[#E8DED1] shrink-0 border-2 transition-all ${
                      selectedImageIndex === idx ? 'border-[#B49A6A]' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`${product.name} Görsel ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info & Purchase Form */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[#B49A6A] font-semibold block mb-1">
                SKU: {product.sku} {product.barcode && `• GTIN: ${product.barcode}`}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#242321] leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center text-[#B49A6A]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#B49A6A]" />
                  ))}
                </div>
                <span className="text-xs font-semibold text-[#242321]">{product.rating || 5.0}</span>
                <span className="text-xs text-[#8C857B]">({product.reviewCount || 12} Değerlendirme)</span>
              </div>
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-xs text-[#5A5652] leading-relaxed border-l-2 border-[#B49A6A] pl-3 py-1 italic">
                {product.shortDescription}
              </p>
            )}

            {/* Price Box */}
            <div className="flex items-baseline gap-3 pb-4 border-b border-[#E6DFD5]">
              <span className="font-serif text-3xl font-normal text-[#242321]">
                ₺{product.price.toLocaleString('tr-TR')}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-base text-[#8C857B] line-through font-light">
                  ₺{product.compareAtPrice.toLocaleString('tr-TR')}
                </span>
              )}
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xs bg-[#C8A9A5]/30 text-rose-800 font-semibold px-2 py-0.5 rounded-full">
                  %
                  {Math.round(
                    ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
                  )}{' '}
                  İndirim
                </span>
              )}
            </div>

            {/* Color Swatch Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-medium text-[#242321] flex justify-between">
                  <span>Renk: <strong className="font-semibold text-[#B49A6A]">{selectedColor.name}</strong></span>
                </label>
                <div className="flex items-center gap-2.5">
                  {product.colors.map((c, idx) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColorIndex(idx)}
                      title={c.name}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${
                        selectedColorIndex === idx ? 'border-[#242321] scale-110 shadow-sm' : 'border-[#E6DFD5]'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2 pt-2">
                <label className="text-xs uppercase tracking-wider font-medium text-[#242321] block">
                  Ölçü: <strong className="font-semibold">{selectedSize}</strong>
                </label>
                <div className="flex items-center gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-4 py-2 text-xs font-medium border transition-all ${
                        selectedSize === sz
                          ? 'bg-[#242321] text-[#F8F5EF] border-[#242321]'
                          : 'bg-[#FFFFFF] text-[#242321] border-[#E6DFD5] hover:border-[#B49A6A]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & CTA Buttons */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-[#E6DFD5] bg-[#FFFFFF]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-3 text-sm text-[#242321] hover:bg-[#E8DED1] transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 text-sm font-semibold text-[#242321]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-3 text-sm text-[#242321] hover:bg-[#E8DED1] transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart CTA */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className={`flex-1 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] transition-colors shadow-lg flex items-center justify-center gap-2 ${
                    product.stock > 0
                      ? 'bg-[#242321] text-[#F8F5EF] hover:bg-[#B49A6A]'
                      : 'bg-[#8C857B] text-[#F8F5EF] cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{product.stock > 0 ? 'Sepete Ekle' : 'Tükendi'}</span>
                </button>

                {/* Wishlist Heart */}
                <button
                  onClick={handleWishlistToggle}
                  className={`p-3.5 border transition-all ${
                    isFavorite
                      ? 'bg-[#242321] border-[#242321] text-[#B49A6A]'
                      : 'bg-[#FFFFFF] border-[#E6DFD5] text-[#242321] hover:border-[#B49A6A]'
                  }`}
                  aria-label="Favorilere Ekle"
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-[#B49A6A]' : ''}`} />
                </button>
              </div>

              {/* Stock status indicator */}
              <div className="flex items-center gap-2 text-xs font-medium">
                {product.stock > 0 ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    <span className="text-emerald-700">Stokta Var (Stok Adedi: {product.stock}) — Aynı Gün Kargo</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-rose-600" />
                    <span className="text-rose-700 font-bold">Stok Tükendi</span>
                  </>
                )}
              </div>
            </div>

            {/* Shipping & Payment Trust Info */}
            <div className="p-4 bg-[#E8DED1]/50 border border-[#E6DFD5] space-y-2 text-xs text-[#5A5652]">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#B49A6A] shrink-0" />
                <span><strong>₺1.500 Üzeri Ücretsiz Kargo:</strong> 24 Saat İçinde Kargoda</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4 text-[#B49A6A] shrink-0" />
                <span><strong>14 Gün Ücretsiz İade:</strong> Kolay ve Şeffaf İade Akışı</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#B49A6A] shrink-0" />
                <span><strong>%100 Orijinal Vera Garantisi:</strong> Özel Lüks Hediye Kutusu</span>
              </div>
            </div>

            {/* Product Accordions */}
            <div className="border-t border-[#E6DFD5] pt-4 space-y-2">
              {/* Accordion 1: Özellikler */}
              <div className="border-b border-[#E6DFD5] pb-2">
                <button
                  onClick={() => toggleAccordion('ozellikler')}
                  className="w-full flex items-center justify-between py-2 text-xs font-semibold uppercase tracking-wider text-[#242321]"
                >
                  <span>Ürün Özellikleri</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeAccordion === 'ozellikler' ? 'rotate-180' : ''}`} />
                </button>
                {activeAccordion === 'ozellikler' && (
                  <div className="pt-2 pb-4 text-xs text-[#5A5652] space-y-1.5 leading-relaxed">
                    {product.features?.map((feat, idx) => (
                      <p key={idx}>{feat}</p>
                    ))}
                    <p className="pt-2 text-[#242321]">{product.description}</p>
                  </div>
                )}
              </div>

              {/* Accordion 2: Kumaş ve Bakım */}
              <div className="border-b border-[#E6DFD5] pb-2">
                <button
                  onClick={() => toggleAccordion('bakim')}
                  className="w-full flex items-center justify-between py-2 text-xs font-semibold uppercase tracking-wider text-[#242321]"
                >
                  <span>Kumaş ve Bakım Talimatı</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeAccordion === 'bakim' ? 'rotate-180' : ''}`} />
                </button>
                {activeAccordion === 'bakim' && (
                  <div className="pt-2 pb-4 text-xs text-[#5A5652] leading-relaxed">
                    <p>{product.careInstructions || 'Kuru temizleme önerilir.'}</p>
                    {product.dimensions && <p className="mt-1 font-semibold text-[#242321]">Ölçüler: {product.dimensions}</p>}
                  </div>
                )}
              </div>

              {/* Accordion 3: Kargo ve İade */}
              <div className="border-b border-[#E6DFD5] pb-2">
                <button
                  onClick={() => toggleAccordion('kargo')}
                  className="w-full flex items-center justify-between py-2 text-xs font-semibold uppercase tracking-wider text-[#242321]"
                >
                  <span>Kargo ve İade</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeAccordion === 'kargo' ? 'rotate-180' : ''}`} />
                </button>
                {activeAccordion === 'kargo' && (
                  <div className="pt-2 pb-4 text-xs text-[#5A5652] leading-relaxed space-y-2">
                    <p>Hafta içi saat 16:00'a kadar verilen tüm siparişler aynı gün kargoya teslim edilmektedir.</p>
                    <p>Ambalajı açılmamış ve denenmemiş ürünleri 14 gün içinde anlaşmalı kargomuz ile ücretsiz iade edebilirsiniz.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* NEDEN VERA? */}
        <section className="my-20 p-8 sm:p-12 bg-[#242321] text-[#F8F5EF]">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <span className="text-xs uppercase tracking-[0.3em] text-[#B49A6A] font-semibold flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              KALİTE VE İŞÇİLİK
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal">Neden Vera?</h2>
            <p className="text-xs sm:text-sm text-[#E8DED1]">Sıradan bir aksesuardan daha fazlası; kusursuz lüks deneyimi.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {[
              { title: 'Yumuşak Doku', desc: '%100 saf ipek lifler' },
              { title: 'Kolay Şekil Alma', desc: 'Dik ve tok duruş' },
              { title: 'Gün Boyu Konfor', desc: 'Kayma yapmayan özel yapı' },
              { title: 'Özenli İşçilik', desc: 'El dikişli kenar detayı' },
              { title: 'Zamansız Tasarım', desc: 'Modası geçmeyen renkler' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-2 p-4 bg-[#3A3835]/50 border border-[#B49A6A]/20">
                <div className="w-8 h-8 rounded-full bg-[#B49A6A]/20 text-[#B49A6A] mx-auto flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-base font-normal">{item.title}</h4>
                <p className="text-[11px] text-[#8C857B]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SENİN İÇİN SEÇTİK */}
        <section className="my-20">
          <div className="mb-10 text-center">
            <span className="text-xs uppercase tracking-[0.3em] text-[#B49A6A] font-semibold">
              KOMBİN ÖNERİLERİ
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#242321] mt-1">
              Senin İçin Seçtik
            </h2>
          </div>

          <ProductGrid products={relatedProducts} columns={4} />
        </section>
      </div>
    </div>
  );
}
