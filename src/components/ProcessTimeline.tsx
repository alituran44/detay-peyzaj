import React from 'react';
import { UploadCloud, Compass, Layers, FileCheck, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

interface ProcessTimelineProps {
  onOpenOrderWizard: () => void;
}

const steps = [
  {
    day: '1. GÜN',
    title: 'Arsa Evrakları & İhtiyaç Analizi',
    description: 'Tapu fotokopisi, arsa krokisi ve çektiğiniz fotoğrafları sisteme yüklersiniz. Peyzaj mimarımız arsanızın iklim ve topoğrafya analizini tamamlar.',
    icon: UploadCloud,
    highlight: 'Belge & İhtiyaç Analizi'
  },
  {
    day: '2. GÜN',
    title: 'Yapısal Vaziyet Planı & Zonlama',
    description: 'Sert zeminler, yürüyüş yolları, havuz, teras, otopark ve oturma alanlarının fonksiyonel yerleşimleri AutoCAD ortamında ölçeklendirilir.',
    icon: Compass,
    highlight: 'AutoCAD Yapısal Plan'
  },
  {
    day: '3. GÜN',
    title: 'Bitkilendirme & Otomatik Sulama Projesi',
    description: 'Bölgenin iklimine uygun fidan ve çim türleri seçilir; %50 su tasarruflu otomatik sulama zonlama ve boru çapı hesapları tamamlanır.',
    icon: Layers,
    highlight: 'Bitki Seçimi & Sulama'
  },
  {
    day: '4. GÜN',
    title: '3D Modelleme & Fotogerçekçi Renderlar',
    description: 'Bahçenizin gerçek doku, kot ve gece aydınlatma atmosferini gösteren yüksek çözünürlüklü 4K renderlar hazırlanır.',
    icon: Sparkles,
    highlight: '4K Renderlar'
  },
  {
    day: '5. GÜN',
    title: 'Teslimat, Metraj Listesi & Revizyon',
    description: 'Tüm DWG paftaları, detay kesitleri, PDF dosyaları ve malzeme metraj listesi tarafınıza iletilir. 1 tur ücretsiz revizyon hakkınız başlar.',
    icon: FileCheck,
    highlight: 'Eksiksiz Teslimat & Metraj'
  }
];

export const ProcessTimeline: React.FC<ProcessTimelineProps> = ({ onOpenOrderWizard }) => {
  return (
    <section className="py-24 bg-obsidian-950 relative overflow-hidden border-t border-orange-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 bg-orange-950/80 text-orange-400 border border-orange-800/60 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> 5 İş Günü Teslimat Yol Haritası
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight">
            Siparişinizden Teslimata <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-200">
              Gün Gün Proje Sürecimiz
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Her aşaması şeffaf, kayıt altında ve sözleşmeli 5 günlük garantili teslimat takvimi.
          </p>
        </div>

        {/* 5-Day Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl p-6 bg-obsidian-900 border border-orange-950/80 hover:border-orange-500/60 transition-all duration-300 shadow-xl flex flex-col justify-between group relative"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-orange-400 bg-orange-950/80 px-2.5 py-1 rounded-full border border-orange-800/60">
                      {step.day}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-orange-950 flex items-center justify-center text-orange-400 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-md">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-orange-300 transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-orange-950 text-[11px] text-orange-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{step.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Bar */}
        <div className="mt-12 text-center">
          <button
            onClick={onOpenOrderWizard}
            className="px-8 py-4 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-glow transition-all inline-flex items-center gap-3 cursor-pointer"
          >
            <span>5 Günlük Süreci Başlat</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
