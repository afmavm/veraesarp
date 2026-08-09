'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Send, Eye, RefreshCw, CheckCircle2, ShieldAlert, Sparkles, X, Filter } from 'lucide-react';
import { getEmailLogs, sendCampaignPromoEmail, SentEmailLog } from '@/lib/email/email-service';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function AdminEmails() {
  const { registeredUsers } = useAuth();
  const { showToast } = useToast();

  const [logs, setLogs] = useState<SentEmailLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<SentEmailLog | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  // Broadcast Promo Form State
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [promoForm, setPromoForm] = useState({
    title: 'Yeni Sezon İpek Koleksiyonumuz Yayında!',
    content: 'İtalyan twill dokuma ipek eşarp ve şal serimizde geçerli %15 indirim fırsatını kaçırmayın.',
    promoCode: 'VERASILK15',
  });

  const refreshLogs = () => {
    setLogs(getEmailLogs());
  };

  useEffect(() => {
    refreshLogs();

    const handleEmailSent = () => {
      refreshLogs();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('veraesarp_email_sent', handleEmailSent);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('veraesarp_email_sent', handleEmailSent);
      }
    };
  }, []);

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    const customerEmails = registeredUsers
      .filter((u) => u.email && u.role !== 'admin')
      .map((u) => u.email);

    const recipients = customerEmails.length > 0 ? customerEmails : ['destek@veraesarp.com'];

    recipients.forEach((email) => {
      sendCampaignPromoEmail(email, promoForm.title, promoForm.content, promoForm.promoCode);
    });

    setIsBroadcastModalOpen(false);
    refreshLogs();
    showToast(`🎉 ${recipients.length} müşterinize toplu e-posta gönderimi tamamlandı!`, 'success');
  };

  const filteredLogs = logs.filter((l) => {
    if (filterType === 'all') return true;
    return l.type === filterType;
  });

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

        <div className="flex items-center gap-3">
          <button
            onClick={refreshLogs}
            className="p-2.5 bg-[#1C1B1A] border border-[#2A2825] text-[#8C857B] hover:text-[#F8F5EF] transition-colors"
            title="Logları Yenile"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsBroadcastModalOpen(true)}
            className="px-5 py-3 bg-[#B49A6A] text-[#F8F5EF] text-xs font-semibold uppercase tracking-wider hover:bg-[#988052] transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            <Send className="w-4 h-4" />
            <span>Toplu Kampanya E-Postası Gönder</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-[#1C1B1A] border border-[#2A2825] space-y-1">
          <span className="text-[10px] uppercase text-[#8C857B]">Toplam Gönderim</span>
          <p className="font-serif text-2xl text-[#F8F5EF] font-semibold">{logs.length}</p>
        </div>
        <div className="p-4 bg-[#1C1B1A] border border-[#2A2825] space-y-1">
          <span className="text-[10px] uppercase text-[#8C857B]">Kayıt &amp; Hoş Geldin</span>
          <p className="font-serif text-2xl text-[#B49A6A] font-semibold">
            {logs.filter((l) => l.type === 'welcome').length}
          </p>
        </div>
        <div className="p-4 bg-[#1C1B1A] border border-[#2A2825] space-y-1">
          <span className="text-[10px] uppercase text-[#8C857B]">Sipariş &amp; Fatura</span>
          <p className="font-serif text-2xl text-emerald-400 font-semibold">
            {logs.filter((l) => l.type === 'order_confirmation' || l.type === 'order_status').length}
          </p>
        </div>
        <div className="p-4 bg-[#1C1B1A] border border-[#2A2825] space-y-1">
          <span className="text-[10px] uppercase text-[#8C857B]">Kampanya &amp; Bülten</span>
          <p className="font-serif text-2xl text-amber-400 font-semibold">
            {logs.filter((l) => l.type === 'campaign' || l.type === 'newsletter').length}
          </p>
        </div>
      </div>

      {/* Log Filter & Table */}
      <div className="bg-[#1C1B1A] border border-[#2A2825] overflow-hidden space-y-4 p-4">
        <div className="flex items-center justify-between border-b border-[#2A2825] pb-3 text-xs">
          <span className="text-[#8C857B] font-semibold">Gönderim Günlüğü (Live Email Queue)</span>
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#8C857B]" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="p-1.5 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] text-xs focus:outline-none"
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

        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-3">
            <Mail className="w-10 h-10 text-[#B49A6A] mx-auto opacity-50" />
            <h3 className="font-serif text-lg text-[#F8F5EF]">Henüz E-Posta Logu Bulunmamaktadır</h3>
            <p className="text-xs text-[#8C857B]">
              Yeni bir üyelik yapıldığında, şifre sıfırlama veya sipariş verildiğinde giden e-postalar burada anında listelenir.
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
                    <td className="p-3 font-mono text-[11px] text-[#8C857B]">{log.sentAt}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 text-[9px] uppercase font-bold rounded-full ${
                          log.type === 'welcome'
                            ? 'bg-blue-900/40 text-blue-300 border border-blue-700'
                            : log.type === 'order_confirmation'
                            ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700'
                            : log.type === 'password_reset'
                            ? 'bg-rose-900/40 text-rose-300 border border-rose-700'
                            : 'bg-amber-900/40 text-amber-300 border border-amber-700'
                        }`}
                      >
                        {log.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-[#F8F5EF]">{log.recipient}</td>
                    <td className="p-3 text-[#E8DED1] truncate max-w-xs">{log.subject}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{log.status}</span>
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="px-3 py-1 bg-[#242321] text-[#B49A6A] border border-[#B49A6A]/40 text-xs font-semibold hover:bg-[#B49A6A] hover:text-[#F8F5EF] transition-colors flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>HTML Göster</span>
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
          <div className="bg-[#1C1B1A] border border-[#B49A6A] p-6 max-w-2xl w-full text-[#F8F5EF] space-y-4 shadow-2xl rounded-sm max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#3A3835] pb-3">
              <div>
                <span className="text-[10px] uppercase text-[#B49A6A] font-mono">{selectedLog.sentAt}</span>
                <h3 className="font-serif text-lg font-normal text-[#F8F5EF]">{selectedLog.subject}</h3>
                <p className="text-xs text-[#8C857B]">Alıcı: {selectedLog.recipient}</p>
              </div>
              <button onClick={() => setSelectedLog(null)} className="p-1 text-[#8C857B] hover:text-[#F8F5EF]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-white p-4 border border-[#3A3835] rounded-sm">
              <iframe
                title="Email Preview"
                srcDoc={selectedLog.htmlContent}
                className="w-full h-[500px] border-0"
              />
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Campaign Modal */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1C1B1A] border border-[#B49A6A] p-6 sm:p-8 max-w-md w-full text-[#F8F5EF] space-y-4 shadow-2xl rounded-sm">
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
                  className="px-4 py-2 bg-[#3A3835] text-[#F8F5EF]"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#B49A6A] text-[#F8F5EF] font-semibold uppercase tracking-wider hover:bg-[#988052]"
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
