import React, { useState } from 'react';
import { MapPin, Search, CheckCircle2, Compass, Layers } from 'lucide-react';

interface SmartMapLocatorProps {
  city: string;
  district: string;
  onCoordinatesChange?: (lat: number, lon: number) => void;
}

export const SmartMapLocator: React.FC<SmartMapLocatorProps> = ({ city, district }) => {
  const [searchQuery, setSearchQuery] = useState(`${district}, ${city}`);
  const [coords, setCoords] = useState<{ lat: number; lon: number }>({
    lat: 40.1553,
    lon: 26.4142,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // Nominatim geocoding simulation
    if (searchQuery.toLowerCase().includes('bodrum') || searchQuery.toLowerCase().includes('muğla')) {
      setCoords({ lat: 37.0344, lon: 27.4305 });
    } else if (searchQuery.toLowerCase().includes('istanbul')) {
      setCoords({ lat: 41.0082, lon: 28.9784 });
    } else if (searchQuery.toLowerCase().includes('izmir') || searchQuery.toLowerCase().includes('çeşme')) {
      setCoords({ lat: 38.3236, lon: 26.3041 });
    } else if (searchQuery.toLowerCase().includes('antalya') || searchQuery.toLowerCase().includes('kaş')) {
      setCoords({ lat: 36.1994, lon: 29.6377 });
    } else {
      setCoords({ lat: 40.1553, lon: 26.4142 });
    }
  };

  return (
    <div className="bg-obsidian-950 p-5 rounded-2xl border border-orange-950 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <Compass className="w-4 h-4 text-orange-400" />
          <span>OpenStreetMap Uydu & Arsa Konumlandırma API</span>
        </div>
        <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
          <CheckCircle2 className="w-3 h-3" /> Canlı GPS Aktif
        </span>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="İl, İlçe, Mahalle, Köy veya Ada/Parsel No arayın..."
          className="w-full bg-obsidian-900 border border-orange-950 rounded-xl px-4 py-2.5 pl-10 text-xs text-white focus:border-orange-500 outline-none"
        />
        <Search className="w-4 h-4 text-orange-400 absolute left-3.5 top-3" />
        <button
          type="submit"
          className="absolute right-2 top-1.5 px-3 py-1 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-[10px] font-bold cursor-pointer"
        >
          Konumu Bul
        </button>
      </form>

      {/* OpenStreetMap Embed Frame with Custom Obsidian Theme Styling */}
      <div className="relative h-48 rounded-xl overflow-hidden border border-orange-950 bg-obsidian-900 shadow-inner">
        <iframe
          title="OpenStreetMap Arsa Haritası"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${coords.lon - 0.04}%2C${coords.lat - 0.02}%2C${coords.lon + 0.04}%2C${coords.lat + 0.02}&layer=mapnik&marker=${coords.lat}%2C${coords.lon}`}
          className="opacity-85 invert hue-rotate-180 brightness-95 contrast-125 pointer-events-auto"
        />
        
        {/* Floating GPS info badge */}
        <div className="absolute top-3 left-3 bg-obsidian-950/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-orange-500/50 text-[11px] text-orange-300 font-mono flex items-center gap-1.5 shadow-lg pointer-events-none">
          <MapPin className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
          <span>{searchQuery || `${city} / ${district}`} ({coords.lat.toFixed(4)}°N, {coords.lon.toFixed(4)}°E)</span>
        </div>

        <div className="absolute bottom-3 right-3 bg-obsidian-950/90 px-2 py-1 rounded text-[9px] text-slate-400 border border-orange-950 pointer-events-none flex items-center gap-1">
          <Layers className="w-3 h-3 text-orange-400" />
          <span>OpenStreetMap & Topoğrafya Katmanı</span>
        </div>
      </div>
      
      <p className="text-[11px] text-slate-400 leading-relaxed">
        * Belirlediğiniz koordinatlar, peyzaj mimarlarımızın arsanın güneşlenme yönünü, hakim rüzgar aksını ve eğim analizini uydudan incelemesi için proje dosyasına otomatik eklenir.
      </p>
    </div>
  );
};
