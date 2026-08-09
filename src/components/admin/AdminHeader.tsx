'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Download, Plus, X, CheckCheck, Trash2, ShoppingBag, AlertTriangle, Info } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useAdminNotifications, AdminNotification } from '@/hooks/useAdminNotifications';
import { useAuth } from '@/context/AuthContext';

interface AdminHeaderProps {
  onOpenProductModal: () => void;
  onSearch: (query: string) => void;
}

function timeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s önce`;
  if (diff < 3600) return `${Math.floor(diff / 60)}dk önce`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}sa önce`;
  return `${Math.floor(diff / 86400)}g önce`;
}

function NotificationIcon({ type }: { type: AdminNotification['type'] }) {
  if (type === 'order') return <ShoppingBag className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
  if (type === 'stock') return <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
  return <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
}

function borderColor(type: AdminNotification['type']) {
  if (type === 'order') return 'border-emerald-500';
  if (type === 'stock') return 'border-amber-500';
  return 'border-blue-500';
}

export default function AdminHeader({ onOpenProductModal, onSearch }: AdminHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [now, setNow] = useState(Date.now());
  const panelRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();
  const { user } = useAuth();
  const { notifications, unreadCount, markAllRead, clearAll } = useAdminNotifications();

  // Timestamp'leri her 30 saniyede güncelle
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  // Panel dışına tıklayınca kapat
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const handleExportCSV = () => {
    showToast('Satış raporu CSV formatında dışa aktarıldı.', 'success');
  };

  // Kullanıcı adının baş harfleri
  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'VA';

  return (
    <header className="bg-[#1C1B1A] border-b border-[#2A2825] px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-30">
      {/* Search */}
      <div className="relative w-full md:w-96">
        <input
          type="text"
          placeholder="Sipariş no, müşteri adı veya SKU ara..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); onSearch(e.target.value); }}
          className="w-full py-2.5 px-4 pr-10 bg-[#242321] border border-[#3A3835] text-xs text-[#F8F5EF] placeholder-[#8C857B] focus:outline-none focus:border-[#B49A6A]"
        />
        <Search className="w-4 h-4 text-[#8C857B] absolute right-3 top-1/2 -translate-y-1/2" />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 w-full md:w-auto justify-end">
        {/* Export */}
        <button
          onClick={handleExportCSV}
          className="px-3.5 py-2 bg-[#242321] border border-[#3A3835] text-[#E8DED1] text-xs font-semibold uppercase tracking-wider hover:border-[#B49A6A] hover:text-[#B49A6A] transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Rapor İndir</span>
        </button>

        {/* Add Product */}
        <button
          onClick={onOpenProductModal}
          className="px-4 py-2 bg-[#B49A6A] text-[#F8F5EF] text-xs font-semibold uppercase tracking-wider hover:bg-[#988052] transition-colors flex items-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Ürün</span>
        </button>

        {/* Notifications Bell */}
        <div className="relative" ref={panelRef}>
          <button
            id="admin-notifications-bell"
            onClick={handleOpen}
            className="p-2.5 bg-[#242321] border border-[#3A3835] text-[#E8DED1] hover:text-[#B49A6A] transition-colors relative"
            aria-label="Bildirimler"
          >
            <Bell className={`w-4 h-4 ${unreadCount > 0 ? 'text-[#B49A6A]' : ''}`} />
            {unreadCount > 0 && (
              <>
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center z-10">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 animate-ping opacity-60" />
              </>
            )}
          </button>

          {/* Notification Panel */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-96 bg-[#1C1B1A] border border-[#B49A6A]/40 shadow-2xl z-50 flex flex-col max-h-[520px]">
              {/* Panel Header */}
              <div className="flex justify-between items-center px-4 py-3 border-b border-[#2A2825] shrink-0">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#B49A6A]" />
                  <h4 className="font-serif font-semibold text-[#B49A6A] text-sm">Sistem Bildirimleri</h4>
                  {unreadCount > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold">
                      {unreadCount} Yeni
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

              {/* Notification List */}
              <div className="overflow-y-auto flex-1">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center space-y-2">
                    <Bell className="w-8 h-8 text-[#3A3835] mx-auto" />
                    <p className="text-xs text-[#8C857B]">Henüz bildirim yok</p>
                    <p className="text-[10px] text-[#5A5652]">Yeni sipariş geldiğinde burada görünecek</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#2A2825]">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`px-4 py-3 flex gap-3 items-start transition-colors ${
                          notif.isRead ? 'opacity-60' : 'bg-[#242321]/40'
                        }`}
                      >
                        {/* Left accent + icon */}
                        <div className={`mt-0.5 pl-0 border-l-2 ${borderColor(notif.type)} pl-2 flex flex-col gap-1`}>
                          <NotificationIcon type={notif.type} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-semibold leading-snug ${notif.isRead ? 'text-[#8C857B]' : 'text-[#F8F5EF]'}`}>
                            {notif.title}
                          </p>
                          <p className="text-[10px] text-[#8C857B] mt-0.5 leading-relaxed">{notif.body}</p>
                          <p className="text-[9px] text-[#5A5652] mt-1">
                            {timeAgo(new Date(notif.timestamp))}
                          </p>
                        </div>
                        {!notif.isRead && (
                          <div className="w-2 h-2 rounded-full bg-[#B49A6A] shrink-0 mt-1.5" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Panel Footer */}
              {notifications.length > 0 && (
                <div className="px-4 py-2.5 border-t border-[#2A2825] text-center shrink-0">
                  <p className="text-[10px] text-[#5A5652]">
                    Son {notifications.length} bildirim gösteriliyor · Gerçek zamanlı izleme aktif
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1.5 animate-pulse" />
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Admin Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-[#2A2825]">
          <div className="w-9 h-9 rounded-full bg-[#B49A6A]/20 border border-[#B49A6A] flex items-center justify-center text-[#B49A6A] font-semibold text-xs">
            {initials}
          </div>
          <div className="hidden sm:block text-left text-xs">
            <span className="font-semibold text-[#F8F5EF] block leading-none">{user?.name || 'Vera Admin'}</span>
            <span className="text-[10px] text-[#8C857B] block mt-0.5">Chief E-Commerce Officer</span>
          </div>
        </div>
      </div>
    </header>
  );
}
