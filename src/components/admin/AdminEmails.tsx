'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Mail, Send, Eye, RefreshCw, CheckCircle2, ShieldAlert, Sparkles, X, Filter,
  Download, Search, Smartphone, Monitor, Code
} from 'lucide-react';
import { getEmailLogs, sendCampaignPromoEmail, sendOrderConfirmationEmail, SentEmailLog } from '@/lib/email/email-service';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

const DEMO_EMAIL_LOGS: SentEmailLog[] = [
  {
    id: 'log-demo-1',
    type: 'welcome',
    recipient: 'ayse.yilmaz@example.com',
    subject: '🌸 Vera Eşarp Dünyasına Hoş Geldiniz! - %10 Hoş Geldin İndiriminiz',
    status: 'Gönderildi (SMTP Success)',
    sentAt: '10.08.2026 21:15',
    htmlContent: '<div style="font-family:sans-serif;padding:20px;color:#242321;"><h2 style="color:#B49A6A;">Vera Eşarp Dünyasına Hoş Geldiniz!</h2><p>Sayın Ayşe Yılmaz, üyeliğiniz başarıyla tamamlandı. <strong>HOSGELDIN</strong> kupon kodunuz ile ilk alışverişinizde %10 indirim kazanın.</p></div>',
  },
  {
    id: 'log-demo-2',
    type: 'order_confirmation',
    recipient: 'zeynep.kaya@example.com',
    subject: '🧾 Siparişiniz Alındı #VR-9842 - Vera Eşarp Faturanız',
    status: 'Gönderildi (SMTP Success)',
    sentAt: '10.08.2026 19:40',
    htmlContent: '<div style="font-family:sans-serif;padding:20px;color:#242321;"><h2 style="color:#B49A6A;">Sipariş Onayı #VR-9842</h2><p>Siparişiniz başarıyla alındı ve ödemeniz onaylandı. Toplam Tutar: ₺3.450</p></div>',
  },
  {
    id: 'log-demo-3',
    type: 'order_status',
    recipient: 'fatma.sahin@example.com',
    subject: '🚚 Kargoya Verildi! Siparişiniz Yola Çıktı #VR-9810',
    status: 'Gönderildi (SMTP Success)',
    sentAt: '10.08.2026 16:20',
    htmlContent: '<div style="font-family:sans-serif;padding:20px;color:#242321;"><h2 style="color:#B49A6A;">Kargo Takip Bilgileri</h2><p>Siparişiniz Yurtiçi Kargo firmasına teslim edilmiştir. Takip Kodu: <strong>YK-984712093</strong></p></div>',
  },
  {
    id: 'log-demo-4',
    type: 'campaign',
    recipient: 'bulten.abone@example.com',
    subject: '✨ Yeni Sezon %100 Twill İpek Koleksiyonu Fırsatları',
    status: 'Gönderildi (SMTP Success)',
    sentAt: '09.08.2026 14:00',
    htmlContent: '<div style="font-family:sans-serif;padding:20px;color:#242321;"><h2 style="color:#B49A6A;">İtalyan Dokuma Yeni Sezon</h2><p>İpek şal ve eşarplarımızda 24 saatliğine geçerli özel fırsatları keşfedin.</p></div>',
  },
];

