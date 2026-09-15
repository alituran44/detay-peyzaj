import React from 'react';
import { MapPin, Phone, Mail, Clock, ShieldCheck, FileText, Lock, Truck, Cookie, RefreshCw } from 'lucide-react';
import { VisaLogo, MastercardLogo, PaynkolayLogo, SSLBadge } from './icons/PaymentLogos';
import type { LegalModalType } from './LegalModals';

interface FooterProps {
  onOpenLegalModal?: (type: LegalModalType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegalModal }) => {
  return (
    <footer className="bg-obsidian-950 border-t border-orange-950/80 pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-white px-4 py-2 rounded-2xl shadow-glow border border-orange-500/30 inline-flex items-center justify-center">
                <img
                  src="/logo-detay.png"
                  alt="Detay Peyzaj - Tasarım Ruhu Mimarlık Logosu"
                  loading="lazy"
                  decoding="async"
                  className="h-12 sm:h-14 w-auto max-w-[240px] sm:max-w-[280px] object-contain"
                />
              </div>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              35+ yıllık tecrübemiz ve TMMOB standartlarındaki mimari uzmanlığımızla, Türkiye geneli tüm arsa, villa ve bahçelerinize 5 iş gününde resmi onaylı peyzaj projeleri üretiyoruz.
            </p>

            <div className="pt-2">
              <span className="text-[11px] text-slate-500 font-mono">Sorumlu Mimar:</span>
              <p className="text-xs font-bold text-white font-serif">Hasan Hüseyin Yıldırım (Peyzaj Mimarı)</p>
            </div>
          </div>

          {/* Quick Menu */}
          <div className="space-y-3 text-xs">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Hızlı Menü</h4>
            <ul className="space-y-2">
              <li><a href="#hakkimizda" className="hover:text-orange-400 transition-colors">Hakkımızda</a></li>
              <li><a href="#hizmetler" className="hover:text-orange-400 transition-colors">Hizmetlerimiz</a></li>
              <li><a href="#sss" className="hover:text-orange-400 transition-colors">Sıkça Sorulan Sorular</a></li>
              <li>
                <a 
                  href="https://www.instagram.com/detay_proje_mimarlik/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1.5"
                >
                  <span>Instagram'da İncele</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Modals Links (Yasal Sözleşmeler) */}
          <div className="space-y-3 text-xs">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Yasal Sözleşmeler</h4>
            <ul className="space-y-2.5 text-slate-300">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegalModal && onOpenLegalModal('teslimat_iade')}
                  className="hover:text-orange-400 transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <Truck className="w-3.5 h-3.5 text-orange-400 group-hover:translate-x-0.5 transition-transform" />
                  <span>Teslimat ve İade Şartları</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegalModal && onOpenLegalModal('gizlilik_kvkk')}
                  className="hover:text-orange-400 transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <Lock className="w-3.5 h-3.5 text-orange-400 group-hover:translate-x-0.5 transition-transform" />
                  <span>Gizlilik Sözleşmesi & KVKK</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegalModal && onOpenLegalModal('mesafeli_satis')}
                  className="hover:text-orange-400 transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <FileText className="w-3.5 h-3.5 text-orange-400 group-hover:translate-x-0.5 transition-transform" />
                  <span>Mesafeli Satış Sözleşmesi</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegalModal && onOpenLegalModal('cerez_politikasi')}
                  className="hover:text-orange-400 transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <Cookie className="w-3.5 h-3.5 text-orange-400 group-hover:translate-x-0.5 transition-transform" />
                  <span>Çerez (Cookie) Politikası</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegalModal && onOpenLegalModal('aydinlatma_metni')}
                  className="hover:text-orange-400 transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <FileText className="w-3.5 h-3.5 text-orange-400 group-hover:translate-x-0.5 transition-transform" />
                  <span>KVKK Aydınlatma Metni</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegalModal && onOpenLegalModal('iptal_iade')}
                  className="hover:text-orange-400 transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-orange-400 group-hover:translate-x-0.5 transition-transform" />
                  <span>İptal, Cayma & Revizyon</span>
                </button>
              </li>
              <li className="pt-1">
                <button
                  type="button"
                  onClick={() => onOpenLegalModal && onOpenLegalModal('ssl_guvenlik')}
                  className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 text-[11px] font-semibold cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" /> 256-Bit SSL Sertifikalı Altyapı
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 text-xs">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">İletişim & Ofis</h4>
            <div className="space-y-2.5 text-slate-300">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>İsmetpaşa Mah. Taşöz Apt. No:52/1 Çanakkale</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                <a href="tel:+905444772044" className="hover:text-white font-bold">+90 544 477 20 44</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                <a href="mailto:peyzajdetay@gmail.com" className="hover:text-white">peyzajdetay@gmail.com</a>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Hafta İçi & Cmt: 08:00 - 19:00</span>
              </p>
            </div>
          </div>

        </div>

        {/* Trust & Quality Badges Grid */}
        <div className="border-t border-orange-950/80 pt-8 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-obsidian-900/60 border border-orange-500/20 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">TMMOB Oda Standartları</div>
                <div className="text-[11px] text-slate-400">Resmi belediye & ruhsat onaylı peyzaj mimarlığı projeleri</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-obsidian-900/60 border border-emerald-500/20 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">48 Saatte Revizyon Garantisi</div>
                <div className="text-[11px] text-slate-400">Tasarım sürecinde hızlı ve koşulsuz mimari revizyon desteği</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-obsidian-900/60 border border-amber-500/20 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">256-Bit SSL & 3D Secure 2.0</div>
                <div className="text-[11px] text-slate-400">Paynkolay & Aktif Bank lisanslı PCI-DSS uyumlu güvenli ödeme</div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Security Logos Row */}
        <div className="border-t border-orange-950 pt-8 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-xs text-slate-400 font-semibold">Güvenli Ödeme Altyapısı:</span>
            <div className="flex items-center gap-2.5">
              <VisaLogo className="h-6" />
              <MastercardLogo className="h-6" />
              <PaynkolayLogo className="h-6" />
              <SSLBadge className="h-6" />
            </div>
          </div>

          <div className="text-xs text-slate-500 font-mono text-center sm:text-right">
            © 2026 Detay Peyzaj & Mimarlık. Tüm hakları saklıdır.
          </div>
        </div>

      </div>
    </footer>
  );
};
