'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Tag,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Truck,
  Plus,
  Save,
  Trash2,
  Copy,
  Check,
  Sparkles,
  Lock,
  FileText,
  Clock,
  ShoppingBag,
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function AccountPage() {
  const { user, isLoggedIn, logout, updateUser } = useAuth();
  const { orders, coupons } = useData();
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<
    'orders' | 'wishlist' | 'addresses' | 'cards' | 'coupons' | 'security' | 'profile'
  >('orders');

  // Customer Profile Form
  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'Ayşe Yılmaz',
    email: user?.email || 'ayse.yilmaz@example.com',
    phone: user?.phone || '+90 532 123 45 67',
  });

  // Saved Addresses State
  const [addresses, setAddresses] = useState([
    {
      id: 'addr-1',
      title: 'Ev Adresi (Varsayılan)',
      name: 'Ayşe Yılmaz',
      phone: '+90 532 123 45 67',
      city: 'İstanbul',
      district: 'Kadıköy',
      fullAddress: 'Bağdat Caddesi No:142 D:8, Caddebostan',
      isDefault: true,
    },
    {
      id: 'addr-2',
      title: 'İş Adresi',
      name: 'Ayşe Yılmaz',
      phone: '+90 532 123 45 67',
      city: 'İstanbul',
      district: 'Şişli',
      fullAddress: 'Abdi İpekçi Caddesi No:28 K:4 Nişantaşı',
      isDefault: false,
    },
  ]);

  const [newAddr, setNewAddr] = useState({ title: '', name: '', phone: '', city: '', district: '', fullAddress: '' });
  const [isAddingAddr, setIsAddingAddr] = useState(false);

  // Saved Payment Cards (İyzico Tokenized Cards representation)
  const [savedCards, setSavedCards] = useState([
    { id: 'card-1', bank: 'Garanti BBVA', cardType: 'Mastercard', last4: '8492', holder: 'AYSE YILMAZ', exp: '12/28', isDefault: true },
    { id: 'card-2', bank: 'İş Bankası', cardType: 'Visa', last4: '1948', holder: 'AYSE YILMAZ', exp: '09/27', isDefault: false },
  ]);

  // Copy Code State
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Password Security Form
  const [secForm, setSecForm] = useState({ currentPass: '', newPass: '', confirmPass: '' });

  if (!isLoggedIn) {
    return (
      <div className="py-20 bg-[#F8F5EF] min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#1C1B1A] border border-[#B49A6A] p-8 text-center text-[#F8F5EF] space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-[#B49A6A]/20 text-[#B49A6A] mx-auto flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-normal text-[#F8F5EF]">Hesabınıza Giriş Yapın</h2>
            <p className="text-xs text-[#8C857B] mt-1">
              Siparişlerinizi takip etmek, favorilerinizi görüntülemek ve VIP ayrıcalıklardan yararlanmak için giriş yapınız.
            </p>
          </div>
          <Link
            href="/giris"
            className="w-full py-3.5 bg-[#B49A6A] text-[#F8F5EF] text-xs font-semibold uppercase tracking-wider hover:bg-[#988052] transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            <span>Üye Girişi / Yeni Üyelik</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(profileForm);
    showToast('Profil bilgileriniz başarıyla güncellendi.', 'success');
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.title || !newAddr.fullAddress) return;
    setAddresses([...addresses, { ...newAddr, id: `addr-${Date.now()}`, isDefault: false }]);
    setNewAddr({ title: '', name: '', phone: '', city: '', district: '', fullAddress: '' });
    setIsAddingAddr(false);
    showToast('Yeni teslimat adresi kaydedildi.', 'success');
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
    showToast('Adres silindi.', 'info');
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`"${code}" indirim kodu kopyalandı! Sepette kullanabilirsiniz.`, 'success');
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (secForm.newPass !== secForm.confirmPass) {
      showToast('Yeni şifreler uyuşmuyor.', 'error');
      return;
    }
    setSecForm({ currentPass: '', newPass: '', confirmPass: '' });
    showToast('Şifreniz güvenlik önlemiyle güncellendi.', 'success');
  };

  return (
    <div className="py-12 bg-[#F8F5EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top VIP Customer Header Card */}
        <div className="bg-[#1C1B1A] border border-[#B49A6A] p-6 sm:p-8 text-[#F8F5EF] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#B49A6A] bg-[#242321] shrink-0">
              {user?.avatar ? (
                <Image src={user.avatar} alt={user.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl font-serif font-bold text-[#B49A6A]">
                  {user?.name?.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#F8F5EF]">{user?.name}</h1>
                <span className="px-2.5 py-0.5 bg-[#B49A6A]/20 border border-[#B49A6A]/50 text-[#B49A6A] text-[10px] font-semibold uppercase tracking-wider rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{user?.tier || 'Vera VIP Diamond'}</span>
                </span>
              </div>
              <p className="text-xs text-[#8C857B] mt-0.5">{user?.email} • {user?.phone}</p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4 border-t md:border-t-0 md:border-l border-[#3A3835] pt-4 md:pt-0 md:pl-8 text-center w-full md:w-auto">
            <div>
              <span className="block font-serif text-2xl text-[#B49A6A] font-semibold">{user?.orderCount || orders.length}</span>
              <span className="text-[10px] uppercase text-[#8C857B] font-medium">Sipariş</span>
            </div>
            <div>
              <span className="block font-serif text-2xl text-[#F8F5EF] font-semibold">₺{(user?.totalSpent || 14850).toLocaleString('tr-TR')}</span>
              <span className="text-[10px] uppercase text-[#8C857B] font-medium">Toplam Harcama</span>
            </div>
            <div>
              <span className="block font-serif text-2xl text-emerald-400 font-semibold">{coupons.length}</span>
              <span className="text-[10px] uppercase text-[#8C857B] font-medium">Kupon</span>
            </div>
          </div>
        </div>

        {/* Main Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Navigation Sidebar */}
          <aside className="lg:col-span-3 bg-[#FFFFFF] p-6 border border-[#E6DFD5] space-y-1.5 shadow-sm">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between p-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === 'orders' ? 'bg-[#242321] text-[#F8F5EF]' : 'text-[#5A5652] hover:bg-[#F8F5EF]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4 text-[#B49A6A]" />
                <span>Siparişlerim ({orders.length})</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`w-full flex items-center justify-between p-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === 'wishlist' ? 'bg-[#242321] text-[#F8F5EF]' : 'text-[#5A5652] hover:bg-[#F8F5EF]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4 text-[#B49A6A]" />
                <span>Favorilerim ({wishlist.length})</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center justify-between p-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === 'addresses' ? 'bg-[#242321] text-[#F8F5EF]' : 'text-[#5A5652] hover:bg-[#F8F5EF]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#B49A6A]" />
                <span>Adres Defterim ({addresses.length})</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('cards')}
              className={`w-full flex items-center justify-between p-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === 'cards' ? 'bg-[#242321] text-[#F8F5EF]' : 'text-[#5A5652] hover:bg-[#F8F5EF]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-[#B49A6A]" />
                <span>Kayıtlı Kartlarım ({savedCards.length})</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className={`w-full flex items-center justify-between p-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === 'coupons' ? 'bg-[#242321] text-[#F8F5EF]' : 'text-[#5A5652] hover:bg-[#F8F5EF]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Tag className="w-4 h-4 text-[#B49A6A]" />
                <span>İndirim Kuponlarım ({coupons.length})</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center justify-between p-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === 'profile' ? 'bg-[#242321] text-[#F8F5EF]' : 'text-[#5A5652] hover:bg-[#F8F5EF]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-[#B49A6A]" />
                <span>Profil Bilgilerim</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center justify-between p-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === 'security' ? 'bg-[#242321] text-[#F8F5EF]' : 'text-[#5A5652] hover:bg-[#F8F5EF]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-[#B49A6A]" />
                <span>Şifre ve Güvenlik</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="pt-4 border-t border-[#E6DFD5] space-y-1">
              <Link
                href="/admin"
                className="w-full flex items-center gap-2 p-3 text-xs font-bold uppercase tracking-wider text-[#B49A6A] hover:bg-[#F8F5EF]"
              >
                <span>Admin Paneline Git →</span>
              </Link>

              <button
                onClick={() => {
                  logout();
                  showToast('Oturum kapatıldı.', 'info');
                }}
                className="w-full flex items-center gap-2 p-3 text-xs font-bold uppercase tracking-wider text-rose-700 hover:bg-rose-50"
              >
                <LogOut className="w-4 h-4" />
                <span>Güvenli Çıkış Yap</span>
              </button>
            </div>
          </aside>

          {/* Details Main Area */}
          <main className="lg:col-span-9 bg-[#FFFFFF] p-6 sm:p-8 border border-[#E6DFD5] shadow-sm">
            
            {/* TAB 1: SİPARİŞLERİM */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-[#E6DFD5]">
                  <h2 className="font-serif text-2xl font-normal text-[#242321]">Sipariş Geçmişi &amp; Takip</h2>
                  <span className="text-xs text-[#8C857B]">Toplam {orders.length} Sipariş</span>
                </div>

                <div className="space-y-6">
                  {orders.map((ord) => (
                    <div key={ord.id} className="border border-[#E6DFD5] p-5 space-y-4 hover:border-[#B49A6A] transition-colors">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-3 border-b border-[#F8F5EF] text-xs">
                        <div>
                          <span className="font-serif text-base font-medium text-[#242321]">{ord.orderNumber}</span>
                          <span className="text-[#8C857B] ml-2">Tarih: {ord.createdAt}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-full ${
                            ord.status === 'Teslim Edildi' ? 'bg-emerald-100 text-emerald-800' :
                            ord.status === 'Kargoda' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {ord.status}
                          </span>
                          <span className="font-serif text-base font-normal text-[#242321]">₺{ord.total.toLocaleString('tr-TR')}</span>
                        </div>
                      </div>

                      {/* Purchased Items List */}
                      <div className="space-y-3">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 text-xs">
                            <div className="relative w-14 h-16 bg-[#E8DED1] shrink-0 border border-[#E6DFD5]">
                              {item.image ? (
                                <Image src={item.image} alt={item.productName} fill className="object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px]">VERA</div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-[#242321]">{item.productName}</h4>
                              <p className="text-[11px] text-[#8C857B]">
                                Renk: {item.color} | Adet: {item.quantity}
                              </p>
                            </div>
                            <div className="font-semibold text-[#242321]">
                              ₺{(item.price * item.quantity).toLocaleString('tr-TR')}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Action Bar */}
                      <div className="pt-3 border-t border-[#F8F5EF] flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                        <span className="text-[11px] text-[#8C857B]">
                          Kargo: <strong>{ord.carrier || 'Yurtiçi Kargo'}</strong> {ord.trackingCode && `(${ord.trackingCode})`}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => showToast('E-Fatura PDF simülasyonu indirildi.', 'info')}
                            className="px-3 py-1.5 bg-[#F8F5EF] text-[#242321] text-xs font-medium border border-[#E6DFD5] flex items-center gap-1 hover:border-[#B49A6A]"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>E-Fatura İndir</span>
                          </button>
                          <Link
                            href={`/kargo-takip?kod=${ord.orderNumber}`}
                            className="px-4 py-2 bg-[#242321] text-[#F8F5EF] text-xs uppercase font-semibold hover:bg-[#B49A6A] transition-colors flex items-center gap-1.5"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Kargo Takibi Yap</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: FAVORİLERİM */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-[#E6DFD5]">
                  <h2 className="font-serif text-2xl font-normal text-[#242321]">Favori Ürünleriniz</h2>
                  <span className="text-xs text-[#8C857B]">{wishlist.length} Ürün Saklandı</span>
                </div>

                {wishlist.length === 0 ? (
                  <p className="text-xs text-[#8C857B]">Henüz favorilerinize ürün eklemediniz.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlist.map((prod) => (
                      <div key={prod.id} className="p-4 border border-[#E6DFD5] flex gap-4 text-xs items-center">
                        <div className="relative w-16 h-20 bg-[#E8DED1] shrink-0 border border-[#E6DFD5]">
                          {prod.images?.[0] && (
                            <Image src={prod.images[0]} alt={prod.name} fill className="object-cover" />
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <h4 className="font-semibold text-[#242321] leading-snug">{prod.name}</h4>
                          <p className="text-[#B49A6A] font-serif font-semibold">₺{prod.price.toLocaleString('tr-TR')}</p>
                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => {
                                addToCart(prod, prod.colors?.[0] || { name: 'Standart', hex: '#242321' }, '90x90 cm', 1);
                                showToast(`${prod.name} sepetinize eklendi!`, 'success');
                              }}
                              className="px-3 py-1 bg-[#242321] text-[#F8F5EF] text-[10px] uppercase font-semibold flex items-center gap-1 hover:bg-[#B49A6A]"
                            >
                              <ShoppingBag className="w-3 h-3" />
                              <span>Sepete Ekle</span>
                            </button>
                            <button
                              onClick={() => toggleWishlist(prod)}
                              className="p-1 text-rose-600 hover:text-rose-800"
                              title="Favorilerden Çıkar"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: ADRESLERİM */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-[#E6DFD5]">
                  <h2 className="font-serif text-2xl font-normal text-[#242321]">Kayıtlı Adres Defteri</h2>
                  <button
                    onClick={() => setIsAddingAddr(!isAddingAddr)}
                    className="px-3 py-1.5 bg-[#B49A6A] text-[#F8F5EF] text-xs uppercase font-semibold flex items-center gap-1 hover:bg-[#988052]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Yeni Adres Ekle</span>
                  </button>
                </div>

                {isAddingAddr && (
                  <form onSubmit={handleAddAddress} className="p-4 bg-[#F8F5EF] border border-[#E6DFD5] space-y-3 text-xs">
                    <h3 className="font-semibold text-[#242321]">Yeni Teslimat Adresi Formu</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="Adres Başlığı (ör: Ev, İş)"
                        value={newAddr.title}
                        onChange={(e) => setNewAddr({ ...newAddr, title: e.target.value })}
                        className="p-2 bg-[#FFFFFF] border border-[#E6DFD5]"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Teslim Alacak Ad Soyad"
                        value={newAddr.name}
                        onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                        className="p-2 bg-[#FFFFFF] border border-[#E6DFD5]"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="İl"
                        value={newAddr.city}
                        onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                        className="p-2 bg-[#FFFFFF] border border-[#E6DFD5]"
                      />
                      <input
                        type="text"
                        required
                        placeholder="İlçe"
                        value={newAddr.district}
                        onChange={(e) => setNewAddr({ ...newAddr, district: e.target.value })}
                        className="p-2 bg-[#FFFFFF] border border-[#E6DFD5]"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Telefon"
                        value={newAddr.phone}
                        onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                        className="p-2 bg-[#FFFFFF] border border-[#E6DFD5]"
                      />
                    </div>
                    <textarea
                      rows={2}
                      required
                      placeholder="Açık Adres (Cadde, Mahalle, Bina No, Daire)"
                      value={newAddr.fullAddress}
                      onChange={(e) => setNewAddr({ ...newAddr, fullAddress: e.target.value })}
                      className="w-full p-2 bg-[#FFFFFF] border border-[#E6DFD5]"
                    />
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingAddr(false)}
                        className="px-3 py-1.5 bg-[#E6DFD5] text-[#242321]"
                      >
                        İptal
                      </button>
                      <button type="submit" className="px-4 py-1.5 bg-[#242321] text-[#F8F5EF] font-semibold uppercase">
                        Kaydet
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="p-4 border border-[#E6DFD5] space-y-2 text-xs relative bg-[#F8F5EF]/30">
                      <div className="flex justify-between items-center border-b border-[#E6DFD5] pb-2">
                        <div className="flex items-center gap-2">
                          <strong className="text-[#242321] font-semibold text-sm">{addr.title}</strong>
                          {addr.isDefault && (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] uppercase font-bold rounded-full">
                              Varsayılan
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-rose-600 hover:text-rose-800 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="font-semibold text-[#242321]">{addr.name}</p>
                      <p className="text-[#5A5652]">{addr.fullAddress}</p>
                      <p className="text-[#5A5652]">{addr.district} / {addr.city}</p>
                      <p className="text-[#8C857B] font-mono text-[11px]">Tel: {addr.phone}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: KAYITLI KARTLARIM */}
            {activeTab === 'cards' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-[#E6DFD5]">
                  <div>
                    <h2 className="font-serif text-2xl font-normal text-[#242321]">Kayıtlı Ödeme Kartları</h2>
                    <p className="text-xs text-[#8C857B]">İyzico 256-bit SSL Korumalı Tokenized Kart Kütüphanesi</p>
                  </div>
                  <button
                    onClick={() => showToast('İyzico 3D Secure Kart kaydetme ekranı başlatıldı.', 'info')}
                    className="px-3 py-1.5 bg-[#B49A6A] text-[#F8F5EF] text-xs uppercase font-semibold flex items-center gap-1 hover:bg-[#988052]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Yeni Kart Ekle</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedCards.map((c) => (
                    <div key={c.id} className="p-5 bg-[#1C1B1A] text-[#F8F5EF] border border-[#B49A6A] space-y-4 shadow-md">
                      <div className="flex justify-between items-center border-b border-[#3A3835] pb-2">
                        <span className="font-mono text-xs text-[#B49A6A] font-bold uppercase">{c.bank}</span>
                        <span className="text-xs font-bold text-white uppercase">{c.cardType}</span>
                      </div>
                      <div className="font-mono text-base tracking-widest text-white">
                        •••• •••• •••• {c.last4}
                      </div>
                      <div className="flex justify-between items-end text-[11px] text-[#8C857B]">
                        <div>
                          <span>KART SAHİBİ</span>
                          <strong className="block text-white font-medium">{c.holder}</strong>
                        </div>
                        <div>
                          <span>SON KULLANMA</span>
                          <strong className="block text-white font-medium">{c.exp}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: İNDİRİM KUPONLARIM */}
            {activeTab === 'coupons' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-[#E6DFD5]">
                  <h2 className="font-serif text-2xl font-normal text-[#242321]">Hesabınıza Tanımlı Kuponlar &amp; Çekler</h2>
                  <p className="text-xs text-[#8C857B]">Sepette hemen kullanabileceğiniz promosyon kodlarınız.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {coupons.map((cp) => (
                    <div key={cp.id} className="p-4 bg-[#F8F5EF] border border-[#E6DFD5] space-y-3 relative">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="px-2 py-0.5 bg-[#B49A6A] text-[#F8F5EF] text-[10px] uppercase font-bold tracking-wider">
                            {cp.discountText}
                          </span>
                          <h4 className="font-serif text-lg text-[#242321] font-semibold mt-1">{cp.code}</h4>
                        </div>
                        <button
                          onClick={() => handleCopyCoupon(cp.code)}
                          className="px-3 py-1 bg-[#242321] text-[#F8F5EF] text-xs font-semibold uppercase flex items-center gap-1 hover:bg-[#B49A6A]"
                        >
                          {copiedCode === cp.code ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedCode === cp.code ? 'Kopyalandı' : 'Kodu Kopyala'}</span>
                        </button>
                      </div>
                      <p className="text-xs text-[#5A5652]">
                        ₺{cp.minSpend.toLocaleString('tr-TR')} ve üzeri alışverişlerde geçerlidir.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: PROFİL BİLGİLERİM */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-[#E6DFD5]">
                  <h2 className="font-serif text-2xl font-normal text-[#242321]">Profil Bilgileriniz</h2>
                  <p className="text-xs text-[#8C857B]">Üyelik ve kişisel bilgilerinizi güncelleyin.</p>
                </div>

                <form onSubmit={handleProfileSave} className="space-y-4 max-w-lg text-xs">
                  <div>
                    <label className="block text-[#8C857B] mb-1">Ad Soyad *</label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full p-2.5 bg-[#FFFFFF] border border-[#E6DFD5] text-[#242321] font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8C857B] mb-1">E-Posta Adresi *</label>
                    <input
                      type="email"
                      required
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full p-2.5 bg-[#FFFFFF] border border-[#E6DFD5] text-[#242321]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8C857B] mb-1">Telefon Numarası *</label>
                    <input
                      type="text"
                      required
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full p-2.5 bg-[#FFFFFF] border border-[#E6DFD5] text-[#242321]"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#242321] text-[#F8F5EF] text-xs font-semibold uppercase tracking-wider hover:bg-[#B49A6A] transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Bilgileri Güncelle</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 7: ŞİFRE VE GÜVENLİK */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-[#E6DFD5]">
                  <h2 className="font-serif text-2xl font-normal text-[#242321]">Şifre ve Hesap Güvenliği</h2>
                  <p className="text-xs text-[#8C857B]">Hesabınızın güvenliği için güçlü bir şifre belirleyin.</p>
                </div>

                <form onSubmit={handlePasswordSave} className="space-y-4 max-w-lg text-xs">
                  <div>
                    <label className="block text-[#8C857B] mb-1">Mevcut Şifre *</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={secForm.currentPass}
                      onChange={(e) => setSecForm({ ...secForm, currentPass: e.target.value })}
                      className="w-full p-2.5 bg-[#FFFFFF] border border-[#E6DFD5] text-[#242321]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8C857B] mb-1">Yeni Şifre *</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={secForm.newPass}
                      onChange={(e) => setSecForm({ ...secForm, newPass: e.target.value })}
                      className="w-full p-2.5 bg-[#FFFFFF] border border-[#E6DFD5] text-[#242321]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8C857B] mb-1">Yeni Şifre Tekrarı *</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={secForm.confirmPass}
                      onChange={(e) => setSecForm({ ...secForm, confirmPass: e.target.value })}
                      className="w-full p-2.5 bg-[#FFFFFF] border border-[#E6DFD5] text-[#242321]"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#242321] text-[#F8F5EF] text-xs font-semibold uppercase tracking-wider hover:bg-[#B49A6A] transition-colors flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Şifreyi Güncelle</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
