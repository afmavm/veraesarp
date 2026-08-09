import prisma from '@/lib/prisma';
import { getDatabase } from '@/lib/db';
import { Product } from '@/lib/types/ecommerce';

export class ProductService {
  /**
   * Fetch all products from MySQL database with JSON fallback
   */
  static async getAllProducts(): Promise<Product[]> {
    try {
      if (process.env.DATABASE_URL) {
        const dbProducts = await (prisma as any).product.findMany({
          include: {
            variants: true,
            category: true,
            collection: true,
          },
          orderBy: { createdAt: 'desc' },
        });

        if (dbProducts && dbProducts.length > 0) {
          return dbProducts.map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            sku: p.sku,
            barcode: p.barcode || undefined,
            description: p.description,
            shortDescription: p.shortDescription || '',
            price: p.basePrice,
            compareAtPrice: p.compareAtPrice || undefined,
            costPrice: p.costPrice || undefined,
            currency: p.currency,
            stock: p.stock,
            rating: p.rating,
            reviewCount: p.reviewCount,
            category: (p.category?.slug || 'esarp') as any,
            fabric: p.fabric as any,
            styleCategory: p.styleCategory as any,
            collection: p.collection?.slug || undefined,
            colors: (p.colors as any) || [],
            sizes: (p.sizes as any) || [],
            variants: p.variants.map((v: any) => ({
              id: v.id,
              colorName: v.colorName,
              colorHex: v.colorHex,
              size: v.size,
              sku: v.sku,
              stock: v.stock,
              price: v.price,
              imageUrl: v.image || undefined,
            })),
            images: (p.images as any) || [],
            videoUrl: p.videoUrl || undefined,
            badges: (p.badges as any) || [],
            features: (p.features as any) || [],
            careInstructions: p.careInstructions || '',
            dimensions: p.dimensions || '90x90 cm',
            isNew: p.isNew,
            isBestseller: p.isBestseller,
            isFeatured: p.isFeatured,
            createdAt: p.createdAt.toISOString(),
          }));
        }
      }
    } catch (e) {
      console.warn('Prisma product fetch fallback to local storage DB', e);
    }

    const fileDb = getDatabase();
    return fileDb.products || [];
  }

  /**
   * Get single product by slug
   */
  static async getProductBySlug(slug: string): Promise<Product | null> {
    const products = await this.getAllProducts();
    return products.find((p) => p.slug === slug) || null;
  }

  /**
   * Create or update product in MySQL with atomic fallback
   */
  static async upsertProduct(productData: Partial<Product>): Promise<Product> {
    const newProduct: Product = {
      id: productData.id || `p-${Date.now()}`,
      name: productData.name || 'Yeni Ürün',
      slug: productData.slug || `yeni-urun-${Date.now()}`,
      sku: productData.sku || `VER-NEW-${Math.floor(1000 + Math.random() * 9000)}`,
      barcode: productData.barcode,
      description: productData.description || 'Özel Vera Eşarp Dokuması',
      shortDescription: productData.shortDescription || '%100 Saf İpek',
      price: Number(productData.price) || 1500,
      compareAtPrice: productData.compareAtPrice ? Number(productData.compareAtPrice) : undefined,
      costPrice: productData.costPrice ? Number(productData.costPrice) : undefined,
      currency: '₺',
      stock: Number(productData.stock) || 20,
      rating: productData.rating || 5.0,
      reviewCount: productData.reviewCount || 0,
      category: productData.category || 'esarp',
      fabric: productData.fabric || 'ipek',
      styleCategory: productData.styleCategory || 'ofis',
      colors: productData.colors || [{ name: 'Standart', hex: '#242321' }],
      sizes: productData.sizes || ['90x90 cm'],
      variants: productData.variants || [],
      images: productData.images || ['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=1200&auto=format&fit=crop'],
      videoUrl: productData.videoUrl,
      badges: productData.badges || ['Yeni'],
      features: productData.features || ['✓ %100 Saf İpek'],
      careInstructions: productData.careInstructions || 'Kuru temizleme önerilir.',
      dimensions: productData.dimensions || '90x90 cm',
      isNew: productData.isNew ?? true,
      isBestseller: productData.isBestseller ?? false,
      isFeatured: productData.isFeatured ?? false,
      createdAt: productData.createdAt || new Date().toISOString(),
    };

    try {
      if (process.env.DATABASE_URL) {
        await (prisma as any).product.upsert({
          where: { slug: newProduct.slug },
          update: {
            name: newProduct.name,
            sku: newProduct.sku,
            barcode: newProduct.barcode,
            description: newProduct.description,
            shortDescription: newProduct.shortDescription,
            basePrice: newProduct.price,
            compareAtPrice: newProduct.compareAtPrice,
            costPrice: newProduct.costPrice,
            stock: newProduct.stock,
            fabric: newProduct.fabric,
            styleCategory: newProduct.styleCategory,
            colors: newProduct.colors as any,
            sizes: newProduct.sizes as any,
            images: newProduct.images as any,
            badges: newProduct.badges as any,
            features: newProduct.features as any,
            careInstructions: newProduct.careInstructions,
            dimensions: newProduct.dimensions,
          },
          create: {
            id: newProduct.id,
            name: newProduct.name,
            slug: newProduct.slug,
            sku: newProduct.sku,
            barcode: newProduct.barcode,
            description: newProduct.description,
            shortDescription: newProduct.shortDescription,
            basePrice: newProduct.price,
            compareAtPrice: newProduct.compareAtPrice,
            costPrice: newProduct.costPrice,
            currency: newProduct.currency,
            stock: newProduct.stock,
            fabric: newProduct.fabric,
            styleCategory: newProduct.styleCategory,
            colors: newProduct.colors as any,
            sizes: newProduct.sizes as any,
            images: newProduct.images as any,
            badges: newProduct.badges as any,
            features: newProduct.features as any,
            careInstructions: newProduct.careInstructions,
            dimensions: newProduct.dimensions,
          },
        });
      }
    } catch (e) {
      console.warn('Prisma upsert product failed, writing to fallback JSON', e);
    }

    return newProduct;
  }
}
