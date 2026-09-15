import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Layers, ChevronRight, CheckSquare, Square, Phone, Edit3 } from 'lucide-react';
import { calculatePricing, formatTL, DEFAULT_SERVICES } from '../utils/pricing';
import type { SelectedServices } from '../types';

interface HeroProps {
  onStartOrderWithConfig: (areaM2: number, services: SelectedServices) => void;
  onOpenOrderWizard: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartOrderWithConfig, onOpenOrderWizard }) => {
  const [heroArea, setHeroArea] = useState<number>(1000);
  const [services, setServices] = useState<SelectedServices>(DEFAULT_SERVICES);

  const pricing = calculatePricing(heroArea, services);

  const toggleService = (key: keyof SelectedServices) => {
    // Ensure at least one service is selected
    const nextServices = { ...services, [key]: !services[key] };
    if (!nextServices.landscapeProject && !nextServices.visual3D && !nextServices.irrigationProject) {
      return; // prevent unchecking all
    }
    setServices(nextServices);
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-8 pb-20">
      
      {/* Background Image with Deep High-Contrast Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/slider/S1.jpeg"
          alt="Detay Peyzaj & Mimarlık Çanakkale Peyzaj Tasarımı ve Projelendirme"
          decoding="async"
          className="w-full h-full object-cover object-center scale-105"
        />
        {/* Multi-layered dark obsidian gradient with warm amber/orange tint */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/90 to-obsidian-950/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950 via-obsidian-950/95 to-obsidian-950/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,_var(--tw-gradient-stops))] from-obsidian-950 via-obsidian-950/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content with Scrim / High-Contrast Typography */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Guarantee Badge in Orange */}
            <div className="inline-flex items-center gap-2 bg-obsidian-900/90 border border-orange-500/50 px-4 py-1.5 rounded-full text-xs font-semibold text-orange-300 shadow-2xl backdrop-blur-md">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <span className="font-bold">5 İş Gününde Eksiksiz Teslim Garantisi</span>
              <span className="bg-orange-500/20 text-orange-200 border border-orange-500/30 px-2 py-0.5 rounded-md text-[10px] font-bold">
                %25'e Varan İndirim
              </span>
            </div>

            {/* Main Headline without 3D emphasis */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.15] drop-shadow-md">
              Doğayla Uyumlu <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-200 drop-shadow-sm">
                Estetik Yaşam Alanları &
              </span> <br />
              Peyzaj Projeleri.
            </h1>

            {/* Subtitle with Dark Background Scrim for 100% Readability */}
            <div className="bg-obsidian-950/75 backdrop-blur-sm p-4 rounded-2xl border border-orange-950/80 max-w-2xl mx-auto lg:mx-0 shadow-lg">
              <p className="text-sm sm:text-base text-slate-100 font-normal leading-relaxed">
                Tapunuzu ve fotoğraflarınızı yükleyin; uzman peyzaj mimarlarımız arsanıza özel <strong className="text-orange-300 font-semibold">Yapısal & Bitkisel Peyzaj Projesi</strong>, <strong className="text-orange-300 font-semibold">3D Görsel Tasarım</strong> ve <strong className="text-orange-300 font-semibold">Otomatik Sulama Projesini</strong> 5 iş gününde hazırlasın.
              </p>
            </div>

            {/* Value Checkpoints */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2 text-xs font-semibold text-white bg-obsidian-900/90 backdrop-blur-md p-3 rounded-xl border border-orange-950 shadow-md">
                <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Ruhsat & Uygulama Projesi</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-white bg-obsidian-900/90 backdrop-blur-md p-3 rounded-xl border border-orange-950 shadow-md">
                <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Sulama Planı</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-white bg-obsidian-900/90 backdrop-blur-md p-3 rounded-xl border border-orange-950 shadow-md">
                <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                <span>1 Tur Ücretsiz Revizyon</span>
              </div>
            </div>

            {/* Fason Çizim & E-İmza Kargo Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2 text-[11px] text-orange-200 bg-orange-950/40 p-2.5 rounded-xl border border-orange-800/50">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span><strong>Fason Çizim:</strong> Ofislere antetsiz/başlıksız DWG & PDF</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-emerald-200 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-800/50">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>Resmi Onay:</strong> E-İmza & Islak İmzalı Kargo Gönderimi</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center lg:justify-start">
              <button
                onClick={onOpenOrderWizard}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-base shadow-glow transition-all duration-300 flex items-center justify-center gap-3 border border-orange-400/40 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-orange-200" />
                <span>Online Proje Siparişi Ver</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                href="#oncesi-sonrasi"
                className="px-6 py-4 rounded-2xl bg-obsidian-900/95 hover:bg-orange-950/40 text-white font-semibold text-sm border border-orange-900/60 hover:border-orange-500/50 shadow-lg backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Dönüşüm Örneklerini İncele</span>
                <ChevronRight className="w-4 h-4 text-orange-400" />
              </a>
            </div>

            {/* Proof Badges */}
            <div className="pt-4 border-t border-orange-950 flex items-center justify-center lg:justify-start gap-6 sm:gap-10">
              <div className="bg-obsidian-900/80 border border-orange-950 px-4 py-2 rounded-xl backdrop-blur-md shadow-md">
                <div className="text-2xl font-bold font-mono text-white">30+</div>
                <div className="text-xs text-slate-300 font-medium">Tamamlanan Proje</div>
              </div>
              <div className="bg-obsidian-900/80 border border-orange-950 px-4 py-2 rounded-xl backdrop-blur-md shadow-md">
                <div className="text-2xl font-bold font-mono text-white">35+ Yıl</div>
                <div className="text-xs text-slate-300 font-medium">Mimari Deneyim</div>
              </div>
              <div className="bg-obsidian-900/80 border border-orange-950 px-4 py-2 rounded-xl backdrop-blur-md shadow-md">
                <div className="text-2xl font-bold font-mono text-orange-400">%100</div>
                <div className="text-xs text-slate-300 font-medium">Müşteri Memnuniyeti</div>
              </div>
            </div>

          </div>

          {/* Right Modular Live Calculator Widget */}
          <div className="lg:col-span-5">
            <div className="bg-obsidian-900/95 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-orange-500/40 shadow-2xl relative">
              <div className="space-y-5">
                
                {/* Widget Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Canlı Fiyat Hesaplayıcı</h3>
                      <p className="text-[11px] text-slate-300">Hizmetleri seçin, dönüm indirimi anlık uygulansın</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-orange-300 bg-orange-950 border border-orange-600/50 px-2.5 py-1 rounded-full shadow-sm">
                    Otomatik İndirim
                  </span>
                </div>

                {/* 3 Modular Service Checkboxes */}
                <div className="space-y-2 bg-obsidian-950 p-3.5 rounded-2xl border border-orange-950">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Hesaplamaya Dahil Edilecek Hizmetler:
                  </span>

                  {/* 1. Peyzaj Projesi */}
                  <div
                    onClick={() => toggleService('landscapeProject')}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                      services.landscapeProject
                        ? 'bg-orange-950/40 border-orange-500/60 text-white'
                        : 'bg-obsidian-900/50 border-orange-950/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {services.landscapeProject ? (
                        <CheckSquare className="w-4 h-4 text-orange-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-600 shrink-0" />
                      )}
                      <span className="text-xs font-semibold">Peyzaj Projesi (Ruhsat & Uygulama)</span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-orange-300">12.000 TL/Dönüm</span>
                  </div>

                  {/* 2. 3D Görsel Tasarım */}
                  <div
                    onClick={() => toggleService('visual3D')}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                      services.visual3D
                        ? 'bg-orange-950/40 border-orange-500/60 text-white'
                        : 'bg-obsidian-900/50 border-orange-950/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {services.visual3D ? (
                        <CheckSquare className="w-4 h-4 text-orange-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-600 shrink-0" />
                      )}
                      <span className="text-xs font-semibold">3D Görsel Tasarım (4K Render)</span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-orange-300">12.000 TL/Dönüm</span>
                  </div>

                  {/* 3. Sulama Projesi */}
                  <div
                    onClick={() => toggleService('irrigationProject')}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                      services.irrigationProject
                        ? 'bg-orange-950/40 border-orange-500/60 text-white'
                        : 'bg-obsidian-900/50 border-orange-950/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {services.irrigationProject ? (
                        <CheckSquare className="w-4 h-4 text-orange-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-600 shrink-0" />
                      )}
                      <span className="text-xs font-semibold">Sulama Projesi (Otomatik Plan)</span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-orange-300">8.000 TL/Dönüm</span>
                  </div>
                </div>

                {/* Slider Input (Enhanced Size & Distinct Amber/Gold Theme) */}
                <div className="space-y-3.5 bg-gradient-to-br from-obsidian-950 via-amber-950/20 to-obsidian-950 p-5 rounded-2xl border-2 border-amber-500/50 shadow-glow-sm">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      <span className="text-xs font-bold text-amber-200 uppercase tracking-wider">Arsa Alanı:</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-1 bg-obsidian-900/95 border-2 border-amber-500/60 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-500/30 px-3 py-1 rounded-xl shadow-inner transition-all group">
                        <input
                          type="number"
                          min="100"
                          max="50000"
                          step="10"
                          value={heroArea || ''}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setHeroArea(val > 0 ? val : 0);
                          }}
                          className="w-24 text-2xl font-black font-mono text-amber-200 bg-transparent outline-none text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none cursor-text"
                          title="Arsa alanını elle yazabilirsiniz"
                        />
                        <span className="text-xs font-bold text-amber-400 select-none">m²</span>
                        <Edit3 className="w-3 h-3 text-amber-500/60 group-hover:text-amber-400 group-focus-within:text-amber-400 shrink-0" />
                      </div>
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-1 rounded-xl text-[11px] font-bold font-mono">
                        {pricing.areaDonum} Dönüm
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <input
                      type="range"
                      min="300"
                      max="4000"
                      step="50"
                      value={heroArea}
                      onChange={(e) => setHeroArea(Number(e.target.value))}
                      className="w-full h-3.5 bg-obsidian-900 rounded-full appearance-none cursor-pointer accent-amber-400 border border-amber-500/50 shadow-inner"
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 text-center text-[11px] font-mono font-bold text-slate-300">
                    <button
                      type="button"
                      onClick={() => setHeroArea(500)}
                      className={`py-1 rounded-lg transition-all cursor-pointer ${
                        heroArea === 500
                          ? 'bg-amber-500 text-obsidian-950 font-black shadow-glow-sm'
                          : 'hover:text-amber-300 hover:bg-amber-950/40 bg-obsidian-900/60 border border-amber-500/20'
                      }`}
                    >
                      500 m²
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeroArea(1000)}
                      className={`py-1 rounded-lg transition-all cursor-pointer ${
                        heroArea === 1000
                          ? 'bg-amber-500 text-obsidian-950 font-black shadow-glow-sm'
                          : 'hover:text-amber-300 hover:bg-amber-950/40 bg-obsidian-900/60 border border-amber-500/20'
                      }`}
                    >
                      1 Dönüm
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeroArea(2000)}
                      className={`py-1 rounded-lg transition-all cursor-pointer ${
                        heroArea === 2000
                          ? 'bg-amber-500 text-obsidian-950 font-black shadow-glow-sm'
                          : 'hover:text-amber-300 hover:bg-amber-950/40 bg-obsidian-900/60 border border-amber-500/20'
                      }`}
                    >
                      2 Dönüm
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeroArea(3500)}
                      className={`py-1 rounded-lg transition-all cursor-pointer ${
                        heroArea === 3500
                          ? 'bg-amber-500 text-obsidian-950 font-black shadow-glow-sm'
                          : 'hover:text-amber-300 hover:bg-amber-950/40 bg-obsidian-900/60 border border-amber-500/20'
                      }`}
                    >
                      3.5 Dönüm
                    </button>
                  </div>

                  <div className="pt-3 border-t border-amber-950/80 text-center">
                    <div className="p-2.5 sm:p-3 rounded-2xl bg-amber-950/50 border border-amber-500/40 text-center shadow-glow-sm">
                      <p className="text-xs sm:text-sm text-slate-100 font-medium">
                        <span className="text-amber-400 font-extrabold">4 dönüm üzeri</span> projeleriniz için{' '}
                        <a
                          href="tel:+905444772044"
                          className="text-amber-300 hover:text-white font-black font-mono text-sm sm:text-base underline underline-offset-4 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-amber-500/20 border border-amber-500/50 hover:bg-amber-500 hover:text-obsidian-950 transition-all shadow-sm"
                        >
                          <Phone className="w-3.5 h-3.5 inline shrink-0" />
                          <span>0544 477 20 44</span>
                        </a>{' '}
                        <span className="text-slate-200">özel teklif almak için arayın.</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Price Display */}
                <div className="bg-obsidian-950 p-5 rounded-2xl border border-orange-900/60 space-y-2.5 shadow-md">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Baz Fiyat Toplamı:</span>
                    <span className="font-mono line-through text-slate-500">{formatTL(pricing.basePrice)}</span>
                  </div>

                  {pricing.discountRate > 0 && (
                    <div className="flex justify-between text-xs text-orange-400 font-bold">
                      <span>Kademeli Dönüm İndirimi (%{pricing.discountRate}):</span>
                      <span className="font-mono">- {formatTL(pricing.discountAmount)}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-orange-950 flex justify-between items-baseline">
                    <span className="text-xs font-bold text-white">Toplam Proje Bedeli:</span>
                    <span className="text-3xl font-black font-mono text-white tracking-tight">
                      {formatTL(pricing.finalPrice)}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 text-right">KDV Dahil • 5 İş Gününde Teslim</div>
                </div>

                {/* Widget CTA */}
                <button
                  onClick={() => onStartOrderWithConfig(heroArea, services)}
                  className="w-full py-4 rounded-xl font-bold text-sm text-white bg-orange-600 hover:bg-orange-500 shadow-glow transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Bu Seçimlerle Proje Başlat</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="text-center">
                  <p className="text-[11px] text-slate-300 font-medium flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
                    Belgelerinizi yükleyin, 5 iş gününde teslim alın.
                  </p>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
