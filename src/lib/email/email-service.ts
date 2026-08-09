// Vera Eşarp Luxury Email Notification Engine & Template Manager

export interface SentEmailLog {
  id: string;
  recipient: string;
  subject: string;
  type: 'welcome' | 'password_reset' | 'order_confirmation' | 'order_status' | 'campaign' | 'newsletter';
  sentAt: string;
  status: string;
  htmlContent: string;
}

// Global in-memory & localStorage log store
let emailLogsCache: SentEmailLog[] = [];

export function getEmailLogs(): SentEmailLog[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('veraesarp_email_logs');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {}
  }
  return emailLogsCache;
}

export function updateLogStatus(id: string, newStatus: string) {
  emailLogsCache = emailLogsCache.map((l) => (l.id === id ? { ...l, status: newStatus } : l));
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('veraesarp_email_logs', JSON.stringify(emailLogsCache.slice(0, 100)));
      window.dispatchEvent(new CustomEvent('veraesarp_email_sent', { detail: { id, newStatus } }));
    } catch (e) {}
  }
}

function saveEmailLog(log: SentEmailLog) {
  emailLogsCache = [log, ...emailLogsCache];
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('veraesarp_email_logs', JSON.stringify(emailLogsCache.slice(0, 100)));
      window.dispatchEvent(new CustomEvent('veraesarp_email_sent', { detail: log }));
    } catch (e) {}
  }
}

// Real Server-Side Dispatcher via Next.js API Route /api/email/send
async function dispatchRealServerEmail(log: SentEmailLog) {
  if (typeof window === 'undefined') return;
  try {
    const res = await fetch('/api/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: log.recipient,
        subject: log.subject,
        htmlContent: log.htmlContent,
      }),
    });

    const data = await res.json();
    if (data.success) {
      updateLogStatus(log.id, 'Delivered (Gerçek SMTP İletildi)');
    } else {
      const errDetail = data.error || 'SMTP Gönderilemedi';
      updateLogStatus(log.id, `Hata: ${errDetail}`);
      window.dispatchEvent(
        new CustomEvent('veraesarp_email_error', {
          detail: { recipient: log.recipient, error: errDetail },
        })
      );
    }
  } catch (err: any) {
    updateLogStatus(log.id, 'Hata: Sunucu Bağlantı Hatası');
    window.dispatchEvent(
      new CustomEvent('veraesarp_email_error', {
        detail: { recipient: log.recipient, error: 'Sunucuya ulaşılamadı' },
      })
    );
  }
}

// -------------------------------------------------------------
// LUXURY HTML EMAIL TEMPLATES
// -------------------------------------------------------------

const EMAIL_HEADER_HTML = `
  <div style="background-color: #1C1B1A; border-bottom: 3px solid #B49A6A; padding: 25px; text-align: center;">
    <img src="https://veraesarp.com/logo.png" alt="Vera Eşarp Logo" style="max-height: 75px; width: auto; margin-bottom: 12px; display: inline-block;" />
    <h1 style="font-family: 'Playfair Display', Georgia, serif; color: #B49A6A; font-size: 26px; font-weight: normal; margin: 0; letter-spacing: 3px; text-transform: uppercase;">
      VERA EŞARP
    </h1>
    <p style="color: #8C857B; font-size: 11px; margin-top: 5px; text-transform: uppercase; letter-spacing: 2px;">
      ÖZEL İPEK VE ŞAL KOLEKSİYONU — ERZURUM
    </p>
  </div>
`;

const EMAIL_FOOTER_HTML = `
  <div style="background-color: #1C1B1A; border-top: 1px solid #3A3835; padding: 20px; text-align: center; color: #8C857B; font-size: 11px; line-height: 1.6;">
    <p style="margin: 0 0 8px 0; color: #F8F5EF;">Vera Eşarp Müşteri Hizmetleri</p>
    <p style="margin: 0;">Lalapaşa Mah. Pelit Meydanı Cad. Yakutiye / ERZURUM</p>
    <p style="margin: 0;">Destek Hattı: +90 (534) 490 25 57 • <a href="mailto:destek@veraesarp.com" style="color: #B49A6A; text-decoration: none;">destek@veraesarp.com</a></p>
    <p style="margin-top: 12px; font-size: 10px; color: #5A5652;">© 2026 VERA EŞARP. Tüm Hakları Saklıdır.</p>
  </div>
`;

