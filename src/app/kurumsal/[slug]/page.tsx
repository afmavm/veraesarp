'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { ChevronRight, ShieldCheck, FileText, Building2, Truck, HelpCircle } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/data/mock-data';

interface CorporatePageProps {
  params: Promise<{ slug: string }>;
}

const CORPORATE_CONTENTS: Record<string, { title: string; subtitle: string; content: string }> = {
  hakkimizda: {
    title: 'Hakkımızda',
    subtitle: 'Zamansız Zarafetin ve İpek Sanatının Buluşma Noktası',
    content: `
      <p>Vera Eşarp, modern kadının stilini en lüks dokularla tamamlamak üzere kurulmuş premium bir moda ve aksesuar markasıdır. İpek dokumacılığının asırlık geleneklerini çağdaş tasarım vizyonuyla harmanlayarak, her biri sanat eseri niteliğinde koleksiyonlar sunuyoruz.</p>
      <p>Tüm ürünlerimizde yalnızca %100 saf twill ve saten ipek iplikler kullanılıyor; Kenar işçiliklerimiz usta zanaatkarlarımızın ellerinde geleneksel iğne oyası teknikleriyle tamamlanmaktadır.</p>
    `,
  },
  hikayemiz: {
    title: 'Vera\'nın Hikâyesi',
    subtitle: 'Bir Düşle Başlayan Zarafet Serüveni',
    content: `
      <p>Vera, Latince’de "Gerçek" ve "Doğal" anlamına gelir. Markamızın temeli, sentetik ve geçici trendlerden uzak, doğal ipeğin saf güzelliğini kadınlara sunma tutkusuyla atıldı.</p>
      <p>Milano’dan Bursa’ya uzanan tasarım ve dokuma serüvenimizde, sürdürülebilir lüksü ve zamansız kaliteyi her ilmekte koruyoruz.</p>
    `,
  },
  'kargo-ve-teslimat': {
    title: 'Kargo ve Teslimat',
    subtitle: 'Özenli Paketleme ve Hızlı Teslimat Güvencesi',
    content: `
      <p><strong>Aynı Gün Kargo:</strong> Hafta içi saat 16:00’a kadar vereceğiniz tüm siparişler aynı gün kargo şirketine teslim edilir.</p>
      <p><strong>Ücretsiz Kargo:</strong> ₺1.500 ve üzeri tüm siparişlerinizde kargo ücreti Vera Eşarp tarafından karşılanmaktadır.</p>
      <p><strong>Özel Paketleme:</strong> Tüm siparişleriniz, ipek eşarbınızın zarar görmesini engelleyen özel mühürlü kadife saklama kutusunda gönderilir.</p>
    `,
  },
  'iade-ve-degisim': {
    title: 'İade ve Değişim Politikası',
    subtitle: '14 Gün Koşulsuz İade ve Ücretsiz Değişim Hakları',
    content: `
      <p>Vera Eşarp’tan satın aldığınız ürünleri teslim aldığınız tarihten itibaren 14 gün içerisinde herhangi bir gerekçe göstermeksizin iade edebilir veya değiştirebilirsiniz.</p>
      <p>İade edilecek ürünün denenmemiş, kullanılmamış, etiketleri sökülmemiş ve orijinal koruma kutusu bozulmamış olması gerekmektedir.</p>
    `,
  },
  kvkk: {
    title: 'KVKK Aydınlatma Metni',
    subtitle: '6698 Sayılı Kişisel Verilerin Korunması Kanunu Kapsamında Bilgilendirme',
    content: `
      <p>Vera Eşarp Tekstil A.Ş. olarak kişisel verilerinizin güvenliğine ve gizliliğine azami önem veriyoruz.</p>
      <p>Toplanan ad, soyad, e-posta, teslimat adresi ve iletişim verileriniz yalnızca siparişinizin tamamlanması, faturanızın düzenlenmesi ve yasal yükümlülüklerin yerine getirilmesi amacıyla işlenmektedir.</p>
    `,
  },
  'gizlilik-ve-cerez': {
    title: 'Gizlilik ve Çerez Politikası',
    subtitle: 'Güvenli Alışveriş ve Çerez Kullanım Şartları',
    content: `
      <p>Sitemizde alışveriş deneyiminizi iyileştirmek, sepetinizi hatırlamak ve performans analizleri yapmak amacıyla çerezler (cookies) kullanılmaktadır.</p>
      <p>Kredi kartı bilgileriniz hiçbir şekilde sunucularımızda saklanmaz. Tüm ödeme işlemleri 256-bit SSL şifrelemeli İyzico altyapısıyla doğrudan banka ile gerçekleşir.</p>
    `,
  },
  'mesafeli-satis-sozlesmesi': {
    title: 'Mesafeli Satış Sözleşmesi',
    subtitle: 'Tüketicinin Korunması Hakkında Kanun Uyarınca Şartlar',
    content: `
      <p>İşbu sözleşme, SATICI (Vera Eşarp) ile ALICI arasındaki elektronik ortamda verilen siparişin teslimat, ödeme ve iade şartlarını düzenler.</p>
    `,
  },
  sss: {
    title: 'Sık Sorulan Sorular',
    subtitle: 'Merak Ettiğiniz Tüm Soruların Cevapları',
    content: `
      <p><strong>Eşarplarınız %100 saf ipek mi?</strong><br/>Evet, Vera Eşarp bünyesindeki tüm eşarplar %100 saf twill veya saten ipektir.</p>
      <p><strong>Eşarp kayma yapar mı?</strong><br/>Twill ipek ve Medine ipeği dokumalarımız özel dik yapısı sayesinde gün boyu kayma yapmadan şeklini korur.</p>
    `,
  },
  magazalar: {
    title: 'Mağazalarımız',
    subtitle: 'Vera Deneyimini Yerinde Yaşayın',
    content: `
      <p><strong>İstanbul Nişantaşı Mağazası:</strong><br/>Abdi İpekçi Caddesi No:42, Şişli / İstanbul<br/>Telefon: +90 (212) 555 83 72</p>
    `,
  },
};

