'use client';

import React, { useState, useMemo } from 'react';
import {
  Tag, Plus, Trash2, Edit, CheckCircle2, X, Percent, DollarSign,
  Copy, Download, Search, Sparkles, Filter, Check
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { Coupon } from '@/lib/types/ecommerce';
import { useToast } from '@/context/ToastContext';

export default function AdminCoupons() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon, toggleCouponStatus } = useData();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Aktif' | 'Pasif'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 10,
    minSpend: 1000,
    maxUsesPerCustomer: 1,
  });

  const handleOpenModal = (couponToEdit?: Coupon) => {
    if (couponToEdit) {
      setEditingCoupon(couponToEdit);
      setFormData({
        code: couponToEdit.code,
        discountType: couponToEdit.discountType,
        discountValue: couponToEdit.discountValue,
        minSpend: couponToEdit.minSpend,
        maxUsesPerCustomer: couponToEdit.maxUsesPerCustomer || 1,
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: '',
        discountType: 'percentage',
        discountValue: 10,
        minSpend: 1000,
        maxUsesPerCustomer: 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleGenerateRandomCode = () => {
    const prefixes = ['VERA', 'SILK', 'SPRING', 'VIP', 'GIFT'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const number = Math.floor(10 + Math.random() * 90);
    const code = `${prefix}${number}`;
    setFormData((prev) => ({ ...prev, code }));
    showToast(`💡 Otomatik kupon kodu üretildi: ${code}`, 'info');
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
        code: formData.code.toUpperCase().trim(),
        discountText,
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minSpend: Number(formData.minSpend),
        maxUsesPerCustomer: Number(formData.maxUsesPerCustomer || 1),
      });
      showToast(`✅ "${formData.code.toUpperCase()}" kuponu güncellendi!`, 'success');
    } else {
      addCoupon({
        code: formData.code.toUpperCase().trim(),
        discountText,
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minSpend: Number(formData.minSpend),
        maxUsesPerCustomer: Number(formData.maxUsesPerCustomer || 1),
        usedByEmails: [],
      });
      showToast(`✅ "${formData.code.toUpperCase()}" kuponu başarıyla tanımlandı!`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, code: string) => {
    deleteCoupon(id);
    showToast(`${code} kuponu silindi.`, 'info');
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`📋 "${code}" kopyalandı!`, 'success');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleExportCSV = () => {
    const headers = ['Kupon Kodu', 'İndirim Metni', 'İndirim Tipi', 'İndirim Değeri', 'Min. Sepet (TL)', 'Kullanım Sayısı', 'Durum'];
    const rows = coupons.map((c) => [
      `"${c.code}"`,
      `"${c.discountText}"`,
      `"${c.discountType}"`,
      c.discountValue,
      c.minSpend,
      c.usageCount,
      `"${c.status}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vera_kuponlar_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Kupon verileri CSV olarak indirildi.', 'success');
  };

  // KPIs
  const activeCount = useMemo(() => coupons.filter((c) => c.status === 'Aktif').length, [coupons]);
  const totalUses = useMemo(() => coupons.reduce((sum, c) => sum + (c.usageCount || 0), 0), [coupons]);

  // Filtered List
  const filteredCoupons = useMemo(() => {
    return coupons.filter((c) => {
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        c.code.toLowerCase().includes(q) ||
        c.discountText.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [coupons, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-[#2A2825]">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#F8F5EF]">Kupon &amp; Promosyon Yönetimi</h1>
          <p className="text-xs text-[#8C857B]">İndirim kuponları ekleyin, düzenleyin, silin ve sepet şartlarını belirleyin.</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportCSV}
            className="p-2.5 bg-[#1C1B1A] border border-[#2A2825] text-[#8C857B] hover:text-[#B49A6A] transition-colors rounded"
            title="CSV Dışa Aktar"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="px-5 py-3 bg-[#B49A6A] text-[#1C1B1A] text-xs font-bold uppercase tracking-wider hover:bg-[#988052] transition-colors flex items-center justify-center gap-2 shadow-lg rounded"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Kupon Tanımla</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-[#1C1B1A] border border-[#2A2825] space-y-1">
          <span className="text-[10px] uppercase text-[#8C857B] font-semibold tracking-wider">Toplam Tanımlı Kupon</span>
          <p className="font-serif text-2xl text-[#F8F5EF] font-semibold">{coupons.length}</p>
          <span className="text-[10px] text-emerald-400">Sistem Kampanyaları</span>
        </div>
        <div className="p-4 bg-[#1C1B1A] border border-[#2A2825] space-y-1">
          <span className="text-[10px] uppercase text-[#8C857B] font-semibold tracking-wider">Aktif Kullanılabilir</span>
          <p className="font-serif text-2xl text-emerald-400 font-semibold">{activeCount}</p>
          <span className="text-[10px] text-emerald-400">Vitrin &amp; Sepette Geçerli</span>
        </div>
        <div className="p-4 bg-[#1C1B1A] border border-[#2A2825] space-y-1">
          <span className="text-[10px] uppercase text-[#8C857B] font-semibold tracking-wider">Kullanım İşlem Sayısı</span>
          <p className="font-serif text-2xl text-[#B49A6A] font-semibold">{totalUses} Kez</p>
          <span className="text-[10px] text-[#B49A6A]">Müşteriler Tarafından</span>
        </div>
        <div className="p-4 bg-[#1C1B1A] border border-[#2A2825] space-y-1">
          <span className="text-[10px] uppercase text-[#8C857B] font-semibold tracking-wider">Kupon Dönüşüm Oranı</span>
          <p className="font-serif text-2xl text-amber-400 font-semibold">%94.2</p>
          <span className="text-[10px] text-amber-400">Sepet Tamamlama Etkisi</span>
        </div>
      </div>

      {/* Control & Search Bar */}
      <div className="p-4 bg-[#1C1B1A] border border-[#2A2825] flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 rounded">
        {/* Status Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          {[
            { id: 'all', label: 'Tüm Kuponlar' },
            { id: 'Aktif', label: '🟢 Aktif Kuponlar' },
            { id: 'Pasif', label: '🔴 Pasif Kuponlar' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded transition-all text-xs font-semibold ${
                statusFilter === tab.id
                  ? 'bg-[#B49A6A] text-[#1C1B1A]'
                  : 'bg-[#242321] text-[#8C857B] hover:text-[#F8F5EF]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#8C857B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Kupon kodu veya indirim ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#242321] border border-[#3A3835] text-xs text-[#F8F5EF] placeholder-[#8C857B] focus:border-[#B49A6A] focus:outline-none rounded"
          />
        </div>
      </div>

      {/* Coupons List */}
      <div className="bg-[#1C1B1A] border border-[#2A2825] overflow-hidden shadow-xl rounded">
        <div className="divide-y divide-[#2A2825]">
          {filteredCoupons.length === 0 ? (
            <div className="p-12 text-center text-[#8C857B] space-y-2">
              <Tag className="w-10 h-10 text-[#B49A6A] mx-auto opacity-40" />
              <p className="font-serif text-base text-[#F8F5EF]">Aramanıza Uygun Kupon Bulunamadı</p>
              <p className="text-xs text-[#8C857B]">"Yeni Kupon Tanımla" butonuna basarak anında yeni kampanya oluşturabilirsiniz.</p>
            </div>
          ) : (
            filteredCoupons.map((c) => (
              <div
                key={c.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#242321]/80 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-bold text-[#B49A6A] bg-[#171615] px-3 py-1 border border-[#3A3835] rounded flex items-center gap-2">
                      {c.code}
                      <button
                        onClick={() => handleCopyCode(c.code)}
                        className="text-[#8C857B] hover:text-[#F8F5EF] transition-colors p-0.5"
                        title="Kodu Kopyala"
                      >
                        {copiedCode === c.code ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </span>
                    <span className="text-sm font-semibold text-[#F8F5EF]">{c.discountText}</span>
                  </div>
                  <p className="text-xs text-[#8C857B]">
                    Min. Sepet Şartı: <strong className="text-[#E8DED1]">₺{c.minSpend.toLocaleString('tr-TR')}</strong> • Kullanım Sayısı: <strong className="text-[#F8F5EF]">{c.usageCount} kez</strong> • 
                    <span className="text-[#B49A6A] font-medium ml-1">
                      Kullanım Hak: <strong>{c.maxUsesPerCustomer || 1} Defa</strong> ({c.usedByEmails?.length || 0} Müşteri Kullandı)
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => {
                      toggleCouponStatus(c.id);
                      showToast(`${c.code} kuponu ${c.status === 'Aktif' ? 'pasif' : 'aktif'} yapıldı.`, 'info');
                    }}
                    className={`px-3 py-1.5 text-[10px] uppercase font-bold rounded transition-colors border ${
                      c.status === 'Aktif'
                        ? 'bg-emerald-900/40 text-emerald-300 border-emerald-500/30 hover:bg-emerald-800/40'
                        : 'bg-rose-900/40 text-rose-300 border-rose-500/30 hover:bg-rose-800/40'
                    }`}
                  >
                    {c.status}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenModal(c)}
                      className="p-2 bg-[#242321] border border-[#3A3835] text-[#E8DED1] hover:text-[#B49A6A] hover:border-[#B49A6A] transition-colors rounded"
                      title="Kuponu Düzenle"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id, c.code)}
                      className="p-2 bg-[#242321] border border-[#3A3835] text-rose-400 hover:bg-rose-900/30 hover:border-rose-500 transition-colors rounded"
                      title="Kuponu Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CRUD MODAL: KUPON EKLE / DÜZENLE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1C1B1A] border border-[#B49A6A] p-6 sm:p-8 max-w-md w-full text-[#F8F5EF] space-y-4 shadow-2xl rounded">
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
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[#8C857B]">Kupon Kodu *</label>
                  <button
                    type="button"
                    onClick={handleGenerateRandomCode}
                    className="text-[10px] text-[#B49A6A] hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> Kod Üret
                  </button>
                </div>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#8C857B] mb-1">Min. Sepet Tutarı (₺) *</label>
                  <input
                    type="number"
                    required
                    value={formData.minSpend}
                    onChange={(e) => setFormData({ ...formData, minSpend: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
                  />
                </div>

                <div>
                  <label className="block text-[#8C857B] mb-1">Kişi Başı Kullanım Hak *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.maxUsesPerCustomer}
                    onChange={(e) => setFormData({ ...formData, maxUsesPerCustomer: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
                  />
                </div>
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
                  className="px-6 py-2 bg-[#B49A6A] text-[#1C1B1A] font-bold uppercase tracking-wider hover:bg-[#988052]"
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
