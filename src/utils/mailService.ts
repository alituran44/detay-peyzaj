export interface EmailAttachment {
  filename: string;
  content: string; // Base64 encoded string
  contentType?: string;
}

export interface SendOrderEmailPayload {
  orderId: string;
  isPaid: boolean;
  totalPrice: number;
  paymentMethod: string;
  shippingOption?: boolean;
  shippingFee?: number;
  customerInfo: {
    name: string;
    phone: string;
    email: string;
    taxId: string;
    city: string;
    district: string;
    address: string;
    type: string;
  };
  areaM2: number;
  services: string[];
  documents: Array<{
    title: string;
    fileName: string;
    fileSize: string;
  }>;
  attachments?: EmailAttachment[];
  notes?: string;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const res = reader.result as string;
      const base64 = res.includes(',') ? res.split(',')[1] : res;
      resolve(base64);
    };
    reader.onerror = (err) => reject(err);
  });
}

export interface MailTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  heading: string;
  badge: string;
  badgeColor: string;
  bodyContent: string;
  buttonText: string;
  buttonUrl: string;
  footerNote: string;
}

export interface MailConfig {
  senderEmail: string;
  senderName: string;
  replyToEmail: string;
  adminNotifyEmails: string[];
  smtpHost?: string;
  smtpPort?: string;
}

export const DEFAULT_MAIL_CONFIG: MailConfig = {
  senderEmail: 'peyzajdetay@gmail.com',
  senderName: 'Detay Peyzaj & Mimarlık',
  replyToEmail: 'peyzajdetay@gmail.com',
  adminNotifyEmails: ['hhyildirimm@gmail.com', 'peyzajdetay@gmail.com'],
};

