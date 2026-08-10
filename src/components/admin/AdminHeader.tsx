'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Search, Bell, Download, Plus, X, CheckCheck, Trash2,
  ShoppingBag, AlertTriangle, Info, MessageCircle, CreditCard,
  RotateCcw, Smartphone, Monitor, Settings, Filter,
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useAdminNotifications, AdminNotification } from '@/hooks/useAdminNotifications';
import { useAuth } from '@/context/AuthContext';

interface AdminHeaderProps {
  onOpenProductModal: () => void;
  onSearch: (query: string) => void;
}

type FilterTab = 'all' | 'order' | 'stock' | 'support' | 'payment' | 'return' | 'system';

function timeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}sn önce`;
  if (diff < 3600) return `${Math.floor(diff / 60)}dk önce`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}sa önce`;
  return `${Math.floor(diff / 86400)}g önce`;
}

const TYPE_META: Record<AdminNotification['type'], { icon: React.ElementType; color: string; bg: string; border: string; label: string }> = {
  order: { icon: ShoppingBag, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500', label: 'Sipariş' },
  stock: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500', label: 'Stok' },
  support: { icon: MessageCircle, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500', label: 'Destek' },
  payment: { icon: CreditCard, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500', label: 'Ödeme' },
  return: { icon: RotateCcw, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500', label: 'İade' },
  system: { icon: Info, color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500', label: 'Sistem' },
};

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'Tümü' },
  { id: 'order', label: 'Sipariş' },
  { id: 'support', label: 'Destek' },
  { id: 'stock', label: 'Stok' },
  { id: 'payment', label: 'Ödeme' },
  { id: 'return', label: 'İade' },
];

// PWA install prompt
function usePWAInstall() {
  const [prompt, setPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = useCallback(async () => {
    if (!prompt) return;
    prompt.prompt();
    const result = await prompt.userChoice;
    if (result.outcome === 'accepted') {
      setIsInstalled(true);
      setPrompt(null);
    }
  }, [prompt]);

  return { canInstall: !!prompt && !isInstalled, isInstalled, install };
}

export default function AdminHeader({ onOpenProductModal, onSearch }: AdminHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [, forceUpdate] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();
  const { user } = useAuth();
  const { notifications, unreadCount, unreadByType, markAllRead, markRead, clearAll } = useAdminNotifications();
  const { canInstall, isInstalled, install } = usePWAInstall();

  // Timestamp refresh every 30s
  useEffect(() => {
    const timer = setInterval(() => forceUpdate((n) => n + 1), 30000);
    return () => clearInterval(timer);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleExportCSV = () => showToast('Satış raporu CSV formatında dışa aktarıldı.', 'success');

  const filteredNotifications = filterTab === 'all'
    ? notifications
    : notifications.filter((n) => n.type === filterTab);

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'VA';

  return (
    <header className="bg-[#1C1B1A] border-b border-[#2A2825] px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 sticky top-0 z-30 shadow-lg">

      {/* ─── Search ─── */}
      <div className="relative w-full sm:w-96">
        <input
          type="text"
          placeholder="Sipariş no, müşteri, SKU ara..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); onSearch(e.target.value); }}
          className="w-full py-2.5 px-4 pr-10 bg-[#242321] border border-[#3A3835] text-xs text-[#F8F5EF] placeholder-[#5A5652] focus:outline-none focus:border-[#B49A6A] rounded transition-colors"
        />
        <Search className="w-3.5 h-3.5 text-[#5A5652] absolute right-3 top-1/2 -translate-y-1/2" />
      </div>

      {/* ─── Right Actions ─── */}
      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">

        {/* PWA Install Button */}
        {canInstall && (
          <button
            onClick={install}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-[#B49A6A]/10 border border-[#B49A6A]/40 text-[#B49A6A] text-[11px] font-semibold hover:bg-[#B49A6A]/20 transition-all rounded group"
            title="Uygulamayı Kur"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Uygulama Kur</span>
          </button>
        )}
        {canInstall && (
          <button
            onClick={install}
            className="flex sm:hidden items-center gap-1.5 p-2 bg-[#B49A6A]/10 border border-[#B49A6A]/40 text-[#B49A6A] hover:bg-[#B49A6A]/20 transition-all rounded"
            title="Uygulamayı Kur"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Export */}
        <button
          onClick={handleExportCSV}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-[#242321] border border-[#3A3835] text-[#E8DED1] text-xs font-semibold hover:border-[#B49A6A] hover:text-[#B49A6A] transition-colors rounded"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Rapor</span>
        </button>

        {/* Add Product */}
        <button
          onClick={onOpenProductModal}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#B49A6A] text-[#1C1B1A] text-xs font-bold hover:bg-[#988052] transition-colors rounded shadow-md"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Yeni Ürün</span>
          <span className="sm:hidden">Ekle</span>
        </button>

        {/* ─── Notifications Bell ─── */}
        <div className="relative" ref={panelRef}>
          <button
            id="admin-notifications-bell"
            onClick={() => setIsOpen((prev) => !prev)}
            className={`relative p-2.5 border rounded transition-all ${
              unreadCount > 0
                ? 'bg-[#B49A6A]/10 border-[#B49A6A]/50 text-[#B49A6A]'
                : 'bg-[#242321] border-[#3A3835] text-[#E8DED1] hover:border-[#B49A6A] hover:text-[#B49A6A]'
            }`}
            aria-label="Bildirimler"
          >
            <Bell className={`w-4 h-4 ${unreadCount > 0 ? 'animate-[wiggle_0.5s_ease-in-out]' : ''}`} />
            {unreadCount > 0 && (
              <>
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center z-10 tabular-nums">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
                <span className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] rounded-full bg-rose-500 animate-ping opacity-60" />
              </>
            )}
          </button>

          {/* ─── Notification Panel ─── */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-[340px] sm:w-[400px] bg-[#1C1B1A] border border-[#B49A6A]/30 shadow-2xl z-50 flex flex-col rounded-lg overflow-hidden max-h-[80vh]">

              {/* Panel Header */}
              <div className="flex justify-between items-center px-4 py-3 border-b border-[#2A2825] shrink-0 bg-[#171615]">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#B49A6A]" />
                  <h4 className="font-semibold text-[#F8F5EF] text-sm">Bildirimler</h4>
                  {unreadCount > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold">
                      {unreadCount} yeni
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="p-1.5 hover:bg-[#242321] rounded transition-colors text-[#8C857B] hover:text-emerald-400"
                      title="Tümünü okundu işaretle"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="p-1.5 hover:bg-[#242321] rounded transition-colors text-[#8C857B] hover:text-rose-400"
                      title="Tüm bildirimleri temizle"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 hover:bg-[#242321] rounded transition-colors text-[#8C857B] hover:text-[#F8F5EF]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* ─── Summary Badges ─── */}
              {(unreadByType.order > 0 || unreadByType.stock > 0 || unreadByType.support > 0 || unreadByType.payment > 0) && (
                <div className="flex flex-wrap gap-1.5 px-4 py-2.5 border-b border-[#2A2825] bg-[#1A1918] shrink-0">
                  {unreadByType.order > 0 && (
                    <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 font-semibold">
                      <ShoppingBag className="w-2.5 h-2.5" /> {unreadByType.order} Sipariş
                    </span>
                  )}
                  {unreadByType.stock > 0 && (
                    <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/25 font-semibold">
                      <AlertTriangle className="w-2.5 h-2.5" /> {unreadByType.stock} Stok
                    </span>
                  )}
                  {unreadByType.support > 0 && (
                    <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/25 font-semibold">
                      <MessageCircle className="w-2.5 h-2.5" /> {unreadByType.support} Destek
                    </span>
                  )}
                  {unreadByType.payment > 0 && (
                    <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/25 font-semibold">
                      <CreditCard className="w-2.5 h-2.5" /> {unreadByType.payment} Ödeme
                    </span>
                  )}
                  {unreadByType.return > 0 && (
                    <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/25 font-semibold">
                      <RotateCcw className="w-2.5 h-2.5" /> {unreadByType.return} İade
                    </span>
                  )}
                </div>
              )}

              {/* ─── Filter Tabs ─── */}
              <div className="flex gap-0.5 px-3 py-2 border-b border-[#2A2825] shrink-0 overflow-x-auto scrollbar-none">
                {FILTER_TABS.map((tab) => {
                  const count = tab.id === 'all' ? unreadCount : (unreadByType as any)[tab.id] ?? 0;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setFilterTab(tab.id)}
                      className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold rounded whitespace-nowrap transition-all ${
                        filterTab === tab.id
                          ? 'bg-[#B49A6A] text-[#1C1B1A]'
                          : 'text-[#8C857B] hover:text-[#F8F5EF] hover:bg-[#242321]'
                      }`}
                    >
                      {tab.label}
                      {count > 0 && (
                        <span className={`rounded-full px-1 text-[9px] font-bold ${filterTab === tab.id ? 'bg-[#1C1B1A]/30 text-[#1C1B1A]' : 'bg-[#3A3835] text-[#E8DED1]'}`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* ─── Notification List ─── */}
              <div className="overflow-y-auto flex-1 divide-y divide-[#2A2825]">
                {filteredNotifications.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-[#242321] flex items-center justify-center mx-auto">
                      <Bell className="w-5 h-5 text-[#3A3835]" />
                    </div>
                    <p className="text-xs text-[#5A5652] font-medium">
                      {filterTab === 'all' ? 'Henüz bildirim yok' : `${FILTER_TABS.find(t => t.id === filterTab)?.label} bildirimi yok`}
                    </p>
                    <p className="text-[10px] text-[#3A3835]">
                      Yeni {filterTab === 'all' ? 'sipariş / destek talebi' : FILTER_TABS.find(t => t.id === filterTab)?.label.toLowerCase()} geldiğinde burada görünecek
                    </p>
                  </div>
                ) : (
                  filteredNotifications.map((notif) => {
                    const meta = TYPE_META[notif.type];
                    const Icon = meta.icon;
                    return (
                      <div
                        key={notif.id}
                        onClick={() => markRead(notif.id)}
                        className={`px-4 py-3 flex gap-3 items-start cursor-pointer transition-all hover:bg-[#242321]/60 ${
                          notif.isRead ? 'opacity-50' : ''
                        }`}
                      >
                        {/* Type Icon */}
                        <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5 ${meta.bg} border ${meta.border}/30`}>
                          <Icon className={`w-3.5 h-3.5 ${meta.color}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-[11px] font-semibold leading-snug ${notif.isRead ? 'text-[#8C857B]' : 'text-[#F8F5EF]'}`}>
                              {notif.title}
                            </p>
                            {!notif.isRead && (
                              <div className="w-2 h-2 rounded-full bg-[#B49A6A] shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-[10px] text-[#8C857B] mt-0.5 leading-relaxed">{notif.body}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className={`text-[9px] px-1.5 py-0.5 rounded ${meta.bg} ${meta.color} font-semibold`}>
                              {meta.label}
                            </span>
                            <span className="text-[9px] text-[#5A5652]">{timeAgo(new Date(notif.timestamp))}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* ─── Panel Footer ─── */}
              <div className="px-4 py-2.5 border-t border-[#2A2825] bg-[#171615] shrink-0">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-[#5A5652] flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Gerçek zamanlı izleme aktif
                  </p>
                  <span className="text-[10px] text-[#5A5652]">{filteredNotifications.length} bildirim</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ─── Admin Profile ─── */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-[#2A2825]">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#B49A6A]/15 border border-[#B49A6A]/60 flex items-center justify-center text-[#B49A6A] font-bold text-xs shrink-0">
            {initials}
          </div>
          <div className="hidden md:block text-left">
            <span className="font-semibold text-[#F8F5EF] block text-xs leading-none">{user?.name || 'Vera Admin'}</span>
            <span className="text-[10px] text-[#5A5652] block mt-0.5">Yönetici</span>
          </div>
        </div>
      </div>
    </header>
  );
}
