'use client';

import React, { useState } from 'react';
import { ShieldX, LogIn, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import AdminSidebar, { AdminTab } from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminOverview from '@/components/admin/AdminOverview';
import AdminProducts from '@/components/admin/AdminProducts';
import AdminOrders from '@/components/admin/AdminOrders';
import AdminCari from '@/components/admin/AdminCari';
import AdminCargoSettings from '@/components/admin/AdminCargoSettings';
import AdminGrowthEngine from '@/components/admin/AdminGrowthEngine';
import AdminCustomers from '@/components/admin/AdminCustomers';
import AdminEmails from '@/components/admin/AdminEmails';
import AdminCoupons from '@/components/admin/AdminCoupons';
import AdminCMS from '@/components/admin/AdminCMS';
import AdminSiteSettings from '@/components/admin/AdminSiteSettings';
import ProductModal from '@/components/admin/ProductModal';
import OrderInvoiceModal from '@/components/admin/OrderInvoiceModal';
import { Product, CustomerOrder } from '@/lib/types/ecommerce';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';

export default function ExecutiveAdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const { products, orders, addProduct, updateProduct, deleteProduct, updateOrderStatus } = useData();
  const { showToast } = useToast();
  const { isAdmin, isLoggedIn, user } = useAuth();

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<CustomerOrder | null>(null);

  // ─── ADMIN YETKİ KONTROL EKRANI ───────────────────────────────────────────
  if (!isLoggedIn || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#171615] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8">

          {/* Kilit İkonu */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-[#1C1B1A] border border-[#B49A6A]/30 flex items-center justify-center shadow-2xl">
              <ShieldX className="w-12 h-12 text-[#B49A6A]" />
            </div>
          </div>

          {/* Marka */}
          <div>
            <span className="font-serif text-3xl tracking-[0.25em] text-[#F8F5EF] font-semibold uppercase">VERA</span>
            <span className="block text-[10px] tracking-[0.4em] text-[#B49A6A] font-sans uppercase font-medium -mt-1">
              E Ş A R P
            </span>
          </div>

          {/* Mesaj Kutusu */}
          <div className="bg-[#1C1B1A] border border-[#2A2825] p-8 space-y-3 shadow-xl">
            <h1 className="font-serif text-2xl text-[#F8F5EF] font-normal">Erişim Kısıtlı</h1>
            <p className="text-sm text-[#8C857B] leading-relaxed">
              {isLoggedIn && !isAdmin
                ? `Merhaba ${user?.name?.split(' ')[0] || 'Değerli Üyemiz'}. Yönetim paneli yalnızca yetkili yöneticilere açıktır. Hesabınız yönetici yetkisine sahip değildir.`
                : 'Bu sayfaya erişmek için yönetici hesabınızla giriş yapmanız gerekmektedir.'}
            </p>
          </div>

          {/* Eylem Butonları */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {!isLoggedIn && (
              <Link
                href="/giris?redirect=/admin"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#B49A6A] text-[#F8F5EF] text-xs font-semibold uppercase tracking-wider hover:bg-[#988052] transition-colors shadow-lg"
              >
                <LogIn className="w-4 h-4" />
                Yönetici Girişi Yap
              </Link>
            )}
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1C1B1A] border border-[#3A3835] text-[#F8F5EF] text-xs font-semibold uppercase tracking-wider hover:border-[#B49A6A] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Ana Sayfaya Dön
            </Link>
          </div>

          <p className="text-[10px] text-[#5A5652]">
            Yönetici erişimi için lütfen mağaza yöneticisiyle iletişime geçin.
          </p>
        </div>
      </div>
    );
  }
  // ─── YETKİ KONTROL SONU ───────────────────────────────────────────────────

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
          {activeTab === 'cargo' && <AdminCargoSettings />}
          {activeTab === 'growth' && <AdminGrowthEngine />}
          {activeTab === 'customers' && <AdminCustomers />}
          {activeTab === 'emails' && <AdminEmails />}
          {activeTab === 'coupons' && <AdminCoupons />}
          {activeTab === 'cms' && <AdminCMS />}
          {activeTab === 'settings' && <AdminSiteSettings />}
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
