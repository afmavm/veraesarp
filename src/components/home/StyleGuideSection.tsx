'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Clock } from 'lucide-react';
import { MOCK_BLOG_POSTS } from '@/lib/data/mock-data';

export default function StyleGuideSection() {
  return (
    <section className="py-20 bg-[#F8F5EF] border-t border-[#E6DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#B49A6A] font-semibold">
              STİL &amp; İLHAM
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#242321] mt-2">
              Vera Stil Rehberi
            </h2>
          </div>
          <Link
            href="/stil-rehberi"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#242321] hover:text-[#B49A6A] transition-colors"
          >
            <span>Tüm Yazıları Oku</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_BLOG_POSTS.map((post) => (
            <article key={post.id} className="group flex flex-col bg-[#FFFFFF] border border-[#E6DFD5] overflow-hidden shadow-sm">
              <div className="relative aspect-[16/10] overflow-hidden bg-[#E8DED1]">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <span className="absolute top-3 left-3 bg-[#242321] text-[#F8F5EF] text-[10px] font-semibold uppercase px-2.5 py-1 tracking-widest">
                  {post.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-[#8C857B]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.readTime}</span>
                    <span>•</span>
                    <span>{post.publishedAt}</span>
                  </div>
                  <Link href={`/stil-rehberi/${post.slug}`}>
                    <h3 className="font-serif text-lg text-[#242321] font-medium leading-snug group-hover:text-[#B49A6A] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-[#5A5652] leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>

                <Link
                  href={`/stil-rehberi/${post.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B49A6A] group-hover:text-[#242321] transition-colors pt-2"
                >
                  <span>Devamını Oku</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
