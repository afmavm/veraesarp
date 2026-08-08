'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '@/lib/types/ecommerce';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const isFavorite = isInWishlist(product.id);
  const selectedColor = product.colors[selectedColorIndex] || product.colors[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedColor);
    showToast(`${product.name} sepetinize eklendi.`, 'success');
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    if (!isFavorite) {
      showToast('Ürün favorilerinize eklendi.', 'success');
    } else {
      showToast('Ürün favorilerinizden çıkarıldı.', 'info');
    }
  };

  return (
    <div className="group relative flex flex-col bg-transparent">
      {/* Image Container */}
      <div
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#E8DED1]"
        onMouseEnter={() => product.images.length > 1 && setActiveImageIndex(1)}
        onMouseLeave={() => setActiveImageIndex(0)}
      >
        <Link href={`/urun/${product.slug}`} className="block w-full h-full">
          <Image
            src={product.images[activeImageIndex] || product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.badges?.map((badge) => (
            <span
              key={badge}
              className={`text-[10px] uppercase font-semibold px-2.5 py-1 tracking-widest ${
                badge === 'Yeni'
                  ? 'bg-[#242321] text-[#F8F5EF]'
                  : badge === 'Özel Fiyat'
                  ? 'bg-[#B49A6A] text-[#F8F5EF]'
                  : 'bg-[#C8A9A5] text-[#242321]'
              }`}
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 z-10 p-2.5 rounded-full transition-all duration-300 ${
            isFavorite
              ? 'bg-[#242321] text-[#B49A6A]'
              : 'bg-[#F8F5EF]/80 text-[#242321] hover:bg-[#242321] hover:text-[#F8F5EF]'
          }`}
          aria-label="Favorilere Ekle"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#B49A6A]' : ''}`} />
        </button>

        {/* Quick Add Overlay on Hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#242321]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
          <button
            onClick={handleQuickAdd}
            className="flex-1 py-2.5 bg-[#F8F5EF] text-[#242321] text-xs font-semibold uppercase tracking-wider hover:bg-[#B49A6A] hover:text-[#F8F5EF] transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Hızlı Ekle</span>
          </button>
          <Link
            href={`/urun/${product.slug}`}
            className="p-2.5 bg-[#242321] text-[#F8F5EF] hover:bg-[#B49A6A] transition-colors"
            title="Detaylı İncele"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Product Details */}
      <div className="pt-3 pb-2 flex flex-col justify-between flex-1">
        <div>
          {/* Category / Subcategory tag */}
          <span className="text-[10px] text-[#8C857B] uppercase tracking-widest block font-medium mb-1">
            {product.fabric.toUpperCase()} — {product.styleCategory.toUpperCase()}
          </span>

          <Link href={`/urun/${product.slug}`} className="block">
            <h3 className="font-serif text-base text-[#242321] font-normal leading-snug hover:text-[#B49A6A] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Color Swatches */}
        {product.colors.length > 1 && (
          <div className="flex items-center gap-1.5 my-2">
            {product.colors.map((color, idx) => (
              <button
                key={color.name}
                onClick={() => setSelectedColorIndex(idx)}
                title={color.name}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  selectedColorIndex === idx ? 'ring-1 ring-[#242321] ring-offset-1 scale-110' : 'border-[#E6DFD5]'
                }`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        )}

        {/* Pricing */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-semibold text-[#242321]">
            ₺{product.price.toLocaleString('tr-TR')}
          </span>
          {product.compareAtPrice && (
            <span className="text-xs text-[#8C857B] line-through font-normal">
              ₺{product.compareAtPrice.toLocaleString('tr-TR')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
