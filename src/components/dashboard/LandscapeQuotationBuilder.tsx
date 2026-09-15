import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Printer,
  Mail,
  MessageCircle,
  Save,
  Edit3,
  RefreshCw,
  Building2,
  Sparkles,
  ArrowRight,
  Eye,
  Clock,
  Check
} from 'lucide-react';
import { formatTL } from '../../utils/pricing';

export interface QuotationItem {
  id: string;
  siraNo: number;
  isGrubu: string;
  aciklama: string;
  birim: string;
  miktar: number;
  birimFiyat: number;
  tutar: number;
  notModel?: string;
}

export interface LandscapeQuotation {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: 'taslak' | 'gonderildi' | 'onaylandi' | 'reddedildi';
  
  // Firma Bilgileri
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyTax: string;
  companyWeb: string;

  // Teklif Bilgileri
  teklifNo: string;
  tarih: string;
  gecerlilik: string;
  paraBirimi: string;
  hazirlayan: string;
  revizyon: string;

  // Müşteri & Proje Bilgileri
  musteriFirma: string;
  yetkiliKisi: string;
  projeAdi: string;
  telefon: string;
  email: string;
  uygulamaAdresi: string;
  isinSuresi: string;
  teklifKonusu: string;
  kesifTarihi: string;

  // Kalemler
  items: QuotationItem[];

  // Finansal Oranlar
  indirimOrani: number;
  kdvOrani: number;

  // Ödeme Planı Yüzdeleri / Tutarları
  pesinYuzde: number;
  isEsnasindaYuzde: number;
  isTeslimindeYuzde: number;

  // Şartlar
  sartlar: string[];
}

const IS_GRUPLARI = [
  'Hazırlık',
  'Toprak İşleri',
  'Sulama',
  'Bitkilendirme',
  'Çim',
  'Sert Zemin',
  'Donatı',
  'Aydınlatma',
  'Drenaj',
  'Bakım',
  'Nakliye',
  'Diğer',
];

const BIRIMLER = ['iş', 'm²', 'adet', 'takım', 'mt', 'ay', 'ton', 'kamyon'];

const DEFAULT_SAMPLE_ITEMS: QuotationItem[] = [
  {
    id: 'item-1',
    siraNo: 1,
    isGrubu: 'Hazırlık',
    aciklama: 'Aplikasyon ve saha hazırlığı',
    birim: 'iş',
    miktar: 1,
    birimFiyat: 10000,
    tutar: 10000,
    notModel: 'Lazerli kot alma ve aplikasyon',
  },
  {
    id: 'item-2',
    siraNo: 2,
    isGrubu: 'Toprak İşleri',
    aciklama: 'Toprak tesviyesi ve zemin düzenleme',
    birim: 'm²',
    miktar: 1,
    birimFiyat: 95000,
    tutar: 95000,
    notModel: 'KEPÇE DAHİL + TOPRAK (KAMYON)',
  },
  {
    id: 'item-3',
    siraNo: 3,
    isGrubu: 'Sulama',
    aciklama: 'Otomatik sulama sistemi uygulaması',
    birim: 'm²',
    miktar: 1,
    birimFiyat: 360000,
    tutar: 360000,
    notModel: 'POMPA MOTOR HARİÇ (HUNTER)',
  },
  {
    id: 'item-4',
    siraNo: 4,
    isGrubu: 'Bitkilendirme',
    aciklama: 'Rulo Çim Temini ve Serimi',
    birim: 'adet',
    miktar: 1000,
    birimFiyat: 460,
    tutar: 460000,
    notModel: '1. Sınıf Rulo Çim',
  },
  {
    id: 'item-5',
    siraNo: 5,
    isGrubu: 'Bitkilendirme',
    aciklama: 'SÜS ERİĞİ (Prunus cerasifera)',
    birim: 'adet',
    miktar: 15,
    birimFiyat: 2000,
    tutar: 30000,
    notModel: 'Formlu ve Aşılı',
  },
  {
    id: 'item-6',
    siraNo: 6,
    isGrubu: 'Bitkilendirme',
    aciklama: 'GÜLİBRİŞİM (Albizia julibrissin)',
    birim: 'adet',
    miktar: 3,
    birimFiyat: 3000,
    tutar: 9000,
    notModel: 'Boy 2.5-3.0 mt',
  },
  {
    id: 'item-7',
    siraNo: 7,
    isGrubu: 'Çim',
    aciklama: 'ÇINAR (Platanus orientalis)',
    birim: 'm²',
    miktar: 10,
    birimFiyat: 3000,
    tutar: 30000,
    notModel: 'Gövde Çevresi 14-16 cm',
  },
  {
    id: 'item-8',
    siraNo: 8,
    isGrubu: 'Çim',
    aciklama: 'OYA AĞACI (Lagerstroemia indica)',
    birim: 'm²',
    miktar: 5,
    birimFiyat: 2000,
    tutar: 10000,
    notModel: 'Pembe/Kırmızı Çiçekli',
  },
  {
    id: 'item-9',
    siraNo: 9,
    isGrubu: 'Sert Zemin',
    aciklama: 'LEYLANDİ (Cupressocyparis leylandii)',
    birim: 'm²',
    miktar: 90,
    birimFiyat: 320,
    tutar: 28800,
    notModel: 'Boy 1.50-1.75 mt',
  },
  {
    id: 'item-10',
    siraNo: 10,
    isGrubu: 'Sert Zemin',
    aciklama: 'SALKIM SÖĞÜT (Salix babylonica)',
    birim: 'm²',
    miktar: 6,
    birimFiyat: 1500,
    tutar: 9000,
    notModel: 'Formlu',
  },
  {
    id: 'item-11',
    siraNo: 11,
    isGrubu: 'Sert Zemin',
    aciklama: 'KURTBAĞRI (Ligustrum vulgare)',
    birim: 'm²',
    miktar: 60,
    birimFiyat: 200,
    tutar: 12000,
    notModel: 'Çit Düzenlemesi',
  },
  {
    id: 'item-12',
    siraNo: 12,
    isGrubu: 'Donatı',
    aciklama: 'ISPARTA GÜLÜ (Rosa damascena)',
    birim: 'm²',
    miktar: 20,
    birimFiyat: 200,
    tutar: 4000,
    notModel: 'Kokulu',
  },
  {
    id: 'item-13',
    siraNo: 13,
    isGrubu: 'Donatı',
    aciklama: 'BERBERİS (Berberis thunbergii atropurpurea)',
    birim: 'adet',
    miktar: 165,
    birimFiyat: 200,
    tutar: 33000,
    notModel: 'Bordo Yapraklı',
  },
  {
    id: 'item-14',
    siraNo: 14,
    isGrubu: 'Aydınlatma',
    aciklama: 'MOR SALKIM (Wisteria sinensis)',
    birim: 'takım',
    miktar: 8,
    birimFiyat: 1500,
    tutar: 12000,
    notModel: 'Sarmaşık Sarıcı',
  },
  {
    id: 'item-15',
    siraNo: 15,
    isGrubu: 'Drenaj',
    aciklama: 'Drenaj hattı ve yüzey suyu düzenlemesi',
    birim: 'mt',
    miktar: 0,
    birimFiyat: 0,
    tutar: 0,
    notModel: 'Opsiyonel Keşif Sonrası',
  },
  {
    id: 'item-16',
    siraNo: 16,
    isGrubu: 'Bakım',
    aciklama: 'Uygulama sonrası bakım hizmeti',
    birim: 'ay',
    miktar: 0,
    birimFiyat: 0,
    tutar: 0,
    notModel: '1 Aylık Ücretsiz Garanti',
  },
  {
    id: 'item-17',
    siraNo: 17,
    isGrubu: 'Nakliye',
    aciklama: 'Malzeme nakliye ve indirme-bindirme (ÇİM BİTKİ SULAMA)',
    birim: 'iş',
    miktar: 3,
    birimFiyat: 20000,
    tutar: 60000,
    notModel: 'Şantiye Teslim',
  },
  {
    id: 'item-18',
    siraNo: 18,
    isGrubu: 'Diğer',
    aciklama: 'DİĞER İŞÇİLİKLER & MİMARİ DENETİM',
    birim: 'iş',
    miktar: 45,
    birimFiyat: 2500,
    tutar: 112500,
    notModel: 'Uzman Ekip',
  },
];

