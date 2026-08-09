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
  const initialCode = resolvedSearchParams.code || 'VER-849201';
  const [queryCode, setQueryCode] = useState(initialCode);

  const { getCargoStatus } = useData();
  const trackingData = getCargoStatus(queryCode);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
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
            onChange={(e) => setQueryCode(e.target.value)}
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
        {trackingData ? (
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
                {trackingData.timeline.map((step, idx) => (
                  <div key={idx} className="relative flex items-start justify-between gap-4">
                    {/* Circle marker */}
                    <div
                      className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        step.done
                          ? 'bg-[#242321] text-[#F8F5EF]'
                          : step.isCurrent
                          ? 'bg-[#B49A6A] text-[#F8F5EF] ring-4 ring-[#B49A6A]/20'
                          : 'bg-[#E8DED1] text-[#8C857B]'
                      }`}
                    >
                      {step.done ? <CheckCircle2 className="w-4 h-4 text-[#B49A6A]" /> : idx + 1}
                    </div>

                    {/* Step details */}
                    <div>
                      <h4 className={`font-serif text-base ${step.isCurrent ? 'text-[#B49A6A] font-semibold' : 'text-[#242321]'}`}>
                        {step.step}
                      </h4>
                      <p className="text-xs text-[#5A5652] flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#8C857B]" />
                        <span>{step.location}</span>
                      </p>
                    </div>

                    <span className="text-xs text-[#8C857B] shrink-0 font-mono">{step.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center bg-[#FFFFFF] border border-[#E6DFD5] p-8 space-y-4">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
            <h3 className="font-serif text-xl text-[#242321]">Kargo Kaydı Bulunamadı</h3>
            <p className="text-xs text-[#5A5652] max-w-sm mx-auto">
              Girdiğiniz kodu lütfen kontrol edin. Test sorgusu için <strong>VER-849201</strong> veya <strong>YURT-94820194</strong> kodunu deneyebilirsiniz.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
