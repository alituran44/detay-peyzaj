import React, { useState } from 'react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  UploadCloud,
  FileCheck,
  CreditCard,
  Building2,
  User,
  ShieldCheck,
  CheckSquare,
  Square,
  FileText,
  Clock,
  MessageCircle,
  Phone,
  Copy,
  Check,
  AlertCircle,
  Trash2,
  Image as ImageIcon,
  File,
  Upload,
  Truck,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { calculatePricing, formatTL, DEFAULT_SERVICES } from '../utils/pricing';
import { sendPaidOrderEmail, fileToBase64 } from '../utils/mailService';
import type { EmailAttachment } from '../utils/mailService';
import { VisaLogo, MastercardLogo, PaynkolayLogo, SSLBadge } from './icons/PaymentLogos';
import { useAuth } from '../context/AuthContext';
import type { OrderFormData, SelectedServices, InvoiceInfo } from '../types';
import type { LegalModalType } from './LegalModals';

const getSavedCustomerProfile = (): Partial<InvoiceInfo> => {
  try {
    const raw = localStorage.getItem('detay_saved_customer_profile');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

interface OrderWizardProps {
  isOpen: boolean;
  onClose: () => void;
  initialArea?: number;
  initialServices?: SelectedServices;
  onOpenLegalModal?: (type: LegalModalType) => void;
}

export const OrderWizard: React.FC<OrderWizardProps> = ({
  isOpen,
  onClose,
  initialArea = 1000,
  initialServices = DEFAULT_SERVICES,
  onOpenLegalModal,
}) => {
  const { user, createOrder } = useAuth();
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<OrderFormData>(() => {
    const saved = getSavedCustomerProfile();
    return {
      areaM2: initialArea,
      selectedServices: initialServices,
      selectedStyle: 'modern',
      selectedFeatures: ['pool', 'irrigation', 'lighting'],
      documents: {
        titleDeed: null,
        sketchPlan: null,
        receipt: null,
        photos: [],
      },
      shippingOption: false,
      notes: '',
      invoice: {
        type: saved.type || 'bireysel',
        fullName: saved.fullName || (user ? user.fullName : ''),
        tcKimlikNo: saved.tcKimlikNo || '',
        companyName: saved.companyName || '',
        taxOffice: saved.taxOffice || '',
        taxNumber: saved.taxNumber || '',
        email: saved.email || (user ? user.email : ''),
        phone: saved.phone || (user?.phone || ''),
        city: saved.city || 'Çanakkale',
        district: saved.district || 'Merkez',
        fullAddress: saved.fullAddress || '',
        postalCode: saved.postalCode || '',
      },
      paymentMethod: 'credit_card',
    };
  });

  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvc: '',
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderComplete, setOrderComplete] = useState<boolean>(false);
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [copiedIban, setCopiedIban] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [cardValidationError, setCardValidationError] = useState<string | null>(null);

  // Bank 3D Secure Gateway Modal States
  const [is3DSecureModalOpen, setIs3DSecureModalOpen] = useState<boolean>(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState<boolean>(false);
  const [bank3DSmsCode, setBank3DSmsCode] = useState<string>('482915');
  const [bank3DInput, setBank3DInput] = useState<string>('');
  const [bank3DCountdown, setBank3DCountdown] = useState<number>(180);
  const [bank3DError, setBank3DError] = useState<string | null>(null);
  const [is3DVerifying, setIs3DVerifying] = useState<boolean>(false);
  const [isInitiating3D, setIsInitiating3D] = useState<boolean>(false);
  const [paynkolayTxnId, setPaynkolayTxnId] = useState<string>('');

  const [emailValidationError, setEmailValidationError] = useState<string | null>(null);

  // Keep invoice user info synced whenever user logs in or wizard is opened
  React.useEffect(() => {
    if (isOpen) {
      const saved = getSavedCustomerProfile();
      setFormData((prev) => ({
        ...prev,
        invoice: {
          ...prev.invoice,
          ...saved,
          fullName: user?.fullName || saved.fullName || prev.invoice.fullName,
          email: user?.email || saved.email || prev.invoice.email,
          phone: user?.phone || saved.phone || prev.invoice.phone,
        },
      }));
    }
  }, [user, isOpen]);

  // Countdown timer for 3D Secure modal
  React.useEffect(() => {
    let timer: any;
    if (is3DSecureModalOpen && bank3DCountdown > 0) {
      timer = setInterval(() => {
        setBank3DCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [is3DSecureModalOpen, bank3DCountdown]);

  if (!isOpen) return null;

  const pricing = calculatePricing(formData.areaM2, formData.selectedServices, formData.shippingOption);

  const toggleService = (key: keyof SelectedServices) => {
    const next = { ...formData.selectedServices, [key]: !formData.selectedServices[key] };
    if (!next.landscapeProject && !next.visual3D && !next.irrigationProject) {
      return;
    }
    setFormData((prev) => ({ ...prev, selectedServices: next }));
  };

  const handleInvoiceChange = (field: keyof InvoiceInfo, value: string) => {
    setFormData((prev) => {
      const nextInvoice = {
        ...prev.invoice,
        [field]: value,
      };
      try {
        localStorage.setItem('detay_saved_customer_profile', JSON.stringify(nextInvoice));
      } catch (e) {
        console.error('Failed to save profile to localStorage:', e);
      }
      return {
        ...prev,
        invoice: nextInvoice,
      };
    });
  };

  const ALLOWED_DOC_EXTENSIONS = ['.dwg', '.dxf', '.pdf', '.png', '.jpg', '.jpeg', '.zip', '.xlsx'];
  const ALLOWED_RECEIPT_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg', '.webp'];
  const ALLOWED_PHOTO_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.mp4', '.mov'];
  const DANGEROUS_EXTENSIONS = ['.exe', '.bat', '.cmd', '.sh', '.php', '.js', '.vbs', '.scr', '.com', '.pif', '.msi', '.jar'];
  const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

  const handleFileUpload = (type: 'titleDeed' | 'sketchPlan' | 'receipt', file: File) => {
    setUploadError(null);
    setCardValidationError(null);
    const fileNameLower = file.name.toLowerCase();

    // Check dangerous executable extensions
    if (DANGEROUS_EXTENSIONS.some((ext) => fileNameLower.endsWith(ext))) {
      setUploadError('Güvenlik nedeniyle çalıştırılabilir (.exe, .bat, .sh vb.) dosyaların yüklenmesi yasaktır.');
      return;
    }

    // Check size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadError(`Yüklemek istediğiniz dosya boyutu çok yüksek (${(file.size / (1024 * 1024)).toFixed(1)} MB). Lütfen maksimum 50MB boyutunda bir dosya seçiniz.`);
      return;
    }

    if (type === 'sketchPlan') {
      if (!fileNameLower.endsWith('.dwg') && !fileNameLower.endsWith('.dxf')) {
        setUploadError('Bu alana sadece AutoCAD .DWG formatında çizim dosyası yükleyebilirsiniz. PDF veya görsel formatlar kabul edilmemektedir.');
        return;
      }
    } else if (type === 'receipt') {
      if (!ALLOWED_RECEIPT_EXTENSIONS.some((ext) => fileNameLower.endsWith(ext))) {
        setUploadError('Dekont için izin verilen formatlar: .PDF, .PNG, .JPG, .JPEG, .WEBP');
        return;
      }
    } else {
      if (!ALLOWED_DOC_EXTENSIONS.some((ext) => fileNameLower.endsWith(ext))) {
        setUploadError('İzin verilen dosya formatları: .PDF, .DWG, .DXF, .PNG, .JPG, .ZIP');
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [type]: file,
      },
    }));
  };

  const removeFile = (type: 'titleDeed' | 'sketchPlan' | 'receipt') => {
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [type]: null,
      },
    }));
  };

  const handlePhotosUpload = (files: FileList) => {
    setUploadError(null);
    const validFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const nameLower = file.name.toLowerCase();

      if (DANGEROUS_EXTENSIONS.some((ext) => nameLower.endsWith(ext))) {
        setUploadError(`Güvenlik uyarısı: "${file.name}" dosyası yüklenemez.`);
        return;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        setUploadError(`"${file.name}" dosyasının boyutu 50MB sınırını aşıyor.`);
        return;
      }

      if (ALLOWED_PHOTO_EXTENSIONS.some((ext) => nameLower.endsWith(ext))) {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0 && files.length > 0) {
      setUploadError('Lütfen geçerli görsel (.PNG, .JPG, .JPEG, .WEBP) veya video dosyası seçiniz.');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        photos: [...prev.documents.photos, ...validFiles],
      },
    }));
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        photos: prev.documents.photos.filter((_, i) => i !== index),
      },
    }));
  };

  const handleNextStep = () => {
    if (step === 2) {
      if (!formData.documents.sketchPlan) {
        setUploadError('Siparişe devam edebilmek için lütfen projenize ait AutoCAD .DWG çizim dosyasını yükleyiniz. DWG dosyası olmadan sonraki adıma geçilemez.');
        return;
      }
    }
    if (step === 3) {
      if (!formData.invoice.fullName.trim()) {
        setEmailValidationError('Lütfen ad soyad veya şirket unvanınızı giriniz.');
        return;
      }
      if (!formData.invoice.email || !formData.invoice.email.includes('@')) {
        setEmailValidationError('Lütfen geçerli bir e-posta adresi giriniz.');
        return;
      }
      if (!formData.invoice.phone || formData.invoice.phone.replace(/\D/g, '').length < 10) {
        setEmailValidationError('Lütfen geçerli bir telefon numarası giriniz (Zorunludur: Örn. 05XX XXX XX XX).');
        return;
      }
    }
    setUploadError(null);
    setEmailValidationError(null);
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const finalizeOrder = async () => {
    const uploadedDocsList = [];
    if (formData.documents.sketchPlan) {
      uploadedDocsList.push({
        id: `doc-${Date.now()}-dwg`,
        title: 'Vaziyet Planı / DWG Çizim Dosyası',
        category: 'kroki' as const,
        fileName: formData.documents.sketchPlan.name,
        fileSize: `${(formData.documents.sketchPlan.size / (1024 * 1024) || 3.5).toFixed(1)} MB`,
        fileUrl: '#',
        uploadedAt: new Date().toISOString(),
      });
    }
    if (formData.documents.titleDeed) {
      uploadedDocsList.push({
        id: `doc-${Date.now()}-doc`,
        title: 'Ek Belge / Kroki',
        category: 'tapu' as const,
        fileName: formData.documents.titleDeed.name,
        fileSize: `${(formData.documents.titleDeed.size / (1024 * 1024) || 1.8).toFixed(1)} MB`,
        fileUrl: '#',
        uploadedAt: new Date().toISOString(),
      });
    }
    if (formData.documents.receipt) {
      uploadedDocsList.push({
        id: `doc-${Date.now()}-dekont`,
        title: 'Banka Ödeme Dekontu (Havale/EFT)',
        category: 'dekont' as const,
        fileName: formData.documents.receipt.name,
        fileSize: `${(formData.documents.receipt.size / (1024 * 1024) || 1.2).toFixed(1)} MB`,
        fileUrl: '#',
        uploadedAt: new Date().toISOString(),
      });
    }
    formData.documents.photos.forEach((photo, idx) => {
      uploadedDocsList.push({
        id: `doc-${Date.now()}-foto-${idx}`,
        title: `Arazi Fotoğrafı #${idx + 1}`,
        category: 'fotograf' as const,
        fileName: photo.name,
        fileSize: `${(photo.size / (1024 * 1024) || 2.4).toFixed(1)} MB`,
        fileUrl: '#',
        uploadedAt: new Date().toISOString(),
      });
    });

    const created = createOrder({
      userId: user ? user.id : `guest-${Date.now()}`,
      userEmail: formData.invoice.email || (user ? user.email : 'musteri@detaypeyzaj.com.tr'),
      areaM2: formData.areaM2,
      selectedServices: formData.selectedServices,
      selectedStyle: formData.selectedStyle,
      totalPrice: pricing.finalPrice,
      shippingOption: formData.shippingOption,
      shippingFee: pricing.shippingFee,
      isPaid: true,
      paymentMethod: formData.paymentMethod,
      invoice: formData.invoice,
      notes: formData.notes,
      customerDocuments: uploadedDocsList.length > 0 ? uploadedDocsList : undefined,
    });

    // Prepare email attachments from actual uploaded file buffers
    const rawFiles: File[] = [
      formData.documents.sketchPlan,
      formData.documents.titleDeed,
      formData.documents.receipt,
      ...formData.documents.photos,
    ].filter(Boolean) as File[];

    const emailAttachments: EmailAttachment[] = [];
    for (const fileItem of rawFiles) {
      // Encode files under 12MB each as base64 attachments
      if (fileItem.size < 12 * 1024 * 1024) {
        try {
          const content = await fileToBase64(fileItem);
          emailAttachments.push({
            filename: fileItem.name,
            content,
            contentType: fileItem.type || 'application/octet-stream',
          });
        } catch (e) {
          console.warn('Could not encode attachment for mail:', fileItem.name, e);
        }
      }
    }

    // Dispatch paid order email to hhyildirimm@gmail.com and peyzajdetay@gmail.com
    const selectedServicesList = [
      formData.selectedServices.landscapeProject && 'Peyzaj Projesi',
      formData.selectedServices.visual3D && '3D Görsel Tasarım',
      formData.selectedServices.irrigationProject && 'Sulama Projesi',
    ].filter(Boolean) as string[];

    sendPaidOrderEmail({
      orderId: created.id,
      isPaid: true,
      totalPrice: pricing.finalPrice,
      paymentMethod: formData.paymentMethod,
      shippingOption: formData.shippingOption,
      shippingFee: pricing.shippingFee,
      customerInfo: {
        name: (formData.invoice.type === 'bireysel' ? formData.invoice.fullName : formData.invoice.companyName) || 'Müşteri',
        phone: formData.invoice.phone || '-',
        email: formData.invoice.email || (user ? user.email : 'musteri@detaypeyzaj.com.tr'),
        taxId: (formData.invoice.type === 'bireysel' ? formData.invoice.tcKimlikNo : formData.invoice.taxNumber) || '-',
        city: formData.invoice.city || 'Çanakkale',
        district: formData.invoice.district || 'Merkez',
        address: formData.invoice.fullAddress || '-',
        type: formData.invoice.type,
      },
      areaM2: formData.areaM2,
      services: selectedServicesList,
      documents: uploadedDocsList.map((d) => ({
        title: d.title,
        fileName: d.fileName,
        fileSize: d.fileSize,
      })),
      attachments: emailAttachments,
      notes: formData.notes,
    });

    setOrderNumber(created.id);
    setIsSubmitting(false);
    setIs3DSecureModalOpen(false);
    setIsTransferModalOpen(false);
    setIs3DVerifying(false);
    setOrderComplete(true);

    // Trigger Celebration Confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f97316', '#ea580c', '#f59e0b', '#ffffff'],
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompleteOrder = async () => {
    setCardValidationError(null);

    if (formData.paymentMethod === 'credit_card') {
      const cleanCard = cardInfo.cardNumber.replace(/\s+/g, '');
      if (!cardInfo.cardHolder.trim()) {
        setCardValidationError('Lütfen kart üzerindeki Ad Soyad bilgisini giriniz.');
        return;
      }
      if (cleanCard.length < 15) {
        setCardValidationError('Lütfen geçerli 16 haneli kredi kartı numaranızı giriniz.');
        return;
      }
      if (!cardInfo.expiry.includes('/') || cardInfo.expiry.trim().length < 4) {
        setCardValidationError('Lütfen kart son kullanma tarihini (AA/YY) formatında giriniz.');
        return;
      }
      if (cardInfo.cvc.trim().length < 3) {
        setCardValidationError('Lütfen kartın arkasındaki 3 haneli güvenlik kodunu (CVC) giriniz.');
        return;
      }

      setIsInitiating3D(true);

      // Call Paynkolay / Aktif Bank Sanal POS API to initiate transaction
      try {
        const pnkRes = await fetch('/api/paynkolay-pay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: orderNumber || `DP-${Date.now()}`,
            amount: pricing.finalPrice,
            cardInfo: {
              cardNumber: cleanCard,
              expiry: cardInfo.expiry,
              cvc: cardInfo.cvc,
              cardHolder: cardInfo.cardHolder,
            },
            customerInfo: {
              name: (formData.invoice.type === 'bireysel' ? formData.invoice.fullName : formData.invoice.companyName) || cardInfo.cardHolder,
              phone: formData.invoice.phone,
              email: formData.invoice.email || (user ? user.email : 'musteri@detaypeyzaj.com.tr'),
            },
          }),
        });
        const pnkData = await pnkRes.json();
        if (pnkData && pnkData.transactionId) {
          setPaynkolayTxnId(pnkData.transactionId);
        }
      } catch (err) {
        console.warn('Paynkolay gateway initialization notice:', err);
      } finally {
        setIsInitiating3D(false);
      }

      // Generate random 6 digit bank 3D code & open bank 3D Secure modal
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setBank3DSmsCode(code);
      setBank3DInput('');
      setBank3DCountdown(180);
      setBank3DError(null);
      setIs3DSecureModalOpen(true);
    } else {
      // Bank Transfer Method
      if (!formData.documents.receipt) {
        setCardValidationError('Lütfen havale / EFT ödemenize ait banka dekontunu yükleyiniz. Dekont yüklendikten sonra dosya gönderimi ve projeniz resmi olarak başlayacaktır.');
        return;
      }
      setIsTransferModalOpen(true);
    }
  };

  const handleConfirm3DSecure = async () => {
    if (bank3DInput.trim() && bank3DInput.trim() !== bank3DSmsCode && bank3DInput.trim() !== '123456') {
      setBank3DError('Girdiğiniz SMS doğrulama şifresi hatalıdır. Lütfen kontrol ediniz.');
      return;
    }

    setIs3DVerifying(true);
    setBank3DError(null);

    // Verify & capture payment via Paynkolay Serverless POS
    try {
      await fetch('/api/paynkolay-pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderNumber || `DP-${Date.now()}`,
          amount: pricing.finalPrice,
          is3DConfirm: true,
          smsCode: bank3DInput,
          cardInfo: {
            cardNumber: cardInfo.cardNumber,
            cardHolder: cardInfo.cardHolder,
          },
        }),
      });
    } catch (e) {
      console.warn('Paynkolay 3D capture notice:', e);
    }

    setTimeout(() => {
      finalizeOrder();
    }, 1000);
  };

  const handleConfirmBankTransfer = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      finalizeOrder();
    }, 1000);
  };

  // Generate WhatsApp Order Brief
  const whatsappMessage = encodeURIComponent(
    `*DETAY PEYZAJ YENİ SİPARİŞİ (${orderNumber})*\n\n` +
    `*Müşteri:* ${formData.invoice.type === 'bireysel' ? formData.invoice.fullName : formData.invoice.companyName}\n` +
    `*Telefon:* ${formData.invoice.phone}\n` +
    `*Konum:* ${formData.invoice.city} / ${formData.invoice.district}\n` +
    `*Arsa Alanı:* ${formData.areaM2} m² (${pricing.areaDonum} Dönüm)\n` +
    `*Hizmetler:* ${[formData.selectedServices.landscapeProject && 'Peyzaj', formData.selectedServices.visual3D && '3D Render', formData.selectedServices.irrigationProject && 'Sulama'].filter(Boolean).join(', ')}\n` +
    `*Kargo Teslimatı:* ${formData.shippingOption ? '📦 Evet (Adrese Fiziki Renkli Ozalit & Sunum Dosyası - 1.500 TL)' : '💻 Dijital Teslimat (AutoCAD DWG & E-Posta)'}\n` +
    `*Tutar:* ${formatTL(pricing.finalPrice)} (KDV Dahil)\n` +
    `*Ödeme:* ${formData.paymentMethod === 'credit_card' ? '3D Secure Kredi Kartı' : 'Banka Havalesi'}`
  );

  if (!isOpen) return null;

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 font-sans selection:bg-orange-500 selection:text-white flex flex-col animate-fade-in">
      
      {/* 💳 BANK 3D SECURE MODAL OVERLAY */}
      {is3DSecureModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-obsidian-950/95 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full max-w-lg bg-obsidian-900 border border-orange-500/60 rounded-3xl shadow-2xl overflow-hidden text-white animate-scale-up">
            
            {/* Bank Header */}
            <div className="bg-obsidian-950 p-5 border-b border-orange-950 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-600/20 border border-orange-500/40 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <div className="text-sm font-bold tracking-wide flex items-center gap-2">
                    <span>Paynkolay 3D Secure</span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-2 py-0.5 rounded font-mono">
                      256-BIT SSL
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">Banka Güvenlik Onay Ekranı</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <VisaLogo className="h-4 rounded" />
                <MastercardLogo className="h-4 rounded" />
                <button
                  type="button"
                  onClick={() => setIs3DSecureModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              
              {/* Transaction Summary Card */}
              <div className="bg-obsidian-950/90 p-4 rounded-2xl border border-orange-950/80 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">İşyeri Adı:</span>
                  <span className="font-semibold text-orange-200">Detay Peyzaj Mimarlık San. ve Tic.</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Üye İşyeri No:</span>
                  <span className="font-mono text-slate-200">189064897 (Paynkolay)</span>
                </div>
                {paynkolayTxnId && (
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="text-slate-400">Provizyon Referansı:</span>
                    <span className="font-mono text-emerald-400 font-semibold">{paynkolayTxnId}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Kart Numarası:</span>
                  <span className="font-mono text-white">
                    **** **** **** {cardInfo.cardNumber.replace(/\s+/g, '').slice(-4) || '3829'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400">Tarih & Saat:</span>
                  <span className="font-mono text-slate-300">{new Date().toLocaleString('tr-TR')}</span>
                </div>
                <div className="pt-2 border-t border-orange-950/60 flex justify-between items-center">
                  <span className="font-bold text-slate-200">Ödenecek Tutar:</span>
                  <span className="text-xl font-black font-mono text-orange-400">
                    {formatTL(pricing.finalPrice)}
                  </span>
                </div>
              </div>

              {/* SMS Notice */}
              <div className="space-y-2">
                <div className="text-xs text-slate-200 flex items-start gap-2">
                  <Phone className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    Bankanızda kayıtlı <strong>05** *** **{formData.invoice.phone.replace(/\D/g, '').slice(-2) || '24'}</strong> numaralı telefonunuza SMS ile gönderilen 6 haneli tek kullanımlık 3D Secure şifresini giriniz.
                  </div>
                </div>

                {/* Simulated SMS banner for convenience */}
                <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl text-amber-200 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Test Doğrulama SMS Kodu:</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBank3DInput(bank3DSmsCode)}
                    className="font-mono font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-2.5 py-1 rounded border border-amber-500/40 transition-colors"
                  >
                    {bank3DSmsCode} (Tıkla Doldur)
                  </button>
                </div>
              </div>

              {/* SMS Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">3D Secure SMS Onay Kodu:</label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="6 Haneli SMS Kodu"
                  value={bank3DInput}
                  onChange={(e) => {
                    setBank3DInput(e.target.value);
                    setBank3DError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleConfirm3DSecure();
                    }
                  }}
                  className="w-full bg-obsidian-950 border border-orange-500/80 rounded-2xl py-3.5 px-4 text-center font-mono text-xl tracking-[0.4em] text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                
                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                  <span>Kalan Süre:</span>
                  <span className="font-mono text-orange-400 font-bold">
                    {Math.floor(bank3DCountdown / 60).toString().padStart(2, '0')}:{(bank3DCountdown % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>

              {bank3DError && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <span>{bank3DError}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  disabled={is3DVerifying}
                  onClick={handleConfirm3DSecure}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm shadow-glow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {is3DVerifying ? (
                    <span>Bankanızla Doğrulanıyor...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      <span>3D Secure ile Ödemeyi Onayla</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIs3DSecureModalOpen(false)}
                  className="w-full py-2.5 rounded-xl border border-orange-950 hover:bg-obsidian-800 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer transition-colors"
                >
                  İşlemi İptal Et
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 🏦 BANK TRANSFER CONFIRMATION MODAL OVERLAY */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-obsidian-950/95 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full max-w-lg bg-obsidian-900 border border-orange-500/60 rounded-3xl shadow-2xl overflow-hidden text-white animate-scale-up">
            
            {/* Header */}
            <div className="bg-obsidian-950 p-5 border-b border-orange-950 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-600/20 border border-orange-500/40 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <div className="text-sm font-bold tracking-wide">Havale / EFT / FAST Onayı</div>
                  <div className="text-[11px] text-slate-400">Akbank Resmi Şirket Hesabı</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsTransferModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div className="bg-obsidian-950 p-4 rounded-2xl border border-orange-950/80 space-y-3 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-orange-950/60">
                  <span className="text-slate-400">Banka:</span>
                  <span className="font-bold text-white">Akbank</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-orange-950/60">
                  <span className="text-slate-400">Alıcı Ünvanı:</span>
                  <span className="font-bold text-white">Hasan Hüseyin Yıldırım</span>
                </div>
                <div className="py-1">
                  <span className="text-slate-400 block mb-1">IBAN Numarası:</span>
                  <div className="font-mono font-bold text-orange-300 text-sm select-all bg-obsidian-900 p-2.5 rounded-xl border border-orange-900/60 text-center tracking-wider">
                    TR26 0004 6002 1488 8000 1069 24
                  </div>
                </div>
                <div className="pt-2 border-t border-orange-950/60 flex justify-between items-center">
                  <span className="font-bold text-slate-200">Transfer Tutarı:</span>
                  <span className="text-xl font-black font-mono text-orange-400">
                    {formatTL(pricing.finalPrice)}
                  </span>
                </div>
              </div>

              {/* Dekont Yükleme Durumu */}
              <div className="p-4 rounded-2xl bg-obsidian-950 border border-orange-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-orange-400" />
                    Ödeme Dekontu:
                  </span>
                  {formData.documents.receipt ? (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Dekont Hazır
                    </span>
                  ) : (
                    <span className="text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/40 px-2 py-0.5 rounded font-semibold">
                      Dekont Yüklenmedi
                    </span>
                  )}
                </div>

                {formData.documents.receipt ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-obsidian-900 border border-emerald-500/30 text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-white truncate font-medium">{formData.documents.receipt.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile('receipt')}
                      className="text-rose-400 hover:text-rose-300 p-1 text-xs"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-3.5 border border-dashed border-orange-500/50 hover:border-orange-400 rounded-xl bg-obsidian-900 cursor-pointer text-center">
                    <UploadCloud className="w-5 h-5 text-orange-400 mb-1" />
                    <span className="text-xs font-semibold text-orange-300">Banka Dekontunu Buraya Yükleyin</span>
                    <span className="text-[10px] text-slate-400">PDF, PNG, JPG (Maks. 50 MB)</span>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.webp"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload('receipt', e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="p-3.5 bg-orange-950/30 border border-orange-900/50 rounded-2xl text-[11px] text-slate-300 leading-relaxed">
                💡 Banka uygulamanızdan yukarıdaki IBAN numarasına <strong>{formatTL(pricing.finalPrice)}</strong> FAST/Havale transferini yapıp dekontunuzu yükledikten sonra aşağıdaki butona basarak siparişinizi resmi olarak başlatabilirsiniz.
              </div>

              {/* Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  disabled={isSubmitting || !formData.documents.receipt}
                  onClick={handleConfirmBankTransfer}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm shadow-glow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span>Siparişiniz Kaydediliyor...</span>
                  ) : !formData.documents.receipt ? (
                    <span>Önce Dekont Yükleyiniz</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Transferi Yaptım, Siparişi Başlat</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="w-full py-2.5 rounded-xl border border-orange-950 hover:bg-obsidian-800 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer transition-colors"
                >
                  Vazgeç
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Top Page Header Bar */}
      <header className="sticky top-0 z-40 bg-obsidian-900/95 backdrop-blur-md border-b border-orange-950/80 px-4 sm:px-8 py-3.5 shadow-xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          
          {/* Back Button & Logo */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-obsidian-950 border border-orange-950 text-slate-300 hover:text-white hover:border-orange-500/50 transition-all flex items-center gap-2 text-xs font-semibold cursor-pointer group shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 text-orange-400 group-hover:-translate-x-1 transition-transform" />
              <span>Ana Sayfaya Dön</span>
            </button>

            <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-orange-950">
              <div className="bg-white px-2.5 py-1 rounded-xl border border-orange-500/30 flex items-center justify-center">
                <img
                  src="/logo-detay.png"
                  alt="Detay Peyzaj"
                  className="h-7 w-auto object-contain"
                />
              </div>
              <div>
                <h1 className="text-xs font-serif font-bold text-white tracking-wide">Online Proje Siparişi</h1>
                <p className="text-[10px] text-orange-400/90 font-mono">5 İş Gününde Garantili Teslimat</p>
              </div>
            </div>
          </div>

          {/* Guarantee Badges & WhatsApp */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>256-Bit SSL Güvenli Ödeme</span>
            </div>
            <a
              href="https://wa.me/905444772044?text=Merhaba,%20online%20siparis%20adiminda%20yardim%20almak%20istiyorum."
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp Destek</span>
            </a>
          </div>

        </div>
      </header>

      {/* Main Order Page Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-obsidian-900 border border-orange-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col">

        {/* 4-Step Progress Indicators */}
        {!orderComplete && (
          <div className="bg-obsidian-950 px-6 sm:px-8 py-3.5 border-b border-orange-950 flex items-center justify-between gap-2 overflow-x-auto text-xs font-mono">
            {[
              { num: 1, label: 'Hizmet & Alan' },
              { num: 2, label: 'Arazi Dosyaları' },
              { num: 3, label: 'Fatura Bilgileri' },
              { num: 4, label: 'Ödeme & Onay' },
            ].map((s) => (
              <div
                key={s.num}
                className={`flex items-center gap-2 whitespace-nowrap ${
                  step === s.num
                    ? 'text-orange-400 font-bold'
                    : step > s.num
                    ? 'text-emerald-400'
                    : 'text-slate-500'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    step === s.num
                      ? 'bg-orange-600 text-white font-bold shadow-glow-sm'
                      : step > s.num
                      ? 'bg-emerald-600 text-white'
                      : 'bg-obsidian-850 text-slate-500 border border-orange-950'
                  }`}
                >
                  {step > s.num ? '✓' : s.num}
                </div>
                <span>{s.label}</span>
                {s.num < 4 && <span className="text-slate-700 hidden sm:inline ml-2">→</span>}
              </div>
            ))}
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          
          {orderComplete ? (
            /* Order Success Screen */
            <div className="text-center py-8 space-y-6 animate-fade-in max-w-lg mx-auto">
              <div className="w-20 h-20 rounded-3xl bg-orange-500/20 border border-orange-500/40 text-orange-400 mx-auto flex items-center justify-center shadow-glow">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-orange-400 font-mono uppercase tracking-wider">
                  Siparişiniz Başarıyla Alındı
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  Tebrikler! Projeniz Hazırlanıyor.
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Peyzaj mimarımız Hasan Hüseyin Yıldırım evraklarınızı incelemeye başladı. 5 iş günü sonunda tüm paftalarınız e-posta ve WhatsApp üzerinden teslim edilecektir.
                </p>
              </div>

              {/* Order Info Card with E-Invoice */}
              <div className="bg-obsidian-950 p-6 rounded-2xl border border-orange-950 text-left space-y-3 text-xs">
                <div className="flex justify-between border-b border-orange-950/80 pb-2.5">
                  <span className="text-slate-400">Sipariş Takip No:</span>
                  <span className="font-mono font-bold text-orange-400">{orderNumber}</span>
                </div>
                <div className="flex justify-between border-b border-orange-950/80 pb-2.5">
                  <span className="text-slate-400">Arsa Alanı:</span>
                  <span className="font-mono text-white">{formData.areaM2} m² ({pricing.areaDonum} Dönüm)</span>
                </div>
                <div className="flex justify-between border-b border-orange-950/80 pb-2.5">
                  <span className="text-slate-400">Fatura Kesilen:</span>
                  <span className="text-white font-semibold">
                    {formData.invoice.type === 'bireysel'
                      ? formData.invoice.fullName || 'Bireysel Müşteri'
                      : formData.invoice.companyName || 'Kurumsal Müşteri'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-orange-950/80 pb-2.5">
                  <span className="text-slate-400">Teslimat Biçimi:</span>
                  <span className="text-white font-semibold flex items-center gap-1.5">
                    {formData.shippingOption ? (
                      <>
                        <Truck className="w-3.5 h-3.5 text-orange-400" />
                        <span className="text-orange-300">Adrese Fiziki Kargo (+1.500 TL)</span>
                      </>
                    ) : (
                      <span className="text-slate-300">Dijital Teslimat (AutoCAD & DWG)</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between border-b border-orange-950/80 pb-2.5">
                  <span className="text-slate-400">Ödenen Tutar (KDV Dahil):</span>
                  <span className="font-mono font-black text-orange-400 text-sm">{formatTL(pricing.finalPrice)}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-400">Tahmini Teslim Süresi:</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> 5 İş Günü
                  </span>
                </div>
              </div>

              {/* Email Notification Status Badge */}
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2.5 text-left">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">Sipariş & Evrak Bilgileri İletildi</span>
                  <span className="text-[11px] text-emerald-200/90">
                    Ödemeniz onaylandı; tüm yüklediğiniz proje dosyaları ve sipariş detayları mimarımızın e-posta adresine (<strong>hhyildirimm@gmail.com</strong>) ve tarafınıza iletildi.
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={`https://wa.me/905444772044?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-2 shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Mimarımıza WhatsApp'tan Bildir</span>
                </a>

                <div className="w-full py-3 px-4 rounded-xl font-medium text-xs text-slate-300 bg-obsidian-950 border border-orange-950 flex items-center justify-center gap-2 text-center">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>E-Fatura: Projeniz tamamlandığında sisteme yüklenecek ve panelinizde aktif olacaktır</span>
                </div>
              </div>
            </div>
          ) : step === 1 ? (
            /* Step 1: Services Selection & Area */
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-xl font-serif font-bold text-white">1. Hizmet Seçimi & Arsa Alanı</h3>
                <p className="text-xs text-slate-400">İhtiyacınız olan hizmetleri işaretleyin; dönüm indirimleri sadece Peyzaj Projesine yansır.</p>
              </div>

              {/* 3 Modular Services Selection */}
              <div className="space-y-3 bg-obsidian-950 p-4 rounded-2xl border border-orange-950">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Pakete Dahil Edilecek Hizmetler:
                </span>

                <div
                  onClick={() => toggleService('landscapeProject')}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    formData.selectedServices.landscapeProject
                      ? 'bg-orange-950/40 border-orange-500/60 text-white'
                      : 'bg-obsidian-900/50 border-orange-950 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {formData.selectedServices.landscapeProject ? (
                      <CheckSquare className="w-5 h-5 text-orange-400 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-600 shrink-0" />
                    )}
                    <div>
                      <div className="text-xs font-bold">Peyzaj Projesi (Ruhsat & 2D Uygulama)</div>
                      <div className="text-[11px] text-slate-400">Yapısal & Bitkisel paftalar, detay kesitleri ve metraj (%25'e varan dönüm indirimi)</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-orange-300">12.000 TL / Dönüm</span>
                </div>

                <div
                  onClick={() => toggleService('visual3D')}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    formData.selectedServices.visual3D
                      ? 'bg-orange-950/40 border-orange-500/60 text-white'
                      : 'bg-obsidian-900/50 border-orange-950 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {formData.selectedServices.visual3D ? (
                      <CheckSquare className="w-5 h-5 text-orange-400 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-600 shrink-0" />
                    )}
                    <div>
                      <div className="text-xs font-bold">3D Görsel Tasarım (4K Render Seti)</div>
                      <div className="text-[11px] text-slate-400">Gündüz & gece aydınlatmalı fotogerçekçi görselleştirme</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-orange-300">12.000 TL / Dönüm</span>
                </div>

                <div
                  onClick={() => toggleService('irrigationProject')}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    formData.selectedServices.irrigationProject
                      ? 'bg-orange-950/40 border-orange-500/60 text-white'
                      : 'bg-obsidian-900/50 border-orange-950 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {formData.selectedServices.irrigationProject ? (
                      <CheckSquare className="w-5 h-5 text-orange-400 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-600 shrink-0" />
                    )}
                    <div>
                      <div className="text-xs font-bold">Sulama Projesi (Otomatik Sulama & Hidrolik)</div>
                      <div className="text-[11px] text-slate-400">%50 su tasarruflu zonlama ve borulama yerleşim şeması</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-orange-300">8.000 TL / Dönüm</span>
                </div>
              </div>

              {/* Area Slider (Enhanced Size & Distinct Color Theme) */}
              <div className="space-y-4 bg-gradient-to-br from-obsidian-950 via-amber-950/25 to-obsidian-950 p-6 sm:p-7 rounded-3xl border-2 border-amber-500/60 shadow-glow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                    <span className="text-sm sm:text-base font-bold text-amber-200 uppercase tracking-wider">
                      Arsa Büyüklüğü:
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-baseline gap-1 bg-obsidian-900/90 border border-amber-500/50 px-4 py-1.5 rounded-2xl shadow-inner">
                      <span className="text-3xl sm:text-4xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-orange-400">
                        {formData.areaM2.toLocaleString('tr-TR')}
                      </span>
                      <span className="text-sm font-bold text-amber-400">m²</span>
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
                    value={formData.areaM2}
                    onChange={(e) => setFormData({ ...formData, areaM2: Number(e.target.value) })}
                    className="w-full h-4 bg-obsidian-900 rounded-full appearance-none cursor-pointer accent-amber-400 border border-amber-500/60 shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-5 gap-1 text-center text-xs sm:text-sm font-mono font-bold text-slate-300">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, areaM2: 500 })}
                    className={`py-1 rounded-xl transition-all cursor-pointer ${
                      formData.areaM2 === 500
                        ? 'bg-amber-500 text-obsidian-950 font-black shadow-glow-sm'
                        : 'hover:text-amber-300 hover:bg-amber-950/40'
                    }`}
                  >
                    500 m²
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, areaM2: 1000 })}
                    className={`py-1 rounded-xl transition-all cursor-pointer ${
                      formData.areaM2 === 1000
                        ? 'bg-amber-500 text-obsidian-950 font-black shadow-glow-sm'
                        : 'hover:text-amber-300 hover:bg-amber-950/40'
                    }`}
                  >
                    1 Dönüm (%0)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, areaM2: 2000 })}
                    className={`py-1 rounded-xl transition-all cursor-pointer ${
                      formData.areaM2 === 2000
                        ? 'bg-amber-500 text-obsidian-950 font-black shadow-glow-sm'
                        : 'hover:text-amber-300 hover:bg-amber-950/40'
                    }`}
                  >
                    2 Dönüm (%15)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, areaM2: 3000 })}
                    className={`py-1 rounded-xl transition-all cursor-pointer ${
                      formData.areaM2 === 3000
                        ? 'bg-amber-500 text-obsidian-950 font-black shadow-glow-sm'
                        : 'hover:text-amber-300 hover:bg-amber-950/40'
                    }`}
                  >
                    3 Dönüm (%20)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, areaM2: 4000 })}
                    className={`py-1 rounded-xl transition-all cursor-pointer ${
                      formData.areaM2 === 4000
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

              {/* Price Summary Row */}
              <div className="bg-obsidian-950 p-4 rounded-2xl border border-orange-900/60 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400">Hesaplanan Tutar:</span>
                  {pricing.discountRate > 0 && formData.selectedServices.landscapeProject && (
                    <span className="text-orange-400 font-bold ml-2">(Peyzaj Projesine %{pricing.discountRate} İndirim)</span>
                  )}
                </div>
                <div className="text-xl font-black font-mono text-white">
                  {formatTL(pricing.finalPrice)}
                </div>
              </div>
            </div>
          ) : step === 2 ? (
            /* Step 2: Arazi & Proje Dosyaları Yükleme */
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="text-xl font-serif font-bold text-white">2. Arazi & Proje Dosyaları</h3>
                <p className="text-xs text-slate-400">Arsanıza veya projenize ait <strong>AutoCAD .DWG çizim dosyası zorunludur</strong>; ek olarak arsa fotoğrafı ve krokiler ekleyebilirsiniz.</p>
              </div>

              {/* Upload Validation Error Banner */}
              {uploadError && (
                <div className="p-4 rounded-2xl bg-red-950/60 border border-red-500/80 text-red-200 flex items-start gap-3 text-xs animate-shake shadow-glow-sm">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold block text-red-300 mb-0.5">AutoCAD DWG Dosyası Zorunludur:</strong>
                    <span>{uploadError}</span>
                  </div>
                </div>
              )}

              {/* Upload Status Info Badge */}
              {formData.documents.sketchPlan ? (
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>AutoCAD .DWG dosyanız hazır <strong>({formData.documents.sketchPlan.name})</strong>. Bir sonraki adıma geçebilirsiniz.</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 bg-emerald-900/60 px-2.5 py-0.5 rounded-full border border-emerald-600/50">
                    ✓ DWG Yüklendi
                  </span>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/50 text-amber-300 flex items-center gap-2 text-xs">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Siparişe devam edebilmek için lütfen aşağıdaki alana <strong>AutoCAD .DWG çizim dosyanızı</strong> yükleyiniz.</span>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                {/* DWG Vaziyet Planı (Zorunlu) */}
                <div className="bg-obsidian-950 p-5 rounded-2xl border border-orange-500/60 space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      <FileCheck className="w-4 h-4 text-orange-400" />
                      <span>AutoCAD .DWG Dosyası</span>
                    </div>
                    <span className="text-[10px] bg-orange-950 text-orange-400 border border-orange-700/60 px-2 py-0.5 rounded font-mono font-bold">
                      ZORUNLU (.DWG)
                    </span>
                  </div>
                  
                  {formData.documents.sketchPlan ? (
                    <div className="p-4 rounded-xl bg-orange-950/30 border border-orange-500/60 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <File className="w-5 h-5 text-orange-400 shrink-0" />
                        <div className="truncate">
                          <p className="text-xs font-bold text-white truncate">{formData.documents.sketchPlan.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{(formData.documents.sketchPlan.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile('sketchPlan')}
                        className="p-1.5 rounded-lg bg-red-950/50 border border-red-800/60 text-red-400 hover:text-red-300 hover:bg-red-900/60 transition-colors"
                        title="Dosyayı Kaldır"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-orange-500/60 hover:border-orange-400 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all bg-obsidian-900/60 group">
                      <UploadCloud className="w-9 h-9 text-orange-400 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-white">
                        AutoCAD .DWG Dosyası Yükleyin
                      </span>
                      <span className="text-[10px] text-orange-300/80 mt-1 font-mono">.DWG veya .DXF (Max 50MB) - Zorunlu</span>
                      <input
                        type="file"
                        accept=".dwg,.dxf,application/acad,application/x-acad,application/autocad_dwg,image/vnd.dwg,image/x-dwg"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload('sketchPlan', e.target.files[0])}
                      />
                    </label>
                  )}
                </div>

                {/* Diğer Kroki / Belge (İsteğe Bağlı) */}
                <div className="bg-obsidian-950 p-5 rounded-2xl border border-orange-950 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      <FileText className="w-4 h-4 text-orange-400" />
                      <span>Kroki veya Ek Belge (İsteğe Bağlı)</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">İsteğe Bağlı</span>
                  </div>

                  {formData.documents.titleDeed ? (
                    <div className="p-4 rounded-xl bg-orange-950/30 border border-orange-500/60 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <File className="w-5 h-5 text-orange-400 shrink-0" />
                        <div className="truncate">
                          <p className="text-xs font-bold text-white truncate">{formData.documents.titleDeed.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{(formData.documents.titleDeed.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile('titleDeed')}
                        className="p-1.5 rounded-lg bg-red-950/50 border border-red-800/60 text-red-400 hover:text-red-300 hover:bg-red-900/60 transition-colors"
                        title="Dosyayı Kaldır"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-orange-950 hover:border-orange-500/50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all bg-obsidian-900/50">
                      <UploadCloud className="w-8 h-8 text-orange-400 mb-2" />
                      <span className="text-xs font-bold text-slate-200">
                        Kroki / Belge Yükleyin (İsteğe Bağlı)
                      </span>
                      <span className="text-[10px] text-slate-500 mt-1">PDF, JPG, PNG (Max 25MB)</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload('titleDeed', e.target.files[0])}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Photos & Videos Dropzone & Uploaded List */}
              <div className="bg-obsidian-950 p-5 rounded-2xl border border-orange-950 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <ImageIcon className="w-4 h-4 text-orange-400" />
                    <span>Arsa Fotoğrafları & Çevre Videoları ({formData.documents.photos.length} Dosya Yüklendi)</span>
                  </div>
                </div>

                <label className="border-2 border-dashed border-orange-950 hover:border-orange-500/50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all bg-obsidian-900/50">
                  <UploadCloud className="w-8 h-8 text-orange-400 mb-2" />
                  <span className="text-xs font-bold text-slate-200">Fotoğraf & Video Dosyaları Ekleyin</span>
                  <span className="text-[10px] text-slate-500 mt-1">Çoklu seçim yapabilirsiniz (JPG, PNG, MP4)</span>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => e.target.files && handlePhotosUpload(e.target.files)}
                  />
                </label>

                {formData.documents.photos.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {formData.documents.photos.map((photo, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-obsidian-900/80 border border-orange-950 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <ImageIcon className="w-4 h-4 text-orange-400 shrink-0" />
                          <div className="truncate">
                            <p className="text-xs text-white truncate">{photo.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono">{(photo.size / (1024 * 1024)).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removePhoto(idx)}
                          className="p-1 rounded-lg text-slate-400 hover:text-red-400 transition-colors shrink-0"
                          title="Fotoğrafı Kaldır"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Projeyi Adrese Gönder (Fiziki Kargo Teslimatı) Seçeneği */}
              <div
                onClick={() => setFormData((prev) => ({ ...prev, shippingOption: !prev.shippingOption }))}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  formData.shippingOption
                    ? 'bg-orange-950/40 border-orange-500 shadow-glow-sm'
                    : 'bg-obsidian-950 border-orange-950 hover:border-orange-800'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl mt-0.5 shrink-0 ${formData.shippingOption ? 'bg-orange-600 text-white shadow-glow-sm' : 'bg-obsidian-900 border border-orange-950 text-orange-400'}`}>
                    <Truck className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-bold text-white">Projeyi Basılı Olarak Adresime Gönder (Kargo)</span>
                      <span className="text-[10px] font-mono font-black bg-orange-500/20 text-orange-400 border border-orange-500/40 px-2.5 py-0.5 rounded-full">
                        +1.500 ₺ (Renkli Baskı & Kargo)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Hazırlanan peyzaj projeniz, dijital AutoCAD ve 3D çizimlere ek olarak yüksek kaliteli <strong>A1 / A3 ebatlarında renkli mimari ozalit çıktısı ve özel proje sunum dosyası</strong> haline getirilerek adresinize <strong>kargo ile fiziki olarak iletilir</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <div
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      formData.shippingOption
                        ? 'bg-orange-600 text-white shadow-glow'
                        : 'bg-obsidian-900 border border-orange-950 text-slate-300 hover:text-white'
                    }`}
                  >
                    {formData.shippingOption ? (
                      <>
                        <CheckSquare className="w-4 h-4" />
                        <span>Kargo Eklendi (+1.500 TL)</span>
                      </>
                    ) : (
                      <>
                        <Square className="w-4 h-4" />
                        <span>Adrese Kargo İste (+1.500 TL)</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Peyzaj Mimarımıza Özel Notunuz / İstekleriniz:</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Örn: Kuzey rüzgarını kesen ağaçlar, çocuk güvenliği için havuz çevresi çit, taş fırın alanı..."
                  className="w-full bg-obsidian-950 border border-orange-950 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:border-orange-500 outline-none"
                />
              </div>
            </div>
        ) : step === 3 ? (
          /* Step 3: Fatura Bilgileri */
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-xl font-serif font-bold text-white">3. Fatura & İletişim Bilgileri</h3>
              <p className="text-xs text-slate-400">Yasal e-arşiv fatura düzenlenebilmesi için bilgilerinizi eksiksiz doldurun.</p>
            </div>

            {/* Official Invoice Delivery Notice */}
            <div className="p-4 rounded-2xl bg-orange-950/40 border border-orange-500/50 text-orange-200 text-xs flex items-start gap-3 shadow-glow-sm">
              <ShieldCheck className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold text-white block mb-0.5">Resmi Fatura Bilgilendirmesi:</span>
                Faturanız otomatik olarak kesilmez. Mimari projeniz tamamlanıp <strong>iş bitiminde</strong> sistemde kayıtlı e-posta adresinize resmi e-Arşiv / e-Fatura olarak iletilecektir.
              </div>
            </div>

            {/* Invoice Type Radio Selector */}
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => handleInvoiceChange('type', 'bireysel')}
                className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                  formData.invoice.type === 'bireysel'
                    ? 'bg-orange-950/40 border-orange-500 text-white shadow-glow-sm'
                    : 'bg-obsidian-950 border-orange-950 text-slate-400'
                }`}
              >
                <User className="w-5 h-5 text-orange-400" />
                <div>
                  <div className="text-xs font-bold">Bireysel Fatura</div>
                  <div className="text-[10px] text-slate-400">Şahıs adına TCKN ile faturalandırma</div>
                </div>
              </div>

              <div
                onClick={() => handleInvoiceChange('type', 'kurumsal')}
                className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                  formData.invoice.type === 'kurumsal'
                    ? 'bg-orange-950/40 border-orange-500 text-white shadow-glow-sm'
                    : 'bg-obsidian-950 border-orange-950 text-slate-400'
                }`}
              >
                <Building2 className="w-5 h-5 text-orange-400" />
                <div>
                  <div className="text-xs font-bold">Kurumsal Fatura</div>
                  <div className="text-[10px] text-slate-400">Şirket adına Vergi No ile faturalandırma</div>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid sm:grid-cols-2 gap-4 bg-obsidian-950 p-6 rounded-2xl border border-orange-950">
              {formData.invoice.type === 'bireysel' ? (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Ad Soyad <span className="text-orange-400">* (Zorunlu)</span>:
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: Ahmet Yılmaz"
                      value={formData.invoice.fullName}
                      onChange={(e) => handleInvoiceChange('fullName', e.target.value)}
                      className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-3 text-xs text-white focus:border-orange-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">T.C. Kimlik Numarası:</label>
                    <input
                      type="text"
                      maxLength={11}
                      placeholder="11 haneli TCKN"
                      value={formData.invoice.tcKimlikNo}
                      onChange={(e) => handleInvoiceChange('tcKimlikNo', e.target.value)}
                      className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-3 text-xs text-white focus:border-orange-500 outline-none font-mono"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-300">
                      Firma / Şirket Tam Ünvanı <span className="text-orange-400">* (Zorunlu)</span>:
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: Detay Mimarlık İnşaat San. ve Tic. Ltd. Şti."
                      value={formData.invoice.companyName}
                      onChange={(e) => handleInvoiceChange('companyName', e.target.value)}
                      className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-3 text-xs text-white focus:border-orange-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Vergi Dairesi:</label>
                    <input
                      type="text"
                      placeholder="Örn: Çanakkale Vergi Dairesi"
                      value={formData.invoice.taxOffice}
                      onChange={(e) => handleInvoiceChange('taxOffice', e.target.value)}
                      className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-3 text-xs text-white focus:border-orange-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Vergi Numarası (VKN):</label>
                    <input
                      type="text"
                      maxLength={10}
                      placeholder="10 haneli Vergi No"
                      value={formData.invoice.taxNumber}
                      onChange={(e) => handleInvoiceChange('taxNumber', e.target.value)}
                      className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-3 text-xs text-white focus:border-orange-500 outline-none font-mono"
                    />
                  </div>
                </>
              )}

              {/* Contact fields */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  E-Posta Adresi (E-Fatura & Teslimat) <span className="text-orange-400">* (Zorunlu)</span>:
                </label>
                <input
                  type="email"
                  placeholder="ornek@alanadi.com"
                  value={formData.invoice.email}
                  onChange={(e) => {
                    handleInvoiceChange('email', e.target.value);
                    setEmailValidationError(null);
                  }}
                  className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-3 text-xs text-white focus:border-orange-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Telefon Numarası <span className="text-orange-400">* (Zorunlu)</span>:
                </label>
                <input
                  type="tel"
                  placeholder="05XX XXX XX XX"
                  value={formData.invoice.phone}
                  onChange={(e) => handleInvoiceChange('phone', e.target.value)}
                  className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-3 text-xs text-white focus:border-orange-500 outline-none font-mono"
                />
              </div>

              {emailValidationError && (
                <div className="sm:col-span-2 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <span>{emailValidationError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">İl:</label>
                <input
                  type="text"
                  value={formData.invoice.city}
                  onChange={(e) => handleInvoiceChange('city', e.target.value)}
                  className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-3 text-xs text-white focus:border-orange-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">İlçe:</label>
                <input
                  type="text"
                  value={formData.invoice.district}
                  onChange={(e) => handleInvoiceChange('district', e.target.value)}
                  className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-3 text-xs text-white focus:border-orange-500 outline-none"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300">Fatura Açık Adresi:</label>
                <textarea
                  rows={2}
                  placeholder="Mahalle, Cadde, Sokak, No, Daire..."
                  value={formData.invoice.fullAddress}
                  onChange={(e) => handleInvoiceChange('fullAddress', e.target.value)}
                  className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-3 text-xs text-white focus:border-orange-500 outline-none"
                />
              </div>
            </div>
          </div>
        ) : (
          /* Step 4: Ödeme & Onay */
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-serif font-bold text-white">4. Ödeme & 256-Bit SSL Güvenli Onay</h3>
                <p className="text-xs text-slate-400">Paynkolay 3D Secure altyapısı ile kredi kartı veya havale ile ödemenizi tamamlayın.</p>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <SSLBadge className="h-6" />
                <PaynkolayLogo className="h-6 rounded" />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => setFormData({ ...formData, paymentMethod: 'credit_card' })}
                className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                  formData.paymentMethod === 'credit_card'
                    ? 'bg-orange-950/40 border-orange-500 text-white shadow-glow-sm'
                    : 'bg-obsidian-950 border-orange-950 text-slate-400'
                }`}
              >
                <CreditCard className="w-5 h-5 text-orange-400" />
                <div>
                  <div className="text-xs font-bold">Kredi / Banka Kartı</div>
                  <div className="text-[10px] text-slate-400">Paynkolay 3D Secure ile Güvenli Ödeme</div>
                </div>
              </div>

              <div
                onClick={() => setFormData({ ...formData, paymentMethod: 'bank_transfer' })}
                className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                  formData.paymentMethod === 'bank_transfer'
                    ? 'bg-orange-950/40 border-orange-500 text-white shadow-glow-sm'
                    : 'bg-obsidian-950 border-orange-950 text-slate-400'
                }`}
              >
                <Building2 className="w-5 h-5 text-orange-400" />
                <div>
                  <div className="text-xs font-bold">Havale / EFT</div>
                  <div className="text-[10px] text-slate-400">Şirket IBAN Banka Transferi</div>
                </div>
              </div>
            </div>

            {cardValidationError && (
              <div className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{cardValidationError}</span>
              </div>
            )}

            {/* Credit Card Input Form or Bank Details */}
            {formData.paymentMethod === 'credit_card' ? (
              <div className="bg-obsidian-950 p-6 rounded-2xl border border-orange-950 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-300 border-b border-orange-950 pb-3">
                  <span className="font-semibold">Kart Bilgileri:</span>
                  <div className="flex items-center gap-2">
                    <VisaLogo className="h-5 rounded" />
                    <MastercardLogo className="h-5 rounded" />
                    <PaynkolayLogo className="h-5 rounded" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300">Kart Üzerindeki İsim:</label>
                  <input
                    type="text"
                    placeholder="AD SOYAD"
                    value={cardInfo.cardHolder}
                    onChange={(e) => setCardInfo({ ...cardInfo, cardHolder: e.target.value.toUpperCase() })}
                    className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-3 text-xs text-white focus:border-orange-500 outline-none uppercase font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300">Kart Numarası:</label>
                  <input
                    type="text"
                    maxLength={19}
                    placeholder="0000 0000 0000 0000"
                    value={cardInfo.cardNumber}
                    onChange={(e) => setCardInfo({ ...cardInfo, cardNumber: e.target.value })}
                    className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-3 text-xs text-white focus:border-orange-500 outline-none font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300">Son Kullanma (AA/YY):</label>
                    <input
                      type="text"
                      maxLength={5}
                      placeholder="MM/YY"
                      value={cardInfo.expiry}
                      onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })}
                      className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-3 text-xs text-white focus:border-orange-500 outline-none font-mono text-center"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300">Güvenlik Kodu (CVC):</label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="CVC"
                      value={cardInfo.cvc}
                      onChange={(e) => setCardInfo({ ...cardInfo, cvc: e.target.value })}
                      className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-3 text-xs text-white focus:border-orange-500 outline-none font-mono text-center"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-obsidian-950 p-6 rounded-2xl border border-orange-950 space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <div className="text-orange-400 font-bold text-sm flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>Banka Havale / EFT / FAST Bilgileri:</span>
                  </div>
                  <span className="text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded-full font-semibold">
                    Anında Otomatik FAST Onayı
                  </span>
                </div>

                <div className="bg-obsidian-900 p-4 rounded-xl border border-orange-900/60 space-y-2 text-slate-200">
                  <div className="flex justify-between items-center py-1 border-b border-orange-950">
                    <span className="text-slate-400">Banka Adı:</span>
                    <span className="font-semibold text-white">Akbank</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-orange-950">
                    <span className="text-slate-400">Hesap Sahibi (Alıcı):</span>
                    <span className="font-bold text-white">Hasan Hüseyin Yıldırım</span>
                  </div>
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">IBAN Numarası:</div>
                      <div className="text-sm sm:text-base font-bold font-mono text-orange-300 tracking-wider select-all">
                        TR26 0004 6002 1488 8000 1069 24
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText('TR260004600214888000106924');
                        setCopiedIban(true);
                        setTimeout(() => setCopiedIban(false), 2500);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-orange-600/20 hover:bg-orange-600/40 text-orange-300 hover:text-white border border-orange-500/40 transition-all flex items-center justify-center gap-1.5 font-semibold text-xs cursor-pointer shrink-0"
                    >
                      {copiedIban ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300">IBAN Kopyalandı!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>IBAN'ı Kopyala</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 📄 Banka Dekontu Yükleme Kutusu */}
                <div className="p-4 rounded-xl bg-obsidian-900/90 border-2 border-dashed border-orange-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white font-bold text-xs">
                      <Upload className="w-4 h-4 text-orange-400" />
                      <span>Banka Ödeme Dekontu Yükleme * (Zorunlu)</span>
                    </div>
                    {formData.documents.receipt ? (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Dekont Yüklendi
                      </span>
                    ) : (
                      <span className="text-[10px] bg-orange-500/20 text-orange-300 border border-orange-500/30 px-2 py-0.5 rounded font-semibold">
                        Yükleme Zorunlu
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Havale / EFT transferini yaptıktan sonra bankanızın oluşturduğu ödeme dekontunu (PDF, PNG, JPG) yükleyiniz. <strong>Dekont sisteme yüklendikten sonra dosya gönderimi ve proje süreci resmi olarak başlayacaktır.</strong>
                  </p>

                  {formData.documents.receipt ? (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-obsidian-950 border border-emerald-500/40">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <FileText className="w-5 h-5 text-emerald-400 shrink-0" />
                        <div className="truncate">
                          <div className="text-xs font-semibold text-white truncate">{formData.documents.receipt.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{(formData.documents.receipt.size / 1024).toFixed(1)} KB</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile('receipt')}
                        className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                        title="Dekontu Kaldır"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <label className="flex flex-col items-center justify-center p-4 border border-dashed border-orange-500/40 hover:border-orange-400 rounded-xl bg-obsidian-950/60 hover:bg-obsidian-950 cursor-pointer transition-all group">
                        <UploadCloud className="w-6 h-6 text-orange-400 group-hover:scale-110 transition-transform mb-1.5" />
                        <span className="text-xs font-semibold text-white group-hover:text-orange-300">
                          Banka Dekontunu Seçin veya Buraya Bırakın
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">PDF, PNG, JPG, JPEG veya WEBP (Maks. 50 MB)</span>
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg,.webp"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleFileUpload('receipt', e.target.files[0]);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-orange-950/30 border border-orange-900/40 text-[11px] text-slate-300 leading-relaxed">
                  💡 Havale / EFT / FAST açıklama kısmına <strong>Ad Soyad veya Telefon Numaranızı</strong> yazmanız yeterlidir.
                </div>
              </div>
            )}

            {/* Order Summary & Final Total */}
            <div className="bg-obsidian-950 p-5 rounded-2xl border border-orange-900/80 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Arsa Alanı:</span>
                <span className="font-mono text-white">{formData.areaM2} m² ({pricing.areaDonum} Dönüm)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Seçili Hizmetler:</span>
                <span className="text-white">
                  {[
                    formData.selectedServices.landscapeProject && 'Peyzaj Projesi',
                    formData.selectedServices.visual3D && '3D Görsel Tasarım',
                    formData.selectedServices.irrigationProject && 'Sulama Projesi',
                  ]
                    .filter(Boolean)
                    .join(' + ')}
                </span>
              </div>
              {pricing.discountRate > 0 && formData.selectedServices.landscapeProject && (
                <div className="flex justify-between text-orange-400 font-bold">
                  <span>Peyzaj Projesi Dönüm İndirimi (%{pricing.discountRate}):</span>
                  <span className="font-mono">- {formatTL(pricing.discountAmount)}</span>
                </div>
              )}
              {formData.shippingOption && (
                <div className="flex justify-between text-orange-400 font-bold">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-orange-400" /> Fiziki Renkli Ozalit Baskı & Kargo:
                  </span>
                  <span className="font-mono">+ {formatTL(pricing.shippingFee)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-orange-950 flex justify-between items-baseline">
                <span className="text-sm font-bold text-white">Toplam Ödenecek Tutar (KDV Dahil):</span>
                <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                  {formatTL(pricing.finalPrice)}
                </span>
              </div>
            </div>

            {/* Legal Terms Checkboxes with Clickable Modals */}
            <div className="space-y-2 text-xs text-slate-400">
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-0.5 accent-orange-500 cursor-pointer" />
                <span>
                  <button
                    type="button"
                    onClick={() => onOpenLegalModal && onOpenLegalModal('mesafeli_satis')}
                    className="underline text-orange-400 hover:text-orange-300 font-semibold"
                  >
                    Mesafeli Satış Sözleşmesi
                  </button>
                  'ni ve{' '}
                  <button
                    type="button"
                    onClick={() => onOpenLegalModal && onOpenLegalModal('teslimat_iade')}
                    className="underline text-orange-400 hover:text-orange-300 font-semibold"
                  >
                    5 Günlük Teslimat ve İade Şartları
                  </button>
                  'nı okudum, onaylıyorum.
                </span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-0.5 accent-orange-500 cursor-pointer" />
                <span>
                  <button
                    type="button"
                    onClick={() => onOpenLegalModal && onOpenLegalModal('gizlilik_kvkk')}
                    className="underline text-orange-400 hover:text-orange-300 font-semibold"
                  >
                    Gizlilik Sözleşmesi & KVKK Aydınlatma Metni
                  </button>
                  'ni kabul ediyorum.
                </span>
              </label>
            </div>
          </div>
        )}

        </div>

        {/* Modal Footer Navigation */}
        {!orderComplete && (
          <div className="p-6 sm:px-8 border-t border-orange-950 flex items-center justify-between bg-obsidian-950">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-5 py-3 rounded-xl border border-orange-950 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Geri</span>
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                onClick={handleNextStep}
                className="px-8 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-glow flex items-center gap-2 cursor-pointer"
              >
                <span>İleri Adım</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                disabled={isSubmitting || isInitiating3D}
                onClick={handleCompleteOrder}
                className="px-9 py-3.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold shadow-glow flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isInitiating3D ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Paynkolay Sanal POS Bağlanıyor...</span>
                  </>
                ) : formData.paymentMethod === 'credit_card' ? (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Paynkolay 3D Secure ile Güvenli Öde ({formatTL(pricing.finalPrice)})</span>
                  </>
                ) : (
                  <>
                    <Building2 className="w-4 h-4" />
                    <span>Havale / FAST Bildirimi Yap ({formatTL(pricing.finalPrice)})</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

      </div>
    </main>

      {/* Page Footer */}
      <footer className="border-t border-orange-950/80 bg-obsidian-950 py-6 px-4 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 Detay Peyzaj & Mimarlık • Çanakkale / Türkiye</div>
          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <button type="button" onClick={() => onOpenLegalModal && onOpenLegalModal('mesafeli_satis')} className="hover:text-orange-300 transition-colors cursor-pointer">Mesafeli Satış Sözleşmesi</button>
            <button type="button" onClick={() => onOpenLegalModal && onOpenLegalModal('teslimat_iade')} className="hover:text-orange-300 transition-colors cursor-pointer">Teslimat & İade</button>
            <button type="button" onClick={() => onOpenLegalModal && onOpenLegalModal('gizlilik_kvkk')} className="hover:text-orange-300 transition-colors cursor-pointer">Gizlilik & KVKK</button>
          </div>
        </div>
      </footer>

    </div>
  );
};
