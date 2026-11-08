import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/db';
import { PaymentService } from '@/lib/payment/iyzico-service';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const forwardedHost = request.headers.get('x-forwarded-host');
    const host = forwardedHost || request.headers.get('host') || 'veraesarp.com';
    const protocol =
      request.headers.get('x-forwarded-proto') ||
      (host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https');
    const baseUrl = `${protocol}://${host}`;

    let status = '';
    let paymentId = '';
    let conversationId = '';
    let conversationData: string | undefined = undefined;
    let mdStatus = '';

    try {
      const formData = await request.formData();
      status = (formData.get('status') as string) || '';
      paymentId = (formData.get('paymentId') as string) || '';
      conversationId = (formData.get('conversationId') as string) || '';
      conversationData = (formData.get('conversationData') as string) || undefined;
      mdStatus = (formData.get('mdStatus') as string) || '';
    } catch (e) {
      try {
        const text = await request.text();
        const params = new URLSearchParams(text);
        status = params.get('status') || '';
        paymentId = params.get('paymentId') || '';
        conversationId = params.get('conversationId') || '';
        conversationData = params.get('conversationData') || undefined;
        mdStatus = params.get('mdStatus') || '';
      } catch (err2) {
        console.error('Failed to parse 3DS callback body:', err2);
      }
    }

    console.log(
      `[3DS_CALLBACK] Order: ${conversationId}, Status: ${status}, MDStatus: ${mdStatus}, PaymentId: ${paymentId}`
    );

    const is3dsValid =
      (status && status.toLowerCase() === 'success') ||
      mdStatus === '1' ||
      mdStatus === '2' ||
      mdStatus === '3' ||
      mdStatus === '4';

    if (!is3dsValid || !paymentId) {
      const errorMsg = '3D Secure kimlik doğrulaması bankanız tarafından onaylanmadı.';
      if (conversationId) {
        const db = getDatabase();
        const updatedOrders = (db.orders || []).map((o) =>
          o.orderNumber === conversationId || o.id === conversationId
            ? { ...o, status: 'İptal Edildi' as const }
            : o
        );
        saveDatabase({ orders: updatedOrders });
      }
      return renderHtmlRedirect(
        `${baseUrl}/odeme?status=error&message=${encodeURIComponent(errorMsg)}`
      );
    }

    const paymentResult = await PaymentService.complete3DSecure({
      paymentId,
      conversationId,
      conversationData,
    });

    if (paymentResult.status !== 'success') {
      const errorMsg = paymentResult.errorMessage || '3D Secure ödeme çekimi tamamlanamadı.';
      if (conversationId) {
        const db = getDatabase();
        const updatedOrders = (db.orders || []).map((o) =>
          o.orderNumber === conversationId || o.id === conversationId
            ? { ...o, status: 'İptal Edildi' as const }
            : o
        );
        saveDatabase({ orders: updatedOrders });
      }
      return renderHtmlRedirect(
        `${baseUrl}/odeme?status=error&message=${encodeURIComponent(errorMsg)}`
      );
    }

    // Update order status to 'Hazırlanıyor'
    if (conversationId) {
      const db = getDatabase();
      const updatedOrders = (db.orders || []).map((o) =>
        o.orderNumber === conversationId || o.id === conversationId
          ? { ...o, status: 'Hazırlanıyor' as const }
          : o
      );
      saveDatabase({ orders: updatedOrders });
    }

    return renderHtmlRedirect(
      `${baseUrl}/odeme?status=success&orderNo=${encodeURIComponent(conversationId)}`
    );
  } catch (error: any) {
    console.error('[3DS_CALLBACK_CRITICAL_ERROR]', error);
    return renderHtmlRedirect(
      `/odeme?status=error&message=${encodeURIComponent(
        error?.message || 'Beklenmeyen bir hata oluştu.'
      )}`
    );
  }
}

export async function GET(request: NextRequest) {
  const forwardedHost = request.headers.get('x-forwarded-host');
  const host = forwardedHost || request.headers.get('host') || 'veraesarp.com';
  const protocol = request.headers.get('x-forwarded-proto') || 'https';
  return NextResponse.redirect(`${protocol}://${host}/odeme`);
}

function renderHtmlRedirect(targetUrl: string) {
  const html = `
    <!DOCTYPE html>
    <html lang="tr">
      <head>
        <meta charset="utf-8">
        <title>Vera Eşarp — Ödeme Sonucu Yönlendiriliyor...</title>
        <meta http-equiv="refresh" content="0;url=${targetUrl}">
        <script>
          window.location.href = "${targetUrl}";
        </script>
      </head>
      <body style="font-family: Georgia, serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #1C1B1A; color: #F8F5EF;">
        <div style="text-align: center; border: 1px solid #B49A6A; padding: 32px 48px;">
          <h2 style="color: #B49A6A; font-weight: normal; margin-bottom: 8px;">İyzico 3D Secure İşlemi Tamamlandı</h2>
          <p style="font-size: 13px; color: #8C857B;">Sipariş onay sayfasına yönlendiriliyorsunuz, lütfen bekleyiniz...</p>
        </div>
      </body>
    </html>
  `;
  return new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
