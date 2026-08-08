'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function EditorialStory() {
  return (
    <section className="py-24 bg-[#242321] text-[#F8F5EF] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Editorial Image Stack */}
          <div className="lg:col-span-6 relative aspect-[3/4] bg-[#3A3835]">
            <Image
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop"
              alt="Vera Eşarp Marka Hikayesi"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center filter saturate-90"
            />
            {/* Overlay Frame */}
            <div className="absolute inset-4 border border-[#B49A6A]/40 pointer-events-none" />
          </div>

          {/* Editorial Copy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#B49A6A] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MARKA FELSEFEMİZ</span>
            </div>

            <h2 className="font-serif text-4xl sm:text-6xl font-light leading-tight">
              Bir Eşarptan Daha Fazlası
            </h2>

            <p className="text-sm sm:text-base text-[#E8DED1] leading-relaxed font-light">
              Vera Eşarp, yalnızca bir giyim aksesuarı sunmaz; modern kadının zarafetini, özgüvenini ve zamansız stil anlayışını tamamlayan canlı bir sanat eseri tasarlar.
            </p>

            <p className="text-xs sm:text-sm text-[#8C857B] leading-relaxed">
              İtalya'nın ve Bursa'nın tarihi dokuma ustalarıyla geliştirdiğimiz %100 saf twill ve saten ipeklerimiz, el işçiliği iğne oyaları ve özel renk pigmentleriyle özenle hazırlanır. Gardırobunuzda yıllar boyu değerini koruyacak bir miras parça.
            </p>

            <div className="pt-4">
              <Link
                href="/kurumsal/hikayemiz"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#B49A6A] text-[#F8F5EF] text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#F8F5EF] hover:text-[#242321] transition-all duration-300 shadow-xl"
              >
                <span>Vera'nın Hikâyesini Keşfet</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
