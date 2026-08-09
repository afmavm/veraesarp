'use client';

import React from 'react';
import { Sparkles, Gift, Tag, Clock, Check, ToggleLeft, ToggleRight, Save } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';

export default function AdminGrowthEngine() {
  const { campaigns, toggleCampaign, updateCampaign } = useData();
  const { showToast } = useToast();

  const handleSaveGrowthRules = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Satış büyüme motoru kuralları başarıyla kaydedildi!', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-[#2A2825]">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#F8F5EF]">Satış Stratejileri &amp; Büyüme Motoru (Growth Engine)</h1>
          <p className="text-xs text-[#8C857B]">Flaş indirim geri sayımları, sepette hediye kuralları ve kademeli alışveriş teşviklerini yönetin.</p>
        </div>
      </div>

      <form onSubmit={handleSaveGrowthRules} className="space-y-6 max-w-4xl">
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

              <div className="pt-4 border-t border-[#2A2825] text-xs text-[#E8DED1] space-y-1">
                {cmp.type === 'flash_sale' && (
                  <p>İndirim Oranı: <strong className="text-emerald-400">%{cmp.discountPercentage}</strong></p>
                )}
                {cmp.type === 'free_gift' && (
                  <p>Min. Sepet: <strong className="text-[#B49A6A]">₺{cmp.minCartAmount}</strong></p>
                )}
                <span className={`inline-block text-[10px] uppercase font-bold px-2 py-0.5 mt-2 rounded ${cmp.isEnabled ? 'bg-emerald-900/40 text-emerald-300' : 'bg-rose-900/40 text-rose-300'}`}>
                  {cmp.isEnabled ? 'Vitrinde Yayında' : 'Pasif'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Rule Adjustments */}
        <div className="bg-[#1C1B1A] border border-[#2A2825] p-6 space-y-6">
          <h3 className="font-serif text-xl font-normal text-[#F8F5EF] pb-2 border-b border-[#2A2825]">
            Flaş İndirim Sayacı Ayarları
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#8C857B] mb-1">Flaş İndirim Yüzdesi (%)</label>
              <input
                type="number"
                defaultValue={15}
                onChange={(e) => updateCampaign('cmp-1', { discountPercentage: Number(e.target.value) })}
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
              />
            </div>
            <div>
              <label className="block text-[#8C857B] mb-1">Hediyeli Satış Eşiği (₺)</label>
              <input
                type="number"
                defaultValue={2500}
                onChange={(e) => updateCampaign('cmp-2', { minCartAmount: Number(e.target.value) })}
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-8 py-3.5 bg-[#B49A6A] text-[#F8F5EF] text-xs font-semibold uppercase tracking-widest hover:bg-[#988052] transition-colors flex items-center gap-2 shadow-lg"
        >
          <Save className="w-4 h-4" />
          <span>Büyüme Kurallarını Kaydet</span>
        </button>
      </form>
    </div>
  );
}