export default function AdminEmails() {
  const { registeredUsers } = useAuth();
  const { showToast } = useToast();

  const [logs, setLogs] = useState<SentEmailLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<SentEmailLog | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile' | 'code'>('desktop');

  // Broadcast Promo Form State
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [promoForm, setPromoForm] = useState({
    title: 'Yeni Sezon İpek Koleksiyonumuz Yayında!',
    content: 'İtalyan twill dokuma ipek eşarp ve şal serimizde geçerli %15 indirim fırsatını kaçırmayın.',
    promoCode: 'VERASILK15',
  });

  // Test Email Modal
  const [isTestEmailModalOpen, setIsTestEmailModalOpen] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('destek@veraesarp.com');

  const refreshLogs = () => {
    const fetched = getEmailLogs();
    if (fetched && fetched.length > 0) {
      setLogs(fetched);
    } else {
      setLogs(DEMO_EMAIL_LOGS);
    }
  };

  useEffect(() => {
    refreshLogs();

    const handleEmailSent = () => refreshLogs();
    const handleEmailError = (e: any) => {
      refreshLogs();
      if (e.detail?.error) {
        showToast(`❌ SMTP Gönderim Hatası (${e.detail.recipient}): ${e.detail.error}`, 'error');
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('veraesarp_email_sent', handleEmailSent);
      window.addEventListener('veraesarp_email_error', handleEmailError);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('veraesarp_email_sent', handleEmailSent);
        window.removeEventListener('veraesarp_email_error', handleEmailError);
      }
    };
  }, []);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    const customerEmails = registeredUsers
      .filter((u) => u.email && u.role !== 'admin')
      .map((u) => u.email);

    const recipients = customerEmails.length > 0 ? customerEmails : ['destek@veraesarp.com', 'musteri@veraesarp.com'];

    recipients.forEach((email) => {
      sendCampaignPromoEmail(email, promoForm.title, promoForm.content, promoForm.promoCode);
    });

    setIsBroadcastModalOpen(false);
    refreshLogs();
    showToast(`🎉 ${recipients.length} alıcıya toplu e-posta gönderimi başlatıldı!`, 'success');
  };

  const handleSendTestEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailAddress.trim()) {
      showToast('Lütfen test e-posta adresini giriniz.', 'error');
      return;
    }

    sendCampaignPromoEmail(
      testEmailAddress,
      '🧪 Vera Eşarp Sistem Test Bildirimi',
      'Bu e-posta Vera Eşarp E-Posta Bildirim Yönetimi paneli üzerinden gönderilen test mesajıdır. Otomatik sistemler düzgün çalışmaktadır.',
      'TEST10'
    );

    setIsTestEmailModalOpen(false);
    refreshLogs();
    showToast(`✅ Test e-postası "${testEmailAddress}" adresine tetiklendi.`, 'success');
  };

  const handleExportCSV = () => {
    const headers = ['Tarih', 'Kategori', 'Alıcı', 'Konu', 'Durum'];
    const rows = logs.map((l) => [
      `"${l.sentAt}"`,
      `"${l.type}"`,
      `"${l.recipient}"`,
      `"${l.subject.replace(/"/g, '""')}"`,
      `"${l.status}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vera_eposta_loglari_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('E-Posta logları CSV olarak indirildi.', 'success');
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      const matchType = filterType === 'all' || l.type === filterType;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        l.recipient.toLowerCase().includes(q) ||
        l.subject.toLowerCase().includes(q) ||
        l.status.toLowerCase().includes(q);
      return matchType && matchQuery;
    });
  }, [logs, filterType, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-[#2A2825]">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#F8F5EF]">E-Posta Bildirim Yönetimi</h1>
          <p className="text-xs text-[#8C857B]">
            Müşterilerinize giden otomatik e-postaları (Kayıt, Fatura, Şifre, Kargo, Bülten) canlı takip edin ve toplu kampanya postaları gönderin.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={refreshLogs}
            className="p-2.5 bg-[#1C1B1A] border border-[#2A2825] text-[#8C857B] hover:text-[#F8F5EF] transition-colors rounded"
            title="Logları Yenile"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsTestEmailModalOpen(true)}
            className="px-3.5 py-2.5 bg-[#242321] border border-[#3A3835] text-[#E8DED1] text-xs font-semibold hover:border-[#B49A6A] hover:text-[#B49A6A] transition-colors rounded"
          >
            🧪 Test E-Postası
          </button>

          <button
            onClick={handleExportCSV}
            className="p-2.5 bg-[#1C1B1A] border border-[#2A2825] text-[#8C857B] hover:text-[#B49A6A] transition-colors rounded"
            title="CSV Dışa Aktar"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsBroadcastModalOpen(true)}
            className="px-4 py-2.5 bg-[#B49A6A] text-[#1C1B1A] text-xs font-bold uppercase tracking-wider hover:bg-[#988052] transition-colors flex items-center justify-center gap-2 shadow-lg rounded"
          >
            <Send className="w-4 h-4" />
            <span>Toplu Kampanya Postası</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-[#1C1B1A] border border-[#2A2825] space-y-1">
          <span className="text-[10px] uppercase text-[#8C857B] font-semibold tracking-wider">Toplam Gönderim</span>
          <p className="font-serif text-2xl text-[#F8F5EF] font-semibold">{logs.length}</p>
          <span className="text-[10px] text-emerald-400">Tüm Bildirim Logları</span>
        </div>
        <div className="p-4 bg-[#1C1B1A] border border-[#2A2825] space-y-1">
          <span className="text-[10px] uppercase text-[#8C857B] font-semibold tracking-wider">Kayıt &amp; Hoş Geldin</span>
          <p className="font-serif text-2xl text-[#B49A6A] font-semibold">
            {logs.filter((l) => l.type === 'welcome').length}
          </p>
          <span className="text-[10px] text-[#B49A6A]">Hoş Geldin E-Postaları</span>
        </div>
        <div className="p-4 bg-[#1C1B1A] border border-[#2A2825] space-y-1">
          <span className="text-[10px] uppercase text-[#8C857B] font-semibold tracking-wider">Sipariş &amp; Fatura</span>
          <p className="font-serif text-2xl text-emerald-400 font-semibold">
            {logs.filter((l) => l.type === 'order_confirmation' || l.type === 'order_status').length}
          </p>
          <span className="text-[10px] text-emerald-400">Otomatik İşlem Mailleri</span>
        </div>
        <div className="p-4 bg-[#1C1B1A] border border-[#2A2825] space-y-1">
          <span className="text-[10px] uppercase text-[#8C857B] font-semibold tracking-wider">Kampanya &amp; Bülten</span>
          <p className="font-serif text-2xl text-amber-400 font-semibold">
            {logs.filter((l) => l.type === 'campaign' || l.type === 'newsletter').length}
          </p>
          <span className="text-[10px] text-amber-400">Promosyon Gönderimleri</span>
        </div>
      </div>

      {/* Log Filter & Table */}
      <div className="bg-[#1C1B1A] border border-[#2A2825] overflow-hidden space-y-4 p-4 rounded">
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 border-b border-[#2A2825] pb-3 text-xs">
          <span className="text-[#8C857B] font-semibold">Gönderim Günlüğü (Canlı E-Posta Akışı)</span>
          
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-[#8C857B] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Alıcı veya konu ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 bg-[#242321] border border-[#3A3835] text-xs text-[#F8F5EF] placeholder-[#8C857B] focus:outline-none focus:border-[#B49A6A] rounded"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="flex items-center gap-1.5 shrink-0">
              <Filter className="w-3.5 h-3.5 text-[#8C857B]" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="p-1.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] text-xs focus:outline-none rounded"
              >
                <option value="all">Tüm Kategoriler</option>
                <option value="welcome">Hoş Geldin E-Postası</option>
                <option value="password_reset">Şifre Sıfırlama</option>
                <option value="order_confirmation">Sipariş Onay &amp; Fatura</option>
                <option value="order_status">Sipariş &amp; Kargo Takip</option>
                <option value="campaign">Kampanya Bildirimi</option>
                <option value="newsletter">Haber Bülteni</option>
              </select>
            </div>
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-3">
            <Mail className="w-10 h-10 text-[#B49A6A] mx-auto opacity-50" />
            <h3 className="font-serif text-lg text-[#F8F5EF]">Kriterlerinize Uyan E-Posta Bulunamadı</h3>
            <p className="text-xs text-[#8C857B]">
              Filtrenizi değiştirin veya "🧪 Test E-Postası" butonuna basarak anında canlı log oluşturun.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#E8DED1]">
              <thead className="bg-[#242321] text-[#B49A6A] uppercase tracking-wider text-[11px] border-b border-[#2A2825]">
                <tr>
                  <th className="p-3">Tarih / Zaman</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Alıcı E-Posta</th>
                  <th className="p-3">E-Posta Konusu</th>
                  <th className="p-3">Durum</th>
                  <th className="p-3 text-right">Önizleme</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2825]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#242321] transition-colors">
                    <td className="p-3 font-mono text-[11px] text-[#8C857B] whitespace-nowrap">{log.sentAt}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 text-[9px] uppercase font-bold rounded-full border ${
                          log.type === 'welcome'
                            ? 'bg-blue-900/40 text-blue-300 border-blue-700'
                            : log.type === 'order_confirmation'
                            ? 'bg-emerald-900/40 text-emerald-300 border-emerald-700'
                            : log.type === 'password_reset'
                            ? 'bg-rose-900/40 text-rose-300 border-rose-700'
                            : 'bg-amber-900/40 text-amber-300 border-amber-700'
                        }`}
                      >
                        {log.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-[#F8F5EF]">{log.recipient}</td>
                    <td className="p-3 text-[#E8DED1] truncate max-w-xs">{log.subject}</td>
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                          log.status.includes('Hata') || log.status.includes('Failed')
                            ? 'text-rose-400'
                            : log.status.includes('Sending')
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {log.status.includes('Hata') ? (
                          <ShieldAlert className="w-3.5 h-3.5" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                        <span className="truncate max-w-[180px]" title={log.status}>{log.status}</span>
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedLog(log);
                          setPreviewDevice('desktop');
                        }}
                        className="px-3 py-1 bg-[#242321] text-[#B49A6A] border border-[#B49A6A]/40 text-xs font-semibold hover:bg-[#B49A6A] hover:text-[#1C1B1A] transition-colors rounded inline-flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>İncele</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* HTML Email Preview Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1C1B1A] border border-[#B49A6A] p-6 max-w-3xl w-full text-[#F8F5EF] space-y-4 shadow-2xl rounded max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#3A3835] pb-3">
              <div>
                <span className="text-[10px] uppercase text-[#B49A6A] font-mono">{selectedLog.sentAt}</span>
                <h3 className="font-serif text-lg font-normal text-[#F8F5EF]">{selectedLog.subject}</h3>
                <p className="text-xs text-[#8C857B]">Alıcı: <strong className="text-[#F8F5EF]">{selectedLog.recipient}</strong></p>
              </div>

              {/* View Switcher */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-[#242321] border border-[#3A3835] rounded p-0.5">
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-1.5 rounded transition-colors ${previewDevice === 'desktop' ? 'bg-[#B49A6A] text-[#1C1B1A]' : 'text-[#8C857B]'}`}
                    title="Masaüstü Görünümü"
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-1.5 rounded transition-colors ${previewDevice === 'mobile' ? 'bg-[#B49A6A] text-[#1C1B1A]' : 'text-[#8C857B]'}`}
                    title="Mobil Görünüm"
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPreviewDevice('code')}
                    className={`p-1.5 rounded transition-colors ${previewDevice === 'code' ? 'bg-[#B49A6A] text-[#1C1B1A]' : 'text-[#8C857B]'}`}
                    title="Ham HTML Kodu"
                  >
                    <Code className="w-4 h-4" />
                  </button>
                </div>

                <button onClick={() => setSelectedLog(null)} className="p-1.5 text-[#8C857B] hover:text-[#F8F5EF]">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-[#171615] p-4 border border-[#3A3835] rounded flex items-center justify-center">
              {previewDevice === 'code' ? (
                <pre className="w-full h-[450px] p-4 bg-[#1C1B1A] text-emerald-400 font-mono text-xs overflow-auto rounded border border-[#3A3835]">
                  {selectedLog.htmlContent}
                </pre>
              ) : (
                <div className={`transition-all duration-300 ${previewDevice === 'mobile' ? 'w-[375px] h-[500px] border-4 border-[#3A3835] rounded-3xl overflow-hidden shadow-2xl bg-white' : 'w-full h-[500px] bg-white rounded'}`}>
                  <iframe
                    title="Email Preview"
                    srcDoc={selectedLog.htmlContent}
                    className="w-full h-full border-0"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Test Email Trigger Modal */}
      {isTestEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1C1B1A] border border-[#B49A6A] p-6 max-w-md w-full text-[#F8F5EF] space-y-4 shadow-2xl rounded">
            <div className="flex items-center justify-between border-b border-[#3A3835] pb-3">
              <h3 className="font-serif text-lg text-[#F8F5EF]">🧪 Canlı Test E-Postası Gönder</h3>
              <button onClick={() => setIsTestEmailModalOpen(false)} className="p-1 text-[#8C857B] hover:text-[#F8F5EF]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendTestEmail} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#8C857B] mb-1">Test Gönderilecek Alıcı Adresi *</label>
                <input
                  type="email"
                  required
                  value={testEmailAddress}
                  onChange={(e) => setTestEmailAddress(e.target.value)}
                  className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-[#3A3835] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTestEmailModalOpen(false)}
                  className="px-4 py-2 bg-[#242321] text-[#8C857B]"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#B49A6A] text-[#1C1B1A] font-bold uppercase tracking-wider hover:bg-[#988052]"
                >
                  Testi Başlat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Broadcast Campaign Modal */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1C1B1A] border border-[#B49A6A] p-6 sm:p-8 max-w-md w-full text-[#F8F5EF] space-y-4 shadow-2xl rounded">
            <div className="flex items-center justify-between border-b border-[#3A3835] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#B49A6A]" />
                <h3 className="font-serif text-lg font-normal text-[#F8F5EF]">Toplu Kampanya E-Postası Gönder</h3>
              </div>
              <button onClick={() => setIsBroadcastModalOpen(false)} className="p-1 text-[#8C857B] hover:text-[#F8F5EF]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#8C857B] mb-1">Kampanya Başlığı *</label>
                <input
                  type="text"
                  required
                  value={promoForm.title}
                  onChange={(e) => setPromoForm({ ...promoForm, title: e.target.value })}
                  className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#8C857B] mb-1">Kampanya Açıklaması *</label>
                <textarea
                  rows={3}
                  required
                  value={promoForm.content}
                  onChange={(e) => setPromoForm({ ...promoForm, content: e.target.value })}
                  className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#8C857B] mb-1">İndirim Kupon Kodu (İsteğe Bağlı)</label>
                <input
                  type="text"
                  placeholder="ör: VERASILK15"
                  value={promoForm.promoCode}
                  onChange={(e) => setPromoForm({ ...promoForm, promoCode: e.target.value.toUpperCase() })}
                  className="w-full p-2.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none font-mono"
                />
              </div>

              <div className="pt-4 border-t border-[#3A3835] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="px-4 py-2 bg-[#242321] text-[#8C857B]"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#B49A6A] text-[#1C1B1A] font-bold uppercase tracking-wider hover:bg-[#988052]"
                >
                  Gönderimi Başlat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
