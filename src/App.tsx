import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { OrderWizard } from './components/OrderWizard';
import { PricingCalculatorModal } from './components/PricingCalculatorModal';
import { LegalModals, type LegalModalType } from './components/LegalModals';
import { AuthModal } from './components/auth/AuthModal';
import { CustomerPortalModal } from './components/dashboard/CustomerPortalModal';
import { AdminDashboardModal } from './components/dashboard/AdminDashboardModal';
import { GoogleAdSenseBanner } from './components/ads/GoogleAdSenseBanner';
import { MessageCircle, Sparkles, Calculator, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { DEFAULT_SERVICES } from './utils/pricing';
import type { SelectedServices } from './types';

function MainApp() {
  const [currentView, setCurrentView] = useState<'home' | 'order' | 'admin' | 'customer'>('home');
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isCustomerPortalOpen, setIsCustomerPortalOpen] = useState<boolean>(false);
  const [selectedArea, setSelectedArea] = useState<number>(1000);
  const [selectedServices, setSelectedServices] = useState<SelectedServices>(DEFAULT_SERVICES);
  const [activeLegalModal, setActiveLegalModal] = useState<LegalModalType>(null);

  // Paynkolay 3D Callback Notification Modal State
  const [paymentNotice, setPaymentNotice] = useState<{
    isOpen: boolean;
    type: 'success' | 'failed';
    orderId: string;
    txnId?: string;
    message?: string;
  }>({
    isOpen: false,
    type: 'success',
    orderId: '',
  });

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const paymentStatus = urlParams.get('payment');
      const orderId = urlParams.get('orderId') || '';
      const txnId = urlParams.get('txnId') || '';
      const errorMsg = urlParams.get('error') || '';

      if (paymentStatus === 'success') {
        setPaymentNotice({
          isOpen: true,
          type: 'success',
          orderId,
          txnId,
        });

        // Trigger celebration confetti
        try {
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#f97316', '#22c55e', '#f59e0b', '#ffffff'],
          });
        } catch (e) {
          console.warn('Confetti notice:', e);
        }

        // Clean query params from URL cleanly without reloading
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (paymentStatus === 'failed') {
        setPaymentNotice({
          isOpen: true,
          type: 'failed',
          orderId,
          message: errorMsg || 'Banka tarafından işlem onaylanamadı. Lütfen kart limitinizi ve bilgilerinizi kontrol ediniz.',
        });

        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (e) {
      console.warn('URL payment param parse notice:', e);
    }
  }, []);

  const openOrderPage = (areaM2?: number, services?: SelectedServices) => {
    if (areaM2) setSelectedArea(areaM2);
    if (services) setSelectedServices(services);
    setCurrentView('order');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAdminPage = () => {
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const backToHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {currentView === 'admin' ? (
        <AdminDashboardModal
          isOpen={true}
          onClose={backToHome}
        />
      ) : currentView === 'order' ? (
        <OrderWizard
          isOpen={true}
          onClose={backToHome}
          initialArea={selectedArea}
          initialServices={selectedServices}
          onOpenLegalModal={(type) => setActiveLegalModal(type)}
        />
      ) : (
        <div className="min-h-screen bg-obsidian-950 text-slate-100 font-sans selection:bg-orange-500 selection:text-white">
          
          {/* Top Navbar with Auth Integration & Instagram Link */}
          <Navbar
            onOpenOrderWizard={() => openOrderPage()}
            onOpenCalculator={() => setIsCalculatorOpen(true)}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onOpenCustomerPortal={() => setIsCustomerPortalOpen(true)}
            onOpenAdminDashboard={openAdminPage}
          />

          {/* Main Content Sections */}
          <main>
            <Hero
              onStartOrderWithConfig={(area, services) => openOrderPage(area, services)}
              onOpenOrderWizard={() => openOrderPage()}
            />

            {/* Hakkımızda Bölümü */}
            <AboutSection />

            {/* 3 Ana Mühendislik Hizmetimiz */}
            <ServicesSection
              onOpenOrderWizard={() => openOrderPage()}
            />

            {/* Google AdSense In-Feed Leaderboard */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2">
              <GoogleAdSenseBanner
                adSlot="7374650291"
                adFormat="auto"
                label="SPONSORLU BAĞLANTI / GOOGLE ADS"
                fallbackTitle="Peyzaj Mimarlığı & Bahçe Tasarım Sponsor Alanı"
              />
            </div>

            {/* Müşteri Yorumları */}
            <Testimonials />

            {/* Google AdSense Mid-Page Banner */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2">
              <GoogleAdSenseBanner
                adSlot="7374650292"
                adFormat="auto"
                label="SPONSORLU İÇERİK / GOOGLE ADS"
                fallbackTitle="Otomatik Sulama & 3D Render Sponsor Alanı"
              />
            </div>

            {/* SSS */}
            <FAQ />
          </main>

          {/* Footer with Legal Links & Payment Logos */}
          <Footer onOpenLegalModal={(type) => setActiveLegalModal(type)} />
        </div>
      )}

      <PricingCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        onSelectPricing={(area, services) => {
          setIsCalculatorOpen(false);
          openOrderPage(area, services);
        }}
      />

      {/* Legal Modals Popup */}
      <LegalModals
        activeType={activeLegalModal}
        onClose={() => setActiveLegalModal(null)}
      />

      {/* Auth Modal (Login / Register / Demo) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsAuthModalOpen(false);
          setCurrentView('home');
        }}
      />

      {/* Customer Portal Modal */}
      <CustomerPortalModal
        isOpen={isCustomerPortalOpen}
        onClose={() => setIsCustomerPortalOpen(false)}
        onOpenOrderWizard={() => {
          setIsCustomerPortalOpen(false);
          openOrderPage();
        }}
        onOpenAdminDashboard={() => {
          setIsCustomerPortalOpen(false);
          openAdminPage();
        }}
      />

      {/* Paynkolay 3D Payment Notice Modal */}
      {paymentNotice.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/90 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-obsidian-900 border border-orange-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5 animate-scale-up">
            <button
              onClick={() => setPaymentNotice((prev) => ({ ...prev, isOpen: false }))}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-obsidian-950/60 border border-orange-950 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {paymentNotice.type === 'success' ? (
              <>
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-glow">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-emerald-400 font-mono uppercase tracking-wider">
                    Ödeme Başarıyla Tahsil Edildi
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                    3D Secure Onaylandı!
                  </h3>
                  <p className="text-xs text-slate-300">
                    Paynkolay Sanal POS üzerinden ödemeniz alındı. Projeniz peyzaj mimarımız tarafından çizilmeye başlandı.
                  </p>
                </div>

                <div className="bg-obsidian-950 p-4 rounded-2xl border border-orange-950 text-left space-y-2 text-xs">
                  <div className="flex justify-between border-b border-orange-950/80 pb-2">
                    <span className="text-slate-400">Sipariş No:</span>
                    <span className="font-mono font-bold text-orange-400">{paymentNotice.orderId || 'DP-2026'}</span>
                  </div>
                  {paymentNotice.txnId && (
                    <div className="flex justify-between border-b border-orange-950/80 pb-2">
                      <span className="text-slate-400">Banka Ref No:</span>
                      <span className="font-mono text-emerald-400">{paymentNotice.txnId}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-400">Teslimat Süresi:</span>
                    <span className="text-emerald-400 font-semibold">5 İş Günü</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <button
                    onClick={() => {
                      setPaymentNotice((prev) => ({ ...prev, isOpen: false }));
                      setIsCustomerPortalOpen(true);
                    }}
                    className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-glow flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Müşteri Panelinde Projemi Aç</span>
                  </button>
                  <a
                    href="https://wa.me/905444772044?text=Merhaba,%20Paynkolay%20ile%20sipari%C5%9Fim%20onayland%C4%B1."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl border border-orange-950 hover:bg-obsidian-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp Mimar Bilgilendirme</span>
                  </a>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 mx-auto flex items-center justify-center shadow-glow">
                  <AlertCircle className="w-8 h-8" />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-rose-400 font-mono uppercase tracking-wider">
                    Ödeme İşlemi Başarısız
                  </span>
                  <h3 className="text-xl font-serif font-bold text-white">
                    Banka Onayı Verilemedi
                  </h3>
                  <p className="text-xs text-rose-200">
                    {paymentNotice.message}
                  </p>
                </div>

                <div className="p-3 bg-obsidian-950 rounded-2xl border border-orange-950 text-xs text-slate-300">
                  Dilerseniz kart bilgilerinizi kontrol edip tekrar deneyebilir veya <strong>Havale / FAST</strong> seçeneği ile siparişinizi tamamlayabilirsiniz.
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <button
                    onClick={() => {
                      setPaymentNotice((prev) => ({ ...prev, isOpen: false }));
                      openOrderPage();
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs shadow-glow cursor-pointer"
                  >
                    Tekrar Dene / Siparişi Tamamla
                  </button>
                  <button
                    onClick={() => setPaymentNotice((prev) => ({ ...prev, isOpen: false }))}
                    className="w-full py-2.5 rounded-xl border border-orange-950 text-slate-400 hover:text-white text-xs font-semibold"
                  >
                    Kapat
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        
        {/* Floating Quick Calculator */}
        <button
          onClick={() => setIsCalculatorOpen(true)}
          className="w-12 h-12 rounded-2xl bg-obsidian-900/90 hover:bg-obsidian-850 text-orange-400 border border-orange-500/50 shadow-xl flex items-center justify-center backdrop-blur-md transition-all hover:scale-105 cursor-pointer"
          title="Fiyat Hesaplayıcı"
        >
          <Calculator className="w-5 h-5" />
        </button>

        {/* Floating WhatsApp Support */}
        <a
          href="https://wa.me/905444772044?text=Merhaba,%20online%20peyzaj%20projesi%20hakkinda%20bilgi%20almak%20istiyorum."
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
          title="WhatsApp Destek"
        >
          <MessageCircle className="w-6 h-6" />
        </a>

        {/* Floating Start Project */}
        {currentView === 'home' && (
          <button
            onClick={() => openOrderPage()}
            className="px-4 py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs shadow-glow flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-orange-200 animate-pulse" />
            <span className="hidden sm:inline">Online Proje Başlat</span>
          </button>
        )}

      </div>
    </>
  );
}

export function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
