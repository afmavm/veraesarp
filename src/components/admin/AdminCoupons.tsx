'use client';

import React, { useState } from 'react';
import { Tag, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([
    { id: '1', code: 'VERA10', discount: '%10 İndirim', minSpend: 1000, usageCount: 48, status: 'Aktif' },
    { id: '2', code: 'HOŞGELDİN', discount: '%15 İndirim', minSpend: 1500, usageCount: 112, status: 'Aktif' },
    { id: '3', code: 'MILANO2026', discount: '₺250 Sabit İndirim', minSpend: 2000, usageCount: 29, status: 'Aktif' },
  ]);
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('%10');
  const { showToast } = useToast();

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCode.trim()) {
      setCoupons([
        ...coupons,
        {
          id: Date.now().toString(),
          code: newCode.toUpperCase(),
          discount: `${newDiscount} İndirim`,
          minSpend: 1000,
          usageCount: 0,
          status: 'Aktif',
        },
      ]);
      setNewCode('');
      showToast('Yeni indirim kuponu oluşturuldu!', 'success');
    }
  };

  const handleDeleteCoupon = (id: string) => {
    setCoupons(coupons.filter((c) => c.id !== id));
    showToast('Kupon kodu silindi.', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-[#2A2825]">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#F8F5EF]">Kupon &amp; Kampanya Yönetimi</h1>
          <p className="text-xs text-[#8C857B]">Özel kupon kodları tanımlayın, promosyon ve kampanya şartlarını belirleyin.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Active Coupons List */}
        <div className="lg:col-span-8 bg-[#1C1B1A] border border-[#2A2825] p-6 space-y-4">
          <h3 className="font-serif text-xl font-normal text-[#F8F5EF]">Aktif Kuponlar</h3>

          <div className="divide-y divide-[#2A2825]">
            {coupons.map((c) => (
              <div key={c.id} className="py-4 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-bold text-[#B49A6A] bg-[#242321] px-3 py-1 border border-[#3A3835]">
                      {c.code}
                    </span>
                    <span className="text-xs font-semibold text-[#F8F5EF]">{c.discount}</span>
                  </div>
                  <p className="text-[11px] text-[#8C857B]">
                    Min. Sepet: ₺{c.minSpend.toLocaleString('tr-TR')} • Kullanım: <strong>{c.usageCount} kez</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 bg-emerald-900/40 text-emerald-300 text-[10px] uppercase font-bold rounded">
                    {c.status}
                  </span>
                  <button
                    onClick={() => handleDeleteCoupon(c.id)}
                    className="p-2 text-rose-400 hover:text-rose-300"
                    title="Kuponu Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Coupon Form */}
        <div className="lg:col-span-4 bg-[#1C1B1A] border border-[#2A2825] p-6 space-y-4">
          <h3 className="font-serif text-lg text-[#F8F5EF]">Yeni Kupon Tanımla</h3>

          <form onSubmit={handleAddCoupon} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#8C857B] mb-1">Kupon Kodu *</label>
              <input
                type="text"
                required
                placeholder="ör: SEZON20"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] font-mono uppercase focus:border-[#B49A6A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#8C857B] mb-1">İndirim Oranı *</label>
              <input
                type="text"
                required
                placeholder="ör: %20"
                value={newDiscount}
                onChange={(e) => setNewDiscount(e.target.value)}
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#B49A6A] text-[#F8F5EF] text-xs font-semibold uppercase tracking-wider hover:bg-[#988052]"
            >
              Kuponu Oluştur
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
