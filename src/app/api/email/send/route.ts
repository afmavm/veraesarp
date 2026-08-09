import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'prisma', 'veraesarp_db.json');

function getSavedDbSettings() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf-8');
      const json = JSON.parse(data);
      return json.siteSettings?.emailSettings || null;
    }
  } catch (e) {
    console.error('Failed to read db file in email route', e);
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { recipient, subject, htmlContent, customSettings, testOnly } = body;

    if (!recipient || !subject) {
      return NextResponse.json(
        { success: false, error: 'E-posta alıcısı (recipient) ve konusu (subject) gereklidir.' },
        { status: 400 }
      );
    }

    // Determine email server configuration
    const savedSettings = getSavedDbSettings();
    const config = customSettings || savedSettings || {
      isEnabled: true,
      provider: 'smtp',
      smtpHost: process.env.SMTP_HOST || 'mail.veraesarp.com',
      smtpPort: Number(process.env.SMTP_PORT) || 587,
      smtpUser: process.env.SMTP_USER || 'destek@veraesarp.com',
      smtpPassword: process.env.SMTP_PASS || '',
      senderName: process.env.SMTP_FROM || 'Vera Eşarp Müşteri Hizmetleri',
      senderEmail: process.env.SMTP_USER || 'destek@veraesarp.com',
      encryption: 'tls',
    };

    if (!config.isEnabled && !testOnly) {
      return NextResponse.json(
        { success: false, error: 'E-posta sunucusu yönetim panelinden pasif duruma getirilmiş.' },
        { status: 400 }
      );
    }

    const host = (config.smtpHost || '').trim();
    const port = Number(config.smtpPort) || 587;
    const user = (config.smtpUser || '').trim();
    const pass = (config.smtpPassword || '').trim();
    const isSecure = port === 465 || config.encryption === 'ssl';

    console.log(`[REAL EMAIL DISPATCH] Attempting SMTP connection to ${host}:${port} (${user})...`);

    // Create real SMTP Transporter using nodemailer
    const transporter = nodemailer.createTransport({
      host: host || 'mail.veraesarp.com',
      port: port,
      secure: isSecure,
      auth: user && pass ? { user: user, pass: pass } : undefined,
      tls: {
        rejectUnauthorized: false, // Prevents self-signed certificate rejection
      },
      connectionTimeout: 10000,
    });

    // If test connection requested, verify transport
    if (testOnly) {
      await transporter.verify();
    }

    const senderName = config.senderName || 'Vera Eşarp Müşteri Hizmetleri';
    const senderEmail = config.senderEmail || user || 'destek@veraesarp.com';

    // Dispatch real email through SMTP socket
    const info = await transporter.sendMail({
      from: `"${senderName}" <${senderEmail}>`,
      to: recipient,
      subject: subject,
      html: htmlContent,
    });

    console.log(`[REAL EMAIL SENT SUCCESS] Message ID: ${info.messageId} to ${recipient}`);

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      response: info.response,
      recipient: recipient,
    });
  } catch (error: any) {
    console.error('[REAL EMAIL ERROR]', error);
    const errorMessage = error?.message || 'SMTP sunucu bağlantı hatası oluştu.';
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: error?.response || error?.code || 'SMTP_TRANSPORTER_ERROR',
      },
      { status: 500 }
    );
  }
}
