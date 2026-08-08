import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="py-24 bg-[#F8F5EF] min-h-[70vh] flex items-center justify-center text-center px-4">
      <div className="max-w-md space-y-6">
        <span className="font-serif text-8xl font-light text-[#B49A6A] block">404</span>
        <h1 className="font-serif text-3xl font-normal text-[#242321]">
          Aradığınız Sayfa Bulunamadı
        </h1>
        <p className="text-xs sm:text-sm text-[#5A5652] leading-relaxed">
          Aradığınız içerik taşınmış veya silinmiş olabilir. Vera Eşarp’ın zamansız koleksiyonlarını keşfetmeye devam edebilirsiniz.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-block px-8 py-3.5 bg-[#242321] text-[#F8F5EF] text-xs font-semibold uppercase tracking-widest hover:bg-[#B49A6A] transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