// 1. YENİ KAYIT (HOŞ GELDİN E-POSTASI)
export function sendWelcomeEmail(user: { name: string; email: string }) {
  const subject = `✨ Hoş Geldiniz Sayın ${user.name} — %10 İndirim Kuponunuz Tanımlandı!`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #F8F5EF; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #E6DFD5;">
      ${EMAIL_HEADER_HTML}
      <div style="padding: 30px 25px; background-color: #FFFFFF; color: #242321;">
        <h2 style="font-family: Georgia, serif; color: #242321; font-size: 22px; margin-top: 0;">Aramıza Hoş Geldiniz!</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #5A5652;">
          Sayın <strong>${user.name}</strong>,
        </p>
        <p style="font-size: 14px; line-height: 1.6; color: #5A5652;">
          Vera Eşarp ayrıcalıklı VIP dünyasına üyeliğiniz başarıyla tamamlanmıştır. İpek dokuma şal ve eşarp koleksiyonumuzda kullanabileceğiniz %10 Hoş Geldin İndirimi hesabınıza aktarılmıştır.
        </p>
        
        <div style="background-color: #F8F5EF; border: 1px dashed #B49A6A; padding: 20px; text-align: center; margin: 25px 0;">
          <span style="font-size: 11px; text-transform: uppercase; tracking-wider; color: #8C857B; display: block; margin-bottom: 5px;">HOŞ GELDİN İNDİRİM KODUNUZ</span>
          <strong style="font-family: Georgia, serif; font-size: 24px; color: #B49A6A; letter-spacing: 2px;">VERAWELCOME10</strong>
          <span style="font-size: 11px; color: #5A5652; display: block; margin-top: 5px;">₺1.000 ve üzeri tüm alışverişlerinizde geçerlidir.</span>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <a href="http://localhost:3000/kategori/yeni-gelenler" style="background-color: #242321; color: #F8F5EF; text-decoration: none; padding: 12px 28px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; display: inline-block;">
            Koleksiyonları Keşfet →
          </a>
        </div>
      </div>
      ${EMAIL_FOOTER_HTML}
    </div>
  `;

  const log: SentEmailLog = {
    id: `eml-${Date.now()}`,
    recipient: user.email,
    subject,
    type: 'welcome',
    sentAt: new Date().toLocaleString('tr-TR'),
    status: 'Sending (SMTP Gönderiliyor...)',
    htmlContent,
  };

  saveEmailLog(log);
  dispatchRealServerEmail(log);
  return log;
}

// 2. ŞİFREMİ UNUTTUM (GÜVENLİ ŞİFRE SIFIRLAMA)
export function sendPasswordResetEmail(email: string, resetCode: string) {
  const subject = `🔒 Vera Eşarp — Şifre Sıfırlama Güvenlik Kodunuz (${resetCode})`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #F8F5EF; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #E6DFD5;">
      ${EMAIL_HEADER_HTML}
      <div style="padding: 30px 25px; background-color: #FFFFFF; color: #242321;">
        <h2 style="font-family: Georgia, serif; color: #242321; font-size: 20px; margin-top: 0;">Şifre Sıfırlama Talebi</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #5A5652;">
          Vera Eşarp hesabınız için bir şifre sıfırlama talebinde bulunuldu. Şifrenizi yenilemek için aşağıdaki 6 haneli güvenlik doğrulama kodunu kullanabilirsiniz:
        </p>
        
        <div style="background-color: #1C1B1A; border: 1px solid #B49A6A; padding: 20px; text-align: center; margin: 25px 0;">
          <span style="font-size: 11px; text-transform: uppercase; color: #8C857B; display: block; margin-bottom: 5px;">GÜVENLİK DOĞRULAMA KODUNUZ</span>
          <strong style="font-family: monospace; font-size: 32px; color: #B49A6A; letter-spacing: 6px;">${resetCode}</strong>
          <span style="font-size: 11px; color: #8C857B; display: block; margin-top: 8px;">Bu kod 15 dakika boyunca geçerlidir.</span>
        </div>

        <p style="font-size: 12px; color: #8C857B; line-height: 1.5;">
          * Eğer bu talebi siz yapmadıysanız, lütfen bu e-postayı dikkate almayınız. Hesabınız güvendedir.
        </p>
      </div>
      ${EMAIL_FOOTER_HTML}
    </div>
  `;

  const log: SentEmailLog = {
    id: `eml-${Date.now()}`,
    recipient: email,
    subject,
    type: 'password_reset',
    sentAt: new Date().toLocaleString('tr-TR'),
    status: 'Sending (SMTP Gönderiliyor...)',
    htmlContent,
  };

  saveEmailLog(log);
  dispatchRealServerEmail(log);
  return log;
}

