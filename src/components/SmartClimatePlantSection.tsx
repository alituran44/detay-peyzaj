import React, { useState, useEffect } from 'react';
import { Sun, CloudRain, Droplets, Sparkles, Compass, TreePine, ArrowRight } from 'lucide-react';
import { CITY_CLIMATE_DATABASE, fetchLiveWeatherData, type CityClimateData } from '../services/climateService';
import { PLANT_DATABASE } from '../data/plantDatabase';

interface SmartClimatePlantSectionProps {
  onOpenOrderWizard: () => void;
}

export const SmartClimatePlantSection: React.FC<SmartClimatePlantSectionProps> = ({ onOpenOrderWizard }) => {
  const [selectedCityName, setSelectedCityName] = useState<string>('Çanakkale');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [liveWeather, setLiveWeather] = useState<{ temp: number; humidity: number; wind: number } | null>(null);

  const climateData: CityClimateData = CITY_CLIMATE_DATABASE[selectedCityName] || CITY_CLIMATE_DATABASE['Çanakkale'];

  useEffect(() => {
    let isMounted = true;
    fetchLiveWeatherData(climateData.lat, climateData.lon).then((data) => {
      if (isMounted && data && data.current) {
        setLiveWeather({
          temp: Math.round(data.current.temperature_2m),
          humidity: Math.round(data.current.relative_humidity_2m),
          wind: Math.round(data.current.wind_speed_10m),
        });
      }
    });
    return () => {
      isMounted = false;
    };
  }, [selectedCityName, climateData.lat, climateData.lon]);

  const filteredPlants = PLANT_DATABASE.filter((plant) => {
    const matchesZone = plant.climateZones.includes(climateData.climateZone);
    const matchesCat = selectedCategory === 'all' || plant.category === selectedCategory;
    return matchesZone && matchesCat;
  });

  return (
    <section id="akilli-iklim-bitki" className="py-24 bg-obsidian-900 relative overflow-hidden border-t border-orange-950">
      {/* Background glow aura */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-orange-950/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-orange-950/80 text-orange-400 border border-orange-800/60 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open-Meteo & Botanik API Entegrasyonu</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight">
            Arsanızın İklim Analizi & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-200">
              Akıllı Su Tasarruflu Bitki Seçici
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Arsanızın bulunduğu şehri seçin; anlık meteoroloji verileriyle yıllık yağış miktarını, otomatik sulama su tasarrufu oranını ve bölgenize %100 uyumlu bitki listesini canlı görün.
          </p>
        </div>

        {/* City Selector Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto bg-obsidian-950 p-2.5 rounded-2xl border border-orange-950 shadow-xl">
          {Object.keys(CITY_CLIMATE_DATABASE).map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCityName(city)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCityName === city
                  ? 'bg-orange-600 text-white shadow-glow-sm scale-102'
                  : 'text-slate-400 hover:text-white hover:bg-obsidian-900'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Climate & Live Weather KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Card 1: Live Weather via Open-Meteo API */}
          <div className="bg-obsidian-950 p-6 rounded-3xl border border-orange-950/80 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider font-mono">Canlı Hava Durumu</span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Open-Meteo API
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black font-mono text-white">
                {liveWeather ? `${liveWeather.temp}°C` : '24°C'}
              </span>
              <span className="text-xs text-slate-400">{selectedCityName}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 border-t border-orange-950/80 pt-2">
              <span>Nem: {liveWeather ? `%${liveWeather.humidity}` : '%55'}</span>
              <span>Rüzgar: {liveWeather ? `${liveWeather.wind} km/s` : '14 km/s'}</span>
            </div>
          </div>

          {/* Card 2: Annual Rainfall */}
          <div className="bg-obsidian-950 p-6 rounded-3xl border border-orange-950/80 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider font-mono">Yıllık Yağış</span>
              <CloudRain className="w-5 h-5 text-sky-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black font-mono text-white">{climateData.annualRainfallMm}</span>
              <span className="text-sm font-bold text-sky-400">mm / yıl</span>
            </div>
            <p className="text-[11px] text-slate-400 border-t border-orange-950/80 pt-2">
              İklim Kuşağı: <strong className="text-white">{climateData.climateZone}</strong>
            </p>
          </div>

          {/* Card 3: Sunshine & Frost */}
          <div className="bg-obsidian-950 p-6 rounded-3xl border border-orange-950/80 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">Güneşlenme Süresi</span>
              <Sun className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black font-mono text-white">{climateData.sunshineHoursPerYear}</span>
              <span className="text-sm font-bold text-amber-400">saat / yıl</span>
            </div>
            <p className="text-[11px] text-slate-400 border-t border-orange-950/80 pt-2">
              Yıllık Don Riski: <strong className="text-white">{climateData.frostRiskDays} Gün</strong>
            </p>
          </div>

          {/* Card 4: Water Savings with Sulama Projesi */}
          <div className="bg-gradient-to-br from-obsidian-950 to-orange-950/40 p-6 rounded-3xl border border-orange-500/60 shadow-glow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider font-mono">Sulama Tasarrufu</span>
              <Droplets className="w-5 h-5 text-orange-400" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black font-mono text-orange-300">%{climateData.estimatedWaterSavingsPercent}</span>
              <span className="text-xs text-orange-400 font-bold">Su Tasarrufu</span>
            </div>
            <p className="text-[11px] text-slate-300 border-t border-orange-950/80 pt-2">
              Öneri: <strong className="text-orange-200">{climateData.recommendedIrrigationType}</strong>
            </p>
          </div>

        </div>

        {/* Dynamic Plant Catalog for Selected Climate Zone */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-950 pb-4">
            <div>
              <h3 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
                <TreePine className="w-6 h-6 text-orange-400" />
                <span>{climateData.climateZone} İklimine Uygun Bitki Rehberi</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Botanik API kriterlerine göre bu bölgede minimum bakımla maksimum gelişim gösteren türler listelenmektedir.
              </p>
            </div>

            {/* Plant Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {['all', 'Ağaç', 'Çalı', 'Aromatik', 'Yer Örtücü'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-orange-600 text-white'
                      : 'bg-obsidian-950 text-slate-400 border border-orange-950 hover:text-white'
                  }`}
                >
                  {cat === 'all' ? 'Tüm Bitkiler' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Plants Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlants.map((plant) => (
              <div
                key={plant.id}
                className="bg-obsidian-950 rounded-3xl border border-orange-950/80 hover:border-orange-500/50 transition-all duration-300 p-6 flex flex-col justify-between shadow-xl group"
              >
                <div className="space-y-3">
                  <div className="h-44 rounded-2xl overflow-hidden relative">
                    <img
                      src={plant.image}
                      alt={`${plant.name} (${plant.category}) - Detay Peyzaj Bitki Rehberi`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-transparent to-transparent" />
                    
                    <div className="absolute top-3 left-3 bg-obsidian-950/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-orange-300 border border-orange-600/50">
                      {plant.category}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300">
                      <span className="bg-obsidian-900/90 px-2 py-0.5 rounded-md">💧 Su: {plant.waterNeed}</span>
                      <span className="bg-obsidian-900/90 px-2 py-0.5 rounded-md">☀️ {plant.sunNeed}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white group-hover:text-orange-300 transition-colors">
                      {plant.name}
                    </h4>
                    <p className="text-xs font-mono text-orange-400/90 italic">{plant.botanicalName}</p>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {plant.description}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-orange-950 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Pafta Rolü: <strong className="text-white">{plant.purpose}</strong></span>
                </div>
              </div>
            ))}
          </div>

          {/* Action CTA */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-obsidian-950 via-orange-950/30 to-obsidian-950 border border-orange-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-950 border border-orange-600 flex items-center justify-center text-orange-400 shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{selectedCityName} Arsanız İçin Proje Başlatın</h4>
                <p className="text-xs text-slate-400">Mimarlarımız arsa toprağınıza en uygun bitkilendirme paftasını 5 günde hazırlasın.</p>
              </div>
            </div>

            <button
              onClick={onOpenOrderWizard}
              className="px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-glow flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span>{selectedCityName} İçin Teklif Al</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
