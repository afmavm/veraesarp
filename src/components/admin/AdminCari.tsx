'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  Users, Plus, Trash2, FileText, DollarSign, TrendingUp, TrendingDown,
  Printer, X, Search, Building2, Calendar, Filter, Download, Eye,
  ArrowUpRight, ArrowDownLeft, AlertCircle, CheckCircle2, BarChart3,
  Phone, Mail, MapPin, CreditCard, Receipt, RefreshCw, ChevronDown,
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { CariAccount, CariTransaction } from '@/lib/types/ecommerce';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

// ─── Helpers ────────────────────────────────────────────────────────────────
function fmt(n: number) { return n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function today() { return new Date().toISOString().split('T')[0]; }
function nowDisplay() { return new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' }); }

const TYPE_BADGE: Record<CariAccount['type'], { bg: string; text: string }> = {
  'Tedarikçi':        { bg: 'bg-blue-500/15 border-blue-500/30 text-blue-400',    text: 'Tedarikçi' },
  'Toptancı':         { bg: 'bg-purple-500/15 border-purple-500/30 text-purple-400', text: 'Toptancı' },
  'Kurumsal Müşteri': { bg: 'bg-amber-500/15 border-amber-500/30 text-amber-400', text: 'Kur. Müşteri' },
  'Perakende Müşteri':{ bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400', text: 'Perakende' },
  'Müşteri':          { bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400', text: 'Müşteri' },
};

const TX_TYPE_META: Record<string, { icon: React.ElementType; color: string }> = {
  'Fatura':    { icon: Receipt,      color: 'text-rose-400' },
  'Tahsilat':  { icon: ArrowDownLeft,color: 'text-emerald-400' },
  'Ödeme':     { icon: ArrowUpRight, color: 'text-amber-400' },
  'İrsaliye':  { icon: FileText,     color: 'text-blue-400' },
  'Not':       { icon: AlertCircle,  color: 'text-slate-400' },
};

// ─── Sub-component: Cari Row ─────────────────────────────────────────────────
function CariRow({
  c, txs, onAddTx, onStatement, onDelete, onView,
}: {
  c: CariAccount;
  txs: CariTransaction[];
  onAddTx: () => void;
  onStatement: () => void;
  onDelete: () => void;
  onView: () => void;
}) {
  const myTxs = txs.filter((t) => t.cariId === c.id);
  const lastTx = myTxs[myTxs.length - 1];
  const totalDebt = myTxs.filter((t) => t.isDebt).reduce((s, t) => s + t.amount, 0);
  const totalCredit = myTxs.filter((t) => !t.isDebt).reduce((s, t) => s + t.amount, 0);
  const runningBalance = totalDebt - totalCredit + c.balance;
  const badge = TYPE_BADGE[c.type] ?? TYPE_BADGE['Müşteri'];
  const isOverdue = runningBalance > 0;

  return (
    <tr className="hover:bg-[#242321]/80 transition-colors group border-b border-[#2A2825]">
      {/* Code */}
      <td className="p-4 font-mono text-xs font-bold text-[#B49A6A] whitespace-nowrap">{c.code}</td>

      {/* Title */}
      <td className="p-4 min-w-[180px]">
        <button onClick={onView} className="text-left group/title">
          <span className="font-serif text-sm font-semibold text-[#F8F5EF] group-hover/title:text-[#B49A6A] transition-colors block">{c.title}</span>
          <span className="text-[10px] text-[#5A5652] flex items-center gap-1 mt-0.5">
            <MapPin className="w-2.5 h-2.5" />{c.city}
            {c.phone && <><span className="mx-1">·</span><Phone className="w-2.5 h-2.5" />{c.phone}</>}
          </span>
        </button>
      </td>

      {/* Type */}
      <td className="p-4 whitespace-nowrap">
        <span className={`text-[10px] font-bold px-2 py-0.5 border rounded-full ${badge.bg}`}>
          {badge.text}
        </span>
      </td>

      {/* Tax */}
      <td className="p-4 text-[11px] text-[#8C857B] whitespace-nowrap">
        <span className="block">{c.taxOffice || '—'}</span>
        <span className="font-mono text-[10px]">{c.taxNumber || '—'}</span>
      </td>

      {/* Last Tx */}
      <td className="p-4 text-[10px] text-[#8C857B] whitespace-nowrap">
        {lastTx ? (
          <><span className="block text-[#E8DED1]">{lastTx.documentNo}</span><span>{lastTx.date}</span></>
        ) : <span className="text-[#3A3835]">İşlem yok</span>}
      </td>

      {/* Balance */}
      <td className="p-4 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${isOverdue ? 'bg-amber-400' : 'bg-emerald-400'}`} />
          <div>
            <span className={`font-serif text-sm font-bold block ${isOverdue ? 'text-amber-400' : 'text-emerald-400'}`}>
              ₺{fmt(runningBalance)}
            </span>
            <span className={`text-[10px] font-semibold uppercase ${isOverdue ? 'text-amber-500' : 'text-emerald-500'}`}>
              {isOverdue ? 'ALACAK (Borçlu)' : 'BORÇ (Ödeyeceğiz)'}
            </span>
          </div>
        </div>
      </td>

      {/* Actions */}
      <td className="p-4 whitespace-nowrap">
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={onView}
            className="p-1.5 bg-[#1C1B1A] border border-[#3A3835] text-[#8C857B] hover:text-[#B49A6A] hover:border-[#B49A6A] transition-colors rounded"
            title="Detay"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onAddTx}
            className="px-2.5 py-1.5 bg-[#242321] border border-[#B49A6A]/40 text-[#B49A6A] text-[10px] font-bold hover:bg-[#B49A6A] hover:text-[#1C1B1A] transition-all rounded whitespace-nowrap"
          >
            + Hareket
          </button>
          <button
            onClick={onStatement}
            className="p-1.5 bg-[#1C1B1A] border border-[#3A3835] text-[#8C857B] hover:text-[#F8F5EF] hover:border-[#5A5652] transition-colors rounded"
            title="Ekstre"
          >
            <FileText className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 bg-[#1C1B1A] border border-[#3A3835] text-rose-500/60 hover:text-rose-400 hover:border-rose-500/40 transition-colors rounded"
            title="Sil"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Sub-component: Transaction List ─────────────────────────────────────────
function TxTable({ txs }: { txs: CariTransaction[] }) {
  let runningBal = 0;
  const rows = txs.map((tx) => {
    if (tx.isDebt) runningBal += tx.amount;
    else runningBal -= tx.amount;
    return { ...tx, balance: runningBal };
  });

  if (rows.length === 0) {
    return (
      <div className="p-8 text-center text-[#5A5652] text-xs space-y-1">
        <Receipt className="w-8 h-8 mx-auto text-[#3A3835]" />
        <p>Bu cari hesaba ait hareket bulunmuyor.</p>
      </div>
    );
  }

  return (
    <table className="w-full text-left text-xs">
      <thead>
        <tr className="bg-[#1C1B1A] text-[#B49A6A] text-[10px] uppercase tracking-wider border-b border-[#2A2825]">
          <th className="px-4 py-2.5">Tarih</th>
          <th className="px-4 py-2.5">Evrak No</th>
          <th className="px-4 py-2.5">Tür</th>
          <th className="px-4 py-2.5">Açıklama</th>
          <th className="px-4 py-2.5 text-right">Borç</th>
          <th className="px-4 py-2.5 text-right">Alacak</th>
          <th className="px-4 py-2.5 text-right">Bakiye</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-[#2A2825]">
        {rows.map((tx) => {
          const meta = TX_TYPE_META[tx.type] ?? { icon: FileText, color: 'text-slate-400' };
          const Icon = meta.icon;
          return (
            <tr key={tx.id} className="hover:bg-[#242321]/50 transition-colors">
              <td className="px-4 py-2.5 text-[#8C857B] whitespace-nowrap">{tx.date}</td>
              <td className="px-4 py-2.5 font-mono font-bold text-[#E8DED1] text-[11px] whitespace-nowrap">{tx.documentNo}</td>
              <td className="px-4 py-2.5 whitespace-nowrap">
                <span className={`flex items-center gap-1 ${meta.color}`}>
                  <Icon className="w-3 h-3" />
                  {tx.type}
                </span>
              </td>
              <td className="px-4 py-2.5 text-[#8C857B] max-w-[200px] truncate">{tx.description}</td>
              <td className="px-4 py-2.5 text-right font-mono text-amber-400 font-semibold whitespace-nowrap">
                {tx.isDebt ? `₺${fmt(tx.amount)}` : '—'}
              </td>
              <td className="px-4 py-2.5 text-right font-mono text-emerald-400 font-semibold whitespace-nowrap">
                {!tx.isDebt ? `₺${fmt(tx.amount)}` : '—'}
              </td>
              <td className={`px-4 py-2.5 text-right font-mono font-bold whitespace-nowrap ${tx.balance >= 0 ? 'text-[#F8F5EF]' : 'text-emerald-400'}`}>
                ₺{fmt(Math.abs(tx.balance))}
                <span className="text-[9px] ml-1 font-normal">{tx.balance >= 0 ? 'A' : 'B'}</span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminCari() {
  const { registeredUsers } = useAuth();
  const { cariAccounts, cariTransactions, addCariAccount, deleteCariAccount, addCariTransaction } = useData();
  const { showToast } = useToast();

  // UI State
  const [searchQuery, setSearchQuery]   = useState('');
  const [filterType, setFilterType]     = useState<string>('all');
  const [filterBalance, setFilterBalance] = useState<string>('all');
  const [sortBy, setSortBy]             = useState<'title' | 'balance' | 'code'>('code');
  const [sortDir, setSortDir]           = useState<'asc' | 'desc'>('asc');

  // Modal State
  const [isAddOpen, setIsAddOpen]       = useState(false);
  const [isTxOpen, setIsTxOpen]         = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isStatementOpen, setIsStatementOpen] = useState(false);
  const [selectedCari, setSelectedCari] = useState<CariAccount | null>(null);

  // Form State
  const [newCari, setNewCari] = useState({
    code: `CAR-${Math.floor(100 + Math.random() * 900)}`,
    title: '',
    taxOffice: 'Aziziye V.D.',
    taxNumber: '',
    type: 'Tedarikçi' as CariAccount['type'],
    balance: 0,
    phone: '',
    email: '',
    address: '',
    city: 'Erzurum',
    creditLimit: 0,
    paymentTerm: 30,
    notes: '',
  });

  const [newTx, setNewTx] = useState({
    documentNo: `FAT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    description: '',
    type: 'Fatura' as CariTransaction['type'],
    amount: '',
    isDebt: true,
    date: today(),
    notes: '',
  });

  // Build combined accounts (cariAccounts + registered users)
  const allAccounts: CariAccount[] = useMemo(() => {
    const combined = [...cariAccounts];
    registeredUsers.forEach((u) => {
      if (u.role === 'admin' || u.isAdmin || u.email === 'destek@veraesarp.com') return;
      if (!combined.some((c) => c.email?.toLowerCase() === u.email.toLowerCase())) {
        combined.push({
          id: `cari-${u.id}`,
          code: `CAR-MUS-${String(combined.length + 1).padStart(3, '0')}`,
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
    });
    return combined;
  }, [cariAccounts, registeredUsers]);

  // Running balance per account (base + transactions)
  const accountBalance = useCallback((c: CariAccount) => {
    const txs = cariTransactions.filter((t) => t.cariId === c.id);
    const debt   = txs.filter((t) => t.isDebt).reduce((s, t) => s + t.amount, 0);
    const credit = txs.filter((t) => !t.isDebt).reduce((s, t) => s + t.amount, 0);
    return debt - credit + c.balance;
  }, [cariTransactions]);

  // Summary KPIs
  const kpis = useMemo(() => {
    let totalReceivable = 0; // Müşterilerden alacak (onların borcu)
    let totalPayable    = 0; // Tedarikçilere borç (bizim borcumuz)
    let overdueCount    = 0;

    allAccounts.forEach((c) => {
      const bal = accountBalance(c);
      if (bal > 0) { totalReceivable += bal; overdueCount++; }
      else if (bal < 0) totalPayable += Math.abs(bal);
    });

    return { totalReceivable, totalPayable, net: totalReceivable - totalPayable, overdueCount };
  }, [allAccounts, accountBalance]);

  // Filter + Sort
  const filteredAccounts = useMemo(() => {
    let result = allAccounts.filter((c) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q) ||
        (c.taxNumber || '').includes(q) ||
        (c.phone || '').includes(q);

      const matchType = filterType === 'all' || c.type === filterType;

      const bal = accountBalance(c);
      const matchBalance =
        filterBalance === 'all' ||
        (filterBalance === 'receivable' && bal > 0) ||
        (filterBalance === 'payable'    && bal < 0) ||
        (filterBalance === 'zero'       && bal === 0);

      return matchSearch && matchType && matchBalance;
    });

    result.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'title')   cmp = a.title.localeCompare(b.title, 'tr');
      if (sortBy === 'balance') cmp = accountBalance(a) - accountBalance(b);
      if (sortBy === 'code')    cmp = a.code.localeCompare(b.code, 'tr');
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [allAccounts, searchQuery, filterType, filterBalance, sortBy, sortDir, accountBalance]);

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const handleAddCari = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCari.title.trim()) { showToast('Firma/Şahıs unvanı zorunludur.', 'error'); return; }
    addCariAccount({
      code: newCari.code,
      title: newCari.title,
      taxOffice: newCari.taxOffice,
      taxNumber: newCari.taxNumber,
      type: newCari.type,
      balance: Number(newCari.balance) || 0,
      balanceType: Number(newCari.balance) > 0 ? 'Borçlu' : 'Dengede',
      phone: newCari.phone,
      email: newCari.email,
      address: newCari.address,
      city: newCari.city,
    });
    setIsAddOpen(false);
    showToast(`✅ "${newCari.title}" cari hesabı oluşturuldu!`, 'success');
    setNewCari((p) => ({
      ...p,
      code: `CAR-${Math.floor(100 + Math.random() * 900)}`,
      title: '', taxNumber: '', phone: '', email: '', address: '', balance: 0, notes: '',
    }));
  };

  const handleAddTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCari) return;
    const amount = parseFloat(String(newTx.amount));
    if (!amount || amount <= 0) { showToast('Geçerli bir tutar giriniz.', 'error'); return; }
    if (!newTx.documentNo.trim()) { showToast('Evrak numarası zorunludur.', 'error'); return; }

    addCariTransaction({
      cariId: selectedCari.id,
      date: newTx.date || today(),
      documentNo: newTx.documentNo,
      description: newTx.description || `${newTx.type} hareketi`,
      type: newTx.type,
      amount,
      isDebt: newTx.isDebt,
    });

    setIsTxOpen(false);
    showToast(`✅ ₺${fmt(amount)} tutarında ${newTx.type} hareketi işlendi.`, 'success');
    setNewTx((p) => ({
      ...p,
      documentNo: `FAT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      description: '', amount: '', date: today(),
    }));
  };

  // CSV Export
  const handleExportCSV = () => {
    const rows = [
      ['Cari Kodu', 'Unvan', 'Tür', 'Vergi Dairesi', 'Vergi No', 'Telefon', 'E-Posta', 'Şehir', 'Bakiye (₺)', 'Durum'],
      ...filteredAccounts.map((c) => {
        const bal = accountBalance(c);
        return [
          c.code, c.title, c.type, c.taxOffice || '', c.taxNumber || '',
          c.phone || '', c.email || '', c.city || '',
          fmt(bal),
          bal > 0 ? 'ALACAK' : bal < 0 ? 'BORÇ' : 'DENGEDE',
        ];
      }),
    ];
    const csv = rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `vera-cari-${today()}.csv`; a.click();
    URL.revokeObjectURL(url);
    showToast('Cari hesap listesi CSV olarak indirildi.', 'success');
  };

  // Transaction CSV Export for selected cari
  const handleExportTxCSV = (cari: CariAccount) => {
    const txs = cariTransactions.filter((t) => t.cariId === cari.id);
    const rows = [
      ['Tarih', 'Evrak No', 'Tür', 'Açıklama', 'Borç', 'Alacak'],
      ...txs.map((t) => [t.date, t.documentNo, t.type, t.description, t.isDebt ? fmt(t.amount) : '', !t.isDebt ? fmt(t.amount) : '']),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = `ekstre-${cari.code}-${today()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const openTx = (c: CariAccount) => { setSelectedCari(c); setIsTxOpen(true); };
  const openStatement = (c: CariAccount) => { setSelectedCari(c); setIsStatementOpen(true); };
  const openDetail = (c: CariAccount) => { setSelectedCari(c); setIsDetailOpen(true); };

  const SortHeader = ({ field, label }: { field: typeof sortBy; label: string }) => (
    <button
      onClick={() => { if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc'); else { setSortBy(field); setSortDir('asc'); } }}
      className="flex items-center gap-1 text-[#B49A6A] uppercase tracking-wider text-[10px] font-semibold hover:text-[#F8F5EF] transition-colors"
    >
      {label}
      {sortBy === field && <ChevronDown className={`w-3 h-3 transition-transform ${sortDir === 'desc' ? 'rotate-180' : ''}`} />}
    </button>
  );

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 pb-4 border-b border-[#2A2825]">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#F8F5EF]">Gelişmiş Cari Hesap Takibi</h1>
          <p className="text-xs text-[#8C857B] mt-1">Tedarikçi, toptancı ve kurumsal müşterilerinizin alacak/borç dengelerini ve ekstrelerini yönetin.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#242321] border border-[#3A3835] text-[#8C857B] text-xs font-semibold hover:border-[#B49A6A] hover:text-[#B49A6A] transition-colors rounded"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Excel/CSV</span>
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#B49A6A] text-[#1C1B1A] text-xs font-bold uppercase tracking-wider hover:bg-[#988052] transition-colors shadow-lg rounded"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Yeni Cari Hesap</span>
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Toplam Alacak', value: kpis.totalReceivable, icon: TrendingUp,
            color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20',
            sub: `${filteredAccounts.filter(c => accountBalance(c) > 0).length} hesap`,
          },
          {
            label: 'Toplam Borç', value: kpis.totalPayable, icon: TrendingDown,
            color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20',
            sub: `${filteredAccounts.filter(c => accountBalance(c) < 0).length} hesap`,
          },
          {
            label: 'Net Cari Pozisyon', value: Math.abs(kpis.net), icon: BarChart3,
            color: kpis.net >= 0 ? 'text-[#B49A6A]' : 'text-rose-400',
            bg: kpis.net >= 0 ? 'bg-[#B49A6A]/10 border-[#B49A6A]/20' : 'bg-rose-500/10 border-rose-500/20',
            sub: kpis.net >= 0 ? 'Net Alacaklı' : 'Net Borçlu',
          },
          {
            label: 'Bekleyen Alacak', value: kpis.overdueCount, icon: AlertCircle,
            color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20',
            sub: 'Alacaklı hesap sayısı', isCnt: true,
          },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className={`p-5 border rounded-lg space-y-2 ${kpi.bg} bg-[#1C1B1A]`}>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] uppercase tracking-widest font-semibold ${kpi.color}`}>{kpi.label}</span>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div className={`font-serif text-2xl font-bold ${kpi.color}`}>
                {(kpi as any).isCnt ? kpi.value : `₺${fmt(kpi.value as number)}`}
              </div>
              <span className="text-[10px] text-[#5A5652]">{kpi.sub}</span>
            </div>
          );
        })}
      </div>

      {/* ── Filters & Search ── */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-[#1C1B1A] border border-[#2A2825] rounded-lg">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="w-3.5 h-3.5 text-[#5A5652] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari unvan, kod, vergi no veya telefon ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#242321] border border-[#3A3835] text-xs text-[#F8F5EF] placeholder-[#5A5652] focus:outline-none focus:border-[#B49A6A] rounded transition-colors"
          />
        </div>
        {/* Type filter */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2.5 bg-[#242321] border border-[#3A3835] text-xs text-[#E8DED1] focus:outline-none focus:border-[#B49A6A] rounded"
        >
          <option value="all">Tüm Türler</option>
          <option value="Tedarikçi">Tedarikçi</option>
          <option value="Toptancı">Toptancı</option>
          <option value="Kurumsal Müşteri">Kurumsal Müşteri</option>
          <option value="Müşteri">Müşteri</option>
        </select>
        {/* Balance filter */}
        <select
          value={filterBalance}
          onChange={(e) => setFilterBalance(e.target.value)}
          className="px-3 py-2.5 bg-[#242321] border border-[#3A3835] text-xs text-[#E8DED1] focus:outline-none focus:border-[#B49A6A] rounded"
        >
          <option value="all">Tüm Bakiyeler</option>
          <option value="receivable">Alacaklılar (Bize Borçlu)</option>
          <option value="payable">Borçlular (Onlara Borçluyuz)</option>
          <option value="zero">Dengede</option>
        </select>
        {/* Result count */}
        <div className="flex items-center gap-1.5 px-3 py-2 bg-[#242321] border border-[#3A3835] rounded text-xs text-[#8C857B] whitespace-nowrap shrink-0">
          <Users className="w-3.5 h-3.5" />
          <span>{filteredAccounts.length} hesap</span>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-[#1C1B1A] border border-[#2A2825] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#E8DED1]">
            <thead className="bg-[#171615] border-b border-[#2A2825]">
              <tr>
                <th className="p-4"><SortHeader field="code" label="Cari Kodu" /></th>
                <th className="p-4"><SortHeader field="title" label="Firma / Müşteri Unvanı" /></th>
                <th className="p-4 text-[#B49A6A] uppercase tracking-wider text-[10px] font-semibold">Tür</th>
                <th className="p-4 text-[#B49A6A] uppercase tracking-wider text-[10px] font-semibold">Vergi Bilgisi</th>
                <th className="p-4 text-[#B49A6A] uppercase tracking-wider text-[10px] font-semibold">Son İşlem</th>
                <th className="p-4"><SortHeader field="balance" label="Bakiye Durumu" /></th>
                <th className="p-4 text-right text-[#B49A6A] uppercase tracking-wider text-[10px] font-semibold">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-[#5A5652]">
                    <Users className="w-8 h-8 mx-auto mb-2 text-[#3A3835]" />
                    <p>Arama kriterlerine uyan cari hesap bulunamadı.</p>
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((c) => (
                  <CariRow
                    key={c.id}
                    c={c}
                    txs={cariTransactions}
                    onAddTx={() => openTx(c)}
                    onStatement={() => openStatement(c)}
                    onDelete={() => { deleteCariAccount(c.id); showToast('Cari hesap silindi.', 'info'); }}
                    onView={() => openDetail(c)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─────────────── MODAL: YENİ CARİ EKLE ─────────────── */}
      {isAddOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#1C1B1A] border border-[#B49A6A]/40 p-6 max-w-xl w-full text-[#F8F5EF] space-y-5 shadow-2xl rounded-lg my-8">
            <div className="flex justify-between items-center pb-3 border-b border-[#2A2825]">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#B49A6A]" />
                <h2 className="font-serif text-xl font-normal">Yeni Cari Hesap Tanımla</h2>
              </div>
              <button onClick={() => setIsAddOpen(false)} className="p-1.5 rounded hover:bg-[#242321] text-[#8C857B] hover:text-[#F8F5EF] transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCari} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8C857B] mb-1.5 uppercase tracking-wider text-[10px]">Cari Kodu *</label>
                  <input value={newCari.code} onChange={(e) => setNewCari(p => ({...p, code: e.target.value}))} required
                    className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] font-mono focus:outline-none focus:border-[#B49A6A] rounded" />
                </div>
                <div>
                  <label className="block text-[#8C857B] mb-1.5 uppercase tracking-wider text-[10px]">Cari Türü *</label>
                  <select value={newCari.type} onChange={(e) => setNewCari(p => ({...p, type: e.target.value as any}))}
                    className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:outline-none focus:border-[#B49A6A] rounded">
                    <option value="Tedarikçi">Tedarikçi</option>
                    <option value="Toptancı">Toptancı</option>
                    <option value="Kurumsal Müşteri">Kurumsal Müşteri</option>
                    <option value="Perakende Müşteri">Perakende Müşteri</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#8C857B] mb-1.5 uppercase tracking-wider text-[10px]">Firma / Şahıs Unvanı *</label>
                <input type="text" required placeholder="ör: Milano Silk Fabric S.p.A"
                  value={newCari.title} onChange={(e) => setNewCari(p => ({...p, title: e.target.value}))}
                  className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:outline-none focus:border-[#B49A6A] rounded" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8C857B] mb-1.5 uppercase tracking-wider text-[10px]">Vergi Dairesi</label>
                  <input value={newCari.taxOffice} onChange={(e) => setNewCari(p => ({...p, taxOffice: e.target.value}))}
                    className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:outline-none focus:border-[#B49A6A] rounded" />
                </div>
                <div>
                  <label className="block text-[#8C857B] mb-1.5 uppercase tracking-wider text-[10px]">Vergi / TC No</label>
                  <input value={newCari.taxNumber} onChange={(e) => setNewCari(p => ({...p, taxNumber: e.target.value}))}
                    className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] font-mono focus:outline-none focus:border-[#B49A6A] rounded" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8C857B] mb-1.5 uppercase tracking-wider text-[10px]">Telefon</label>
                  <input type="tel" value={newCari.phone} onChange={(e) => setNewCari(p => ({...p, phone: e.target.value}))}
                    placeholder="+90 5xx xxx xx xx"
                    className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:outline-none focus:border-[#B49A6A] rounded" />
                </div>
                <div>
                  <label className="block text-[#8C857B] mb-1.5 uppercase tracking-wider text-[10px]">E-Posta</label>
                  <input type="email" value={newCari.email} onChange={(e) => setNewCari(p => ({...p, email: e.target.value}))}
                    className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:outline-none focus:border-[#B49A6A] rounded" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8C857B] mb-1.5 uppercase tracking-wider text-[10px]">Şehir</label>
                  <input value={newCari.city} onChange={(e) => setNewCari(p => ({...p, city: e.target.value}))}
                    className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:outline-none focus:border-[#B49A6A] rounded" />
                </div>
                <div>
                  <label className="block text-[#8C857B] mb-1.5 uppercase tracking-wider text-[10px]">Açılış Bakiyesi (₺)</label>
                  <input type="number" value={newCari.balance} onChange={(e) => setNewCari(p => ({...p, balance: Number(e.target.value)}))} min={0}
                    className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] font-mono focus:outline-none focus:border-[#B49A6A] rounded" />
                </div>
              </div>

              <div>
                <label className="block text-[#8C857B] mb-1.5 uppercase tracking-wider text-[10px]">Adres</label>
                <input value={newCari.address} onChange={(e) => setNewCari(p => ({...p, address: e.target.value}))}
                  placeholder="Mahalle, cadde, kapı no"
                  className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:outline-none focus:border-[#B49A6A] rounded" />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#2A2825]">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 text-[#8C857B] hover:text-[#F8F5EF] text-xs rounded transition-colors">
                  İptal
                </button>
                <button type="submit" className="px-6 py-2.5 bg-[#B49A6A] text-[#1C1B1A] text-xs font-bold uppercase tracking-wider hover:bg-[#988052] transition-colors rounded">
                  Cari Hesap Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────── MODAL: HAREKET İŞLE ─────────────── */}
      {isTxOpen && selectedCari && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1C1B1A] border border-[#B49A6A]/40 p-6 max-w-md w-full text-[#F8F5EF] space-y-5 shadow-2xl rounded-lg">
            <div className="flex justify-between items-center pb-3 border-b border-[#2A2825]">
              <div>
                <h2 className="font-serif text-xl font-normal">Hareket İşle</h2>
                <p className="text-xs text-[#B49A6A] mt-0.5">{selectedCari.code} · {selectedCari.title}</p>
              </div>
              <button onClick={() => setIsTxOpen(false)} className="p-1.5 rounded hover:bg-[#242321] text-[#8C857B] hover:text-[#F8F5EF] transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current balance info */}
            <div className="p-3 bg-[#242321] border border-[#3A3835] rounded flex items-center justify-between">
              <span className="text-[10px] text-[#8C857B] uppercase tracking-wider">Mevcut Bakiye</span>
              <span className="font-serif font-bold text-[#B49A6A]">₺{fmt(accountBalance(selectedCari))}</span>
            </div>

            <form onSubmit={handleAddTx} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8C857B] mb-1.5 uppercase tracking-wider text-[10px]">Tarih *</label>
                  <input type="date" value={newTx.date} onChange={(e) => setNewTx(p => ({...p, date: e.target.value}))} required
                    className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:outline-none focus:border-[#B49A6A] rounded" />
                </div>
                <div>
                  <label className="block text-[#8C857B] mb-1.5 uppercase tracking-wider text-[10px]">Evrak No *</label>
                  <input type="text" required value={newTx.documentNo} onChange={(e) => setNewTx(p => ({...p, documentNo: e.target.value}))}
                    className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] font-mono focus:outline-none focus:border-[#B49A6A] rounded" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8C857B] mb-1.5 uppercase tracking-wider text-[10px]">İşlem Türü *</label>
                  <select value={newTx.type} onChange={(e) => setNewTx(p => ({...p, type: e.target.value as any}))}
                    className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:outline-none focus:border-[#B49A6A] rounded">
                    <option value="Fatura">Alım Faturası</option>
                    <option value="Tahsilat">Tahsilat (Nakit/Havale)</option>
                    <option value="Ödeme">Ödeme</option>
                    <option value="İrsaliye">İrsaliye</option>
                    <option value="Not">Bilgi Notu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#8C857B] mb-1.5 uppercase tracking-wider text-[10px]">Hareket Yönü *</label>
                  <select value={newTx.isDebt ? 'debt' : 'credit'} onChange={(e) => setNewTx(p => ({...p, isDebt: e.target.value === 'debt'}))}
                    className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:outline-none focus:border-[#B49A6A] rounded">
                    <option value="debt">Borç / Alacak (+)</option>
                    <option value="credit">Alacak / Ödeme (-)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#8C857B] mb-1.5 uppercase tracking-wider text-[10px]">Tutar (₺) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B49A6A] font-bold">₺</span>
                  <input type="number" required min="0.01" step="0.01"
                    value={newTx.amount} onChange={(e) => setNewTx(p => ({...p, amount: e.target.value}))}
                    placeholder="0,00"
                    className="w-full pl-8 pr-3 py-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] font-serif text-base font-bold focus:outline-none focus:border-[#B49A6A] rounded" />
                </div>
              </div>

              <div>
                <label className="block text-[#8C857B] mb-1.5 uppercase tracking-wider text-[10px]">Açıklama</label>
                <input type="text" value={newTx.description} onChange={(e) => setNewTx(p => ({...p, description: e.target.value}))}
                  placeholder="ör: İpek kumaş fatura ödemesi"
                  className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:outline-none focus:border-[#B49A6A] rounded" />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#2A2825]">
                <button type="button" onClick={() => setIsTxOpen(false)} className="px-4 py-2 text-[#8C857B] hover:text-[#F8F5EF] text-xs rounded transition-colors">
                  İptal
                </button>
                <button type="submit" className="px-6 py-2.5 bg-[#B49A6A] text-[#1C1B1A] text-xs font-bold uppercase tracking-wider hover:bg-[#988052] transition-colors rounded">
                  Hareketi Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────── MODAL: CARİ DETAY ─────────────── */}
      {isDetailOpen && selectedCari && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#1C1B1A] border border-[#2A2825] max-w-3xl w-full shadow-2xl rounded-lg my-8 overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between p-6 bg-[#171615] border-b border-[#2A2825]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#B49A6A]/15 border border-[#B49A6A]/40 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-[#B49A6A]" />
                </div>
                <div>
                  <h2 className="font-serif text-xl text-[#F8F5EF]">{selectedCari.title}</h2>
                  <p className="text-xs text-[#B49A6A] font-mono mt-0.5">{selectedCari.code}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 border rounded-full mt-1 inline-block ${(TYPE_BADGE[selectedCari.type] ?? TYPE_BADGE['Müşteri']).bg}`}>
                    {selectedCari.type}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { handleExportTxCSV(selectedCari); }} className="p-2 hover:bg-[#242321] rounded text-[#8C857B] hover:text-[#B49A6A] transition-colors" title="CSV İndir">
                  <Download className="w-4 h-4" />
                </button>
                <button onClick={() => { setIsDetailOpen(false); openStatement(selectedCari); }} className="p-2 hover:bg-[#242321] rounded text-[#8C857B] hover:text-[#F8F5EF] transition-colors" title="Ekstre">
                  <Printer className="w-4 h-4" />
                </button>
                <button onClick={() => setIsDetailOpen(false)} className="p-2 hover:bg-[#242321] rounded text-[#8C857B] hover:text-[#F8F5EF] transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 border-b border-[#2A2825]">
              {[
                { icon: Phone, label: 'Telefon', value: selectedCari.phone || '—' },
                { icon: Mail, label: 'E-Posta', value: selectedCari.email || '—' },
                { icon: MapPin, label: 'Adres', value: `${selectedCari.city}${selectedCari.address ? ', ' + selectedCari.address : ''}` },
                { icon: CreditCard, label: 'Vergi No', value: `${selectedCari.taxOffice || ''} / ${selectedCari.taxNumber || '—'}` },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[#8C857B] text-[10px] uppercase tracking-wider">
                      <Icon className="w-3 h-3" /> {item.label}
                    </div>
                    <p className="text-xs text-[#E8DED1] break-all">{item.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Balance Summary */}
            <div className="grid grid-cols-3 gap-4 p-6 border-b border-[#2A2825] bg-[#171615]">
              {(() => {
                const txs = cariTransactions.filter((t) => t.cariId === selectedCari.id);
                const debt = txs.filter((t) => t.isDebt).reduce((s, t) => s + t.amount, 0);
                const credit = txs.filter((t) => !t.isDebt).reduce((s, t) => s + t.amount, 0);
                const net = debt - credit + selectedCari.balance;
                return [
                  { label: 'Toplam Borç', value: debt + selectedCari.balance, color: 'text-amber-400' },
                  { label: 'Toplam Alacak', value: credit, color: 'text-emerald-400' },
                  { label: 'Net Bakiye', value: net, color: net > 0 ? 'text-[#B49A6A]' : 'text-emerald-400' },
                ].map((item) => (
                  <div key={item.label} className="text-center p-3 bg-[#1C1B1A] rounded border border-[#2A2825]">
                    <div className="text-[10px] text-[#8C857B] uppercase tracking-wider mb-1">{item.label}</div>
                    <div className={`font-serif text-lg font-bold ${item.color}`}>₺{fmt(item.value)}</div>
                  </div>
                ));
              })()}
            </div>

            {/* Transactions */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-[#B49A6A] uppercase tracking-wider">Hesap Hareketleri</h3>
                <button onClick={() => { setIsDetailOpen(false); openTx(selectedCari); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#B49A6A] text-[#1C1B1A] text-[10px] font-bold hover:bg-[#988052] transition-colors rounded">
                  <Plus className="w-3 h-3" /> Hareket Ekle
                </button>
              </div>
              <div className="overflow-x-auto max-h-60 overflow-y-auto border border-[#2A2825] rounded">
                <TxTable txs={cariTransactions.filter((t) => t.cariId === selectedCari.id)} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────── MODAL: YAZDIRILABILIR EKSTRE ─────────────── */}
      {isStatementOpen && selectedCari && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#FFFFFF] text-[#242321] p-8 sm:p-10 max-w-3xl w-full shadow-2xl space-y-6 my-8 border border-[#E6DFD5] rounded print:shadow-none print:rounded-none" id="cari-ekstre">

            {/* Ekstre Header */}
            <div className="flex items-start justify-between pb-5 border-b-2 border-[#242321]">
              <div>
                <div className="flex items-center gap-3">
                  <img src="/logo.png" alt="Vera Eşarp" className="h-10 w-auto object-contain" />
                  <div>
                    <h1 className="font-serif text-2xl font-bold tracking-widest text-[#242321] uppercase">VERA EŞARP</h1>
                    <span className="text-[9px] text-[#B49A6A] tracking-[0.2em] uppercase font-semibold block">Cari Hesap Ekstresi & Mutabakat Formu</span>
                  </div>
                </div>
              </div>
              <div className="text-right text-xs text-[#5A5652]">
                <p className="font-bold text-[#242321] font-mono">{selectedCari.code}</p>
                <p>Tarih: {nowDisplay()}</p>
                <p className="text-[10px] mt-1">Vera Eşarp Tekstil A.Ş.</p>
                <p className="text-[10px]">Lalapaşa Mah. Pelit Meydanı Cad. No:14</p>
                <p className="text-[10px]">Yakutiye / ERZURUM</p>
              </div>
            </div>

            {/* Cari Info */}
            <div className="grid grid-cols-2 gap-6 text-xs bg-[#F8F5EF] p-4 border border-[#E6DFD5] rounded">
              <div>
                <h4 className="font-bold text-[10px] uppercase tracking-wider text-[#242321] mb-2">Cari Ünvan</h4>
                <p className="font-serif text-base font-semibold">{selectedCari.title}</p>
                <p className="text-[#5A5652] mt-1">{selectedCari.city}{selectedCari.address ? `, ${selectedCari.address}` : ''}</p>
                <p className="text-[#5A5652]">{selectedCari.phone}</p>
              </div>
              <div>
                <h4 className="font-bold text-[10px] uppercase tracking-wider text-[#242321] mb-2">Vergi Bilgileri</h4>
                <p>Vergi Dairesi: <strong>{selectedCari.taxOffice || '—'}</strong></p>
                <p>Vergi / TC No: <strong className="font-mono">{selectedCari.taxNumber || '—'}</strong></p>
                <p className="mt-2 font-semibold text-[#B49A6A] font-serif">
                  Net Bakiye: ₺{fmt(accountBalance(selectedCari))}
                  <span className="text-xs font-sans ml-1">({accountBalance(selectedCari) > 0 ? 'ALACAK' : 'BORÇ'})</span>
                </p>
              </div>
            </div>

            {/* Transactions Table */}
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-[#242321] text-[#242321] font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-2.5">Tarih</th>
                  <th className="py-2.5">Evrak No</th>
                  <th className="py-2.5">Tür</th>
                  <th className="py-2.5">Açıklama</th>
                  <th className="py-2.5 text-right">Borç (TL)</th>
                  <th className="py-2.5 text-right">Alacak (TL)</th>
                  <th className="py-2.5 text-right">Bakiye</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6DFD5]">
                {(() => {
                  let running = selectedCari.balance;
                  const txs = cariTransactions.filter((t) => t.cariId === selectedCari.id);
                  if (txs.length === 0) return (
                    <tr><td colSpan={7} className="py-6 text-center text-[#8C857B]">Bu cari hesaba ait hareket bulunmuyor.</td></tr>
                  );
                  return txs.map((tx) => {
                    if (tx.isDebt) running += tx.amount;
                    else running -= tx.amount;
                    return (
                      <tr key={tx.id} className="text-[11px]">
                        <td className="py-2 text-[#5A5652]">{tx.date}</td>
                        <td className="py-2 font-mono font-bold">{tx.documentNo}</td>
                        <td className="py-2">{tx.type}</td>
                        <td className="py-2 text-[#5A5652]">{tx.description}</td>
                        <td className="py-2 text-right font-semibold">{tx.isDebt ? `₺${fmt(tx.amount)}` : '—'}</td>
                        <td className="py-2 text-right font-semibold text-emerald-700">{!tx.isDebt ? `₺${fmt(tx.amount)}` : '—'}</td>
                        <td className={`py-2 text-right font-bold ${running >= 0 ? 'text-[#242321]' : 'text-emerald-700'}`}>₺{fmt(Math.abs(running))}</td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[#242321] font-bold text-[11px]">
                  <td colSpan={4} className="py-3 text-right uppercase tracking-wider">Kapanış Bakiyesi:</td>
                  <td colSpan={3} className="py-3 text-right text-base font-serif">
                    ₺{fmt(accountBalance(selectedCari))}
                    <span className="text-xs ml-1 font-sans">{accountBalance(selectedCari) > 0 ? 'ALACAK' : 'BORÇ'}</span>
                  </td>
                </tr>
              </tfoot>
            </table>

            {/* Imza Alanı */}
            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-[#E6DFD5]">
              <div className="text-center text-xs">
                <div className="border-t border-[#242321] pt-2 mt-8">Vera Eşarp Yetkilisi İmza / Kaşe</div>
              </div>
              <div className="text-center text-xs">
                <div className="border-t border-[#242321] pt-2 mt-8">{selectedCari.title} Yetkilisi İmza / Kaşe</div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-between items-center pt-4 border-t border-[#E6DFD5] print:hidden">
              <div className="flex items-center gap-2">
                <button onClick={() => handleExportTxCSV(selectedCari)}
                  className="flex items-center gap-1.5 px-4 py-2 border border-[#E6DFD5] text-[#5A5652] text-xs font-semibold hover:border-[#242321] transition-colors rounded">
                  <Download className="w-3.5 h-3.5" />CSV İndir
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsStatementOpen(false)}
                  className="px-4 py-2 text-xs text-[#8C857B] hover:text-[#242321] font-semibold rounded transition-colors">
                  Kapat
                </button>
                <button onClick={() => window.print()}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#242321] text-[#F8F5EF] text-xs font-bold uppercase tracking-wider hover:bg-[#B49A6A] transition-colors rounded">
                  <Printer className="w-4 h-4" />
                  Yazdır / PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
