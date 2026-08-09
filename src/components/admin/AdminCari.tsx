'use client';

import React, { useState } from 'react';
import {
  Users,
  Plus,
  Trash2,
  FileText,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Printer,
  X,
  Search,
  Building2,
  Calendar,
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { CariAccount, CariTransaction } from '@/lib/types/ecommerce';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function AdminCari() {
  const { registeredUsers } = useAuth();
  const { cariAccounts, cariTransactions, addCariAccount, deleteCariAccount, addCariTransaction } = useData();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddCariModalOpen, setIsAddCariModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [selectedCariForStatement, setSelectedCariForStatement] = useState<CariAccount | null>(null);
  const [selectedCariForTransaction, setSelectedCariForTransaction] = useState<CariAccount | null>(null);

  // New Cari Form State
  const [newCari, setNewCari] = useState({
    code: `CAR-${Math.floor(100 + Math.random() * 900)}`,
    title: '',
    taxOffice: 'Şişli V.D.',
    taxNumber: '',
    type: 'Tedarikçi' as CariAccount['type'],
    balance: 0,
    phone: '',
    email: '',
    address: '',
    city: 'Erzurum',
  });

  // New Transaction Form State
  const [newTx, setNewTx] = useState({
    documentNo: `FAT-2026-${Math.floor(100 + Math.random() * 900)}`,
    description: '',
    type: 'Fatura' as CariTransaction['type'],
    amount: 10000,
    isDebt: true,
  });

  // Combine cariAccounts with real registeredUsers from AuthContext
  const combinedCariAccounts: CariAccount[] = [...cariAccounts];

  registeredUsers.forEach((u) => {
    if (u.role !== 'admin' && !u.isAdmin && u.email !== 'destek@veraesarp.com') {
      const exists = combinedCariAccounts.some((c) => c.email?.toLowerCase() === u.email.toLowerCase());
      if (!exists) {
        combinedCariAccounts.push({
          id: `cari-${u.id}`,
          code: `CAR-MUS-${String(combinedCariAccounts.length + 1).padStart(3, '0')}`,
          title: u.name,
          taxOffice: 'Bireysel Müşteri',
          taxNumber: '-',
          type: 'Müşteri',
          balance: u.totalSpent || 0,
          balanceType: 'Alacaklı',
          phone: u.phone || '',
          email: u.email,
          address: 'Bireysel Üyelik Adresi',
          city: 'Erzurum',
          createdAt: new Date().toISOString().slice(0, 10),
        });
      }
    }
  });

  // Totals
  const totalReceivables = combinedCariAccounts
    .filter((c) => c.balanceType === 'Borçlu')
    .reduce((sum, c) => sum + c.balance, 0);

  const totalPayables = combinedCariAccounts
    .filter((c) => c.balanceType === 'Alacaklı')
    .reduce((sum, c) => sum + c.balance, 0);

  const handleAddCariSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCari.title) {
      showToast('Lütfen cari firma / şahıs unvanını giriniz.', 'error');
      return;
    }
    addCariAccount({
      ...newCari,
      balanceType: newCari.balance > 0 ? 'Borçlu' : 'Dengede',
    });
    setIsAddCariModalOpen(false);
    showToast(`${newCari.title} cari hesabı başarıyla oluşturuldu!`, 'success');
  };

  const handleAddTxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCariForTransaction) return;

    addCariTransaction({
      cariId: selectedCariForTransaction.id,
      date: new Date().toISOString().split('T')[0],
      documentNo: newTx.documentNo,
      description: newTx.description || 'Cari hesap hareketi',
      type: newTx.type,
      amount: Number(newTx.amount),
      isDebt: newTx.isDebt,
    });

    setIsTransactionModalOpen(false);
    showToast('Cari hesap hareketi başarıyla işlendi.', 'success');
  };

  const filteredAccounts = combinedCariAccounts.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.taxNumber && c.taxNumber.includes(q))
    );
  });

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-[#2A2825]">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#F8F5EF]">Gelişmiş Cari Hesap Takibi</h1>
          <p className="text-xs text-[#8C857B]">Tedarikçi, toptancı ve kurumsal müşterilerinizin alacak/borç dengelerini ve ekstrelerini yönetin.</p>
        </div>

        <button
          onClick={() => setIsAddCariModalOpen(true)}
          className="px-5 py-3 bg-[#B49A6A] text-[#F8F5EF] text-xs font-semibold uppercase tracking-wider hover:bg-[#988052] transition-colors flex items-center justify-center gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Cari Hesap Ekle</span>
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-[#1C1B1A] border border-[#2A2825] space-y-2">
          <div className="flex justify-between items-center text-emerald-400">
            <span className="text-xs uppercase tracking-widest font-semibold">Toplam Alacaklarımız</span>
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="font-serif text-3xl font-semibold text-[#F8F5EF]">
            ₺{totalReceivables.toLocaleString('tr-TR')}
          </div>
          <span className="text-[10px] text-[#8C857B]">Toptancı ve Kurumsal Müşterilerden</span>
        </div>

        <div className="p-6 bg-[#1C1B1A] border border-[#2A2825] space-y-2">
          <div className="flex justify-between items-center text-rose-400">
            <span className="text-xs uppercase tracking-widest font-semibold">Toplam Borçlarımız</span>
            <TrendingDown className="w-5 h-5" />
          </div>
          <div className="font-serif text-3xl font-semibold text-[#F8F5EF]">
            ₺{totalPayables.toLocaleString('tr-TR')}
          </div>
          <span className="text-[10px] text-[#8C857B]">İpek Dokuma ve Kumaş Tedarikçilerine</span>
        </div>

        <div className="p-6 bg-[#1C1B1A] border border-[#2A2825] space-y-2">
          <div className="flex justify-between items-center text-[#B49A6A]">
            <span className="text-xs uppercase tracking-widest font-semibold">Net Cari Bakiye</span>
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="font-serif text-3xl font-semibold text-[#B49A6A]">
            ₺{Math.abs(totalReceivables - totalPayables).toLocaleString('tr-TR')}
          </div>
          <span className="text-[10px] text-emerald-400 font-medium">
            {totalReceivables >= totalPayables ? 'Net Alacaklı Durumda' : 'Net Borçlu Durumda'}
          </span>
        </div>
      </div>

      {/* Control Bar & Search */}
      <div className="p-4 bg-[#1C1B1A] border border-[#2A2825] flex justify-between items-center">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Cari unvan, kod veya vergi no ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2.5 px-4 pr-10 bg-[#242321] border border-[#3A3835] text-xs text-[#F8F5EF] placeholder-[#8C857B] focus:outline-none focus:border-[#B49A6A]"
          />
          <Search className="w-4 h-4 text-[#8C857B] absolute right-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Cari Accounts Table */}
      <div className="bg-[#1C1B1A] border border-[#2A2825] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#E8DED1]">
            <thead className="bg-[#242321] text-[#B49A6A] uppercase tracking-wider text-[11px] border-b border-[#2A2825]">
              <tr>
                <th className="p-4">Cari Kodu</th>
                <th className="p-4">Firma / Müşteri Unvanı</th>
                <th className="p-4">Tür</th>
                <th className="p-4">Vergi No / Daire</th>
                <th className="p-4">Bakiye Durumu</th>
                <th className="p-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2825]">
              {filteredAccounts.map((c) => (
                <tr key={c.id} className="hover:bg-[#242321] transition-colors">
                  <td className="p-4 font-mono font-bold text-[#B49A6A]">{c.code}</td>
                  <td className="p-4">
                    <h4 className="font-serif text-sm font-semibold text-[#F8F5EF]">{c.title}</h4>
                    <span className="text-[10px] text-[#8C857B]">{c.city} • {c.phone}</span>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-[#242321] border border-[#3A3835] text-[10px] font-bold uppercase text-[#E8DED1]">
                      {c.type}
                    </span>
                  </td>
                  <td className="p-4 text-[#8C857B]">
                    {c.taxOffice} / {c.taxNumber || '—'}
                  </td>
                  <td className="p-4">
                    <span className="font-serif text-base font-semibold text-[#F8F5EF] block">
                      ₺{c.balance.toLocaleString('tr-TR')}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold ${
                        c.balanceType === 'Borçlu' ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {c.balanceType}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedCariForTransaction(c);
                          setIsTransactionModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-[#242321] border border-[#3A3835] text-xs text-[#B49A6A] hover:border-[#B49A6A]"
                      >
                        + Hareket İşle
                      </button>
                      <button
                        onClick={() => setSelectedCariForStatement(c)}
                        className="p-2 bg-[#242321] border border-[#3A3835] text-[#E8DED1] hover:text-[#B49A6A]"
                        title="Cari Ekstre Yazdır"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          deleteCariAccount(c.id);
                          showToast('Cari hesap silindi.', 'info');
                        }}
                        className="p-2 bg-[#242321] border border-[#3A3835] text-rose-400 hover:border-rose-500"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: YENİ CARİ HESAP EKLE */}
      {isAddCariModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1C1B1A] border border-[#B49A6A] p-6 sm:p-8 max-w-lg w-full text-[#F8F5EF] space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-[#2A2825]">
              <h2 className="font-serif text-2xl font-normal">Yeni Cari Hesap Tanımla</h2>
              <button onClick={() => setIsAddCariModalOpen(false)} className="text-[#8C857B] hover:text-[#F8F5EF]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCariSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#8C857B] mb-1">Cari Kodu *</label>
                  <input
                    type="text"
                    required
                    value={newCari.code}
                    onChange={(e) => setNewCari({ ...newCari, code: e.target.value })}
                    className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[#8C857B] mb-1">Cari Türü *</label>
                  <select
                    value={newCari.type}
                    onChange={(e) => setNewCari({ ...newCari, type: e.target.value as any })}
                    className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
                  >
                    <option value="Tedarikçi">Tedarikçi</option>
                    <option value="Toptancı">Toptancı</option>
                    <option value="Kurumsal Müşteri">Kurumsal Müşteri</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#8C857B] mb-1">Firma / Şahıs Unvanı *</label>
                <input
                  type="text"
                  required
                  placeholder="ör: Milano Silk Fabric S.p.A"
                  value={newCari.title}
                  onChange={(e) => setNewCari({ ...newCari, title: e.target.value })}
                  className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#8C857B] mb-1">Vergi Dairesi</label>
                  <input
                    type="text"
                    value={newCari.taxOffice}
                    onChange={(e) => setNewCari({ ...newCari, taxOffice: e.target.value })}
                    className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
                  />
                </div>
                <div>
                  <label className="block text-[#8C857B] mb-1">Vergi / TC No</label>
                  <input
                    type="text"
                    value={newCari.taxNumber}
                    onChange={(e) => setNewCari({ ...newCari, taxNumber: e.target.value })}
                    className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#8C857B] mb-1">Telefon</label>
                  <input
                    type="text"
                    value={newCari.phone}
                    onChange={(e) => setNewCari({ ...newCari, phone: e.target.value })}
                    className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
                  />
                </div>
                <div>
                  <label className="block text-[#8C857B] mb-1">E-Posta</label>
                  <input
                    type="email"
                    value={newCari.email}
                    onChange={(e) => setNewCari({ ...newCari, email: e.target.value })}
                    className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#2A2825]">
                <button
                  type="button"
                  onClick={() => setIsAddCariModalOpen(false)}
                  className="px-4 py-2 text-[#8C857B]"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#B49A6A] text-[#F8F5EF] font-semibold uppercase tracking-wider"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CARİ HAREKET İŞLE */}
      {isTransactionModalOpen && selectedCariForTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1C1B1A] border border-[#B49A6A] p-6 sm:p-8 max-w-md w-full text-[#F8F5EF] space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-[#2A2825]">
              <h2 className="font-serif text-xl font-normal">Cari Hareket İşle: {selectedCariForTransaction.title}</h2>
              <button onClick={() => setIsTransactionModalOpen(false)} className="text-[#8C857B] hover:text-[#F8F5EF]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTxSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#8C857B] mb-1">Evrak / Belge No *</label>
                <input
                  type="text"
                  required
                  value={newTx.documentNo}
                  onChange={(e) => setNewTx({ ...newTx, documentNo: e.target.value })}
                  className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#8C857B] mb-1">İşlem Türü *</label>
                  <select
                    value={newTx.type}
                    onChange={(e) => setNewTx({ ...newTx, type: e.target.value as any })}
                    className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
                  >
                    <option value="Fatura">Alım Faturası</option>
                    <option value="Tahsilat">Tahsilat (Banka/Nakit)</option>
                    <option value="Ödeme">Ödeme</option>
                    <option value="İrsaliye">İrsaliye</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#8C857B] mb-1">Borç / Alacak *</label>
                  <select
                    value={newTx.isDebt ? 'debt' : 'credit'}
                    onChange={(e) => setNewTx({ ...newTx, isDebt: e.target.value === 'debt' })}
                    className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
                  >
                    <option value="debt">Borç (+) (Alacağımız)</option>
                    <option value="credit">Alacak (-) (Ödememiz)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#8C857B] mb-1">İşlem Tutarı (₺) *</label>
                <input
                  type="number"
                  required
                  value={newTx.amount}
                  onChange={(e) => setNewTx({ ...newTx, amount: Number(e.target.value) })}
                  className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] font-serif text-base"
                />
              </div>

              <div>
                <label className="block text-[#8C857B] mb-1">Açıklama</label>
                <input
                  type="text"
                  placeholder="ör: İpek kumaş alım bakiyesi"
                  value={newTx.description}
                  onChange={(e) => setNewTx({ ...newTx, description: e.target.value })}
                  className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#2A2825]">
                <button
                  type="button"
                  onClick={() => setIsTransactionModalOpen(false)}
                  className="px-4 py-2 text-[#8C857B]"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#B49A6A] text-[#F8F5EF] font-semibold uppercase tracking-wider"
                >
                  Hareketi İşle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: YAZDIRILABİLİR CARİ EKSTRE MODALI */}
      {selectedCariForStatement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#FFFFFF] text-[#242321] p-8 sm:p-12 max-w-3xl w-full shadow-2xl space-y-6 my-8 border border-[#E6DFD5]">
            <div className="flex justify-between items-start pb-6 border-b border-[#E6DFD5]">
              <div>
                <span className="font-serif text-3xl tracking-[0.2em] font-semibold text-[#242321]">
                  VERA EŞARP
                </span>
                <span className="block text-[9px] tracking-[0.3em] text-[#B49A6A] uppercase font-sans">
                  CARİ HESAP EKSTRESİ &amp; MUTABAKAT FORMU
                </span>
              </div>
              <div className="text-right text-xs text-[#5A5652]">
                <p>Tarih: {new Date().toLocaleDateString('tr-TR')}</p>
                <p className="font-mono font-bold text-[#242321]">{selectedCariForStatement.code}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 text-xs bg-[#F8F5EF] p-4 border border-[#E6DFD5]">
              <div>
                <h4 className="font-semibold uppercase tracking-wider text-[#242321] mb-1">Cari Unvanı</h4>
                <p className="font-serif text-base font-semibold">{selectedCariForStatement.title}</p>
                <p className="text-[#5A5652]">{selectedCariForStatement.address}, {selectedCariForStatement.city}</p>
              </div>
              <div>
                <h4 className="font-semibold uppercase tracking-wider text-[#242321] mb-1">Vergi Bilgileri</h4>
                <p>{selectedCariForStatement.taxOffice} / {selectedCariForStatement.taxNumber}</p>
                <p>Mevcut Bakiye: <strong className="text-[#B49A6A] font-serif text-base">₺{selectedCariForStatement.balance.toLocaleString('tr-TR')} ({selectedCariForStatement.balanceType})</strong></p>
              </div>
            </div>

            {/* Transactions */}
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#242321] font-semibold text-[#242321] uppercase">
                  <th className="py-2">Tarih</th>
                  <th className="py-2">Evrak No</th>
                  <th className="py-2">Açıklama</th>
                  <th className="py-2 text-right">Borç (TL)</th>
                  <th className="py-2 text-right">Alacak (TL)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6DFD5]">
                {cariTransactions
                  .filter((t) => t.cariId === selectedCariForStatement.id)
                  .map((tx) => (
                    <tr key={tx.id}>
                      <td className="py-2.5 text-[#5A5652]">{tx.date}</td>
                      <td className="py-2.5 font-mono font-semibold">{tx.documentNo}</td>
                      <td className="py-2.5">{tx.description}</td>
                      <td className="py-2.5 text-right font-semibold text-[#242321]">
                        {tx.isDebt ? `₺${tx.amount.toLocaleString('tr-TR')}` : '—'}
                      </td>
                      <td className="py-2.5 text-right font-semibold text-emerald-700">
                        {!tx.isDebt ? `₺${tx.amount.toLocaleString('tr-TR')}` : '—'}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center pt-6 border-t border-[#E6DFD5]">
              <button
                onClick={() => setSelectedCariForStatement(null)}
                className="px-4 py-2 text-xs font-semibold uppercase text-[#8C857B]"
              >
                Kapat
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 bg-[#242321] text-[#F8F5EF] text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-[#B49A6A]"
              >
                <Printer className="w-4 h-4" />
                <span>Ekstreyi Yazdır / PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