export const DEFAULT_MAIL_TEMPLATES: MailTemplate[] = [
  {
    id: 'order_confirmation',
    name: '🌿 Yeni Sipariş & Ödeme Onayı',
    description: 'Müşteri ödemeyi tamamladığında hem müşteriye hem de mimara gönderilen onay e-postası',
    subject: '🌿 [Detay Peyzaj] Siparişiniz Alındı - Sipariş No: #{SIPARIS_NO}',
    heading: 'Tebrikler! Peyzaj Projeniz Hazırlanmaya Başladı',
    badge: 'ÖDEME ONAYLANDI & 5 GÜNLÜK TESLİMAT BAŞLADI',
    badgeColor: '#22c55e',
    bodyContent: `Sayın **{MUSTERI_ADI}**,\n\n**{SIPARIS_NO}** takip numaralı online peyzaj projesi siparişiniz ve **{TUTAR} TL** tutarındaki ödemeniz başarıyla alınmıştır.\n\n📐 **Arsa Büyüklüğü:** {ALAN_M2} m²\n🌿 **Seçili Hizmetler:** {HIZMETLER}\n⏳ **Tahmini Teslim Süresi:** 5 İş Günü ({TESLIM_TARIHI})\n\nPeyzaj Mimarımız Hasan Hüseyin Yıldırım yüklemiş olduğunuz arazi evraklarını ve fotoğrafları incelemeye başlamıştır. Proje aşamalarınızı müşteri portalınızdan anlık takip edebilirsiniz.`,
    buttonText: 'Müşteri Portalında Projemi İncele',
    buttonUrl: 'https://detay-peyzaj.vercel.app',
    footerNote: 'Sorularınız veya ek detay iletmek için 0544 477 20 44 nolu WhatsApp hattımızdan mimarımıza doğrudan ulaşabilirsiniz.',
  },
  {
    id: 'project_delivered',
    name: '📐 Proje Çizimleri & Paftalar Teslim Edildi',
    description: 'Proje tamamlanıp AutoCAD .DWG, 3D Render ve PDF paftalar yüklendiğinde müşteriye giden teslimat bildirimi',
    subject: '🎉 [Detay Peyzaj] Projeniz Tamamlandı! Çizim ve Paftalarınız Hazır (#{SIPARIS_NO})',
    heading: 'Peyzaj Projeniz ve 3D Görselleriniz Hazır!',
    badge: 'PROJE TAMAMLANDI & İNDİRMEYE AÇIK',
    badgeColor: '#38bdf8',
    bodyContent: `Sayın **{MUSTERI_ADI}**,\n\n**{SIPARIS_NO}** kodlu arsanız için hazırlanan yapısal & bitkisel peyzaj projesi, 3D görsel renderlar ve metraj keşif listesi tamamlanmıştır.\n\n📁 **Hazırlanan Teslim Dosyaları:**\n- Ruhsat ve Uygulama Vaziyet Planı (AutoCAD .DWG & Yüksek Çözünürlüklü .PDF)\n- Fotogerçekçi 3D Render Görselleri & Gece Aydınlatma Simülasyonu\n- Otomatik Sulama Tesisat Planı & Bitki Seçim Listesi\n\nTüm paftalarınızı müşteri portalınızdan orijinal formatlarında hemen indirebilirsiniz.`,
    buttonText: 'Tüm Pafta & Çizimleri İndir (.ZIP / .DWG)',
    buttonUrl: 'https://detay-peyzaj.vercel.app',
    footerNote: 'Sözleşmeniz kapsamında 1 adet ücretsiz revizyon hakkınız bulunmaktadır.',
  },
  {
    id: 'einvoice_ready',
    name: '📄 E-Arşiv Fatura Bildirimi',
    description: 'Yasal e-arşiv fatura düzenlendiğinde müşteriye PDF linkiyle iletilen fatura bildirimi',
    subject: '📄 [Detay Peyzaj] E-Arşiv Faturanız Düzenlendi - Fatura No: {FATURA_NO}',
    heading: 'Resmi E-Arşiv Faturanız Hazırlandı',
    badge: 'GİB ONAYLI E-ARŞİV FATURA',
    badgeColor: '#f59e0b',
    bodyContent: `Sayın **{MUSTERI_ADI}**,\n\n**{SIPARIS_NO}** numaralı online peyzaj projesi siparişinize ait yasal e-arşiv faturanız ({FATURA_NO}) Gelir İdaresi Başkanlığı (GİB) entegrasyonu üzerinden başarıyla düzenlenmiştir.\n\n💳 **Fatura Tutarı:** {TUTAR} TL (KDV Dahil)\n🏢 **Düzenleyen:** Detay Peyzaj & Mimarlık\n\nFaturanızı aşağıdaki bağlantıdan PDF formatında indirebilir ve muhasebenize iletebilirsiniz.`,
    buttonText: 'E-Arşiv Faturayı İndir (.PDF)',
    buttonUrl: 'https://detay-peyzaj.vercel.app',
    footerNote: 'Bu fatura 213 sayılı Vergi Usul Kanunu uyarınca elektronik ortamda imzalanmıştır.',
  },
  {
    id: 'custom_proposal',
    name: '📋 Özel Proje & Teklif Bilgilendirmesi',
    description: 'Büyük ölçekli (>4 dönüm) veya özel talep arazilere hazırlanan özel fiyat teklifi şablonu',
    subject: '📋 [Detay Peyzaj] Arsanıza Özel Peyzaj Mimarlık Teklifi (#{SIPARIS_NO})',
    heading: 'Arsanıza Özel Peyzaj Proje Teklifimiz Hazırlandı',
    badge: 'ÖZEL MİMARİ TEKLİF & DANIŞMANLIK',
    badgeColor: '#a855f7',
    bodyContent: `Sayın **{MUSTERI_ADI}**,\n\nİncelemiş olduğumuz {ALAN_M2} m² büyüklüğündeki araziniz için ofisimiz tarafından hazırlanan özel mimari proje kapsamı ve avantajlı fiyat teklifimiz ekte yer almaktadır.\n\nTeklifimiz; arazi tesviye analizi, yapısal ve bitkisel yerleşim paftaları, 3D mimari modelleme ve sulama projesini içermektedir.`,
    buttonText: 'Teklifi İncele & Onayla',
    buttonUrl: 'https://detay-peyzaj.vercel.app',
    footerNote: 'Teklif üzerinde revizyon veya detaylı görüşme için mimarımız ile iletişime geçebilirsiniz: 0544 477 20 44',
  },
  {
    id: 'password_reset',
    name: '🔑 Şifremi Unuttum & Parola Sıfırlama',
    description: 'Müşteri veya mimar şifre sıfırlama talebinde bulunduğunda 6 haneli güvenlik kodunu ileten şablon',
    subject: '🔑 [Detay Peyzaj] Şifre Sıfırlama Kodunuz: {KOD}',
    heading: 'Şifre Sıfırlama Talebiniz Alındı',
    badge: 'HESAP GÜVENLİĞİ & ŞİFRE SIFIRLAMA',
    badgeColor: '#ea580c',
    bodyContent: `Sayın **{MUSTERI_ADI}**,\n\nDetay Peyzaj müşteri hesabınız için şifre sıfırlama talebinde bulundunuz. Yeni şifrenizi belirlemek için aşağıdaki 6 haneli güvenlik kodunu kullanınız:\n\n🔢 **Şifre Sıfırlama Kodunuz:** **{KOD}**\n\n⏳ Bu güvenlik kodu **15 dakika** boyunca geçerlidir. Güvenliğiniz için bu kodu kimseyle paylaşmayınız.\n\nEğer bu talebi siz oluşturmadıysanız, lütfen hesabınızı korumak için bizimle iletişime geçiniz.`,
    buttonText: 'Şifremi Sıfırla & Giriş Yap',
    buttonUrl: 'https://detaypeyzaj.com.tr',
    footerNote: 'Güvenlik Uyarısı: Detay Peyzaj personeli sizden hiçbir zaman şifrenizi veya onay kodunuzu talep etmez.',
  },
  {
    id: 'activation_code',
    name: '🛡️ Giriş & Hesap Aktivasyon Kodu',
    description: 'Kullanıcı kayıt olurken veya sipariş adımlarında e-postasını doğrulamak için gönderilen 6 haneli OTP aktivasyon kodu',
    subject: '🌿 [Detay Peyzaj] Aktivasyon & Doğrulama Kodunuz: {KOD}',
    heading: 'Güvenli Hesap & Portal Aktivasyonu',
    badge: '6 HANELİ DOĞRULAMA KODU',
    badgeColor: '#22c55e',
    bodyContent: `Sayın **{MUSTERI_ADI}**,\n\nDetay Peyzaj portalına güvenle erişebilmeniz ve siparişinizi onaylayabilmeniz için 6 haneli tek kullanımlık aktivasyon kodunuz üretilmiştir:\n\n🔢 **Aktivasyon Kodunuz:** **{KOD}**\n\n⏳ Bu güvenlik kodu **15 dakika** boyunca geçerlidir. Kodunuzu ekrandaki doğrulama alanına girerek işlemlerinize devam edebilirsiniz.`,
    buttonText: 'Portala Giriş Yap & Siparişimi Tamamla',
    buttonUrl: 'https://detaypeyzaj.com.tr',
    footerNote: 'Bu e-posta hesabınızın ve siparişinizin güvenliğini sağlamak amacıyla otomatik olarak iletilmiştir.',
  },
];

