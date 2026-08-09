'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  Sparkles,
  Settings,
  ArrowLeft,
  Store,
  CreditCard,
  TrendingUp,
  Mail,
  Truck,
} from 'lucide-react';

export type AdminTab = 'overview' | 'products' | 'orders' | 'cargo' | 'cari' | 'customers' | 'coupons' | 'growth' | 'emails' | 'cms' | 'settings';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  pendingOrdersCount: number;
  lowStockCount: number;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  pendingOrdersCount,
  lowStockCount,
}: AdminSidebarProps) {
  const menuItems: { id: AdminTab; label: string; icon: React.ElementType; badge?: number; badgeColor?: string }[] = [
    { id: 'overview', label: 'Genel Bakış & Analiz', icon: LayoutDashboard },
    { id: 'products', label: 'Ürün & Stok Yönetimi', icon: Package, badge: lowStockCount, badgeColor: 'bg-amber-500/20 text-amber-300' },
    { id: 'orders', label: 'Siparişler & Lojistik', icon: ShoppingBag, badge: pendingOrdersCount, badgeColor: 'bg-emerald-500/20 text-emerald-300' },
    { id: 'cargo', label: 'Kargo Firma Yönetimi', icon: Truck },
    { id: 'cari', label: 'Gelişmiş Cari İşlemler', icon: CreditCard },
    { id: 'growth', label: 'Satış Stratejileri & Kampanya', icon: TrendingUp },
    { id: 'customers', label: 'Müşteri İlişkileri Yönetimi', icon: Users },
    { id: 'emails', label: 'E-Posta Bildirim Yönetimi', icon: Mail },
    { id: 'coupons', label: 'Kupon Kodları', icon: Tag },
    { id: 'cms', label: 'Görsel & Banner Yönetimi', icon: Sparkles },
    { id: 'settings', label: 'Sistem & API Ayarları', icon: Settings },
  ];

  return (
    <aside className="w-full lg:w-72 bg-[#171615] border-r border-[#2A2825] flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-[#2A2825]">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-block group">
              <span className="font-serif text-2xl tracking-[0.25em] text-[#F8F5EF] font-semibold uppercase group-hover:text-[#B49A6A] transition-colors">
                VERA
              </span>
              <span className="block text-[8px] tracking-[0.4em] text-[#B49A6A] font-sans uppercase -mt-1 font-medium">
                Y Ö N E T İ M
              </span>
            </Link>
            <span className="px-2 py-0.5 bg-[#B49A6A]/20 text-[#B49A6A] text-[10px] uppercase font-bold border border-[#B49A6A]/30">
              v2.5 Sürümü
            </span>
          </div>
          <p className="text-[11px] text-[#8C857B] mt-2 flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-[#B49A6A]" />
            <span>Merkez Mağaza &amp; Genel Merkez</span>
          </p>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1 text-xs font-semibold uppercase tracking-wider">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left transition-all ${
                  isActive
                    ? 'bg-[#B49A6A] text-[#F8F5EF] font-bold shadow-lg'
                    : 'text-[#8C857B] hover:text-[#F8F5EF] hover:bg-[#242321]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.badgeColor || 'bg-[#2A2825] text-[#F8F5EF]'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-6 border-t border-[#2A2825] space-y-3">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#242321] text-[#E8DED1] text-xs font-semibold uppercase tracking-wider border border-[#3A3835] hover:border-[#B49A6A] hover:text-[#B49A6A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Mağazaya Dön</span>
        </Link>
        <div className="text-[10px] text-[#8C857B] text-center">
          <p>© 2026 VERA EŞARP Yönetim Paneli</p>
          <p className="text-emerald-400 font-medium">256-Bit Canlı Veri Senkronizasyonu</p>
        </div>
      </div>
    </aside>
  );
}
