import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Yönetim Paneli | VERA EŞARP',
  description: 'Vera Eşarp E-Ticaret Yönetim Paneli',
  robots: { index: false, follow: false },
};

/**
 * Admin layout — kök layout'un Header/Footer/CartDrawer/MobileNav/WhatsApp
 * bileşenlerini geçersiz kılar. Admin paneli bunları göstermez.
 * Context Provider'ları (DataProvider, AuthProvider vb.) kök layout'tan
 * zaten miras alınır; burada tekrar sarmalanmaz.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
