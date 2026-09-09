import { useState } from 'react';
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
import { MessageCircle, Sparkles, Calculator } from 'lucide-react';
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
