'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CustomerOrder,
  CariAccount,
  CariTransaction,
  CargoTrackingData,
  CampaignRule,
} from '@/lib/types/ecommerce';
import {
  MOCK_PRODUCTS,
  MOCK_ORDERS,
  MOCK_CARI_ACCOUNTS,
  MOCK_CARI_TRANSACTIONS,
  MOCK_CARGO_DATA,
  MOCK_CAMPAIGNS,
} from '@/lib/data/mock-data';

interface DataContextType {
  products: Product[];
  orders: CustomerOrder[];
  cariAccounts: CariAccount[];
  cariTransactions: CariTransaction[];
  campaigns: CampaignRule[];
  cargoData: Record<string, CargoTrackingData>;
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
  // Campaign actions
  toggleCampaign: (id: string) => void;
  updateCampaign: (id: string, updates: Partial<CampaignRule>) => void;
  // Cargo helper
  getCargoStatus: (query: string) => CargoTrackingData | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [orders, setOrders] = useState<CustomerOrder[]>(MOCK_ORDERS);
  const [cariAccounts, setCariAccounts] = useState<CariAccount[]>(MOCK_CARI_ACCOUNTS);
  const [cariTransactions, setCariTransactions] = useState<CariTransaction[]>(MOCK_CARI_TRANSACTIONS);
  const [campaigns, setCampaigns] = useState<CampaignRule[]>(MOCK_CAMPAIGNS);
  const [cargoData, setCargoData] = useState<Record<string, CargoTrackingData>>(MOCK_CARGO_DATA);
  const [isInitialized, setIsInitialized] = useState(false);

  // Persistence via localStorage
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem('veraesarp_products');
      if (savedProducts) setProducts(JSON.parse(savedProducts));

      const savedOrders = localStorage.getItem('veraesarp_orders');
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedCari = localStorage.getItem('veraesarp_cari');
      if (savedCari) setCariAccounts(JSON.parse(savedCari));

      const savedCampaigns = localStorage.getItem('veraesarp_campaigns');
      if (savedCampaigns) setCampaigns(JSON.parse(savedCampaigns));
    } catch (e) {
      console.error('Failed to load live data from localStorage', e);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('veraesarp_products', JSON.stringify(products));
        localStorage.setItem('veraesarp_orders', JSON.stringify(orders));
        localStorage.setItem('veraesarp_cari', JSON.stringify(cariAccounts));
        localStorage.setItem('veraesarp_campaigns', JSON.stringify(campaigns));
      } catch (e) {
        console.error('Failed to persist live data to localStorage', e);
      }
    }
  }, [products, orders, cariAccounts, campaigns, isInitialized]);

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

    // Create Cargo Timeline dynamically
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
          
          // Update cargo timeline if exists
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

    // Recalculate Cari Balance
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
  const toggleCampaign = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isEnabled: !c.isEnabled } : c))
    );
  };

  const updateCampaign = (id: string, updates: Partial<CampaignRule>) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  // Cargo helper
  const getCargoStatus = (query: string): CargoTrackingData | null => {
    const q = query.trim().toUpperCase();
    if (cargoData[q]) return cargoData[q];

    // Search by tracking code or order number
    const foundOrder = orders.find(
      (o) => o.orderNumber.toUpperCase() === q || (o.trackingCode && o.trackingCode.toUpperCase() === q)
    );

    if (foundOrder && cargoData[foundOrder.orderNumber]) {
      return cargoData[foundOrder.orderNumber];
    }

    // Default fallback mock if query matches demo order number
    if (q === 'VER-849201' || q === 'YURT-94820194') {
      return MOCK_CARGO_DATA['VER-849201'];
    }

    return null;
  };

  return (
    <DataContext.Provider
      value={{
        products,
        orders,
        cariAccounts,
        cariTransactions,
        campaigns,
        cargoData,
        addProduct,
        updateProduct,
        deleteProduct,
        addOrder,
        updateOrderStatus,
        addCariAccount,
        deleteCariAccount,
        addCariTransaction,
        toggleCampaign,
        updateCampaign,
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
