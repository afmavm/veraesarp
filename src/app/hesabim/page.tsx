'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, Package, Heart, MapPin, LogOut, ChevronRight } from 'lucide-react';
import { MOCK_ORDERS } from '@/lib/data/mock-data';
import { useWishlist } from '@/context/WishlistContext';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders');
  const { wishlist } = useWishlist();

  return (
    <div className="py-12 bg-[#F8F5EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#242321] mb-8 pb-4 border-b border-[#E6DFD5]">
          Hesabım
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Navigation */}
          <aside className="lg:col-span-3 bg-[#FFFFFF] p-6 border border-[#E6DFD5] space-y-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between p-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === 'orders' ? 'bg-[#242321] text-[#F8F5EF]' : 'text-[#5A5652] hover:bg-[#F8F5EF]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>Siparişlerim</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>

            <Link
              href="/favorilerim"
              className="w-full flex items-center justify-between p-3 text-xs font-semibold uppercase tracking-wider text-[#5A5652] hover:bg-[#F8F5EF] transition-colors"
            >
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>Favorilerim ({wishlist.length})</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center justify-between p-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === 'addresses' ? 'bg-[#242321] text-[#F8F5EF]' : 'text-[#5A5652] hover:bg-[#F8F5EF]'
              }`}
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Adreslerim</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center justify-between p-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === 'profile' ? 'bg-[#242321] text-[#F8F5EF]' : 'text-[#5A5652] hover:bg-[#F8F5EF]'
              }`}
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Profil Bilgileri</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="pt-4 border-t border-[#E6DFD5]">
              <Link
                href="/admin"
                className="w-full flex items-center gap-2 p-3 text-xs font-bold uppercase tracking-wider text-[#B49A6A] hover:bg-[#F8F5EF]"
              >
                <span>Admin Paneline Git →</span>
              </Link>
            </div>
          </aside>

          {/* Details */}
          <main className="lg:col-span-9 bg-[#FFFFFF] p-6 sm:p-8 border border-[#E6DFD5]">
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="font-serif text-2xl font-normal text-[#242321]">Geçmiş Siparişleriniz</h2>
                <div className="space-y-4">
                  {MOCK_ORDERS.map((ord) => (
                    <div key={ord.id} className="p-4 border border-[#E6DFD5] space-y-2">
                      <div className="flex justify-between items-center text-xs font-semibold text-[#242321]">
                        <span>{ord.orderNumber} ({ord.createdAt})</span>
                        <span className="text-[#B49A6A]">₺{ord.total.toLocaleString('tr-TR')}</span>
                      </div>
                      <p className="text-xs text-[#5A5652]">Durum: <strong className="text-emerald-700">{ord.status}</strong></p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-4">
                <h2 className="font-serif text-2xl font-normal text-[#242321]">Kayıtlı Adresleriniz</h2>
                <div className="p-4 border border-[#E6DFD5] text-xs text-[#5A5652] space-y-1">
                  <strong className="text-[#242321] block font-semibold text-sm mb-1">Ev Adresi (Varsayılan)</strong>
                  <p>Ayşe Yılmaz</p>
                  <p>Bağdat Caddesi No:142 D:8</p>
                  <p>Kadıköy / İstanbul</p>
                  <p>Tel: 0532 123 45 67</p>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-4">
                <h2 className="font-serif text-2xl font-normal text-[#242321]">Profil Bilgileri</h2>
                <div className="text-xs text-[#5A5652] space-y-2">
                  <p><strong>Ad Soyad:</strong> Ayşe Yılmaz</p>
                  <p><strong>E-Posta:</strong> ayse.yilmaz@example.com</p>
                  <p><strong>Üyelik Tipi:</strong> Premium Müşteri</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
