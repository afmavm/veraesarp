export interface ColorOption {
  name: string;
  hex: string;
  image?: string; // base64 or URL
}

export interface ProductDetailItem {
  title: string;
  content: string;
}

export interface ProductVariant {
  id: string;
  colorName: string;
  colorHex: string;
  size: string;
  sku: string;
  stock: number;
  price: number;
  imageUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  barcode?: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number; // Maliyet fiyatı (Kar marjı takibi için)
  currency: string;
  stock: number;
  rating: number;
  reviewCount: number;
  category: 'esarp' | 'sal' | 'aksesuar';
  subcategory?: string;
  fabric: 'ipek' | 'saten' | 'twill' | 'pamuk' | 'medine-ipegi' | 'diger';
  styleCategory: 'gunluk' | 'ofis' | 'davet' | 'ozel-gun';
  collection?: string;
  colors: ColorOption[];
  sizes: string[];
  variants?: ProductVariant[];
  images: string[]; // Base64 or HTTPS URLs
  videoUrl?: string; // MP4 URL or Youtube embed URL or Base64 video
  badges?: ('Yeni' | 'Özel Fiyat' | 'Çok Satan' | 'Limited' | 'Flaş İndirim')[];
  features: string[];
  careInstructions: string;
  dimensions: string;
  isNew?: boolean;
  isBestseller?: boolean;
  isFeatured?: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  subcategories?: { name: string; slug: string }[];
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  bannerImage: string;
}

export interface CartItem {
  id: string; // productId + color + size
  product: Product;
  selectedColor: ColorOption;
  selectedSize?: string;
  quantity: number;
}

export interface FilterState {
  category?: string;
  subcategory?: string;
  fabric?: string[];
  styleCategory?: string[];
  colors?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sort?: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'bestselling';
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  category: string;
  readTime: string;
  publishedAt: string;
  tags: string[];
}

export interface HotspotItem {
  id: string;
  productId: string;
  top: number;
  left: number;
  label: string;
}

export interface LookCombination {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  hotspots: HotspotItem[];
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  address: {
    city: string;
    district: string;
    fullAddress: string;
    postalCode?: string;
  };
  items: {
    productName: string;
    color: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: 'Hazırlanıyor' | 'Kargoda' | 'Teslim Edildi' | 'İptal Edildi';
  trackingCode?: string;
  carrier?: 'Yurtiçi Kargo' | 'Aras Kargo' | 'MNG Kargo' | 'Trendyol Express';
  paymentMethod: string;
  couponCode?: string;
  createdAt: string;
}

// CARİ İŞLEMLER (Current Account / Ledger)
export interface CariTransaction {
  id: string;
  cariId: string;
  date: string;
  documentNo: string;
  description: string;
  type: 'Fatura' | 'Tahsilat' | 'Ödeme' | 'İrsaliye' | 'Devir' | 'Satış Faturası';
  amount: number;
  isDebt: boolean; // true: Borç (Alacaklı taraf), false: Alacak
}

export interface CariAccount {
  id: string;
  code: string;
  title: string;
  taxOffice?: string;
  taxNumber?: string;
  type: 'Tedarikçi' | 'Toptancı' | 'Kurumsal Müşteri' | 'Perakende Müşteri' | 'Müşteri';
  balance: number;
  balanceType: 'Borçlu' | 'Alacaklı' | 'Dengede';
  phone: string;
  email: string;
  address: string;
  city: string;
  createdAt: string;
}

// CANLI KARGO TAKİP ZAMAN ÇİZELGESİ
export interface CargoTimelineStep {
  step: string;
  timestamp: string;
  location: string;
  done: boolean;
  isCurrent: boolean;
}

export interface CargoTrackingData {
  orderNumber: string;
  trackingCode: string;
  carrier: 'Yurtiçi Kargo' | 'Aras Kargo' | 'MNG Kargo' | 'Trendyol Express';
  customerName: string;
  estimatedDelivery: string;
  currentStatus: string;
  timeline: CargoTimelineStep[];
}

// İLERİ DÜZEY SATIŞ VE KAMPANYA YÖNETİMİ (SENARYO BAZLI)
export interface CampaignRule {
  id: string;
  title: string;
  subtitle: string;
  type: 'flash_sale' | 'free_gift' | 'tiered_discount' | 'bundle_save' | 'vip_discount';
  isEnabled: boolean;
  // Flash Sale Senaryo Alanları
  discountPercentage?: number;
  endTime?: string;
  showCountdown?: boolean;
  applicableCategory?: string;
  // Free Gift Senaryo Alanları
  minCartAmount?: number;
  giftProductName?: string;
  giftProductImage?: string;
  giftStock?: number;
  // Tiered Discount Senaryo Alanları (Kademeli Çok Al Az Öde)
  tier1Count?: number;
  tier1Discount?: number; // %10
  tier2Count?: number;
  tier2Discount?: number; // %20
  // Bundle / VIP Senaryo Alanları
  bundleTitle?: string;
  vipTierOnly?: boolean;
  createdAt?: string;
}

// KUPON KODLARI YÖNETİMİ
export interface Coupon {
  id: string;
  code: string;
  discountText: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend: number;
  usageCount: number;
  maxUsesPerCustomer?: number; // Müşteri başına kullanım hakkı (ör: 1 defa)
  usedByEmails?: string[]; // Kuponu daha önce kullanan e-postalar
  status: 'Aktif' | 'Pasif';
  expiryDate?: string;
}

export interface FooterLink {
  label: string;
  url: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface EmailServerSettings {
  isEnabled: boolean;
  provider: 'smtp' | 'resend' | 'gmail' | 'cpanel';
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword?: string;
  senderName: string;
  senderEmail: string;
  encryption: 'tls' | 'ssl' | 'none';
  apiKey?: string;
}

// FİLTRE SEÇENEĞİ (Kategori Sayfası Yan Filtreler İçin)
export interface FilterOption {
  id: string;    // Ürün eşleştirmede kullanılan teknik değer (ör: twill, ofis)
  label: string; // Ziyaretçiye gösterilen yazı (ör: Twill İpek)
}

export interface ValuePropositionItem {
  id: string;
  title: string;
  description: string;
  iconName?: string; // 'Award' | 'Truck' | 'RotateCcw' | 'ShieldCheck'
}

// SİTE & MARKA AYARLARI (Footer, İletişim & Kurumsal Bilgiler)
export interface SiteSettings {
  name: string;
  tagline: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  freeShippingThreshold: number;
  instagramUrl: string;
  facebookUrl: string;
  pinterestUrl: string;
  whatsappPhone: string;
  workingHours: string;
  taxOffice?: string;
  taxNumber?: string;
  footerColumns?: FooterColumn[];
  valuePropositions?: ValuePropositionItem[];
  emailSettings?: EmailServerSettings;
  // Kategori sayfası filtre yönetimi
  fabricFilters?: FilterOption[];   // Kumaş Türü filtre seçenekleri
  styleFilters?: FilterOption[];    // Kullanım Stili filtre seçenekleri
}
