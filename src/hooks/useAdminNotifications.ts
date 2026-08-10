'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useData } from '@/context/DataContext';

export interface AdminNotification {
  id: string;
  type: 'order' | 'stock' | 'support' | 'system' | 'payment' | 'return';
  title: string;
  body: string;
  timestamp: Date;
  isRead: boolean;
  link?: string;
}

// ─── Web Audio ile ses üret ───
function playNotificationSound(type: AdminNotification['type'] = 'order') {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (type === 'order' || type === 'payment') {
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sine'; osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.28, ctx.currentTime + i * 0.13);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.13 + 0.35);
        osc.start(ctx.currentTime + i * 0.13);
        osc.stop(ctx.currentTime + i * 0.13 + 0.45);
      });
    } else if (type === 'stock' || type === 'return') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'support') {
      // İki adımlı dikkat sesi
      [660, 880].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'triangle'; osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.18);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.18 + 0.25);
        osc.start(ctx.currentTime + i * 0.18);
        osc.stop(ctx.currentTime + i * 0.18 + 0.3);
      });
    } else {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine'; osc.frequency.value = 600;
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.3);
    }
  } catch {}
}

// ─── Web Notification API (tarayıcı/OS bildirimi) ───
async function sendWebNotification(title: string, body: string, tag: string) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  try {
    let perm = Notification.permission;
    if (perm === 'default') perm = await Notification.requestPermission();
    if (perm !== 'granted') return;
    new Notification(title, {
      body,
      icon: '/apple-touch-icon.png',
      badge: '/favicon.ico',
      tag,
      requireInteraction: false,
    });
  } catch {}
}

// ─── Service Worker kaydı ───
function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
}

const STORAGE_KEY = 'veraesarp_admin_notifications_v2';
const LOW_STOCK_THRESHOLD = 15;

export function useAdminNotifications() {
  const { orders, products } = useData();
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const prevOrderCount = useRef<number | null>(null);
  const prevLowStockIds = useRef<Set<string>>(new Set());
  const isFirstRun = useRef(true);
  const prevOrderIds = useRef<Set<string>>(new Set());

  // SW kaydı
  useEffect(() => { registerServiceWorker(); }, []);

  // localStorage'dan geçmişi yükle
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: AdminNotification[] = JSON.parse(saved);
        setNotifications(parsed.map((n) => ({ ...n, timestamp: new Date(n.timestamp) })));
      }
    } catch {}
  }, []);

  const addNotification = useCallback(
    (notif: Omit<AdminNotification, 'id' | 'timestamp' | 'isRead'>, withSound = true) => {
      const newNotif: AdminNotification = {
        ...notif,
        id: `notif-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        timestamp: new Date(),
        isRead: false,
      };

      setNotifications((prev) => {
        const updated = [newNotif, ...prev].slice(0, 100);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
        return updated;
      });

      if (withSound) playNotificationSound(notif.type);

      // OS/tarayıcı bildirimi
      sendWebNotification(newNotif.title, newNotif.body, newNotif.id);
    },
    []
  );

  // Yeni sipariş izle
  useEffect(() => {
    if (orders.length === 0) return;

    if (isFirstRun.current) {
      prevOrderCount.current = orders.length;
      prevOrderIds.current = new Set(orders.map((o) => o.id));
      const lowIds = new Set(products.filter((p) => p.stock <= LOW_STOCK_THRESHOLD).map((p) => p.id));
      prevLowStockIds.current = lowIds;
      isFirstRun.current = false;
      return;
    }

    // Yeni siparişleri tespit et (ID bazlı - daha güvenilir)
    const currentIds = new Set(orders.map((o) => o.id));
    const newOrders = orders.filter((o) => !prevOrderIds.current.has(o.id));

    newOrders.forEach((order) => {
      // Ödeme yöntemi bazlı bildirim
      if (order.paymentMethod?.toLowerCase().includes('kapı') || order.paymentMethod?.toLowerCase().includes('havale')) {
        addNotification({
          type: 'payment',
          title: `💳 Ödeme Onayı Bekleniyor: ${order.orderNumber}`,
          body: `${order.customerName} — ${order.paymentMethod} — ₺${order.total.toLocaleString('tr-TR')}`,
          link: '/admin?tab=orders',
        });
      } else {
        addNotification({
          type: 'order',
          title: `🛍 Yeni Sipariş Geldi! ${order.orderNumber}`,
          body: `${order.customerName} — ₺${order.total.toLocaleString('tr-TR')} · ${order.items.length} ürün`,
          link: '/admin?tab=orders',
        });
      }
    });

    prevOrderIds.current = currentIds;
    prevOrderCount.current = orders.length;
  }, [orders, addNotification, products]);

  // Kritik stok izle
  useEffect(() => {
    if (isFirstRun.current) return;

    const currentLowStock = products.filter((p) => p.stock <= LOW_STOCK_THRESHOLD);
    currentLowStock.forEach((p) => {
      if (!prevLowStockIds.current.has(p.id)) {
        const isUrgent = p.stock <= 3;
        addNotification({
          type: 'stock',
          title: isUrgent
            ? `🚨 ACİL: ${p.name} Tükeniyor!`
            : `⚠️ Kritik Stok: ${p.name}`,
          body: isUrgent
            ? `Sadece ${p.stock} adet kaldı — acil yenileme gerekli!`
            : `${p.stock} adet kaldı — yenileme önerilir.`,
          link: '/admin?tab=products',
        });
        prevLowStockIds.current.add(p.id);
      }
    });
  }, [products, addNotification]);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, isRead: true }));
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => n.id === id ? { ...n, isRead: true } : n);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }, []);

  // Destek talebi simüle et (test amaçlı — gerçek entegrasyonda API'den gelecek)
  const addSupportRequest = useCallback((customerName: string, subject: string) => {
    addNotification({
      type: 'support',
      title: `💬 Destek Talebi: ${customerName}`,
      body: subject,
      link: '/admin?tab=support',
    });
  }, [addNotification]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const unreadByType = {
    order: notifications.filter((n) => !n.isRead && n.type === 'order').length,
    stock: notifications.filter((n) => !n.isRead && n.type === 'stock').length,
    support: notifications.filter((n) => !n.isRead && n.type === 'support').length,
    payment: notifications.filter((n) => !n.isRead && n.type === 'payment').length,
    return: notifications.filter((n) => !n.isRead && n.type === 'return').length,
    system: notifications.filter((n) => !n.isRead && n.type === 'system').length,
  };

  return { notifications, unreadCount, unreadByType, markAllRead, markRead, clearAll, addNotification, addSupportRequest };
}
