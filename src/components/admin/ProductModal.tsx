'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Product } from '@/lib/types/ecommerce';

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
  const [formData, setFormData] = useState({
    name: '',
    price: 1890,
    compareAtPrice: 2250,
    stock: 25,
    category: 'esarp' as 'esarp' | 'sal' | 'aksesuar',
    fabric: 'ipek' as any,
    styleCategory: 'ofis' as any,
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=1200&auto=format&fit=crop',
    colorName: 'Krem & Altın',
    colorHex: '#F4EBE1',
  });

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        price: productToEdit.price,
        compareAtPrice: productToEdit.compareAtPrice || 0,
        stock: productToEdit.stock,
        category: productToEdit.category,
        fabric: productToEdit.fabric,
        styleCategory: productToEdit.styleCategory,
        description: productToEdit.description,
        imageUrl: productToEdit.images[0] || '',
        colorName: productToEdit.colors[0]?.name || 'Standart',
        colorHex: productToEdit.colors[0]?.hex || '#242321',
      });
    } else {
      setFormData({
        name: '',
        price: 1890,
        compareAtPrice: 2250,
        stock: 25,
        category: 'esarp',
        fabric: 'ipek',
        styleCategory: 'ofis',
        description: '',
        imageUrl: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=1200&auto=format&fit=crop',
        colorName: 'Krem & Altın',
        colorHex: '#F4EBE1',
      });
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: productToEdit ? productToEdit.id : undefined,
      name: formData.name,
      slug: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      sku: productToEdit ? productToEdit.sku : `VER-NEW-${Math.floor(100 + Math.random() * 900)}`,
      price: Number(formData.price),
      compareAtPrice: Number(formData.compareAtPrice) || undefined,
      stock: Number(formData.stock),
      category: formData.category,
      fabric: formData.fabric,
      styleCategory: formData.styleCategory,
      description: formData.description || '%100 Saf İpek Dokumalı Özel Vera Ürünü.',
      shortDescription: '%100 Saf İpek Dokuma, El Dikişli Kenar',
      images: [formData.imageUrl],
      colors: [{ name: formData.colorName, hex: formData.colorHex }],
      sizes: ['90x90 cm'],
      badges: ['Yeni'],
      features: ['✓ Saf Dokuma İpek', '✓ Özel İtalyan Kenar Dikişi'],
      careInstructions: 'Kuru temizleme önerilir.',
      dimensions: '90x90 cm',
      isNew: true,
      currency: '₺',
      rating: 5.0,
      reviewCount: 0,
      createdAt: productToEdit ? productToEdit.createdAt : new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#1C1B1A] border border-[#B49A6A] p-6 sm:p-8 max-w-xl w-full text-[#F8F5EF] space-y-6 shadow-2xl my-8">
        <div className="flex items-center justify-between pb-4 border-b border-[#2A2825]">
          <h2 className="font-serif text-2xl font-normal text-[#F8F5EF]">
            {productToEdit ? 'Ürünü Düzenle' : 'Kataloğa Yeni Ürün Ekle'}
          </h2>
          <button onClick={onClose} className="p-1 text-[#8C857B] hover:text-[#F8F5EF]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#8C857B] mb-1">Satış Fiyatı (₺) *</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full p-3 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#8C857B] mb-1">İndirim Öncesi Fiyat (₺)</label>
              <input
                type="number"
                value={formData.compareAtPrice}
                onChange={(e) => setFormData({ ...formData, compareAtPrice: Number(e.target.value) })}
                className="w-full p-3 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#8C857B] mb-1">Stok Adedi *</label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="w-full p-3 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#8C857B] mb-1">Kategori *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full p-3 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none"
              >
                <option value="esarp">Eşarp</option>
                <option value="sal">Şal</option>
                <option value="aksesuar">Aksesuar</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#8C857B] mb-1">Kumaş Türü *</label>
              <select
                value={formData.fabric}
                onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                className="w-full p-3 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none"
              >
                <option value="ipek">Saf İpek</option>
                <option value="twill">Twill İpek</option>
                <option value="saten">Saten İpek</option>
                <option value="medine-ipegi">Medine İpeği</option>
                <option value="pamuk">Pamuk / Bambu</option>
              </select>
            </div>

            <div>
              <label className="block text-[#8C857B] mb-1">Stil Kategorisi *</label>
              <select
                value={formData.styleCategory}
                onChange={(e) => setFormData({ ...formData, styleCategory: e.target.value })}
                className="w-full p-3 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none"
              >
                <option value="ofis">Ofis / İş</option>
                <option value="gunluk">Günlük</option>
                <option value="davet">Davet</option>
                <option value="ozel-gun">Özel Gün</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#8C857B] mb-1">Görsel URL *</label>
            <input
              type="text"
              required
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full p-3 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block text-[#8C857B] mb-1">Ürün Açıklaması</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none"
            />
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
