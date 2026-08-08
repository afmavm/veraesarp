'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, Search, Heart, User } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';

export default function MobileNav() {
  const pathname = usePathname();
  const { wishlistCount } = useWishlist();

  const navItems = [
    { label: 'Ana Sayfa', href: '/', icon: Home },
    { label: 'Kategoriler', href: '/kategori/esarp', icon: Grid },
    { label: 'Arama', href: '/arama', icon: Search },
    { label: 'Favoriler', href: '/favorilerim', icon: Heart, badge: wishlistCount },
    { label: 'Hesabım', href: '/hesabim', icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F8F5EF]/95 backdrop-blur-md border-t border-[#E6DFD5] py-2 px-4 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-colors relative ${
                isActive ? 'text-[#B49A6A]' : 'text-[#5A5652] hover:text-[#242321]'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-[#B49A6A] text-[#F8F5EF] text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
