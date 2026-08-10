import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Vera Eşarp Yönetim Paneli',
    short_name: 'Vera Admin',
    description: 'Vera Eşarp Premium Yönetim Uygulaması',
    start_url: '/admin',
    id: '/admin',
    display: 'standalone',
    display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
    background_color: '#1C1B1A',
    theme_color: '#B49A6A',
    orientation: 'any',
    categories: ['business', 'productivity'],
    lang: 'tr',
    dir: 'ltr',
    icons: [
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/favicon.ico',
        sizes: '64x64 32x32 24x24 16x16',
        type: 'image/x-icon',
      },
    ],
    screenshots: [
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    shortcuts: [
      {
        name: 'Siparişler',
        short_name: 'Siparişler',
        description: 'Sipariş yönetimine git',
        url: '/admin?tab=orders',
        icons: [{ src: '/favicon.ico', sizes: '64x64' }],
      },
      {
        name: 'Ürün Ekle',
        short_name: 'Yeni Ürün',
        description: 'Yeni ürün ekle',
        url: '/admin?tab=products&action=new',
        icons: [{ src: '/favicon.ico', sizes: '64x64' }],
      },
    ],
  };
}