// 3. YENİ SİPARİŞ (SİPARİŞ ONAY VE DETAYLI FATURA)
export function sendOrderConfirmationEmail(order: {
  orderNumber: string;
  customerName: string;
  email: string;
  total: number;
  paymentMethod: string;
  items: { productName: string; color: string; quantity: number; price: number }[];
}) {
  const subject = `🛍️ Siparişiniz Alındı! Sipariş No: ${order.orderNumber}`;
  
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #F8F5EF; font-size: 13px;">${item.productName} (${item.color})</td>
        <td style="padding: 10px; border-bottom: 1px solid #F8F5EF; text-align: center; font-size: 13px;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #F8F5EF; text-align: right; font-size: 13px; font-weight: bold;">₺${(item.price * item.quantity).toLocaleString('tr-TR')}</td>
      </tr>
    `
    )
    .join('');

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #F8F5EF; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #E6DFD5;">
      ${EMAIL_HEADER_HTML}
      <div style="padding: 30px 25px; background-color: #FFFFFF; color: #242321;">
        <h2 style="font-family: Georgia, serif; color: #242321; font-size: 22px; margin-top: 0;">Siparişiniz İçin Teşekkür Ederiz!</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #5A5652;">
          Sayın <strong>${order.customerName}</strong>, <strong>${order.orderNumber}</strong> numaralı siparişiniz başarıyla alınmış ve özel hediye kutusunda hazırlanmak üzere işleme alınmıştır.
        </p>

        <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #B49A6A; padding-bottom: 6px; margin-top: 25px;">Sipariş Özeti</h3>
        <table style="w-full; width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="background-color: #F8F5EF; color: #8C857B; font-size: 11px; text-transform: uppercase;">
              <th style="padding: 8px; text-align: left;">Ürün</th>
              <th style="padding: 8px; text-align: center;">Adet</th>
              <th style="padding: 8px; text-align: right;">Tutar</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="margin-top: 20px; text-align: right; font-size: 14px; color: #242321;">
          <p style="margin: 4px 0;">Ödeme Tipi: <strong>${order.paymentMethod}</strong></p>
          <p style="font-size: 18px; font-family: Georgia, serif; color: #B49A6A; margin: 8px 0;">Toplam: <strong>₺${order.total.toLocaleString('tr-TR')}</strong></p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <a href="http://localhost:3000/kargo-takip?kod=${order.orderNumber}" style="background-color: #242321; color: #F8F5EF; text-decoration: none; padding: 12px 28px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; display: inline-block;">
            Sipariş &amp; Kargo Takibi →
          </a>
        </div>
      </div>
      ${EMAIL_FOOTER_HTML}
    </div>
  `;

  const log: SentEmailLog = {
    id: `eml-${Date.now()}`,
    recipient: order.email,
    subject,
    type: 'order_confirmation',
    sentAt: new Date().toLocaleString('tr-TR'),
    status: 'Sending (SMTP Gönderiliyor...)',
    htmlContent,
  };

  saveEmailLog(log);
  dispatchRealServerEmail(log);
  return log;
}

// 4. SİPARİŞ AŞAMALARI (KARGO VE TESLİMAT BİLDİRİMİ)
export function sendOrderStatusUpdateEmail(order: {
  orderNumber: string;
  customerName: string;
  email: string;
  status: string;
  carrier?: string;
  trackingCode?: string;
}) {
  const isShipped = order.status === 'Kargoda';
  const subject = isShipped
    ? `🚚 Siparişiniz Kargoya Verildi! (Kargo Takip: ${order.trackingCode || 'Yurtiçi Kargo'})`
    : `✅ Siparişiniz Teslim Edildi! Sipariş No: ${order.orderNumber}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #F8F5EF; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #E6DFD5;">
      ${EMAIL_HEADER_HTML}
      <div style="padding: 30px 25px; background-color: #FFFFFF; color: #242321;">
        <h2 style="font-family: Georgia, serif; color: #242321; font-size: 20px; margin-top: 0;">
          ${isShipped ? '🚚 Siparişiniz Yola Çıktı!' : '✅ Siparişiniz Teslim Edildi!'}
        </h2>
        <p style="font-size: 14px; line-height: 1.6; color: #5A5652;">
          Sayın <strong>${order.customerName}</strong>, <strong>${order.orderNumber}</strong> numaralı siparişinizin güncel durumu <strong>"${order.status}"</strong> olarak güncellenmiştir.
        </p>

        <div style="background-color: #F8F5EF; border-left: 4px solid #B49A6A; padding: 15px; margin: 20px 0; font-size: 13px;">
          <p style="margin: 0 0 5px 0;">Kargo Firması: <strong>${order.carrier || 'Yurtiçi Kargo'}</strong></p>
          <p style="margin: 0;">Kargo Takip Numarası: <strong>${order.trackingCode || 'VER-' + Date.now()}</strong></p>
        </div>

        <div style="text-align: center; margin-top: 25px;">
          <a href="http://localhost:3000/kargo-takip?kod=${order.orderNumber}" style="background-color: #B49A6A; color: #F8F5EF; text-decoration: none; padding: 12px 28px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; display: inline-block;">
            Canlı Kargo Takibi Yap →
          </a>
        </div>
      </div>
      ${EMAIL_FOOTER_HTML}
    </div>
  `;

  const log: SentEmailLog = {
    id: `eml-${Date.now()}`,
    recipient: order.email,
    subject,
    type: 'order_status',
    sentAt: new Date().toLocaleString('tr-TR'),
    status: 'Sending (SMTP Gönderiliyor...)',
    htmlContent,
  };

  saveEmailLog(log);
  dispatchRealServerEmail(log);
  return log;
}

