import React, { useRef } from 'react';
import { Printer, MessageCircle, ArrowLeft } from 'lucide-react';
import type { LandscapeQuotation } from './LandscapeQuotationBuilder';
import { formatTL } from '../../utils/pricing';

interface PublicQuotationViewProps {
  quotation: LandscapeQuotation;
  onBackToHome: () => void;
}

export const PublicQuotationView: React.FC<PublicQuotationViewProps> = ({
  quotation,
  onBackToHome,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  // Financial Calculations
  const araToplam = quotation.items.reduce((acc, item) => acc + (Number(item.tutar) || 0), 0);
  const indirimTutari = (araToplam * (Number(quotation.indirimOrani) || 0)) / 100;
  const netAraToplam = araToplam - indirimTutari;
  const kdvTutari = (netAraToplam * (Number(quotation.kdvOrani) || 20)) / 100;
  const genelToplam = netAraToplam + kdvTutari;

  const pesinTutar = (genelToplam * (Number(quotation.pesinYuzde) || 40)) / 100;
  const isEsnasindaTutar = (genelToplam * (Number(quotation.isEsnasindaYuzde) || 30)) / 100;
  const isTeslimindeTutar = (genelToplam * (Number(quotation.isTeslimindeYuzde) || 30)) / 100;

  const handlePrint = () => {
    const printElement = printRef.current;
    if (!printElement) {
      window.print();
      return;
    }

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      window.print();
      return;
    }

    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map((el) => el.outerHTML)
      .join('\n');

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <title>${quotation.teklifNo} - ${quotation.musteriFirma || 'Peyzaj Teklifi'}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
        <script src="https://cdn.tailwindcss.com"></script>
        ${styles}
        <style>
          @page {
            size: A4 portrait;
            margin: 4mm 6mm;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-sizing: border-box;
          }
          html, body {
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
            page-break-inside: avoid !important;
          }
          .printable-quotation {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
            page-break-inside: avoid !important;
          }
          table {
            border-collapse: collapse !important;
            width: 100% !important;
          }
          th {
            background-color: #064e3b !important;
            color: #ffffff !important;
          }
          td, th {
            border-color: #cbd5e1 !important;
          }
        </style>
      </head>
      <body class="bg-white text-black p-0 m-0">
        <div class="printable-quotation">
          ${printElement.innerHTML}
        </div>
      </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (err) {
        console.warn('Iframe print error fallback:', err);
        window.print();
      } finally {
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 1500);
      }
    }, 350);
  };

  const handleWhatsAppContact = () => {
    const text = encodeURIComponent(
      `Merhaba Hasan Bey, ${quotation.teklifNo} numaralı (${quotation.projeAdi}) peyzaj uygulama teklifinizi inceledim. Detayları görüşmek istiyorum.`
    );
    window.open(`https://wa.me/905444772044?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-6 px-3 sm:px-6 selection:bg-orange-500 selection:text-white">
      
      {/* 🚀 Top Client Control Bar (Hidden when printing) */}
      <div className="no-print max-w-4xl mx-auto mb-6 bg-slate-800/90 border border-slate-700/80 p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md">
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToHome}
            className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white transition-colors cursor-pointer"
            title="Ana Sayfaya Dön"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Resmi Peyzaj Teklifi</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-mono">
                {quotation.teklifNo}
              </span>
            </div>
            <p className="text-xs text-slate-400">Detay Peyzaj & Mimarlık tarafından sizin için özel hazırlanmıştır.</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>PDF İndir / Yazdır</span>
          </button>

          <button
            type="button"
            onClick={handleWhatsAppContact}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Mimara WhatsApp'tan Ulaş</span>
          </button>
        </div>

      </div>

      {/* 📄 A4 PRINTABLE DOCUMENT CONTAINER */}
      <div
        ref={printRef}
        className="printable-quotation bg-white text-black p-4 sm:p-5 rounded-2xl shadow-2xl max-w-4xl mx-auto font-sans border border-slate-300 print:border-none print:shadow-none print:p-0 print:m-0"
      >
        
        {/* Form Title & Top Banner */}
        <div className="border-b-2 border-emerald-800 pb-1.5 mb-1.5 flex items-center justify-between">
          <div>
            <h1 className="text-sm sm:text-base font-black tracking-wide text-emerald-950 uppercase font-serif">
              DETAY PEYZAJ | PEYZAJ UYGULAMA TEKLİF FORMU
            </h1>
            <p className="text-[8.5px] text-slate-600 font-mono">www.detaypeyzaj.com.tr • Profesyonel Peyzaj Proje ve Uygulama Hizmetleri</p>
          </div>
          <div className="h-7 flex items-center">
            <img src="/logo-detay.png" alt="Detay Peyzaj" className="h-7 w-auto object-contain" />
          </div>
        </div>

        {/* Header 2-Column Info Grid */}
        <div className="grid grid-cols-2 gap-1.5 text-[8.5px] leading-tight mb-1.5">
          
          {/* Firma Bilgileri */}
          <div className="border border-slate-300 rounded p-1.5 bg-slate-50 space-y-0.5">
            <div className="font-bold text-emerald-900 border-b border-slate-200 pb-0.5 uppercase tracking-wider text-[8px]">
              FİRMA BİLGİLERİ
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="font-semibold text-slate-700">Firma Ünvanı:</span>
              <span className="col-span-2 font-bold text-slate-900">{quotation.companyName}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="font-semibold text-slate-700">Adres:</span>
              <span className="col-span-2 text-slate-800">{quotation.companyAddress}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="font-semibold text-slate-700">Tel / E-posta:</span>
              <span className="col-span-2 text-slate-800">{quotation.companyPhone} • {quotation.companyEmail}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <span className="font-semibold text-slate-700">Vergi Dairesi:</span>
              <span className="col-span-2 text-slate-800">{quotation.companyTax}</span>
            </div>
          </div>

          {/* Teklif Bilgileri */}
          <div className="border border-slate-300 rounded p-1.5 bg-slate-50 space-y-0.5">
            <div className="font-bold text-emerald-900 border-b border-slate-200 pb-0.5 uppercase tracking-wider text-[8px]">
              TEKLİF BİLGİLERİ
            </div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
              <div className="grid grid-cols-2 gap-1">
                <span className="font-semibold text-slate-700">Teklif No:</span>
                <span className="font-mono font-bold text-slate-900">{quotation.teklifNo}</span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <span className="font-semibold text-slate-700">Tarih:</span>
                <span className="font-mono text-slate-900">{quotation.tarih}</span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <span className="font-semibold text-slate-700">Geçerlilik:</span>
                <span className="text-slate-900">{quotation.gecerlilik}</span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <span className="font-semibold text-slate-700">Para Birimi:</span>
                <span className="font-bold text-slate-900">{quotation.paraBirimi}</span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <span className="font-semibold text-slate-700">Hazırlayan:</span>
                <span className="font-bold text-slate-900">{quotation.hazirlayan}</span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <span className="font-semibold text-slate-700">Revizyon:</span>
                <span className="font-mono text-slate-900">{quotation.revizyon}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Müşteri ve Proje Bilgileri Strip */}
        <div className="border border-slate-300 rounded p-1.5 bg-emerald-50/40 text-[8.5px] leading-tight mb-1.5">
          <div className="font-bold text-emerald-900 border-b border-emerald-200/60 pb-0.5 uppercase tracking-wider text-[8px] mb-1">
            MÜŞTERİ VE PROJE BİLGİLERİ
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
            <div className="flex justify-between">
              <span className="font-semibold text-slate-700">Müşteri / Firma:</span>
              <span className="font-black text-slate-900">{quotation.musteriFirma || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-700">Yetkili Kişi:</span>
              <span className="font-bold text-slate-900">{quotation.yetkiliKisi || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-700">Proje Adı:</span>
              <span className="font-bold text-slate-900">{quotation.projeAdi}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-700">Telefon / E-posta:</span>
              <span className="text-slate-900">{quotation.telefon || '-'} / {quotation.email || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-700">Uygulama Adresi:</span>
              <span className="text-slate-900">{quotation.uygulamaAdresi || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-700">İşin Süresi:</span>
              <span className="font-bold text-slate-900">{quotation.isinSuresi}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-700">Teklif Konusu:</span>
              <span className="text-slate-900">{quotation.teklifKonusu}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-700">Keşif Tarihi:</span>
              <span className="text-slate-900">{quotation.kesifTarihi}</span>
            </div>
          </div>
        </div>

        {/* Official Table */}
        <table className="w-full text-left text-[8px] leading-tight border border-slate-300 mb-1.5 border-collapse">
          <thead>
            <tr className="bg-emerald-900 text-white font-bold text-center border-b border-slate-300">
              <th className="py-0.5 px-1 border-r border-slate-400 w-5">Sıra</th>
              <th className="py-0.5 px-1.5 border-r border-slate-400 w-20 text-left">İş Grubu</th>
              <th className="py-0.5 px-1.5 border-r border-slate-400 text-left">İş Kalemi / Açıklama</th>
              <th className="py-0.5 px-1 border-r border-slate-400 w-10">Birim</th>
              <th className="py-0.5 px-1 border-r border-slate-400 w-12 text-right">Miktar</th>
              <th className="py-0.5 px-1.5 border-r border-slate-400 w-16 text-right">Birim Fiyat</th>
              <th className="py-0.5 px-1.5 border-r border-slate-400 w-20 text-right">Tutar</th>
              <th className="py-0.5 px-1.5 text-left">Not / Model</th>
            </tr>
          </thead>
          <tbody>
            {quotation.items.map((item, idx) => (
              <tr key={item.id || idx} className={`border-b border-slate-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}`}>
                <td className="py-0.5 px-1 text-center font-mono border-r border-slate-200">{idx + 1}</td>
                <td className="py-0.5 px-1.5 font-bold text-slate-800 border-r border-slate-200">{item.isGrubu}</td>
                <td className="py-0.5 px-1.5 text-slate-900 border-r border-slate-200">{item.aciklama}</td>
                <td className="py-0.5 px-1 text-center font-mono border-r border-slate-200">{item.birim}</td>
                <td className="py-0.5 px-1 text-right font-mono border-r border-slate-200">
                  {item.miktar > 0 ? item.miktar.toLocaleString('tr-TR') : '0,00'}
                </td>
                <td className="py-0.5 px-1.5 text-right font-mono border-r border-slate-200">
                  {item.birimFiyat > 0 ? formatTL(item.birimFiyat) : '₺0,00'}
                </td>
                <td className="py-0.5 px-1.5 text-right font-mono font-bold text-slate-900 border-r border-slate-200">
                  {item.tutar > 0 ? formatTL(item.tutar) : '₺0,00'}
                </td>
                <td className="py-0.5 px-1.5 text-slate-600 text-[7.5px]">{item.notModel || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals Box */}
        <div className="flex justify-end mb-1.5 text-[8.5px]">
          <div className="w-64 border border-slate-300 rounded overflow-hidden">
            <div className="flex justify-between bg-slate-100 px-2 py-0.5 border-b border-slate-200">
              <span className="font-bold text-slate-800">Ara Toplam:</span>
              <span className="font-mono font-bold text-slate-900">{formatTL(araToplam)}</span>
            </div>
            {indirimTutari > 0 && (
              <div className="flex justify-between px-2 py-0.5 border-b border-slate-200 bg-white">
                <span className="text-slate-700">İndirim Tutarı (%{quotation.indirimOrani}):</span>
                <span className="font-mono font-bold text-emerald-700">-{formatTL(indirimTutari)}</span>
              </div>
            )}
            <div className="flex justify-between px-2 py-0.5 border-b border-slate-200 bg-white">
              <span className="text-slate-700">KDV Tutarı (%{quotation.kdvOrani}):</span>
              <span className="font-mono text-slate-900">+{formatTL(kdvTutari)}</span>
            </div>
            <div className="flex justify-between bg-emerald-900 text-white px-2 py-1 font-black">
              <span className="text-[9.5px]">GENEL TOPLAM:</span>
              <span className="font-mono text-[10px]">{formatTL(genelToplam)} (KDV DAHİL)</span>
            </div>
          </div>
        </div>

        {/* Ödeme Koşulları Strip */}
        <div className="border border-slate-300 rounded p-1.5 bg-slate-50 mb-1.5 text-[8px]">
          <div className="font-bold text-emerald-900 border-b border-slate-200 pb-0.5 uppercase tracking-wider text-[7.5px] mb-1">
            ÖDEME PLANI VE DAĞILIMI
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-center">
            <div className="bg-white p-1 rounded border border-slate-200">
              <div className="font-bold text-slate-700 text-[7.5px]">PEŞİN AVANS (%{quotation.pesinYuzde})</div>
              <div className="font-mono font-bold text-emerald-900 text-[9.5px] mt-0.5">{formatTL(pesinTutar)}</div>
            </div>
            <div className="bg-white p-1 rounded border border-slate-200">
              <div className="font-bold text-slate-700 text-[7.5px]">İŞ ESNASINDA (%{quotation.isEsnasindaYuzde})</div>
              <div className="font-mono font-bold text-emerald-900 text-[9.5px] mt-0.5">{formatTL(isEsnasindaTutar)}</div>
            </div>
            <div className="bg-white p-1 rounded border border-slate-200">
              <div className="font-bold text-slate-700 text-[7.5px]">İŞ TESLİMİNDE (%{quotation.isTeslimindeYuzde})</div>
              <div className="font-mono font-bold text-emerald-900 text-[9.5px] mt-0.5">{formatTL(isTeslimindeTutar)}</div>
            </div>
          </div>
        </div>

        {/* Teklif Şartları ve Açıklamalar (2 Sütunlu Kompakt Düzen) */}
        <div className="border border-slate-300 rounded p-1.5 bg-white mb-1.5 text-[7.5px] leading-tight">
          <div className="font-bold text-emerald-900 border-b border-slate-200 pb-0.5 uppercase tracking-wider text-[7.5px] mb-1">
            TEKLİF ŞARTLARI VE AÇIKLAMALAR
          </div>
          <ol className="grid grid-cols-2 gap-x-3 gap-y-0.5 list-decimal pl-3.5 text-slate-800">
            {quotation.sartlar.map((s, idx) => (
              <li key={idx} className="pr-1">{s}</li>
            ))}
          </ol>
        </div>

        {/* İmza & Kaşe Alanları */}
        <div className="grid grid-cols-2 gap-6 text-[8px] pt-1.5 border-t border-slate-300">
          <div className="text-center space-y-3">
            <div>
              <div className="font-bold text-slate-900 uppercase">TEKLİFİ HAZIRLAYAN</div>
              <div className="text-slate-600 text-[7.5px]">{quotation.companyName}</div>
              <div className="text-slate-800 font-semibold">{quotation.hazirlayan}</div>
            </div>
            <div className="text-slate-400 text-[7.5px]">Ad Soyad / Kaşe / İmza</div>
          </div>

          <div className="text-center space-y-3">
            <div>
              <div className="font-bold text-slate-900 uppercase">MÜŞTERİ ONAYI</div>
              <div className="text-slate-600 text-[7.5px]">{quotation.musteriFirma || 'Müşteri'}</div>
              <div className="text-slate-800 font-semibold">{quotation.yetkiliKisi || '-'}</div>
            </div>
            <div className="text-slate-400 text-[7.5px]">Ad Soyad / Kaşe / İmza</div>
          </div>
        </div>

        {/* Footer Tagline */}
        <div className="text-center text-[7.5px] text-slate-500 pt-1 mt-1 border-t border-slate-200">
          www.detaypeyzaj.com.tr | Profesyonel peyzaj proje ve uygulama hizmetleri • Tel: 0 544 477 20 44
        </div>

      </div>

    </div>
  );
};
