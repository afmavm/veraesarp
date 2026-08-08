export interface ColorOption {
  name: string;
  hex: string;
  image?: string;
}

export interface ProductDetailItem {
  title: string;
  content: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
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
  images: string[];
  badges?: ('Yeni' | 'Özel Fiyat' | 'Çok Satan' | 'Limited')[];
  features: string[]; // e.g. ["✓ %100 Saf İpek", "✓ Özel El İşçiliği Kenar", "✓ Gün Boyu Şekil Alır"]
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
  top: number; // percentage
  left: number; // percentage
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
  paymentMethod: string;
  createdAt: string;
}
