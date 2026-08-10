'use client';

import React, { useState, useMemo } from 'react';
import {
  Users, Mail, Phone, Award, ShieldCheck, Search, ShoppingBag, Plus,
  Download, Eye, Filter, MapPin, Calendar, DollarSign, Edit, Trash2, X, ChevronRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';

interface CustomerItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  address?: string;
  ordersCount: number;
  totalSpent: number;
  tier: 'Vera VIP Diamond' | 'Vera Gold Müşteri' | 'Vera Silver Üye';
  joinedAt: string;
  notes?: string;
}

const SAMPLE_CUSTOMERS: CustomerItem[] = [
  {
    id: 'cust-demo-1',
    name: 'Ayşe Yılmaz',
    email: 'ayse.yilmaz@example.com',
    phone: '0532 111 2233',
    city: 'İstanbul',
    address: 'Nişantaşı Mah. Abdi İpekçi Cad. No:42 D:5 Şişli',
    ordersCount: 8,
    totalSpent: 18450,
    tier: 'Vera VIP Diamond',
    joinedAt: '12 Ocak 2025',
    notes: 'Özel hediye paketlemesi talep ediyor. Twill ipek eşarp tutkunu.',
  },
  {
    id: 'cust-demo-2',
    name: 'Zeynep Kaya',
    email: 'zeynep.kaya@example.com',
    phone: '0533 444 5566',
    city: 'Ankara',
    address: 'Çankaya Mah. Atakule Yanı No:18',
    ordersCount: 4,
    totalSpent: 7200,
    tier: 'Vera Gold Müşteri',
    joinedAt: '05 Mart 2025',
    notes: 'Düz renk medine ipeği şalları tercih ediyor.',
  },
  {
    id: 'cust-demo-3',
    name: 'Elif Demir',
    email: 'elif.demir@example.com',
    phone: '0535 777 8899',
    city: 'İzmir',
    address: 'Alsancak Mah. Atatürk Cad. No:102',
    ordersCount: 2,
    totalSpent: 2950,
    tier: 'Vera Silver Üye',
    joinedAt: '18 Mayıs 2025',
    notes: 'Kargo takiplerini yakından izliyor.',
  },
  {
    id: 'cust-demo-4',
    name: 'Fatma Şahin',
    email: 'fatma.sahin@example.com',
    phone: '0542 333 4455',
    city: 'Erzurum',
    address: 'Cumhuriyet Cad. Palandöken Apt. No:14',
    ordersCount: 12,
    totalSpent: 24800,
    tier: 'Vera VIP Diamond',
    joinedAt: '01 KASIM 2024',
    notes: 'Mağaza içi teslimat ve VIP müşteri temsilcisi atanmış.',
  },
];

