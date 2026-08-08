'use client';

import React from 'react';
import Image from 'next/image';
import {
  DollarSign,
  ShoppingBag,
  Package,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  Users,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { Product, CustomerOrder } from '@/lib/types/ecommerce';

interface AdminOverviewProps {
  products: Product[];
  orders: CustomerOrder[];
  onNavigateTab: (tab: 'products' | 'orders') => void;
}

export default function AdminOverview({ products, orders, onNavigateTab }: AdminOverviewProps) {
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const lowStockProducts = products.filter((p) => p.stock <= 15);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-8 bg-gradient-to-r from-[#242321] via-[#1C1B1A] to-[#242321] border border-[#B49A6A]/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#B49A6A]/20 border border-[#B49A6A]/40 text-[#B49A6A] text-[10px] font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CANLI MAĞAZA METRİKLERİ</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#F8F5EF]">
            Hoş Geldiniz, Vera Executive Suite
          </h1>
          <p className="text-xs text-[#8C857B] max-w-xl leading-relaxed">
            E-ticaret platformunuz %99.8 çalışma süresi ve 256-bit İyzico/PayTR güvenliği ile kesintisiz satış yapmaya devam ediyor.
          </p>
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="p-4 bg-[#171615] border border-[#3A3835] text-center">
            <span className="text-[10px] text-[#8C857B] block uppercase tracking-wider">Dönüşüm Oranı</span>
            <span className="font-serif text-2xl font-bold text-emerald-400">%3.82</span>
          </div>
          <div className="p-4 bg-[#171615] border border-[#3A3835] text-center">
            <span className="text-[10px] text-[#8C857B] block uppercase tracking-wider">Müşteri Puanı</span>
            <span className="font-serif text-2xl font-bold text-[#B49A6A]">4.9 / 5.0</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-[#1C1B1A] border border-[#2A2825] space-y-3">
          <div className="flex justify-between items-center text-[#B49A6A]">
            <span className="text-xs uppercase tracking-widest font-semibold">Toplam Ciro</span>
            <div className="w-9 h-9 rounded-full bg-[#B49A6A]/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="font-serif text-3xl font-normal text-[#F8F5EF]">
            ₺{totalRevenue.toLocaleString('tr-TR')}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+%24.5 geçen haftaya göre</span>
          </div>
        </div>

        <div className="p-6 bg-[#1C1B1A] border border-[#2A2825] space-y-3">
          <div className="flex justify-between items-center text-[#B49A6A]">
            <span className="text-xs uppercase tracking-widest font-semibold">Sipariş Sayısı</span>
            <div className="w-9 h-9 rounded-full bg-[#B49A6A]/10 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="font-serif text-3xl font-normal text-[#F8F5EF]">{totalOrders}</div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#8C857B]">
            <Clock className="w-3.5 h-3.5 text-[#B49A6A]" />
            <span>%100 Tamamlanan Ödemeler</span>
          </div>
        </div>

        <div className="p-6 bg-[#1C1B1A] border border-[#2A2825] space-y-3">
          <div className="flex justify-between items-center text-[#B49A6A]">
            <span className="text-xs uppercase tracking-widest font-semibold">Ort. Sepet Tutarı</span>
            <div className="w-9 h-9 rounded-full bg-[#B49A6A]/10 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="font-serif text-3xl font-normal text-[#F8F5EF]">
            ₺{avgOrderValue.toLocaleString('tr-TR')}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Yüksek sepet ortalaması</span>
          </div>
        </div>

        <div className="p-6 bg-[#1C1B1A] border border-[#2A2825] space-y-3">
          <div className="flex justify-between items-center text-[#B49A6A]">
            <span className="text-xs uppercase tracking-widest font-semibold">Kritik Stok Uyarısı</span>
            <div className="w-9 h-9 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="font-serif text-3xl font-normal text-[#F8F5EF]">
            {lowStockProducts.length} <span className="text-xs text-[#8C857B]">Ürün</span>
          </div>
          <button
            onClick={() => onNavigateTab('products')}
            className="text-[11px] text-[#B49A6A] hover:underline flex items-center gap-1 font-medium"
          >
            <span>Stokları İncele</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Middle Grid: Sales Trend Visualization & Low Stock Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sales Trend Simulation Visualizer */}
        <div className="lg:col-span-8 bg-[#1C1B1A] border border-[#2A2825] p-6 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-[#2A2825]">
            <div>
              <h3 className="font-serif text-xl text-[#F8F5EF] font-normal">Haftalık Satış Hacmi &amp; Ciro İvmesi</h3>
              <p className="text-xs text-[#8C857B]">Son 7 günün günlük ciro dağılımı (TL)</p>
            </div>
            <span className="text-xs text-[#B49A6A] font-semibold bg-[#242321] px-3 py-1 border border-[#3A3835]">
              Ağustos 2026
            </span>
          </div>

          {/* Custom Styled Bar Chart Visualization */}
          <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
            {[
              { day: 'Pzt', val: 12400, height: '45%' },
              { day: 'Sal', val: 18900, height: '65%' },
              { day: 'Çar', val: 15200, height: '55%' },
              { day: 'Per', val: 24500, height: '85%' },
              { day: 'Cum', val: 28900, height: '95%' },
              { day: 'Cmt', val: 21000, height: '75%' },
              { day: 'Paz', val: 19500, height: '70%' },
            ].map((bar) => (
              <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="text-[10px] text-[#B49A6A] opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                  ₺{bar.val.toLocaleString('tr-TR')}
                </div>
                <div
                  className="w-full bg-gradient-to-t from-[#B49A6A]/30 to-[#B49A6A] hover:bg-[#F8F5EF] transition-all rounded-t-sm"
                  style={{ height: bar.height }}
                />
                <span className="text-xs text-[#8C857B] font-medium">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts Box */}
        <div className="lg:col-span-4 bg-[#1C1B1A] border border-[#2A2825] p-6 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#2A2825]">
            <h3 className="font-serif text-lg text-[#F8F5EF]">Kritik Stok Takibi</h3>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 font-bold">
              {lowStockProducts.length} Ürün
            </span>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {lowStockProducts.map((prod) => (
              <div key={prod.id} className="p-3 bg-[#242321] border border-[#2A2825] flex items-center justify-between gap-3">
                <div className="relative w-10 h-12 bg-[#171615] shrink-0">
                  <Image src={prod.images[0]} alt={prod.name} fill className="object-cover" />
                </div>
                <div className="flex-1 text-xs">
                  <h4 className="font-serif text-[#F8F5EF] line-clamp-1">{prod.name}</h4>
                  <span className="text-[10px] text-[#8C857B]">SKU: {prod.sku}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-amber-400 block">{prod.stock} adet</span>
                  <span className="text-[9px] text-[#8C857B]">Kritik</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigateTab('products')}
            className="w-full py-2.5 bg-[#242321] border border-[#3A3835] text-xs text-[#E8DED1] font-semibold uppercase tracking-wider hover:border-[#B49A6A] hover:text-[#B49A6A] transition-colors"
          >
            Tüm Stokları Yönet
          </button>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="bg-[#1C1B1A] border border-[#2A2825] p-6 space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-[#2A2825]">
          <div>
            <h3 className="font-serif text-xl text-[#F8F5EF]">Son Alışveriş İşlemleri</h3>
            <p className="text-xs text-[#8C857B]">Müşterilerinizin gerçekleştirdiği canlı siparişler</p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs text-[#B49A6A] font-semibold uppercase tracking-wider hover:underline"
          >
            Tüm Siparişler →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#E8DED1]">
            <thead className="bg-[#242321] text-[#B49A6A] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Sipariş kODU</th>
                <th className="p-3">Müşteri</th>
                <th className="p-3">İletişim</th>
                <th className="p-3">Şehir</th>
                <th className="p-3">Tutar</th>
                <th className="p-3">Ödeme</th>
                <th className="p-3">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2825]">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#242321] transition-colors">
                  <td className="p-3 font-semibold text-[#F8F5EF]">{ord.orderNumber}</td>
                  <td className="p-3 font-medium">{ord.customerName}</td>
                  <td className="p-3 text-[#8C857B]">{ord.email}</td>
                  <td className="p-3">{ord.address.city}</td>
                  <td className="p-3 font-semibold text-[#B49A6A]">₺{ord.total.toLocaleString('tr-TR')}</td>
                  <td className="p-3 text-[11px] text-[#8C857B]">{ord.paymentMethod}</td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded ${
                        ord.status === 'Hazırlanıyor'
                          ? 'bg-amber-900/60 text-amber-300'
                          : ord.status === 'Kargoda'
                          ? 'bg-blue-900/60 text-blue-300'
                          : 'bg-emerald-900/60 text-emerald-300'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
