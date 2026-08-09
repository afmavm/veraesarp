'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { toggleCart, totalCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { campaigns, siteSettings } = useData();
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const activeCampaign = campaigns.find((c) => c.isEnabled);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#242321] text-[#F8F5EF] text-[11px] font-medium py-2 px-4 text-center tracking-widest uppercase flex items-center justify-center gap-3 border-b border-[#B49A6A]/20">
        <Sparkles className="w-3.5 h-3.5 text-[#B49A6A] animate-pulse" />
        <span>
          {activeCampaign
            ? `${activeCampaign.title} — ${activeCampaign.subtitle}`
            : "Tüm Türkiye'ye ₺1.500 Üzeri Ücretsiz Kargo & Özel Hediye Kutusu"}
        </span>
        <span className="hidden md:inline-block text-[#B49A6A]">|</span>
        <span className="hidden md:inline-block">%100 Saf İpek &amp; El İşçiliği Kenar Garantisi</span>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-40 bg-[#F8F5EF]/95 backdrop-blur-md transition-all duration-300 border-b ${
          isScrolled ? 'border-[#E6DFD5] shadow-sm py-3' : 'border-transparent py-5'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-[#242321] hover:text-[#B49A6A] transition-colors p-1"
              aria-label="Menüyü Aç"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo (Fixed Isolated Left) */}
            <div className="shrink-0 mr-4 lg:mr-6 xl:mr-10 text-center lg:text-left">
              <Link href="/" className="inline-block">
                <span className="font-serif text-2xl sm:text-3xl tracking-[0.25em] text-[#242321] font-semibold uppercase">
                  VERA
                </span>
                <span className="block text-[9px] tracking-[0.4em] text-[#B49A6A] font-sans uppercase -mt-1 font-medium">
                  E Ş A R P
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links (Centered & Spaced Safely) */}
            <nav className="hidden lg:flex items-center justify-center gap-3 xl:gap-5 2xl:gap-7 text-[11px] xl:text-xs uppercase tracking-wider font-semibold text-[#242321] shrink whitespace-nowrap">
              <Link href="/kategori/yeni-gelenler" className="hover:text-[#B49A6A] transition-colors py-1 shrink-0">
                Yeni Gelenler
              </Link>
              
              {/* Eşarp Dropdown Trigger */}
              <div className="relative group py-1 shrink-0">
                <Link href="/kategori/esarp" className="hover:text-[#B49A6A] transition-colors flex items-center gap-1">
                  <span>Eşarp</span>
                  <ChevronDown className="w-3 h-3 text-[#8C857B] group-hover:rotate-180 transition-transform" />
                </Link>
                {/* Mega Menu Dropdown */}
                <div className="absolute top-full left-0 w-64 bg-[#F8F5EF] border border-[#E6DFD5] shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-4 space-y-3 z-50">
                  <Link href="/kategori/esarp?fabric=ipek" className="block text-xs text-[#5A5652] hover:text-[#B49A6A] transition-colors">
                     Saf Twill İpek Eşarp
                  </Link>
                  <Link href="/kategori/esarp?fabric=saten" className="block text-xs text-[#5A5652] hover:text-[#B49A6A] transition-colors">
                     Parlak Saten Eşarp
                  </Link>
                  <Link href="/kategori/esarp?styleCategory=ofis" className="block text-xs text-[#5A5652] hover:text-[#B49A6A] transition-colors">
                     Ofis &amp; İş Stili
                  </Link>
                  <Link href="/kategori/esarp?styleCategory=ozel-gun" className="block text-xs text-[#5A5652] hover:text-[#B49A6A] transition-colors">
                     Özel Gün &amp; Davet
                  </Link>
                </div>
              </div>

              {/* Şal Dropdown */}
              <div className="relative group py-1 shrink-0">
                <Link href="/kategori/sal" className="hover:text-[#B49A6A] transition-colors flex items-center gap-1">
                  <span>Şal</span>
                  <ChevronDown className="w-3 h-3 text-[#8C857B] group-hover:rotate-180 transition-transform" />
                </Link>
                <div className="absolute top-full left-0 w-64 bg-[#F8F5EF] border border-[#E6DFD5] shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-4 space-y-3 z-50">
                  <Link href="/kategori/sal?fabric=medine-ipegi" className="block text-xs text-[#5A5652] hover:text-[#B49A6A] transition-colors">
                     Medine İpeği Şal
                  </Link>
                  <Link href="/kategori/sal?fabric=pamuk" className="block text-xs text-[#5A5652] hover:text-[#B49A6A] transition-colors">
                     Bambu &amp; Organik Pamuk
                  </Link>
                </div>
              </div>

              <Link href="/kategori/aksesuar" className="hover:text-[#B49A6A] transition-colors py-1 shrink-0">
                Aksesuar
              </Link>
              <Link href="/koleksiyonlar" className="hover:text-[#B49A6A] transition-colors py-1 shrink-0">
                Koleksiyonlar
              </Link>
              <Link href="/stil-rehberi" className="hover:text-[#B49A6A] transition-colors py-1 shrink-0">
                Stil Rehberi
              </Link>
              <Link href="/kargo-takip" className="hover:text-[#B49A6A] transition-colors py-1 shrink-0">
                Kargo Takip
              </Link>
              <Link href="/kategori/kampanyalar" className="hover:text-[#B49A6A] transition-colors py-1 text-[#B49A6A] font-bold shrink-0">
                Kampanyalar
              </Link>
            </nav>

            {/* Right Action Icons (Fixed Isolated Right) */}
            <div className="shrink-0 ml-4 lg:ml-6 xl:ml-10 flex items-center space-x-3 sm:space-x-4 text-[#242321]">
              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="hover:text-[#B49A6A] transition-colors p-1"
                aria-label="Arama Yap"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Icon */}
              <Link href="/favorilerim" className="relative hover:text-[#B49A6A] transition-colors p-1" aria-label="Favorilerim">
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#B49A6A] text-[#F8F5EF] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Interactive Account Menu Dropdown */}
              <div className="relative">
                {isLoggedIn && user ? (
                  <div
                    className="relative py-1"
                    onMouseEnter={() => setIsAccountMenuOpen(true)}
                    onMouseLeave={() => setIsAccountMenuOpen(false)}
                  >
                    <button
                      onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#F4EBE1]/90 hover:bg-[#E8DED1] text-[#242321] transition-all border border-[#E6DFD5] shadow-sm"
                      aria-label="Hesabım Menüsü"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#B49A6A] text-[#F8F5EF] flex items-center justify-center font-bold text-[10px]">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-[11px] font-semibold text-[#242321] max-w-[90px] truncate">
                        {user.name.split(' ')[0]}
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-[#8C857B] transition-transform duration-200 ${isAccountMenuOpen ? 'rotate-180 text-[#B49A6A]' : ''}`} />
                    </button>

                    {/* Continuous Hover Dropdown Wrapper (No Margin Gap) */}
                    {isAccountMenuOpen && (
                      <div className="absolute right-0 top-full pt-1.5 w-72 z-50">
                        <div className="bg-[#1C1B1A] border border-[#B49A6A] shadow-2xl text-[#F8F5EF] p-4 space-y-3 rounded-sm animate-in fade-in slide-in-from-top-1 duration-150">
                          {/* User Summary Header */}
                          <div className="pb-3 border-b border-[#3A3835] space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-serif text-sm font-semibold text-[#F8F5EF] truncate max-w-[160px]">
                                {user.name}
                              </span>
                              <span className="px-2 py-0.5 bg-[#B49A6A]/20 text-[#B49A6A] text-[9px] font-bold uppercase tracking-wider border border-[#B49A6A]/40 rounded-full shrink-0 whitespace-nowrap">
                                {isAdmin ? '👑 Admin' : user.tier || 'Silver Üye'}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#8C857B] truncate">{user.email}</p>
                          </div>

                          {/* Navigation Links */}
                          <div className="space-y-1 text-xs font-medium">
                            <Link
                              href="/hesabim?tab=profile"
                              onClick={() => {
                                setIsAccountMenuOpen(false);
                                if (typeof window !== 'undefined' && window.location.pathname === '/hesabim') {
                                  window.history.pushState({}, '', '/hesabim?tab=profile');
                                  window.dispatchEvent(new Event('popstate'));
                                }
                              }}
                              className="flex items-center justify-between p-2 rounded hover:bg-[#242321] hover:text-[#B49A6A] transition-colors"
                            >
                              <span>Hesabım &amp; Profilim</span>
                              <span className="text-[10px] text-[#8C857B]">→</span>
                            </Link>
                            <Link
                              href="/hesabim?tab=orders"
                              onClick={() => {
                                setIsAccountMenuOpen(false);
                                if (typeof window !== 'undefined' && window.location.pathname === '/hesabim') {
                                  window.history.pushState({}, '', '/hesabim?tab=orders');
                                  window.dispatchEvent(new Event('popstate'));
                                }
                              }}
                              className="flex items-center justify-between p-2 rounded hover:bg-[#242321] hover:text-[#B49A6A] transition-colors"
                            >
                              <span>Siparişlerim &amp; Kargolarım</span>
                              <span className="text-[10px] text-[#8C857B]">→</span>
                            </Link>
                            <Link
                              href="/hesabim?tab=addresses"
                              onClick={() => {
                                setIsAccountMenuOpen(false);
                                if (typeof window !== 'undefined' && window.location.pathname === '/hesabim') {
                                  window.history.pushState({}, '', '/hesabim?tab=addresses');
                                  window.dispatchEvent(new Event('popstate'));
                                }
                              }}
                              className="flex items-center justify-between p-2 rounded hover:bg-[#242321] hover:text-[#B49A6A] transition-colors"
                            >
                              <span>Kayıtlı Adreslerim</span>
                              <span className="text-[10px] text-[#8C857B]">→</span>
                            </Link>
                            <Link
                              href="/hesabim?tab=cards"
                              onClick={() => {
                                setIsAccountMenuOpen(false);
                                if (typeof window !== 'undefined' && window.location.pathname === '/hesabim') {
                                  window.history.pushState({}, '', '/hesabim?tab=cards');
                                  window.dispatchEvent(new Event('popstate'));
                                }
                              }}
                              className="flex items-center justify-between p-2 rounded hover:bg-[#242321] hover:text-[#B49A6A] transition-colors"
                            >
                              <span>Kayıtlı Ödeme Kartlarım</span>
                              <span className="text-[10px] text-[#8C857B]">→</span>
                            </Link>

                            {isAdmin && (
                              <Link
                                href="/admin"
                                onClick={() => setIsAccountMenuOpen(false)}
                                className="flex items-center justify-between p-2 bg-[#B49A6A]/20 text-[#B49A6A] border border-[#B49A6A]/40 font-bold rounded hover:bg-[#B49A6A] hover:text-[#F8F5EF] transition-colors mt-2"
                              >
                                <span>👑 ADMİN PANELİNE GİT</span>
                                <span>→</span>
                              </Link>
                            )}
                          </div>

                          {/* Logout Button */}
                          <div className="pt-2 border-t border-[#3A3835]">
                            <button
                              onClick={() => {
                                setIsAccountMenuOpen(false);
                                logout();
                              }}
                              className="w-full text-left p-2 text-xs text-rose-400 hover:bg-rose-950/40 rounded transition-colors font-medium flex items-center justify-between"
                            >
                              <span>Oturumu Kapat</span>
                              <span>🚪</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/giris"
                    className="hidden sm:flex items-center gap-1.5 hover:text-[#B49A6A] transition-colors p-1"
                    aria-label="Giriş Yap"
                  >
                    <User className="w-5 h-5 text-[#242321]" />
                    <span className="text-[11px] font-semibold text-[#242321]">Giriş Yap</span>
                  </Link>
                )}
              </div>

              {/* Cart Drawer Trigger */}
              <button
                onClick={toggleCart}
                className="relative hover:text-[#B49A6A] transition-colors p-1 flex items-center gap-1.5"
                aria-label="Sepeti Aç"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalCount > 0 && (
                  <span className="bg-[#242321] text-[#F8F5EF] text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    {totalCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Expandable Live Search Bar */}
          {isSearchOpen && (
            <div className="mt-4 pt-4 border-t border-[#E6DFD5] transition-all">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    window.location.href = `/arama?q=${encodeURIComponent(searchQuery)}`;
                  }
                }}
                className="relative max-w-2xl mx-auto"
              >
                <input
                  type="text"
                  placeholder="İpek eşarp, Medine ipeği şal, altın broş ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#E6DFD5] py-3 px-5 pr-12 text-sm text-[#242321] placeholder-[#8C857B] focus:outline-none focus:border-[#B49A6A]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#242321] hover:text-[#B49A6A] p-2"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-[#242321]/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#F8F5EF] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#E6DFD5]">
                <span className="font-serif text-xl font-semibold tracking-widest">VERA EŞARP</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 text-[#242321]">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="py-6 space-y-4 text-sm font-medium uppercase tracking-wider text-[#242321]">
                <Link
                  href="/kategori/yeni-gelenler"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 hover:text-[#B49A6A]"
                >
                  Yeni Gelenler
                </Link>
                <Link
                  href="/kategori/esarp"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 hover:text-[#B49A6A]"
                >
                  Eşarp Koleksiyonu
                </Link>
                <Link
                  href="/kategori/sal"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 hover:text-[#B49A6A]"
                >
                  Şal Koleksiyonu
                </Link>
                <Link
                  href="/kategori/aksesuar"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 hover:text-[#B49A6A]"
                >
                  Aksesuar
                </Link>
                <Link
                  href="/koleksiyonlar"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 hover:text-[#B49A6A]"
                >
                  Koleksiyonlar
                </Link>
                <Link
                  href="/stil-rehberi"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 hover:text-[#B49A6A]"
                >
                  Stil Rehberi &amp; Blog
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-[#B49A6A] font-bold"
                  >
                    Admin Paneli
                  </Link>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-[#E6DFD5] space-y-3 text-xs text-[#5A5652]">
              <p>Müşteri Hizmetleri: <strong>{siteSettings.contactPhone}</strong></p>
              <p>{siteSettings.workingHours}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
