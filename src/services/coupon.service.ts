import prisma from '@/lib/prisma';
import { getDatabase } from '@/lib/db';
import { Coupon } from '@/lib/types/ecommerce';

export interface CouponValidationResult {
  success: boolean;
  message: string;
  discountAmount: number;
  coupon?: Coupon;
}

export class CouponService {
  /**
   * Validate coupon strictly on server-side using MySQL/Prisma or fallback DB
   */
  static async validateCoupon(
    code: string,
    cartTotal: number,
    customerEmail?: string
  ): Promise<CouponValidationResult> {
    const cleanCode = (code || '').trim().toUpperCase();

    if (!cleanCode) {
      return { success: false, message: 'Lütfen geçerli bir kupon kodu giriniz.', discountAmount: 0 };
    }

    let coupon: Coupon | null = null;

    // Check MySQL Database
    try {
      if (process.env.DATABASE_URL) {
        const dbCoupon = await prisma.coupon.findUnique({
          where: { code: cleanCode },
        });

        if (dbCoupon && dbCoupon.isActive) {
          coupon = {
            id: dbCoupon.id,
            code: dbCoupon.code,
            discountText: dbCoupon.discountType === 'PERCENTAGE' ? `%${dbCoupon.discountValue} İndirim` : `₺${dbCoupon.discountValue} İndirim`,
            discountType: dbCoupon.discountType === 'PERCENTAGE' ? 'percentage' : 'fixed',
            discountValue: dbCoupon.discountValue,
            minSpend: dbCoupon.minSpend,
            usageCount: dbCoupon.usedCount,
            maxUsesPerCustomer: dbCoupon.maxUsesPerCustomer,
            usedByEmails: (dbCoupon.usedByEmails as string[]) || [],
            status: dbCoupon.isActive ? 'Aktif' : 'Pasif',
          };
        }
      }
    } catch (e) {
      console.warn('Coupon server validation Prisma error', e);
    }

    // Fallback to file DB
    if (!coupon) {
      const fileDb = getDatabase();
      const found = fileDb.coupons.find((c) => c.code.toUpperCase() === cleanCode && c.status === 'Aktif');
      if (found) coupon = found;
    }

    if (!coupon) {
      return { success: false, message: 'Geçersiz veya süresi dolmuş kupon kodu.', discountAmount: 0 };
    }

    // Minimum Spend Check
    if (cartTotal < coupon.minSpend) {
      return {
        success: false,
        message: `Bu kupon en az ₺${coupon.minSpend.toLocaleString('tr-TR')} sepet tutarında geçerlidir.`,
        discountAmount: 0,
      };
    }

    // Per-Customer Usage Check
    if (customerEmail && coupon.usedByEmails) {
      const cleanEmail = customerEmail.trim().toLowerCase();
      const previousUses = coupon.usedByEmails.filter((e) => e.toLowerCase() === cleanEmail).length;
      const maxAllowed = coupon.maxUsesPerCustomer || 1;

      if (previousUses >= maxAllowed) {
        return {
          success: false,
          message: 'Bu kupon kodunu hesabınız için kullanım hakkı dolmuştur.',
          discountAmount: 0,
        };
      }
    }

    // Server-side Discount Amount Calculation
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (cartTotal * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }

    discountAmount = Math.min(discountAmount, cartTotal);

    return {
      success: true,
      message: `"${coupon.code}" kuponu uygulandı! (₺${discountAmount.toLocaleString('tr-TR')} indirim)`,
      discountAmount,
      coupon,
    };
  }
}
