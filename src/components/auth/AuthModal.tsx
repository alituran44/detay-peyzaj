import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, ShieldCheck, User, KeyRound, AlertCircle, ArrowRight, Phone, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getGoogleClientId, renderGoogleButton, type GoogleUserData } from '../../utils/googleAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (role: 'admin' | 'customer') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const {
    login,
    loginWithGoogle,
    registerCustomer,
    sendVerificationCode,
    verifyEmailCode,
    sendPasswordResetCode,
    resetPasswordWithCode,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'verify_code' | 'forgot_password'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Verification Code States for standard registration
  const [pendingRegisterData, setPendingRegisterData] = useState<{ email: string; fullName: string; phone: string; password: string } | null>(null);
  const [otpCode, setOtpCode] = useState<string>('');
  const [isSendingCode, setIsSendingCode] = useState<boolean>(false);

  // Forgot Password States
  const [forgotStep, setForgotStep] = useState<'request_code' | 'enter_new_pass'>('request_code');
  const [forgotEmail, setForgotEmail] = useState<string>('');
  const [forgotOtp, setForgotOtp] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [isSendingReset, setIsSendingReset] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab('login');
      setError(null);
      setSuccessMsg(null);
      setOtpCode('');
      setPendingRegisterData(null);
      setEmail('');
      setPassword('');
      setFullName('');
      setPhone('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && activeTab === 'login') {
      const clientId = getGoogleClientId();
      if (clientId) {
        const timer = setTimeout(() => {
          renderGoogleButton('google-signin-btn-container', clientId, (userData: GoogleUserData) => {
            if (userData?.email) {
              const res = loginWithGoogle(userData.email, userData.name, userData.picture, true);
              setSuccessMsg('✓ Google ile başarıyla giriş yapıldı! Yönlendiriliyorsunuz...');
              setTimeout(() => {
                if (onSuccess) onSuccess(res.role);
                onClose();
              }, 400);
            }
          });
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!otpCode.trim()) {
      setError('Lütfen e-posta adresinize gönderilen 6 haneli onay kodunu giriniz.');
      return;
    }

    if (!pendingRegisterData) {
      setError('Kayıt oturum bilgisi bulunamadı. Lütfen tekrar deneyin.');
      return;
    }

    const isValid = verifyEmailCode(pendingRegisterData.email, otpCode);
    if (isValid) {
      const res = registerCustomer(pendingRegisterData);
      if (res.success) {
        setSuccessMsg('✓ E-Posta adresiniz onaylandı ve hesabınız oluşturuldu!');
        setTimeout(() => {
          if (onSuccess) onSuccess('customer');
          onClose();
        }, 600);
      } else {
        setError(res.error || 'Kayıt işlemi tamamlanamadı.');
      }
    } else {
      setError('Hatalı veya süresi dolmuş onay kodu. Lütfen e-postanızı kontrol edip tekrar deneyiniz.');
    }
  };

  const handleRequestPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setError('Lütfen geçerli bir e-posta adresi yazınız.');
      return;
    }

    setIsSendingReset(true);
    const res = await sendPasswordResetCode(forgotEmail);
    setIsSendingReset(false);

    if (res.success) {
      setSuccessMsg(res.message);
      setForgotStep('enter_new_pass');
    } else {
      setError(res.message);
    }
  };

  const handleCompletePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!forgotOtp.trim()) {
      setError('Lütfen 6 haneli güvenlik kodunu giriniz.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Yeni şifreniz en az 6 karakter olmalıdır.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('Yeni şifreler birbiriyle eşleşmiyor.');
      return;
    }

    const res = resetPasswordWithCode(forgotEmail, forgotOtp, newPassword);
    if (res.success) {
      setSuccessMsg('✓ Şifreniz başarıyla sıfırlandı! Oturumunuz açılıyor...');
      setTimeout(() => {
        login(forgotEmail, newPassword);
        if (onSuccess) onSuccess('customer');
        onClose();
      }, 800);
    } else {
      setError(res.message || 'Şifre sıfırlanamadı.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email.trim() || !password.trim()) {
      setError('Lütfen e-posta ve şifrenizi girin.');
      return;
    }

    if (activeTab === 'register') {
      if (!fullName.trim()) {
        setError('Lütfen ad ve soyadınızı belirtiniz.');
        return;
      }
      if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
        setError('Lütfen geçerli bir telefon numarası giriniz (Zorunludur: Örn. 05XX XXX XX XX).');
        return;
      }
      if (password.length < 6) {
        setError('Şifreniz en az 6 karakter olmalıdır.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Girdiğiniz şifreler birbiriyle eşleşmiyor.');
        return;
      }

      const regData = {
        email: email.trim().toLowerCase(),
        fullName: fullName.trim(),
        phone: phone.trim(),
        password,
      };

      setPendingRegisterData(regData);
      setIsSendingCode(true);
      await sendVerificationCode(regData.email, regData.fullName);
      setIsSendingCode(false);
      setSuccessMsg(`✓ 6 haneli güvenlik kodu ${regData.email} adresinize iletildi.`);
      setActiveTab('verify_code');
      return;
    }

    // Login logic
    const res = login(email, password);
    if (res.success) {
      if (onSuccess) onSuccess(res.role || 'customer');
      onClose();
    } else {
      setError('Hatalı e-posta veya şifre girdiniz. Lütfen bilgilerinizi kontrol edin.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/90 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-md bg-obsidian-900 border border-orange-500/50 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6 max-h-[95vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-orange-950 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-white">Detay Peyzaj Portal Girişi</h3>
              <p className="text-xs text-orange-400/90 font-mono">Müşteri & Yönetici Paneli</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-obsidian-950 text-slate-400 hover:text-white border border-orange-950 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="bg-rose-950/60 border border-rose-800/60 p-3 rounded-xl flex items-center gap-2 text-rose-300 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-950/60 border border-emerald-800/60 p-3 rounded-xl flex items-center gap-2 text-emerald-300 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {activeTab === 'verify_code' ? (
          /* OTP Verification Screen */
          <form onSubmit={handleVerifyOtp} className="space-y-5 animate-fade-in">
            <div className="text-center space-y-2 bg-obsidian-950 p-4 rounded-2xl border border-orange-500/30">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 mx-auto">
                <Mail className="w-6 h-6 animate-pulse" />
              </div>
              <h4 className="text-sm font-bold text-white">Müşteri Hesabı Aktivasyon Kodu</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                <span className="text-orange-400 font-mono font-semibold">peyzajdetay@gmail.com</span> tarafından <strong className="text-white">{pendingRegisterData?.email}</strong> adresinize 6 haneli onay kodu gönderildi.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 text-center block">6 Haneli Doğrulama Kodunu Giriniz:</label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="••••••"
                autoFocus
                className="w-full bg-obsidian-950 border-2 border-orange-500/70 focus:border-orange-400 rounded-2xl p-3.5 text-center text-2xl font-mono text-white tracking-[0.4em] outline-none shadow-glow-sm"
              />
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="submit"
                disabled={isSendingCode}
                className="w-full py-3.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-glow transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Hesabı Onayla ve Portala Geç</span>
              </button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={async () => {
                    if (pendingRegisterData) {
                      setIsSendingCode(true);
                      await sendVerificationCode(pendingRegisterData.email, pendingRegisterData.fullName);
                      setIsSendingCode(false);
                      setSuccessMsg('✓ Yeni güvenlik kodu e-postanıza gönderildi.');
                    }
                  }}
                  disabled={isSendingCode}
                  className="text-orange-400 hover:text-orange-300 font-medium cursor-pointer"
                >
                  {isSendingCode ? 'Kod Gönderiliyor...' : 'Tekrar Kod Gönder'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setOtpCode('');
                  }}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  Bilgileri Değiştir
                </button>
              </div>
            </div>
          </form>
        ) : activeTab === 'forgot_password' ? (
          /* Forgot Password Flow */
          <div className="space-y-5 animate-fade-in">
            <div className="text-center space-y-2 bg-obsidian-950 p-4 rounded-2xl border border-orange-500/30">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">Şifremi Sıfırla</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Hesabınıza ait e-posta adresinizi girerek 6 haneli güvenlik sıfırlama kodu talep ediniz.
              </p>
            </div>

            {forgotStep === 'request_code' ? (
              <form onSubmit={handleRequestPasswordReset} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Kayıtlı E-Posta Adresiniz:</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="ornek@alanadi.com"
                      autoFocus
                      required
                      className="w-full bg-obsidian-950 border border-orange-950 rounded-xl p-3 pl-10 text-xs text-white focus:border-orange-500 outline-none"
                    />
                    <Mail className="w-4 h-4 text-orange-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSendingReset}
                  className="w-full py-3.5 rounded-xl font-bold text-xs text-white bg-orange-600 hover:bg-orange-500 shadow-glow transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>{isSendingReset ? 'Kod Gönderiliyor...' : 'Şifre Sıfırlama Kodu Gönder'}</span>
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('login');
                      setError(null);
                      setSuccessMsg(null);
                    }}
                    className="text-xs text-slate-400 hover:text-white cursor-pointer"
                  >
                    Giriş Ekranına Dön
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleCompletePasswordReset} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 text-center block">E-Postanıza Gelen 6 Haneli Kod:</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••••"
                    autoFocus
                    required
                    className="w-full bg-obsidian-950 border-2 border-orange-500/80 rounded-xl p-3 text-center text-xl font-mono text-white tracking-[0.3em] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Yeni Şifreniz:</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="En az 6 karakter"
                    required
                    className="w-full bg-obsidian-950 border border-orange-950 rounded-xl p-3 text-xs text-white focus:border-orange-500 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Yeni Şifre Tekrarı:</label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Yeni şifreyi tekrar yazın"
                    required
                    className="w-full bg-obsidian-950 border border-orange-950 rounded-xl p-3 text-xs text-white focus:border-orange-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-glow transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Şifremi Sıfırla ve Giriş Yap</span>
                </button>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => setForgotStep('request_code')}
                    className="text-orange-400 hover:text-orange-300 cursor-pointer"
                  >
                    Tekrar Kod İste
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('login');
                      setError(null);
                      setSuccessMsg(null);
                    }}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    Vazgeç
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <>
            {/* Single Official Google Authentication Button */}
            <div className="flex justify-center w-full min-h-[44px]">
              <div id="google-signin-btn-container" className="flex justify-center w-full"></div>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-orange-950 w-full" />
              <span className="bg-obsidian-900 px-3 text-[11px] font-mono text-slate-500 uppercase tracking-widest">veya şifre ile</span>
              <div className="border-t border-orange-950 w-full" />
            </div>

            {/* Tab Switcher */}
            <div className="grid grid-cols-2 gap-2 bg-obsidian-950 p-1 rounded-xl border border-orange-950">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setError(null);
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-orange-600 text-white shadow-glow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Giriş Yap
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('register');
                  setError(null);
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'register'
                    ? 'bg-orange-600 text-white shadow-glow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Yeni Müşteri Kaydı
              </button>
            </div>

            {/* Login / Register Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'register' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Adınız & Soyadınız:</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Örn: Ahmet Yılmaz"
                        className="w-full bg-obsidian-950 border border-orange-950 rounded-xl p-3 pl-10 text-xs text-white focus:border-orange-500 outline-none"
                      />
                      <User className="w-4 h-4 text-orange-400 absolute left-3.5 top-3.5" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Telefon Numarası <span className="text-orange-400">* (Zorunlu)</span>:
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="05XX XXX XX XX"
                        required
                        className="w-full bg-obsidian-950 border border-orange-950 rounded-xl p-3 pl-10 text-xs text-white focus:border-orange-500 outline-none font-mono"
                      />
                      <Phone className="w-4 h-4 text-orange-400 absolute left-3.5 top-3.5" />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">E-Posta Adresi:</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@alanadi.com"
                    className="w-full bg-obsidian-950 border border-orange-950 rounded-xl p-3 pl-10 text-xs text-white focus:border-orange-500 outline-none"
                  />
                  <Mail className="w-4 h-4 text-orange-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">Şifre:</label>
                  {activeTab === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(email);
                        setForgotStep('request_code');
                        setActiveTab('forgot_password');
                        setError(null);
                        setSuccessMsg(null);
                      }}
                      className="text-[11px] text-orange-400 hover:text-orange-300 transition-colors cursor-pointer"
                    >
                      Şifremi Unuttum?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-obsidian-950 border border-orange-950 rounded-xl p-3 pl-10 text-xs text-white focus:border-orange-500 outline-none"
                  />
                  <Lock className="w-4 h-4 text-orange-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              {activeTab === 'register' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Şifre Tekrarı:</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-obsidian-950 border border-orange-950 rounded-xl p-3 pl-10 text-xs text-white focus:border-orange-500 outline-none"
                    />
                    <Lock className="w-4 h-4 text-orange-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold text-xs text-white bg-orange-600 hover:bg-orange-500 shadow-glow transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{activeTab === 'login' ? 'Giriş Yap' : 'Hesap Oluştur ve Giriş Yap'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
};
