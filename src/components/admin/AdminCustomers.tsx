'use client';

import React, { useState } from 'react';
import { Users, Mail, Phone, Award, ShieldCheck, Search, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';

export default function AdminCustomers() {
  const { registeredUsers } = useAuth();
  const { orders } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter out admin users and map customer stats dynamically from real registered users
  const customerList = registeredUsers
    .filter((u) => u.role !== 'admin' && !u.isAdmin && u.email !== 'destek@veraesarp.com')
    .map((u) => {
      const userOrders = orders.filter(
        (o) => o.email?.toLowerCase() === u.email.toLowerCase() || (o.phone && u.phone && o.phone.replace(/[^0-9]/g, '') === u.phone.replace(/[^0-9]/g, ''))
      );
      const totalSpent = userOrders.reduce((sum, o) => sum + (o.total || 0), 0);

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        city: 'İstanbul',
        ordersCount: userOrders.length,
        totalSpent: totalSpent,
        tier: u.tier || (totalSpent > 10000 ? 'Vera VIP Diamond' : totalSpent > 5000 ? 'Vera Gold Müşteri' : 'Vera Silver Üye'),
        joinedAt: 'Yeni Üye',
      };
    });

  const filteredCustomers = customerList.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-[#2A2825]">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#F8F5EF]">Müşteri İlişkileri (CRM)</h1>
          <p className="text-xs text-[#8C857B]">
            Yeni kaydolan tüm müşterilerinizin alışveriş geçmişlerini, harcama tutarlarını ve üyelik detaylarını inceleyin.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#8C857B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Müşteri Ara (Ad, E-Posta, Tel)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#1C1B1A] border border-[#2A2825] text-xs text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-[#1C1B1A] border border-[#2A2825] overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-3">
            <Users className="w-10 h-10 text-[#B49A6A] mx-auto opacity-50" />
            <h3 className="font-serif text-lg text-[#F8F5EF]">Kayıtlı Müşteri Bulunamadı</h3>
            <p className="text-xs text-[#8C857B]">
              Henüz üye kaydı yapmış veya aramanızla eşleşen müşteri bulunmamaktadır.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#E8DED1]">
              <thead className="bg-[#242321] text-[#B49A6A] uppercase tracking-wider text-[11px] border-b border-[#2A2825]">
                <tr>
                  <th className="p-4">Müşteri Adı</th>
                  <th className="p-4">İletişim Bilgileri</th>
                  <th className="p-4">Şehir</th>
                  <th className="p-4">Sipariş Adedi</th>
                  <th className="p-4">Toplam Harcama</th>
                  <th className="p-4">Müşteri Segmenti</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2825]">
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-[#242321] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#B49A6A]/20 text-[#B49A6A] font-serif font-bold flex items-center justify-center border border-[#B49A6A]/30">
                          {cust.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#F8F5EF] text-sm">{cust.name}</h4>
                          <span className="text-[10px] text-[#8C857B]">Durum: {cust.joinedAt}</span>
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
                    <td className="p-4">{cust.city}</td>
                    <td className="p-4 font-semibold text-[#F8F5EF]">
                      {cust.ordersCount} Sipariş
                    </td>
                    <td className="p-4 font-serif text-base text-[#B49A6A] font-semibold">
                      ₺{cust.totalSpent.toLocaleString('tr-TR')}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-[#B49A6A]/20 text-[#B49A6A] border border-[#B49A6A]/40 text-[10px] uppercase font-bold rounded-full">
                        {cust.tier}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
