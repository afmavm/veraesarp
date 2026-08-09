'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useData } from '@/context/DataContext';

export interface AdminNotification {
  id: string;
  type: 'order' | 'stock' | 'system';
  title: string;
  body: string;
  timestamp: Date;
  isRead: boolean;
}

// Web Audio API ile bildirim sesi üret (harici dosya gerektirmez)
function playNotificationSound(type: 'order' | 'stock' | 'system' = 'order') {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

    if (type === 'order') {
      // Yukarı çıkan, mutlu bir ding-dong
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.3);
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.4);
      });
    } else if (type === 'stock') {
      // Dikkat çekici kısa bip
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } else {
      // Genel bildirim
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = 600;
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch {}
}

const STORAGE_KEY = 'veraesarp_admin_notifications';
const LOW_STOCK_THRESHOLD = 15;

export function useAdminNotifications() {
  const { orders, products } = useData();
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const prevOrderCount = useRef<number | null>(null);
  const prevLowStockIds = useRef<Set<string>>(new Set());
  const isFirstRun = useRef(true);

  // LocalStorage'dan geçmiş bildirimleri yükle
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: AdminNotification[] = JSON.parse(saved);
        // Timestamp'leri Date'e dönüştür
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
        const updated = [newNotif, ...prev].slice(0, 50); // max 50 bildirim sakla
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {}
        return updated;
      });

      if (withSound) {
        playNotificationSound(notif.type);
      }
    },
    []
  );

  // Yeni sipariş izle
  useEffect(() => {
    if (orders.length === 0) return;

    if (isFirstRun.current) {
      prevOrderCount.current = orders.length;
      // İlk yüklemede stok durumunu kaydet
      const lowIds = new Set(
        products.filter((p) => p.stock <= LOW_STOCK_THRESHOLD).map((p) => p.id)
      );
      prevLowStockIds.current = lowIds;
      isFirstRun.current = false;
      return;
    }

    if (prevOrderCount.current !== null && orders.length > prevOrderCount.current) {
      const newOrders = orders.slice(0, orders.length - prevOrderCount.current);
      newOrders.forEach((order) => {
        addNotification({
          type: 'order',
          title: `🛍 Yeni Sipariş: ${order.orderNumber}`,
          body: `${order.customerName} — ₺${order.total.toLocaleString('tr-TR')}`,
        });
      });
    }
    prevOrderCount.current = orders.length;
  }, [orders, addNotification, products]);

  // Düşük stok izle
  useEffect(() => {
    if (isFirstRun.current) return;

    const currentLowStock = products.filter((p) => p.stock <= LOW_STOCK_THRESHOLD);
    currentLowStock.forEach((p) => {
      if (!prevLowStockIds.current.has(p.id)) {
        addNotification({
          type: 'stock',
          title: `⚠️ Kritik Stok: ${p.name}`,
          body: `Yalnızca ${p.stock} adet kaldı — yenileme önerilir.`,
        });
        prevLowStockIds.current.add(p.id);
      }
    });
  }, [products, addNotification]);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, isRead: true }));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return { notifications, unreadCount, markAllRead, clearAll, addNotification };
}
