'use client';

import React, { useState } from 'react';
import { Sparkles, Gift, Tag, Clock, Plus, Trash2, Edit, Save, ToggleLeft, ToggleRight, X, Percent, Layers, Crown, PackageCheck } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { CampaignRule } from '@/lib/types/ecommerce';
import { useToast } from '@/context/ToastContext';

export default function AdminGrowthEngine() {
  const { campaigns, addCampaign, updateCampaign, deleteCampaign, toggleCampaign } = useData();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<CampaignRule | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    type: 'flash_sale' as CampaignRule['type'],
    // Flash Sale fields
    discountPercentage: 15,
    endTime: '2026-08-15T23:59',
    showCountdown: true,
    applicableCategory: 'tum-urunler',
    // Free Gift fields
    minCartAmount: 2500,
    giftProductName: 'Vera Gold Kaplama İpek Eşarp Broşu',
    giftProductImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop',
    giftStock: 50,
    // Tiered Discount fields
    tier1Count: 2,
    tier1Discount: 10,
    tier2Count: 3,
    tier2Discount: 20,
    // Bundle & VIP fields
    bundleTitle: 'Eşarp + Altın Broş İkili Kombin Seti',
    vipTierOnly: false,
  });

  const handleOpenModal = (cmpToEdit?: CampaignRule) => {
    if (cmpToEdit) {
      setEditingCampaign(cmpToEdit);
      setFormData({
        title: cmpToEdit.title,
        subtitle: cmpToEdit.subtitle,
        type: cmpToEdit.type,
        discountPercentage: cmpToEdit.discountPercentage || 15,
        endTime: cmpToEdit.endTime || '2026-08-15T23:59',
        showCountdown: cmpToEdit.showCountdown ?? true,
        applicableCategory: cmpToEdit.applicableCategory || 'tum-urunler',
        minCartAmount: cmpToEdit.minCartAmount || 2500,
        giftProductName: cmpToEdit.giftProductName || 'Vera Gold Kaplama İpek Eşarp Broşu',
        giftProductImage: cmpToEdit.giftProductImage || 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop',
        giftStock: cmpToEdit.giftStock || 50,
        tier1Count: cmpToEdit.tier1Count || 2,
        tier1Discount: cmpToEdit.tier1Discount || 10,
        tier2Count: cmpToEdit.tier2Count || 3,
        tier2Discount: cmpToEdit.tier2Discount || 20,
        bundleTitle: cmpToEdit.bundleTitle || 'Eşarp + Altın Broş İkili Kombin Seti',
        vipTierOnly: cmpToEdit.vipTierOnly || false,
      });
    } else {
      setEditingCampaign(null);
      setFormData({
        title: '',
        subtitle: '',
        type: 'flash_sale',
        discountPercentage: 15,
        endTime: '2026-08-15T23:59',
        showCountdown: true,
        applicableCategory: 'tum-urunler',
        minCartAmount: 2500,
        giftProductName: 'Vera Gold Kaplama İpek Eşarp Broşu',
        giftProductImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop',
        giftStock: 50,
        tier1Count: 2,
        tier1Discount: 10,
        tier2Count: 3,
        tier2Discount: 20,
        bundleTitle: 'Eşarp + Altın Broş İkili Kombin Seti',
        vipTierOnly: false,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Lütfen kampanya başlığı giriniz.', 'error');
      return;
    }

    const payload: Omit<CampaignRule, 'id'> = {
      title: formData.title,
      subtitle: formData.subtitle,
      type: formData.type,
      isEnabled: true,
      discountPercentage: Number(formData.discountPercentage),
      endTime: formData.endTime,
      showCountdown: formData.showCountdown,
      applicableCategory: formData.applicableCategory,
      minCartAmount: Number(formData.minCartAmount),
      giftProductName: formData.giftProductName,
      giftProductImage: formData.giftProductImage,
      giftStock: Number(formData.giftStock),
      tier1Count: Number(formData.tier1Count),
      tier1Discount: Number(formData.tier1Discount),
      tier2Count: Number(formData.tier2Count),
      tier2Discount: Number(formData.tier2Discount),
      bundleTitle: formData.bundleTitle,
      vipTierOnly: formData.vipTierOnly,
    };

    if (editingCampaign) {
      updateCampaign(editingCampaign.id, payload);
      showToast('Kampanya stratejisi senaryo detaylarıyla güncellendi!', 'success');
    } else {
      addCampaign(payload);
      showToast('Yeni kampanya stratejisi oluşturuldu ve vitrine yansıtıldı!', 'success');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteCampaign(id);
    showToast('Kampanya stratejisi silindi.', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-[#2A2825]">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#F8F5EF]">Satış Stratejileri &amp; Büyüme Motoru</h1>
          <p className="text-xs text-[#8C857B]">5 farklı ticari indirim senaryosu tanımlayın, geri sayım sayaçlarını ve sepet kurallarını yönetin.</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-3 bg-[#B49A6A] text-[#F8F5EF] text-xs font-semibold uppercase tracking-wider hover:bg-[#988052] transition-colors flex items-center justify-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Kampanya Ekle</span>
        </button>
      </div>

      {/* Campaign Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {campaigns.map((cmp) => (
          <div
            key={cmp.id}
            className={`p-6 bg-[#1C1B1A] border transition-all space-y-4 flex flex-col justify-between ${
              cmp.isEnabled ? 'border-[#B49A6A] shadow-xl' : 'border-[#2A2825] opacity-60'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#B49A6A] px-2 py-0.5 bg-[#242321] border border-[#3A3835]">
                  {cmp.type === 'flash_sale'
                    ? '⚡ Flaş İndirim'
                    : cmp.type === 'free_gift'
                    ? '🎁 Sepet Hediyesi'
                    : cmp.type === 'tiered_discount'
                    ? '🛍️ Çok Al Az Öde'
                    : cmp.type === 'bundle_save'
                    ? '📦 Kombin Set'
                    : '👑 VIP İndirim'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    toggleCampaign(cmp.id);
                    showToast(`Kampanya ${!cmp.isEnabled ? 'etkinleştirildi' : 'devre dışı bırakıldı'}.`, 'info');
                  }}
                  className="text-[#B49A6A]"
                >
                  {cmp.isEnabled ? <ToggleRight className="w-7 h-7 text-[#B49A6A]" /> : <ToggleLeft className="w-7 h-7 text-[#8C857B]" />}
                </button>
              </div>

              <h3 className="font-serif text-lg font-normal text-[#F8F5EF] leading-snug">{cmp.title}</h3>
              <p className="text-xs text-[#8C857B] leading-relaxed">{cmp.subtitle}</p>
            </div>

            {/* Dynamic Scenario Metrics */}
            <div className="pt-4 border-t border-[#2A2825] text-xs text-[#E8DED1] flex items-center justify-between">
              <div className="space-y-0.5">
                {cmp.type === 'flash_sale' && (
                  <p>İndirim: <strong className="text-emerald-400">%{cmp.discountPercentage}</strong> • Geri Sayım: <strong className="text-[#B49A6A]">Aktif</strong></p>
                )}
                {cmp.type === 'free_gift' && (
                  <p>Min. Sepet: <strong className="text-[#B49A6A]">₺{cmp.minCartAmount}</strong> • Hediye: <strong className="text-white">{cmp.giftProductName}</strong></p>
                )}
                {cmp.type === 'tiered_discount' && (
                  <p>Kademeler: <strong className="text-emerald-400">2 Ürüne %{cmp.tier1Discount || 10}, 3+ Ürüne %{cmp.tier2Discount || 20}</strong></p>
                )}
                {cmp.type === 'bundle_save' && (
                  <p>Paket: <strong className="text-[#B49A6A]">{cmp.bundleTitle}</strong></p>
                )}
                {cmp.type === 'vip_discount' && (
                  <p>VIP İndirimi: <strong className="text-amber-300">%{cmp.discountPercentage} Özel</strong></p>
                )}
                <span className={`inline-block text-[10px] uppercase font-bold px-2 py-0.5 mt-1 rounded ${cmp.isEnabled ? 'bg-emerald-900/40 text-emerald-300' : 'bg-rose-900/40 text-rose-300'}`}>
                  {cmp.isEnabled ? 'Vitrinde Yayında' : 'Pasif'}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenModal(cmp)}
                  className="p-2 bg-[#242321] border border-[#3A3835] text-[#E8DED1] hover:text-[#B49A6A] hover:border-[#B49A6A]"
                  title="Düzenle"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cmp.id)}
                  className="p-2 bg-[#242321] border border-[#3A3835] text-rose-400 hover:bg-rose-900/30 hover:border-rose-500"
                  title="Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DYNAMIC SCENARIO MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-hidden">
          <div className="bg-[#1C1B1A] border border-[#B49A6A] max-w-lg w-full max-h-[92vh] text-[#F8F5EF] flex flex-col shadow-2xl rounded-sm overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#2A2825] flex justify-between items-center bg-[#1C1B1A] shrink-0">
              <h2 className="font-serif text-xl font-normal">
                {editingCampaign ? 'Kampanya Stratejisini Düzenle' : 'Yeni Kampanya Stratejisi Tanımla'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#8C857B] hover:text-[#F8F5EF]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scroll Body */}
            <form id="campaignForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[#8C857B] mb-1">Kampanya Başlığı *</label>
                <input
                  type="text"
                  required
                  placeholder="ör: ⚡ Milano Sonbahar Flaş Fırsatı"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
                />
              </div>

              <div>
                <label className="block text-[#8C857B] mb-1">Alt Açıklama Metni</label>
                <input
                  type="text"
                  placeholder="ör: Tüm ipek şallarda geçerli 24 saatlik fırsat!"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
                />
              </div>

              <div>
                <label className="block text-[#8C857B] mb-1">Kampanya Tipi / Senaryosu *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full p-2.5 bg-[#242321] border border-[#B49A6A] text-[#F8F5EF] font-semibold"
                >
                  <option value="flash_sale">⚡ Flaş İndirim (Flash Sale + Geri Sayım Sayacı)</option>
                  <option value="free_gift">🎁 Sepet Hediyesi (Free Gift + İlerleme Çubuğu)</option>
                  <option value="tiered_discount">🛍️ Kademeli İndirim (Çok Al Az Öde: 2 Ürüne %10, 3+ Ürüne %20)</option>
                  <option value="bundle_save">📦 Kombin Paket İndirimi (Bundle Deal)</option>
                  <option value="vip_discount">👑 VIP Müşteri İndirimi (VIP Tiered Access)</option>
                </select>
              </div>

              {/* SENARYO 1: FLAŞ İNDİRİM ALANLARI */}
              {formData.type === 'flash_sale' && (
                <div className="p-4 bg-[#242321] border border-[#3A3835] space-y-3">
                  <span className="text-[11px] font-semibold text-[#B49A6A] uppercase tracking-wider block">
                    ⚡ Flaş İndirim Senaryo Ayarları
                  </span>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#8C857B] mb-1">İndirim Yüzdesi (%) *</label>
                      <input
                        type="number"
                        required
                        value={formData.discountPercentage}
                        onChange={(e) => setFormData({ ...formData, discountPercentage: Number(e.target.value) })}
                        className="w-full p-2.5 bg-[#1C1B1A] border border-[#3A3835] text-[#F8F5EF]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#8C857B] mb-1">Geçerli Kategori</label>
                      <select
                        value={formData.applicableCategory}
                        onChange={(e) => setFormData({ ...formData, applicableCategory: e.target.value })}
                        className="w-full p-2.5 bg-[#1C1B1A] border border-[#3A3835] text-[#F8F5EF]"
                      >
                        <option value="tum-urunler">Tüm Ürünler</option>
                        <option value="esarp">Yalnızca Eşarplar</option>
                        <option value="sal">Yalnızca Şallar</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#8C857B] mb-1">Son Geçerlilik Tarihi &amp; Saati (Geri Sayım Sayacı)</label>
                    <input
                      type="datetime-local"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full p-2.5 bg-[#1C1B1A] border border-[#3A3835] text-[#F8F5EF] font-mono"
                    />
                  </div>
                </div>
              )}

              {/* SENARYO 2: SEPET HEDİYESİ ALANLARI */}
              {formData.type === 'free_gift' && (
                <div className="p-4 bg-[#242321] border border-[#3A3835] space-y-3">
                  <span className="text-[11px] font-semibold text-[#B49A6A] uppercase tracking-wider block">
                    🎁 Sepet Hediyesi Senaryo Ayarları
                  </span>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#8C857B] mb-1">Min. Sepet Eşiği (₺) *</label>
                      <input
                        type="number"
                        required
                        value={formData.minCartAmount}
                        onChange={(e) => setFormData({ ...formData, minCartAmount: Number(e.target.value) })}
                        className="w-full p-2.5 bg-[#1C1B1A] border border-[#3A3835] text-[#F8F5EF]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#8C857B] mb-1">Hediye Stok Adedi</label>
                      <input
                        type="number"
                        value={formData.giftStock}
                        onChange={(e) => setFormData({ ...formData, giftStock: Number(e.target.value) })}
                        className="w-full p-2.5 bg-[#1C1B1A] border border-[#3A3835] text-[#F8F5EF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#8C857B] mb-1">Hediye Edilecek Ürün Adı *</label>
                    <input
                      type="text"
                      required
                      value={formData.giftProductName}
                      onChange={(e) => setFormData({ ...formData, giftProductName: e.target.value })}
                      className="w-full p-2.5 bg-[#1C1B1A] border border-[#3A3835] text-[#F8F5EF]"
                    />
                  </div>
                </div>
              )}

              {/* SENARYO 3: KADEMELİ İNDİRİM ALANLARI */}
              {formData.type === 'tiered_discount' && (
                <div className="p-4 bg-[#242321] border border-[#3A3835] space-y-3">
                  <span className="text-[11px] font-semibold text-[#B49A6A] uppercase tracking-wider block">
                    🛍️ Kademeli İndirim (Çok Al Az Öde) Senaryo Ayarları
                  </span>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#8C857B] mb-1">1. Aşama (2 Ürün) İndirimi (%)</label>
                      <input
                        type="number"
                        value={formData.tier1Discount}
                        onChange={(e) => setFormData({ ...formData, tier1Discount: Number(e.target.value) })}
                        className="w-full p-2.5 bg-[#1C1B1A] border border-[#3A3835] text-[#F8F5EF]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#8C857B] mb-1">2. Aşama (3+ Ürün) İndirimi (%)</label>
                      <input
                        type="number"
                        value={formData.tier2Discount}
                        onChange={(e) => setFormData({ ...formData, tier2Discount: Number(e.target.value) })}
                        className="w-full p-2.5 bg-[#1C1B1A] border border-[#3A3835] text-[#F8F5EF]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SENARYO 4: KOMBİN PAKET ALANLARI */}
              {formData.type === 'bundle_save' && (
                <div className="p-4 bg-[#242321] border border-[#3A3835] space-y-3">
                  <span className="text-[11px] font-semibold text-[#B49A6A] uppercase tracking-wider block">
                    📦 Kombin Paket Senaryo Ayarları
                  </span>
                  <div>
                    <label className="block text-[#8C857B] mb-1">Paket Adı *</label>
                    <input
                      type="text"
                      required
                      value={formData.bundleTitle}
                      onChange={(e) => setFormData({ ...formData, bundleTitle: e.target.value })}
                      className="w-full p-2.5 bg-[#1C1B1A] border border-[#3A3835] text-[#F8F5EF]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#8C857B] mb-1">Paket İndirim Oranı (%)</label>
                    <input
                      type="number"
                      value={formData.discountPercentage}
                      onChange={(e) => setFormData({ ...formData, discountPercentage: Number(e.target.value) })}
                      className="w-full p-2.5 bg-[#1C1B1A] border border-[#3A3835] text-[#F8F5EF]"
                    />
                  </div>
                </div>
              )}
            </form>

            {/* Modal Actions */}
            <div className="p-4 border-t border-[#2A2825] flex items-center justify-end gap-3 shrink-0 bg-[#1C1B1A]">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-[#8C857B] hover:text-[#F8F5EF]"
              >
                İptal
              </button>
              <button
                type="submit"
                form="campaignForm"
                className="px-6 py-2.5 bg-[#B49A6A] text-[#F8F5EF] font-semibold uppercase tracking-wider hover:bg-[#988052]"
              >
                {editingCampaign ? 'Stratejiyi Güncelle' : 'Stratejiyi Kaydet & Yayınla'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
