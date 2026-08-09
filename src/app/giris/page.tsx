'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  Check,
  ArrowRight,
  KeyRound,
  Wand2,
  X,
  FileText,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function AuthPage() {
  const router = useRouter();
  const { login, register, isLoggedIn } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [isKvkkModalOpen, setIsKvkkModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regPassConfirm, setRegPassConfirm] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);

  if (isLoggedIn) {
    router.push('/hesabim');
  }

  // Strong Password Generator
  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';
    let newPass = 'Vera#';
    for (let i = 0; i < 7; i++) {
      newPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setRegPass(newPass);
    setRegPassConfirm(newPass);
    setShowRegPassword(true);

    try {
      navigator.clipboard.writeText(newPass);
    } catch (e) {}

    showToast(`✨ Güçlü şifreniz oluşturuldu ve panoya kopyalandı: ${newPass}`, 'success');
  };

  // Password Strength Assessor
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-transparent', textColor: '' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score++;

    if (score <= 2) return { score: 1, label: 'Zayıf', color: 'bg-rose-500', textColor: 'text-rose-400' };
    if (score <= 3) return { score: 2, label: 'Orta Güçlükte', color: 'bg-amber-500', textColor: 'text-amber-400' };
    if (score === 4) return { score: 3, label: 'Güçlü Şifre ✨', color: 'bg-[#B49A6A]', textColor: 'text-[#B49A6A]' };
    return { score: 4, label: 'Çok Güçlü Şifre 🔒', color: 'bg-emerald-500', textColor: 'text-emerald-400' };
  };

  const passStrength = getPasswordStrength(regPass);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPass) {
      showToast('Lütfen e-posta / telefon ve şifrenizi giriniz.', 'error');
      return;
    }
    const result = login(loginEmail, loginPass);
    if (result.success && result.user) {
      showToast(`Hoş geldiniz Sayın ${result.user.name}! Giriş başarılı.`, 'success');
      router.push('/hesabim');
    } else {
      showToast(result.message || '⚠️ Geçersiz e-posta veya şifre! Bilgilerinizi kontrol ediniz.', 'error');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPass) {
      showToast('Lütfen tüm zorunlu alanları doldurunuz.', 'error');
      return;
    }
    if (regPass !== regPassConfirm) {
      showToast('Şifreler uyuşmuyor, lütfen tekrar kontrol edin.', 'error');
      return;
    }
    if (!termsAccepted) {
      showToast('Lütfen üyelik sözleşmesi ve KVKK şartlarını kabul ediniz.', 'info');
      return;
    }

    const result = register(regName, regEmail, regPhone, regPass);
    if (result.success && result.user) {
      showToast(`🎉 Tebrikler Sayın ${result.user.name}! Üyeliğiniz oluşturuldu ve giriş yapıldı.`, 'success');
      router.push('/hesabim');
    } else {
      showToast(result.message || 'Kayıt sırasında bir hata oluştu.', 'error');
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setIsForgotOpen(false);
    showToast(`Şifre sıfırlama bağlantısı ${forgotEmail} adresine gönderildi.`, 'success');
  };

  return (
    <div className="py-12 bg-[#F8F5EF] min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 bg-[#1C1B1A] border border-[#B49A6A] shadow-2xl overflow-hidden rounded-sm">
        
        {/* Left Decorative Brand Banner */}
        <div className="md:col-span-5 bg-[#242321] p-8 text-[#F8F5EF] flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#3A3835]">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#B49A6A]/20 border border-[#B49A6A]/40 text-[#B49A6A] text-[10px] uppercase tracking-widest font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>VERA PRIVILEGE CLUB</span>
            </div>
            
            <h2 className="font-serif text-3xl font-normal text-[#F8F5EF] leading-tight">
              Ayrıcalıklı Moda Dünyasına Adım Atın
            </h2>
            <p className="text-xs text-[#8C857B] leading-relaxed">
              Üye olarak özel koleksiyonlara erken erişim, kişiselleştirilmiş stil önerileri ve tüm siparişlerinizde VIP ayrıcalıklar kazanın.
            </p>
          </div>

          <div className="space-y-3 pt-6 text-xs text-[#E8DED1] border-t border-[#3A3835]">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#B49A6A]" />
              <span>%10 Hoş Geldin İndirim Kuponu</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#B49A6A]" />
              <span>₺1.500 Üzeri Ücretsiz Kargo</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#B49A6A]" />
              <span>14 Gün Kolay İade Güvencesi</span>
            </div>
          </div>
        </div>

        {/* Right Form Area */}
        <div className="md:col-span-7 p-6 sm:p-10 text-[#F8F5EF] space-y-6">
          {/* Mode Switcher Tabs */}
          <div className="flex border-b border-[#3A3835]">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-3 text-xs uppercase tracking-widest font-semibold border-b-2 transition-colors ${
                mode === 'login'
                  ? 'border-[#B49A6A] text-[#B49A6A]'
                  : 'border-transparent text-[#8C857B] hover:text-[#F8F5EF]'
              }`}
            >
              Üye Girişi
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-3 text-xs uppercase tracking-widest font-semibold border-b-2 transition-colors ${
                mode === 'register'
                  ? 'border-[#B49A6A] text-[#B49A6A]'
                  : 'border-transparent text-[#8C857B] hover:text-[#F8F5EF]'
              }`}
            >
              Yeni Üye Kaydı
            </button>
          </div>

          {/* 1. LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#8C857B] mb-1">E-Posta Adresi veya Telefon *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="ör: ayse.yilmaz@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full p-3 pl-10 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none"
                  />
                  <Mail className="w-4 h-4 text-[#8C857B] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[#8C857B]">Şifre *</label>
                  <button
                    type="button"
                    onClick={() => setIsForgotOpen(true)}
                    className="text-[11px] text-[#B49A6A] hover:underline"
                  >
                    Şifremi Unuttum?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    className="w-full p-3 pl-10 pr-10 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none"
                  />
                  <Lock className="w-4 h-4 text-[#8C857B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C857B] hover:text-[#F8F5EF]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[#8C857B]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-[#B49A6A]"
                  />
                  <span>Beni Hatırla</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#B49A6A] text-[#F8F5EF] text-xs font-semibold uppercase tracking-wider hover:bg-[#988052] transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Giriş Yap</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* 2. REGISTER FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#8C857B] mb-1">Ad Soyad *</label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    required
                    placeholder="ör: Ayşe Yılmaz"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full p-3 pl-10 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none"
                  />
                  <User className="w-4 h-4 text-[#8C857B] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8C857B] mb-1">E-Posta Adresi *</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      required
                      placeholder="ör: ayse@example.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full p-3 pl-10 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none"
                    />
                    <Mail className="w-4 h-4 text-[#8C857B] absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-[#8C857B] mb-1">Telefon Numarası</label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="tel"
                      autoComplete="tel"
                      placeholder="ör: 0532 123 45 67"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full p-3 pl-10 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none"
                    />
                    <Phone className="w-4 h-4 text-[#8C857B] absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              {/* Password Area with Generator & Strength Meter */}
              <div className="space-y-3 pt-1">
                <div className="flex justify-between items-center">
                  <label className="text-[#8C857B]">Şifre Belirleyin *</label>
                  <button
                    type="button"
                    onClick={generateStrongPassword}
                    className="text-[11px] text-[#B49A6A] hover:text-[#F8F5EF] transition-colors flex items-center gap-1 font-semibold"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>✨ Güçlü Şifre Oluştur</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      name="new-password"
                      autoComplete="new-password"
                      required
                      placeholder="••••••••"
                      value={regPass}
                      onChange={(e) => setRegPass(e.target.value)}
                      className="w-full p-3 pr-10 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C857B] hover:text-[#F8F5EF]"
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      name="confirm-password"
                      autoComplete="new-password"
                      required
                      placeholder="Şifre Tekrarı"
                      value={regPassConfirm}
                      onChange={(e) => setRegPassConfirm(e.target.value)}
                      className="w-full p-3 pr-10 bg-[#242321] border border-[#3A3835] text-[#F8F5EF] focus:border-[#B49A6A] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Password Strength Indicator Bar */}
                {regPass && (
                  <div className="space-y-1 text-[10px]">
                    <div className="flex justify-between items-center">
                      <span className="text-[#8C857B]">Şifre Güvenlik Seviyesi:</span>
                      <span className={`font-semibold ${passStrength.textColor}`}>{passStrength.label}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 h-1.5 bg-[#242321] rounded-full overflow-hidden">
                      <div className={`h-full transition-all ${passStrength.score >= 1 ? passStrength.color : 'bg-transparent'}`} />
                      <div className={`h-full transition-all ${passStrength.score >= 2 ? passStrength.color : 'bg-transparent'}`} />
                      <div className={`h-full transition-all ${passStrength.score >= 3 ? passStrength.color : 'bg-transparent'}`} />
                      <div className={`h-full transition-all ${passStrength.score >= 4 ? passStrength.color : 'bg-transparent'}`} />
                    </div>
                  </div>
                )}
              </div>

              {/* KVKK & Terms Checkbox with Popup & New Tab Guard */}
              <label className="flex items-start gap-2 cursor-pointer text-[#8C857B] pt-2">
                <input
                  type="checkbox"
                  required
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="accent-[#B49A6A] mt-0.5"
                />
                <span className="leading-relaxed">
                  <button
                    type="button"
                    onClick={() => setIsKvkkModalOpen(true)}
                    className="text-[#B49A6A] underline font-semibold hover:text-[#F8F5EF]"
                  >
                    KVKK Aydınlatma Metni
                  </button>{' '}
                  ve{' '}
                  <a
                    href="/kurumsal/kvkk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#B49A6A] underline font-semibold hover:text-[#F8F5EF]"
                  >
                    Üyelik Sözleşmesi
                  </a>
                  'ni okudum, kabul ediyorum.
                </span>
              </label>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#B49A6A] text-[#F8F5EF] text-xs font-semibold uppercase tracking-wider hover:bg-[#988052] transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Hemen Üye Ol &amp; %10 İndirim Kazan</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1C1B1A] border border-[#B49A6A] p-6 max-w-md w-full text-[#F8F5EF] space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 border-b border-[#3A3835] pb-3">
              <KeyRound className="w-5 h-5 text-[#B49A6A]" />
              <h3 className="font-serif text-lg font-normal">Şifremi Unuttum</h3>
            </div>
            <p className="text-xs text-[#8C857B]">
              Hesabınıza kayıtlı e-posta adresinizi girin. Şifre sıfırlama bağlantısını anında e-postanıza göndereceğiz.
            </p>

            <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
              <input
                type="email"
                required
                placeholder="E-Posta Adresiniz"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full p-3 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsForgotOpen(false)}
                  className="px-4 py-2 bg-[#3A3835] text-[#F8F5EF]"
                >
                  İptal
                </button>
                <button type="submit" className="px-5 py-2 bg-[#B49A6A] text-[#F8F5EF] font-semibold uppercase">
                  Sıfırlama Linki Gönder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-Page KVKK Modal (Prevents losing form data) */}
      {isKvkkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1C1B1A] border border-[#B49A6A] p-6 sm:p-8 max-w-2xl w-full text-[#F8F5EF] space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#3A3835] pb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#B49A6A]" />
                <h3 className="font-serif text-xl font-normal text-[#F8F5EF]">KVKK Aydınlatma Metni &amp; Üyelik Sözleşmesi</h3>
              </div>
              <button onClick={() => setIsKvkkModalOpen(false)} className="p-1 text-[#8C857B] hover:text-[#F8F5EF]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-[#8C857B] space-y-3 leading-relaxed">
              <p className="font-semibold text-[#F8F5EF]">1. Kişisel Verilerin İşlenme Amacı</p>
              <p>
                Vera Eşarp olarak 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında; siparişlerinizin işleme alınması, teslimat adreslerinize ulaştırılması, müşteri hizmetleri ve yasal yükümlülüklerin yerine getirilmesi amacıyla kişisel verileriniz yüksek güvenlikli sunucularımızda saklanmaktadır.
              </p>
              <p className="font-semibold text-[#F8F5EF]">2. Veri Güvenliği ve 256-Bit SSL</p>
              <p>
                Ödeme ve hesap verileriniz İyzico altyapısı ve 256-Bit SSL şifreleme sertifikaları ile korunmakta olup 3. şahıslarla asla paylaşılmamaktadır.
              </p>
              <p className="font-semibold text-[#F8F5EF]">3. Üye Hakları</p>
              <p>
                Dilediğiniz an kişisel verilerinizin silinmesini, güncellenmesini veya aktarılmasını talep etme hakkına sahipsiniz.
              </p>
            </div>

            <div className="pt-4 border-t border-[#3A3835] flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setTermsAccepted(true);
                  setIsKvkkModalOpen(false);
                  showToast('KVKK şartları okundu ve kabul edildi.', 'success');
                }}
                className="px-6 py-2.5 bg-[#B49A6A] text-[#F8F5EF] text-xs font-semibold uppercase tracking-wider hover:bg-[#988052]"
              >
                Okudum, Kabul Ediyorum
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
