'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { SITE_CONFIG } from '@/lib/data/mock-data';

import { useData } from '@/context/DataContext';

export default function CartDrawer() {
  const { cart, isOpen, closeCart, removeFromCart, updateQuantity, totalPrice, totalCount, freeShippingRemaining } = useCart();
  const { campaigns } = useData();

  if (!isOpen) return null;

  const freeGiftCampaign = campaigns.find((c) => c.type === 'free_gift' && c.isEnabled);
  const isGiftQualified = freeGiftCampaign && totalPrice >= (freeGiftCampaign.minCartAmount || 2500);

  const progressPercent = Math.min(
    100,
    ((SITE_CONFIG.freeShippingThreshold - freeShippingRemaining) / SITE_CONFIG.freeShippingThreshold) * 100
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#242321]/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F8F5EF] text-[#242321] shadow-2xl flex flex-col justify-between border-l border-[#E6DFD5]">
          {/* Header */}
          <div className="p-6 border-b border-[#E6DFD5] flex items-center justify-between bg-[#F8F5EF]">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-[#B49A6A]" />
              <h2 className="font-serif text-2xl tracking-wide font-normal">Alışveriş Sepetiniz</h2>
              <span className="text-xs bg-[#E8DED1] text-[#242321] px-2 py-0.5 rounded-full font-medium">
                {totalCount} Parça
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-[#5A5652] hover:text-[#242321] hover:bg-[#E8DED1] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Free Gift Reward Banner */}
          {freeGiftCampaign && (
            <div className={`p-3 text-xs border-b ${isGiftQualified ? 'bg-amber-900/90 text-amber-100 border-amber-700' : 'bg-[#E8DED1] text-[#242321] border-[#E6DFD5]'}`}>
              {isGiftQualified ? (
                <div className="flex items-center gap-2 font-semibold">
                  <span>🎁 Tebrikler! {freeGiftCampaign.giftProductName || 'İpek Broş'} Hediyeniz Sepetinize Eklendi!</span>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span>🎁 ₺{freeGiftCampaign.minCartAmount} Üzeri Alışverişe {freeGiftCampaign.giftProductName || 'İpek Broş'} Hediye!</span>
                  <span className="font-bold text-[#B49A6A]">Kalan: ₺{Math.max(0, (freeGiftCampaign.minCartAmount || 2500) - totalPrice)}</span>
                </div>
              )}
            </div>
          )}

          {/* Free Shipping Progress */}
          <div className="bg-[#E8DED1]/60 p-4 border-b border-[#E6DFD5]">
            <div className="flex items-center gap-2 text-xs text-[#242321] mb-2 font-medium">
              <Truck className="w-4 h-4 text-[#B49A6A]" />
              {freeShippingRemaining > 0 ? (
                <span>
                  Ücretsiz kargoya <strong className="text-[#B49A6A]">₺{freeShippingRemaining.toLocaleString('tr-TR')}</strong> kaldı!
                </span>
              ) : (
                <span className="text-emerald-700 font-semibold">Tebrikler! Ücretsiz Kargo Kazandınız.</span>
              )}
            </div>
            <div className="w-full bg-[#D6C5B3] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#B49A6A] h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-[#E8DED1] flex items-center justify-center text-[#B49A6A]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl font-medium text-[#242321]">Sepetiniz henüz boş</h3>
                <p className="text-xs text-[#5A5652] max-w-xs leading-relaxed">
                  Vera Eşarp’ın zamansız dokuları ve özel koleksiyonlarını keşfetmeye hemen başlayın.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-4 px-6 py-3 bg-[#242321] text-[#F8F5EF] text-xs font-semibold uppercase tracking-widest hover:bg-[#B49A6A] transition-colors"
                >
                  Koleksiyonu Keşfet
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex gap-4 pb-6 border-b border-[#E6DFD5] group">
                  <div className="relative w-20 h-24 bg-[#E8DED1] shrink-0 overflow-hidden">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          href={`/urun/${item.product.slug}`}
                          onClick={closeCart}
                          className="font-serif text-base text-[#242321] hover:text-[#B49A6A] transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#8C857B] hover:text-rose-600 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-xs text-[#5A5652] mt-1 space-y-0.5">
                        <p>Renk: <span className="text-[#242321] font-medium">{item.selectedColor.name}</span></p>
                        {item.selectedSize && <p>Ölçü: <span className="text-[#242321] font-medium">{item.selectedSize}</span></p>}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity buttons */}
                      <div className="flex items-center border border-[#E6DFD5] bg-[#FFFFFF]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-xs text-[#242321] hover:bg-[#E8DED1] transition-colors"
                        >
                          -
                        </button>
                        <span className="px-3 text-xs font-semibold text-[#242321]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-xs text-[#242321] hover:bg-[#E8DED1] transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-sm font-semibold text-[#242321]">
                        ₺{(item.product.price * item.quantity).toLocaleString('tr-TR')}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout button */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#E6DFD5] bg-[#F8F5EF] space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-[#5A5652]">
                  <span>Ara Toplam</span>
                  <span className="text-[#242321] font-medium">₺{totalPrice.toLocaleString('tr-TR')}</span>
                </div>
                <div className="flex justify-between text-xs text-[#5A5652]">
                  <span>Kargo KDV Dahil</span>
                  <span>{freeShippingRemaining === 0 ? 'Ücretsiz' : '₺49'}</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-[#242321] pt-2 border-t border-[#E6DFD5]">
                  <span>Genel Toplam</span>
                  <span className="font-serif text-xl text-[#B49A6A]">₺{totalPrice.toLocaleString('tr-TR')}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Link
                  href="/odeme"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#242321] text-[#F8F5EF] text-xs font-semibold uppercase tracking-widest hover:bg-[#B49A6A] transition-colors shadow-sm"
                >
                  <span>Siparişi Tamamla</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/sepet"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center py-2.5 bg-transparent border border-[#242321] text-[#242321] text-xs font-semibold uppercase tracking-widest hover:bg-[#242321] hover:text-[#F8F5EF] transition-colors"
                >
                  Sepeti İncele
                </Link>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#8C857B] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B49A6A]" />
                <span>256-Bit SSL ile %100 Güvenli Ödeme Altyapısı</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
