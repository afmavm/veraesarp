'use client';

import React, { useState } from 'react';
import AdminSidebar, { AdminTab } from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminOverview from '@/components/admin/AdminOverview';
import AdminProducts from '@/components/admin/AdminProducts';
import AdminOrders from '@/components/admin/AdminOrders';
import AdminCustomers from '@/components/admin/AdminCustomers';
import AdminCoupons from '@/components/admin/AdminCoupons';
import AdminCMS from '@/components/admin/AdminCMS';
import AdminSettings from '@/components/admin/AdminSettings';
import ProductModal from '@/components/admin/ProductModal';
import OrderInvoiceModal from '@/components/admin/OrderInvoiceModal';
import { MOCK_PRODUCTS, MOCK_ORDERS } from '@/lib/data/mock-data';
import { Product, CustomerOrder } from '@/lib/types/ecommerce';
import { useToast } from '@/context/ToastContext';

export default function ExecutiveAdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [productsList, setProductsList] = useState<Product[]>(MOCK_PRODUCTS);
  const [ordersList, setOrdersList] = useState<CustomerOrder[]>(MOCK_ORDERS);

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<CustomerOrder | null>(null);

  const { showToast } = useToast();

  // Handlers
  const handleOpenProductModal = (productToEdit?: Product) => {
    setEditingProduct(productToEdit || null);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (productData: Partial<Product>) => {
    if (editingProduct) {
      // Update existing
      setProductsList((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? ({ ...p, ...productData } as Product) : p))
      );
      showToast(`${productData.name} ürünü güncellendi!`, 'success');
    } else {
      // Add new
      const created: Product = {
        id: `p-${Date.now()}`,
        name: productData.name || 'Yeni Ürün',
        slug: productData.slug || `yeni-urun-${Date.now()}`,
        sku: productData.sku || `VER-${Math.floor(1000 + Math.random() * 9000)}`,
        description: productData.description || 'Özel Vera Eşarp ürünü.',
        shortDescription: productData.shortDescription || '%100 Saf İpek',
        price: productData.price || 1500,
        compareAtPrice: productData.compareAtPrice,
        currency: '₺',
        stock: productData.stock || 20,
        rating: 5.0,
        reviewCount: 0,
        category: productData.category || 'esarp',
        fabric: productData.fabric || 'ipek',
        styleCategory: productData.styleCategory || 'ofis',
        colors: productData.colors || [{ name: 'Krem', hex: '#F4EBE1' }],
        sizes: productData.sizes || ['90x90 cm'],
        images: productData.images || ['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=1200&auto=format&fit=crop'],
        badges: productData.badges || ['Yeni'],
        features: productData.features || ['✓ %100 Saf İpek'],
        careInstructions: productData.careInstructions || 'Kuru temizleme önerilir.',
        dimensions: productData.dimensions || '90x90 cm',
        isNew: true,
        createdAt: new Date().toISOString(),
      };
      setProductsList([created, ...productsList]);
      showToast(`${created.name} kataloğa eklendi!`, 'success');
    }
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
    setProductsList((prev) => prev.filter((p) => p.id !== id));
    showToast('Ürün katalogdan kaldırıldı.', 'info');
  };

  const handleUpdateOrderStatus = (orderId: string, status: CustomerOrder['status']) => {
    setOrdersList((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(`Sipariş durumu "${status}" olarak güncellendi.`, 'success');
  };

  const pendingOrdersCount = ordersList.filter((o) => o.status === 'Hazırlanıyor').length;
  const lowStockCount = productsList.filter((p) => p.stock <= 15).length;

  return (
    <div className="min-h-screen bg-[#171615] text-[#F8F5EF] flex flex-col lg:flex-row antialiased selection:bg-[#B49A6A] selection:text-[#F8F5EF]">
      {/* Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingOrdersCount={pendingOrdersCount}
        lowStockCount={lowStockCount}
      />

      {/* Main Content View */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onOpenProductModal={() => handleOpenProductModal()}
          onSearch={(query) => {
            if (query && activeTab !== 'products' && activeTab !== 'orders') {
              setActiveTab('products');
            }
          }}
        />

        <main className="flex-1 p-6 sm:p-10 bg-[#242321]">
          {activeTab === 'overview' && (
            <AdminOverview
              products={productsList}
              orders={ordersList}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'products' && (
            <AdminProducts
              products={productsList}
              onDeleteProduct={handleDeleteProduct}
              onOpenProductModal={handleOpenProductModal}
            />
          )}

          {activeTab === 'orders' && (
            <AdminOrders
              orders={ordersList}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onOpenInvoiceModal={(order) => setSelectedInvoiceOrder(order)}
            />
          )}

          {activeTab === 'customers' && <AdminCustomers />}

          {activeTab === 'coupons' && <AdminCoupons />}

          {activeTab === 'cms' && <AdminCMS />}

          {activeTab === 'settings' && <AdminSettings />}
        </main>
      </div>

      {/* Modals */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        productToEdit={editingProduct}
      />

      <OrderInvoiceModal
        order={selectedInvoiceOrder}
        onClose={() => setSelectedInvoiceOrder(null)}
      />
    </div>
  );
}
