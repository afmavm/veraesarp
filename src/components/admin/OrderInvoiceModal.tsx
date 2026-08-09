'use client';

import React from 'react';
import { X, Printer, Download, ShieldCheck } from 'lucide-react';
import { CustomerOrder } from '@/lib/types/ecommerce';

interface OrderInvoiceModalProps {
  order: CustomerOrder | null;
  onClose: () => void;
}

export default function OrderInvoiceModal({ order, onClose }: OrderInvoiceModalProps) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#FFFFFF] text-[#242321] p-8 sm:p-12 max-w-2xl w-full shadow-2xl space-y-8 my-8 border border-[#E6DFD5]">
        {/* Printable Invoice Header */}
        <div className="flex justify-between items-start pb-6 border-b border-[#E6DFD5]">
          <div>
            <span className="font-serif text-3xl tracking-[0.2em] font-semibold text-[#242321]">
              VERA EŞARP
            </span>
            <span className="block text-[9px] tracking-[0.3em] text-[#B49A6A] font-sans uppercase">
              E-TİCARET FATURA VE İRSALİYE
            </span>
            <p className="text-[11px] text-[#5A5652] mt-2">
              Vera Eşarp Tekstil A.Ş. • Lalapaşa Mah. Pelit Meydanı Cad. No:14, Yakutiye / Erzurum
            </p>
          </div>

          <div className="text-right">
            <span className="font-mono text-sm font-bold text-[#B49A6A] block">
              FATURA NO: {order.orderNumber}
            </span>
            <span className="text-xs text-[#8C857B] block">Tarih: {order.createdAt}</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded inline-block mt-1">
              ÖDEME ALINDI ({order.paymentMethod})
            </span>
          </div>
        </div>

        {/* Customer Address Info */}
        <div className="grid grid-cols-2 gap-6 text-xs bg-[#F8F5EF] p-4 border border-[#E6DFD5]">
          <div>
            <h4 className="font-semibold text-[#242321] uppercase tracking-wider mb-1">Müşteri Bilgileri</h4>
            <p className="font-medium text-[#242321]">{order.customerName}</p>
            <p className="text-[#5A5652]">{order.email}</p>
            <p className="text-[#5A5652]">{order.phone}</p>
          </div>

          <div>
            <h4 className="font-semibold text-[#242321] uppercase tracking-wider mb-1">Teslimat Adresi</h4>
            <p className="text-[#5A5652]">{order.address.fullAddress}</p>
            <p className="text-[#5A5652]">{order.address.district} / {order.address.city}</p>
          </div>
        </div>

        {/* Items Table */}
        <div>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#242321] text-[#242321] uppercase font-semibold">
                <th className="py-2">Ürün Açıklaması</th>
                <th className="py-2">Renk</th>
                <th className="py-2 text-center">Miktar</th>
                <th className="py-2 text-right">Birim Fiyat</th>
                <th className="py-2 text-right">Toplam</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6DFD5]">
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-3 font-serif text-sm text-[#242321]">{item.productName}</td>
                  <td className="py-3 text-[#5A5652]">{item.color}</td>
                  <td className="py-3 text-center font-semibold">{item.quantity}</td>
                  <td className="py-3 text-right">₺{item.price.toLocaleString('tr-TR')}</td>
                  <td className="py-3 text-right font-semibold text-[#242321]">
                    ₺{(item.price * item.quantity).toLocaleString('tr-TR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Calculations */}
        <div className="flex justify-end pt-4 border-t border-[#242321]">
          <div className="w-64 space-y-1.5 text-xs text-[#5A5652]">
            <div className="flex justify-between">
              <span>Ara Toplam</span>
              <span className="font-semibold text-[#242321]">₺{order.subtotal.toLocaleString('tr-TR')}</span>
            </div>
            <div className="flex justify-between">
              <span>KDV (%20 Dahil)</span>
              <span>₺{Math.round(order.subtotal * 0.2).toLocaleString('tr-TR')}</span>
            </div>
            <div className="flex justify-between">
              <span>Kargo Ücreti</span>
              <span>{order.shipping === 0 ? 'Ücretsiz' : `₺${order.shipping}`}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#242321] pt-2 border-t border-[#E6DFD5]">
              <span>Genel Toplam</span>
              <span className="font-serif text-xl text-[#B49A6A]">₺{order.total.toLocaleString('tr-TR')}</span>
            </div>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-[#E6DFD5] print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-transparent text-[#8C857B] hover:text-[#242321] text-xs font-semibold uppercase"
          >
            Kapat
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-6 py-2.5 bg-[#242321] text-[#F8F5EF] text-xs font-semibold uppercase tracking-wider hover:bg-[#B49A6A] transition-colors flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Yazdır / PDF İndir</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
