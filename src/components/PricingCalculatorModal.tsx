import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, CheckSquare, Square, Phone, Edit3 } from 'lucide-react';
import { calculatePricing, formatTL, DEFAULT_SERVICES } from '../utils/pricing';
import type { SelectedServices } from '../types';

interface PricingCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPricing: (areaM2: number, services: SelectedServices) => void;
}

export const PricingCalculatorModal: React.FC<PricingCalculatorModalProps> = ({
  isOpen,
  onClose,
  onSelectPricing,
}) => {
  const [areaM2, setAreaM2] = useState<number>(1000);
  const [services, setServices] = useState<SelectedServices>(DEFAULT_SERVICES);

  if (!isOpen) return null;

  const pricing = calculatePricing(areaM2, services);

  const toggleService = (key: keyof SelectedServices) => {
    const nextServices = { ...services, [key]: !services[key] };
    if (!nextServices.landscapeProject && !nextServices.visual3D && !nextServices.irrigationProject) {
      return;
    }
    setServices(nextServices);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-2xl bg-obsidian-900 border border-orange-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-orange-950 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-white">Canlı Fiyat Hesaplayıcı</h3>
              <p className="text-xs text-slate-400">Hizmetlerinizi ve arsa alanınızı seçin</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-obsidian-950 text-slate-400 hover:text-white border border-orange-950 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Modular Services */}
        <div className="space-y-2 bg-obsidian-950 p-4 rounded-2xl border border-orange-950">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Pakete Dahil Edilecek Hizmetler:
          </span>

          <div
            onClick={() => toggleService('landscapeProject')}
            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
              services.landscapeProject
                ? 'bg-orange-950/40 border-orange-500/60 text-white'
                : 'bg-obsidian-900/50 border-orange-950 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {services.landscapeProject ? (
                <CheckSquare className="w-4 h-4 text-orange-400 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-600 shrink-0" />
              )}
              <span className="text-xs font-semibold">Peyzaj Projesi (Ruhsat & Uygulama)</span>
            </div>
            <span className="text-xs font-mono font-bold text-orange-300">12.000 TL / Dönüm</span>
          </div>

          <div
            onClick={() => toggleService('visual3D')}
            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
              services.visual3D
                ? 'bg-orange-950/40 border-orange-500/60 text-white'
                : 'bg-obsidian-900/50 border-orange-950 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {services.visual3D ? (
                <CheckSquare className="w-4 h-4 text-orange-400 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-600 shrink-0" />
              )}
              <span className="text-xs font-semibold">3D Görsel Tasarım (4K Render)</span>
            </div>
            <span className="text-xs font-mono font-bold text-orange-300">12.000 TL / Dönüm</span>
          </div>

          <div
            onClick={() => toggleService('irrigationProject')}
            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
              services.irrigationProject
                ? 'bg-orange-950/40 border-orange-500/60 text-white'
                : 'bg-obsidian-900/50 border-orange-950 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {services.irrigationProject ? (
                <CheckSquare className="w-4 h-4 text-orange-400 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-600 shrink-0" />
              )}
              <span className="text-xs font-semibold">Sulama Projesi (Otomatik Plan)</span>
            </div>
            <span className="text-xs font-mono font-bold text-orange-300">8.000 TL / Dönüm</span>
          </div>
        </div>

        {/* Slider Input (Enhanced Size & Distinct Color Theme) */}
        <div className="space-y-4 bg-gradient-to-br from-obsidian-950 via-amber-950/25 to-obsidian-950 p-6 sm:p-7 rounded-3xl border-2 border-amber-500/60 shadow-glow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-sm sm:text-base font-bold text-amber-200 uppercase tracking-wider">
                Arsa Büyüklüğü:
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-obsidian-900/95 border-2 border-amber-500/60 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-500/30 px-3.5 py-1.5 rounded-2xl shadow-inner transition-all group">
                <input
                  type="number"
                  min="100"
                  max="50000"
                  step="10"
                  value={areaM2 || ''}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setAreaM2(val > 0 ? val : 0);
                  }}
                  className="w-28 sm:w-36 text-3xl sm:text-4xl font-black font-mono text-amber-200 bg-transparent outline-none text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none cursor-text"
                  title="Arsa alanını elle yazabilirsiniz"
                />
                <span className="text-sm font-bold text-amber-400 select-none">m²</span>
                <Edit3 className="w-3.5 h-3.5 text-amber-500/60 group-hover:text-amber-400 group-focus-within:text-amber-400 shrink-0" />
              </div>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/50 px-3 py-2 rounded-2xl text-xs sm:text-sm font-bold font-mono">
                {pricing.areaDonum} Dönüm
              </span>
            </div>
          </div>

          <div className="py-2">
            <input
              type="range"
              min="300"
              max="4000"
              step="50"
              value={areaM2}
              onChange={(e) => setAreaM2(Number(e.target.value))}
              className="w-full h-4 bg-obsidian-900 rounded-full appearance-none cursor-pointer accent-amber-400 border border-amber-500/60 shadow-inner"
            />
          </div>

          <div className="grid grid-cols-5 gap-1 text-center text-xs sm:text-sm font-mono font-bold text-slate-300">
            <button
              type="button"
              onClick={() => setAreaM2(500)}
              className={`py-1 rounded-xl transition-all cursor-pointer ${
                areaM2 === 500
                  ? 'bg-amber-500 text-obsidian-950 font-black shadow-glow-sm'
                  : 'hover:text-amber-300 hover:bg-amber-950/40'
              }`}
            >
              500 m²
            </button>
            <button
              type="button"
              onClick={() => setAreaM2(1000)}
              className={`py-1 rounded-xl transition-all cursor-pointer ${
                areaM2 === 1000
                  ? 'bg-amber-500 text-obsidian-950 font-black shadow-glow-sm'
                  : 'hover:text-amber-300 hover:bg-amber-950/40'
              }`}
            >
              1 Dönüm (%0)
            </button>
            <button
              type="button"
              onClick={() => setAreaM2(2000)}
              className={`py-1 rounded-xl transition-all cursor-pointer ${
                areaM2 === 2000
                  ? 'bg-amber-500 text-obsidian-950 font-black shadow-glow-sm'
                  : 'hover:text-amber-300 hover:bg-amber-950/40'
              }`}
            >
              2 Dönüm (%15)
            </button>
            <button
              type="button"
              onClick={() => setAreaM2(3000)}
              className={`py-1 rounded-xl transition-all cursor-pointer ${
                areaM2 === 3000
                  ? 'bg-amber-500 text-obsidian-950 font-black shadow-glow-sm'
                  : 'hover:text-amber-300 hover:bg-amber-950/40'
              }`}
            >
              3 Dönüm (%20)
            </button>
            <button
              type="button"
              onClick={() => setAreaM2(4000)}
              className={`py-1 rounded-xl transition-all cursor-pointer ${
                areaM2 === 4000
                  ? 'bg-amber-500 text-obsidian-950 font-black shadow-glow-sm'
                  : 'hover:text-amber-300 hover:bg-amber-950/40'
              }`}
            >
              4 Dönüm (%25)
            </button>
          </div>

          <div className="pt-3 border-t border-amber-900/50 text-center">
            <div className="p-3 sm:p-3.5 rounded-2xl bg-amber-950/50 border border-amber-500/40 text-center shadow-glow-sm">
              <p className="text-sm sm:text-base text-slate-100 font-medium">
                <span className="text-amber-400 font-extrabold">4 dönüm üzeri</span> projeleriniz için{' '}
                <a
                  href="tel:+905444772044"
                  className="text-amber-300 hover:text-white font-black font-mono text-base sm:text-lg underline underline-offset-4 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xl bg-amber-500/20 border border-amber-500/50 hover:bg-amber-500 hover:text-obsidian-950 transition-all shadow-sm"
                >
                  <Phone className="w-4 h-4 inline shrink-0" />
                  <span>0544 477 20 44</span>
                </a>{' '}
                <span className="text-slate-200">özel teklif almak için arayın.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-obsidian-950 p-5 rounded-2xl border border-orange-900/60 space-y-2.5">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Baz Bedel Toplamı:</span>
            <span className="font-mono line-through text-slate-500">{formatTL(pricing.basePrice)}</span>
          </div>

          {pricing.discountRate > 0 && (
            <div className="flex justify-between text-xs text-orange-400 font-bold">
              <span>Kademeli Dönüm İndirimi (%{pricing.discountRate}):</span>
              <span className="font-mono">- {formatTL(pricing.discountAmount)}</span>
            </div>
          )}

          <div className="pt-2 border-t border-orange-950 flex justify-between items-baseline">
            <span className="text-sm font-bold text-white">Toplam Proje Bedeli (KDV Dahil):</span>
            <span className="text-3xl font-black font-mono text-white tracking-tight">
              {formatTL(pricing.finalPrice)}
            </span>
          </div>
        </div>

        {/* Action */}
        <button
          onClick={() => {
            onSelectPricing(areaM2, services);
            onClose();
          }}
          className="w-full py-4 rounded-xl font-bold text-sm text-white bg-orange-600 hover:bg-orange-500 shadow-glow transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Bu Seçimlerle Sipariş Sihirbazını Başlat</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
