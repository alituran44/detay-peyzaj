import React, { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';

interface GoogleAdSenseBannerProps {
  adSlot?: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  adLayout?: string;
  adLayoutKey?: string;
  className?: string;
  label?: string;
  fallbackTitle?: string;
}

export const GoogleAdSenseBanner: React.FC<GoogleAdSenseBannerProps> = ({
  adSlot = '7374650291',
  adFormat = 'auto',
  adLayout,
  adLayoutKey,
  className = '',
  label = 'SPONSORLU BAĞLANTI / REKLAM ALANI',
  fallbackTitle = 'Detay Peyzaj & Mimarlık Reklam ve Sponsor Alanı',
}) => {
  const adRef = useRef<HTMLModElement | null>(null);
  const isLoaded = useRef<boolean>(false);

  useEffect(() => {
    if (isLoaded.current) return;
    try {
      if (typeof window !== 'undefined') {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isLoaded.current = true;
      }
    } catch (err) {
      console.log('AdSense script initialization info:', err);
    }
  }, []);

  return (
    <div className={`w-full mx-auto my-8 overflow-hidden rounded-2xl border border-orange-900/30 bg-obsidian-900/80 p-3 sm:p-4 text-center shadow-lg transition-all ${className}`}>
      {/* Discreet Ad Tag */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-orange-950/80 text-[10px] uppercase font-mono tracking-widest text-slate-500">
        <span className="flex items-center gap-1 text-orange-400/80">
          <Sparkles className="w-3 h-3" />
          <span>{label}</span>
        </span>
        <span className="text-slate-600">Google Ads</span>
      </div>

      {/* Ad Container Box */}
      <div className="min-h-[90px] sm:min-h-[100px] flex items-center justify-center relative overflow-hidden rounded-xl bg-obsidian-950/90">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', minWidth: '280px', width: '100%' }}
          data-ad-client="ca-pub-7374650291382589"
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-ad-layout={adLayout}
          data-ad-layout-key={adLayoutKey}
          data-full-width-responsive="true"
        />

        {/* Subtle Luxury Fallback when AdSense is pending review / initializing */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 pointer-events-none -z-0 opacity-40 hover:opacity-70 transition-opacity">
          <span className="text-xs font-serif font-bold text-slate-400 tracking-wide">
            {fallbackTitle}
          </span>
          <span className="text-[10px] text-orange-400 font-mono mt-0.5">
            AdSense ID: ca-pub-7374650291382589
          </span>
        </div>
      </div>
    </div>
  );
};
