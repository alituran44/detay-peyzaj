import React from 'react';
import { Compass, Trees, Layers, BookOpen, FileSpreadsheet, CheckCircle2, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { DELIVERABLES_LIST } from '../data/projectsData';

interface DeliverablesSectionProps {
  onOpenOrderWizard: () => void;
}

const iconMap = {
  Compass: Compass,
  Trees: Trees,
  Layers: Layers,
  BookOpen: BookOpen,
  FileSpreadsheet: FileSpreadsheet,
};

export const DeliverablesSection: React.FC<DeliverablesSectionProps> = ({ onOpenOrderWizard }) => {
  return (
    <section id="paket-icerigi" className="py-24 bg-obsidian-900 relative overflow-hidden border-t border-orange-950">
      {/* Glow background auras */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-orange-950/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-950/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 bg-orange-950/60 text-orange-400 border border-orange-800/50 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Eksiksiz Mühendislik & Mimari Teslimat Paketi
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight">
            5 İş Gününde Size Teslim Edilen <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-200">
              5 Parçalı Proje Çıktıları
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Türkiye'nin neresinde olursanız olun; yerel ustanıza, hafriyatçınıza veya müteahhidinize teslim edip sıfır hatayla uygulayabileceğiniz eksiksiz mimari pafta seti.
          </p>
        </div>

        {/* 5 Deliverables Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {DELIVERABLES_LIST.map((item, idx) => {
            const IconComponent = iconMap[item.iconName as keyof typeof iconMap] || Compass;
            return (
              <div
                key={idx}
                className={`relative rounded-3xl p-7 bg-obsidian-950 border transition-all duration-300 hover:border-orange-500/60 shadow-xl flex flex-col justify-between group ${
                  idx === 4 ? 'md:col-span-2 lg:col-span-1 border-orange-500/40 bg-gradient-to-b from-obsidian-950 to-orange-950/30' : 'border-orange-950/80'
                }`}
              >
                <div className="space-y-4">
                  {/* Top Badge & Number */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-orange-950/80 border border-orange-800/60 flex items-center justify-center text-orange-400 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-md">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-mono font-black text-orange-900/60 group-hover:text-orange-400/40 transition-colors">
                      {item.number}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-orange-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs font-semibold text-orange-400/90 mt-0.5 font-mono">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Footer Format Tag */}
                <div className="pt-5 mt-4 border-t border-orange-950/80 flex items-center justify-between text-[11px]">
                  <span className="font-mono text-slate-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" />
                    {item.format}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Guarantee Banner */}
        <div className="mt-14 p-8 rounded-3xl bg-gradient-to-r from-obsidian-950 via-orange-950/30 to-obsidian-950 border border-orange-500/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> TMMOB Peyzaj Mimarları Odası Standartlarında
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
              Tüm Paftalarınız 5 İş Gününde Dijital Olarak Teslim Edilir
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              DWG paftaları, yüksek çözünürlüklü PDF çizimleri ve Excel metraj listesi e-posta ve WhatsApp üzerinden wetransfer / bulut bağlantısıyla iletilir.
            </p>
          </div>

          <button
            onClick={onOpenOrderWizard}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm shadow-glow transition-all flex items-center gap-3 shrink-0 group cursor-pointer"
          >
            <span>Hemen Proje Siparişi Ver</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};
