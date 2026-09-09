import React, { useState, useEffect } from 'react';
import { Sparkles, Phone, MessageCircle, Menu, X, Clock, User, ShieldCheck, LogOut, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

interface NavbarProps {
  onOpenOrderWizard: () => void;
  onOpenCalculator?: () => void;
  onOpenAuthModal: () => void;
  onOpenCustomerPortal: () => void;
  onOpenAdminDashboard: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenOrderWizard,
  onOpenAuthModal,
  onOpenCustomerPortal,
  onOpenAdminDashboard,
}) => {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-orange-950 via-amber-950 to-obsidian-950 text-xs text-orange-100 py-2 px-4 border-b border-orange-800/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-flex items-center gap-1 bg-orange-500/20 text-orange-300 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-orange-500/40 whitespace-nowrap">
              <Clock className="w-3 h-3 text-orange-400 animate-pulse" /> 5 İş Gününde Teslim
            </span>
            <span className="hidden sm:inline">Peyzaj Projelerinde 4 Dönüme kadar %25'e varan indirim! E-İmza & Islak İmzalı Kargo.</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300 text-xs ml-auto flex-wrap">
            <a 
              href="https://www.instagram.com/detay_proje_mimarlik/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-orange-300 hover:text-white transition-all font-semibold bg-orange-900/50 hover:bg-orange-800 border border-orange-700/60 px-2.5 py-0.5 rounded-full shadow-sm"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
              <span>Instagram'da İncele</span>
            </a>
            <span className="text-orange-800 hidden sm:inline">|</span>
            <a href="tel:+905444772044" className="flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap">
              <Phone className="w-3.5 h-3.5 text-orange-400" /> +90 544 477 20 44
            </a>
            <span className="text-orange-800 hidden sm:inline">|</span>
            <a 
              href="https://wa.me/905444772044?text=Merhaba,%20online%20peyzaj%20projesi%20hakkinda%20bilgi%20almak%20istiyorum." 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-orange-400 hover:text-orange-300 transition-colors font-medium whitespace-nowrap"
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-obsidian-950/95 backdrop-blur-md py-3 shadow-2xl border-b border-orange-900/60' 
          : 'bg-obsidian-950/80 backdrop-blur-sm py-4 border-b border-orange-900/30'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <a href="#" className="flex items-center shrink-0 group">
            <div className="bg-white px-3.5 py-1.5 rounded-2xl shadow-glow transition-all duration-300 group-hover:scale-105 border border-orange-500/40 flex items-center justify-center">
              <img
                src="/logo-detay.png"
                alt="Detay Peyzaj - Tasarım Ruhu"
                className="h-10 sm:h-12 w-auto max-w-[210px] sm:max-w-[260px] object-contain"
              />
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs xl:text-sm font-medium text-slate-300 whitespace-nowrap">
            <a href="#hakkimizda" className="hover:text-orange-300 transition-colors whitespace-nowrap">
              Hakkımızda
            </a>
            <a href="#hizmetler" className="hover:text-orange-300 transition-colors whitespace-nowrap">
              Hizmetlerimiz
            </a>
            <a href="#sss" className="hover:text-orange-300 transition-colors whitespace-nowrap">
              S.S.S
            </a>
          </nav>

          {/* User Auth & Actions */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            
            {user ? (
              /* Logged In State */
              <div className="flex items-center gap-2">
                {user.role === 'admin' ? (
                  <button
                    onClick={onOpenAdminDashboard}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-orange-300 bg-orange-950/80 hover:bg-orange-900 border border-orange-700/60 transition-all flex items-center gap-1.5 cursor-pointer shadow-glow-sm"
                  >
                    <ShieldCheck className="w-4 h-4 text-orange-400" />
                    <span>Admin Paneli</span>
                  </button>
                ) : (
                  <button
                    onClick={onOpenCustomerPortal}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-obsidian-850 hover:bg-orange-950/60 border border-orange-900/60 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Layers className="w-4 h-4 text-orange-400" />
                    <span>Projelerim</span>
                  </button>
                )}

                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-slate-400 hover:text-white bg-obsidian-850 border border-orange-950 cursor-pointer"
                  title="Çıkış Yap"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Logged Out State */
              <button
                onClick={onOpenAuthModal}
                className="px-3.5 py-2 rounded-xl text-xs xl:text-sm font-medium text-slate-200 bg-obsidian-850 hover:bg-orange-950/60 border border-orange-900/60 transition-all flex items-center gap-1.5 hover:border-orange-500/50 cursor-pointer whitespace-nowrap"
              >
                <User className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Giriş Yap</span>
              </button>
            )}

            <button
              onClick={onOpenOrderWizard}
              className="px-4 xl:px-5 py-2.5 rounded-xl text-xs xl:text-sm font-bold text-white bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 hover:from-orange-500 hover:to-amber-500 transition-all duration-300 shadow-glow flex items-center gap-2 border border-orange-400/40 active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-orange-200 animate-pulse shrink-0" />
              <span>Proje Başlat</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {user ? (
              <button
                onClick={user.role === 'admin' ? onOpenAdminDashboard : onOpenCustomerPortal}
                className="px-2.5 py-1.5 text-xs font-bold text-orange-300 bg-orange-950 border border-orange-700/60 rounded-xl"
              >
                {user.role === 'admin' ? 'Admin' : 'Projelerim'}
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-2.5 py-1.5 text-xs font-bold text-slate-200 bg-obsidian-850 border border-orange-950 rounded-xl"
              >
                Giriş
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-obsidian-850 text-slate-300 hover:text-white border border-orange-900/60"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-obsidian-950/95 backdrop-blur-xl border-b border-orange-900/60 px-6 py-6 space-y-4 animate-fade-in">
            
            {/* User Session Bar */}
            <div className="bg-obsidian-900 p-3.5 rounded-2xl border border-orange-950 flex items-center justify-between">
              {user ? (
                <>
                  <div>
                    <div className="text-xs font-bold text-white">{user.fullName}</div>
                    <div className="text-[10px] text-orange-400 font-mono">{user.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (user.role === 'admin') onOpenAdminDashboard();
                      else onOpenCustomerPortal();
                    }}
                    className="px-3 py-1 bg-orange-600 text-white rounded-lg text-xs font-bold"
                  >
                    {user.role === 'admin' ? 'Yönetici Paneli' : 'Projelerim'}
                  </button>
                </>
              ) : (
                <>
                  <span className="text-xs text-slate-300">Giriş yaparak projelerinizi takip edin</span>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuthModal();
                    }}
                    className="px-3 py-1 bg-orange-600 text-white rounded-lg text-xs font-bold"
                  >
                    Giriş Yap
                  </button>
                </>
              )}
            </div>

            <nav className="flex flex-col gap-3 text-base font-medium text-slate-200">
              <a 
                href="#hakkimizda" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-orange-900/40"
              >
                Hakkımızda
              </a>
              <a 
                href="#hizmetler" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-orange-900/40"
              >
                Hizmetlerimiz
              </a>
              <a 
                href="#sss" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-orange-900/40"
              >
                S.S.S
              </a>
              <a 
                href="https://www.instagram.com/detay_proje_mimarlik/" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-orange-900/40 text-orange-400 font-semibold flex items-center gap-2"
              >
                <InstagramIcon className="w-4 h-4 text-pink-400" />
                <span>Instagram Portfolyo</span>
              </a>
            </nav>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOrderWizard();
              }}
              className="w-full py-3 rounded-xl font-bold text-white bg-orange-600 shadow-glow flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-orange-200" />
              Online Proje Başlat
            </button>
          </div>
        )}
      </header>
    </>
  );
};
