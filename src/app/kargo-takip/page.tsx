'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { Search, Truck, CheckCircle2, MapPin, Clock, ShieldCheck, ChevronRight, AlertCircle } from 'lucide-react';
import { useData } from '@/context/DataContext';

interface CargoPageProps {
  searchParams: Promise<{ code?: string }>;
}

export default function CargoTrackingPage({ searchParams }: CargoPageProps) {
  const resolvedSearchParams = use(searchParams);
  // Default code empty so form starts clean without prefilled mock data
  const initialCode = resolvedSearchParams.code || '';
  const [queryCode, setQueryCode] = useState(initialCode);
  const [searched, setSearched] = useState(Boolean(initialCode));

  const { getCargoStatus } = useData();
  const trackingData = queryCode.trim() ? getCargoStatus(queryCode.trim()) : undefined;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  return (
    <div className="py-12 bg-[#F8F5EF] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-[#8C857B] uppercase tracking-wider">
          <Link href="/" className="hover:text-[#242321]">Ana Sayfa</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#242321] font-semibold">Canlı Kargo Takip</span>
        </nav>

        {/* Title */}
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] text-[#B49A6A] font-semibold flex items-center justify-center gap-2">
            <Truck className="w-4 h-4" />
            VERA LOJİSTİK TAKİP
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-[#242321]">
            Canlı Kargo Sorgulama
          </h1>
          <p className="text-xs sm:text-sm text-[#5A5652] max-w-md mx-auto leading-relaxed">
            Sipariş numaranızı veya kargo takip kodunuzu girerek paketinizin anlık nerede olduğunu sorgulayabilirsiniz.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Sipariş Kodu (ör: VER-849201) veya Kargo Takip No..."
            value={queryCode}
            onChange={(e) => {
              setQueryCode(e.target.value);
              setSearched(false);
            }}
            className="flex-1 py-3.5 px-5 bg-[#FFFFFF] border border-[#E6DFD5] text-sm text-[#242321] placeholder-[#8C857B] focus:outline-none focus:border-[#B49A6A] shadow-sm font-mono"
          />
          <button
            type="submit"
            className="px-8 py-3.5 bg-[#242321] text-[#F8F5EF] text-xs font-semibold uppercase tracking-widest hover:bg-[#B49A6A] transition-colors shadow-md flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Sorgula</span>
          </button>
        </form>

        {/* Result Area */}
        {queryCode.trim() && trackingData ? (
          <div className="bg-[#FFFFFF] p-6 sm:p-10 border border-[#E6DFD5] space-y-8 shadow-xl">
            {/* Info Summary Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-[#E6DFD5]">
              <div>
                <span className="text-[10px] text-[#B49A6A] uppercase tracking-widest font-semibold block">
                  {trackingData.carrier} — Takip No: {trackingData.trackingCode}
                </span>
                <h2 className="font-serif text-2xl font-normal text-[#242321] mt-0.5">
                  Sipariş No: {trackingData.orderNumber}
                </h2>
                <p className="text-xs text-[#5A5652] mt-1">Alıcı: <strong>{trackingData.customerName}</strong></p>
              </div>

              <div className="p-4 bg-[#F8F5EF] border border-[#E6DFD5] text-right">
                <span className="text-[10px] text-[#8C857B] uppercase block">Tahmini Teslimat</span>
                <span className="font-serif text-base font-semibold text-[#B49A6A]">{trackingData.estimatedDelivery}</span>
              </div>
            </div>

            {/* Live Status Badge */}
            <div className="p-4 bg-[#E8DED1]/50 border border-[#B49A6A]/30 flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-600 animate-ping shrink-0" />
              <div className="text-xs">
                <span className="text-[#8C857B] block uppercase text-[10px]">Mevcut Kargo Durumu</span>
                <strong className="text-[#242321] font-serif text-lg">{trackingData.currentStatus}</strong>
              </div>
            </div>

            {/* Timeline Graphic */}
            <div className="space-y-6 pt-4">
              <h3 className="font-serif text-xl font-normal text-[#242321]">Kargo Hareket Zaman Çizelgesi</h3>

              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E6DFD5]">
                {trackingData.timeline.map((step, i) => (
                  <div key={i} className="relative flex items-start justify-between gap-4 group">
                    <div
                      className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center border text-xs transition-colors ${
                        step.done
                          ? 'bg-[#B49A6A] border-[#B49A6A] text-white'
                          : 'bg-white border-[#E6DFD5] text-[#8C857B]'
                      }`}
                    >
                      {step.done ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-3.5 h-3.5" />}
                    </div>

                    <div className="space-y-1">
                      <h4 className={`text-xs font-semibold ${step.isCurrent ? 'text-[#B49A6A] font-bold' : 'text-[#242321]'}`}>
                        {step.step}
                      </h4>
                      <p className="text-[11px] text-[#8C857B] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#B49A6A]" />
                        {step.location}
                      </p>
                    </div>

                    <span className="text-[10px] text-[#8C857B] font-mono shrink-0">{step.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : searched && queryCode.trim() ? (
          <div className="bg-[#FFFFFF] p-8 border border-[#E6DFD5] text-center space-y-3 max-w-xl mx-auto shadow-sm">
            <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
            <h3 className="font-serif text-lg text-[#242321]">Kargo Kaydı Bulunamadı</h3>
            <p className="text-xs text-[#8C857B] leading-relaxed">
              "<strong>{queryCode}</strong>" koduna ait aktif kargo veya sipariş kaydı bulunamadı. Lütfen sipariş numaranızı kontrol edip tekrar deneyiniz.
            </p>
          </div>
        ) : null}

        {/* Security & Support Note */}
        <div className="p-6 bg-[#FFFFFF] border border-[#E6DFD5] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5A5652]">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#B49A6A] shrink-0" />
            <span>Kargo hareketleriniz 256-bit SSL güvencesiyle canlı olarak güncellenmektedir.</span>
          </div>
          <Link href="/kurumsal/iletisim" className="text-[#B49A6A] font-semibold uppercase tracking-wider hover:underline whitespace-nowrap">
            Canlı Destek →
          </Link>
        </div>
      </div>
    </div>
  );
}
