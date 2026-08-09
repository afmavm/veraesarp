'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CustomerOrder,
  CariAccount,
  CariTransaction,
  CargoTrackingData,
  CampaignRule,
  Coupon,
  SiteSettings,
} from '@/lib/types/ecommerce';
import {
  MOCK_PRODUCTS,
  MOCK_ORDERS,
  MOCK_CARI_ACCOUNTS,
  MOCK_CARI_TRANSACTIONS,
  MOCK_CARGO_DATA,
  MOCK_CAMPAIGNS,
  MOCK_COUPONS,
  DEFAULT_SITE_SETTINGS,
} from '@/lib/data/mock-data';

interface DataContextType {
  siteSettings: SiteSettings;
  products: Product[];
  orders: CustomerOrder[];
  cariAccounts: CariAccount[];
  cariTransactions: CariTransaction[];
  campaigns: CampaignRule[];
  coupons: Coupon[];
  cargoData: Record<string, CargoTrackingData>;
  isDbLoading: boolean;
  // Site settings action
  updateSiteSettings: (newSettings: Partial<SiteSettings>) => void;
  // Product actions
  addProduct: (productData: Partial<Product>) => Product;
  updateProduct: (id: string, productData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  // Order actions
  addOrder: (order: CustomerOrder) => void;
  updateOrderStatus: (
    orderId: string,
    status: CustomerOrder['status'],
    trackingCode?: string,
    carrier?: CustomerOrder['carrier']
  ) => void;
  // Cari actions
  addCariAccount: (cari: Omit<CariAccount, 'id' | 'createdAt'>) => void;
  deleteCariAccount: (id: string) => void;
  addCariTransaction: (transaction: Omit<CariTransaction, 'id'>) => void;
  // Campaign CRUD
  addCampaign: (campaign: Omit<CampaignRule, 'id'>) => void;
  updateCampaign: (id: string, updates: Partial<CampaignRule>) => void;
  deleteCampaign: (id: string) => void;
  toggleCampaign: (id: string) => void;
  // Coupon CRUD
  addCoupon: (couponData: { code: string; discountText: string; discountType: 'percentage' | 'fixed'; discountValue: number; minSpend: number }) => void;
  updateCoupon: (id: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  toggleCouponStatus: (id: string) => void;
  // Cargo helper
  getCargoStatus: (query: string) => CargoTrackingData | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [orders, setOrders] = useState<CustomerOrder[]>(MOCK_ORDERS);
  const [cariAccounts, setCariAccounts] = useState<CariAccount[]>(MOCK_CARI_ACCOUNTS);
  const [cariTransactions, setCariTransactions] = useState<CariTransaction[]>(MOCK_CARI_TRANSACTIONS);
  const [campaigns, setCampaigns] = useState<CampaignRule[]>(MOCK_CAMPAIGNS);
  const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS);
  const [cargoData, setCargoData] = useState<Record<string, CargoTrackingData>>(MOCK_CARGO_DATA);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDbLoading, setIsDbLoading] = useState(true);

  // 1. Initial Fetch from Permanent Database API
  useEffect(() => {
    async function loadDatabase() {
      try {
        const res = await fetch('/api/db');
        const json = await res.json();
        if (json.success && json.data) {
          if (json.data.siteSettings) setSiteSettings(json.data.siteSettings);
          if (json.data.products?.length) setProducts(json.data.products);
          if (json.data.orders) setOrders(json.data.orders);
          if (json.data.cariAccounts) setCariAccounts(json.data.cariAccounts);
          if (json.data.cariTransactions) setCariTransactions(json.data.cariTransactions);
          if (json.data.campaigns) setCampaigns(json.data.campaigns);
          if (json.data.coupons) setCoupons(json.data.coupons);
        }
      } catch (e) {
        console.error('Database fetch fallback to localStorage', e);
        try {
          const savedSettings = localStorage.getItem('veraesarp_site_settings');
          if (savedSettings) setSiteSettings(JSON.parse(savedSettings));

          const savedProducts = localStorage.getItem('veraesarp_products');
          if (savedProducts) setProducts(JSON.parse(savedProducts));
        } catch (err) {
          console.error(err);
        }
      } finally {
        setIsInitialized(true);
        setIsDbLoading(false);
      }
    }

    loadDatabase();
  }, []);

