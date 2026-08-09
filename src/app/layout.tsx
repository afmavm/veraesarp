import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ToastProvider } from '@/context/ToastContext';
import { DataProvider } from '@/context/DataContext';
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import CartDrawer from '@/components/cart/CartDrawer';
import WhatsAppFloatingButton from '@/components/ui/WhatsAppFloatingButton';
import { SITE_CONFIG } from '@/lib/data/mock-data';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'VERA EŞARP | Premium Kadın Eşarp & Aksesuar Koleksiyonu',
    template: '%s | VERA EŞARP',
  },
  description: SITE_CONFIG.tagline,
  keywords: [
    'ipek eşarp',
    'twill ipek',
    'saten eşarp',
    'medine ipeği şal',
    'bambu şal',
    'altın eşarp broşu',
    'tesettür giyim',
    'lüks eşarp markaları',
  ],
  authors: [{ name: 'Vera Eşarp' }],
  openGraph: {
    title: 'VERA EŞARP — Lüks Kadın Moda & Aksesuar',
    description: SITE_CONFIG.tagline,
    url: 'https://veraesarp.com',
    siteName: 'Vera Eşarp',
    locale: 'tr_TR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${cormorant.variable} ${manrope.variable}`}>
      <body className="bg-[#F8F5EF] text-[#242321] min-h-screen flex flex-col antialiased selection:bg-[#B49A6A] selection:text-[#F8F5EF]">
        <DataProvider>
          <AuthProvider>
            <ToastProvider>
              <WishlistProvider>
                <CartProvider>
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                  <CartDrawer />
                  <MobileNav />
                  <WhatsAppFloatingButton />
                </CartProvider>
              </WishlistProvider>
            </ToastProvider>
          </AuthProvider>
        </DataProvider>
      </body>
    </html>
  );
}
