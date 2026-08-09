'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, Package, Heart, MapPin, ChevronRight, Truck, Plus, Save, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';

export default function AccountPage() {
  const { orders } = useData();
  const { wishlist } = useWishlist();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders');

  // Customer Profile State
  const [profile, setProfile] = useState({
    name: 'Ayşe Yılmaz',
    email: 'ayse.yilmaz@example.com',
    phone: '+90 532 123 45 67',
    tier: 'Vera VIP Gold Müşteri',
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
    },
    {
      id: 'addr-2',
      title: 'İş Adresi',
      name: 'Ayşe Yılmaz',
      phone: '+90 532 123 45 67',
      city: 'İstanbul',
      district: 'Şişli',
      fullAddress: 'Abdi İpekçi Caddesi No:28 K:4 Nişantaşı',
    },
  ]);

  const [newAddr, setNewAddr] = useState({ title: '', name: '', phone: '', city: '', district: '', fullAddress: '' });
  const [isAddingAddr, setIsAddingAddr] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Profil bilgileriniz başarıyla güncellendi.', 'success');
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.title || !newAddr.fullAddress) return;
    setAddresses([...addresses, { ...newAddr, id: `addr-${Date.now()}` }]);
    setNewAddr({ title: '', name: '', phone: '', city: '', district: '', fullAddress: '' });
    setIsAddingAddr(false);
    showToast('Yeni teslimat adresi kaydedildi.', 'success');
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
    showToast('Adres silindi.', 'info');
  };

  return (
    <div className="py-12 bg-[#F8F5EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#242321] mb-8 pb-4 border-b border-[#E6DFD5]">
          Hesabım
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Navigation Sidebar */}
          <aside className="lg:col-span-3 bg-[#FFFFFF] p-6 border border-[#E6DFD5] space-y-2 shadow-sm">
            <div className="pb-4 mb-2 border-b border-[#E6DFD5]">
              <h3 className="font-serif text-base font-normal text-[#242321]">{profile.name}</h3>
              <p className="text-[11px] text-[#B49A6A] font-semibold">{profile.tier}</p>
            </div>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between p-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === 'orders' ? 'bg-[#242321] text-[#F8F5EF]' : 'text-[#5A5652] hover:bg-[#F8F5EF]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>Siparişlerim</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>

            <Link
              href="/favorilerim"
              className="w-full flex items-center justify-between p-3 text-xs font-semibold uppercase tracking-wider text-[#5A5652] hover:bg-[#F8F5EF] transition-colors"
            >
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>Favorilerim ({wishlist.length})</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center justify-between p-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === 'addresses' ? 'bg-[#242321] text-[#F8F5EF]' : 'text-[#5A5652] hover:bg-[#F8F5EF]'
              }`}
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Adreslerim</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center justify-between p-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === 'profile' ? 'bg-[#242321] text-[#F8F5EF]' : 'text-[#5A5652] hover:bg-[#F8F5EF]'
              }`}
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Profil Bilgileri</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="pt-4 border-t border-[#E6DFD5]">
              <Link
                href="/admin"
                className="w-full flex items-center gap-2 p-3 text-xs font-bold uppercase tracking-wider text-[#B49A6A] hover:bg-[#F8F5EF]"
              >
                <span>Admin Paneline Git →</span>
              </Link>
            </div>
          </aside>

          {/* Details Content Area */}
          <main className="lg:col-span-9 bg-[#FFFFFF] p-6 sm:p-8 border border-[#E6DFD5] shadow-sm">
            {/* TAB 1: SİPARİŞLERİM */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-[#E6DFD5]">
                  <h2 className="font-serif text-2xl font-normal text-[#242321]">Geçmiş Siparişleriniz</h2>
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

                      {/* Cargo Tracking CTA */}
                      <div className="pt-3 border-t border-[#F8F5EF] flex justify-between items-center">
                        <span className="text-[11px] text-[#8C857B]">
                          Kargo: <strong>{ord.carrier || 'Yurtiçi Kargo'}</strong> {ord.trackingCode && `(${ord.trackingCode})`}
                        </span>
                        <Link
                          href={`/kargo-takip?kod=${ord.orderNumber}`}
                          className="px-4 py-2 bg-[#242321] text-[#F8F5EF] text-xs uppercase font-semibold hover:bg-[#B49A6A] transition-colors flex items-center gap-1.5"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Kargo Takibi Yap</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: ADRESLERİM */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-[#E6DFD5]">
                  <h2 className="font-serif text-2xl font-normal text-[#242321]">Kayıtlı Adresleriniz</h2>
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
                        <strong className="text-[#242321] font-semibold text-sm">{addr.title}</strong>
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

            {/* TAB 3: PROFİL BİLGİLERİ */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-[#E6DFD5]">
                  <h2 className="font-serif text-2xl font-normal text-[#242321]">Profil Bilgileriniz</h2>
                  <p className="text-xs text-[#8C857B]">Üyelik ve iletişim bilgilerinizi güncelleyin.</p>
                </div>

                <form onSubmit={handleProfileSave} className="space-y-4 max-w-lg text-xs">
                  <div>
                    <label className="block text-[#8C857B] mb-1">Ad Soyad *</label>
                    <input
                      type="text"
                      required
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full p-2.5 bg-[#FFFFFF] border border-[#E6DFD5] text-[#242321] font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8C857B] mb-1">E-Posta Adresi *</label>
                    <input
                      type="email"
                      required
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full p-2.5 bg-[#FFFFFF] border border-[#E6DFD5] text-[#242321]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8C857B] mb-1">Telefon Numarası *</label>
                    <input
                      type="text"
                      required
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full p-2.5 bg-[#FFFFFF] border border-[#E6DFD5] text-[#242321]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8C857B] mb-1">Üyelik Statüsü</label>
                    <input
                      type="text"
                      disabled
                      value={profile.tier}
                      className="w-full p-2.5 bg-[#F8F5EF] border border-[#E6DFD5] text-[#B49A6A] font-semibold"
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
          </main>
        </div>
      </div>
    </div>
  );
}