  // 2. Persist Changes to Permanent Database API & LocalStorage Cache
  useEffect(() => {
    if (isInitialized) {
      const payload = {
        siteSettings,
        products,
        orders,
        cariAccounts,
        cariTransactions,
        campaigns,
        coupons,
      };

      // LocalStorage Cache
      try {
        localStorage.setItem('veraesarp_site_settings', JSON.stringify(siteSettings));
        localStorage.setItem('veraesarp_products', JSON.stringify(products));
        localStorage.setItem('veraesarp_orders', JSON.stringify(orders));
        localStorage.setItem('veraesarp_cari', JSON.stringify(cariAccounts));
        localStorage.setItem('veraesarp_campaigns', JSON.stringify(campaigns));
        localStorage.setItem('veraesarp_coupons', JSON.stringify(coupons));
      } catch (e) {
        console.error(e);
      }

      // Asynchronous API call to write to Permanent Server Database
      fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch((err) => console.error('Database sync failed', err));
    }
  }, [siteSettings, products, orders, cariAccounts, cariTransactions, campaigns, coupons, isInitialized]);

  // Site Settings Actions
  const updateSiteSettings = (newSettings: Partial<SiteSettings>) => {
    setSiteSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Product Actions
  const addProduct = (productData: Partial<Product>): Product => {
    const newProd: Product = {
      id: productData.id || `p-${Date.now()}`,
      name: productData.name || 'Yeni Ürün',
      slug: productData.slug || `yeni-urun-${Date.now()}`,
      sku: productData.sku || `VER-NEW-${Math.floor(1000 + Math.random() * 9000)}`,
      barcode: productData.barcode || `8680001${Math.floor(10005 + Math.random() * 89999)}`,
      description: productData.description || 'Özel Vera Eşarp Dokuması',
      shortDescription: productData.shortDescription || '%100 Saf İpek',
      price: Number(productData.price) || 1500,
      compareAtPrice: productData.compareAtPrice ? Number(productData.compareAtPrice) : undefined,
      costPrice: productData.costPrice ? Number(productData.costPrice) : undefined,
      currency: '₺',
      stock: Number(productData.stock) || 20,
      rating: 5.0,
      reviewCount: 0,
      category: productData.category || 'esarp',
      fabric: productData.fabric || 'ipek',
      styleCategory: productData.styleCategory || 'ofis',
      colors: productData.colors || [{ name: 'Standart', hex: '#242321' }],
      sizes: productData.sizes || ['90x90 cm'],
      variants: productData.variants || [],
      images: productData.images || ['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=1200&auto=format&fit=crop'],
      videoUrl: productData.videoUrl,
      badges: productData.badges || ['Yeni'],
      features: productData.features || ['✓ %100 Saf İpek'],
      careInstructions: productData.careInstructions || 'Kuru temizleme önerilir.',
      dimensions: productData.dimensions || '90x90 cm',
      isNew: true,
      createdAt: new Date().toISOString(),
    };

    setProducts((prev) => [newProd, ...prev]);
    return newProd;
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? ({ ...p, ...productData } as Product) : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Order Actions
  const addOrder = (order: CustomerOrder) => {
    setOrders((prev) => [order, ...prev]);

    const cargoEntry: CargoTrackingData = {
      orderNumber: order.orderNumber,
      trackingCode: order.trackingCode || `YURT-${Math.floor(10000000 + Math.random() * 89999999)}`,
      carrier: order.carrier || 'Yurtiçi Kargo',
      customerName: order.customerName,
      estimatedDelivery: '3 İş Günü İçinde',
      currentStatus: 'Hazırlanıyor - Sipariş Onaylandı',
      timeline: [
        { step: 'Sipariş Alındı & Onaylandı', timestamp: 'Bugün', location: 'Vera Nişantaşı Depo', done: true, isCurrent: true },
        { step: 'Paketleme & Hediye Kutusu Hazırlığı', timestamp: 'Bekleniyor', location: 'Vera Depo', done: false, isCurrent: false },
        { step: 'Kargo Şubesine Teslimat', timestamp: 'Bekleniyor', location: 'Kargo Şubesi', done: false, isCurrent: false },
        { step: 'Dağıtıma Çıkarıldı', timestamp: 'Bekleniyor', location: 'Teslimat Şubesi', done: false, isCurrent: false },
        { step: 'Alıcıya Teslim Edildi', timestamp: 'Bekleniyor', location: order.address.city, done: false, isCurrent: false },
      ],
    };

    setCargoData((prev) => ({ ...prev, [order.orderNumber]: cargoEntry }));
  };

  const updateOrderStatus = (
    orderId: string,
    status: CustomerOrder['status'],
    trackingCode?: string,
    carrier?: CustomerOrder['carrier']
  ) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updated = { ...o, status, trackingCode: trackingCode || o.trackingCode, carrier: carrier || o.carrier };
          
          if (cargoData[o.orderNumber]) {
            const updatedTimeline = [...cargoData[o.orderNumber].timeline];
            if (status === 'Kargoda') {
              updatedTimeline[1].done = true;
              updatedTimeline[2].done = true;
              updatedTimeline[2].isCurrent = true;
            } else if (status === 'Teslim Edildi') {
              updatedTimeline.forEach((t) => (t.done = true));
            }
            setCargoData((prevData) => ({
              ...prevData,
              [o.orderNumber]: {
                ...prevData[o.orderNumber],
                currentStatus: status,
                timeline: updatedTimeline,
              },
            }));
          }
          return updated;
        }
        return o;
      })
    );
  };

  // Cari Actions
  const addCariAccount = (cari: Omit<CariAccount, 'id' | 'createdAt'>) => {
    const newCari: CariAccount = {
      ...cari,
      id: `cari-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCariAccounts((prev) => [newCari, ...prev]);
  };

  const deleteCariAccount = (id: string) => {
    setCariAccounts((prev) => prev.filter((c) => c.id !== id));
  };

  const addCariTransaction = (transaction: Omit<CariTransaction, 'id'>) => {
    const newTx: CariTransaction = {
      ...transaction,
      id: `ctx-${Date.now()}`,
    };
    setCariTransactions((prev) => [newTx, ...prev]);

    setCariAccounts((prev) =>
      prev.map((c) => {
        if (c.id === transaction.cariId) {
          const newBalance = transaction.isDebt
            ? c.balance + transaction.amount
            : c.balance - transaction.amount;
          return {
            ...c,
            balance: Math.abs(newBalance),
            balanceType: newBalance > 0 ? 'Borçlu' : newBalance < 0 ? 'Alacaklı' : 'Dengede',
          };
        }
        return c;
      })
    );
  };

  // Campaign Actions
  const addCampaign = (campaignData: Omit<CampaignRule, 'id'>) => {
    const newCmp: CampaignRule = {
      ...campaignData,
      id: `cmp-${Date.now()}`,
    };
    setCampaigns((prev) => [...prev, newCmp]);
  };

  const updateCampaign = (id: string, updates: Partial<CampaignRule>) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteCampaign = (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleCampaign = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isEnabled: !c.isEnabled } : c))
    );
  };

  // Coupon Actions
  const addCoupon = (data: { code: string; discountText: string; discountType: 'percentage' | 'fixed'; discountValue: number; minSpend: number }) => {
    const newCoup: Coupon = {
      id: `coup-${Date.now()}`,
      code: data.code.toUpperCase(),
      discountText: data.discountText,
      discountType: data.discountType,
      discountValue: Number(data.discountValue),
      minSpend: Number(data.minSpend),
      usageCount: 0,
      status: 'Aktif',
    };
    setCoupons((prev) => [newCoup, ...prev]);
  };

  const updateCoupon = (id: string, updates: Partial<Coupon>) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleCouponStatus = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: c.status === 'Aktif' ? 'Pasif' : 'Aktif' } : c))
    );
  };

  // Cargo helper
  const getCargoStatus = (query: string): CargoTrackingData | null => {
    const q = query.trim().toUpperCase();
    if (cargoData[q]) return cargoData[q];

    const foundOrder = orders.find(
      (o) => o.orderNumber.toUpperCase() === q || (o.trackingCode && o.trackingCode.toUpperCase() === q)
    );

    if (foundOrder && cargoData[foundOrder.orderNumber]) {
      return cargoData[foundOrder.orderNumber];
    }

    if (q === 'VER-849201' || q === 'YURT-94820194') {
      return MOCK_CARGO_DATA['VER-849201'];
    }

    return null;
  };

  return (
    <DataContext.Provider
      value={{
        siteSettings,
        products,
        orders,
        cariAccounts,
        cariTransactions,
        campaigns,
        coupons,
        cargoData,
        isDbLoading,
        updateSiteSettings,
        addProduct,
        updateProduct,
        deleteProduct,
        addOrder,
        updateOrderStatus,
        addCariAccount,
        deleteCariAccount,
        addCariTransaction,
        addCampaign,
        updateCampaign,
        deleteCampaign,
        toggleCampaign,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        toggleCouponStatus,
        getCargoStatus,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
