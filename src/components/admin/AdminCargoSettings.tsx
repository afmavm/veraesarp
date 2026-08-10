'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Truck, Plus, Trash2, Save, ToggleLeft, ToggleRight, AlertCircle, CheckCircle2, Upload, X, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/context/ToastContext';
import { useData, CargoCarrier } from '@/context/DataContext';

// Re-export so odeme/page.tsx backward-compat import still works
export type { CargoCarrier };

const MAX_LOGO_SIZE_KB = 150;

/* ─── Logo hücresi: göster + upload butonu ─────────────────────────── */
function LogoCell({
  carrier,
  onLogoChange,
}: {
  carrier: CargoCarrier;
  onLogoChange: (id: string, base64: string | undefined) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleFile = (file: File | null | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Yalnızca resim dosyası seçebilirsiniz.', 'error');
      return;
    }
    if (file.size > MAX_LOGO_SIZE_KB * 1024) {
      showToast(`Logo dosyası ${MAX_LOGO_SIZE_KB} KB'dan küçük olmalıdır.`, 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      onLogoChange(carrier.id, e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="col-span-1 flex flex-col items-center gap-1.5">
      {/* Preview */}
      <div
        className="relative w-10 h-10 rounded-lg border border-[#3A3835] bg-[#1C1B1A] flex items-center justify-center overflow-hidden cursor-pointer group"
        onClick={() => inputRef.current?.click()}
        title="Logo yüklemek için tıklayın"
      >
        {carrier.logoImage ? (
          <>
            <Image
              src={carrier.logoImage}
              alt={carrier.name}
              fill
              className="object-contain p-1"
              unoptimized
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Upload className="w-3.5 h-3.5 text-white" />
            </div>
          </>
        ) : (
          <>
            <span className="text-xl leading-none">{carrier.logo}</span>
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Upload className="w-3.5 h-3.5 text-white" />
            </div>
          </>
        )}
      </div>

      {/* Sil butonu (sadece resim varsa) */}
      {carrier.logoImage && (
        <button
          type="button"
          onClick={() => onLogoChange(carrier.id, undefined)}
          className="text-[9px] text-rose-400 hover:underline flex items-center gap-0.5"
          title="Logoyu kaldır"
        >
          <X className="w-2.5 h-2.5" />
          Kaldır
        </button>
      )}

      {/* Gizli input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
        onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
      />
    </div>
  );
}

/* ─── Yeni kargo formu logo upload ─────────────────────────────────── */
function NewLogoUpload({
  logoImage,
  onLogoImage,
  emoji,
  onEmoji,
}: {
  logoImage: string;
  onLogoImage: (v: string) => void;
  emoji: string;
  onEmoji: (v: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleFile = (file: File | null | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Yalnızca resim dosyası seçebilirsiniz.', 'error');
      return;
    }
    if (file.size > MAX_LOGO_SIZE_KB * 1024) {
      showToast(`Logo dosyası ${MAX_LOGO_SIZE_KB} KB'dan küçük olmalıdır.`, 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => onLogoImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <label className="block text-[10px] text-[#8C857B] uppercase tracking-wider">Logo</label>

      {/* Upload alanı */}
      <div
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-3 p-3 border border-dashed border-[#3A3835] bg-[#1C1B1A] cursor-pointer hover:border-[#B49A6A]/60 transition-colors group"
      >
        {logoImage ? (
          <div className="relative w-10 h-10 shrink-0 border border-[#3A3835] rounded overflow-hidden">
            <Image src={logoImage} alt="logo" fill className="object-contain p-1" unoptimized />
          </div>
        ) : (
          <div className="w-10 h-10 shrink-0 bg-[#242321] border border-[#3A3835] rounded flex items-center justify-center">
            <ImageIcon className="w-4 h-4 text-[#8C857B] group-hover:text-[#B49A6A] transition-colors" />
          </div>
        )}
        <div className="text-[11px] text-[#8C857B] group-hover:text-[#B49A6A] transition-colors">
          <p className="font-semibold">{logoImage ? 'Değiştir' : 'Logo Yükle'}</p>
          <p className="text-[10px] mt-0.5">PNG, JPG, SVG · Maks. {MAX_LOGO_SIZE_KB} KB</p>
        </div>
        {logoImage && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onLogoImage(''); }}
            className="ml-auto p-1 hover:text-rose-400 text-[#8C857B] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Logo yoksa emoji fallback */}
      {!logoImage && (
        <div>
          <label className="block text-[10px] text-[#5A5652] mb-1">veya Emoji Fallback</label>
          <input
            type="text"
            value={emoji}
            onChange={(e) => onEmoji(e.target.value)}
            placeholder="📦"
            maxLength={4}
            className="w-full p-2 bg-[#242321] border border-[#3A3835] text-sm text-[#F8F5EF] focus:outline-none focus:border-[#B49A6A]"
          />
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
        onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
      />
    </div>
  );
}

/* ─── Ana bileşen ───────────────────────────────────────────────────── */
export default function AdminCargoSettings() {
  const { showToast } = useToast();
  const { carriers: ctxCarriers, freeShippingThreshold: ctxThreshold, updateCarriers } = useData();

  // Local editing state — initialized from DataContext (live)
  const [carriers, setCarriers] = useState<CargoCarrier[]>(ctxCarriers);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(ctxThreshold);
  const [isSaved, setIsSaved] = useState(false);
  const [hasUnsaved, setHasUnsaved] = useState(false);

  // Sync when DataContext changes externally (e.g. another tab)
  useEffect(() => {
    setCarriers(ctxCarriers);
    setFreeShippingThreshold(ctxThreshold);
  }, [ctxCarriers, ctxThreshold]);

  // Track unsaved changes
  useEffect(() => {
    const changed =
      JSON.stringify(carriers) !== JSON.stringify(ctxCarriers) ||
      freeShippingThreshold !== ctxThreshold;
    setHasUnsaved(changed);
  }, [carriers, freeShippingThreshold, ctxCarriers, ctxThreshold]);

  // Yeni kargo formu
  const [newName, setNewName]         = useState('');
  const [newEmoji, setNewEmoji]       = useState('📦');
  const [newLogoImage, setNewLogoImage] = useState('');
  const [newFee, setNewFee]           = useState('');
  const [newEta, setNewEta]           = useState('1-2 iş günü');

  const handleSaveAll = () => {
    updateCarriers(carriers, freeShippingThreshold);
    setIsSaved(true);
    setHasUnsaved(false);
    setTimeout(() => setIsSaved(false), 2500);
    showToast('✅ Kargo ayarları kaydedildi — ödeme sayfasına anlık uygulandı!', 'success');
  };

  const handleLogoImageChange = (id: string, base64: string | undefined) => {
    setCarriers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, logoImage: base64 } : c))
    );
  };

  const handleToggle    = (id: string) => setCarriers((p) => p.map((c) => c.id === id ? { ...c, isActive: !c.isActive } : c));
  const handleFeeChange = (id: string, v: string) => { const n = parseInt(v.replace(/[^0-9]/g, ''), 10); if (!isNaN(n)) setCarriers((p) => p.map((c) => c.id === id ? { ...c, fee: n } : c)); };
  const handleEtaChange = (id: string, v: string) => setCarriers((p) => p.map((c) => c.id === id ? { ...c, eta: v } : c));
  const handleNameChange = (id: string, v: string) => setCarriers((p) => p.map((c) => c.id === id ? { ...c, name: v } : c));
  const handleDelete    = (id: string) => { setCarriers((p) => p.filter((c) => c.id !== id)); showToast('Kargo firması silindi.', 'info'); };

  const handleAddCarrier = () => {
    if (!newName.trim() || !newFee.trim()) { showToast('Firma adı ve ücret zorunludur.', 'error'); return; }
    const nc: CargoCarrier = {
      id: `carrier-${Date.now()}`,
      name: newName.trim(),
      logo: newEmoji.trim() || '📦',
      logoImage: newLogoImage || undefined,
      fee: parseInt(newFee, 10) || 0,
      eta: newEta.trim() || '1-3 iş günü',
      isActive: true,
    };
    setCarriers((p) => [...p, nc]);
    setNewName(''); setNewFee(''); setNewEta('1-2 iş günü'); setNewEmoji('📦'); setNewLogoImage('');
    showToast(`"${nc.name}" kargo firması eklendi!`, 'success');
  };

  const activeCount = carriers.filter((c) => c.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-[#2A2825]">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#F8F5EF]">Kargo Firması & Lojistik Ayarları</h1>
          <p className="text-xs text-[#8C857B] mt-1">Ödeme sayfasında görünecek kargo firmalarını, ücretleri ve teslimat sürelerini yönetin.</p>
        </div>
        <button
          onClick={handleSaveAll}
          className={`flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider transition-all shadow-lg shrink-0 rounded ${
            isSaved
              ? 'bg-emerald-600 text-white'
              : hasUnsaved
              ? 'bg-[#B49A6A] text-[#1C1B1A] animate-pulse'
              : 'bg-[#B49A6A] text-[#1C1B1A] hover:bg-[#988052]'
          }`}
        >
          {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {isSaved ? 'Kaydedildi!' : hasUnsaved ? '● Değişiklikleri Kaydet' : 'Değişiklikleri Kaydet'}
        </button>
      </div>

      {/* Ücretsiz Kargo Eşiği */}
      <div className="bg-[#1C1B1A] border border-[#2A2825] p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#2A2825]">
          <Truck className="w-4 h-4 text-[#B49A6A]" />
          <h2 className="font-serif text-lg font-normal text-[#F8F5EF]">Ücretsiz Kargo Eşiği</h2>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <label className="text-xs text-[#8C857B] whitespace-nowrap">Minimum Sepet Tutarı (₺):</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B49A6A] font-bold text-sm">₺</span>
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                min={0}
                className="pl-8 pr-4 py-2.5 w-36 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] text-sm font-bold focus:outline-none focus:border-[#B49A6A]"
              />
            </div>
          </div>
          <p className="text-[11px] text-[#8C857B] flex items-start gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            Bu tutarın üzerindeki siparişlerde tüm kargo firmalarına ücretsiz kargo uygulanır.
          </p>
        </div>
      </div>

      {/* Kargo Firmaları Tablosu */}
      <div className="bg-[#1C1B1A] border border-[#2A2825] p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#2A2825]">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#B49A6A]" />
            <h2 className="font-serif text-lg font-normal text-[#F8F5EF]">Kargo Firmaları</h2>
          </div>
          <span className="text-[11px] px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-semibold">
            {activeCount} aktif / {carriers.length} toplam
          </span>
        </div>

        {carriers.length === 0 ? (
          <div className="p-8 text-center text-[#8C857B] text-xs border border-dashed border-[#3A3835]">Henüz kargo firması eklenmemiş.</div>
        ) : (
          <div className="space-y-3">
            {/* Tablo Başlığı */}
            <div className="hidden md:grid md:grid-cols-12 gap-3 px-4 py-2 text-[10px] uppercase tracking-wider text-[#8C857B] font-semibold border-b border-[#2A2825]">
              <div className="col-span-1">Logo</div>
              <div className="col-span-3">Firma Adı</div>
              <div className="col-span-2">Ücret (₺)</div>
              <div className="col-span-3">Teslimat Süresi</div>
              <div className="col-span-2 text-center">Durum</div>
              <div className="col-span-1 text-center">Sil</div>
            </div>

            {carriers.map((carrier) => (
              <div
                key={carrier.id}
                className={`grid grid-cols-1 md:grid-cols-12 gap-3 items-center p-4 border transition-all ${
                  carrier.isActive ? 'border-[#3A3835] bg-[#242321]' : 'border-[#2A2825] bg-[#1C1B1A] opacity-50'
                }`}
              >
                {/* Logo upload hücresi */}
                <LogoCell carrier={carrier} onLogoChange={handleLogoImageChange} />

                {/* Firma Adı */}
                <div className="col-span-3">
                  <label className="block text-[10px] text-[#8C857B] mb-1 md:hidden">Firma Adı</label>
                  <input
                    type="text"
                    value={carrier.name}
                    onChange={(e) => handleNameChange(carrier.id, e.target.value)}
                    className="w-full p-2 bg-[#1C1B1A] border border-[#3A3835] text-xs text-[#F8F5EF] focus:outline-none focus:border-[#B49A6A]"
                  />
                </div>

                {/* Ücret */}
                <div className="col-span-2">
                  <label className="block text-[10px] text-[#8C857B] mb-1 md:hidden">Ücret (₺)</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#B49A6A] text-xs font-bold">₺</span>
                    <input
                      type="text"
                      value={carrier.fee}
                      onChange={(e) => handleFeeChange(carrier.id, e.target.value)}
                      className="w-full pl-7 pr-2 py-2 bg-[#1C1B1A] border border-[#3A3835] text-xs text-[#F8F5EF] font-bold focus:outline-none focus:border-[#B49A6A]"
                    />
                  </div>
                </div>

                {/* Teslimat Süresi */}
                <div className="col-span-3">
                  <label className="block text-[10px] text-[#8C857B] mb-1 md:hidden">Teslimat Süresi</label>
                  <input
                    type="text"
                    value={carrier.eta}
                    onChange={(e) => handleEtaChange(carrier.id, e.target.value)}
                    className="w-full p-2 bg-[#1C1B1A] border border-[#3A3835] text-xs text-[#F8F5EF] focus:outline-none focus:border-[#B49A6A]"
                    placeholder="ör: 1-2 iş günü"
                  />
                </div>

                {/* Toggle */}
                <div className="col-span-2 flex justify-center">
                  <button
                    type="button"
                    onClick={() => handleToggle(carrier.id)}
                    className="flex items-center gap-1.5 text-[11px] font-semibold transition-colors"
                  >
                    {carrier.isActive ? (
                      <><ToggleRight className="w-6 h-6 text-emerald-400" /><span className="text-emerald-400">Aktif</span></>
                    ) : (
                      <><ToggleLeft className="w-6 h-6 text-[#8C857B]" /><span className="text-[#8C857B]">Pasif</span></>
                    )}
                  </button>
                </div>

                {/* Sil */}
                <div className="col-span-1 flex justify-center">
                  <button
                    type="button"
                    onClick={() => handleDelete(carrier.id)}
                    className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Yeni Kargo Firması Ekle */}
      <div className="bg-[#1C1B1A] border border-[#2A2825] p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#2A2825]">
          <Plus className="w-4 h-4 text-[#B49A6A]" />
          <h2 className="font-serif text-lg font-normal text-[#F8F5EF]">Yeni Kargo Firması Ekle</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Logo upload */}
          <NewLogoUpload
            logoImage={newLogoImage}
            onLogoImage={setNewLogoImage}
            emoji={newEmoji}
            onEmoji={setNewEmoji}
          />

          {/* Firma adı */}
          <div>
            <label className="block text-[10px] text-[#8C857B] uppercase tracking-wider mb-1.5">Firma Adı *</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="ör: Fedex Kargo"
              className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-xs text-[#F8F5EF] focus:outline-none focus:border-[#B49A6A]"
            />
          </div>

          {/* Ücret */}
          <div>
            <label className="block text-[10px] text-[#8C857B] uppercase tracking-wider mb-1.5">Kargo Ücreti (₺) *</label>
            <input
              type="number"
              value={newFee}
              onChange={(e) => setNewFee(e.target.value)}
              placeholder="ör: 49"
              min={0}
              className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-xs text-[#F8F5EF] focus:outline-none focus:border-[#B49A6A]"
            />
          </div>

          {/* Teslimat Süresi */}
          <div>
            <label className="block text-[10px] text-[#8C857B] uppercase tracking-wider mb-1.5">Teslimat Süresi</label>
            <input
              type="text"
              value={newEta}
              onChange={(e) => setNewEta(e.target.value)}
              placeholder="ör: 1-2 iş günü"
              className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-xs text-[#F8F5EF] focus:outline-none focus:border-[#B49A6A]"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddCarrier}
          className="flex items-center gap-2 px-6 py-3 bg-[#242321] border border-[#B49A6A] text-[#B49A6A] text-xs font-semibold uppercase tracking-wider hover:bg-[#B49A6A] hover:text-[#F8F5EF] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Kargo Firması Ekle
        </button>
      </div>

      {/* Bilgi Notu */}
      <div className="p-4 bg-[#1C1B1A] border border-[#2A2825] flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-[11px] text-[#8C857B] leading-relaxed space-y-1">
          <p>
            <strong className="text-[#F8F5EF]">Logo yükleme:</strong> Her kargo firması satırındaki logo alanına tıklayarak PNG, JPG veya SVG logo yükleyebilirsiniz. Maksimum {MAX_LOGO_SIZE_KB} KB.
          </p>
          <p>
            <strong className="text-[#F8F5EF]">Değişiklikleri Kaydet</strong> butonuna basana kadar değişiklikler ödeme sayfasına yansımaz.
            Pasif yapılan kargo firmaları müşterilere gösterilmez.
          </p>
        </div>
      </div>
    </div>
  );
}
