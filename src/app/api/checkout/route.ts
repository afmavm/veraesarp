import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';
import { PaymentService, PaymentRequest } from '@/lib/payment/iyzico-service';
import { CustomerOrder } from '@/lib/types/ecommerce';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const forwardedHost = request.headers.get('x-forwarded-host');
    const host = forwardedHost || request.headers.get('host') || 'veraesarp.com';
    const protocol =
      request.headers.get('x-forwarded-proto') ||
      (host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https');
    const hostUrl = `${protocol}://${host}`;

    const body = await request.json();
    const {
      order,
      paymentMethod,
      cardHolderName,
      cardNumber,
      cardExpiry,
      cardCvc,
    }: {
      order: CustomerOrder;
      paymentMethod: 'credit_card' | 'bank_transfer';
      cardHolderName?: string;
      cardNumber?: string;
      cardExpiry?: string;
      cardCvc?: string;
    } = body;

    if (!order || !order.orderNumber || !order.items || order.items.length === 0) {
      return NextResponse.json({ error: 'Sepet veya sipariş bilgileri eksik.' }, { status: 400 });
    }

    let threeDSContent: string | null = null;

    if (paymentMethod === 'credit_card') {
      const cleanCard = (cardNumber || '').replace(/\D/g, '');
      const cleanExp = (cardExpiry || '').trim();
      const cleanCvc = (cardCvc || '').replace(/\D/g, '');

      if (cleanCard.length < 15 || !cleanExp.includes('/') || cleanCvc.length < 3) {
        return NextResponse.json(
          { error: 'Lütfen geçerli kredi kartı bilgilerini eksiksiz giriniz.' },
          { status: 400 }
        );
      }

      const [expMonth, expYear] = cleanExp.split('/');
      const clientIp =
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        '85.34.78.112';

      const paymentReq: PaymentRequest = {
        cardHolderName: cardHolderName || order.customerName,
        cardNumber: cleanCard,
        expireMonth: expMonth.trim(),
        expireYear: expYear.trim(),
        cvv: cleanCvc,
        amount: order.total,
        orderId: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.email,
        customerPhone: order.phone,
        customerAddress: `${order.address.fullAddress} ${order.address.district}/${order.address.city}`,
        customerCity: order.address.city || 'Erzurum',
        ip: clientIp,
      };

      const callbackUrl = `${hostUrl}/api/checkout/callback`;
      const paymentRes = await PaymentService.initiate3DSecure(paymentReq, callbackUrl);

      if (paymentRes.status === 'failure' || !paymentRes.threeDSHtmlContent) {
        return NextResponse.json(
          {
            error:
              paymentRes.errorMessage ||
              'İyzico 3D Secure ödeme başlatılamadı. Kart bilgilerinizi kontrol ediniz.',
          },
          { status: 400 }
        );
      }

      threeDSContent = paymentRes.threeDSHtmlContent;
    }

    // Save order to permanent server database
    const db = getDatabase();
    const orderToSave: CustomerOrder = {
      ...order,
      status: paymentMethod === 'credit_card' ? 'Ödeme Bekliyor' : 'Hazırlanıyor',
    };

    const existingOrderIdx = (db.orders || []).findIndex(
      (o) => o.orderNumber === orderToSave.orderNumber
    );
    const updatedOrders =
      existingOrderIdx >= 0
        ? db.orders.map((o, i) => (i === existingOrderIdx ? orderToSave : o))
        : [orderToSave, ...(db.orders || [])];

    saveDatabase({
      orders: updatedOrders,
    });

    if (paymentMethod === 'credit_card' && threeDSContent) {
      return NextResponse.json({
        status: '3ds_redirect',
        orderNumber: orderToSave.orderNumber,
        orderId: orderToSave.id,
        threeDSHtmlContent: threeDSContent,
      });
    }

    return NextResponse.json({
      success: true,
      orderNumber: orderToSave.orderNumber,
      orderId: orderToSave.id,
    });
  } catch (error: any) {
    console.error('[CHECKOUT_API_ERROR]', error);
    return NextResponse.json(
      { error: error?.message || 'Sipariş işlenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
