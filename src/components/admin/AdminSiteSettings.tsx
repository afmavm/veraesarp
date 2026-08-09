'use client';

import React, { useState } from 'react';
import { Save, Building2, Phone, Mail, MapPin, Globe, ShieldCheck, Clock, ListPlus, Trash2, Plus } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import { FooterColumn } from '@/lib/types/ecommerce';

export default function AdminSiteSettings() {
  const { siteSettings, updateSiteSettings } = useData();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({ ...siteSettings });
  const [columns, setColumns] = useState<FooterColumn[]>(
    siteSettings.footerColumns && siteSettings.footerColumns.length > 0
      ? siteSettings.footerColumns
      : [
          {
            title: 'Alışveriş',
            links: [
              { label: 'Yeni Gelenler', url: '/kategori/yeni-gelenler' },
              { label: 'İpek Eşarp', url: '/kategori/esarp' },
              { label: 'Medine İpeği Şal', url: '/kategori/sal' },
              { label: 'Aksesuar & Broş', url: '/kategori/aksesuar' },
              { label: 'Özel Koleksiyonlar', url: '/koleksiyonlar' },
            ],
          },
          {
            title: 'Vera World',
            links: [
              { label: 'Hakkımızda', url: '/kurumsal/hakkimizda' },
              { label: "Vera'nın Hikâyesi", url: '/kurumsal/hikayemiz' },
              { label: 'Stil Rehberi', url: '/stil-rehberi' },
              { label: 'Mağazalarımız', url: '/kurumsal/magazalar' },
              { label: 'İletişim', url: '/kurumsal/iletisim' },
            ],
          },
          {
            title: 'Müşteri İlişkileri',
            links: [
              { label: 'Kargo ve Teslimat', url: '/kurumsal/kargo-ve-teslimat' },
              { label: 'İade ve Değişim', url: '/kurumsal/iade-ve-degisim' },
              { label: 'Sık Sorulan Sorular', url: '/kurumsal/sss' },
              { label: 'Gizlilik & Çerez Politikası', url: '/kurumsal/gizlilik-ve-cerez' },
              { label: 'KVKK Aydınlatma Metni', url: '/kurumsal/kvkk' },
              { label: 'Mesafeli Satış Sözleşmesi', url: '/kurumsal/mesafeli-satis-sozlesmesi' },
            ],
          },
        ]
  );

  // New link input state per column
  const [newLinkLabel, setNewLinkLabel] = useState<Record<number, string>>({});
  const [newLinkUrl, setNewLinkUrl] = useState<Record<number, string>>({});
  const [newColumnTitle, setNewColumnTitle] = useState('');

  const handleAddLink = (colIndex: number) => {
    const label = newLinkLabel[colIndex]?.trim();
    const url = newLinkUrl[colIndex]?.trim();
    if (!label || !url) return;

    const updated = [...columns];
    updated[colIndex].links.push({ label, url });
    setColumns(updated);
    setNewLinkLabel({ ...newLinkLabel, [colIndex]: '' });
    setNewLinkUrl({ ...newLinkUrl, [colIndex]: '' });
    showToast(`"${label}" bağlantısı menüye eklendi.`, 'success');
  };

  const handleRemoveLink = (colIndex: number, linkIndex: number) => {
    const updated = [...columns];
    updated[colIndex].links.splice(linkIndex, 1);
    setColumns(updated);
    showToast('Bağlantı silindi.', 'info');
  };

  const handleAddColumn = () => {
    if (!newColumnTitle.trim()) return;
    setColumns([...columns, { title: newColumnTitle.trim(), links: [] }]);
    setNewColumnTitle('');
    showToast('Yeni footer sütunu eklendi.', 'success');
  };

  const handleRemoveColumn = (colIndex: number) => {
    setColumns(columns.filter((_, idx) => idx !== colIndex));
    showToast('Sütun kaldırıldı.', 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({ ...formData, footerColumns: columns });
    showToast('Site ve Footer menü ayarları başarıyla veritabanına kaydedildi ve yayına alındı!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-[#2A2825]">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#F8F5EF]">Site, Marka &amp; Footer Menü Ayarları</h1>
          <p className="text-xs text-[#8C857B]">Footer başlıklarını, sayfa bağlantılarını, iletişim ve müşteri hizmetleri bilgilerini düzenleyin.</p>
        </div>

        <button
          type="submit"
          form="siteSettingsForm"
          className="px-6 py-3 bg-[#B49A6A] text-[#F8F5EF] text-xs font-semibold uppercase tracking-wider hover:bg-[#988052] transition-colors flex items-center justify-center gap-2 shadow-lg"
        >
          <Save className="w-4 h-4" />
          <span>Değişiklikleri Kaydet</span>
        </button>
      </div>

      <form id="siteSettingsForm" onSubmit={handleSubmit} className="space-y-8 text-xs text-[#F8F5EF]">
        {/* 1. Marka & Kurumsal Tanım */}
        <div className="bg-[#1C1B1A] border border-[#2A2825] p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-[#2A2825]">
            <Building2 className="w-4 h-4 text-[#B49A6A]" />
            <h2 className="font-serif text-lg font-normal">Marka Bilgileri &amp; Slogan</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#8C857B] mb-1">Marka / Mağaza Adı *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] font-semibold"
              />
            </div>

            <div>
              <label className="block text-[#8C857B] mb-1">Ücretsiz Kargo Sepet Eşiği (₺)</label>
              <input
                type="number"
                value={formData.freeShippingThreshold}
                onChange={(e) => setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })}
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#8C857B] mb-1">Marka Sloganı / Footer Açıklama Metni *</label>
            <textarea
              rows={3}
              required
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] leading-relaxed"
            />
          </div>
        </div>

        {/* 2. Footer Menü & Sayfa Bağlantıları Yönetimi */}
        <div className="bg-[#1C1B1A] border border-[#2A2825] p-6 space-y-6 shadow-xl">
          <div className="flex justify-between items-center pb-3 border-b border-[#2A2825]">
            <div className="flex items-center gap-2">
              <ListPlus className="w-4 h-4 text-[#B49A6A]" />
              <h2 className="font-serif text-lg font-normal">Footer Menü Sütunları &amp; Bağlantı Yönetimi</h2>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Yeni Sütun Başlığı (ör: Kurumsal)"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                className="p-2 bg-[#242321] border border-[#3A3835] text-xs text-[#F8F5EF]"
              />
              <button
                type="button"
                onClick={handleAddColumn}
                className="px-3 py-2 bg-[#B49A6A] text-[#F8F5EF] font-semibold text-xs uppercase flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Sütun Ekle</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((col, cIdx) => (
              <div key={cIdx} className="bg-[#242321] border border-[#3A3835] p-4 space-y-3">
                <div className="flex justify-between items-center border-b border-[#3A3835] pb-2">
                  <input
                    type="text"
                    value={col.title}
                    onChange={(e) => {
                      const updated = [...columns];
                      updated[cIdx].title = e.target.value;
                      setColumns(updated);
                    }}
                    className="bg-transparent font-serif text-base font-semibold text-[#B49A6A] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveColumn(cIdx)}
                    className="text-rose-400 hover:text-rose-300 p-1"
                    title="Sütunu Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Existing Links List */}
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {col.links.map((link, lIdx) => (
                    <div key={lIdx} className="flex items-center justify-between p-2 bg-[#1C1B1A] border border-[#2A2825] text-xs">
                      <div>
                        <span className="font-medium text-white">{link.label}</span>
                        <span className="block text-[10px] text-[#8C857B] font-mono">{link.url}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveLink(cIdx, lIdx)}
                        className="text-rose-400 hover:text-rose-300 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Link Input */}
                <div className="space-y-2 pt-2 border-t border-[#3A3835]">
                  <input
                    type="text"
                    placeholder="Link Başlığı (ör: SSS)"
                    value={newLinkLabel[cIdx] || ''}
                    onChange={(e) => setNewLinkLabel({ ...newLinkLabel, [cIdx]: e.target.value })}
                    className="w-full p-2 bg-[#1C1B1A] border border-[#3A3835] text-[#F8F5EF]"
                  />
                  <input
                    type="text"
                    placeholder="URL Adresi (ör: /kurumsal/sss)"
                    value={newLinkUrl[cIdx] || ''}
                    onChange={(e) => setNewLinkUrl({ ...newLinkUrl, [cIdx]: e.target.value })}
                    className="w-full p-2 bg-[#1C1B1A] border border-[#3A3835] text-[#F8F5EF] font-mono text-[11px]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddLink(cIdx)}
                    className="w-full py-2 bg-[#3A3835] hover:bg-[#B49A6A] text-[#F8F5EF] text-xs uppercase font-semibold transition-colors"
                  >
                    + Link Ekle
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Müşteri Destek & İletişim */}
        <div className="bg-[#1C1B1A] border border-[#2A2825] p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-[#2A2825]">
            <Phone className="w-4 h-4 text-[#B49A6A]" />
            <h2 className="font-serif text-lg font-normal">Müşteri Hizmetleri &amp; Açık Adres</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#8C857B] mb-1">Müşteri Destek Telefonu *</label>
              <input
                type="text"
                required
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
              />
            </div>

            <div>
              <label className="block text-[#8C857B] mb-1">Destek E-Posta Adresi *</label>
              <input
                type="email"
                required
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#8C857B] mb-1">Mağaza Açık Adresi *</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#8C857B] mb-1">Çalışma Saatleri</label>
              <input
                type="text"
                value={formData.workingHours}
                onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
              />
            </div>

            <div>
              <label className="block text-[#8C857B] mb-1">WhatsApp Danışma Hattı</label>
              <input
                type="text"
                value={formData.whatsappPhone}
                onChange={(e) => setFormData({ ...formData, whatsappPhone: e.target.value })}
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
              />
            </div>
          </div>
        </div>

        {/* 4. Sosyal Medya Bağlantıları */}
        <div className="bg-[#1C1B1A] border border-[#2A2825] p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-[#2A2825]">
            <Globe className="w-4 h-4 text-[#B49A6A]" />
            <h2 className="font-serif text-lg font-normal">Sosyal Medya Bağlantıları</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[#8C857B] mb-1">Instagram URL</label>
              <input
                type="text"
                value={formData.instagramUrl}
                onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
              />
            </div>

            <div>
              <label className="block text-[#8C857B] mb-1">Facebook URL</label>
              <input
                type="text"
                value={formData.facebookUrl}
                onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
              />
            </div>

            <div>
              <label className="block text-[#8C857B] mb-1">Pinterest URL</label>
              <input
                type="text"
                value={formData.pinterestUrl}
                onChange={(e) => setFormData({ ...formData, pinterestUrl: e.target.value })}
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
              />
            </div>
          </div>
        </div>


        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-8 py-3 bg-[#B49A6A] text-[#F8F5EF] text-xs font-semibold uppercase tracking-wider hover:bg-[#988052] transition-colors flex items-center gap-2 shadow-xl"
          >
            <Save className="w-4 h-4" />
            <span>Değişiklikleri Yayınla &amp; Kaydet</span>
          </button>
        </div>
      </form>
    </div>
  );
}
