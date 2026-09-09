import React, { useState } from 'react';
import { Sparkles, FileCheck, Layers, Droplets, CheckCircle, ArrowRight, X } from 'lucide-react';
import { SERVICES_LIST } from '../data/projectsData';
import type { ServiceItem } from '../types';

interface ServicesSectionProps {
  onOpenOrderWizard: () => void;
}

const serviceIconMap = {
  FileCheck: FileCheck,
  Layers: Layers,
  Droplets: Droplets,
};

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenOrderWizard }) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  return (
    <section id="hizmetler" className="py-24 bg-obsidian-950 relative overflow-hidden border-t border-orange-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-1.5 bg-orange-950/60 text-orange-400 border border-orange-800/50 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Profesyonel Peyzaj Mimarlığı Hizmetlerimiz
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight">
            Uzman Kadromuzla Sunduğumuz <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-200">
              3 Temel Mühendislik Hizmeti
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            İmar ruhsatından 4K fotogerçekçi 3D sunumlara ve su tasarruflu otomatik sulama planlarına kadar tüm süreç tek çatı altında.
          </p>

          {/* Instagram Review Button */}
          <div className="pt-2 flex justify-center">
            <a
              href="https://www.instagram.com/detay_proje_mimarlik/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600/20 via-purple-600/20 to-orange-600/20 hover:from-pink-600/30 hover:to-orange-600/30 border border-pink-500/40 text-pink-300 hover:text-white px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95 group"
            >
              <InstagramIcon className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
              <span>Örnek Proje Çizimlerini Instagram'da İncele</span>
              <ArrowRight className="w-3.5 h-3.5 text-orange-400 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* 3 Services Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SERVICES_LIST.map((service) => {
            const IconComp = serviceIconMap[service.iconName as keyof typeof serviceIconMap] || Layers;
            return (
              <div
                key={service.id}
                className="rounded-3xl bg-obsidian-900 border border-orange-950/80 hover:border-orange-500/50 transition-all duration-300 overflow-hidden shadow-xl flex flex-col justify-between group"
              >
                {/* Service Image Header */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={service.image}
                    alt={`${service.title} - Detay Peyzaj`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-obsidian-900/40 to-transparent" />
                  
                  <div className="absolute top-4 left-4 w-12 h-12 rounded-2xl bg-obsidian-950/90 border border-orange-500/50 backdrop-blur-md flex items-center justify-center text-orange-400 shadow-md">
                    <IconComp className="w-6 h-6" />
                  </div>
                </div>

                {/* Service Body */}
                <div className="p-7 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-orange-300 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {service.shortDesc}
                    </p>
                  </div>

                  {/* Feature Bullets */}
                  <div className="space-y-2 pt-2 border-t border-orange-950">
                    {service.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedService(service)}
                      className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Detayları İncele</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={onOpenOrderWizard}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 shadow-glow-sm transition-all cursor-pointer"
                    >
                      Teklif Al
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Instagram Projects Callout Banner */}
        <div className="mt-12 bg-gradient-to-r from-obsidian-900 via-orange-950/40 to-obsidian-900 p-6 sm:p-8 rounded-3xl border border-orange-900/60 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4 text-left">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-orange-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400 shrink-0 shadow-glow-sm">
              <InstagramIcon className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-white font-serif">
                Tüm Canlı Uygulama ve 3D Render Videolarımız
              </h4>
              <p className="text-xs sm:text-sm text-slate-300">
                @detay_proje_mimarlik Instagram sayfamızda tamamlanan villa bahçeleri, otomatik sulama projeleri ve uygulama videolarını inceleyin.
              </p>
            </div>
          </div>

          <a
            href="https://www.instagram.com/detay_proje_mimarlik/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-pink-600 via-purple-600 to-orange-600 hover:from-pink-500 hover:to-orange-500 transition-all shadow-glow flex items-center gap-2.5 whitespace-nowrap active:scale-95 cursor-pointer shrink-0"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>Instagram'da İncele</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/90 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full max-w-2xl bg-obsidian-900 border border-orange-500/50 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-obsidian-950 text-white border border-orange-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-950 border border-orange-600 flex items-center justify-center text-orange-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider font-mono">Detay Peyzaj Hizmeti</span>
                <h3 className="text-2xl font-serif font-bold text-white">{selectedService.title}</h3>
              </div>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed">
              {selectedService.fullDesc}
            </p>

            <div className="space-y-2 bg-obsidian-950 p-4 rounded-2xl border border-orange-950">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Hizmet Kapsamındaki Avantajlar:</h4>
              {selectedService.benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => {
                  setSelectedService(null);
                  onOpenOrderWizard();
                }}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-orange-600 hover:bg-orange-500 shadow-glow flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Bu Hizmet İçin 5 Günde Proje Başlat</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