// 5. KAMPANYA HABERLERİ (ÖZEL KAMPANYA E-POSTASI)
export function sendCampaignPromoEmail(email: string, title: string, contentText: string, promoCode?: string) {
  const subject = `🔥 Özel İndirim Fırsatı: ${title}`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #F8F5EF; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #E6DFD5;">
      ${EMAIL_HEADER_HTML}
      <div style="padding: 30px 25px; background-color: #FFFFFF; color: #242321;">
        <span style="font-size: 11px; font-weight: bold; color: #B49A6A; text-transform: uppercase; tracking-wider;">VIP KAMPANYA HABERİ</span>
        <h2 style="font-family: Georgia, serif; color: #242321; font-size: 22px; margin-top: 6px;">${title}</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #5A5652;">
          ${contentText}
        </p>

        ${
          promoCode
            ? `
          <div style="background-color: #1C1B1A; border: 1px solid #B49A6A; padding: 20px; text-align: center; margin: 25px 0;">
            <span style="font-size: 11px; text-transform: uppercase; color: #8C857B; display: block; margin-bottom: 5px;">KAMPANYA KODUNUZ</span>
            <strong style="font-family: Georgia, serif; font-size: 24px; color: #B49A6A; letter-spacing: 2px;">${promoCode}</strong>
          </div>
        `
            : ''
        }

        <div style="text-align: center; margin-top: 30px;">
          <a href="http://localhost:3000/kategori/kampanyalar" style="background-color: #242321; color: #F8F5EF; text-decoration: none; padding: 12px 28px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; display: inline-block;">
            Fırsatları İncele →
          </a>
        </div>
      </div>
      ${EMAIL_FOOTER_HTML}
    </div>
  `;

  const log: SentEmailLog = {
    id: `eml-${Date.now()}`,
    recipient: email,
    subject,
    type: 'campaign',
    sentAt: new Date().toLocaleString('tr-TR'),
    status: 'Sending (SMTP Gönderiliyor...)',
    htmlContent,
  };

  saveEmailLog(log);
  dispatchRealServerEmail(log);
  return log;
}

// 6. HABER BÜLTENİ (NEWSLETTER ABONELİĞİ)
export function sendNewsletterConfirmationEmail(email: string) {
  const subject = `📩 Vera Eşarp Stil Bültenine Hoş Geldiniz!`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #F8F5EF; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #E6DFD5;">
      ${EMAIL_HEADER_HTML}
      <div style="padding: 30px 25px; background-color: #FFFFFF; color: #242321;">
        <h2 style="font-family: Georgia, serif; color: #242321; font-size: 20px; margin-top: 0;">E-Bülten Aboneliğiniz Onaylandı</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #5A5652;">
          <strong>${email}</strong> e-posta adresiniz Vera Eşarp Stil Bültenine başarıyla kaydedilmiştir. Yeni sezon ipek koleksiyonlarımızdan, özel indirimlerden ve moda ipuçlarından ilk siz haberdar olacaksınız.
        </p>

        <div style="text-align: center; margin-top: 25px;">
          <a href="http://localhost:3000/stil-rehberi" style="background-color: #B49A6A; color: #F8F5EF; text-decoration: none; padding: 12px 28px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; display: inline-block;">
            Stil Rehberi &amp; Blog Oku →
          </a>
        </div>
      </div>
      ${EMAIL_FOOTER_HTML}
    </div>
  `;

  const log: SentEmailLog = {
    id: `eml-${Date.now()}`,
    recipient: email,
    subject,
    type: 'newsletter',
    sentAt: new Date().toLocaleString('tr-TR'),
    status: 'Sending (SMTP Gönderiliyor...)',
    htmlContent,
  };

  saveEmailLog(log);
  dispatchRealServerEmail(log);
  return log;
}
