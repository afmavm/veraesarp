'use client';

import React, { useState } from 'react';
import { Search, Bell, Download, Plus, User, ShieldCheck, Check } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface AdminHeaderProps {
  onOpenProductModal: () => void;
  onSearch: (query: string) => void;
}

export default function AdminHeader({ onOpenProductModal, onSearch }: AdminHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { showToast } = useToast();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleExportCSV = () => {
    showToast('Satış raporu CSV formatında dışa aktarıldı.', 'success');
  };

  return (
    <header className="bg-[#1C1B1A] border-b border-[#2A2825] px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-30">
      {/* Search Input */}
      <div className="relative w-full md:w-96">
        <input
          type="text"
          placeholder="Sipariş no, müşteri adı veya SKU ara..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full py-2.5 px-4 pr-10 bg-[#242321] border border-[#3A3835] text-xs text-[#F8F5EF] placeholder-[#8C857B] focus:outline-none focus:border-[#B49A6A]"
        />
        <Search className="w-4 h-4 text-[#8C857B] absolute right-3 top-1/2 -translate-y-1/2" />
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-4 w-full md:w-auto justify-end">
        {/* Export Button */}
        <button
          onClick={handleExportCSV}
          className="px-3.5 py-2 bg-[#242321] border border-[#3A3835] text-[#E8DED1] text-xs font-semibold uppercase tracking-wider hover:border-[#B49A6A] hover:text-[#B49A6A] transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Rapor İndir</span>
        </button>

        {/* Add Product Button */}
        <button
          onClick={onOpenProductModal}
          className="px-4 py-2 bg-[#B49A6A] text-[#F8F5EF] text-xs font-semibold uppercase tracking-wider hover:bg-[#988052] transition-colors flex items-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Ürün</span>
        </button>

        {/* Notifications Popup Trigger */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2.5 bg-[#242321] border border-[#3A3835] text-[#E8DED1] hover:text-[#B49A6A] transition-colors relative"
            aria-label="Bildirimler"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#B49A6A] animate-ping" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#B49A6A]" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#1C1B1A] border border-[#B49A6A]/40 shadow-2xl p-4 space-y-3 z-50 text-xs text-[#F8F5EF]">
              <div className="flex justify-between items-center pb-2 border-b border-[#2A2825]">
                <h4 className="font-serif font-semibold text-[#B49A6A]">Sistem Bildirimleri</h4>
                <span className="text-[10px] text-[#8C857B]">2 Yeni</span>
              </div>
              <div className="space-y-2">
                <div className="p-2.5 bg-[#242321] border-l-2 border-[#B49A6A] space-y-1">
                  <p className="font-medium text-[#F8F5EF]">Yeni Sipariş: #VER-849201</p>
                  <p className="text-[10px] text-[#8C857B]">Ayşe Yılmaız — ₺2.540 (İyzico 3D)</p>
                </div>
                <div className="p-2.5 bg-[#242321] border-l-2 border-amber-500 space-y-1">
                  <p className="font-medium text-[#F8F5EF]">Stok Uyarısı: Soirée Saten Eşarp</p>
                  <p className="text-[10px] text-[#8C857B]">Kritik stok seviyesi: 3 adet kaldı</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-[#2A2825]">
          <div className="w-9 h-9 rounded-full bg-[#B49A6A]/20 border border-[#B49A6A] flex items-center justify-center text-[#B49A6A] font-semibold text-xs">
            VA
          </div>
          <div className="hidden sm:block text-left text-xs">
            <span className="font-semibold text-[#F8F5EF] block leading-none">Vera Admin</span>
            <span className="text-[10px] text-[#8C857B] block mt-0.5">Chief E-Commerce Officer</span>
          </div>
        </div>
      </div>
    </header>
  );
}
