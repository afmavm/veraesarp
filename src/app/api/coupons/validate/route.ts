import { NextResponse } from 'next/server';
import { CouponService } from '@/services/coupon.service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, cartTotal, customerEmail } = body;

    if (!code || typeof cartTotal !== 'number') {
      return NextResponse.json(
        { success: false, message: 'Geçersiz kupon sorgulama parametreleri.' },
        { status: 400 }
      );
    }

    const result = await CouponService.validateCoupon(code, cartTotal, customerEmail);
    return NextResponse.json(result);
  } catch (error) {
    console.error('API /api/coupons/validate error', error);
    return NextResponse.json(
      { success: false, message: 'Kupon doğrulanırken bir sunucu hatası oluştu.' },
      { status: 500 }
    );
  }
}
