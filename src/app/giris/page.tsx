'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Lock, Mail, Phone, Eye, EyeOff, Sparkles, ShieldCheck, Check, ArrowRight, KeyRound } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function AuthPage() {
  const router = useRouter();
  const { login, register, isLoggedIn } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
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
                    required
                    placeholder="ör: Ayşe Yılmaz"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full p-3 pl-10 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
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
                      required
                      placeholder="ör: ayse@example.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full p-3 pl-10 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
                    />
                    <Mail className="w-4 h-4 text-[#8C857B] absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-[#8C857B] mb-1">Telefon Numarası</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="ör: 0532 123 45 67"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full p-3 pl-10 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
                    />
                    <Phone className="w-4 h-4 text-[#8C857B] absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8C857B] mb-1">Şifre *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regPass}
                    onChange={(e) => setRegPass(e.target.value)}
                    className="w-full p-3 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
                  />
                </div>

                <div>
                  <label className="block text-[#8C857B] mb-1">Şifre Tekrarı *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regPassConfirm}
                    onChange={(e) => setRegPassConfirm(e.target.value)}
                    className="w-full p-3 bg-[#242321] border border-[#3A3835] text-[#F8F5EF]"
                  />
                </div>
              </div>

              <label className="flex items-start gap-2 cursor-pointer text-[#8C857B] pt-1">
                <input
                  type="checkbox"
                  required
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="accent-[#B49A6A] mt-0.5"
                />
                <span className="leading-relaxed">
                  <Link href="/kurumsal/kvkk" className="text-[#B49A6A] underline">
                    KVKK Aydınlatma Metni
                  </Link>{' '}
                  ve Üyelik Sözleşmesi'ni okudum, kabul ediyorum.
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
    </div>
  );
}
