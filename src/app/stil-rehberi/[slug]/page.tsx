'use client';

import React, { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ChevronRight, Clock, User, Calendar, Tag, ArrowLeft } from 'lucide-react';
import { MOCK_BLOG_POSTS } from '@/lib/data/mock-data';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default function ArticleDetailPage({ params }: ArticlePageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const post = MOCK_BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Article SEO JSON-LD
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    image: post.coverImage,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Vera Eşarp',
    },
    datePublished: post.publishedAt,
    description: post.excerpt,
  };

  return (
    <article className="py-12 bg-[#F8F5EF] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-[#8C857B] uppercase tracking-wider">
          <Link href="/" className="hover:text-[#242321]">Ana Sayfa</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/stil-rehberi" className="hover:text-[#242321]">Stil Rehberi</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#242321] font-semibold truncate max-w-xs">{post.title}</span>
        </nav>

        {/* Header */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-[0.3em] text-[#B49A6A] font-semibold">
            {post.category}
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#242321] leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-center gap-4 text-xs text-[#8C857B] pt-2">
            <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {post.author}</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.publishedAt}</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
          </div>
        </div>

        {/* Cover Image */}
        <div className="relative aspect-[16/9] w-full bg-[#E8DED1] overflow-hidden shadow-xl">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            className="object-cover object-center"
          />
        </div>

        {/* Article Body Content */}
        <div className="bg-[#FFFFFF] p-8 sm:p-12 border border-[#E6DFD5] space-y-6 text-[#242321] leading-relaxed text-sm sm:text-base font-light">
          <div
            className="prose max-w-none space-y-4"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          <div className="pt-8 border-t border-[#E6DFD5] flex items-center gap-2 flex-wrap text-xs text-[#5A5652]">
            <Tag className="w-4 h-4 text-[#B49A6A]" />
            <span className="font-medium">Etiketler:</span>
            {post.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 bg-[#F8F5EF] border border-[#E6DFD5] text-[11px]">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <Link
            href="/stil-rehberi"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#242321] hover:text-[#B49A6A]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Tüm Rehber Yazılarına Dön</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
