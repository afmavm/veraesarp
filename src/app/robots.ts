import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/sepet', '/odeme', '/hesabim'],
      },
    ],
    sitemap: 'https://veraesarp.com/sitemap.xml',
  };
}
