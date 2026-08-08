'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const STYLES = [
  {
    id: 'gunluk',
    title: 'Günlük',
    subtitle: 'Sade, rahat ve zamansız.',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop',
    href: '/kategori/esarp?styleCategory=gunluk',
  },
  {
    id: 'ofis',
    title: 'Ofis',
    subtitle: 'Minimal ve sofistike.',
    image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=1000&auto=format&fit=crop',
    href: '/kategori/esarp?styleCategory=ofis',
  },
  {
    id: 'davet',
    title: 'Davet',
    subtitle: 'Zarif ve dikkat çekici.',
    image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=1000&auto=format&fit=crop',
    href: '/kategori/esarp?styleCategory=davet',
  },
  {
    id: 'ozel-gun',
    title: 'Özel Gün',
    subtitle: 'Feminen ve seçkin.',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop',
    href: '/kategori/esarp?styleCategory=ozel-gun',
  },
];

export default function StyleFinder() {
  return (
    <section className="py-20 bg-[#F8F5EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs uppercase tracking-[0.3em] text-[#B49A6A] font-semibold">
            KİŞİSEL STİL REHBERİ
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#242321]">
            Senin Stilini Bul
          </h2>
          <p className="text-xs sm:text-sm text-[#5A5652] max-w-md mx-auto leading-relaxed">
            Günün her anında zarafetinizi tamamlayan özel stil kategorilerimizi inceleyin.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STYLES.map((style) => (
            <Link
              key={style.id}
              href={style.href}
              className="group relative aspect-[3/4] overflow-hidden bg-[#E8DED1] block shadow-sm"
            >
              <Image
                src={style.image}
                alt={style.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#242321]/80 via-[#242321]/20 to-transparent" />

              <div className="absolute inset-0 p-6 flex flex-col justify-end text-[#F8F5EF]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-2xl font-normal tracking-wide">{style.title}</h3>
                    <p className="text-xs text-[#E8DED1] mt-1 font-light">{style.subtitle}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#F8F5EF]/20 backdrop-blur-md flex items-center justify-center text-[#F8F5EF] group-hover:bg-[#B49A6A] transition-colors">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
