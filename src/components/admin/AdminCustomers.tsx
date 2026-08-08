'use client';

import React from 'react';
import { Users, Mail, Phone, Award, ShieldCheck, Search } from 'lucide-react';
import { MOCK_ORDERS } from '@/lib/data/mock-data';

export default function AdminCustomers() {
  const customerList = [
    {
      id: 'cust-1',
      name: 'Ayşe Yılmaz',
      email: 'ayse.yilmaz@example.com',
      phone: '0532 123 45 67',
      city: 'İstanbul',
      ordersCount: 4,
      totalSpent: 8940,
      tier: 'VIP Gold Müşteri',
      joinedAt: '12 Ocak 2026',
    },
    {
      id: 'cust-2',
      name: 'Zeynep Kaya',
      email: 'zeynep.kaya@example.com',
      phone: '0544 987 65 43',
      city: 'Ankara',
      ordersCount: 2,
      totalSpent: 3460,
      tier: 'Standart Müşteri',
      joinedAt: '04 Şubat 2026',
    },
    {
      id: 'cust-3',
      name: 'Elif Demir',
      email: 'elif.demir@example.com',
      phone: '0505 555 12 34',
      city: 'İzmir',
      ordersCount: 5,
      totalSpent: 12150,
      tier: 'VIP Platinum Müşteri',
      joinedAt: '15 Kasım 2025',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-[#2A2825]">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#F8F5EF]">Müşteri İlişkileri (CRM)</h1>
          <p className="text-xs text-[#8C857B]">Müşterilerinizin alışveriş geçmişlerini, harcama tutarlarını ve segmentasyonlarını inceleyin.</p>
        </div>
      </div>

      <div className="bg-[#1C1B1A] border border-[#2A2825] overflow-hidden">
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
              {customerList.map((cust) => (
                <tr key={cust.id} className="hover:bg-[#242321] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#B49A6A]/20 text-[#B49A6A] font-serif font-bold flex items-center justify-center">
                        {cust.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#F8F5EF]">{cust.name}</h4>
                        <span className="text-[10px] text-[#8C857B]">Üyelik: {cust.joinedAt}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 space-y-0.5">
                    <p className="text-[#F8F5EF] flex items-center gap-1.5"><Mail className="w-3 h-3 text-[#B49A6A]" /> {cust.email}</p>
                    <p className="text-[#8C857B] flex items-center gap-1.5"><Phone className="w-3 h-3 text-[#8C857B]" /> {cust.phone}</p>
                  </td>
                  <td className="p-4">{cust.city}</td>
                  <td className="p-4 font-semibold text-[#F8F5EF]">{cust.ordersCount} Sipariş</td>
                  <td className="p-4 font-serif text-base text-[#B49A6A] font-semibold">
                    ₺{cust.totalSpent.toLocaleString('tr-TR')}
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-[#B49A6A]/20 text-[#B49A6A] border border-[#B49A6A]/40 text-[10px] uppercase font-bold rounded">
                      {cust.tier}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