import { useData } from '@/context/DataContext';

export default function CorporatePage({ params }: CorporatePageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const { siteSettings } = useData();

  let data = CORPORATE_CONTENTS[slug];

  if (slug === 'iletisim' || slug === 'magazalar') {
    data = {
      title: slug === 'iletisim' ? 'İletişim & Danışma Hattı' : 'Mağazalarımız',
      subtitle: 'Vera Deneyimini Yerinde Yaşayın & Bize Ulaşın',
      content: `
        <div class="space-y-4">
          <p><strong>Marka / Şirket Unvanı:</strong> ${siteSettings.name}</p>
          <p><strong>Müşteri Destek Telefonu:</strong> ${siteSettings.contactPhone}</p>
          <p><strong>E-Posta Adresi:</strong> ${siteSettings.contactEmail}</p>
          <p><strong>Mağaza Açık Adresi:</strong> ${siteSettings.address}</p>
          <p><strong>Çalışma Saatleri:</strong> ${siteSettings.workingHours}</p>
          <p><strong>WhatsApp Danışma Hattı:</strong> ${siteSettings.whatsappPhone}</p>
          ${siteSettings.taxOffice ? `<p><strong>Vergi Dairesi & No:</strong> ${siteSettings.taxOffice} / ${siteSettings.taxNumber}</p>` : ''}
        </div>
      `,
    };
  } else if (!data) {
    data = {
      title: 'Bilgi Sayfası',
      subtitle: 'Vera Eşarp Kurumsal Bilgileri',
      content: '<p>Aradığınız kurumsal sayfa içeriği güncellenmektedir.</p>',
    };
  }

  return (
    <div className="py-12 bg-[#F8F5EF] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-[#8C857B] uppercase tracking-wider">
          <Link href="/" className="hover:text-[#242321]">Ana Sayfa</Link>
          <ChevronRight className="w-3 h-3" />
          <span>Kurumsal</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#242321] font-semibold">{data.title}</span>
        </nav>

        {/* Header */}
        <div className="pb-6 border-b border-[#E6DFD5]">
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-[#242321]">
            {data.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#5A5652] mt-2 font-light">{data.subtitle}</p>
        </div>

        {/* Content Box */}
        <div className="bg-[#FFFFFF] p-8 sm:p-12 border border-[#E6DFD5] text-[#242321] leading-relaxed text-sm sm:text-base font-light space-y-4 shadow-sm">
          <div
            className="prose max-w-none space-y-4"
            dangerouslySetInnerHTML={{ __html: data.content }}
          />
        </div>
      </div>
    </div>
  );
}
