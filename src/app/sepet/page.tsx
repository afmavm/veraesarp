'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck, Truck, Tag, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import { SITE_CONFIG } from '@/lib/data/mock-data';

import { useAuth } from '@/context/AuthContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalCount, freeShippingRemaining, clearCart } = useCart();
  const { coupons, campaigns, validateCoupon } = useData();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; text: string; amount: number } | null>(null);

  // Check for active Tiered Discount Campaign (Çok Al Az Öde)
  const tieredCampaign = campaigns.find((c) => c.type === 'tiered_discount' && c.isEnabled);
  let tieredDiscountPercent = 0;
  let tieredDiscountName = '';

  if (tieredCampaign) {
    const tier1Count = tieredCampaign.tier1Count || 2;
    const tier1Disc = tieredCampaign.tier1Discount || 10;
    const tier2Count = tieredCampaign.tier2Count || 3;
    const tier2Disc = tieredCampaign.tier2Discount || 20;

    if (totalCount >= tier2Count) {
      tieredDiscountPercent = tier2Disc;
      tieredDiscountName = `${tier2Count}+ Ürün Alımına %${tier2Disc} Kademeli İndirim`;
    } else if (totalCount >= tier1Count) {
      tieredDiscountPercent = tier1Disc;
      tieredDiscountName = `${tier1Count} Ürün Alımına %${tier1Disc} Kademeli İndirim`;
    }
  }

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateCoupon(couponCode, totalPrice, user?.email);

    if (!result.success || !result.coupon) {
      showToast(result.message, 'error');
      return;
    }

    const foundCoupon = result.coupon;
    let calculatedDiscount = 0;
    if (foundCoupon.discountType === 'percentage') {
      calculatedDiscount = (totalPrice * foundCoupon.discountValue) / 100;
    } else {
      calculatedDiscount = foundCoupon.discountValue;
    }

    setAppliedCoupon({
      code: foundCoupon.code,
      text: foundCoupon.discountText,
      amount: calculatedDiscount,
    });

    showToast(result.message, 'success');
  };

  const couponDiscountAmount = appliedCoupon ? appliedCoupon.amount : 0;
  const tieredDiscountAmount = (totalPrice * tieredDiscountPercent) / 100;

  const totalDiscount = couponDiscountAmount + tieredDiscountAmount;
  const finalPrice = Math.max(0, totalPrice - totalDiscount);

  const progressPercent = Math.min(
    100,
    ((SITE_CONFIG.freeShippingThreshold - freeShippingRemaining) / SITE_CONFIG.freeShippingThreshold) * 100
  );

  return (
    <div className="py-12 bg-[#F8F5EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#242321] mb-8 pb-4 border-b border-[#E6DFD5]">
          Alışveriş Sepetiniz
        </h1>

        {cart.length === 0 ? (
          <div className="py-20 text-center space-y-6 max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-[#E8DED1] flex items-center justify-center text-[#B49A6A] mx-auto">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="font-serif text-2xl font-normal text-[#242321]">Sepetiniz henüz boş</h2>
            <p className="text-xs text-[#5A5652] leading-relaxed">
              Vera Eşarp’ın zamansız dokuları ve özel koleksiyonlarını keşfetmeye hemen başlayın.
            </p>
            <Link
              href="/kategori/esarp"
              className="inline-block px-8 py-3.5 bg-[#242321] text-[#F8F5EF] text-xs font-semibold uppercase tracking-widest hover:bg-[#B49A6A] transition-colors shadow-md"
            >
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Cart Items Table / List */}
            <div className="lg:col-span-8 space-y-6">
              {/* Free shipping bar */}
              <div className="bg-[#E8DED1]/60 p-4 border border-[#E6DFD5]">
                <div className="flex items-center gap-2 text-xs text-[#242321] mb-2 font-medium">
                  <Truck className="w-4 h-4 text-[#B49A6A]" />
                  {freeShippingRemaining > 0 ? (
                    <span>
                      Ücretsiz kargoya <strong className="text-[#B49A6A]">₺{freeShippingRemaining.toLocaleString('tr-TR')}</strong> kaldı!
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-semibold">Tebrikler! Ücretsiz Kargo Hak Kazandınız.</span>
                  )}
                </div>
                <div className="w-full bg-[#D6C5B3] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#B49A6A] h-full transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Tiered Discount Callout Banner */}
              {tieredDiscountPercent > 0 && (
                <div className="p-4 bg-emerald-950/80 border border-emerald-700/50 text-emerald-100 flex items-center gap-3 shadow-md">
                  <Sparkles className="w-5 h-5 text-emerald-300 shrink-0 animate-bounce" />
                  <div className="text-xs">
                    <p className="font-bold text-emerald-200">🎉 Çok Al Az Öde İndirimi Aktif!</p>
                    <p>{tieredDiscountName} — Sepetinize anında <strong className="text-emerald-300">₺{tieredDiscountAmount.toLocaleString('tr-TR')}</strong> indirim olarak uygulandı.</p>
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="bg-[#FFFFFF] border border-[#E6DFD5] divide-y divide-[#E6DFD5]">
                {cart.map((item) => (
                  <div key={item.id} className="p-6 flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative w-24 h-28 bg-[#E8DED1] shrink-0 overflow-hidden">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-1 text-center sm:text-left">
                      <Link
                        href={`/urun/${item.product.slug}`}
                        className="font-serif text-lg text-[#242321] hover:text-[#B49A6A] transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <div className="text-xs text-[#5A5652] space-x-3">
                        <span>Renk: <strong>{item.selectedColor.name}</strong></span>
                        {item.selectedSize && <span>• Ölçü: <strong>{item.selectedSize}</strong></span>}
                      </div>
                      <div className="text-xs text-[#8C857B] pt-1">
                        Birim Fiyat: ₺{item.product.price.toLocaleString('tr-TR')}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-6">
                      <div className="flex items-center border border-[#E6DFD5]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1.5 text-xs hover:bg-[#E8DED1]"
                        >
                          -
                        </button>
                        <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1.5 text-xs hover:bg-[#E8DED1]"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-base font-semibold text-[#242321] min-w-[90px] text-right">
                        ₺{(item.product.price * item.quantity).toLocaleString('tr-TR')}
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#8C857B] hover:text-rose-600 p-1"
                        title="Ürünü Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={clearCart}
                  className="text-xs text-[#8C857B] hover:text-[#242321] underline"
                >
                  Sepeti Temizle
                </button>
                <Link
                  href="/kategori/esarp"
                  className="text-xs text-[#242321] font-semibold uppercase tracking-wider hover:text-[#B49A6A]"
                >
                  ← Alışverişe Devam Et
                </Link>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4 bg-[#FFFFFF] p-6 border border-[#E6DFD5] shadow-sm space-y-6">
              <h3 className="font-serif text-xl font-normal text-[#242321] pb-3 border-b border-[#E6DFD5]">
                Sipariş Özeti
              </h3>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Kupon Kodu (ör: VERA10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 py-2 px-3 bg-[#F8F5EF] border border-[#E6DFD5] text-xs uppercase font-mono focus:outline-none focus:border-[#B49A6A]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#242321] text-[#F8F5EF] text-xs font-semibold uppercase tracking-wider hover:bg-[#B49A6A]"
                >
                  Uygula
                </button>
              </form>

              <div className="space-y-3 text-xs text-[#5A5652]">
                <div className="flex justify-between">
                  <span>Ara Toplam</span>
                  <span className="text-[#242321] font-medium">₺{totalPrice.toLocaleString('tr-TR')}</span>
                </div>
                {tieredDiscountPercent > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> Çok Al Az Öde (%{tieredDiscountPercent})</span>
                    <span>-₺{tieredDiscountAmount.toLocaleString('tr-TR')}</span>
                  </div>
                )}
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> Kupon ({appliedCoupon.code})</span>
                    <span>-₺{appliedCoupon.amount.toLocaleString('tr-TR')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tahmini Kargo</span>
                  <span>{freeShippingRemaining === 0 ? 'Ücretsiz' : '₺49'}</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-[#242321] pt-3 border-t border-[#E6DFD5]">
                  <span>Ödenecek Tutar</span>
                  <span className="font-serif text-2xl text-[#B49A6A]">₺{finalPrice.toLocaleString('tr-TR')}</span>
                </div>
              </div>

              <Link
                href="/odeme"
                className="w-full flex items-center justify-center gap-2 py-4 bg-[#242321] text-[#F8F5EF] text-xs font-semibold uppercase tracking-widest hover:bg-[#B49A6A] transition-colors shadow-lg"
              >
                <span>Ödemeye Geç</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#8C857B] pt-2">
                <ShieldCheck className="w-4 h-4 text-[#B49A6A]" />
                <span>256-Bit SSL Sertifikalı Güvenli Ödeme</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
