import { MetadataRoute } from 'next';
import { MOCK_PRODUCTS, MOCK_BLOG_POSTS } from '@/lib/data/mock-data';

function safeDate(dateString?: string): Date {
  if (!dateString) return new Date();
  const parsed = new Date(dateString);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://veraesarp.com';

  const categories = [
    { slug: 'esarp' },
    { slug: 'sal' },
    { slug: 'aksesuar' },
    { slug: 'yeni-gelenler' },
    { slug: 'kampanyalar' },
  ];

  const collections = [
    { slug: 'milano-twill' },
    { slug: 'soiree-luxury' },
    { slug: 'medine-ipegi' },
  ];

  const now = new Date();

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/kategori`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/koleksiyonlar`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/arama`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/giris`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/kurumsal/hakkimizda`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/kurumsal/iletisim`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/kurumsal/kargo-ve-teslimat`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/kurumsal/iade-ve-degisim`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/kurumsal/kvkk`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/kurumsal/gizlilik-ve-cerez`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ];

  // Dynamic Product routes
  const productRoutes: MetadataRoute.Sitemap = MOCK_PRODUCTS.map((p) => ({
    url: `${baseUrl}/kategori/${p.category}/${p.slug}`,
    lastModified: safeDate(p.createdAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Dynamic Category routes
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${baseUrl}/kategori/${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Dynamic Collection routes
  const collectionRoutes: MetadataRoute.Sitemap = collections.map((col) => ({
    url: `${baseUrl}/kategori/kampanyalar?collection=${col.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Dynamic Blog routes
  const blogRoutes: MetadataRoute.Sitemap = MOCK_BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/kurumsal/${post.slug}`,
    lastModified: safeDate(post.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...collectionRoutes, ...blogRoutes];
}
