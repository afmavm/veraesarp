import { NextResponse } from 'next/server';
import { OrderService } from '@/services/order.service';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Server-side Input Validation
    if (!body.customerName || !body.email || !body.fullAddress || !body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Lütfen sipariş için tüm zorunlu alanları doldurunuz.' },
        { status: 400 }
      );
    }

    // Process order with server-side transaction & price snapshot
    const order = await OrderService.createOrder({
      customerName: String(body.customerName).trim(),
      email: String(body.email).trim().toLowerCase(),
      phone: String(body.phone || '').trim(),
      city: String(body.city || 'Erzurum').trim(),
      district: String(body.district || 'Yakutiye').trim(),
      fullAddress: String(body.fullAddress).trim(),
      items: body.items,
      paymentMethod: String(body.paymentMethod || 'Kredi Kartı').trim(),
      couponCode: body.couponCode ? String(body.couponCode).trim() : undefined,
      shippingFee: Number(body.shippingFee) || 0,
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('API /api/orders error', error);
    return NextResponse.json(
      { success: false, error: 'Sipariş işlenirken bir sorun oluştu. Lütfen tekrar deneyiniz.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const orders = await OrderService.getAllOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('API /api/orders GET error', error);
    return NextResponse.json(
      { success: false, error: 'Siparişler listelenirken bir sorun oluştu.' },
      { status: 500 }
    );
  }
}
