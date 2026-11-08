import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { getDatabase } from '@/lib/db';

export interface PaymentRequest {
  cardHolderName?: string;
  cardNumber: string;
  expireMonth: string;
  expireYear: string;
  cvv: string;
  amount: number;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
  customerCity?: string;
  customerIdentity?: string;
  ip?: string;
  basketItems?: Array<{
    id: string;
    name: string;
    category1?: string;
    price: number;
  }>;
}

export interface PaymentResponse {
  status: 'success' | 'failure';
  transactionId?: string;
  errorMessage?: string;
  errorCode?: string;
  threeDSHtmlContent?: string;
}

function loadEnvKey(key: string, defaultValue: string = ''): string {
  if (process.env[key] && process.env[key]?.trim()) {
    return process.env[key]!.trim();
  }
  try {
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(new RegExp(`^${key}=(.*)$`, 'm'));
      if (match && match[1]) {
        const val = match[1].replace(/['"]/g, '').trim();
        if (val) return val;
      }
    }
  } catch (e) {
    // ignore
  }
  return defaultValue;
}

function formatIyzicoPrice(price: number | string): string {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  if (!isFinite(num)) return '0.0';
  const str = parseFloat(num.toFixed(2)).toString();
  return str.indexOf('.') === -1 ? `${str}.0` : str;
}

function generateRandomString(): string {
  return `${Date.now()}${Math.random().toString(16).slice(2, 10)}`;
}

function generateIyzicoHeaders(
  apiKey: string,
  secretKey: string,
  uriPath: string,
  bodyObj?: Record<string, any>
): Record<string, string> {
  const randomString = generateRandomString();
  const bodyString = bodyObj && Object.keys(bodyObj).length > 0 ? JSON.stringify(bodyObj) : '';
  const payloadToSign = randomString + uriPath + bodyString;

  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(payloadToSign)
    .digest('hex');

  const authParams = [
    `apiKey:${apiKey}`,
    `randomKey:${randomString}`,
    `signature:${signature}`,
  ];
  const base64Auth = Buffer.from(authParams.join('&')).toString('base64');

  return {
    'Content-Type': 'application/json',
    'x-iyzi-rnd': randomString,
    'x-iyzi-client-version': 'iyzipay-node-2.0.67',
    Authorization: `IYZWSv2 ${base64Auth}`,
  };
}

export class PaymentService {
  static getCredentials(): { apiKey: string; secretKey: string; baseUrl: string } {
    try {
      const db = getDatabase();
      const dbIyzico = db.siteSettings?.iyzicoSettings;
      if (dbIyzico?.apiKey && dbIyzico?.secretKey) {
        return {
          apiKey: dbIyzico.apiKey.trim(),
          secretKey: dbIyzico.secretKey.trim(),
          baseUrl: (dbIyzico.baseUrl || 'https://api.iyzipay.com').trim().replace(/\/+$/, ''),
        };
      }
    } catch (e) {
      // fallback to env
    }

    const apiKey = loadEnvKey('IYZICO_API_KEY', 'lRyUheOJsBN7VJ4TQZt671dlNT7a0fKz');
    const secretKey = loadEnvKey('IYZICO_SECRET_KEY', 'FqdMOhZ8Nrr9wU5DNcDXhqLlQb8CRF3d');
    const baseUrl = loadEnvKey('IYZICO_BASE_URL', 'https://api.iyzipay.com').replace(/\/+$/, '');

    return { apiKey, secretKey, baseUrl };
  }

  static async testConnection(
    customApiKey?: string,
    customSecretKey?: string,
    customBaseUrl?: string
  ): Promise<{ success: boolean; message: string; raw?: any }> {
    const creds = this.getCredentials();
    const apiKey = (customApiKey || creds.apiKey).trim();
    const secretKey = (customSecretKey || creds.secretKey).trim();
    const baseUrl = (customBaseUrl || creds.baseUrl).trim().replace(/\/+$/, '');
    const uriPath = '/payment/test';

    try {
      const headers = generateIyzicoHeaders(apiKey, secretKey, uriPath);
      const res = await fetch(`${baseUrl}${uriPath}`, {
        method: 'GET',
        headers,
      });
      const result = await res.json();

      if (result?.status === 'success') {
        return {
          success: true,
          message: 'İyzico bağlantısı başarılı! Sistem canlı 3D Secure ödeme almaya hazırdır.',
          raw: result,
        };
      }
      return {
        success: false,
        message:
          result?.errorMessage ||
          'İyzico sunucularına bağlanılamadı. Anahtarlarınızı kontrol ediniz.',
        raw: result,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || 'İyzico sunucularına erişilemedi.',
      };
    }
  }

  private static buildPaymentData(request: PaymentRequest, callbackUrl?: string) {
    const names = (request.customerName || 'Müşteri').trim().split(/\s+/);
    const firstName = names[0] || 'Müşteri';
    const lastName = names.slice(1).join(' ') || 'Alıcı';

    const formattedAmount = formatIyzicoPrice(request.amount);
    const rawPhone = (request.customerPhone || '+905344902557').replace(/\s+/g, '');
    const formattedPhone = rawPhone.startsWith('+')
      ? rawPhone
      : '+90' + rawPhone.replace(/^0/, '');

    const userIp =
      request.ip && request.ip !== '::1' && request.ip !== '127.0.0.1'
        ? request.ip
        : '85.34.78.112';

    const deliveryAddress = request.customerAddress || 'Vera Eşarp Teslimat Adresi';
    const deliveryCity = request.customerCity || 'Erzurum';

    const payload: Record<string, any> = {
      locale: 'tr',
      conversationId: request.orderId,
      price: formattedAmount,
      paidPrice: formattedAmount,
      installment: 1,
      paymentChannel: 'WEB',
      basketId: 'B-' + request.orderId,
      paymentGroup: 'PRODUCT',
      paymentCard: {
        cardHolderName: request.cardHolderName || request.customerName,
        cardNumber: request.cardNumber.replace(/\D/g, ''),
        expireMonth: request.expireMonth.padStart(2, '0'),
        expireYear:
          request.expireYear.length === 2
            ? '20' + request.expireYear
            : request.expireYear,
        cvc: request.cvv,
        registerCard: 0,
      },
      buyer: {
        id:
          'BY-' +
          (request.customerEmail
            ? request.customerEmail.replace(/[^a-zA-Z0-9]/g, '')
            : Date.now()),
        name: firstName,
        surname: lastName,
        identityNumber: request.customerIdentity || '11111111111',
        email: request.customerEmail || 'destek@veraesarp.com',
        gsmNumber: formattedPhone,
        registrationDate: '2026-01-01 12:00:00',
        lastLoginDate: '2026-09-01 12:00:00',
        registrationAddress: deliveryAddress,
        city: deliveryCity,
        country: 'Turkey',
        zipCode: '25100',
        ip: userIp,
      },
      shippingAddress: {
        address: deliveryAddress,
        zipCode: '25100',
        contactName: request.customerName,
        city: deliveryCity,
        country: 'Turkey',
      },
      billingAddress: {
        address: deliveryAddress,
        zipCode: '25100',
        contactName: request.customerName,
        city: deliveryCity,
        country: 'Turkey',
      },
      basketItems: [
        {
          id: 'BI-' + request.orderId,
          price: formattedAmount,
          name: 'Vera Eşarp Sipariş ' + request.orderId,
          category1: 'Eşarp & Şal Koleksiyonu',
          category2: 'Moda & Aksesuar',
          itemType: 'PHYSICAL',
        },
      ],
      currency: 'TRY',
    };

    if (callbackUrl) {
      payload.callbackUrl = callbackUrl;
    }

    return payload;
  }

  /**
   * 3D Secure Ödeme Başlatma (/payment/3dsecure/initialize)
   */
  static async initiate3DSecure(
    request: PaymentRequest,
    callbackUrl: string
  ): Promise<PaymentResponse> {
    const { apiKey, secretKey, baseUrl } = this.getCredentials();
    const uriPath = '/payment/3dsecure/initialize';
    const body = this.buildPaymentData(request, callbackUrl);

    try {
      const headers = generateIyzicoHeaders(apiKey, secretKey, uriPath, body);
      const res = await fetch(`${baseUrl}${uriPath}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      const result = await res.json();

      if (result?.status !== 'success') {
        const errMsg = result?.errorMessage || '3D Secure başlatılamadı.';
        console.error(`[3DS_INIT_ERROR] Order: ${request.orderId}`, result);
        return {
          status: 'failure',
          errorMessage: errMsg,
          errorCode: result?.errorCode,
        };
      }

      console.log(`[3DS_INIT_SUCCESS] Order: ${request.orderId} initialized 3DS successfully.`);
      return {
        status: 'success',
        threeDSHtmlContent: result.threeDSHtmlContent,
      };
    } catch (err: any) {
      console.error(`[3DS_INIT_EXCEPTION] Order: ${request.orderId}`, err);
      return {
        status: 'failure',
        errorMessage: err?.message || 'İyzico 3D Secure servisine bağlanılamadı.',
      };
    }
  }

  /**
   * 3D Secure Ödeme Tamamlama (/payment/3dsecure/auth)
   */
  static async complete3DSecure(params: {
    paymentId: string;
    conversationId: string;
    conversationData?: string;
  }): Promise<PaymentResponse> {
    const { apiKey, secretKey, baseUrl } = this.getCredentials();
    const uriPath = '/payment/3dsecure/auth';

    const body: Record<string, any> = {
      locale: 'tr',
      conversationId: params.conversationId,
      paymentId: params.paymentId,
    };

    if (params.conversationData) {
      body.conversationData = params.conversationData;
    }

    try {
      const headers = generateIyzicoHeaders(apiKey, secretKey, uriPath, body);
      const res = await fetch(`${baseUrl}${uriPath}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      const result = await res.json();

      if (result?.status !== 'success') {
        const errMsg = result?.errorMessage || '3D Secure ödeme onaylanamadı.';
        console.error(`[3DS_COMPLETE_ERROR] ConversationId: ${params.conversationId}`, result);
        return {
          status: 'failure',
          errorMessage: errMsg,
          errorCode: result?.errorCode,
        };
      }

      console.log(
        `[3DS_COMPLETE_SUCCESS] ConversationId: ${params.conversationId}, PaymentId: ${result.paymentId}`
      );
      return {
        status: 'success',
        transactionId: result.paymentId,
      };
    } catch (err: any) {
      console.error(`[3DS_COMPLETE_EXCEPTION] ConversationId: ${params.conversationId}`, err);
      return {
        status: 'failure',
        errorMessage: err?.message || '3D Secure ödeme tamamlanırken hata oluştu.',
      };
    }
  }

  /**
   * Doğrudan / Non-3D Ödeme (/payment/auth)
   */
  static async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    const { apiKey, secretKey, baseUrl } = this.getCredentials();
    const uriPath = '/payment/auth';
    const body = this.buildPaymentData(request);

    try {
      const headers = generateIyzicoHeaders(apiKey, secretKey, uriPath, body);
      const res = await fetch(`${baseUrl}${uriPath}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      const result = await res.json();

      if (result?.status !== 'success') {
        const errMsg = result?.errorMessage || 'Ödeme işlemi gerçekleştirilemedi.';
        return {
          status: 'failure',
          errorMessage: errMsg,
          errorCode: result?.errorCode,
        };
      }

      return {
        status: 'success',
        transactionId: result.paymentId,
      };
    } catch (err: any) {
      return {
        status: 'failure',
        errorMessage: err?.message || 'Ödeme servisine bağlanılamadı.',
      };
    }
  }
}