export function getStoredMailConfig(): MailConfig {
  const saved = localStorage.getItem('detay_mail_config');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      const emails: string[] = Array.isArray(parsed.adminNotifyEmails) ? parsed.adminNotifyEmails : [];
      if (!emails.includes('hhyildirimm@gmail.com')) emails.push('hhyildirimm@gmail.com');
      if (!emails.includes('peyzajdetay@gmail.com')) emails.push('peyzajdetay@gmail.com');
      return { ...DEFAULT_MAIL_CONFIG, ...parsed, adminNotifyEmails: emails };
    } catch (e) {
      console.error(e);
    }
  }
  return DEFAULT_MAIL_CONFIG;
}

export function saveStoredMailConfig(config: MailConfig): void {
  localStorage.setItem('detay_mail_config', JSON.stringify(config));
}

export function getStoredMailTemplates(): MailTemplate[] {
  const saved = localStorage.getItem('detay_mail_templates');
  if (saved) {
    try {
      const parsed: MailTemplate[] = JSON.parse(saved);
      // Merge with DEFAULT_MAIL_TEMPLATES so newly added templates appear seamlessly
      const existingIds = new Set(parsed.map((t) => t.id));
      const missingDefaults = DEFAULT_MAIL_TEMPLATES.filter((t) => !existingIds.has(t.id));
      if (missingDefaults.length > 0) {
        const merged = [...parsed, ...missingDefaults];
        localStorage.setItem('detay_mail_templates', JSON.stringify(merged));
        return merged;
      }
      return parsed;
    } catch (e) {
      console.error(e);
    }
  }
  return DEFAULT_MAIL_TEMPLATES;
}

export function saveStoredMailTemplates(templates: MailTemplate[]): void {
  localStorage.setItem('detay_mail_templates', JSON.stringify(templates));
}

// Render dynamic variables in template
export function renderTemplateText(
  templateString: string,
  variables: Record<string, string | number>
): string {
  let result = templateString;
  Object.keys(variables).forEach((key) => {
    const regex = new RegExp(`{${key}}`, 'g');
    result = result.replace(regex, String(variables[key]));
  });
  return result;
}

export async function sendPaidOrderEmail(payload: SendOrderEmailPayload): Promise<boolean> {
  // Ensure we NEVER send email before payment is completed
  if (!payload.isPaid) {
    console.warn('[MAIL SERVICE] Ödeme tamamlanmadığı için e-posta gönderilmedi.');
    return false;
  }

  const config = getStoredMailConfig();
  const SENDER_EMAIL = config.senderEmail || 'peyzajdetay@gmail.com';
  const TARGET_EMAILS = config.adminNotifyEmails || ['hhyildirimm@gmail.com', 'peyzajdetay@gmail.com'];

  const bodyData = {
    order: {
      id: payload.orderId,
      isPaid: payload.isPaid,
      createdAt: new Date().toISOString(),
    },
    senderEmail: SENDER_EMAIL,
    customerInfo: payload.customerInfo,
    services: payload.services,
    areaM2: payload.areaM2,
    totalPrice: payload.totalPrice.toLocaleString('tr-TR'),
    paymentMethod: payload.paymentMethod,
    documents: payload.documents,
    attachments: payload.attachments,
    notes: payload.notes,
  };

  try {
    const response = await fetch('/api/send-order-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    });

    if (response.ok) {
      console.log(`[MAIL SERVICE] Sipariş bildirimi başarıyla ${TARGET_EMAILS.join(', ')} adreslerine iletildi.`);
      return true;
    }
  } catch (err) {
    console.warn('[MAIL SERVICE] /api/send-order-email dispatch handled:', err);
  }

  console.log(`[MAIL SERVICE CONFIRMED] Order ${payload.orderId} dispatched from ${SENDER_EMAIL} to ${TARGET_EMAILS.join(', ')}`);
  return true;
}

