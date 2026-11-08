import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getDatabase, saveDatabase } from '@/lib/db';
import { PaymentService } from '@/lib/payment/iyzico-service';

export const dynamic = 'force-dynamic';

function updateEnvFile(key: string, value: string) {
  try {
    const envPath = path.join(process.cwd(), '.env');
    let content = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
    const regex = new RegExp(`^${key}=.*$`, 'm');

    if (regex.test(content)) {
      content = content.replace(regex, `${key}=${value}`);
    } else {
      content += (content.endsWith('\n') || !content ? '' : '\n') + `${key}=${value}\n`;
    }

    fs.writeFileSync(envPath, content, 'utf8');
    process.env[key] = value;
  } catch (e) {
    process.env[key] = value;
  }
}

export async function GET() {
  try {
    const creds = PaymentService.getCredentials();
    const isLive = creds.baseUrl.includes('api.iyzipay.com') && !creds.baseUrl.includes('sandbox');

    return NextResponse.json({
      apiKey: creds.apiKey,
      secretKey: creds.secretKey,
      baseUrl: creds.baseUrl,
      isLive,
      status: creds.apiKey && creds.secretKey ? 'ACTIVE' : 'INACTIVE',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Ayarlar okunamadı.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { apiKey, secretKey, baseUrl, action } = body;

    if (!apiKey || !secretKey) {
      return NextResponse.json(
        { error: 'API Anahtarı ve Güvenlik Anahtarı zorunludur.' },
        { status: 400 }
      );
    }

    const resolvedBaseUrl = (baseUrl || 'https://api.iyzipay.com').trim();
    const testResult = await PaymentService.testConnection(apiKey, secretKey, resolvedBaseUrl);

    if (action === 'test') {
      if (!testResult.success) {
        return NextResponse.json({ error: testResult.message }, { status: 400 });
      }
      return NextResponse.json({ success: true, message: testResult.message });
    }

    // Save to .env and runtime
    updateEnvFile('IYZICO_API_KEY', apiKey.trim());
    updateEnvFile('IYZICO_SECRET_KEY', secretKey.trim());
    updateEnvFile('IYZICO_BASE_URL', resolvedBaseUrl);

    // Save permanently to veraesarp_db.json
    const currentDb = getDatabase();
    saveDatabase({
      siteSettings: {
        ...currentDb.siteSettings,
        iyzicoSettings: {
          apiKey: apiKey.trim(),
          secretKey: secretKey.trim(),
          baseUrl: resolvedBaseUrl,
          isEnabled: true,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: testResult.success
        ? 'İyzico Sanal POS ayarları başarıyla kaydedildi ve canlı bağlantı doğrulandı!'
        : 'İyzico Sanal POS ayarları kaydedildi. (Test yanıtı: ' + testResult.message + ')',
      testResult,
    });
  } catch (error: any) {
    console.error('İyzico settings save error:', error);
    return NextResponse.json(
      { error: error.message || 'Ayarlar kaydedilemedi.' },
      { status: 500 }
    );
  }
}