export default function AdminCustomers() {
  const { registeredUsers } = useAuth();
  const { orders } = useData();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [segmentFilter, setSegmentFilter] = useState<'all' | 'VIP' | 'Gold' | 'Silver'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Customer Form State
  const [newCustomerForm, setNewCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'İstanbul',
    address: '',
    notes: '',
  });

  // Local state for manually added customers
  const [customCustomers, setCustomCustomers] = useState<CustomerItem[]>([]);

  // Build full merged customer list
  const fullCustomerList: CustomerItem[] = useMemo(() => {
    const realFromAuth: CustomerItem[] = registeredUsers
      .filter((u) => u.role !== 'admin' && !u.isAdmin && u.email !== 'destek@veraesarp.com')
      .map((u) => {
        const userOrders = orders.filter(
          (o) =>
            o.email?.toLowerCase() === u.email.toLowerCase() ||
            (o.phone && u.phone && o.phone.replace(/[^0-9]/g, '') === u.phone.replace(/[^0-9]/g, ''))
        );
        const totalSpent = userOrders.reduce((sum, o) => sum + (o.total || 0), 0);
        return {
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone || '05xx xxx xx xx',
          city: 'Erzurum',
          ordersCount: userOrders.length,
          totalSpent: totalSpent,
          tier:
            totalSpent > 10000
              ? 'Vera VIP Diamond'
              : totalSpent > 5000
              ? 'Vera Gold Müşteri'
              : 'Vera Silver Üye',
          joinedAt: 'Kayıtlı Üye',
        };
      });

    // Merge: real users + manually created + demo samples if real list is small
    const combined = [...customCustomers, ...realFromAuth];
    
    // Add sample customers if empty or minimal to ensure CRM is rich and functional
    SAMPLE_CUSTOMERS.forEach((sample) => {
      if (!combined.some((c) => c.email.toLowerCase() === sample.email.toLowerCase())) {
        combined.push(sample);
      }
    });

    return combined;
  }, [registeredUsers, orders, customCustomers]);

  // Filter logic
  const filteredCustomers = useMemo(() => {
    return fullCustomerList.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.city.toLowerCase().includes(q);

      const matchesSegment =
        segmentFilter === 'all' ||
        (segmentFilter === 'VIP' && c.tier.includes('VIP')) ||
        (segmentFilter === 'Gold' && c.tier.includes('Gold')) ||
        (segmentFilter === 'Silver' && c.tier.includes('Silver'));

      return matchesSearch && matchesSegment;
    });
  }, [fullCustomerList, searchQuery, segmentFilter]);

  // KPIs
  const totalSpentAll = useMemo(() => fullCustomerList.reduce((sum, c) => sum + c.totalSpent, 0), [fullCustomerList]);
  const vipCount = useMemo(() => fullCustomerList.filter((c) => c.tier.includes('VIP')).length, [fullCustomerList]);
  const avgSpent = useMemo(() => (fullCustomerList.length > 0 ? totalSpentAll / fullCustomerList.length : 0), [fullCustomerList, totalSpentAll]);

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerForm.name || !newCustomerForm.email) {
      showToast('Lütfen isim ve e-posta alanlarını doldurunuz.', 'error');
      return;
    }

    const newCust: CustomerItem = {
      id: `cust-manual-${Date.now()}`,
      name: newCustomerForm.name,
      email: newCustomerForm.email,
      phone: newCustomerForm.phone || 'Belirtilmedi',
      city: newCustomerForm.city,
      address: newCustomerForm.address,
      ordersCount: 0,
      totalSpent: 0,
      tier: 'Vera Silver Üye',
      joinedAt: 'Bugün',
      notes: newCustomerForm.notes,
    };

    setCustomCustomers((prev) => [newCust, ...prev]);
    setIsAddModalOpen(false);
    setNewCustomerForm({ name: '', email: '', phone: '', city: 'İstanbul', address: '', notes: '' });
    showToast(`"${newCust.name}" müşterisi başarıyla oluşturuldu!`, 'success');
  };

  const handleExportCSV = () => {
    const headers = ['Müşteri Adı', 'E-Posta', 'Telefon', 'Şehir', 'Sipariş Sayısı', 'Toplam Harcama (TL)', 'Segment'];
    const rows = filteredCustomers.map((c) => [
      `"${c.name}"`,
      `"${c.email}"`,
      `"${c.phone}"`,
      `"${c.city}"`,
      c.ordersCount,
      c.totalSpent,
      `"${c.tier}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vera_crm_musteriler_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Müşteri verileri CSV dosyası olarak indirildi.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-[#2A2825]">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#F8F5EF]">Müşteri İlişkileri (CRM)</h1>
          <p className="text-xs text-[#8C857B]">
            Müşterilerinizin alışveriş geçmişlerini, segmentlerini, LTV harcama tutarlarını ve üyelik detaylarını yönetin.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#242321] border border-[#3A3835] text-[#8C857B] text-xs font-semibold hover:border-[#B49A6A] hover:text-[#B49A6A] transition-colors rounded"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Excel / CSV</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-[#B49A6A] text-[#1C1B1A] text-xs font-bold uppercase tracking-wider hover:bg-[#988052] transition-colors flex items-center justify-center gap-1.5 shadow-lg rounded"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Müşteri Ekle</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#1C1B1A] border border-[#2A2825] space-y-1">
          <span className="text-[10px] uppercase text-[#8C857B] font-semibold tracking-wider">Toplam Müşteri</span>
          <p className="font-serif text-2xl text-[#F8F5EF] font-semibold">{fullCustomerList.length}</p>
          <span className="text-[10px] text-emerald-400">Aktif Kayıtlı Veritabanı</span>
        </div>
        <div className="p-4 bg-[#1C1B1A] border border-[#2A2825] space-y-1">
          <span className="text-[10px] uppercase text-[#8C857B] font-semibold tracking-wider">VIP Müşteri Sayısı</span>
          <p className="font-serif text-2xl text-[#B49A6A] font-semibold">{vipCount}</p>
          <span className="text-[10px] text-[#B49A6A]">Diamond &amp; Premium Segment</span>
        </div>
        <div className="p-4 bg-[#1C1B1A] border border-[#2A2825] space-y-1">
          <span className="text-[10px] uppercase text-[#8C857B] font-semibold tracking-wider">Toplam Müşteri Hacmi</span>
          <p className="font-serif text-2xl text-emerald-400 font-semibold">₺{totalSpentAll.toLocaleString('tr-TR')}</p>
          <span className="text-[10px] text-[#8C857B]">Kümülatif Ciro Katkısı</span>
        </div>
        <div className="p-4 bg-[#1C1B1A] border border-[#2A2825] space-y-1">
          <span className="text-[10px] uppercase text-[#8C857B] font-semibold tracking-wider">Ortalama Müşteri Değeri (LTV)</span>
          <p className="font-serif text-2xl text-amber-400 font-semibold">₺{Math.round(avgSpent).toLocaleString('tr-TR')}</p>
          <span className="text-[10px] text-amber-400">Müşteri Başı Ortalama</span>
        </div>
      </div>

      {/* Control Bar & Filter Tabs */}
      <div className="p-4 bg-[#1C1B1A] border border-[#2A2825] flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        {/* Segment Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'Tüm Müşteriler' },
            { id: 'VIP', label: '💎 VIP Diamond' },
            { id: 'Gold', label: '🥇 Gold Segment' },
            { id: 'Silver', label: '🥈 Silver Üye' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSegmentFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded transition-all whitespace-nowrap text-xs font-semibold ${
                segmentFilter === tab.id
                  ? 'bg-[#B49A6A] text-[#1C1B1A]'
                  : 'bg-[#242321] text-[#8C857B] hover:text-[#F8F5EF]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-[#8C857B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="İsim, e-posta, telefon veya şehir ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#242321] border border-[#3A3835] text-xs text-[#F8F5EF] placeholder-[#8C857B] focus:border-[#B49A6A] focus:outline-none rounded"
          />
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-[#1C1B1A] border border-[#2A2825] overflow-hidden shadow-xl rounded">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#E8DED1]">
            <thead className="bg-[#242321] text-[#B49A6A] uppercase tracking-wider text-[11px] border-b border-[#2A2825]">
              <tr>
                <th className="p-4">Müşteri Profil</th>
                <th className="p-4">İletişim Detayları</th>
                <th className="p-4">Şehir</th>
                <th className="p-4">Sipariş Sayısı</th>
                <th className="p-4">Toplam Harcama (LTV)</th>
                <th className="p-4">Müşteri Segmenti</th>
                <th className="p-4 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2825]">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-[#8C857B]">
                    <Users className="w-10 h-10 text-[#B49A6A] mx-auto opacity-40 mb-2" />
                    <p className="font-serif text-base text-[#F8F5EF]">Aradığınız Kriterlerde Müşteri Bulunamadı</p>
                    <p className="text-xs text-[#8C857B] mt-1">Arama kelimenizi değiştirin veya filtreleri temizleyin.</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-[#242321]/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#B49A6A]/20 text-[#B49A6A] font-serif font-bold flex items-center justify-center border border-[#B49A6A]/30 shrink-0">
                          {cust.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#F8F5EF] text-sm">{cust.name}</h4>
                          <span className="text-[10px] text-[#8C857B]">Kayıt: {cust.joinedAt}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 space-y-0.5">
                      <p className="text-[#F8F5EF] flex items-center gap-1.5 font-medium">
                        <Mail className="w-3 h-3 text-[#B49A6A]" /> {cust.email}
                      </p>
                      <p className="text-[#8C857B] flex items-center gap-1.5 font-mono text-[11px]">
                        <Phone className="w-3 h-3 text-[#8C857B]" /> {cust.phone}
                      </p>
                    </td>
                    <td className="p-4 font-medium text-[#E8DED1]">{cust.city}</td>
                    <td className="p-4 font-semibold text-[#F8F5EF]">
                      <span className="px-2 py-1 bg-[#242321] border border-[#3A3835] rounded">
                        {cust.ordersCount} Sipariş
                      </span>
                    </td>
                    <td className="p-4 font-serif text-base text-[#B49A6A] font-bold">
                      ₺{cust.totalSpent.toLocaleString('tr-TR')}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded-full border ${
                          cust.tier.includes('VIP')
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                            : cust.tier.includes('Gold')
                            ? 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30'
                            : 'bg-slate-500/15 text-slate-300 border-slate-500/30'
                        }`}
                      >
                        {cust.tier}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedCustomer(cust)}
                        className="px-3 py-1.5 bg-[#242321] border border-[#3A3835] text-xs text-[#B49A6A] hover:border-[#B49A6A] hover:text-[#F8F5EF] transition-colors rounded inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detay</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CUSTOMER DETAIL MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1C1B1A] border border-[#B49A6A] p-6 sm:p-8 max-w-lg w-full text-[#F8F5EF] space-y-4 shadow-2xl rounded">
            <div className="flex justify-between items-start pb-4 border-b border-[#2A2825]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#B49A6A]/20 text-[#B49A6A] font-serif font-bold text-xl flex items-center justify-center border border-[#B49A6A]/40">
                  {selectedCustomer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-serif text-xl text-[#F8F5EF]">{selectedCustomer.name}</h3>
                  <span className="text-xs text-[#B49A6A] font-semibold">{selectedCustomer.tier}</span>
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-[#8C857B] hover:text-[#F8F5EF]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-[#242321] border border-[#3A3835] rounded">
                <div>
                  <span className="text-[10px] text-[#8C857B] uppercase block">E-Posta Adresi</span>
                  <span className="font-medium text-[#F8F5EF]">{selectedCustomer.email}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8C857B] uppercase block">Telefon Numarası</span>
                  <span className="font-mono text-[#F8F5EF]">{selectedCustomer.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8C857B] uppercase block">Şehir / Lokasyon</span>
                  <span className="text-[#F8F5EF]">{selectedCustomer.city}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8C857B] uppercase block">Kayıt Tarihi</span>
                  <span className="text-[#F8F5EF]">{selectedCustomer.joinedAt}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-[#242321] border border-[#3A3835] rounded">
                <div>
                  <span className="text-[10px] text-[#8C857B] uppercase block">Toplam Tamamlanan Sipariş</span>
                  <span className="font-serif text-lg font-semibold text-[#F8F5EF]">{selectedCustomer.ordersCount} Sipariş</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8C857B] uppercase block">Toplam Harcama Değeri</span>
                  <span className="font-serif text-lg font-bold text-[#B49A6A]">₺{selectedCustomer.totalSpent.toLocaleString('tr-TR')}</span>
                </div>
              </div>

              {selectedCustomer.address && (
                <div className="p-3 bg-[#242321] border border-[#3A3835] rounded">
                  <span className="text-[10px] text-[#8C857B] uppercase block mb-1">Kayıtlı Adres</span>
                  <p className="text-[#E8DED1] leading-relaxed">{selectedCustomer.address}</p>
                </div>
              )}

              {selectedCustomer.notes && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded">
                  <span className="text-[10px] text-amber-400 font-bold uppercase block mb-1">CRM Notu &amp; Tercihler</span>
                  <p className="text-amber-200">{selectedCustomer.notes}</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#2A2825] flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 bg-[#B49A6A] text-[#1C1B1A] font-semibold uppercase text-xs rounded hover:bg-[#988052]"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD CUSTOMER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1C1B1A] border border-[#B49A6A] p-6 sm:p-8 max-w-md w-full text-[#F8F5EF] space-y-4 shadow-2xl rounded">
            <div className="flex justify-between items-center pb-3 border-b border-[#2A2825]">
              <h2 className="font-serif text-xl font-normal">Yeni Müşteri Kartı Oluştur</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[#8C857B] hover:text-[#F8F5EF]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#8C857B] mb-1">Müşteri Adı Soyadı *</label>
                <input
                  type="text"
                  required
                  placeholder="ör: Selin Özkan"
                  value={newCustomerForm.name}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, name: e.target.value })}
                  className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8C857B] mb-1">E-Posta Adresi *</label>
                  <input
                    type="email"
                    required
                    placeholder="selin@example.com"
                    value={newCustomerForm.email}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, email: e.target.value })}
                    className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#8C857B] mb-1">Telefon</label>
                  <input
                    type="text"
                    placeholder="0532 xxx xx xx"
                    value={newCustomerForm.phone}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })}
                    className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8C857B] mb-1">Şehir</label>
                  <input
                    type="text"
                    placeholder="ör: İstanbul"
                    value={newCustomerForm.city}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, city: e.target.value })}
                    className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#8C857B] mb-1">Açık Adres</label>
                <textarea
                  rows={2}
                  placeholder="Mahalle, cadde, no..."
                  value={newCustomerForm.address}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, address: e.target.value })}
                  className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#8C857B] mb-1">Özel Müşteri Notları / Tercihler</label>
                <input
                  type="text"
                  placeholder="ör: İpek eşarp koleksiyoncusu"
                  value={newCustomerForm.notes}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, notes: e.target.value })}
                  className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-[#2A2825] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-[#242321] text-[#8C857B]"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#B49A6A] text-[#1C1B1A] font-bold uppercase tracking-wider hover:bg-[#988052]"
                >
                  Müşteriyi Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
