'use client';

import React from 'react';
import { X, Printer, ShieldCheck, Truck, Package } from 'lucide-react';
import { CustomerOrder } from '@/lib/types/ecommerce';

interface CargoLabelModalProps {
  orders: CustomerOrder[];
  isOpen: boolean;
  onClose: () => void;
}

export default function CargoLabelModal({ orders, isOpen, onClose }: CargoLabelModalProps) {
  if (!isOpen || !orders || orders.length === 0) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#FFFFFF] text-[#242321] p-6 sm:p-10 max-w-4xl w-full shadow-2xl space-y-8 my-8 border border-[#E6DFD5] relative rounded-lg">
        {/* Top Control Bar (Hidden during printing) */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E6DFD5] print:hidden">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#B49A6A]" />
            <h2 className="font-serif text-lg font-semibold text-[#242321]">
              Kargo Gönderim Etiketi Şablonu ({orders.length} Sipariş Seçildi)
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#B49A6A] text-[#F8F5EF] text-xs font-semibold uppercase tracking-wider hover:bg-[#988052] transition-colors rounded shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Yazdır / Etiket Bas (PDF)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#8C857B] hover:text-[#242321] transition-colors rounded-full hover:bg-[#F8F5EF]"
              aria-label="Kapat"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Printable Cargo Labels Container */}
        <div className="space-y-12">
          {orders.map((ord, idx) => (
            <div
              key={ord.id || idx}
              className="bg-[#FFFFFF] border-2 border-dashed border-[#242321] p-6 space-y-6 shadow-sm print:shadow-none print:border-solid print:border-black print:page-break-after-always"
            >
              {/* Header: Official Logo + Cargo Badge */}
              <div className="flex items-center justify-between pb-4 border-b-2 border-black">
                <div className="flex items-center gap-4">
                  <img
                    src="/logo.png"
                    alt="Vera Eşarp Logo"
                    className="h-14 w-auto object-contain"
                  />
                  <div>
                    <h1 className="font-serif text-2xl font-bold tracking-widest text-[#242321] uppercase">VERA EŞARP</h1>
                    <span className="text-[10px] text-[#5A5652] tracking-wider uppercase font-semibold block">
                      PREMİUM KARGO SEVKİYAT ŞABLONU
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold uppercase bg-black text-white px-3 py-1 inline-block tracking-wider">
                    {(ord as any).cargoCompany || 'YURTİÇİ KARGO'}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#242321] block mt-1">
                    SİPARİŞ NO: {ord.orderNumber}
                  </span>
                  <span className="text-[10px] text-[#5A5652] block">Tarih: {ord.createdAt}</span>
                </div>
              </div>

              {/* Main Sender & Receiver Shipping Box Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* GÖNDERİCİ (MAĞAZA BILGILERI) */}
                <div className="bg-[#F8F5EF] p-4 border border-black/20 space-y-1.5">
                  <div className="flex items-center justify-between border-b border-black/10 pb-1 mb-2">
                    <span className="font-bold text-[10px] uppercase tracking-wider text-[#8C857B]">GÖNDERİCİ (SENDER)</span>
                    <span className="text-[10px] font-bold text-[#242321]">VERA EŞARP MAĞAZA</span>
                  </div>
                  <p className="font-bold text-sm text-[#242321]">Vera Eşarp Tekstil A.Ş.</p>
                  <p className="text-[#5A5652]">Lalapaşa Mah. Pelit Meydanı Cad. No:14</p>
                  <p className="font-semibold text-[#242321]">Yakutiye / ERZURUM</p>
                  <p className="text-[#5A5652]">Müşteri Destek Tel: +90 (534) 490 25 57</p>
                  <p className="text-[10px] text-[#8C857B]">Vergi Dairesi: Aziziye V.D. - 1948201948</p>
                </div>

                {/* ALICI (MÜŞTERİ BILGILERI) */}
                <div className="bg-white p-4 border-2 border-black space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-between border-b border-black pb-1 mb-2">
                    <span className="font-bold text-[10px] uppercase tracking-wider text-black">ALICI (RECEIVER)</span>
                    <span className="text-[10px] font-bold bg-black text-white px-2 py-0.5">TESLİMAT ADRESİ</span>
                  </div>
                  <p className="font-bold text-base text-black uppercase">{ord.customerName}</p>
                  <p className="text-black font-medium leading-relaxed">{ord.address.fullAddress}</p>
                  <p className="font-bold text-sm text-black uppercase mt-1">
                    {ord.address.district} / {ord.address.city}
                  </p>
                  <p className="font-bold text-sm text-black mt-2">📱 Tel: {ord.phone}</p>
                  <p className="text-xs text-gray-600">✉️ E-Posta: {ord.email}</p>
                </div>
              </div>

              {/* Order Content Checklist & Payment Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
                <div className="sm:col-span-2 border border-black/20 p-3 bg-[#F8F5EF]/50">
                  <span className="font-bold text-[10px] uppercase tracking-wider text-[#8C857B] block mb-2">
                    📦 PAKET İÇERİĞİ KONTROL LİSTESİ ({ord.items.length} Kalem Ürün)
                  </span>
                  <div className="space-y-1.5 divide-y divide-gray-200">
                    {ord.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center pt-1 text-xs">
                        <span className="font-medium text-[#242321]">
                          {item.quantity}x {item.productName} {item.color ? `(${item.color})` : ''}
                        </span>
                        <span className="font-semibold text-[#B49A6A]">₺{(item.price * item.quantity).toLocaleString('tr-TR')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-black/20 p-3 bg-white flex flex-col justify-between text-right">
                  <div>
                    <span className="font-bold text-[10px] uppercase tracking-wider text-[#8C857B] block">ÖDEME DURUMU</span>
                    <span className="text-xs font-bold text-emerald-700 uppercase block mt-1">
                      ÖDEME ALINDI ({ord.paymentMethod})
                    </span>
                    <span className="text-[10px] text-[#5A5652] block mt-1">Kargo Tipi: Adrese Teslim</span>
                  </div>

                  <div className="border-t border-black/10 pt-2 mt-2">
                    <span className="text-[10px] text-[#8C857B] block">TOPLAM SIPARIŞ TUTARI</span>
                    <span className="font-serif text-xl font-bold text-[#242321]">₺{ord.total.toLocaleString('tr-TR')}</span>
                  </div>
                </div>
              </div>

              {/* Simulated High-Res Barcode & QR Code Section for Carrier Scanners */}
              <div className="pt-4 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-bold text-lg rounded">
                    V
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A5652] block">KARGO TAKİP NUMARASI</span>
                    <span className="font-mono text-base font-bold text-black">{ord.trackingCode || `VR-${ord.orderNumber.replace(/[^0-9]/g, '')}`}</span>
                  </div>
                </div>

                {/* Simulated Barcode Visual */}
                <div className="flex flex-col items-center">
                  <div className="h-10 w-56 bg-gradient-to-r from-black via-gray-900 to-black flex items-center justify-between px-1">
                    {Array.from({ length: 32 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-full bg-black ${i % 3 === 0 ? 'w-1 bg-white' : i % 2 === 0 ? 'w-1.5' : 'w-0.5'}`}
                      />
                    ))}
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.2em] font-bold text-black mt-1">
                    *{ord.orderNumber}*
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
