'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Edit, Search, SlidersHorizontal, Package, AlertCircle } from 'lucide-react';
import { Product } from '@/lib/types/ecommerce';

interface AdminProductsProps {
  products: Product[];
  onDeleteProduct: (id: string) => void;
  onOpenProductModal: (productToEdit?: Product) => void;
}

export default function AdminProducts({
  products,
  onDeleteProduct,
  onOpenProductModal,
}: AdminProductsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFabric, setSelectedFabric] = useState<string>('all');

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = prod.name.toLowerCase().includes(q);
        const matchesSku = prod.sku.toLowerCase().includes(q);
        if (!matchesName && !matchesSku) return false;
      }

      if (selectedCategory !== 'all' && prod.category !== selectedCategory) return false;
      if (selectedFabric !== 'all' && prod.fabric !== selectedFabric) return false;

      return true;
    });
  }, [products, searchQuery, selectedCategory, selectedFabric]);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-[#2A2825]">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#F8F5EF]">Ürün &amp; Stok Kataloğu</h1>
          <p className="text-xs text-[#8C857B]">Tüm eşarp, şal ve aksesuar modellerinizi yönetin ve yeni varyantlar ekleyin.</p>
        </div>

        <button
          onClick={() => onOpenProductModal()}
          className="px-5 py-3 bg-[#B49A6A] text-[#F8F5EF] text-xs font-semibold uppercase tracking-wider hover:bg-[#988052] transition-colors flex items-center justify-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Ürün Ekle</span>
        </button>
      </div>

      {/* Control & Filter Bar */}
      <div className="p-4 bg-[#1C1B1A] border border-[#2A2825] flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Ürün adı veya SKU ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 px-3 pr-9 bg-[#242321] border border-[#3A3835] text-xs text-[#F8F5EF] placeholder-[#8C857B] focus:outline-none focus:border-[#B49A6A]"
          />
          <Search className="w-4 h-4 text-[#8C857B] absolute right-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs text-[#8C857B]">
            <SlidersHorizontal className="w-4 h-4 text-[#B49A6A]" />
            <span>Kategori:</span>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#242321] border border-[#3A3835] text-xs text-[#F8F5EF] py-2 px-3 focus:outline-none focus:border-[#B49A6A]"
          >
            <option value="all">Tüm Kategoriler</option>
            <option value="esarp">Eşarp</option>
            <option value="sal">Şal</option>
            <option value="aksesuar">Aksesuar</option>
          </select>

          <select
            value={selectedFabric}
            onChange={(e) => setSelectedFabric(e.target.value)}
            className="bg-[#242321] border border-[#3A3835] text-xs text-[#F8F5EF] py-2 px-3 focus:outline-none focus:border-[#B49A6A]"
          >
            <option value="all">Tüm Kumaşlar</option>
            <option value="twill">Twill İpek</option>
            <option value="saten">Saten İpek</option>
            <option value="ipek">Saf İpek</option>
            <option value="medine-ipegi">Medine İpeği</option>
            <option value="pamuk">Pamuk &amp; Bambu</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#1C1B1A] border border-[#2A2825] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#E8DED1]">
            <thead className="bg-[#242321] text-[#B49A6A] uppercase tracking-wider text-[11px] border-b border-[#2A2825]">
              <tr>
                <th className="p-4">Görsel</th>
                <th className="p-4">Ürün Adı &amp; SKU</th>
                <th className="p-4">Kategori &amp; Kumaş</th>
                <th className="p-4">Fiyat</th>
                <th className="p-4">Stok Adedi</th>
                <th className="p-4">Durum</th>
                <th className="p-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2825]">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#8C857B]">
                    Arama kriterlerine uygun ürün bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#242321] transition-colors">
                    <td className="p-4">
                      <div className="relative w-12 h-14 bg-[#171615] overflow-hidden border border-[#3A3835]">
                        <Image src={prod.images[0]} alt={prod.name} fill className="object-cover" />
                      </div>
                    </td>

                    <td className="p-4 space-y-1">
                      <h4 className="font-serif text-sm font-semibold text-[#F8F5EF] line-clamp-1">{prod.name}</h4>
                      <span className="text-[10px] text-[#B49A6A] font-mono block">SKU: {prod.sku}</span>
                    </td>

                    <td className="p-4 uppercase text-[10px] text-[#8C857B]">
                      {prod.category} • <strong className="text-[#E8DED1]">{prod.fabric}</strong>
                    </td>

                    <td className="p-4 font-semibold text-[#B49A6A]">
                      ₺{prod.price.toLocaleString('tr-TR')}
                      {prod.compareAtPrice && (
                        <span className="text-[10px] text-[#8C857B] line-through block font-normal">
                          ₺{prod.compareAtPrice.toLocaleString('tr-TR')}
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <span className={`font-bold ${prod.stock <= 15 ? 'text-amber-400' : 'text-[#F8F5EF]'}`}>
                        {prod.stock} adet
                      </span>
                    </td>

                    <td className="p-4">
                      {prod.stock > 0 ? (
                        <span className="px-2 py-0.5 bg-emerald-900/40 text-emerald-300 text-[10px] font-bold uppercase rounded">
                          Stokta Var
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-rose-900/40 text-rose-300 text-[10px] font-bold uppercase rounded">
                          Tükendi
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onOpenProductModal(prod)}
                          className="p-2 bg-[#242321] border border-[#3A3835] text-[#E8DED1] hover:text-[#B49A6A] hover:border-[#B49A6A] transition-colors"
                          title="Düzenle"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteProduct(prod.id)}
                          className="p-2 bg-[#242321] border border-[#3A3835] text-rose-400 hover:bg-rose-900/30 hover:border-rose-500 transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
