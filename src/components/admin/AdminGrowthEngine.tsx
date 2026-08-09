'use client';

import React, { useState } from 'react';
import { Sparkles, Gift, Tag, Clock, Plus, Trash2, Edit, Save, ToggleLeft, ToggleRight, X } from 'lucide-react';
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
    discountPercentage: 15,
    minCartAmount: 2000,
    giftProductName: 'Vera Gold Kaplama İpek Eşarp Broşu',
  });

  const handleOpenModal = (cmpToEdit?: CampaignRule) => {
    if (cmpToEdit) {
      setEditingCampaign(cmpToEdit);
      setFormData({
        title: cmpToEdit.title,
        subtitle: cmpToEdit.subtitle,
        type: cmpToEdit.type,
        discountPercentage: cmpToEdit.discountPercentage || 15,
        minCartAmount: cmpToEdit.minCartAmount || 2000,
        giftProductName: cmpToEdit.giftProductName || 'Vera Gold Kaplama İpek Eşarp Broşu',
      });
    } else {
      setEditingCampaign(null);
      setFormData({
        title: '',
        subtitle: '',
        type: 'flash_sale',
        discountPercentage: 15,
        minCartAmount: 2000,
        giftProductName: 'Vera Gold Kaplama İpek Eşarp Broşu',
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

    if (editingCampaign) {
      updateCampaign(editingCampaign.id, {
        title: formData.title,
        subtitle: formData.subtitle,
        type: formData.type,
        discountPercentage: Number(formData.discountPercentage),
        minCartAmount: Number(formData.minCartAmount),
        giftProductName: formData.giftProductName,
      });
      showToast('Kampanya stratejisi başarıyla güncellendi!', 'success');
    } else {
      addCampaign({
        title: formData.title,
        subtitle: formData.subtitle,
        type: formData.type,
        isEnabled: true,
        discountPercentage: Number(formData.discountPercentage),
        minCartAmount: Number(formData.minCartAmount),
        giftProductName: formData.giftProductName,
      });
      showToast('Yeni kampanya stratejisi oluşturuldu ve yayına alındı!', 'success');
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
          <p className="text-xs text-[#8C857B]">Kampanya kurallarınızı ekleyin, düzenleyin, silin ve canlı vitrinde aktif/pasif durumlarını yönetin.</p>
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
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#B49A6A]">
                  {cmp.type === 'flash_sale' ? 'Flaş İndirim' : cmp.type === 'free_gift' ? 'Sepet Hediyesi' : 'Kademeli İndirim'}
                </span>
                <div className="flex items-center gap-2">
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
              </div>

              <h3 className="font-serif text-lg font-normal text-[#F8F5EF] leading-snug">{cmp.title}</h3>
              <p className="text-xs text-[#8C857B] leading-relaxed">{cmp.subtitle}</p>
            </div>

            <div className="pt-4 border-t border-[#2A2825] text-xs text-[#E8DED1] flex items-center justify-between">
              <div>
                {cmp.type === 'flash_sale' && (
                  <p>İndirim: <strong className="text-emerald-400">%{cmp.discountPercentage}</strong></p>
                )}
                {cmp.type === 'free_gift' && (
                  <p>Min. Sepet: <strong className="text-[#B49A6A]">₺{cmp.minCartAmount}</strong></p>
                )}
                <span className={`inline-block text-[10px] uppercase font-bold px-2 py-0.5 mt-1 rounded ${cmp.isEnabled ? 'bg-emerald-900/40 text-emerald-300' : 'bg-rose-900/40 text-rose-300'}`}>
                  {cmp.isEnabled ? 'Vitrinde Yayında' : 'Pasif'}
                </span>
              </div>

              {/* Action Buttons */}
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

      {/* CRUD MODAL: KAMPANYA EKLE / DÜZENLE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1C1B1A] border border-[#B49A6A] p-6 sm:p-8 max-w-lg w-full text-[#F8F5EF] space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-[#2A2825]">
              <h2 className="font-serif text-xl font-normal">
                {editingCampaign ? 'Kampanya Stratejisini Düzenle' : 'Yeni Kampanya Stratejisi Ekle'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#8C857B] hover:text-[#F8F5EF]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#8C857B] mb-1">Kampanya Başlığı *</label>
                <input
                  type="text"
                  required
                  placeholder="ör: ⚡ Sonbahar Flaş Fırsatı"
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
                <label className="block text-[#8C857B] mb-1">Kampanya Tipi *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
                >
                  <option value="flash_sale">Flaş İndirim (Flash Sale)</option>
                  <option value="free_gift">Sepet Hediyesi (Free Gift)</option>
                  <option value="tiered_discount">Kademeli İndirim (Tiered Discount)</option>
                </select>
              </div>

              {formData.type === 'flash_sale' && (
                <div>
                  <label className="block text-[#8C857B] mb-1">İndirim Yüzdesi (%)</label>
                  <input
                    type="number"
                    value={formData.discountPercentage}
                    onChange={(e) => setFormData({ ...formData, discountPercentage: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
                  />
                </div>
              )}

              {formData.type === 'free_gift' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#8C857B] mb-1">Min. Sepet Tutarı (₺)</label>
                    <input
                      type="number"
                      value={formData.minCartAmount}
                      onChange={(e) => setFormData({ ...formData, minCartAmount: Number(e.target.value) })}
                      className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#8C857B] mb-1">Hediye Ürün Adı</label>
                    <input
                      type="text"
                      value={formData.giftProductName}
                      onChange={(e) => setFormData({ ...formData, giftProductName: e.target.value })}
                      className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
                    />
                  </div>
                </div>
              )}

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
                  {editingCampaign ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
