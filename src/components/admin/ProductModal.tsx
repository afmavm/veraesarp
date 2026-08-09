'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Plus, Trash2, Upload, Sparkles, Image as ImageIcon, Check } from 'lucide-react';
import { Product, ProductVariant, ColorOption } from '@/lib/types/ecommerce';
import { useToast } from '@/context/ToastContext';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Partial<Product>) => void;
  productToEdit?: Product | null;
}

export default function ProductModal({
  isOpen,
  onClose,
  onSave,
  productToEdit,
}: ProductModalProps) {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    barcode: '',
    description: '',
    shortDescription: '',
    price: 1890,
    compareAtPrice: 2250,
    costPrice: 850,
    stock: 25,
    rating: 5.0,
    reviewCount: 12,
    category: 'esarp' as 'esarp' | 'sal' | 'aksesuar',
    subcategory: 'twill-ipek',
    fabric: 'twill' as any,
    styleCategory: 'ofis' as any,
    collection: 'milano-romance',
    careInstructions: 'Kuru temizleme önerilir. Elde yıkamada ılık su ve ipek şampuanı tercih edilmelidir.',
    dimensions: '90 cm x 90 cm',
  });

  const [imagesList, setImagesList] = useState<string[]>([
    'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1200&auto=format&fit=crop',
  ]);

  const [colorSwatches, setColorSwatches] = useState<ColorOption[]>([
    { name: 'Krem & Altın', hex: '#F4EBE1' },
    { name: 'Gece Mavisi', hex: '#1B2A4A' },
  ]);

  const [sizesList, setSizesList] = useState<string[]>(['90x90 cm']);

  const [badgesList, setBadgesList] = useState<('Yeni' | 'Özel Fiyat' | 'Çok Satan' | 'Limited' | 'Flaş İndirim')[]>([
    'Yeni',
    'Çok Satan',
  ]);

  const [featuresList, setFeaturesList] = useState<string[]>([
    '✓ %100 Saf Twill İpek Kumaş',
    '✓ Özel İtalyan El İşçiliği İğne Kenar',
    '✓ Tok Duruş, Şeklini Gün Boyu Koru',
    '✓ Nefes Alan Doğal İpek Lifler',
  ]);

  const [variantsList, setVariantsList] = useState<ProductVariant[]>([]);

  // Local New Feature / New Color inputs
  const [newFeatureText, setNewFeatureText] = useState('');
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#B49A6A');
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        slug: productToEdit.slug,
        sku: productToEdit.sku,
        barcode: productToEdit.barcode || '',
        description: productToEdit.description,
        shortDescription: productToEdit.shortDescription,
        price: productToEdit.price,
        compareAtPrice: productToEdit.compareAtPrice || 0,
        costPrice: productToEdit.costPrice || 0,
        stock: productToEdit.stock,
        rating: productToEdit.rating || 5.0,
        reviewCount: productToEdit.reviewCount || 0,
        category: productToEdit.category,
        subcategory: productToEdit.subcategory || 'twill-ipek',
        fabric: productToEdit.fabric,
        styleCategory: productToEdit.styleCategory,
        collection: productToEdit.collection || 'milano-romance',
        careInstructions: productToEdit.careInstructions,
        dimensions: productToEdit.dimensions,
      });
      setImagesList(productToEdit.images || []);
      setColorSwatches(productToEdit.colors || []);
      setSizesList(productToEdit.sizes || ['90x90 cm']);
      setBadgesList(productToEdit.badges || []);
      setFeaturesList(productToEdit.features || []);
      setVariantsList(productToEdit.variants || []);
    } else {
      setFormData({
        name: '',
        slug: '',
        sku: `VER-MIL-${Math.floor(1000 + Math.random() * 9000)}`,
        barcode: `8680001${Math.floor(10005 + Math.random() * 89999)}`,
        description: 'Vera Eşarp’ın ikonik koleksiyonundan %100 saf twill ipek eşarp. İtalyan dokuma ustalarının el işçiliği kenar dikişleri ve mat parıltısı ile gün boyu kayma yapmadan kusursuz duruş sağlar.',
        shortDescription: '%100 Saf Twill İpek, El Dikişli Kenarlar, 90x90 cm',
        price: 1890,
        compareAtPrice: 2250,
        costPrice: 850,
        stock: 25,
        rating: 5.0,
        reviewCount: 24,
        category: 'esarp',
        subcategory: 'twill-ipek',
        fabric: 'twill',
        styleCategory: 'ofis',
        collection: 'milano-romance',
        careInstructions: 'Kuru temizleme önerilir. Elde yıkamada ılık su ve ipek şampuanı tercih edilmelidir. Düşük ısıda tersten ütüleyiniz.',
        dimensions: '90 cm x 90 cm',
      });
      setImagesList([
        'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1200&auto=format&fit=crop',
      ]);
      setColorSwatches([
        { name: 'Krem & Altın', hex: '#F4EBE1' },
        { name: 'Gece Mavisi', hex: '#1B2A4A' },
      ]);
      setSizesList(['90x90 cm']);
      setBadgesList(['Yeni', 'Çok Satan']);
      setFeaturesList([
        '✓ %100 Saf Twill İpek Kumaş',
        '✓ Özel İtalyan El İşçiliği İğne Kenar',
        '✓ Tok Duruş, Şeklini Gün Boyu Koru',
        '✓ Nefes Alan Doğal İpek Lifler',
      ]);
      setVariantsList([]);
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  // Image Upload Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImagesList((prev) => [...prev, reader.result as string]);
          showToast('Yerel resim yüklendi ve galeriye eklendi.', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      setImagesList((prev) => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
      showToast('Görsel URL eklendi.', 'success');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImagesList((prev) => prev.filter((_, i) => i !== index));
  };

  // Color Swatch Handlers
  const handleAddColor = () => {
    if (newColorName.trim()) {
      setColorSwatches((prev) => [...prev, { name: newColorName.trim(), hex: newColorHex }]);
      setNewColorName('');
      showToast('Yeni renk seçeneği eklendi.', 'success');
    }
  };

  const handleRemoveColor = (index: number) => {
    setColorSwatches((prev) => prev.filter((_, i) => i !== index));
  };

  // Badge Toggle Handlers
  const toggleBadge = (badge: 'Yeni' | 'Özel Fiyat' | 'Çok Satan' | 'Limited' | 'Flaş İndirim') => {
    setBadgesList((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    );
  };

  // Feature Handlers
  const handleAddFeature = () => {
    if (newFeatureText.trim()) {
      const text = newFeatureText.trim().startsWith('✓') ? newFeatureText.trim() : `✓ ${newFeatureText.trim()}`;
      setFeaturesList((prev) => [...prev, text]);
      setNewFeatureText('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeaturesList((prev) => prev.filter((_, i) => i !== index));
  };

  // Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedSlug =
      formData.slug.trim() ||
      formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    onSave({
      id: productToEdit ? productToEdit.id : undefined,
      name: formData.name,
      slug: generatedSlug,
      sku: formData.sku,
      barcode: formData.barcode,
      price: Number(formData.price),
      compareAtPrice: Number(formData.compareAtPrice) || undefined,
      costPrice: Number(formData.costPrice) || undefined,
      stock: Number(formData.stock),
      rating: Number(formData.rating) || 5.0,
      reviewCount: Number(formData.reviewCount) || 0,
      category: formData.category,
      subcategory: formData.subcategory,
      fabric: formData.fabric,
      styleCategory: formData.styleCategory,
      collection: formData.collection,
      description: formData.description,
      shortDescription: formData.shortDescription,
      images: imagesList.length > 0 ? imagesList : ['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=1200&auto=format&fit=crop'],
      colors: colorSwatches.length > 0 ? colorSwatches : [{ name: 'Standart', hex: '#242321' }],
      sizes: sizesList,
      badges: badgesList,
      features: featuresList,
      careInstructions: formData.careInstructions,
      dimensions: formData.dimensions,
      variants: variantsList,
      isNew: badgesList.includes('Yeni'),
      isBestseller: badgesList.includes('Çok Satan'),
      createdAt: productToEdit ? productToEdit.createdAt : new Date().toISOString(),
    });
  };

  const marginAmount = formData.price - formData.costPrice;
  const marginPercent = formData.price > 0 ? Math.round((marginAmount / formData.price) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#1C1B1A] border border-[#B49A6A] p-6 sm:p-8 max-w-4xl w-full text-[#F8F5EF] space-y-6 shadow-2xl my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2A2825]">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#F8F5EF]">
              {productToEdit ? 'Ürün & Detay Kartı Yönetimi' : 'Yeni Ürün & Tam Detay Ekle'}
            </h2>
            <p className="text-xs text-[#8C857B] mt-0.5">
              Ürün kartlarında ve Ürün Detay sayfasında görüntülenen tüm görselleri, açıklamaları ve özellikleri buradan yönetin.
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-[#8C857B] hover:text-[#F8F5EF]">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 text-xs">
          {/* TAB 1: TEMEL BİLGİLER */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg text-[#B49A6A] border-b border-[#2A2825] pb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>1. Ürün Kimlik &amp; Başlık Bilgileri</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-8">
                <label className="block text-[#8C857B] mb-1">Ürün Adı (Başlık) *</label>
                <input
                  type="text"
                  required
                  placeholder="ör: Vera Milano Twill İpek Eşarp — Krem & Altın"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] font-serif text-sm focus:border-[#B49A6A] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-[#8C857B] mb-1">URL / Slug (Opsiyonel)</label>
                <input
                  type="text"
                  placeholder="ör: vera-milano-twill-ipek-esarp"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full p-3 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-[#8C857B] mb-1">SKU Kodu *</label>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] font-mono"
                />
              </div>
              <div>
                <label className="block text-[#8C857B] mb-1">Barkod (GTIN)</label>
                <input
                  type="text"
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] font-mono"
                />
              </div>
              <div>
                <label className="block text-[#8C857B] mb-1">Kategori *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
                >
                  <option value="esarp">Eşarp</option>
                  <option value="sal">Şal</option>
                  <option value="aksesuar">Aksesuar</option>
                </select>
              </div>
              <div>
                <label className="block text-[#8C857B] mb-1">Kumaş Türü *</label>
                <select
                  value={formData.fabric}
                  onChange={(e) => setFormData({ ...formData, fabric: e.target.value as any })}
                  className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
                >
                  <option value="twill">Twill İpek</option>
                  <option value="saten">Saten İpek</option>
                  <option value="ipek">Saf İpek</option>
                  <option value="medine-ipegi">Medine İpeği</option>
                  <option value="pamuk">Pamuk &amp; Bambu</option>
                </select>
              </div>
            </div>
          </div>

          {/* TAB 2: FİYAT, STOK & KAR MARJI */}
          <div className="p-4 bg-[#242321] border border-[#3A3835] space-y-3">
            <h3 className="text-xs font-semibold text-[#B49A6A] uppercase tracking-wider">
              2. Fiyatlandırma, Stok &amp; Kar Analizi
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-[#8C857B] mb-1">Satış Fiyatı (₺) *</label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full p-2.5 bg-[#1C1B1A] border border-[#3A3835] text-[#F8F5EF] font-serif text-sm"
                />
              </div>
              <div>
                <label className="block text-[#8C857B] mb-1">İndirim Öncesi Fiyat (₺)</label>
                <input
                  type="number"
                  value={formData.compareAtPrice}
                  onChange={(e) => setFormData({ ...formData, compareAtPrice: Number(e.target.value) })}
                  className="w-full p-2.5 bg-[#1C1B1A] border border-[#3A3835] text-[#F8F5EF]"
                />
              </div>
              <div>
                <label className="block text-[#8C857B] mb-1">Maliyet Fiyatı (₺)</label>
                <input
                  type="number"
                  value={formData.costPrice}
                  onChange={(e) => setFormData({ ...formData, costPrice: Number(e.target.value) })}
                  className="w-full p-2.5 bg-[#1C1B1A] border border-[#3A3835] text-[#F8F5EF]"
                />
              </div>
              <div>
                <label className="block text-[#8C857B] mb-1">Stok Adedi *</label>
                <input
                  type="number"
                  required
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  className="w-full p-2.5 bg-[#1C1B1A] border border-[#3A3835] text-[#F8F5EF] font-bold"
                />
              </div>
            </div>
            <div className="text-[11px] text-[#8C857B] flex justify-between pt-2 border-t border-[#2A2825]">
              <span>Tahmini Birim Kar: <strong className="text-emerald-400">₺{marginAmount.toLocaleString('tr-TR')}</strong></span>
              <span>Kar Marjı: <strong className="text-[#B49A6A]">%{marginPercent}</strong></span>
            </div>
          </div>

          {/* TAB 3: ÇOKLU GÖRSEL GALERİSİ & YEREL YÜKLEME */}
          <div className="p-4 bg-[#242321] border border-[#3A3835] space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-semibold text-[#B49A6A] uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                <span>3. Çoklu Görsel Galerisi (Ürün Kartı &amp; Detay Galerisi)</span>
              </h3>
              <label className="cursor-pointer px-3 py-1.5 bg-[#B49A6A] text-[#F8F5EF] text-[11px] font-semibold uppercase hover:bg-[#988052] transition-colors flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>Bilgisayardan Yükle</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {/* URL input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="HTTPS Görsel URL adresi yapıştır..."
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1 p-2 bg-[#1C1B1A] border border-[#3A3835] text-[#F8F5EF] font-mono text-[11px]"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-4 py-2 bg-[#3A3835] text-[#F8F5EF] hover:bg-[#B49A6A] uppercase text-[11px]"
              >
                URL Ekle
              </button>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 pt-2">
              {imagesList.map((img, idx) => (
                <div key={idx} className="relative aspect-[3/4] bg-[#171615] border border-[#3A3835] group overflow-hidden">
                  <Image src={img} alt={`Görsel ${idx + 1}`} fill className="object-cover" />
                  <span className="absolute top-1 left-1 bg-black/70 text-[9px] px-1.5 py-0.5 text-white font-mono">
                    {idx === 0 ? 'Ana Görsel' : idx === 1 ? 'Hover' : `#${idx + 1}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-rose-600/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* TAB 4: ÜRÜN ROZETLERİ (BADGES) */}
          <div className="p-4 bg-[#242321] border border-[#3A3835] space-y-3">
            <h3 className="text-xs font-semibold text-[#B49A6A] uppercase tracking-wider">
              4. Ürün Kartı Rozetleri (Badges)
            </h3>
            <div className="flex flex-wrap gap-3">
              {(['Yeni', 'Özel Fiyat', 'Çok Satan', 'Limited', 'Flaş İndirim'] as const).map((b) => {
                const isSelected = badgesList.includes(b);
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => toggleBadge(b)}
                    className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider border transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#B49A6A] text-[#F8F5EF] border-[#B49A6A]'
                        : 'bg-[#1C1B1A] text-[#8C857B] border-[#3A3835] hover:text-[#F8F5EF]'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{b}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TAB 5: RENK PALETLERİ (COLOR SWATCHES) */}
          <div className="p-4 bg-[#242321] border border-[#3A3835] space-y-3">
            <h3 className="text-xs font-semibold text-[#B49A6A] uppercase tracking-wider">
              5. Renk Swatch Seçenekleri (Kart &amp; Detay)
            </h3>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Renk Adı (ör: Gül Vizonu)"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                className="p-2 bg-[#1C1B1A] border border-[#3A3835] text-[#F8F5EF] text-xs"
              />
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="w-9 h-9 p-0 bg-transparent border-0 cursor-pointer"
              />
              <button
                type="button"
                onClick={handleAddColor}
                className="px-4 py-2 bg-[#3A3835] text-[#F8F5EF] hover:bg-[#B49A6A] text-xs uppercase"
              >
                Renk Ekle
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {colorSwatches.map((c, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-[#1C1B1A] border border-[#3A3835]">
                  <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: c.hex }} />
                  <span className="font-semibold text-xs">{c.name}</span>
                  <button type="button" onClick={() => handleRemoveColor(idx)} className="text-rose-400 hover:text-rose-300">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* TAB 6: ÖZELLİKLER & AÇIKLAMALAR */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg text-[#B49A6A] border-b border-[#2A2825] pb-2">
              6. Ürün Detay Sayfası Açıklama &amp; Maddeler
            </h3>

            <div>
              <label className="block text-[#8C857B] mb-1">Kısa Özet (Kart Altı &amp; Hızlı Görünüm)</label>
              <input
                type="text"
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
              />
            </div>

            <div>
              <label className="block text-[#8C857B] mb-1">Detaylı Ürün Açıklaması Paragrafı</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
              />
            </div>

            {/* Features list */}
            <div className="p-4 bg-[#242321] border border-[#3A3835] space-y-3">
              <label className="block text-[#B49A6A] font-semibold uppercase">Ürün Özellikleri Maddeleri</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="ör: %100 Saf Twill İpek Kumaş"
                  value={newFeatureText}
                  onChange={(e) => setNewFeatureText(e.target.value)}
                  className="flex-1 p-2 bg-[#1C1B1A] border border-[#3A3835] text-[#F8F5EF]"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-4 py-2 bg-[#3A3835] text-[#F8F5EF] hover:bg-[#B49A6A] text-xs uppercase"
                >
                  Madde Ekle
                </button>
              </div>

              <div className="space-y-1 pt-1">
                {featuresList.map((feat, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-[#1C1B1A] text-xs border border-[#2A2825]">
                    <span>{feat}</span>
                    <button type="button" onClick={() => handleRemoveFeature(idx)} className="text-rose-400">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#8C857B] mb-1">Kumaş ve Bakım Talimatı</label>
                <textarea
                  rows={2}
                  value={formData.careInstructions}
                  onChange={(e) => setFormData({ ...formData, careInstructions: e.target.value })}
                  className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
                />
              </div>
              <div>
                <label className="block text-[#8C857B] mb-1">Ebat / Ölçü Detayı</label>
                <input
                  type="text"
                  value={formData.dimensions}
                  onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
                />
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#2A2825]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 bg-transparent text-[#8C857B] hover:text-[#F8F5EF] text-xs uppercase font-semibold"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-8 py-3.5 bg-[#B49A6A] text-[#F8F5EF] font-semibold uppercase tracking-widest hover:bg-[#988052] transition-colors shadow-lg"
            >
              {productToEdit ? 'Değişiklikleri Yayınla & Kaydet' : 'Ürünü Mağazada Yayınla'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
