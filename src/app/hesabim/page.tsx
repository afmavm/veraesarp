'use client';

import React, { useState, useEffect } from 'react';
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
  ShoppingBag,
  Edit2,
  X,
  Star,
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export interface SavedAddress {
  id: string;
  title: string;
  name: string;
  phone: string;
  city: string;
  district: string;
  fullAddress: string;
  isDefault: boolean;
}

export interface SavedCard {
  id: string;
  bank: string;
  cardType: string;
  last4: string;
  holder: string;
  exp: string;
  isDefault: boolean;
}

export default function AccountPage() {
  const { user, isLoggedIn, isAdmin, logout, updateUser } = useAuth();
  const { orders, coupons } = useData();
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<
    'orders' | 'wishlist' | 'addresses' | 'cards' | 'coupons' | 'security' | 'profile'
  >('orders');

  // Customer Profile Form
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  // Isolate orders specifically for current logged-in user
  const userOrders = orders.filter((o) => {
    if (!user) return false;
    const matchEmail = o.email && o.email.toLowerCase() === user.email.toLowerCase();
    const matchPhone =
      o.phone && user.phone && o.phone.replace(/[^0-9]/g, '') === user.phone.replace(/[^0-9]/g, '');
    const isDemoUser = user.email === 'ayse.yilmaz@example.com' || user.id === 'usr-1';
    return matchEmail || matchPhone || (isDemoUser && o.customerName === 'Ayşe Yılmaz');
  });

  const userTotalSpent = userOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  // Isolate coupons specifically for current logged-in user
  const userCoupons = coupons.filter((cp) => {
    if (user?.email === 'ayse.yilmaz@example.com' || user?.id === 'usr-1') {
      return true;
    }
    return cp.code === 'VERAWELCOME10' || cp.code === 'HOŞGELDİN';
  });

  // Saved Addresses State (Isolated & Persisted per user)
  const [addresses, setAddresses] = useState<SavedAddress[]>(() => {
    if (typeof window !== 'undefined' && user) {
      const stored = localStorage.getItem(`veraesarp_user_addrs_${user.id}`);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {}
      }
    }
    if (user?.email === 'ayse.yilmaz@example.com' || user?.id === 'usr-1') {
      return [
        {
          id: 'addr-1',
          title: 'Ev Adresi (Varsayılan)',
          name: 'Ayşe Yılmaz',
          phone: '+90 532 123 45 67',
          city: 'Erzurum',
          district: 'Yakutiye',
          fullAddress: 'Lalapaşa Mah. Pelit Meydanı Cad. No:14',
          isDefault: true,
        },
        {
          id: 'addr-2',
          title: 'İş Adresi',
          name: 'Ayşe Yılmaz',
          phone: '+90 532 123 45 67',
          city: 'Erzurum',
          district: 'Yakutiye',
          fullAddress: 'Pelit Meydanı Caddesi No:14 Yakutiye',
          isDefault: false,
        },
      ];
    }
    return [];
  });

  const saveAddresses = (list: SavedAddress[]) => {
    setAddresses(list);
    if (user) {
      localStorage.setItem(`veraesarp_user_addrs_${user.id}`, JSON.stringify(list));
    }
  };

  const [newAddr, setNewAddr] = useState({ title: '', name: '', phone: '', city: '', district: '', fullAddress: '' });
  const [isAddingAddr, setIsAddingAddr] = useState(false);

  // Saved Payment Cards CRUD State (Isolated & Persisted per user)
  const [savedCards, setSavedCards] = useState<SavedCard[]>(() => {
    if (typeof window !== 'undefined' && user) {
      const stored = localStorage.getItem(`veraesarp_user_cards_${user.id}`);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {}
      }
    }
    if (user?.email === 'ayse.yilmaz@example.com' || user?.id === 'usr-1') {
      return [
        { id: 'card-1', bank: 'Garanti BBVA', cardType: 'Mastercard', last4: '8492', holder: 'AYSE YILMAZ', exp: '12/28', isDefault: true },
        { id: 'card-2', bank: 'İş Bankası', cardType: 'Visa', last4: '1948', holder: 'AYSE YILMAZ', exp: '09/27', isDefault: false },
      ];
    }
    return [];
  });

  const saveCards = (list: SavedCard[]) => {
    setSavedCards(list);
    if (user) {
      localStorage.setItem(`veraesarp_user_cards_${user.id}`, JSON.stringify(list));
    }
  };

  // Card Modal State for Add & Edit
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [cardForm, setCardForm] = useState({
    bank: 'Garanti BBVA',
    cardType: 'Mastercard',
    cardNumber: '',
    holder: user?.name || '',
    expMonth: '12',
    expYear: '28',
    isDefault: false,
  });

  // Open Modal for New Card
  const openNewCardModal = () => {
    setEditingCardId(null);
    setCardForm({
      bank: 'Garanti BBVA',
      cardType: 'Mastercard',
      cardNumber: '',
      holder: (user?.name || '').toUpperCase(),
      expMonth: '12',
      expYear: '28',
      isDefault: savedCards.length === 0,
    });
    setIsCardModalOpen(true);
  };

  // Open Modal for Editing Existing Card
  const openEditCardModal = (c: SavedCard) => {
    setEditingCardId(c.id);
    const [m, y] = c.exp.split('/');
    setCardForm({
      bank: c.bank,
      cardType: c.cardType,
      cardNumber: `•••• •••• •••• ${c.last4}`,
      holder: c.holder,
      expMonth: m || '12',
      expYear: y || '28',
      isDefault: c.isDefault,
    });
    setIsCardModalOpen(true);
  };

  // Save or Update Card
  const handleSaveCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardForm.holder.trim()) {
      showToast('Lütfen kart sahibinin adını giriniz.', 'error');
      return;
    }

    const cleanCardNum = cardForm.cardNumber.replace(/\s/g, '');
    const last4 = cleanCardNum.length >= 4 ? cleanCardNum.slice(-4) : '8888';
    const expDate = `${cardForm.expMonth}/${cardForm.expYear}`;

    let updatedList: SavedCard[] = [];

    if (editingCardId) {
      // Edit mode
      updatedList = savedCards.map((c) => {
        if (c.id === editingCardId) {
          return {
            ...c,
            bank: cardForm.bank,
            cardType: cardForm.cardType,
            last4: cleanCardNum.includes('•') ? c.last4 : last4,
            holder: cardForm.holder.toUpperCase(),
            exp: expDate,
            isDefault: cardForm.isDefault,
          };
        }
        return cardForm.isDefault ? { ...c, isDefault: false } : c;
      });
      showToast('Kayıtlı ödeme kartı güncellendi.', 'success');
    } else {
      // Create new card
      const newCardObj: SavedCard = {
        id: `card-${Date.now()}`,
        bank: cardForm.bank,
        cardType: cardForm.cardType,
        last4: last4,
        holder: cardForm.holder.toUpperCase(),
        exp: expDate,
        isDefault: cardForm.isDefault || savedCards.length === 0,
      };

      updatedList = cardForm.isDefault || savedCards.length === 0
        ? [newCardObj, ...savedCards.map((c) => ({ ...c, isDefault: false }))]
        : [...savedCards, newCardObj];

      showToast('Yeni ödeme kartı başarıyla eklendi.', 'success');
    }

    saveCards(updatedList);
    setIsCardModalOpen(false);
  };

  // Delete Card
  const handleDeleteCard = (id: string) => {
    const updatedList = savedCards.filter((c) => c.id !== id);
    saveCards(updatedList);
    showToast('Ödeme kartı başarıyla silindi.', 'info');
  };

  // Set Default Card
  const handleSetDefaultCard = (id: string) => {
    const updatedList = savedCards.map((c) => ({
      ...c,
      isDefault: c.id === id,
    }));
    saveCards(updatedList);
    showToast('Varsayılan ödeme kartı değiştirildi.', 'success');
  };

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
    const updated = [...addresses, { ...newAddr, id: `addr-${Date.now()}`, isDefault: addresses.length === 0 }];
    saveAddresses(updated);
    setNewAddr({ title: '', name: '', phone: '', city: '', district: '', fullAddress: '' });
    setIsAddingAddr(false);
    showToast('Yeni teslimat adresi kaydedildi.', 'success');
  };

  const handleDeleteAddress = (id: string) => {
    const updated = addresses.filter((a) => a.id !== id);
    saveAddresses(updated);
    showToast('Adres silindi.', 'info');
  };

  const handleCopyCoupon = (code: string) => {
    try {
      navigator.clipboard.writeText(code);
    } catch (e) {}
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
                <div className="w-full h-full flex items-center justify-center text-2xl font-serif font-bold text-[#B49A6A]">
                  {user?.name?.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#F8F5EF]">{user?.name}</h1>
                <span className="px-2.5 py-0.5 bg-[#B49A6A]/20 border border-[#B49A6A]/50 text-[#B49A6A] text-[10px] font-semibold uppercase tracking-wider rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{user?.tier || 'Vera Silver Üye'}</span>
                </span>
              </div>
              <p className="text-xs text-[#8C857B] mt-0.5">{user?.email} • {user?.phone}</p>
            </div>
          </div>

          {/* Quick Metrics (Isolated for current user) */}
          <div className="grid grid-cols-3 gap-4 border-t md:border-t-0 md:border-l border-[#3A3835] pt-4 md:pt-0 md:pl-8 text-center w-full md:w-auto">
            <div>
              <span className="block font-serif text-2xl text-[#B49A6A] font-semibold">{userOrders.length}</span>
              <span className="text-[10px] uppercase text-[#8C857B] font-medium">Sipariş</span>
            </div>
            <div>
              <span className="block font-serif text-2xl text-[#F8F5EF] font-semibold">₺{userTotalSpent.toLocaleString('tr-TR')}</span>
              <span className="text-[10px] uppercase text-[#8C857B] font-medium">Toplam Harcama</span>
            </div>
            <div>
              <span className="block font-serif text-2xl text-emerald-400 font-semibold">{userCoupons.length}</span>
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
                <span>Siparişlerim ({userOrders.length})</span>
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
                <span>İndirim Kuponlarım ({userCoupons.length})</span>
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
              {isAdmin && (
                <Link
                  href="/admin"
                  className="w-full flex items-center gap-2 p-3 text-xs font-bold uppercase tracking-wider text-[#B49A6A] hover:bg-[#F8F5EF]"
                >
                  <span>Admin Paneline Git →</span>
                </Link>
              )}

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
                  <span className="text-xs text-[#8C857B]">Toplam {userOrders.length} Sipariş</span>
                </div>

                {userOrders.length === 0 ? (
                  <div className="text-center py-12 px-4 border border-dashed border-[#E6DFD5] space-y-4 rounded-sm">
                    <div className="w-16 h-16 rounded-full bg-[#F8F5EF] text-[#B49A6A] mx-auto flex items-center justify-center border border-[#E6DFD5]">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-serif text-xl text-[#242321]">Henüz verilmiş bir siparişiniz bulunmamaktadır</h3>
                      <p className="text-xs text-[#8C857B] max-w-sm mx-auto">
                        Vera Eşarp lüks koleksiyonlarını keşfedip %10 Hoş Geldin indirimiyle ilk siparişinizi hemen oluşturabilirsiniz.
                      </p>
                    </div>
                    <Link
                      href="/kategori/yeni-gelenler"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#242321] text-[#F8F5EF] text-xs font-semibold uppercase tracking-wider hover:bg-[#B49A6A] transition-colors shadow-md"
                    >
                      <span>🛍️ Koleksiyonları Keşfet</span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {userOrders.map((ord) => (
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
                )}
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
                  <div className="text-center py-10 px-4 border border-dashed border-[#E6DFD5] space-y-3">
                    <Heart className="w-8 h-8 text-[#B49A6A] mx-auto" />
                    <p className="text-xs text-[#8C857B]">Henüz favorilerinize ürün eklemediniz.</p>
                    <Link
                      href="/kategori/esarp"
                      className="inline-block px-4 py-2 bg-[#242321] text-[#F8F5EF] text-xs uppercase font-semibold hover:bg-[#B49A6A]"
                    >
                      Ürünleri İncele
                    </Link>
                  </div>
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
                        value={newAddr.name || user?.name || ''}
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
                        value={newAddr.phone || user?.phone || ''}
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

                {addresses.length === 0 && !isAddingAddr ? (
                  <div className="text-center py-10 px-4 border border-dashed border-[#E6DFD5] space-y-3">
                    <MapPin className="w-8 h-8 text-[#B49A6A] mx-auto" />
                    <p className="text-xs text-[#8C857B]">Henüz kayıtlı bir teslimat adresiniz bulunmamaktadır.</p>
                    <button
                      onClick={() => setIsAddingAddr(true)}
                      className="px-4 py-2 bg-[#242321] text-[#F8F5EF] text-xs uppercase font-semibold hover:bg-[#B49A6A]"
                    >
                      + İlk Adresinizi Ekleyin
                    </button>
                  </div>
                ) : (
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
                )}
              </div>
            )}

            {/* TAB 4: KAYITLI KARTLARIM (Full CRUD: Add, Edit, Delete, Set Default) */}
            {activeTab === 'cards' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-[#E6DFD5]">
                  <div>
                    <h2 className="font-serif text-2xl font-normal text-[#242321]">Kayıtlı Ödeme Kartları</h2>
                    <p className="text-xs text-[#8C857B]">İyzico 256-bit SSL Korumalı Tokenized Kart Kütüphanesi</p>
                  </div>
                  <button
                    onClick={openNewCardModal}
                    className="px-3 py-1.5 bg-[#B49A6A] text-[#F8F5EF] text-xs uppercase font-semibold flex items-center gap-1 hover:bg-[#988052] shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Yeni Kart Ekle</span>
                  </button>
                </div>

                {savedCards.length === 0 ? (
                  <div className="text-center py-10 px-4 border border-dashed border-[#E6DFD5] space-y-3 rounded-sm">
                    <CreditCard className="w-8 h-8 text-[#B49A6A] mx-auto" />
                    <p className="text-xs text-[#8C857B]">Henüz kayıtlı bir ödeme kartınız bulunmamaktadır.</p>
                    <button
                      onClick={openNewCardModal}
                      className="px-4 py-2 bg-[#242321] text-[#F8F5EF] text-xs uppercase font-semibold hover:bg-[#B49A6A] shadow-md"
                    >
                      + İlk Kartınızı Ekleyin
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {savedCards.map((c) => (
                      <div key={c.id} className="p-5 bg-[#1C1B1A] text-[#F8F5EF] border border-[#B49A6A] space-y-4 shadow-xl rounded-sm relative group">
                        {/* Header Badge */}
                        <div className="flex justify-between items-center border-b border-[#3A3835] pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-[#B49A6A] font-bold uppercase">{c.bank}</span>
                            {c.isDefault && (
                              <span className="px-2 py-0.5 bg-[#B49A6A]/20 border border-[#B49A6A] text-[#B49A6A] text-[9px] uppercase font-bold rounded-full flex items-center gap-1">
                                <Star className="w-2.5 h-2.5 fill-current" />
                                <span>Varsayılan</span>
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-bold text-white uppercase tracking-wider">{c.cardType}</span>
                        </div>

                        {/* Card Number Mask */}
                        <div className="font-mono text-lg tracking-widest text-white py-1">
                          •••• •••• •••• {c.last4}
                        </div>

                        {/* Holder & Exp */}
                        <div className="flex justify-between items-end text-[11px] text-[#8C857B]">
                          <div>
                            <span className="block text-[9px] uppercase tracking-wider">KART SAHİBİ</span>
                            <strong className="block text-white font-medium text-xs">{c.holder}</strong>
                          </div>
                          <div className="text-right">
                            <span className="block text-[9px] uppercase tracking-wider">SON KULLANMA</span>
                            <strong className="block text-white font-medium text-xs">{c.exp}</strong>
                          </div>
                        </div>

                        {/* Action Buttons Bar (Edit, Delete, Set Default) */}
                        <div className="pt-3 border-t border-[#3A3835] flex items-center justify-between text-xs">
                          {!c.isDefault ? (
                            <button
                              onClick={() => handleSetDefaultCard(c.id)}
                              className="text-[11px] text-[#B49A6A] hover:underline flex items-center gap-1"
                            >
                              <Star className="w-3 h-3" />
                              <span>Varsayılan Yap</span>
                            </button>
                          ) : (
                            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              <span>Ana Ödeme Kartı</span>
                            </span>
                          )}

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => openEditCardModal(c)}
                              className="text-xs text-[#8C857B] hover:text-[#F8F5EF] flex items-center gap-1"
                              title="Kartı Düzenle"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Düzenle</span>
                            </button>
                            <button
                              onClick={() => handleDeleteCard(c.id)}
                              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                              title="Kartı Sil"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Sil</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: İNDİRİM KUPONLARIM */}
            {activeTab === 'coupons' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-[#E6DFD5]">
                  <h2 className="font-serif text-2xl font-normal text-[#242321]">Hesabınıza Tanımlı Kuponlar &amp; Çekler</h2>
                  <p className="text-xs text-[#8C857B]">Sepette hemen kullanabileceğiniz promosyon kodlarınız.</p>
                </div>

                {userCoupons.length === 0 ? (
                  <div className="text-center py-10 px-4 border border-dashed border-[#E6DFD5] space-y-3 rounded-sm">
                    <Tag className="w-8 h-8 text-[#B49A6A] mx-auto" />
                    <p className="text-xs text-[#8C857B]">Hesabınıza tanımlı aktif bir indirim kuponu bulunmamaktadır.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {userCoupons.map((cp) => (
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
                )}
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

      {/* Card Add & Edit Interactive Modal Dialog */}
      {isCardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1C1B1A] border border-[#B49A6A] p-6 sm:p-8 max-w-md w-full text-[#F8F5EF] space-y-4 shadow-2xl rounded-sm">
            <div className="flex items-center justify-between border-b border-[#3A3835] pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#B49A6A]" />
                <h3 className="font-serif text-lg font-normal text-[#F8F5EF]">
                  {editingCardId ? 'Kayıtlı Kartı Düzenle' : 'Yeni Ödeme Kartı Ekle'}
                </h3>
              </div>
              <button onClick={() => setIsCardModalOpen(false)} className="p-1 text-[#8C857B] hover:text-[#F8F5EF]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCardSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#8C857B] mb-1">Banka Adı *</label>
                <select
                  value={cardForm.bank}
                  onChange={(e) => setCardForm({ ...cardForm, bank: e.target.value })}
                  className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none"
                >
                  <option value="Garanti BBVA">Garanti BBVA</option>
                  <option value="İş Bankası">İş Bankası</option>
                  <option value="Akbank">Akbank</option>
                  <option value="Yapı Kredi">Yapı Kredi</option>
                  <option value="Ziraat Bankası">Ziraat Bankası</option>
                  <option value="QNB Finansbank">QNB Finansbank</option>
                  <option value="DenizBank">DenizBank</option>
                  <option value="Diğer Banka">Diğer Banka</option>
                </select>
              </div>

              <div>
                <label className="block text-[#8C857B] mb-1">Kart Sahibi Ad Soyad *</label>
                <input
                  type="text"
                  required
                  placeholder="ör: AYŞE YILMAZ"
                  value={cardForm.holder}
                  onChange={(e) => setCardForm({ ...cardForm, holder: e.target.value.toUpperCase() })}
                  className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[#8C857B] mb-1">Kart Numarası *</label>
                <input
                  type="text"
                  required
                  maxLength={19}
                  placeholder="•••• •••• •••• ••••"
                  value={cardForm.cardNumber}
                  onChange={(e) => setCardForm({ ...cardForm, cardNumber: e.target.value })}
                  className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8C857B] mb-1">Kart Tipi</label>
                  <select
                    value={cardForm.cardType}
                    onChange={(e) => setCardForm({ ...cardForm, cardType: e.target.value })}
                    className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none"
                  >
                    <option value="Mastercard">Mastercard</option>
                    <option value="Visa">Visa</option>
                    <option value="Troy">Troy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#8C857B] mb-1">Son Kullanma (Ay/Yıl)</label>
                  <div className="flex gap-1">
                    <select
                      value={cardForm.expMonth}
                      onChange={(e) => setCardForm({ ...cardForm, expMonth: e.target.value })}
                      className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
                    >
                      {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <select
                      value={cardForm.expYear}
                      onChange={(e) => setCardForm({ ...cardForm, expYear: e.target.value })}
                      className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
                    >
                      {['25', '26', '27', '28', '29', '30', '31', '32'].map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-[#8C857B] pt-1">
                <input
                  type="checkbox"
                  checked={cardForm.isDefault}
                  onChange={(e) => setCardForm({ ...cardForm, isDefault: e.target.checked })}
                  className="accent-[#B49A6A]"
                />
                <span>Bu kartı varsayılan ödeme kartım olarak belirle</span>
              </label>

              <div className="pt-4 border-t border-[#3A3835] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCardModalOpen(false)}
                  className="px-4 py-2 bg-[#3A3835] text-[#F8F5EF]"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#B49A6A] text-[#F8F5EF] font-semibold uppercase tracking-wider hover:bg-[#988052]"
                >
                  {editingCardId ? 'Güncelle' : 'Kartı Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
