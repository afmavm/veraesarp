'use client';

import React, { useState } from 'react';
import { Tag, Plus, Trash2, Edit, CheckCircle2, X, Percent, DollarSign } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { Coupon } from '@/lib/types/ecommerce';
import { useToast } from '@/context/ToastContext';

export default function AdminCoupons() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon, toggleCouponStatus } = useData();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 10,
    minSpend: 1000,
  });

  const handleOpenModal = (couponToEdit?: Coupon) => {
    if (couponToEdit) {
      setEditingCoupon(couponToEdit);
      setFormData({
        code: couponToEdit.code,
        discountType: couponToEdit.discountType,
        discountValue: couponToEdit.discountValue,
        minSpend: couponToEdit.minSpend,
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: '',
        discountType: 'percentage',
        discountValue: 10,
        minSpend: 1000,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      showToast('Lütfen kupon kodunu giriniz.', 'error');
      return;
    }

    const discountText =
      formData.discountType === 'percentage'
        ? `%${formData.discountValue} İndirim`
        : `₺${formData.discountValue} Sabit İndirim`;

    if (editingCoupon) {
      updateCoupon(editingCoupon.id, {
        code: formData.code.toUpperCase(),
        discountText,
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minSpend: Number(formData.minSpend),
      });
      showToast(`${formData.code.toUpperCase()} kuponu güncellendi!`, 'success');
    } else {
      addCoupon({
        code: formData.code.toUpperCase(),
        discountText,
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minSpend: Number(formData.minSpend),
      });
      showToast(`${formData.code.toUpperCase()} kuponu başarıyla tanımlandı!`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, code: string) => {
    deleteCoupon(id);
    showToast(`${code} kuponu silindi.`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-[#2A2825]">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#F8F5EF]">Kupon &amp; Promosyon Yönetimi</h1>
          <p className="text-xs text-[#8C857B]">İndirim kuponları ekleyin, düzenleyin, silin ve sepet şartlarını belirleyin.</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-3 bg-[#B49A6A] text-[#F8F5EF] text-xs font-semibold uppercase tracking-wider hover:bg-[#988052] transition-colors flex items-center justify-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Kupon Tanımla</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-[#1C1B1A] border border-[#2A2825] overflow-hidden shadow-xl">
        <div className="p-4 bg-[#242321] border-b border-[#2A2825] flex justify-between items-center">
          <h3 className="font-serif text-lg text-[#F8F5EF]">Sistemdeki Aktif &amp; Pasif Kuponlar ({coupons.length})</h3>
        </div>

        <div className="divide-y divide-[#2A2825]">
          {coupons.map((c) => (
            <div key={c.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#242321] transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-base font-bold text-[#B49A6A] bg-[#171615] px-3 py-1 border border-[#3A3835]">
                    {c.code}
                  </span>
                  <span className="text-sm font-semibold text-[#F8F5EF]">{c.discountText}</span>
                </div>
                <p className="text-xs text-[#8C857B]">
                  Min. Sepet Şartı: <strong className="text-[#E8DED1]">₺{c.minSpend.toLocaleString('tr-TR')}</strong> • Toplam Kullanım: <strong>{c.usageCount} kez</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    toggleCouponStatus(c.id);
                    showToast(`${c.code} kuponu ${c.status === 'Aktif' ? 'pasif' : 'aktif'} yapıldı.`, 'info');
                  }}
                  className={`px-3 py-1 text-[10px] uppercase font-bold rounded transition-colors ${
                    c.status === 'Aktif' ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/30' : 'bg-rose-900/40 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {c.status}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenModal(c)}
                    className="p-2 bg-[#242321] border border-[#3A3835] text-[#E8DED1] hover:text-[#B49A6A] hover:border-[#B49A6A]"
                    title="Kuponu Düzenle"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id, c.code)}
                    className="p-2 bg-[#242321] border border-[#3A3835] text-rose-400 hover:bg-rose-900/30 hover:border-rose-500"
                    title="Kuponu Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CRUD MODAL: KUPON EKLE / DÜZENLE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1C1B1A] border border-[#B49A6A] p-6 sm:p-8 max-w-md w-full text-[#F8F5EF] space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-[#2A2825]">
              <h2 className="font-serif text-xl font-normal">
                {editingCoupon ? 'Kupon Kodunu Düzenle' : 'Yeni Kupon Kodu Tanımla'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#8C857B] hover:text-[#F8F5EF]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#8C857B] mb-1">Kupon Kodu *</label>
                <input
                  type="text"
                  required
                  placeholder="ör: SEZON20"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] font-mono uppercase focus:border-[#B49A6A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#8C857B] mb-1">İndirim Tipi *</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                    className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
                  >
                    <option value="percentage">Yüzde (%) İndirim</option>
                    <option value="fixed">Sabit Tutarlı (₺) İndirim</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#8C857B] mb-1">
                    İndirim Miktarı ({formData.discountType === 'percentage' ? '%' : '₺'}) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#8C857B] mb-1">Minimum Sepet Tutarı Şartı (₺) *</label>
                <input
                  type="number"
                  required
                  value={formData.minSpend}
                  onChange={(e) => setFormData({ ...formData, minSpend: Number(e.target.value) })}
                  className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#2A2825]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-[#8C857B]"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#B49A6A] text-[#F8F5EF] font-semibold uppercase tracking-wider hover:bg-[#988052]"
                >
                  {editingCoupon ? 'Kuponu Güncelle' : 'Kuponu Oluştur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
