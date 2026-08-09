import prisma from '@/lib/prisma';

export class WishlistService {
  /**
   * Fetch authenticated user's wishlist from MySQL
   */
  static async getUserWishlist(customerId: string): Promise<string[]> {
    try {
      if (process.env.DATABASE_URL) {
        const items = await (prisma as any).wishlist.findMany({
          where: { customerId },
          select: { productId: true },
        });
        return items.map((i: any) => i.productId);
      }
    } catch (e) {
      console.warn('Wishlist fetch error', e);
    }
    return [];
  }

  /**
   * Merge guest LocalStorage wishlist into authenticated user wishlist upon login
   */
  static async mergeGuestWishlist(customerId: string, guestProductIds: string[]): Promise<string[]> {
    if (!guestProductIds || guestProductIds.length === 0) {
      return this.getUserWishlist(customerId);
    }

    try {
      if (process.env.DATABASE_URL) {
        for (const productId of guestProductIds) {
          await (prisma as any).wishlist.upsert({
            where: {
              customerId_productId: { customerId, productId },
            },
            create: { customerId, productId },
            update: {},
          });
        }
      }
    } catch (e) {
      console.warn('Wishlist merge error', e);
    }

    return this.getUserWishlist(customerId);
  }
}
