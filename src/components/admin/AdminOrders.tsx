'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ShoppingBag, Truck, CheckCircle2, FileText, Search, MapPin, CreditCard } from 'lucide-react';
import { CustomerOrder } from '@/lib/types/ecommerce';
import { useToast } from '@/context/ToastContext';

interface AdminOrdersProps {
  orders: CustomerOrder[];
  onUpdateOrderStatus: (orderId: string, status: CustomerOrder['status']) => void;
  onOpenInvoiceModal: (order: CustomerOrder) => void;
}

export default function AdminOrders({
  orders,
  onUpdateOrderStatus,
  onOpenInvoiceModal,
}: AdminOrdersProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { showToast } = useToast();

  const filteredOrders = orders.filter((ord) => {
    if (statusFilter !== 'all' && ord.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchNo = ord.orderNumber.toLowerCase().includes(q);
      const matchName = ord.customerName.toLowerCase().includes(q);
      const matchEmail = ord.email.toLowerCase().includes(q);
      if (!matchNo && !matchName && !matchEmail) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-[#2A2825]">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#F8F5EF]">Sipariş &amp; Lojistik Yönetimi</h1>
          <p className="text-xs text-[#8C857B]">Gelen siparişlerin kargolanma süreçlerini, müşteri teslimat adreslerini ve faturaları yönetin.</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-[#1C1B1A] border border-[#2A2825] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Sipariş kODU, müşteri veya e-posta..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 px-3 pr-9 bg-[#242321] border border-[#3A3835] text-xs text-[#F8F5EF] placeholder-[#8C857B] focus:outline-none focus:border-[#B49A6A]"
          />
          <Search className="w-4 h-4 text-[#8C857B] absolute right-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs text-[#8C857B]">Durum Filtresi:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#242321] border border-[#3A3835] text-xs text-[#F8F5EF] py-2 px-3 focus:outline-none focus:border-[#B49A6A]"
          >
            <option value="all">Tüm Siparişler</option>
            <option value="Hazırlanıyor">Hazırlanıyor</option>
            <option value="Kargoda">Kargoda</option>
            <option value="Teslim Edildi">Teslim Edildi</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="p-12 bg-[#1C1B1A] border border-[#2A2825] text-center text-[#8C857B]">
            Filtrelere uygun sipariş bulunamadı.
          </div>
        ) : (
          filteredOrders.map((ord) => (
            <div key={ord.id} className="bg-[#1C1B1A] border border-[#2A2825] p-6 space-y-6 shadow-md">
              {/* Top Order Row */}
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 pb-4 border-b border-[#2A2825]">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-2xl font-semibold text-[#F8F5EF]">{ord.orderNumber}</span>
                    <span className="text-xs text-[#8C857B]">({ord.createdAt})</span>
                  </div>
                  <p className="text-xs text-[#E8DED1]">
                    Müşteri: <strong>{ord.customerName}</strong> • {ord.email} • {ord.phone}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs text-[#8C857B] block uppercase">Toplam Tutar</span>
                    <span className="font-serif text-2xl font-semibold text-[#B49A6A]">
                      ₺{ord.total.toLocaleString('tr-TR')}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-[#8C857B] uppercase">Sipariş Durumu</label>
                    <select
                      value={ord.status}
                      onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as any)}
                      className="bg-[#242321] border border-[#B49A6A] text-xs font-semibold p-2 text-[#F8F5EF] focus:outline-none"
                    >
                      <option value="Hazırlanıyor">Hazırlanıyor</option>
                      <option value="Kargoda">Kargoda</option>
                      <option value="Teslim Edildi">Teslim Edildi</option>
                    </select>
                  </div>

                  <button
                    onClick={() => onOpenInvoiceModal(ord)}
                    className="p-2.5 bg-[#242321] border border-[#3A3835] text-[#E8DED1] hover:text-[#B49A6A] hover:border-[#B49A6A] transition-colors flex items-center gap-1.5 text-xs font-semibold"
                    title="Fatura Bas"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Fatura</span>
                  </button>
                </div>
              </div>

              {/* Items & Address Details */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
                {/* Items */}
                <div className="md:col-span-7 space-y-3">
                  <span className="text-[11px] text-[#B49A6A] font-semibold uppercase tracking-wider block">
                    Sipariş Edilen Ürünler ({ord.items.length})
                  </span>
                  <div className="space-y-2">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="p-3 bg-[#242321] border border-[#2A2825] flex items-center gap-3">
                        <div className="relative w-10 h-12 bg-[#171615] shrink-0">
                          <Image src={item.image} alt={item.productName} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-serif text-[#F8F5EF] line-clamp-1">{item.productName}</h5>
                          <span className="text-[10px] text-[#8C857B]">Renk: {item.color} • Adet: {item.quantity}</span>
                        </div>
                        <span className="font-semibold text-[#B49A6A]">
                          ₺{(item.price * item.quantity).toLocaleString('tr-TR')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address & Payment */}
                <div className="md:col-span-5 space-y-3 bg-[#242321] p-4 border border-[#2A2825]">
                  <span className="text-[11px] text-[#B49A6A] font-semibold uppercase tracking-wider block flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Teslimat &amp; Ödeme Detayı</span>
                  </span>
                  <div className="text-[#E8DED1] space-y-1 leading-relaxed">
                    <p><strong>Adres:</strong> {ord.address.fullAddress}</p>
                    <p><strong>İlçe/İl:</strong> {ord.address.district} / {ord.address.city}</p>
                    <p><strong>Ödeme Tipi:</strong> {ord.paymentMethod}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
