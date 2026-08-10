import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ToastProvider } from '@/context/ToastContext';
import { DataProvider } from '@/context/DataContext';
import { AuthProvider } from '@/context/AuthContext';
import StoreLayoutWrapper from '@/components/layout/StoreLayoutWrapper';
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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Vera Admin',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'application-name': 'Vera Eşarp',
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
                  <StoreLayoutWrapper>{children}</StoreLayoutWrapper>
                </CartProvider>
              </WishlistProvider>
            </ToastProvider>
          </AuthProvider>
        </DataProvider>
      </body>
    </html>
  );
}
