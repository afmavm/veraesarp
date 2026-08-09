import { Product } from '@/lib/types/ecommerce';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://veraesarp.com';

/**
 * Generate Product & Offer Schema JSON-LD for Google Rich Results
 */
export function generateProductJsonLd(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.shortDescription || product.description,
    sku: product.sku,
    mpn: product.barcode || product.sku,
    brand: {
      '@type': 'Brand',
      name: 'Vera Eşarp',
    },
    offers: {
      '@type': 'Offer',
      url: `${BASE_URL}/kategori/${product.category}/${product.slug}`,
      priceCurrency: 'TRY',
      price: product.price,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Vera Eşarp Tekstil A.Ş.',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating || 5.0,
      reviewCount: product.reviewCount || 12,
    },
  };
}

/**
 * Generate BreadcrumbList Schema JSON-LD
 */
export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };
}

/**
 * Generate Organization Schema JSON-LD
 */
export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Vera Eşarp Tekstil A.Ş.',
    url: BASE_URL,
    logo: `${BASE_URL}/images/logo.png`,
    sameAs: [
      'https://instagram.com/verabutik2007',
      'https://facebook.com/veraesarp',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+90-534-490-25-57',
      contactType: 'customer service',
      areaServed: 'TR',
      availableLanguage: ['Turkish'],
    },
  };
}
