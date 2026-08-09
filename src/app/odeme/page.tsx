'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, CheckCircle2, Lock, CreditCard, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const { showToast } = useToast();

  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Delivery, 2: Payment, 3: Completed
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: 'Erzurum',
    district: 'Yakutiye',
    address: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    paymentMethod: 'credit_card',
  });
  const [placedOrderNumber, setPlacedOrderNumber] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.address) {
      showToast('Lütfen gerekli adres alanlarını doldurunuz.', 'error');
      return;
    }
    setStep(2);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderNo = `VER-${Math.floor(100000 + Math.random() * 900000)}`;
    setPlacedOrderNumber(orderNo);
    clearCart();
    setStep(3);
    showToast(`Siparişiniz alındı! Sipariş No: ${orderNo}`, 'success');
  };

  if (step === 3) {
    return (
      <div className="py-20 bg-[#F8F5EF] min-h-screen flex items-center justify-center">
        <div className="max-w-lg w-full bg-[#FFFFFF] p-8 sm:p-12 border border-[#E6DFD5] text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#B49A6A] font-semibold">TEŞEKKÜR EDERİZ</span>
            <h1 className="font-serif text-3xl font-normal text-[#242321]">Siparişiniz Alındı</h1>
            <p className="text-xs text-[#5A5652] leading-relaxed">
              Sipariş Numaranız: <strong className="text-[#242321]">{placedOrderNumber}</strong>
            </p>
          </div>

          <p className="text-xs text-[#8C857B] leading-relaxed">
            Sipariş detaylarınız <strong>{formData.email}</strong> adresine gönderildi. Ürününüz özenli Vera hediye paketiyle hazırlanıp kargoya verilecektir.
          </p>

          <Link
            href="/"
            className="inline-block px-8 py-3.5 bg-[#242321] text-[#F8F5EF] text-xs font-semibold uppercase tracking-widest hover:bg-[#B49A6A] transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-[#F8F5EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Checkout Header Step Bar */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest">
            <span className={step >= 1 ? 'text-[#B49A6A]' : 'text-[#8C857B]'}>1. Teslimat Adresi</span>
            <span className="text-[#8C857B]">—</span>
            <span className={step >= 2 ? 'text-[#B49A6A]' : 'text-[#8C857B]'}>2. Ödeme Bilgileri</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Form Area */}
          <div className="lg:col-span-8 bg-[#FFFFFF] p-6 sm:p-10 border border-[#E6DFD5]">
            {step === 1 ? (
              <form onSubmit={handleDeliverySubmit} className="space-y-6">
                <h2 className="font-serif text-2xl text-[#242321] pb-4 border-b border-[#E6DFD5]">
                  Teslimat ve İletişim Bilgileri
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#5A5652] mb-1">Ad *</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full py-2.5 px-3 bg-[#F8F5EF] border border-[#E6DFD5] text-xs focus:outline-none focus:border-[#B49A6A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#5A5652] mb-1">Soyad *</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full py-2.5 px-3 bg-[#F8F5EF] border border-[#E6DFD5] text-xs focus:outline-none focus:border-[#B49A6A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#5A5652] mb-1">E-Posta Adresi *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full py-2.5 px-3 bg-[#F8F5EF] border border-[#E6DFD5] text-xs focus:outline-none focus:border-[#B49A6A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#5A5652] mb-1">Telefon *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="05XX XXX XX XX"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full py-2.5 px-3 bg-[#F8F5EF] border border-[#E6DFD5] text-xs focus:outline-none focus:border-[#B49A6A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#5A5652] mb-1">İl *</label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full py-2.5 px-3 bg-[#F8F5EF] border border-[#E6DFD5] text-xs focus:outline-none focus:border-[#B49A6A]"
                    >
                      <option value="Erzurum">Erzurum</option>
                      <option value="İstanbul">İstanbul</option>
                      <option value="Ankara">Ankara</option>
                      <option value="İzmir">İzmir</option>
                      <option value="Bursa">Bursa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#5A5652] mb-1">İlçe *</label>
                    <input
                      type="text"
                      name="district"
                      required
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full py-2.5 px-3 bg-[#F8F5EF] border border-[#E6DFD5] text-xs focus:outline-none focus:border-[#B49A6A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#5A5652] mb-1">Açık Adres *</label>
                  <textarea
                    name="address"
                    required
                    rows={3}
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full py-2.5 px-3 bg-[#F8F5EF] border border-[#E6DFD5] text-xs focus:outline-none focus:border-[#B49A6A]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#242321] text-[#F8F5EF] text-xs font-semibold uppercase tracking-widest hover:bg-[#B49A6A] transition-colors"
                >
                  Ödeme Adımına Geç
                </button>
              </form>
            ) : (
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#E6DFD5]">
                  <h2 className="font-serif text-2xl text-[#242321]">Ödeme Yöntemi</h2>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-[#B49A6A] underline"
                  >
                    ← Adresi Düzenle
                  </button>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center gap-3 p-4 border border-[#B49A6A] bg-[#F8F5EF] cursor-pointer">
                    <input type="radio" checked readOnly className="accent-[#B49A6A]" />
                    <CreditCard className="w-5 h-5 text-[#B49A6A]" />
                    <span className="text-xs font-semibold text-[#242321]">Kredi / Banka Kartı (İyzico &amp; 3D Secure)</span>
                  </label>
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#5A5652] mb-1">Kart Üzerindeki İsim *</label>
                    <input
                      type="text"
                      required
                      placeholder="AYŞE YILMAZ"
                      className="w-full py-2.5 px-3 bg-[#F8F5EF] border border-[#E6DFD5] text-xs focus:outline-none focus:border-[#B49A6A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#5A5652] mb-1">Kart Numarası *</label>
                    <input
                      type="text"
                      required
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      className="w-full py-2.5 px-3 bg-[#F8F5EF] border border-[#E6DFD5] text-xs focus:outline-none focus:border-[#B49A6A]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#5A5652] mb-1">Son Kullanma (AA/YY) *</label>
                      <input
                        type="text"
                        required
                        placeholder="12/28"
                        maxLength={5}
                        className="w-full py-2.5 px-3 bg-[#F8F5EF] border border-[#E6DFD5] text-xs focus:outline-none focus:border-[#B49A6A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#5A5652] mb-1">CVC / CVV *</label>
                      <input
                        type="password"
                        required
                        placeholder="123"
                        maxLength={4}
                        className="w-full py-2.5 px-3 bg-[#F8F5EF] border border-[#E6DFD5] text-xs focus:outline-none focus:border-[#B49A6A]"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#242321] text-[#F8F5EF] text-xs font-semibold uppercase tracking-widest hover:bg-[#B49A6A] transition-colors shadow-xl flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Siparişi Onayla &amp; ₺{totalPrice.toLocaleString('tr-TR')} Öde</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Order Items Summary */}
          <div className="lg:col-span-4 bg-[#FFFFFF] p-6 border border-[#E6DFD5] space-y-4">
            <h3 className="font-serif text-lg text-[#242321] pb-2 border-b border-[#E6DFD5]">
              Siparişiniz ({cart.length} Ürün)
            </h3>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <div className="relative w-12 h-14 bg-[#E8DED1] shrink-0">
                    <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 text-xs">
                    <h4 className="font-serif text-[#242321] line-clamp-1">{item.product.name}</h4>
                    <p className="text-[#8C857B]">Adet: {item.quantity} • {item.selectedColor.name}</p>
                  </div>
                  <span className="text-xs font-semibold text-[#242321]">
                    ₺{(item.product.price * item.quantity).toLocaleString('tr-TR')}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#E6DFD5] space-y-2 text-xs text-[#5A5652]">
              <div className="flex justify-between">
                <span>Kargo</span>
                <span className="text-emerald-700 font-semibold">Ücretsiz</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[#242321] pt-2 border-t border-[#E6DFD5]">
                <span>Toplam</span>
                <span className="font-serif text-xl text-[#B49A6A]">₺{totalPrice.toLocaleString('tr-TR')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
