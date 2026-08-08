'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#242321]">
      {/* Background Editorial Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1920&auto=format&fit=crop"
          alt="Vera Eşarp Editorial Banner"
          fill
          priority
          className="object-cover object-center opacity-70 filter saturate-90 scale-105 transition-transform duration-10000 ease-linear hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#242321] via-[#242321]/30 to-transparent" />
      </div>

      {/* Hero Content Overlay */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center text-[#F8F5EF] space-y-6 py-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#B49A6A]/20 backdrop-blur-md border border-[#B49A6A]/40 rounded-full text-xs font-semibold uppercase tracking-widest text-[#B49A6A]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Yeni Sezon Milano Romance 2026</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight leading-[1.1] max-w-4xl mx-auto">
          Zarafetin Yeni Yorumu
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-[#E8DED1] font-normal max-w-xl mx-auto leading-relaxed">
          Her stile eşlik eden zamansız %100 saf twill ipek renkleri, dökümlü dokuları ve özel İtalyan el dikişleri.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/kategori/esarp"
            className="w-full sm:w-auto px-8 py-4 bg-[#F8F5EF] text-[#242321] text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#B49A6A] hover:text-[#F8F5EF] transition-all duration-300 shadow-xl flex items-center justify-center gap-3"
          >
            <span>Koleksiyonu Keşfet</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/kategori/yeni-gelenler"
            className="w-full sm:w-auto px-8 py-4 bg-transparent border border-[#F8F5EF]/60 text-[#F8F5EF] text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#F8F5EF] hover:text-[#242321] transition-all duration-300 flex items-center justify-center"
          >
            Yeni Gelenler
          </Link>
        </div>
      </div>
    </section>
  );
}
