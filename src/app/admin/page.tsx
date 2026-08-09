'use client';

import React, { useState } from 'react';
import AdminSidebar, { AdminTab } from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminOverview from '@/components/admin/AdminOverview';
import AdminProducts from '@/components/admin/AdminProducts';
import AdminOrders from '@/components/admin/AdminOrders';
import AdminCari from '@/components/admin/AdminCari';
import AdminGrowthEngine from '@/components/admin/AdminGrowthEngine';
import AdminCustomers from '@/components/admin/AdminCustomers';
import AdminEmails from '@/components/admin/AdminEmails';
import AdminCoupons from '@/components/admin/AdminCoupons';
import AdminCMS from '@/components/admin/AdminCMS';
import AdminSettings from '@/components/admin/AdminSettings';
import ProductModal from '@/components/admin/ProductModal';
import OrderInvoiceModal from '@/components/admin/OrderInvoiceModal';
import { Product, CustomerOrder } from '@/lib/types/ecommerce';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';

export default function ExecutiveAdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const { products, orders, addProduct, updateProduct, deleteProduct, updateOrderStatus } = useData();
  const { showToast } = useToast();

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<CustomerOrder | null>(null);

  // Handlers
  const handleOpenProductModal = (productToEdit?: Product) => {
    setEditingProduct(productToEdit || null);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (productData: Partial<Product>) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      showToast(`${productData.name || editingProduct.name} ürünü güncellendi!`, 'success');
    } else {
      const created = addProduct(productData);
      showToast(`${created.name} mağaza kataloğuna eklendi!`, 'success');
    }
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
    deleteProduct(id);
    showToast('Ürün katalogdan kaldırıldı.', 'info');
  };

  const handleUpdateOrderStatus = (orderId: string, status: CustomerOrder['status']) => {
    updateOrderStatus(orderId, status);
    showToast(`Sipariş durumu "${status}" olarak güncellendi.`, 'success');
  };

  const pendingOrdersCount = orders.filter((o) => o.status === 'Hazırlanıyor').length;
  const lowStockCount = products.filter((p) => p.stock <= 15).length;

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
              products={products}
              orders={orders}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'products' && (
            <AdminProducts
              products={products}
              onDeleteProduct={handleDeleteProduct}
              onOpenProductModal={handleOpenProductModal}
            />
          )}

          {activeTab === 'orders' && (
            <AdminOrders
              orders={orders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onOpenInvoiceModal={(order) => setSelectedInvoiceOrder(order)}
            />
          )}

          {activeTab === 'cari' && <AdminCari />}

          {activeTab === 'growth' && <AdminGrowthEngine />}

          {activeTab === 'customers' && <AdminCustomers />}

          {activeTab === 'emails' && <AdminEmails />}

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
