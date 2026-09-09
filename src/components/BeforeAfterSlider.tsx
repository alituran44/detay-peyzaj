import React, { useState, useRef, useCallback } from 'react';
import { Sparkles, MoveHorizontal, CheckCircle2, ArrowRight } from 'lucide-react';

interface BeforeAfterSliderProps {
  onOpenOrderWizard: () => void;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ onOpenOrderWizard }) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, position)));
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <section id="oncesi-sonrasi" className="py-24 bg-obsidian-950 relative overflow-hidden border-t border-orange-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 bg-orange-950/80 text-orange-400 border border-orange-800/60 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> İnteraktif Dönüşüm Karşılaştırması
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight">
            Ham Bir Arsadan <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-200">
              Kusursuz Bir Yaşam Alanına
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Sadece arsa fotoğrafınızı ve krokisini gönderin; 5 iş günü içinde projelendirilmiş, kotları belirlenmiş ve bitkilendirilmiş peyzaj projenizi hazırlayalım.
          </p>
        </div>

        {/* Interactive Comparison Slider */}
        <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-orange-500/40 select-none">
          
          <div
            ref={containerRef}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="relative h-[400px] sm:h-[500px] lg:h-[580px] w-full cursor-ew-resize overflow-hidden"
          >
            {/* "After" Image (Full background) */}
            <img
              src="/images/slider/S1.jpeg"
              alt="Detay Peyzaj Projelendirilmiş Lüks Peyzaj Uygulaması"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            {/* "After" Label Badge */}
            <div className="absolute top-6 right-6 z-20 bg-obsidian-950/90 backdrop-blur-md border border-orange-500/60 px-4 py-1.5 rounded-full text-xs font-bold text-orange-300 shadow-xl flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-orange-400" />
              <span>5. Gün: Projelendirilmiş Mimari Tasarım</span>
            </div>

            {/* "Before" Image (Clipped Left Layer) */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src="/images/slider/S3.jpeg"
                alt="Detay Peyzaj Ham Arsa ve Röleve Hali"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
              />
              <div className="absolute inset-0 bg-obsidian-950/20" />
              
              {/* "Before" Label Badge */}
              <div className="absolute top-6 left-6 z-20 bg-obsidian-950/90 backdrop-blur-md border border-slate-700 px-4 py-1.5 rounded-full text-xs font-bold text-slate-300 shadow-xl">
                <span>1. Gün: Ham Arsa & Kroki</span>
              </div>
            </div>

            {/* Draggable Divider Line */}
            <div
              className="absolute top-0 bottom-0 z-30 w-1 bg-gradient-to-b from-orange-400 via-white to-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.8)]"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-orange-600 border-2 border-white shadow-2xl flex items-center justify-center text-white">
                <MoveHorizontal className="w-5 h-5 animate-pulse" />
              </div>
            </div>

          </div>

          {/* Slider Caption Footer */}
          <div className="bg-obsidian-950 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-orange-950 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <MoveHorizontal className="w-4 h-4 text-orange-400" />
              <span>Çizgiyi sağa ve sola sürükleyerek dönüşümü inceleyin.</span>
            </div>

            <button
              onClick={onOpenOrderWizard}
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-orange-600 hover:bg-orange-500 shadow-glow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Arsam İçin Proje Başlat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
