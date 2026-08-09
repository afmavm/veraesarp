'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Plus, Trash2, Upload, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Product, ProductVariant } from '@/lib/types/ecommerce';
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
    sku: '',
    barcode: '',
    price: 1890,
    compareAtPrice: 2250,
    costPrice: 850,
    stock: 25,
    category: 'esarp' as 'esarp' | 'sal' | 'aksesuar',
    fabric: 'ipek' as any,
    styleCategory: 'ofis' as any,
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=1200&auto=format&fit=crop',
    colorName: 'Krem & Altın',
    colorHex: '#F4EBE1',
  });

  const [variants, setVariants] = useState<ProductVariant[]>([]);

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        sku: productToEdit.sku,
        barcode: productToEdit.barcode || '',
        price: productToEdit.price,
        compareAtPrice: productToEdit.compareAtPrice || 0,
        costPrice: productToEdit.costPrice || 0,
        stock: productToEdit.stock,
        category: productToEdit.category,
        fabric: productToEdit.fabric,
        styleCategory: productToEdit.styleCategory,
        description: productToEdit.description,
        imageUrl: productToEdit.images[0] || '',
        colorName: productToEdit.colors[0]?.name || 'Standart',
        colorHex: productToEdit.colors[0]?.hex || '#242321',
      });
      setVariants(productToEdit.variants || []);
    } else {
      setFormData({
        name: '',
        sku: `VER-NEW-${Math.floor(1000 + Math.random() * 9000)}`,
        barcode: `8680001${Math.floor(10005 + Math.random() * 89999)}`,
        price: 1890,
        compareAtPrice: 2250,
        costPrice: 850,
        stock: 25,
        category: 'esarp',
        fabric: 'ipek',
        styleCategory: 'ofis',
        description: '',
        imageUrl: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=1200&auto=format&fit=crop',
        colorName: 'Krem & Altın',
        colorHex: '#F4EBE1',
      });
      setVariants([]);
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  // Local File Upload Reader (Base64)
  const handleLocalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData({ ...formData, imageUrl: reader.result });
          showToast('Yerel resim yüklendi ve önizlemeye eklendi.', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddVariant = () => {
    const newVariant: ProductVariant = {
      id: `v-${Date.now()}`,
      colorName: formData.colorName,
      colorHex: formData.colorHex,
      size: '90x90 cm',
      sku: `${formData.sku || 'VER'}-V${variants.length + 1}`,
      stock: 10,
      price: formData.price,
    };
    setVariants([...variants, newVariant]);
  };

  const handleDeleteVariant = (id: string) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: productToEdit ? productToEdit.id : undefined,
      name: formData.name,
      slug: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      sku: formData.sku,
      barcode: formData.barcode,
      price: Number(formData.price),
      compareAtPrice: Number(formData.compareAtPrice) || undefined,
      costPrice: Number(formData.costPrice) || undefined,
      stock: Number(formData.stock),
      category: formData.category,
      fabric: formData.fabric,
      styleCategory: formData.styleCategory,
      description: formData.description || '%100 Saf İpek Dokumalı Özel Vera Ürünü.',
      shortDescription: '%100 Saf İpek Dokuma, El Dikişli Kenar',
      images: [formData.imageUrl],
      colors: [{ name: formData.colorName, hex: formData.colorHex }],
      sizes: ['90x90 cm'],
      variants: variants,
      badges: ['Yeni'],
      features: ['✓ %100 Saf İpek', '✓ Özel İtalyan Kenar Dikişi'],
      careInstructions: 'Kuru temizleme önerilir.',
      dimensions: '90x90 cm',
      isNew: true,
      currency: '₺',
      rating: 5.0,
      reviewCount: 0,
      createdAt: productToEdit ? productToEdit.createdAt : new Date().toISOString(),
    });
  };

  const marginAmount = formData.price - formData.costPrice;
  const marginPercent = formData.price > 0 ? Math.round((marginAmount / formData.price) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#1C1B1A] border border-[#B49A6A] p-6 sm:p-8 max-w-2xl w-full text-[#F8F5EF] space-y-6 shadow-2xl my-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#2A2825]">
          <h2 className="font-serif text-2xl font-normal text-[#F8F5EF]">
            {productToEdit ? 'Ürünü Düzenle' : 'Gelişmiş Ürün & Varyant Ekle'}
          </h2>
          <button onClick={onClose} className="p-1 text-[#8C857B] hover:text-[#F8F5EF]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Basic Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#8C857B] mb-1">Ürün Adı *</label>
              <input
                type="text"
                required
                placeholder="ör: Vera Milano Twill İpek Eşarp"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[#8C857B] mb-1">SKU Kodu *</label>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full p-3 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] font-mono"
                />
              </div>
              <div>
                <label className="block text-[#8C857B] mb-1">Barkod (GTIN)</label>
                <input
                  type="text"
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  className="w-full p-3 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] font-mono"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Profit Margin */}
          <div className="p-4 bg-[#242321] border border-[#3A3835] space-y-3">
            <span className="text-[11px] font-semibold text-[#B49A6A] uppercase tracking-wider block">
              Fiyatlandırma &amp; Kar Marjı Takibi
            </span>
            <div className="grid grid-cols-3 gap-4">
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
                <label className="block text-[#8C857B] mb-1">İndirimsiz Fiyat (₺)</label>
                <input
                  type="number"
                  value={formData.compareAtPrice}
                  onChange={(e) => setFormData({ ...formData, compareAtPrice: Number(e.target.value) })}
                  className="w-full p-2.5 bg-[#1C1B1A] border border-[#3A3835] text-[#F8F5EF]"
                />
              </div>
              <div>
                <label className="block text-[#8C857B] mb-1">Maliyet (₺)</label>
                <input
                  type="number"
                  value={formData.costPrice}
                  onChange={(e) => setFormData({ ...formData, costPrice: Number(e.target.value) })}
                  className="w-full p-2.5 bg-[#1C1B1A] border border-[#3A3835] text-[#F8F5EF]"
                />
              </div>
            </div>
            <div className="text-[11px] text-[#8C857B] flex justify-between pt-1">
              <span>Tahmini Brüt Kar: <strong className="text-emerald-400">₺{marginAmount.toLocaleString('tr-TR')}</strong></span>
              <span>Marj Oranı: <strong className="text-[#B49A6A]">%{marginPercent}</strong></span>
            </div>
          </div>

          {/* Local File Upload Section */}
          <div className="p-4 bg-[#242321] border border-[#3A3835] space-y-3">
            <span className="text-[11px] font-semibold text-[#B49A6A] uppercase tracking-wider block flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span>Görsel Yükleme (URL veya Bilgisayardan Yükle)</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <div className="sm:col-span-8 space-y-2">
                <input
                  type="text"
                  placeholder="Görsel HTTPS URL adresi..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full p-2.5 bg-[#1C1B1A] border border-[#3A3835] text-[#F8F5EF] font-mono text-[11px]"
                />
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer px-4 py-2 bg-[#3A3835] text-[#F8F5EF] text-xs font-semibold uppercase hover:bg-[#B49A6A] transition-colors inline-flex items-center gap-2">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Bilgisayardan Resim Seç</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLocalFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Preview */}
              <div className="sm:col-span-4 relative aspect-[3/4] w-24 bg-[#171615] border border-[#B49A6A] overflow-hidden mx-auto sm:mx-0">
                {formData.imageUrl ? (
                  <Image src={formData.imageUrl} alt="Önizleme" fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-[#8C857B]">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Category & Fabric */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[#8C857B] mb-1">Stok Adedi *</label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
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
                onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
              >
                <option value="ipek">Saf İpek</option>
                <option value="twill">Twill İpek</option>
                <option value="saten">Saten İpek</option>
                <option value="medine-ipegi">Medine İpeği</option>
                <option value="pamuk">Pamuk / Bambu</option>
              </select>
            </div>
          </div>

          {/* Advanced Variant Section */}
          <div className="p-4 bg-[#242321] border border-[#3A3835] space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-semibold text-[#B49A6A] uppercase tracking-wider">
                Ürün Varyantları ({variants.length})
              </span>
              <button
                type="button"
                onClick={handleAddVariant}
                className="text-[11px] text-[#B49A6A] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Varyant Ekle</span>
              </button>
            </div>

            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {variants.map((v) => (
                <div key={v.id} className="p-2 bg-[#1C1B1A] border border-[#3A3835] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border border-[#3A3835]" style={{ backgroundColor: v.colorHex }} />
                    <span className="font-semibold text-[#F8F5EF]">{v.colorName}</span>
                    <span className="text-[#8C857B]">({v.size})</span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px]">
                    <span>Stok: <strong>{v.stock}</strong></span>
                    <button
                      type="button"
                      onClick={() => handleDeleteVariant(v.id)}
                      className="text-rose-400 hover:text-rose-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2A2825]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-transparent text-[#8C857B] hover:text-[#F8F5EF] text-xs uppercase"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#B49A6A] text-[#F8F5EF] font-semibold uppercase tracking-wider hover:bg-[#988052] transition-colors"
            >
              {productToEdit ? 'Değişiklikleri Kaydet' : 'Ürünü Yayınla'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
