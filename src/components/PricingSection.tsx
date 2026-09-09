import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, CheckSquare, Square, FileCheck, Layers, Droplets } from 'lucide-react';
import { calculatePricing, formatTL, DEFAULT_SERVICES } from '../utils/pricing';
import type { SelectedServices } from '../types';

interface PricingSectionProps {
  onStartOrderWithConfig: (areaM2: number, services: SelectedServices) => void;
  onOpenOrderWizard?: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onStartOrderWithConfig }) => {
  const [sliderArea, setSliderArea] = useState<number>(1500);
  const [services, setServices] = useState<SelectedServices>(DEFAULT_SERVICES);

  const pricing = calculatePricing(sliderArea, services);

  const toggleService = (key: keyof SelectedServices) => {
    const nextServices = { ...services, [key]: !services[key] };
    if (!nextServices.landscapeProject && !nextServices.visual3D && !nextServices.irrigationProject) {
      return;
    }
    setServices(nextServices);
  };

  return (
    <section id="online-teklif" className="py-24 bg-obsidian-900 relative overflow-hidden border-t border-orange-950">
      {/* Background radial glow */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-orange-950/20 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 bg-orange-950/80 text-orange-400 border border-orange-800/60 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Şeffaf & Modüler Fiyatlandırma
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight">
            İhtiyacınız Olan Hizmeti Seçin, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-200">
              Dönüm Arttıkça %25'e Varan İndirim Kazanın
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Türkiye genelinde sabit dönüm birim fiyatları; gizli maliyet yok, keşif gecikmesi yok. 5 iş gününde eksiksiz teslim garantisi.
          </p>
        </div>

        {/* 3 Modular Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          
          {/* 1. Peyzaj Projesi Card */}
          <div
            onClick={() => toggleService('landscapeProject')}
            className={`rounded-3xl p-7 transition-all duration-300 border cursor-pointer flex flex-col justify-between relative group ${
              services.landscapeProject
                ? 'bg-gradient-to-b from-obsidian-950 to-orange-950/30 border-orange-500/80 shadow-glow-sm'
                : 'bg-obsidian-950/60 border-orange-950/80 opacity-75 hover:opacity-100'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-orange-950 border border-orange-800/80 flex items-center justify-center text-orange-400">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-orange-300 bg-orange-950 px-2.5 py-1 rounded-full border border-orange-800/60">
                    12.000 TL / Dönüm
                  </span>
                  {services.landscapeProject ? (
                    <CheckSquare className="w-5 h-5 text-orange-400" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-600" />
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-orange-300 transition-colors">
                  Peyzaj Projesi
                </h3>
                <p className="text-xs font-mono text-orange-400 mt-0.5">Ruhsat & 2D Uygulama Paftaları</p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Belediye onayına uygun yapısal ve bitkisel 2D mimari paftalar, kotlar, imalat detayları ve malzeme metraj listesi.
              </p>

              <ul className="space-y-2 pt-2 border-t border-orange-950 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>Yapısal & Bitkisel Peyzaj Projesi</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>Yapısal & Bitkisel Detay Paftaları</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>Excel Metraj & Keşif Tablosu</span>
                </li>
              </ul>
            </div>

            <div className="pt-5 mt-4 border-t border-orange-950/80 text-[11px] text-orange-400 font-semibold flex items-center justify-between">
              <span>{services.landscapeProject ? '✓ Pakete Dahil Edildi' : '+ Pakete Ekle'}</span>
              <span>5 Gün Teslim</span>
            </div>
          </div>

          {/* 2. 3D Görsel Tasarım Card */}
          <div
            onClick={() => toggleService('visual3D')}
            className={`rounded-3xl p-7 transition-all duration-300 border cursor-pointer flex flex-col justify-between relative group ${
              services.visual3D
                ? 'bg-gradient-to-b from-obsidian-950 to-orange-950/30 border-orange-500/80 shadow-glow-sm'
                : 'bg-obsidian-950/60 border-orange-950/80 opacity-75 hover:opacity-100'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-orange-950 border border-orange-800/80 flex items-center justify-center text-orange-400">
                  <Layers className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-orange-300 bg-orange-950 px-2.5 py-1 rounded-full border border-orange-800/60">
                    12.000 TL / Dönüm
                  </span>
                  {services.visual3D ? (
                    <CheckSquare className="w-5 h-5 text-orange-400" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-600" />
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-orange-300 transition-colors">
                  3D Görsel Tasarım
                </h3>
                <p className="text-xs font-mono text-orange-400 mt-0.5">Fotogerçekçi 4K Render & Modelleme</p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Bahçenizin tamamlanmış halini gündüz ve gece ışıklandırmasıyla tüm açılardan gösteren ultra gerçekçi 4K 3D görselleştirmeler.
              </p>

              <ul className="space-y-2 pt-2 border-t border-orange-950 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>4K Fotogerçekçi Render Seti</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>Gündüz & Gece Aydınlatma Görselleri</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>1 Tur Ücretsiz Revizyon Hakkı</span>
                </li>
              </ul>
            </div>

            <div className="pt-5 mt-4 border-t border-orange-950/80 text-[11px] text-orange-400 font-semibold flex items-center justify-between">
              <span>{services.visual3D ? '✓ Pakete Dahil Edildi' : '+ Pakete Ekle'}</span>
              <span>5 Gün Teslim</span>
            </div>
          </div>

          {/* 3. Sulama Projesi Card */}
          <div
            onClick={() => toggleService('irrigationProject')}
            className={`rounded-3xl p-7 transition-all duration-300 border cursor-pointer flex flex-col justify-between relative group ${
              services.irrigationProject
                ? 'bg-gradient-to-b from-obsidian-950 to-orange-950/30 border-orange-500/80 shadow-glow-sm'
                : 'bg-obsidian-950/60 border-orange-950/80 opacity-75 hover:opacity-100'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-orange-950 border border-orange-800/80 flex items-center justify-center text-orange-400">
                  <Droplets className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-orange-300 bg-orange-950 px-2.5 py-1 rounded-full border border-orange-800/60">
                    8.000 TL / Dönüm
                  </span>
                  {services.irrigationProject ? (
                    <CheckSquare className="w-5 h-5 text-orange-400" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-600" />
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-orange-300 transition-colors">
                  Sulama Projesi
                </h3>
                <p className="text-xs font-mono text-orange-400 mt-0.5">Otomatik Sulama & Hidrolik Planı</p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                %50 su tasarrufu sağlayan akıllı rotor, damlama borulama hatları, hidrolik basınç ve solenoid vana yerleşim planı.
              </p>

              <ul className="space-y-2 pt-2 border-t border-orange-950 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>Hidrolik Debi & Boru Çapı Hesabı</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>Rotor & Damlama Zonlama Paftası</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>Pompa & Vana Malzeme Listesi</span>
                </li>
              </ul>
            </div>

            <div className="pt-5 mt-4 border-t border-orange-950/80 text-[11px] text-orange-400 font-semibold flex items-center justify-between">
              <span>{services.irrigationProject ? '✓ Pakete Dahil Edildi' : '+ Pakete Ekle'}</span>
              <span>5 Gün Teslim</span>
            </div>
          </div>

        </div>

        {/* Dynamic Calculator Box */}
        <div className="bg-obsidian-950 p-8 sm:p-10 rounded-3xl border border-orange-500/40 shadow-2xl space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-orange-950 pb-6">
            <div>
              <h3 className="text-2xl font-serif font-bold text-white">
                İnteraktif Dönüm & İndirim Simülatörü
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Arsa alanınızı sürükleyin; seçili hizmetlerin dönüm indirimli anlık fiyatını görün.
              </p>
            </div>

            <div className="flex items-baseline gap-2 bg-obsidian-900 border border-orange-950 px-5 py-2.5 rounded-2xl">
              <span className="text-3xl font-mono font-black text-white">{sliderArea.toLocaleString('tr-TR')}</span>
              <span className="text-sm font-bold text-orange-400">m²</span>
              <span className="text-xs text-slate-400 font-mono">({pricing.areaDonum} Dönüm)</span>
            </div>
          </div>

          {/* Range Slider */}
          <div className="space-y-4">
            <input
              type="range"
              min="300"
              max="4000"
              step="50"
              value={sliderArea}
              onChange={(e) => setSliderArea(Number(e.target.value))}
              className="w-full h-3.5 bg-obsidian-900 rounded-lg appearance-none cursor-pointer accent-orange-500 border border-orange-950"
            />

            <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
              <div 
                onClick={() => setSliderArea(1000)}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                  sliderArea <= 1000 ? 'bg-orange-950/40 border-orange-500/60 text-white' : 'bg-obsidian-900 border-orange-950 text-slate-400'
                }`}
              >
                <div className="font-bold">1 Dönüme Kadar</div>
                <div className="text-[11px] text-orange-400 font-semibold mt-0.5">Baz Fiyat (%0 İndirim)</div>
              </div>

              <div 
                onClick={() => setSliderArea(1800)}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                  sliderArea > 1000 && sliderArea <= 2000 ? 'bg-orange-950/40 border-orange-500/60 text-white' : 'bg-obsidian-900 border-orange-950 text-slate-400'
                }`}
              >
                <div className="font-bold">1 - 2 Dönüm</div>
                <div className="text-[11px] text-orange-400 font-semibold mt-0.5">%15 İndirim</div>
              </div>

              <div 
                onClick={() => setSliderArea(2800)}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                  sliderArea > 2000 && sliderArea <= 3000 ? 'bg-orange-950/40 border-orange-500/60 text-white' : 'bg-obsidian-900 border-orange-950 text-slate-400'
                }`}
              >
                <div className="font-bold">2 - 3 Dönüm</div>
                <div className="text-[11px] text-orange-400 font-semibold mt-0.5">%20 İndirim</div>
              </div>

              <div 
                onClick={() => setSliderArea(3800)}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                  sliderArea > 3000 ? 'bg-orange-950/40 border-orange-500/60 text-white' : 'bg-obsidian-900 border-orange-950 text-slate-400'
                }`}
              >
                <div className="font-bold">3 - 4 Dönüm</div>
                <div className="text-[11px] text-orange-400 font-semibold mt-0.5">%25 İndirim</div>
              </div>
            </div>
          </div>

          {/* Pricing Summary Row */}
          <div className="bg-obsidian-900 p-6 rounded-2xl border border-orange-950 flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="space-y-1 text-center md:text-left">
              <div className="text-xs text-slate-400">
                Seçili Hizmetler Baz Bedeli: <span className="font-mono line-through">{formatTL(pricing.basePrice)}</span>
              </div>
              {pricing.discountRate > 0 && (
                <div className="text-xs text-orange-400 font-bold">
                  {pricing.areaDonum} Dönüm İndirimi (%{pricing.discountRate}): - {formatTL(pricing.discountAmount)}
                </div>
              )}
              <div className="text-xs text-slate-400 font-mono">
                m² Başına Maliyet: ~{pricing.pricePerM2} TL / m²
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="text-center sm:text-right">
                <div className="text-xs text-slate-400 font-medium">Toplam Proje Bedeli (KDV Dahil):</div>
                <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
                  {formatTL(pricing.finalPrice)}
                </div>
              </div>

              <button
                onClick={() => onStartOrderWithConfig(sliderArea, services)}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm shadow-glow transition-all flex items-center gap-3 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-orange-200" />
                <span>Bu Teklifi Onayla & Sipariş Ver</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