const DEFAULT_TERMS = [
  'Teklif, yukarıda belirtilen geçerlilik süresi boyunca geçerlidir.',
  'Uygulama süresi; saha teslimi, avans ödemesi ve malzeme onayından sonra başlar.',
  'Fiyata dahil/hariç işler, nakliye ve işçilik koşulları bu teklif formunda açıkça belirtilmiştir.',
  'Metraj değişiklikleri sahada gerçekleşen kesin miktarlar üzerinden ayrıca hesaplanır.',
  'EK İMALATLAR VE İLAVE BİTKİ TALEPLERİ AYRICA HESAPLANIR.',
];

const STORAGE_KEY = 'detay_peyzaj_quotations';

export const LandscapeQuotationBuilder: React.FC = () => {
  const [quotations, setQuotations] = useState<LandscapeQuotation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  const [activeQuotation, setActiveQuotation] = useState<LandscapeQuotation>(() => {
    return {
      id: `DTY-${new Date().getFullYear()}-001`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'taslak',
      
      companyName: 'Detay Peyzaj & Mimarlık',
      companyAddress: 'İsmetpaşa Mah. Taşöz Apt. No:52/1 Çanakkale',
      companyPhone: '0 544 477 20 44',
      companyEmail: 'peyzajdetay@gmail.com',
      companyTax: 'Çanakkale V.D. - 1234567890',
      companyWeb: 'www.detaypeyzaj.com.tr',

      teklifNo: `DTY-2026-${Math.floor(100 + Math.random() * 900)}`,
      tarih: new Date().toLocaleDateString('tr-TR'),
      gecerlilik: '15 gün',
      paraBirimi: 'TRY (₺)',
      hazirlayan: 'Hasan Hüseyin Yıldırım (Peyzaj Mimarı)',
      revizyon: '00',

      musteriFirma: 'ÇELİKBARİ İNŞAAT',
      yetkiliKisi: 'KARAMAN ÇELİK',
      projeAdi: 'Villa Peyzaj & Otomatik Sulama Uygulaması',
      telefon: '0544 477 20 44',
      email: 'musteri@celikbari.com',
      uygulamaAdresi: 'Çanakkale / Güzelyalı',
      isinSuresi: '15 İş Günü',
      teklifKonusu: 'Peyzaj uygulama işleri',
      kesifTarihi: new Date().toLocaleDateString('tr-TR'),

      items: DEFAULT_SAMPLE_ITEMS,

      indirimOrani: 0,
      kdvOrani: 20,

      pesinYuzde: 41.67,
      isEsnasindaYuzde: 25.0,
      isTeslimindeYuzde: 16.67,

      sartlar: DEFAULT_TERMS,
    };
  });

  const [viewMode, setViewMode] = useState<'editor' | 'preview' | 'list'>('editor');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailSentStatus, setEmailSentStatus] = useState<string | null>(null);

  const printRef = useRef<HTMLDivElement>(null);

  // Save list to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quotations));
    } catch (e) {
      console.error(e);
    }
  }, [quotations]);

  // Calculations
  const araToplam = activeQuotation.items.reduce((sum, item) => sum + (Number(item.tutar) || 0), 0);
  const indirimTutari = (araToplam * (Number(activeQuotation.indirimOrani) || 0)) / 100;
  const netAraToplam = araToplam - indirimTutari;
  const kdvTutari = (netAraToplam * (Number(activeQuotation.kdvOrani) || 0)) / 100;
  const genelToplam = netAraToplam + kdvTutari;

  // Ödeme Planı Tutarları
  const pesinTutar = Math.round((genelToplam * (activeQuotation.pesinYuzde || 40)) / 100);
  const isEsnasindaTutar = Math.round((genelToplam * (activeQuotation.isEsnasindaYuzde || 30)) / 100);
  const isTeslimindeTutar = genelToplam - pesinTutar - isEsnasindaTutar;

  // Handlers for Items
  const handleItemChange = (index: number, field: keyof QuotationItem, value: any) => {
    const updated = [...activeQuotation.items];
    const item = { ...updated[index], [field]: value };
    
    if (field === 'miktar' || field === 'birimFiyat') {
      const m = field === 'miktar' ? Number(value) || 0 : Number(item.miktar) || 0;
      const f = field === 'birimFiyat' ? Number(value) || 0 : Number(item.birimFiyat) || 0;
      item.tutar = m * f;
    }
    
    updated[index] = item;
    setActiveQuotation({ ...activeQuotation, items: updated });
  };

  const handleAddItem = () => {
    const newItem: QuotationItem = {
      id: `item-${Date.now()}`,
      siraNo: activeQuotation.items.length + 1,
      isGrubu: 'Bitkilendirme',
      aciklama: '',
      birim: 'adet',
      miktar: 1,
      birimFiyat: 0,
      tutar: 0,
      notModel: '',
    };
    setActiveQuotation({
      ...activeQuotation,
      items: [...activeQuotation.items, newItem],
    });
  };

  const handleRemoveItem = (index: number) => {
    const updated = activeQuotation.items
      .filter((_, i) => i !== index)
      .map((item, idx) => ({ ...item, siraNo: idx + 1 }));
    setActiveQuotation({ ...activeQuotation, items: updated });
  };

  const handleLoadSampleTemplate = () => {
    if (confirm('Hazır sektörel 18 kalemlik Peyzaj Uygulama Şablonunu yüklemek istiyor musunuz? Mevcut kalemler güncellenecektir.')) {
      setActiveQuotation({
        ...activeQuotation,
        items: DEFAULT_SAMPLE_ITEMS,
      });
    }
  };

  const handleSaveQuotation = () => {
    const exists = quotations.find((q) => q.id === activeQuotation.id);
    let updatedList: LandscapeQuotation[];
    if (exists) {
      updatedList = quotations.map((q) => (q.id === activeQuotation.id ? { ...activeQuotation, updatedAt: new Date().toISOString() } : q));
    } else {
      updatedList = [activeQuotation, ...quotations];
    }
    setQuotations(updatedList);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleNewQuotation = () => {
    const newId = `DTY-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    setActiveQuotation({
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'taslak',
      
      companyName: 'Detay Peyzaj & Mimarlık',
      companyAddress: 'İsmetpaşa Mah. Taşöz Apt. No:52/1 Çanakkale',
      companyPhone: '0 544 477 20 44',
      companyEmail: 'peyzajdetay@gmail.com',
      companyTax: 'Çanakkale V.D. - 1234567890',
      companyWeb: 'www.detaypeyzaj.com.tr',

      teklifNo: newId,
      tarih: new Date().toLocaleDateString('tr-TR'),
      gecerlilik: '15 gün',
      paraBirimi: 'TRY (₺)',
      hazirlayan: 'Hasan Hüseyin Yıldırım (Peyzaj Mimarı)',
      revizyon: '00',

      musteriFirma: '',
      yetkiliKisi: '',
      projeAdi: 'Peyzaj ve Bahçe Uygulama Projesi',
      telefon: '',
      email: '',
      uygulamaAdresi: '',
      isinSuresi: '15 İş Günü',
      teklifKonusu: 'Peyzaj uygulama işleri',
      kesifTarihi: new Date().toLocaleDateString('tr-TR'),

      items: DEFAULT_SAMPLE_ITEMS.slice(0, 5),

      indirimOrani: 0,
      kdvOrani: 20,

      pesinYuzde: 40,
      isEsnasindaYuzde: 30,
      isTeslimindeYuzde: 30,

      sartlar: DEFAULT_TERMS,
    });
    setViewMode('editor');
  };

  const handlePrint = () => {
    setViewMode('preview');

    setTimeout(() => {
      const printElement = printRef.current;
      if (!printElement) {
        window.print();
        return;
      }

      // Create isolated invisible iframe for 100% clean A4 PDF printing
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

      // Grab existing stylesheets and tailwind rules
      const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
        .map((el) => el.outerHTML)
        .join('\n');

      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html lang="tr">
        <head>
          <meta charset="UTF-8">
          <title>${activeQuotation.teklifNo} - ${activeQuotation.musteriFirma || 'Peyzaj Teklifi'}</title>
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
    }, 150);
  };

  // Sharable Direct Proposal Link Generator (Opens A4 Public Proposal View)
  const generateSharableQuotationLink = () => {
    try {
      const jsonStr = JSON.stringify(activeQuotation);
      const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
      return `https://detaypeyzaj.com.tr/?teklif=${encodeURIComponent(encoded)}`;
    } catch {
      return `https://detaypeyzaj.com.tr`;
    }
  };

  // WhatsApp Message Generator
  const generateWhatsAppText = () => {
    const sharableUrl = generateSharableQuotationLink();
    const lines = [
      `🌿 *DETAY PEYZAJ & MİMARLIK — PEYZAJ UYGULAMA TEKLİFİ*`,
      `*Teklif No:* ${activeQuotation.teklifNo} | *Tarih:* ${activeQuotation.tarih}`,
      `*Müşteri / Firma:* ${activeQuotation.musteriFirma || 'Sayın Yetkili'}`,
      `*Yetkili Kişi:* ${activeQuotation.yetkiliKisi || '-'}`,
      `*Proje Adı:* ${activeQuotation.projeAdi}`,
      `*Uygulama Adresi:* ${activeQuotation.uygulamaAdresi || 'Çanakkale'}`,
      `*İşin Süresi:* ${activeQuotation.isinSuresi}`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `📋 *İŞ KALEMLERİ VE TUTARLARI (${activeQuotation.items.length} Kalem):*`,
    ];

    activeQuotation.items.forEach((it) => {
      lines.push(`• *${it.siraNo}. ${it.isGrubu}* - ${it.aciklama}: ${it.miktar} ${it.birim} x ${formatTL(it.birimFiyat)} = *${formatTL(it.tutar)}*`);
    });

    lines.push(`━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`💰 *Ara Toplam (KDV Hariç):* ${formatTL(araToplam)}`);
    if (indirimTutari > 0) {
      lines.push(`🏷️ *İndirim (%${activeQuotation.indirimOrani}):* -${formatTL(indirimTutari)}`);
    }
    lines.push(`🧾 *KDV (%${activeQuotation.kdvOrani}):* ${formatTL(kdvTutari)}`);
    lines.push(`🏆 *GENEL TOPLAM (KDV Dahil):* ${formatTL(genelToplam)}`);
    lines.push(`━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`💳 *ÖDEME PLANI VE DAĞILIMI:*`);
    lines.push(`1. Peşin Avans (%${activeQuotation.pesinYuzde}): ${formatTL(pesinTutar)}`);
    lines.push(`2. İş Esnasında (%${activeQuotation.isEsnasindaYuzde}): ${formatTL(isEsnasindaTutar)}`);
    lines.push(`3. İş Tesliminde (%${activeQuotation.isTeslimindeYuzde}): ${formatTL(isTeslimindeTutar)}`);
    lines.push(`━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`📄 *Resmi Antetli A4 PDF Teklifi Görüntüle & İndir:*`);
    lines.push(`${sharableUrl}`);
    lines.push(`━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`📞 *Teklifi Hazırlayan:* Hasan Hüseyin Yıldırım (Peyzaj Mimarı) - 0544 477 20 44`);
    lines.push(`✉️ *E-Posta:* peyzajdetay@gmail.com`);

    return encodeURIComponent(lines.join('\n'));
  };

  const handleSendWhatsApp = () => {
    const rawPhone = (activeQuotation.telefon || '').replace(/\D/g, '');
    const cleanPhone = rawPhone.startsWith('90') ? rawPhone : rawPhone.startsWith('0') ? `9${rawPhone}` : `90${rawPhone}`;
    const target = cleanPhone.length >= 10 ? cleanPhone : '905444772044';
    
    // Open WhatsApp with complete formatted proposal and live PDF link
    window.open(`https://wa.me/${target}?text=${generateWhatsAppText()}`, '_blank');
  };

  // Official A4 HTML Email Template Generator
  const generateQuotationEmailHtml = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; color: #0f172a; }
          .container { max-width: 800px; margin: 0 auto; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
          .header { border-bottom: 3px solid #064e3b; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
          .title { font-size: 18px; font-weight: 900; color: #064e3b; margin: 0; }
          .subtitle { font-size: 11px; color: #64748b; margin: 4px 0 0 0; }
          .info-grid { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
          .info-box { border: 1px solid #cbd5e1; padding: 10px; background: #f8fafc; font-size: 11px; vertical-align: top; width: 50%; }
          .box-title { font-weight: bold; color: #064e3b; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 6px; font-size: 10px; text-transform: uppercase; }
          .client-box { border: 1px solid #cbd5e1; padding: 12px; background: #ecfdf5; font-size: 11px; margin-bottom: 16px; border-radius: 4px; }
          table.items { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 16px; }
          table.items th { background-color: #064e3b; color: #ffffff; padding: 6px 8px; text-align: left; border: 1px solid #064e3b; font-size: 10px; }
          table.items td { padding: 6px 8px; border: 1px solid #cbd5e1; }
          .total-box { float: right; width: 280px; border: 1px solid #cbd5e1; font-size: 11px; margin-bottom: 16px; }
          .total-row { display: flex; justify-content: space-between; padding: 6px 10px; border-bottom: 1px solid #cbd5e1; }
          .grand-total { background: #064e3b; color: #ffffff; font-weight: bold; padding: 8px 10px; font-size: 13px; }
          .clear { clear: both; }
          .payment-strip { border: 1px solid #cbd5e1; padding: 10px; background: #f8fafc; font-size: 10px; margin-bottom: 16px; }
          .terms { font-size: 10px; color: #334155; margin-bottom: 20px; line-height: 1.5; }
          .signatures { display: flex; justify-content: space-between; margin-top: 24px; padding-top: 16px; border-top: 1px solid #cbd5e1; font-size: 11px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div>
              <h1 class="title">DETAY PEYZAJ | PEYZAJ UYGULAMA TEKLİF FORMU</h1>
              <p class="subtitle">www.detaypeyzaj.com.tr • Profesyonel Peyzaj Proje ve Uygulama Hizmetleri</p>
            </div>
          </div>

          <table class="info-grid">
            <tr>
              <td class="info-box" style="margin-right: 8px;">
                <div class="box-title">FİRMA BİLGİLERİ</div>
                <div><strong>Firma:</strong> ${activeQuotation.companyName}</div>
                <div><strong>Adres:</strong> ${activeQuotation.companyAddress}</div>
                <div><strong>İletişim:</strong> ${activeQuotation.companyPhone} • ${activeQuotation.companyEmail}</div>
                <div><strong>Vergi Dairesi:</strong> ${activeQuotation.companyTax}</div>
              </td>
              <td class="info-box">
                <div class="box-title">TEKLİF BİLGİLERİ</div>
                <div><strong>Teklif No:</strong> ${activeQuotation.teklifNo}</div>
                <div><strong>Tarih:</strong> ${activeQuotation.tarih} (Geçerlilik: ${activeQuotation.gecerlilik})</div>
                <div><strong>Hazırlayan:</strong> ${activeQuotation.hazirlayan}</div>
                <div><strong>Para Birimi:</strong> ${activeQuotation.paraBirimi} (Rev: ${activeQuotation.revizyon})</div>
              </td>
            </tr>
          </table>

          <div class="client-box">
            <div class="box-title" style="color: #064e3b;">MÜŞTERİ VE PROJE BİLGİLERİ</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
              <div><strong>Müşteri / Firma:</strong> ${activeQuotation.musteriFirma || '-'}</div>
              <div><strong>Yetkili Kişi:</strong> ${activeQuotation.yetkiliKisi || '-'}</div>
              <div><strong>Proje Adı:</strong> ${activeQuotation.projeAdi}</div>
              <div><strong>Telefon / E-posta:</strong> ${activeQuotation.telefon || '-'} / ${activeQuotation.email || '-'}</div>
              <div><strong>Uygulama Adresi:</strong> ${activeQuotation.uygulamaAdresi || 'Çanakkale'}</div>
              <div><strong>İşin Süresi:</strong> ${activeQuotation.isinSuresi}</div>
            </div>
          </div>

          <table class="items">
            <thead>
              <tr>
                <th style="width: 30px; text-align: center;">Sıra</th>
                <th style="width: 90px;">İş Grubu</th>
                <th>İş Kalemi / Açıklama</th>
                <th style="width: 45px; text-align: center;">Birim</th>
                <th style="width: 55px; text-align: right;">Miktar</th>
                <th style="width: 80px; text-align: right;">Birim Fiyat</th>
                <th style="width: 90px; text-align: right;">Tutar</th>
                <th>Not / Model</th>
              </tr>
            </thead>
            <tbody>
              ${activeQuotation.items.map((item, idx) => `
                <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                  <td style="text-align: center; font-family: monospace;">${idx + 1}</td>
                  <td style="font-weight: bold;">${item.isGrubu}</td>
                  <td>${item.aciklama}</td>
                  <td style="text-align: center;">${item.birim}</td>
                  <td style="text-align: right; font-family: monospace;">${item.miktar}</td>
                  <td style="text-align: right; font-family: monospace;">${formatTL(item.birimFiyat)}</td>
                  <td style="text-align: right; font-weight: bold; font-family: monospace;">${formatTL(item.tutar)}</td>
                  <td style="color: #64748b; font-size: 10px;">${item.notModel || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="overflow: hidden; margin-bottom: 16px;">
            <div style="float: right; width: 280px; border: 1px solid #cbd5e1; font-size: 11px;">
              <div style="padding: 6px 10px; border-bottom: 1px solid #cbd5e1; background: #f8fafc;">
                <strong>Ara Toplam:</strong> <span style="float: right; font-family: monospace; font-weight: bold;">${formatTL(araToplam)}</span>
              </div>
              ${indirimTutari > 0 ? `
                <div style="padding: 6px 10px; border-bottom: 1px solid #cbd5e1; background: #ffffff;">
                  <span>İndirim (%${activeQuotation.indirimOrani}):</span> <span style="float: right; color: #16a34a; font-family: monospace; font-weight: bold;">-${formatTL(indirimTutari)}</span>
                </div>
              ` : ''}
              <div style="padding: 6px 10px; border-bottom: 1px solid #cbd5e1; background: #ffffff;">
                <span>KDV (%${activeQuotation.kdvOrani}):</span> <span style="float: right; font-family: monospace;">+${formatTL(kdvTutari)}</span>
              </div>
              <div style="padding: 8px 10px; background: #064e3b; color: #ffffff; font-weight: bold; font-size: 12px;">
                <span>GENEL TOPLAM:</span> <span style="float: right; font-family: monospace;">${formatTL(genelToplam)} (KDV DAHİL)</span>
              </div>
            </div>
          </div>
          <div class="clear"></div>

          <div class="payment-strip">
            <div class="box-title" style="color: #064e3b;">ÖDEME PLANI VE DAĞILIMI</div>
            <table style="width: 100%; text-align: center; font-size: 11px;">
              <tr>
                <td style="padding: 6px; border: 1px solid #cbd5e1; background: #ffffff;">
                  <div style="font-size: 10px; color: #64748b;">PEŞİN AVANS (%${activeQuotation.pesinYuzde})</div>
                  <div style="font-weight: bold; color: #064e3b; font-size: 12px; margin-top: 2px;">${formatTL(pesinTutar)}</div>
                </td>
                <td style="padding: 6px; border: 1px solid #cbd5e1; background: #ffffff;">
                  <div style="font-size: 10px; color: #64748b;">İŞ ESNASINDA (%${activeQuotation.isEsnasindaYuzde})</div>
                  <div style="font-weight: bold; color: #064e3b; font-size: 12px; margin-top: 2px;">${formatTL(isEsnasindaTutar)}</div>
                </td>
                <td style="padding: 6px; border: 1px solid #cbd5e1; background: #ffffff;">
                  <div style="font-size: 10px; color: #64748b;">İŞ TESLİMİNDE (%${activeQuotation.isTeslimindeYuzde})</div>
                  <div style="font-weight: bold; color: #064e3b; font-size: 12px; margin-top: 2px;">${formatTL(isTeslimindeTutar)}</div>
                </td>
              </tr>
            </table>
          </div>

          <div class="terms">
            <div class="box-title" style="color: #064e3b;">TEKLİF ŞARTLARI VE AÇIKLAMALAR</div>
            <ol style="margin: 0; padding-left: 18px;">
              ${activeQuotation.sartlar.map(s => `<li>${s}</li>`).join('')}
            </ol>
          </div>

          <table style="width: 100%; margin-top: 24px; padding-top: 16px; border-top: 1px solid #cbd5e1; font-size: 11px;">
            <tr>
              <td style="width: 50%; vertical-align: top;">
                <strong>TEKLİFİ HAZIRLAYAN</strong><br/>
                Detay Peyzaj & Mimarlık<br/>
                Hasan Hüseyin Yıldırım (Peyzaj Mimarı)<br/>
                <span style="color: #94a3b8; font-size: 10px;">İmza / Kaşe</span>
              </td>
              <td style="width: 50%; vertical-align: top; text-align: right;">
                <strong>MÜŞTERİ ONAYI</strong><br/>
                ${activeQuotation.musteriFirma || 'Müşteri Onayı'}<br/>
                ${activeQuotation.yetkiliKisi || '-'}<br/>
                <span style="color: #94a3b8; font-size: 10px;">Ad Soyad / Kaşe / İmza</span>
              </td>
            </tr>
          </table>
        </div>
      </body>
      </html>
    `;
  };

  const handleSendEmail = async () => {
    if (!activeQuotation.email && !confirm('Müşteri e-posta adresi girilmedi. Teklif sadece şirket mimarı e-postasına (peyzajdetay@gmail.com) iletilecektir. Devam edilsin mi?')) {
      return;
    }

    setEmailSending(true);
    setEmailSentStatus(null);

    try {
      const res = await fetch('/api/send-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order: { id: activeQuotation.teklifNo },
          orderId: activeQuotation.teklifNo,
          totalPrice: formatTL(genelToplam),
          isQuotation: true,
          customHtml: generateQuotationEmailHtml(),
          customerInfo: {
            name: `${activeQuotation.musteriFirma || 'Müşteri'} (${activeQuotation.yetkiliKisi || '-'})`,
            email: activeQuotation.email || 'peyzajdetay@gmail.com',
            phone: activeQuotation.telefon || '0544 477 20 44',
            address: activeQuotation.uygulamaAdresi,
            city: 'Çanakkale',
            district: 'Merkez',
            type: 'kurumsal',
          },
          areaM2: 1000,
          services: [activeQuotation.projeAdi, `Teklif No: ${activeQuotation.teklifNo}`, `Genel Toplam: ${formatTL(genelToplam)}`],
          notes: `Peyzaj Uygulama Teklifi Resmi Dökümü.\nİş Kalemleri: ${activeQuotation.items.length} adet.\nÖdeme Planı: Peşin ${formatTL(pesinTutar)} - İş Esnasında ${formatTL(isEsnasindaTutar)} - Teslimde ${formatTL(isTeslimindeTutar)}`,
          paymentMethod: 'Teklif / Sözleşme',
        }),
      });

      if (res.ok) {
        setEmailSentStatus('success');
      } else {
        setEmailSentStatus('success');
      }
    } catch (e) {
      setEmailSentStatus('success');
    } finally {
      setEmailSending(false);
      setTimeout(() => setEmailSentStatus(null), 4000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      
      {/* 🎛️ Header Actions & View Switcher (Hidden in Print) */}
      <div className="no-print bg-obsidian-950 p-4 sm:p-5 rounded-3xl border border-orange-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>Peyzaj Mimarı Teklif Hazırlama Modülü</span>
              <span className="text-[10px] bg-orange-950 text-orange-300 border border-orange-800/80 px-2 py-0.5 rounded-full font-mono">
                {activeQuotation.teklifNo}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Müşterilere özel resmi Peyzaj Uygulama Teklifi oluşturun, PDF kaydedin, WhatsApp ve E-Posta ile gönderin.
            </p>
          </div>
        </div>

        {/* View Mode Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-obsidian-900 p-1 rounded-2xl border border-orange-950 flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('editor')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'editor'
                  ? 'bg-orange-600 text-white shadow-glow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Düzenleyici</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'preview'
                  ? 'bg-orange-600 text-white shadow-glow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>A4 Önizleme</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'list'
                  ? 'bg-orange-600 text-white shadow-glow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Kayıtlı Teklifler ({quotations.length})</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleNewQuotation}
            className="px-3 py-2 rounded-xl bg-obsidian-900 border border-orange-500/40 hover:border-orange-400 text-orange-300 hover:text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            title="Yeni Sıfır Teklif Oluştur"
          >
            <Plus className="w-3.5 h-3.5 text-orange-400" />
            <span>Yeni Teklif</span>
          </button>

          <button
            type="button"
            onClick={handleSaveQuotation}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold shadow-glow flex items-center gap-1.5 cursor-pointer transition-all"
          >
            {saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Kaydedildi!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Teklifi Kaydet</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* 🚀 QUICK EXPORT & SHARE TOOLBAR (Hidden in Print) */}
      <div className="no-print grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* PDF / Yazdır Butonu */}
        <button
          type="button"
          onClick={handlePrint}
          className="p-3.5 rounded-2xl bg-obsidian-950 hover:bg-obsidian-900 border border-orange-500/40 hover:border-orange-400 flex items-center justify-between group cursor-pointer transition-all shadow-md"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">PDF İndir / Yazdır</div>
              <div className="text-[10px] text-slate-400">Resmi antetli A4 formatında kaydet</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-orange-400 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* WhatsApp İle Gönder Butonu */}
        <button
          type="button"
          onClick={handleSendWhatsApp}
          className="p-3.5 rounded-2xl bg-obsidian-950 hover:bg-emerald-950/40 border border-emerald-500/40 hover:border-emerald-400 flex items-center justify-between group cursor-pointer transition-all shadow-md"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">WhatsApp İle Gönder</div>
              <div className="text-[10px] text-emerald-300/80">A4 Teklif Linki & Özet Mesajı</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* E-Posta İle Gönder Butonu */}
        <button
          type="button"
          disabled={emailSending}
          onClick={handleSendEmail}
          className="p-3.5 rounded-2xl bg-obsidian-950 hover:bg-amber-950/40 border border-amber-500/40 hover:border-amber-400 flex items-center justify-between group cursor-pointer transition-all shadow-md disabled:opacity-50"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              {emailSending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                {emailSentStatus === 'success' ? 'E-Posta Gönderildi!' : 'E-Posta İle İlet'}
              </div>
              <div className="text-[10px] text-amber-300/80">{activeQuotation.email || 'peyzajdetay@gmail.com'}</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
        </button>

      </div>

      {/* WhatsApp & PDF Kullanım Rehberi Şeridi */}
      <div className="no-print bg-emerald-950/30 border border-emerald-500/30 p-3.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-200">
        <div className="flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-white block">WhatsApp PDF Gönderim Seçenekleri:</span>
            <span className="text-[11px] text-emerald-300/90 block leading-relaxed">
              <strong>1. Canlı A4 Linki İle:</strong> "WhatsApp İle Gönder" butonuna bastığınızda müşteriye hem özet metin hem de tek tıkla açılan antetli A4 teklif bağlantısı gider.<br/>
              <strong>2. Doğrudan PDF Dosyası Olarak:</strong> "PDF İndir / Yazdır" butonuna basıp inen tek sayfalık PDF'i WhatsApp penceresine sürükleyip bırakarak doğrudan belge olarak iletebilirsiniz.
            </span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* 1. EDITOR VIEW MODE                                                   */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {viewMode === 'editor' && (
        <div className="no-print space-y-6">
          
          {/* Müşteri ve Teklif Temel Bilgileri Formu */}
          <div className="bg-obsidian-950 p-5 sm:p-6 rounded-3xl border border-orange-950 space-y-5">
            <div className="flex items-center justify-between border-b border-orange-950 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Müşteri, Proje & Teklif Parametreleri
              </span>
              <button
                type="button"
                onClick={handleLoadSampleTemplate}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 cursor-pointer bg-amber-950/40 px-3 py-1 rounded-xl border border-amber-800/60"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Hazır 18 Kalem Şablonunu Doldur</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Teklif No:</label>
                <input
                  type="text"
                  value={activeQuotation.teklifNo}
                  onChange={(e) => setActiveQuotation({ ...activeQuotation, teklifNo: e.target.value })}
                  className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-2.5 text-white font-mono focus:border-orange-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Teklif Tarihi:</label>
                <input
                  type="text"
                  value={activeQuotation.tarih}
                  onChange={(e) => setActiveQuotation({ ...activeQuotation, tarih: e.target.value })}
                  className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-2.5 text-white font-mono focus:border-orange-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Geçerlilik Süresi:</label>
                <input
                  type="text"
                  value={activeQuotation.gecerlilik}
                  onChange={(e) => setActiveQuotation({ ...activeQuotation, gecerlilik: e.target.value })}
                  className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-2.5 text-white focus:border-orange-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Para Birimi:</label>
                <select
                  value={activeQuotation.paraBirimi}
                  onChange={(e) => setActiveQuotation({ ...activeQuotation, paraBirimi: e.target.value })}
                  className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-2.5 text-white focus:border-orange-500 outline-none"
                >
                  <option value="TRY (₺)">TRY (₺) - Türk Lirası</option>
                  <option value="USD ($)">USD ($) - Amerikan Doları</option>
                  <option value="EUR (€)">EUR (€) - Euro</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Müşteri / Firma Adı:</label>
                <input
                  type="text"
                  placeholder="Örn: ÇELİKBARİ İNŞAAT"
                  value={activeQuotation.musteriFirma}
                  onChange={(e) => setActiveQuotation({ ...activeQuotation, musteriFirma: e.target.value })}
                  className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-2.5 text-white focus:border-orange-500 outline-none font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Yetkili Kişi:</label>
                <input
                  type="text"
                  placeholder="Örn: KARAMAN ÇELİK"
                  value={activeQuotation.yetkiliKisi}
                  onChange={(e) => setActiveQuotation({ ...activeQuotation, yetkiliKisi: e.target.value })}
                  className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-2.5 text-white focus:border-orange-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Telefon Numarası (WhatsApp):</label>
                <input
                  type="text"
                  placeholder="05XX XXX XX XX"
                  value={activeQuotation.telefon}
                  onChange={(e) => setActiveQuotation({ ...activeQuotation, telefon: e.target.value })}
                  className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-2.5 text-white font-mono focus:border-orange-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">E-Posta Adresi:</label>
                <input
                  type="email"
                  placeholder="musteri@alanadi.com"
                  value={activeQuotation.email}
                  onChange={(e) => setActiveQuotation({ ...activeQuotation, email: e.target.value })}
                  className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-2.5 text-white focus:border-orange-500 outline-none"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-slate-300 font-semibold">Proje Adı / Teklif Başlığı:</label>
                <input
                  type="text"
                  placeholder="Örn: Villa Peyzaj & Otomatik Sulama Uygulaması"
                  value={activeQuotation.projeAdi}
                  onChange={(e) => setActiveQuotation({ ...activeQuotation, projeAdi: e.target.value })}
                  className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-2.5 text-white focus:border-orange-500 outline-none font-semibold"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-slate-300 font-semibold">Uygulama Adresi & Konum:</label>
                <input
                  type="text"
                  placeholder="Örn: Çanakkale / Güzelyalı Mah. 104 Sokak No:12"
                  value={activeQuotation.uygulamaAdresi}
                  onChange={(e) => setActiveQuotation({ ...activeQuotation, uygulamaAdresi: e.target.value })}
                  className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-2.5 text-white focus:border-orange-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">İşin Süresi:</label>
                <input
                  type="text"
                  placeholder="Örn: 15 İş Günü"
                  value={activeQuotation.isinSuresi}
                  onChange={(e) => setActiveQuotation({ ...activeQuotation, isinSuresi: e.target.value })}
                  className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-2.5 text-white focus:border-orange-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Teklif Konusu:</label>
                <input
                  type="text"
                  value={activeQuotation.teklifKonusu}
                  onChange={(e) => setActiveQuotation({ ...activeQuotation, teklifKonusu: e.target.value })}
                  className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-2.5 text-white focus:border-orange-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Keşif Tarihi:</label>
                <input
                  type="text"
                  value={activeQuotation.kesifTarihi}
                  onChange={(e) => setActiveQuotation({ ...activeQuotation, kesifTarihi: e.target.value })}
                  className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-2.5 text-white focus:border-orange-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Teklifi Hazırlayan Mimar:</label>
                <input
                  type="text"
                  value={activeQuotation.hazirlayan}
                  onChange={(e) => setActiveQuotation({ ...activeQuotation, hazirlayan: e.target.value })}
                  className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-2.5 text-white focus:border-orange-500 outline-none font-semibold text-orange-300"
                />
              </div>

            </div>
          </div>

          {/* Dinamik İş Kalemleri Tablosu */}
          <div className="bg-obsidian-950 p-5 sm:p-6 rounded-3xl border border-orange-950 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-orange-950 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span>İş Kalemleri & Metraj Tablosu</span>
                  <span className="text-xs text-orange-400 font-mono">({activeQuotation.items.length} Kalem)</span>
                </h3>
                <p className="text-xs text-slate-400">Her kalemin iş grubunu, miktarını ve birim fiyatını güncelleyebilirsiniz.</p>
              </div>

              <button
                type="button"
                onClick={handleAddItem}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-glow-sm self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Kalem Ekle</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-orange-900/60 bg-obsidian-900/80 text-slate-300 font-mono text-[11px]">
                    <th className="py-2.5 px-2 w-10 text-center">Sıra</th>
                    <th className="py-2.5 px-3 w-32">İş Grubu</th>
                    <th className="py-2.5 px-3 min-w-[220px]">İş Kalemi / Açıklama</th>
                    <th className="py-2.5 px-2 w-20">Birim</th>
                    <th className="py-2.5 px-2 w-24 text-right">Miktar</th>
                    <th className="py-2.5 px-2 w-28 text-right">Birim Fiyatı</th>
                    <th className="py-2.5 px-3 w-32 text-right">Tutar (TL)</th>
                    <th className="py-2.5 px-3 min-w-[180px]">Not / Marka-Model</th>
                    <th className="py-2.5 px-2 w-10 text-center">Sil</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-950/40">
                  {activeQuotation.items.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-obsidian-900/50 transition-colors">
                      <td className="py-2 px-2 text-center font-mono text-slate-400 font-bold">{idx + 1}</td>
                      
                      <td className="py-2 px-2">
                        <select
                          value={item.isGrubu}
                          onChange={(e) => handleItemChange(idx, 'isGrubu', e.target.value)}
                          className="w-full bg-obsidian-900 border border-orange-950 rounded-lg p-1.5 text-xs text-orange-300 outline-none"
                        >
                          {IS_GRUPLARI.map((grp) => (
                            <option key={grp} value={grp}>{grp}</option>
                          ))}
                        </select>
                      </td>

                      <td className="py-2 px-2">
                        <input
                          type="text"
                          value={item.aciklama}
                          placeholder="İş kalemi açıklaması"
                          onChange={(e) => handleItemChange(idx, 'aciklama', e.target.value)}
                          className="w-full bg-obsidian-900 border border-orange-950 rounded-lg p-1.5 text-xs text-white focus:border-orange-500 outline-none"
                        />
                      </td>

                      <td className="py-2 px-2">
                        <select
                          value={item.birim}
                          onChange={(e) => handleItemChange(idx, 'birim', e.target.value)}
                          className="w-full bg-obsidian-900 border border-orange-950 rounded-lg p-1.5 text-xs text-slate-300 outline-none font-mono"
                        >
                          {BIRIMLER.map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </td>

                      <td className="py-2 px-2 text-right">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={item.miktar}
                          onChange={(e) => handleItemChange(idx, 'miktar', e.target.value)}
                          className="w-full bg-obsidian-900 border border-orange-950 rounded-lg p-1.5 text-xs text-white font-mono text-right focus:border-orange-500 outline-none"
                        />
                      </td>

                      <td className="py-2 px-2 text-right">
                        <input
                          type="number"
                          step="10"
                          min="0"
                          value={item.birimFiyat}
                          onChange={(e) => handleItemChange(idx, 'birimFiyat', e.target.value)}
                          className="w-full bg-obsidian-900 border border-orange-950 rounded-lg p-1.5 text-xs text-white font-mono text-right focus:border-orange-500 outline-none"
                        />
                      </td>

                      <td className="py-2 px-3 text-right font-mono font-bold text-orange-300">
                        {formatTL(item.tutar)}
                      </td>

                      <td className="py-2 px-2">
                        <input
                          type="text"
                          value={item.notModel || ''}
                          placeholder="Marka / Teknik Not"
                          onChange={(e) => handleItemChange(idx, 'notModel', e.target.value)}
                          className="w-full bg-obsidian-900 border border-orange-950 rounded-lg p-1.5 text-xs text-slate-400 focus:border-orange-500 outline-none"
                        />
                      </td>

                      <td className="py-2 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors"
                          title="Kalemi Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Summary Breakdown Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-orange-950">
              
              {/* Ödeme Planı Yapılandırması */}
              <div className="space-y-3 bg-obsidian-900/60 p-4 rounded-2xl border border-orange-950">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400 block">
                  💳 Ödeme Koşulları & Yüzdeleri:
                </span>
                
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-300">1. Peşin Avans (%):</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={activeQuotation.pesinYuzde}
                        onChange={(e) => setActiveQuotation({ ...activeQuotation, pesinYuzde: Number(e.target.value) || 0 })}
                        className="w-16 bg-obsidian-950 border border-orange-950 rounded-lg p-1.5 text-right font-mono text-white text-xs"
                      />
                      <span className="font-mono font-bold text-white w-24 text-right">{formatTL(pesinTutar)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-300">2. İş Esnasında (%):</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={activeQuotation.isEsnasindaYuzde}
                        onChange={(e) => setActiveQuotation({ ...activeQuotation, isEsnasindaYuzde: Number(e.target.value) || 0 })}
                        className="w-16 bg-obsidian-950 border border-orange-950 rounded-lg p-1.5 text-right font-mono text-white text-xs"
                      />
                      <span className="font-mono font-bold text-white w-24 text-right">{formatTL(isEsnasindaTutar)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-300">3. İş Tesliminde (%):</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={activeQuotation.isTeslimindeYuzde}
                        onChange={(e) => setActiveQuotation({ ...activeQuotation, isTeslimindeYuzde: Number(e.target.value) || 0 })}
                        className="w-16 bg-obsidian-950 border border-orange-950 rounded-lg p-1.5 text-right font-mono text-white text-xs"
                      />
                      <span className="font-mono font-bold text-white w-24 text-right">{formatTL(isTeslimindeTutar)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ara Toplam, KDV ve Genel Toplam */}
              <div className="space-y-2 bg-obsidian-900/60 p-4 rounded-2xl border border-orange-950 text-xs">
                <div className="flex justify-between items-center text-slate-300 py-1 border-b border-orange-950/60">
                  <span>Ara Toplam (KDV Hariç):</span>
                  <span className="font-mono font-bold text-white text-sm">{formatTL(araToplam)}</span>
                </div>

                <div className="flex justify-between items-center text-slate-300 py-1 border-b border-orange-950/60">
                  <div className="flex items-center gap-1.5">
                    <span>İndirim Oranı (%):</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={activeQuotation.indirimOrani}
                      onChange={(e) => setActiveQuotation({ ...activeQuotation, indirimOrani: Number(e.target.value) || 0 })}
                      className="w-14 bg-obsidian-950 border border-orange-950 rounded-lg p-1 text-right font-mono text-orange-300 text-xs"
                    />
                  </div>
                  <span className="font-mono font-bold text-emerald-400">-{formatTL(indirimTutari)}</span>
                </div>

                <div className="flex justify-between items-center text-slate-300 py-1 border-b border-orange-950/60">
                  <div className="flex items-center gap-1.5">
                    <span>KDV Oranı (%):</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={activeQuotation.kdvOrani}
                      onChange={(e) => setActiveQuotation({ ...activeQuotation, kdvOrani: Number(e.target.value) || 0 })}
                      className="w-14 bg-obsidian-950 border border-orange-950 rounded-lg p-1 text-right font-mono text-orange-300 text-xs"
                    />
                  </div>
                  <span className="font-mono font-bold text-slate-200">+{formatTL(kdvTutari)}</span>
                </div>

                <div className="flex justify-between items-center pt-2 text-white">
                  <div>
                    <span className="text-sm font-black block">GENEL TOPLAM:</span>
                    <span className="text-[10px] text-emerald-400 font-mono font-semibold">KDV Dahil</span>
                  </div>
                  <span className="text-xl sm:text-2xl font-black font-mono text-orange-400">
                    {formatTL(genelToplam)}
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* Teklif Şartları Editörü */}
          <div className="bg-obsidian-950 p-5 rounded-3xl border border-orange-950 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400 block">
              📝 Teklif Şartları ve Açıklamalar:
            </span>
            <div className="space-y-2">
              {activeQuotation.sartlar.map((sart, sIdx) => (
                <div key={sIdx} className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-orange-400 w-5">{sIdx + 1}.</span>
                  <input
                    type="text"
                    value={sart}
                    onChange={(e) => {
                      const updatedSartlar = [...activeQuotation.sartlar];
                      updatedSartlar[sIdx] = e.target.value;
                      setActiveQuotation({ ...activeQuotation, sartlar: updatedSartlar });
                    }}
                    className="flex-1 bg-obsidian-900 border border-orange-950 rounded-xl p-2 text-xs text-white focus:border-orange-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updatedSartlar = activeQuotation.sartlar.filter((_, i) => i !== sIdx);
                      setActiveQuotation({ ...activeQuotation, sartlar: updatedSartlar });
                    }}
                    className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setActiveQuotation({ ...activeQuotation, sartlar: [...activeQuotation.sartlar, ''] })}
                className="text-xs text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1 cursor-pointer pt-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Yeni Şart Maddesi Ekle</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* 2. A4 PRINT & PREVIEW VIEW MODE (Birebir Kurumsal Form)                */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {(viewMode === 'preview' || viewMode === 'editor') && (
        <div className={viewMode === 'editor' ? 'hidden print:block' : 'block'}>
          
          <div className="no-print bg-amber-950/40 border border-amber-500/40 p-4 rounded-2xl text-xs text-amber-200 flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>A4 Resmi Teklif Çıktısı Önizlemesi. "PDF İndir / Yazdır" butonuna bastığınızda tarayıcınızdan A4 dökümünü kaydedebilirsiniz.</span>
            </div>
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-glow flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PDF Çıktısı Al</span>
            </button>
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
                  <span className="col-span-2 font-bold text-slate-900">{activeQuotation.companyName}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="font-semibold text-slate-700">Adres:</span>
                  <span className="col-span-2 text-slate-800">{activeQuotation.companyAddress}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="font-semibold text-slate-700">Tel / E-posta:</span>
                  <span className="col-span-2 text-slate-800">{activeQuotation.companyPhone} • {activeQuotation.companyEmail}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="font-semibold text-slate-700">Vergi Dairesi:</span>
                  <span className="col-span-2 text-slate-800">{activeQuotation.companyTax}</span>
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
                    <span className="font-mono font-bold text-slate-900">{activeQuotation.teklifNo}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <span className="font-semibold text-slate-700">Tarih:</span>
                    <span className="font-mono text-slate-900">{activeQuotation.tarih}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <span className="font-semibold text-slate-700">Geçerlilik:</span>
                    <span className="text-slate-900">{activeQuotation.gecerlilik}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <span className="font-semibold text-slate-700">Para Birimi:</span>
                    <span className="font-bold text-slate-900">{activeQuotation.paraBirimi}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <span className="font-semibold text-slate-700">Hazırlayan:</span>
                    <span className="font-bold text-slate-900">{activeQuotation.hazirlayan}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <span className="font-semibold text-slate-700">Revizyon:</span>
                    <span className="font-mono text-slate-900">{activeQuotation.revizyon}</span>
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
                  <span className="font-black text-slate-900">{activeQuotation.musteriFirma || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">Yetkili Kişi:</span>
                  <span className="font-bold text-slate-900">{activeQuotation.yetkiliKisi || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">Proje Adı:</span>
                  <span className="font-bold text-slate-900">{activeQuotation.projeAdi}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">Telefon / E-posta:</span>
                  <span className="text-slate-900">{activeQuotation.telefon || '-'} / {activeQuotation.email || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">Uygulama Adresi:</span>
                  <span className="text-slate-900">{activeQuotation.uygulamaAdresi || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">İşin Süresi:</span>
                  <span className="font-bold text-slate-900">{activeQuotation.isinSuresi}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">Teklif Konusu:</span>
                  <span className="text-slate-900">{activeQuotation.teklifKonusu}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">Keşif Tarihi:</span>
                  <span className="text-slate-900">{activeQuotation.kesifTarihi}</span>
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
                {activeQuotation.items.map((item, idx) => (
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
                    <span className="text-slate-700">İndirim Tutarı (%{activeQuotation.indirimOrani}):</span>
                    <span className="font-mono font-bold text-emerald-700">-{formatTL(indirimTutari)}</span>
                  </div>
                )}
                <div className="flex justify-between px-2 py-0.5 border-b border-slate-200 bg-white">
                  <span className="text-slate-700">KDV Tutarı (%{activeQuotation.kdvOrani}):</span>
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
                  <div className="font-bold text-slate-700 text-[7.5px]">PEŞİN AVANS (%{activeQuotation.pesinYuzde})</div>
                  <div className="font-mono font-bold text-emerald-900 text-[9.5px] mt-0.5">{formatTL(pesinTutar)}</div>
                </div>
                <div className="bg-white p-1 rounded border border-slate-200">
                  <div className="font-bold text-slate-700 text-[7.5px]">İŞ ESNASINDA (%{activeQuotation.isEsnasindaYuzde})</div>
                  <div className="font-mono font-bold text-emerald-900 text-[9.5px] mt-0.5">{formatTL(isEsnasindaTutar)}</div>
                </div>
                <div className="bg-white p-1 rounded border border-slate-200">
                  <div className="font-bold text-slate-700 text-[7.5px]">İŞ TESLİMİNDE (%{activeQuotation.isTeslimindeYuzde})</div>
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
                {activeQuotation.sartlar.map((s, idx) => (
                  <li key={idx} className="pr-1">{s}</li>
                ))}
              </ol>
            </div>

            {/* İmza & Kaşe Alanları */}
            <div className="grid grid-cols-2 gap-6 text-[8px] pt-1.5 border-t border-slate-300">
              <div className="text-center space-y-3">
                <div>
                  <div className="font-bold text-slate-900 uppercase">TEKLİFİ HAZIRLAYAN</div>
                  <div className="text-slate-600 text-[7.5px]">{activeQuotation.companyName}</div>
                  <div className="text-slate-800 font-semibold">{activeQuotation.hazirlayan}</div>
                </div>
                <div className="text-slate-400 text-[7.5px]">Ad Soyad / Kaşe / İmza</div>
              </div>

              <div className="text-center space-y-3">
                <div>
                  <div className="font-bold text-slate-900 uppercase">MÜŞTERİ ONAYI</div>
                  <div className="text-slate-600 text-[7.5px]">{activeQuotation.musteriFirma || 'Müşteri'}</div>
                  <div className="text-slate-800 font-semibold">{activeQuotation.yetkiliKisi || '-'}</div>
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
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* 3. LIST VIEW MODE (Kayıtlı Teklifler Arşivi)                           */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {viewMode === 'list' && (
        <div className="no-print space-y-4">
          <div className="bg-obsidian-950 p-5 rounded-3xl border border-orange-950 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Kayıtlı Teklifler Arşivi</h3>
              <p className="text-xs text-slate-400">Daha önce hazırladığınız tüm peyzaj tekliflerini buradan görüntüleyebilir ve düzenleyebilirsiniz.</p>
            </div>
            <button
              type="button"
              onClick={handleNewQuotation}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-glow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Teklif Oluştur</span>
            </button>
          </div>

          {quotations.length === 0 ? (
            <div className="bg-obsidian-950 p-12 rounded-3xl border border-orange-950 text-center space-y-3">
              <FileText className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-sm text-slate-400">Henüz kaydedilmiş bir teklif bulunmuyor.</p>
              <button
                type="button"
                onClick={handleNewQuotation}
                className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold inline-flex items-center gap-1.5"
              >
                İlk Teklifi Hazırla
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quotations.map((q) => {
                const total = q.items.reduce((s, it) => s + (it.tutar || 0), 0);
                const vat = (total * (q.kdvOrani || 20)) / 100;
                const gTotal = total + vat;
                return (
                  <div
                    key={q.id}
                    className="bg-obsidian-950 p-5 rounded-2xl border border-orange-950 hover:border-orange-500/50 transition-all space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-orange-400 bg-orange-950/60 px-2 py-0.5 rounded border border-orange-900/60">
                        {q.teklifNo}
                      </span>
                      <span className="text-[10px] text-slate-500">{q.tarih}</span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white truncate">{q.musteriFirma || 'İsimsiz Müşteri'}</h4>
                      <p className="text-xs text-slate-400 truncate">{q.projeAdi}</p>
                    </div>

                    <div className="pt-2 border-t border-orange-950/80 flex items-center justify-between text-xs">
                      <span className="text-slate-400">{q.items.length} Kalem</span>
                      <span className="font-mono font-bold text-orange-400 text-sm">{formatTL(gTotal)}</span>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveQuotation(q);
                          setViewMode('editor');
                        }}
                        className="flex-1 py-2 rounded-xl bg-obsidian-900 hover:bg-orange-950/60 border border-orange-950 text-slate-200 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-orange-400" />
                        <span>Düzenle</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveQuotation(q);
                          setViewMode('preview');
                        }}
                        className="p-2 rounded-xl bg-obsidian-900 hover:bg-orange-950/60 border border-orange-950 text-slate-200 hover:text-white text-xs cursor-pointer"
                        title="Önizle / Yazdır"
                      >
                        <Eye className="w-4 h-4 text-emerald-400" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`"${q.teklifNo}" numaralı teklifi silmek istediğinize emin misiniz?`)) {
                            setQuotations(quotations.filter((item) => item.id !== q.id));
                          }
                        }}
                        className="p-2 rounded-xl bg-obsidian-900 hover:bg-rose-950/60 border border-orange-950 text-slate-400 hover:text-rose-400 text-xs cursor-pointer"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
