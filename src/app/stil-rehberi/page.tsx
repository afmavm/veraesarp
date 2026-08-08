import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Clock } from 'lucide-react';
import { MOCK_BLOG_POSTS } from '@/lib/data/mock-data';

export const metadata = {
  title: 'Stil Rehberi & Blog | VERA EŞARP',
  description: 'İpek eşarp bağlama teknikleri, renk kombinleri ve 2026 moda trendleri.',
};

export default function StyleGuideIndexPage() {
  return (
    <div className="py-12 bg-[#F8F5EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-[#B49A6A] font-semibold">
            VERA EDITORIAL
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-[#242321]">
            Stil Rehberi &amp; Moda Blogu
          </h1>
          <p className="text-xs sm:text-sm text-[#5A5652] leading-relaxed">
            İpek eşarp dünyasından stil ipuçları, bağlama teknikleri ve ilham veren kombin önerileri.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {MOCK_BLOG_POSTS.map((post) => (
            <article key={post.id} className="bg-[#FFFFFF] border border-[#E6DFD5] flex flex-col overflow-hidden shadow-sm group">
              <div className="relative aspect-[16/10] overflow-hidden bg-[#E8DED1]">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
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
                    <h2 className="font-serif text-xl text-[#242321] font-medium leading-snug group-hover:text-[#B49A6A] transition-colors">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="text-xs text-[#5A5652] leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <Link
                  href={`/stil-rehberi/${post.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B49A6A] group-hover:text-[#242321] transition-colors pt-2"
                >
                  <span>Yazının Devamını Oku</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
