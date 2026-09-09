import React from 'react';
import { Sparkles, Award, Compass, ShieldCheck, TreePine, MapPin } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="hakkimizda" className="py-24 bg-obsidian-900 relative overflow-hidden border-t border-orange-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Visual Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-orange-500/40 shadow-2xl">
              <img
                src="/images/anasayfa/kolaj.png"
                alt="Detay Peyzaj & Mimarlık Çanakkale Peyzaj Mimarlığı Ofisi ve Proje Ekibi"
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-transparent to-transparent" />
            </div>

            {/* Floating Experience Badge */}
            <div className="absolute -bottom-6 -right-4 sm:right-6 bg-obsidian-950 p-5 rounded-2xl border border-orange-500/60 shadow-2xl">
              <div className="text-3xl font-black font-mono text-orange-400">35+ Yıl</div>
              <div className="text-xs text-slate-300 font-semibold">Mimari Deneyim & Uzmanlık</div>
            </div>
          </div>

          {/* Right Editorial Story */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 bg-orange-950/80 text-orange-400 border border-orange-800/60 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Detay Peyzaj & Mimarlık Hakkında
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
              Doğaya Saygılı, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-200">
                Mühendislik ve Estetiği Buluşturan Tasarımlar
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Çanakkale merkezli ofisimizde Peyzaj Mimarı <strong>Hasan Hüseyin Yıldırım</strong> liderliğinde; bireysel villa bahçelerinden büyük ölçekli toplu konut, turizm tesisi ve sanayi alanlarına kadar Türkiye genelinde yüzlerce peyzaj projesini hayata geçirdik.
            </p>

            <p className="text-sm text-slate-400 leading-relaxed">
              TMMOB Peyzaj Mimarları Odası standartlarında hazırladığımız projelerimiz; belediye imar ruhsat onaylarından şantiye imalat paftalarına, 4K 3D görselleştirmeden su tasarruflu otomatik sulama hesaplarına kadar eksiksiz bir mühendislik disipliniyle üretilir.
            </p>

            {/* 4 Core Value Cards */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-obsidian-950 p-4 rounded-2xl border border-orange-950 space-y-1.5">
                <Compass className="w-5 h-5 text-orange-400" />
                <h4 className="text-xs font-bold text-white">Ruhsat Onay Garantisi</h4>
                <p className="text-[11px] text-slate-400">İmar ve belediye mevzuatına %100 uyumlu paftalar.</p>
              </div>

              <div className="bg-obsidian-950 p-4 rounded-2xl border border-orange-950 space-y-1.5">
                <TreePine className="w-5 h-5 text-orange-400" />
                <h4 className="text-xs font-bold text-white">İklime Uygun Bitkiler</h4>
                <p className="text-[11px] text-slate-400">Toprak ve don koşullarına dayanıklı yerel fidan seçimi.</p>
              </div>

              <div className="bg-obsidian-950 p-4 rounded-2xl border border-orange-950 space-y-1.5">
                <Award className="w-5 h-5 text-orange-400" />
                <h4 className="text-xs font-bold text-white">5 Günde Teslim</h4>
                <p className="text-[11px] text-slate-400">Zaman kaybettirmeyen hızlı ve dijital proje akışı.</p>
              </div>

              <div className="bg-obsidian-950 p-4 rounded-2xl border border-orange-950 space-y-1.5">
                <ShieldCheck className="w-5 h-5 text-orange-400" />
                <h4 className="text-xs font-bold text-white">1 Tur Ücretsiz Revizyon</h4>
                <p className="text-[11px] text-slate-400">Tasarımın içinize sinmesi için ücretsiz revize hakkı.</p>
              </div>
            </div>

            {/* Location Meta */}
            <div className="pt-4 border-t border-orange-950 flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-white font-medium">
                <MapPin className="w-4 h-4 text-orange-400" /> İsmetpaşa Mah. Taşöz Apt. No:52/1 Çanakkale
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
