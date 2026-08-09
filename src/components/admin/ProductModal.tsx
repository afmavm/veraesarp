'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Plus, Trash2, Upload, Sparkles, Image as ImageIcon, Check, MoveLeft, MoveRight, Video, Edit2, Settings2 } from 'lucide-react';
import { Product, ProductVariant, ColorOption } from '@/lib/types/ecommerce';
import { useToast } from '@/context/ToastContext';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Partial<Product>) => void;
  productToEdit?: Product | null;
}

// Turkish slugify helper
const slugifyTurkish = (str: string) => {
  return str
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
};

const DEFAULT_CATEGORIES = [
  { name: 'Eşarp', slug: 'esarp' },
  { name: 'Şal', slug: 'sal' },
  { name: 'Aksesuar', slug: 'aksesuar' },
];

const DEFAULT_FABRICS = [
  { name: 'Twill İpek', slug: 'twill' },
  { name: 'Saten İpek', slug: 'saten' },
  { name: 'Saf İpek', slug: 'ipek' },
  { name: 'Medine İpeği', slug: 'medine-ipegi' },
  { name: 'Pamuk & Bambu', slug: 'pamuk' },
  { name: 'Krep & Şifon', slug: 'krep' },
];

export default function ProductModal({
  isOpen,
  onClose,
  onSave,
  productToEdit,
}: ProductModalProps) {
  const { showToast } = useToast();

  // Dynamic Categories & Fabrics
  const [categoriesList, setCategoriesList] = useState(DEFAULT_CATEGORIES);
  const [fabricsList, setFabricsList] = useState(DEFAULT_FABRICS);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [isFabricManagerOpen, setIsFabricManagerOpen] = useState(false);

  // New Category / Fabric inputs
  const [newCatName, setNewCatName] = useState('');
  const [newFabricName, setNewFabricName] = useState('');

  // Auto-slug tracking
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

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
    category: 'esarp' as any,
    subcategory: 'twill-ipek',
    fabric: 'twill' as any,
    styleCategory: 'ofis' as any,
    collection: 'milano-romance',
    videoUrl: '',
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

  // Local inputs
  const [newFeatureText, setNewFeatureText] = useState('');
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#B49A6A');
  const [newImageUrl, setNewImageUrl] = useState('');

  // Persistent custom categories & fabrics
  useEffect(() => {
    try {
      const savedCats = localStorage.getItem('veraesarp_custom_categories');
      if (savedCats) setCategoriesList(JSON.parse(savedCats));

      const savedFabrics = localStorage.getItem('veraesarp_custom_fabrics');
      if (savedFabrics) setFabricsList(JSON.parse(savedFabrics));
    } catch (e) {
      console.error('Failed to load custom categories/fabrics', e);
    }
  }, []);

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
        videoUrl: productToEdit.videoUrl || '',
        careInstructions: productToEdit.careInstructions,
        dimensions: productToEdit.dimensions,
      });
      setImagesList(productToEdit.images || []);
      setColorSwatches(productToEdit.colors || []);
      setSizesList(productToEdit.sizes || ['90x90 cm']);
      setBadgesList(productToEdit.badges || []);
      setFeaturesList(productToEdit.features || []);
      setVariantsList(productToEdit.variants || []);
      setIsSlugManuallyEdited(true);
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
        videoUrl: '',
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
      setIsSlugManuallyEdited(false);
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  // AUTO-SLUG GENERATION HANDLER
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    if (!isSlugManuallyEdited) {
      const autoSlug = slugifyTurkish(newName);
      setFormData((prev) => ({ ...prev, name: newName, slug: autoSlug }));
    } else {
      setFormData((prev) => ({ ...prev, name: newName }));
    }
  };

  // CATEGORY & FABRIC CRUD HANDLERS
  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    const newSlug = slugifyTurkish(newCatName);
    const updated = [...categoriesList, { name: newCatName.trim(), slug: newSlug }];
    setCategoriesList(updated);
    localStorage.setItem('veraesarp_custom_categories', JSON.stringify(updated));
    setNewCatName('');
    showToast(`"${newCatName}" kategorisi başarıyla eklendi!`, 'success');
  };

  const handleDeleteCategory = (slug: string) => {
    const updated = categoriesList.filter((c) => c.slug !== slug);
    setCategoriesList(updated);
    localStorage.setItem('veraesarp_custom_categories', JSON.stringify(updated));
    showToast('Kategori silindi.', 'info');
  };

  const handleAddFabric = () => {
    if (!newFabricName.trim()) return;
    const newSlug = slugifyTurkish(newFabricName);
    const updated = [...fabricsList, { name: newFabricName.trim(), slug: newSlug }];
    setFabricsList(updated);
    localStorage.setItem('veraesarp_custom_fabrics', JSON.stringify(updated));
    setNewFabricName('');
    showToast(`"${newFabricName}" kumaş türü eklendi!`, 'success');
  };

  const handleDeleteFabric = (slug: string) => {
    const updated = fabricsList.filter((f) => f.slug !== slug);
    setFabricsList(updated);
    localStorage.setItem('veraesarp_custom_fabrics', JSON.stringify(updated));
    showToast('Kumaş türü silindi.', 'info');
  };

  // IMAGE REORDERING & UPLOAD HANDLERS
  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    const newIdx = direction === 'left' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= imagesList.length) return;
    const updated = [...imagesList];
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;
    setImagesList(updated);
    showToast('Görsel sıralaması güncellendi.', 'info');
  };

  // Modern WebP Image Compression Engine
  const compressImageToWebP = (file: File, maxWidth = 1600, quality = 0.82): Promise<{ webpDataUrl: string; origKB: number; newKB: number }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas ctx null'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const webpDataUrl = canvas.toDataURL('image/webp', quality);
          const origKB = Math.round(file.size / 1024);
          const newKB = Math.round((webpDataUrl.length * 3) / 4 / 1024);

          resolve({ webpDataUrl, origKB, newKB });
        };
        img.onerror = (err) => reject(err);
        img.src = event.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  // Dominant Color Extractor Engine
  const rgbToHex = (r: number, g: number, b: number) =>
    '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('').toUpperCase();

  const getClosestColorName = (r: number, g: number, b: number): string => {
    const PALETTE = [
      { name: 'Krem & Altın', r: 244, g: 235, b: 225 },
      { name: 'Altın Vizon', r: 180, g: 154, b: 106 },
      { name: 'Gece Mavisi', r: 27, g: 42, b: 74 },
      { name: 'Gül Vizonu', r: 198, g: 160, b: 150 },
      { name: 'Safır Mavi', r: 40, g: 80, b: 160 },
      { name: 'Zümrüt Yeşili', r: 34, g: 110, b: 70 },
      { name: 'Zarif Bordo', r: 130, g: 30, b: 45 },
      { name: 'Pudra Pembe', r: 240, g: 195, b: 205 },
      { name: 'Mürdüm & Mor', r: 100, g: 40, b: 90 },
      { name: 'Fildişi Beyaz', r: 250, g: 248, b: 242 },
      { name: 'Asil Siyah', r: 30, g: 30, b: 30 },
      { name: 'Toprak Taba', r: 160, g: 90, b: 45 },
      { name: 'Gümüş Gri', r: 180, g: 185, b: 190 },
    ];

    let minDistance = Infinity;
    let closestName = 'Özel Ton';

    PALETTE.forEach((item) => {
      const dist = Math.sqrt(
        Math.pow(r - item.r, 2) + Math.pow(g - item.g, 2) + Math.pow(b - item.b, 2)
      );
      if (dist < minDistance) {
        minDistance = dist;
        closestName = item.name;
      }
    });

    return closestName;
  };

  const extractDominantColor = (dataUrl: string): Promise<{ name: string; hex: string }> => {
    return new Promise((resolve) => {
      const img = document.createElement('img');
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ name: 'Vizon', hex: '#B49A6A' });
          return;
        }
        ctx.drawImage(img, 0, 0, 64, 64);
        const imgData = ctx.getImageData(0, 0, 64, 64).data;

        let rSum = 0, gSum = 0, bSum = 0, count = 0;
        for (let i = 0; i < imgData.length; i += 16) {
          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];
          const a = imgData[i + 3];

          // Exclude white background and dark borders
          if (a > 200 && !(r > 245 && g > 245 && b > 245)) {
            rSum += r;
            gSum += g;
            bSum += b;
            count++;
          }
        }

        if (count === 0) {
          resolve({ name: 'Krem & Altın', hex: '#F4EBE1' });
          return;
        }

        const rAvg = Math.round(rSum / count);
        const gAvg = Math.round(gSum / count);
        const bAvg = Math.round(bSum / count);

        const hex = rgbToHex(rAvg, gAvg, bAvg);
        const name = getClosestColorName(rAvg, gAvg, bAvg);

        resolve({ name, hex });
      };
      img.onerror = () => resolve({ name: 'Vizon', hex: '#B49A6A' });
      img.src = dataUrl;
    });
  };

  const handleScanImagesForColors = async () => {
    if (imagesList.length === 0) {
      showToast('Renk algılamak için önce ürün görseli yükleyiniz.', 'info');
      return;
    }

    showToast('Görseller analiz ediliyor ve renk paleti çıkarılıyor...', 'info');
    for (const imgUrl of imagesList) {
      const extracted = await extractDominantColor(imgUrl);
      setColorSwatches((prev) => {
        if (!prev.some((c) => c.name === extracted.name || c.hex === extracted.hex)) {
          return [...prev, extracted];
        }
        return prev;
      });
    }
    showToast('🎨 Görsellerden renkler otomatik algılandı ve swatche eklendi!', 'success');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        showToast('Görsel WebP formatına dönüştürülüyor ve sıkıştırılıyor...', 'info');
        const { webpDataUrl, origKB, newKB } = await compressImageToWebP(file);
        setImagesList((prev) => [...prev, webpDataUrl]);

        // Auto color extraction
        const autoColor = await extractDominantColor(webpDataUrl);
        setColorSwatches((prev) => {
          if (!prev.some((c) => c.name === autoColor.name)) {
            return [...prev, autoColor];
          }
          return prev;
        });

        const saving = Math.round(((origKB - newKB) / (origKB || 1)) * 100);
        showToast(`⚡ Görsel WebP optimize edildi! Renk algılandı: ${autoColor.name} (${autoColor.hex})`, 'success');
      } catch (err) {
        console.error(err);
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setImagesList((prev) => [...prev, reader.result as string]);
            showToast('Görsel galeriye eklendi.', 'success');
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData((prev) => ({ ...prev, videoUrl: reader.result as string }));
          showToast(`⚡ H.264/MP4 Video eklendi (${sizeMB} MB). Yüksek hız için optimize edildi.`, 'success');
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
      formData.slug.trim() || slugifyTurkish(formData.name);

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
      videoUrl: formData.videoUrl,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-hidden">
      <div className="bg-[#1C1B1A] border border-[#B49A6A] max-w-4xl w-full max-h-[92vh] text-[#F8F5EF] flex flex-col shadow-2xl rounded-sm overflow-hidden">
        {/* Fixed Header */}
        <div className="p-5 sm:p-6 border-b border-[#2A2825] flex items-center justify-between shrink-0 bg-[#1C1B1A]">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#F8F5EF]">
              {productToEdit ? 'Ürün & Detay Kartı Yönetimi' : 'Yeni Ürün & Tam Detay Ekle'}
            </h2>
            <p className="text-[11px] text-[#8C857B] mt-0.5">
              Ürün başlığından URL slug'ına, video galerisinden dinamik kategori ve kumaş yönetimine kadar her şeyi yönetin.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#8C857B] hover:text-[#F8F5EF] hover:bg-[#242321] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form id="productForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 text-xs">
          {/* TAB 1: TEMEL BİLGİLER & OTOMATİK SLUG */}
          <div className="space-y-4">
            <h3 className="font-serif text-base text-[#B49A6A] border-b border-[#2A2825] pb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>1. Ürün Kimlik &amp; Başlık Bilgileri (Otomatik URL / Slug)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-7">
                <label className="block text-[#8C857B] mb-1">Ürün Adı (Başlık) *</label>
                <input
                  type="text"
                  required
                  placeholder="ör: Vera Milano Twill İpek Eşarp — Krem & Altın"
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] font-serif text-sm focus:border-[#B49A6A] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-5">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[#8C857B]">URL / Slug (Otomatik Oluşturulur)</label>
                  <span className="text-[10px] text-[#B49A6A]">⚡ Otomatik SEO</span>
                </div>
                <input
                  type="text"
                  placeholder="ör: vera-milano-twill-ipek-esarp"
                  value={formData.slug}
                  onChange={(e) => {
                    setFormData({ ...formData, slug: e.target.value });
                    setIsSlugManuallyEdited(true);
                  }}
                  className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#B49A6A] font-mono text-xs focus:border-[#B49A6A] focus:outline-none"
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

              {/* DYNAMIC CATEGORY SELECT WITH inline CRUD */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[#8C857B]">Kategori *</label>
                  <button
                    type="button"
                    onClick={() => setIsCategoryManagerOpen(true)}
                    className="text-[10px] text-[#B49A6A] hover:underline flex items-center gap-0.5"
                  >
                    <Settings2 className="w-3 h-3" />
                    <span>Yönet</span>
                  </button>
                </div>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
                >
                  {categoriesList.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* DYNAMIC FABRIC SELECT WITH inline CRUD */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[#8C857B]">Kumaş Türü *</label>
                  <button
                    type="button"
                    onClick={() => setIsFabricManagerOpen(true)}
                    className="text-[10px] text-[#B49A6A] hover:underline flex items-center gap-0.5"
                  >
                    <Settings2 className="w-3 h-3" />
                    <span>Yönet</span>
                  </button>
                </div>
                <select
                  value={formData.fabric}
                  onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                  className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
                >
                  {fabricsList.map((f) => (
                    <option key={f.slug} value={f.slug}>
                      {f.name}
                    </option>
                  ))}
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

          {/* TAB 3: ÇOKLU GÖRSEL GALERİSİ (SIRA DEĞİŞTİRME) & VİDEO EKLEME */}
          <div className="p-4 bg-[#242321] border border-[#3A3835] space-y-4">
            {/* Enterprise Speed & Format Optimization Info Banner */}
            <div className="p-3 bg-[#1C1B1A] border-l-4 border-emerald-500 text-[11px] text-[#E8DED1] space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                <Sparkles className="w-4 h-4" />
                <span>⚡ Yüksek Hızlı E-Ticaret Medya Sıkıştırma Motoru (WebP &amp; AVIF &amp; MP4)</span>
              </div>
              <p className="text-[#8C857B] leading-relaxed">
                Yüklediğiniz tüm yüksek çözünürlüklü fotoğraflar yerel hafızada otomatik olarak **Next-Gen WebP (1600px max, %82 kalite)** formatına sıkıştırılır (%85'e varan alan tasarrufu ve milisaniyelik sayfa açılış hızı sağlar). Videolar ise HTML5 MP4/WebM standartlarında sunulur.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <h3 className="text-xs font-semibold text-[#B49A6A] uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  <span>3. Çoklu Görsel Galerisi &amp; Video Yükleme</span>
                </h3>
                <p className="text-[10px] text-[#8C857B]">Görsellerin sırasını yön butonları ile sürükleyip değiştirebilirsiniz.</p>
              </div>

              <div className="flex items-center gap-2">
                <label className="cursor-pointer px-3 py-1.5 bg-[#B49A6A] text-[#F8F5EF] text-[11px] font-semibold uppercase hover:bg-[#988052] transition-colors flex items-center gap-1.5 shadow-sm">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Resim Yükle</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>

                <label className="cursor-pointer px-3 py-1.5 bg-[#3A3835] text-[#F8F5EF] text-[11px] font-semibold uppercase hover:bg-[#B49A6A] transition-colors flex items-center gap-1.5 shadow-sm border border-[#5A5652]">
                  <Video className="w-3.5 h-3.5 text-rose-400" />
                  <span>Video Yükle (MP4)</span>
                  <input type="file" accept="video/*" onChange={handleVideoFileUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* Video Input URL */}
            <div className="p-3 bg-[#1C1B1A] border border-[#3A3835] space-y-2">
              <label className="block text-[11px] font-semibold text-[#B49A6A] flex items-center gap-1">
                <Video className="w-3.5 h-3.5" />
                <span>Ürün Tanıtım Videosu URL (MP4 / YouTube / Vimeo)</span>
              </label>
              <input
                type="text"
                placeholder="ör: https://my-cdn.com/videos/esarp-tanitim.mp4 veya YouTube Embed URL"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className="w-full p-2 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] font-mono text-[11px]"
              />
              {formData.videoUrl && (
                <p className="text-[10px] text-emerald-400">✓ Ürün detay sayfasında video oynatıcı kartı gösterilecek.</p>
              )}
            </div>

            {/* Image URL add input */}
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

            {/* Image Gallery Cards with Reordering Arrows */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
              {imagesList.map((img, idx) => (
                <div key={idx} className="relative aspect-[3/4] bg-[#171615] border border-[#3A3835] group overflow-hidden flex flex-col justify-between p-1">
                  <Image src={img} alt={`Görsel ${idx + 1}`} fill className="object-cover" />
                  
                  <span className="relative z-10 self-start bg-black/80 text-[9px] px-1.5 py-0.5 text-white font-mono rounded">
                    {idx === 0 ? 'Ana Görsel' : idx === 1 ? 'Hover' : `#${idx + 1}`}
                  </span>

                  {/* Reordering & Action Overlay */}
                  <div className="relative z-10 flex justify-between items-center bg-black/75 p-1 backdrop-blur-xs opacity-90 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveImage(idx, 'left')}
                      className="p-1 text-white hover:text-[#B49A6A] disabled:opacity-30 disabled:hover:text-white"
                      title="Sola / Öne Taşı"
                    >
                      <MoveLeft className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-1 text-rose-400 hover:text-rose-300"
                      title="Resmi Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      disabled={idx === imagesList.length - 1}
                      onClick={() => handleMoveImage(idx, 'right')}
                      className="p-1 text-white hover:text-[#B49A6A] disabled:opacity-30 disabled:hover:text-white"
                      title="Sağa / Arkaya Taşı"
                    >
                      <MoveRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
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

          {/* TAB 5: RENK PALETLERİ (OTOMATİK ALGI VE MANUEL DÜZELTME) */}
          <div className="p-4 bg-[#242321] border border-[#3A3835] space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-[#3A3835] pb-2">
              <div>
                <h3 className="text-xs font-semibold text-[#B49A6A] uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#B49A6A]" />
                  <span>5. Renk Swatch Seçenekleri (Otomatik Görsel Renk Algılama &amp; Manuel Düzeltme)</span>
                </h3>
                <p className="text-[10px] text-[#8C857B]">
                  Yüklediğiniz ürün fotoğraflarından baskın renk otomatik algılanır. Yanlış algılanırsa el ile kolayca düzeltebilirsiniz.
                </p>
              </div>

              <button
                type="button"
                onClick={handleScanImagesForColors}
                className="px-3 py-1.5 bg-[#B49A6A] text-[#F8F5EF] text-[11px] font-semibold uppercase hover:bg-[#988052] transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Görsellerden Rengi Otomatik Tara</span>
              </button>
            </div>

            {/* Manuel Renk Ekleme */}
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
                Manuel Renk Ekle
              </button>
            </div>

            {/* Swatch Listesi - Düzenlenebilir Renk ve İsim */}
            <div className="flex flex-wrap gap-3 pt-2">
              {colorSwatches.map((c, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-[#1C1B1A] border border-[#3A3835] shadow-sm">
                  {/* Düzenlenebilir Renk Seçici */}
                  <input
                    type="color"
                    value={c.hex}
                    onChange={(e) => {
                      const updated = [...colorSwatches];
                      updated[idx].hex = e.target.value;
                      setColorSwatches(updated);
                    }}
                    className="w-5 h-5 p-0 bg-transparent border-0 cursor-pointer rounded-full"
                    title="Rengi Elle Değiştir"
                  />

                  {/* Düzenlenebilir Renk İsmi */}
                  <input
                    type="text"
                    value={c.name}
                    onChange={(e) => {
                      const updated = [...colorSwatches];
                      updated[idx].name = e.target.value;
                      setColorSwatches(updated);
                    }}
                    className="bg-transparent font-semibold text-xs text-[#F8F5EF] border-b border-transparent hover:border-[#B49A6A] focus:border-[#B49A6A] focus:outline-none w-24"
                    placeholder="Renk Adı"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveColor(idx)}
                    className="text-rose-400 hover:text-rose-300 p-1"
                    title="Renklendirmeyi Sil"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* TAB 6: ÖZELLİKLER & AÇIKLAMALAR */}
          <div className="space-y-4">
            <h3 className="font-serif text-base text-[#B49A6A] border-b border-[#2A2825] pb-2">
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
        </form>

        {/* Fixed Footer Buttons */}
        <div className="p-4 sm:p-5 border-t border-[#2A2825] flex items-center justify-end gap-3 shrink-0 bg-[#1C1B1A]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-transparent text-[#8C857B] hover:text-[#F8F5EF] text-xs uppercase font-semibold"
          >
            İptal
          </button>
          <button
            type="submit"
            form="productForm"
            className="px-8 py-3 bg-[#B49A6A] text-[#F8F5EF] font-semibold text-xs uppercase tracking-widest hover:bg-[#988052] transition-colors shadow-lg"
          >
            {productToEdit ? 'Değişiklikleri Yayınla & Kaydet' : 'Ürünü Mağazada Yayınla'}
          </button>
        </div>
      </div>

      {/* MODAL 1: KATEGORİ YÖNETİCİSİ */}
      {isCategoryManagerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1C1B1A] border border-[#B49A6A] p-6 max-w-md w-full text-[#F8F5EF] space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-[#2A2825]">
              <h3 className="font-serif text-lg">Kategori Ekle / Sil / Yönet</h3>
              <button onClick={() => setIsCategoryManagerOpen(false)} className="text-[#8C857B] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Yeni Kategori Adı (ör: Şal)"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="flex-1 p-2 bg-[#242321] border border-[#3A3835] text-xs"
              />
              <button onClick={handleAddCategory} className="px-4 py-2 bg-[#B49A6A] text-xs font-semibold uppercase">
                Ekle
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {categoriesList.map((c) => (
                <div key={c.slug} className="flex justify-between items-center p-2.5 bg-[#242321] border border-[#3A3835] text-xs">
                  <div>
                    <span className="font-semibold text-white">{c.name}</span>
                    <span className="block text-[10px] text-[#8C857B] font-mono">slug: {c.slug}</span>
                  </div>
                  <button onClick={() => handleDeleteCategory(c.slug)} className="text-rose-400 hover:text-rose-300 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setIsCategoryManagerOpen(false)} className="px-4 py-2 bg-[#3A3835] text-xs uppercase">
                Tamam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: KUMAŞ TÜRÜ YÖNETİCİSİ */}
      {isFabricManagerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1C1B1A] border border-[#B49A6A] p-6 max-w-md w-full text-[#F8F5EF] space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-[#2A2825]">
              <h3 className="font-serif text-lg">Kumaş Türü Ekle / Sil / Yönet</h3>
              <button onClick={() => setIsFabricManagerOpen(false)} className="text-[#8C857B] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Yeni Kumaş Türü (ör: Şifon)"
                value={newFabricName}
                onChange={(e) => setNewFabricName(e.target.value)}
                className="flex-1 p-2 bg-[#242321] border border-[#3A3835] text-xs"
              />
              <button onClick={handleAddFabric} className="px-4 py-2 bg-[#B49A6A] text-xs font-semibold uppercase">
                Ekle
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {fabricsList.map((f) => (
                <div key={f.slug} className="flex justify-between items-center p-2.5 bg-[#242321] border border-[#3A3835] text-xs">
                  <div>
                    <span className="font-semibold text-white">{f.name}</span>
                    <span className="block text-[10px] text-[#8C857B] font-mono">slug: {f.slug}</span>
                  </div>
                  <button onClick={() => handleDeleteFabric(f.slug)} className="text-rose-400 hover:text-rose-300 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setIsFabricManagerOpen(false)} className="px-4 py-2 bg-[#3A3835] text-xs uppercase">
                Tamam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
