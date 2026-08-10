'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, CheckCircle2, Lock, CreditCard, Truck, Landmark, Copy, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import { CustomerOrder } from '@/lib/types/ecommerce';
import { IL_LISTESI, getIlceler } from '@/lib/data/turkey-locations';
import { CargoCarrier } from '@/components/admin/AdminCargoSettings';

export default function CheckoutPage() {
  const { cart, totalPrice, freeShippingRemaining, clearCart } = useCart();
  const { addOrder } = useData();
  const { showToast } = useToast();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'bank_transfer'>('credit_card');
  const [copiedIban, setCopiedIban] = useState(false);

  // Kargo Firma Tanımları (LocalStorage'dan dinamik yüklenir)
  const [carriers, setCarriers] = useState<CargoCarrier[]>([
    { id: 'yurtici', name: 'Yurtiçi Kargo', logo: '🟡', fee: 49, eta: '1-2 iş günü', isActive: true },
    { id: 'mng', name: 'MNG Kargo', logo: '🔵', fee: 45, eta: '1-2 iş günü', isActive: true },
    { id: 'aras', name: 'Aras Kargo', logo: '🟠', fee: 44, eta: '1-3 iş günü', isActive: true },
    { id: 'ptt', name: 'PTT Kargo', logo: '⚫', fee: 39, eta: '2-4 iş günü', isActive: true },
    { id: 'surat', name: 'Sürat Kargo', logo: '🔴', fee: 47, eta: '1-2 iş günü', isActive: true },
  ]);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(1000);
  const [selectedCarrierId, setSelectedCarrierId] = useState('yurtici');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('veraesarp_carriers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.carriers && Array.isArray(parsed.carriers)) {
          const activeOnly = parsed.carriers.filter((c: CargoCarrier) => c.isActive !== false);
          if (activeOnly.length > 0) {
            setCarriers(activeOnly);
            setSelectedCarrierId((prevId) => {
              const exists = activeOnly.some((c: CargoCarrier) => c.id === prevId);
              return exists ? prevId : activeOnly[0].id;
            });
          }
        }
        if (parsed.freeShippingThreshold) {
          setFreeShippingThreshold(Number(parsed.freeShippingThreshold));
        }
      }
    } catch (e) {}
  }, []);

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

  // Kargo ücreti hesaplama
  const selectedCarrier = carriers.find((c) => c.id === selectedCarrierId) || carriers[0] || {
    id: 'standard', name: 'Kargo', logo: '🚚', fee: 40, eta: '1-3 iş günü', isActive: true
  };
  const isFreeShipping = totalPrice >= freeShippingThreshold;
  const shippingFee = isFreeShipping ? 0 : selectedCarrier.fee;
  const grandTotal = totalPrice + shippingFee;

  // İle göre ilçe listesini hesapla
  const ilceler = useMemo(() => getIlceler(formData.city), [formData.city]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'city') {
      // İl değişince ilçeyi o ilin ilk ilçesine sıfırla
      const newIlceler = getIlceler(value);
      setFormData({ ...formData, city: value, district: newIlceler[0] || '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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

    const newOrder: CustomerOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNo,
      customerName: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phone: formData.phone,
      address: {
        fullAddress: formData.address,
        district: formData.district,
        city: formData.city,
      },
      items: cart.map((item) => ({
        id: item.product.id,
        productId: item.product.id,
        productName: item.product.name,
        color: typeof item.selectedColor === 'string' ? item.selectedColor : (item.selectedColor as any)?.name || 'Standart',
        quantity: item.quantity,
        price: item.product.price,
        image: item.product.images[0] || '',
      })),
      subtotal: totalPrice,
      shipping: shippingFee,
      discount: 0,
      total: grandTotal,
      status: 'Hazırlanıyor',
      paymentMethod: paymentMethod === 'credit_card' ? 'Kredi Kartı' : 'Banka Havalesi',
      createdAt: new Date().toISOString().slice(0, 10),
    };

    addOrder(newOrder);
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
                      {IL_LISTESI.map((il) => (
                        <option key={il} value={il}>{il}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#5A5652] mb-1">İlçe *</label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full py-2.5 px-3 bg-[#F8F5EF] border border-[#E6DFD5] text-xs focus:outline-none focus:border-[#B49A6A]"
                    >
                      {ilceler.map((ilce) => (
                        <option key={ilce} value={ilce}>{ilce}</option>
                      ))}
                    </select>
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

                {/* Kargo Firma Seçimi */}
                <div className="space-y-3">
                  <h3 className="text-xs uppercase tracking-wider font-semibold text-[#5A5652] flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#B49A6A]" />
                    Kargo Firması Seçin
                  </h3>

                  {isFreeShipping && (
                    <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-700">
                      <span>🎉</span>
                      <span><strong>{freeShippingThreshold.toLocaleString('tr-TR')} ₺ ve üzeri alışveriş</strong> yapıyorsunuz — kargo ücretsizdir!</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    {carriers.map((carrier) => (
                      <label
                        key={carrier.id}
                        className={`flex items-center justify-between gap-3 p-3 border cursor-pointer transition-all ${
                          selectedCarrierId === carrier.id
                            ? 'border-[#B49A6A] bg-[#F8F5EF]'
                            : 'border-[#E6DFD5] bg-white hover:border-[#B49A6A]/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="carrier"
                            value={carrier.id}
                            checked={selectedCarrierId === carrier.id}
                            onChange={() => setSelectedCarrierId(carrier.id)}
                            className="accent-[#B49A6A]"
                          />
                          {carrier.logoImage ? (
                            <div className="relative w-8 h-8 rounded border border-[#E6DFD5] bg-white shrink-0 overflow-hidden flex items-center justify-center p-0.5">
                              <Image src={carrier.logoImage} alt={carrier.name} fill className="object-contain" unoptimized />
                            </div>
                          ) : (
                            <span className="text-base shrink-0">{carrier.logo}</span>
                          )}
                          <div>
                            <span className="text-xs font-semibold text-[#242321]">{carrier.name}</span>
                            <span className="block text-[10px] text-[#8C857B]">Tahmini teslimat: {carrier.eta}</span>
                          </div>
                        </div>
                        <span className={`text-xs font-bold shrink-0 ${
                          isFreeShipping ? 'text-emerald-600 line-through opacity-60' : 'text-[#242321]'
                        }`}>
                          ₺{carrier.fee}
                        </span>
                        {isFreeShipping && (
                          <span className="text-[10px] font-bold text-emerald-600 shrink-0">ÜCRETSİZ</span>
                        )}
                      </label>
                    ))}
                  </div>
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

                <div className="space-y-3">
                  {/* Kredi Kartı Seçeneği */}
                  <label
                    className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${
                      paymentMethod === 'credit_card'
                        ? 'border-[#B49A6A] bg-[#F8F5EF]'
                        : 'border-[#E6DFD5] bg-white hover:border-[#B49A6A]/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit_card"
                      checked={paymentMethod === 'credit_card'}
                      onChange={() => setPaymentMethod('credit_card')}
                      className="accent-[#B49A6A]"
                    />
                    <CreditCard className="w-5 h-5 text-[#B49A6A]" />
                    <div>
                      <span className="text-xs font-semibold text-[#242321]">Kredi / Banka Kartı</span>
                      <span className="block text-[10px] text-[#8C857B]">İyzico & 3D Secure Güvenceli</span>
                    </div>
                  </label>

                  {/* Banka Havalesi Seçeneği */}
                  <label
                    className={`flex items-center gap-3 p-4 border cursor-pointer transition-colors ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-[#B49A6A] bg-[#F8F5EF]'
                        : 'border-[#E6DFD5] bg-white hover:border-[#B49A6A]/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="accent-[#B49A6A]"
                    />
                    <Landmark className="w-5 h-5 text-[#B49A6A]" />
                    <div>
                      <span className="text-xs font-semibold text-[#242321]">Banka Havalesi / EFT</span>
                      <span className="block text-[10px] text-[#8C857B]">Siparişiniz havale onayından sonra hazırlanır</span>
                    </div>
                  </label>
                </div>

                {/* Kredi Kartı Alanları */}
                {paymentMethod === 'credit_card' && (
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
                )}

                {/* Banka Havalesi Bilgileri */}
                {paymentMethod === 'bank_transfer' && (
                  <div className="space-y-3 pt-2">
                    <p className="text-[11px] text-[#8C857B] leading-relaxed bg-amber-50 border border-amber-200 p-3">
                      ⚠️ Havale / EFT yaptıktan sonra siparişiniz 1 iş günü içinde hazırlanır.
                      Aşağıdaki hesap bilgilerini kullanın ve açıklama kısmına ad-soyadınızı yazmayı unutmayın.
                    </p>

                    {/* Hesap Kartları */}
                    {[
                      {
                        banka: 'Ziraat Bankası',
                        hesapAdi: 'Vera Eşarp Tekstil',
                        iban: 'TR12 0001 0012 3456 7890 1234 56',
                        hesapNo: '1234-5678901',
                        subesi: 'Yakutiye / Erzurum',
                        logo: '🏗️',
                      },
                      {
                        banka: 'Garanti BBVA',
                        hesapAdi: 'Vera Eşarp Tekstil',
                        iban: 'TR98 0006 2001 2345 6789 0123 45',
                        hesapNo: '2345-6789012',
                        subesi: 'Erzurum Şubesi',
                        logo: '🏦',
                      },
                    ].map((bank) => (
                      <div key={bank.banka} className="bg-[#F8F5EF] border border-[#E6DFD5] p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#242321]">{bank.logo} {bank.banka}</span>
                          <span className="text-[10px] text-[#8C857B]">{bank.subesi}</span>
                        </div>
                        <div className="text-[11px] text-[#5A5652] space-y-1">
                          <p><strong className="text-[#242321]">Hesap Adı:</strong> {bank.hesapAdi}</p>
                          <p><strong className="text-[#242321]">Hesap No:</strong> {bank.hesapNo}</p>
                          <div className="flex items-center justify-between gap-2">
                            <p><strong className="text-[#242321]">IBAN:</strong> <span className="font-mono">{bank.iban}</span></p>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(bank.iban.replace(/\s/g, ''));
                                setCopiedIban(true);
                                setTimeout(() => setCopiedIban(false), 2000);
                              }}
                              className="flex items-center gap-1 text-[10px] text-[#B49A6A] hover:underline shrink-0"
                            >
                              {copiedIban ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                              Kopyala
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    <p className="text-[10px] text-[#8C857B] text-center">
                      Havale belgesi için <strong>destek@veraesarp.com</strong> adresine e-posta gönderin.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-4 bg-[#242321] text-[#F8F5EF] text-xs font-semibold uppercase tracking-widest hover:bg-[#B49A6A] transition-colors shadow-xl flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  {paymentMethod === 'bank_transfer'
                    ? <span>Siparişi Onayla &amp; Havale Talimatını Al</span>
                    : <span>Siparişi Onayla &amp; ₺{grandTotal.toLocaleString('tr-TR')} Öde</span>
                  }
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
                <span>Ara Toplam</span>
                <span className="text-[#242321] font-medium">₺{totalPrice.toLocaleString('tr-TR')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  <span>Kargo</span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-[#8C857B] bg-[#F8F5EF] px-2 py-0.5 border border-[#E6DFD5]">
                    {selectedCarrier.logoImage ? (
                      <span className="relative w-4 h-4 inline-block">
                        <Image src={selectedCarrier.logoImage} alt={selectedCarrier.name} fill className="object-contain" unoptimized />
                      </span>
                    ) : (
                      <span>{selectedCarrier.logo}</span>
                    )}
                    <span>{selectedCarrier.name}</span>
                  </span>
                </span>
                {isFreeShipping ? (
                  <span className="text-emerald-600 font-semibold">ÜCRETSİZ</span>
                ) : (
                  <span className="text-[#242321] font-medium">₺{shippingFee.toLocaleString('tr-TR')}</span>
                )}
              </div>
              {!isFreeShipping && freeShippingThreshold > totalPrice && (
                <p className="text-[10px] text-[#8C857B]">
                  ₺{(freeShippingThreshold - totalPrice).toLocaleString('tr-TR')} daha ekleyin → kargo ücretsiz!
                </p>
              )}
              <div className="flex justify-between text-base font-semibold text-[#242321] pt-2 border-t border-[#E6DFD5]">
                <span>Toplam</span>
                <span className="font-serif text-xl text-[#B49A6A]">₺{grandTotal.toLocaleString('tr-TR')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
