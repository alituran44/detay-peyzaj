import type { StyleOption, FeatureOption, PortfolioProject, ServiceItem, Testimonial, FAQItem } from '../types';

export const LANDSCAPE_STYLES: StyleOption[] = [
  {
    id: 'modern',
    name: 'Modern & Minimalist Villa',
    subtitle: 'Net Çizgiler, Geniş Çim & Lüks Aydınlatma',
    description: 'Geometrik sert zeminler, monokrom taş dokuları, zarif fıskiyeli su ögeleri ve heykelsi ağaçlar (Zeytin, Bonsai, Palmiye).',
    image: '/images/slider/S1.jpeg',
  },
  {
    id: 'mediterranean',
    name: 'Ege & Akdeniz Esintisi',
    subtitle: 'Doğal Taş, Lavanta & Zeytin Bahçeleri',
    description: 'Doğal traverten yollar, begonviller, aromatik bitki adacıkları, gölgelikli ahşap pergolalar ve sıcak toprak tonları.',
    image: '/images/slider/S2.jpeg',
  },
  {
    id: 'natural',
    name: 'Doğal Orman & Rustik Bahçe',
    subtitle: 'Organik Patikalar, Dere Yatağı & Zengin Bitki Örtüsü',
    description: 'Karasal iklime tam uyumlu çam ve meşe grupları, dere çakılı yürüyüş yolları, doğal taş istinat duvarları ve ateş çukurları.',
    image: '/images/slider/S3.jpeg',
  },
  {
    id: 'japanese',
    name: 'Zen & Japon Bahçesi',
    subtitle: 'Huzur, Bambu, Taş Bahçeleri & Nilüfer Göleti',
    description: 'Özel seçilmiş kaya formasyonları, Japon akçaağacı (Acer Palmatum), su sesi odaklı havuzlar ve ahşap seyir terasları.',
    image: '/images/postImg/proje2.jpeg',
  },
  {
    id: 'classic',
    name: 'Klasik Fransız & Saray Bahçesi',
    subtitle: 'Simetrik Formlar, Labirent Çitler & Klasik Çeşmeler',
    description: 'Budanmış şimşir çitler (Topiary), geniş çim parterleri, klasik heykeller ve görkemli aksiyal yürüyüş yolları.',
    image: '/images/anasayfa/kolaj.png',
  },
  {
    id: 'minimalist',
    name: 'Teras & Çatı Bahçesi (Rooftop)',
    subtitle: 'Kompakt Alanlar, Dikey Bahçe & Şehir Manzarası',
    description: 'Hafifletilmiş toprak katmanları, modüler saksı sistemleri, otomatik damlama sulama ve rüzgar kırıcı tasarım ögeleri.',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
  },
];

export const LANDSCAPE_FEATURES: FeatureOption[] = [
  { id: 'pool', name: 'Yüzme Havuzu / Süs Havuzu', category: 'water', icon: 'Waves', popular: true },
  { id: 'firepit', name: 'Gömme Ateş Çukuru & Lounge', category: 'recreation', icon: 'Flame', popular: true },
  { id: 'bbq', name: 'Açık Mutfak & Barbekü Alanı', category: 'recreation', icon: 'UtensilsCrossed', popular: true },
  { id: 'pergola', name: 'Biyoklimatik Pergola / Kamelya', category: 'structures', icon: 'Home', popular: true },
  { id: 'irrigation', name: 'Otomatik Sulama & Drenaj', category: 'flora', icon: 'Droplets', popular: true },
  { id: 'lighting', name: 'Akıllı Mimari Gece Aydınlatması', category: 'lighting', icon: 'Sparkles', popular: true },
  { id: 'playground', name: 'Çocuk Oyun & Aktivite Parkı', category: 'recreation', icon: 'Smile' },
  { id: 'wintergarden', name: 'Cam Kış Bahçesi / Sera', category: 'structures', icon: 'Sun' },
  { id: 'walkway', name: 'Doğal Taş & Ahşap Yürüyüş Yolları', category: 'structures', icon: 'Footprints' },
  { id: 'privacy', name: 'Doğal Bitkisel Çit & Mahremiyet Duvarı', category: 'flora', icon: 'ShieldCheck' },
  { id: 'orchard', name: 'Meyve Bahçesi & Hobi Bostanı', category: 'flora', icon: 'Trees' },
  { id: 'sports', name: 'Mini Basket / Tenis / Golf Sahası', category: 'recreation', icon: 'Trophy' },
];

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: 'ruhsat',
    title: 'Ruhsat Peyzaj Projeleri',
    shortDesc: 'Belediye ve ilgili kurum onaylı, imar mevzuatına tam uyumlu yapısal ve bitkisel ruhsat projeleri.',
    fullDesc: 'Arsanızın bulunduğu belediyenin imar şartnamesi, emsal ve taban alanı katsayılarına göre TMMOB standartlarında onay garantili peyzaj ruhsat projeleri hazırlıyoruz. Mimarlık ve peyzaj ofisleri için fason (başlıksız) çizim veya resmi onaylı e-imzalı/ıslak imzalı kargo teslimatı seçenekleri mevcuttur.',
    iconName: 'FileCheck',
    image: '/images/postImg/proje2.jpeg',
    benefits: ['Belediye Onay Garantisi & TMMOB Oda Standartları', 'E-İmza & Islak İmzalı / Kaşeli Kargo Gönderimi', 'Ofislere Fason Çizim (Antetsiz / Başlıksız DWG & PDF)', '5 İş Gününde Hızlı Teslimat']
  },
  {
    id: '3d-design',
    title: '3D Görsel Tasarım',
    shortDesc: 'Fotogerçekçi 4K gündüz ve gece renderları, malzeme dokuları ve detaylı mimari 3D modelleme.',
    fullDesc: 'Uygulama öncesinde bahçenizin bitmiş halini tüm açılardan, güneş konumları ve gece aydınlatma atmosferiyle birebir gerçeğe uygun olarak 4K çözünürlükte modelliyoruz.',
    iconName: 'Layers',
    image: '/images/slider/S1.jpeg',
    benefits: ['Fotogerçekçi 4K Renderlar', 'Gündüz & Gece Işıklandırma Simülasyonu', 'Gerçek Doku & Malzeme Eşleşmesi', '1 Tur Ücretsiz Revizyon']
  },
  {
    id: 'irrigation',
    title: 'Sulama Projesi',
    shortDesc: 'Otomatik sulama tesisatı, hidrolik debi ve boru çapı hesapları, vana ve rotor yerleşim planları.',
    fullDesc: '%50 su tasarrufu sağlayan Hunter / Rainbird standartlarında akıllı sulama, zonlama, hidrolik basınç ve damlama hatları projelendirmesi.',
    iconName: 'Droplets',
    image: '/images/slider/S2.jpeg',
    benefits: ['%50 Su Tasarrufu Sağlayan Zonlama', 'Bölgesel Hidrolik Basınç & Boru Hesabı', 'Yağmur Sensörlü Akıllı Kontrol', 'Sıfır Hata ile Uygulama Şeması']
  }
];

export const DELIVERABLES_LIST = [
  {
    number: '01',
    title: 'Yapısal Peyzaj Projesi',
    subtitle: 'Sert Zemin, Yollar & Mimari Akslar',
    description: 'Sert zemin döşemeleri, yürüyüş yolları, istinat duvarları, havuz ve teras kotlarını içeren 2D ölçekli AutoCAD (DWG) ve PDF uygulama planı.',
    iconName: 'Compass',
    format: 'AutoCAD .DWG & Vektörel .PDF'
  },
  {
    number: '02',
    title: 'Bitkisel Peyzaj Projesi',
    subtitle: 'Koordinatlı Dikim & Zonlama Planı',
    description: 'Arsa iklimine tam uyumlu ağaç, çalı, yer örtücü ve rulo çim alanlarının koordinatlı dikim lokasyonlarını gösteren ölçekli peyzaj paftası.',
    iconName: 'Trees',
    format: 'Ölçekli Koordinatlı Plan'
  },
  {
    number: '03',
    title: 'Yapısal Detay Paftası',
    subtitle: 'İmalat Kesitleri & Birleşim Detayları',
    description: 'Merdivenler, istinat duvarları, taş döşeme harç katmanları, su yalıtımları ve pergola ankraj birleşimlerini gösteren teknik kesit paftası.',
    iconName: 'Layers',
    format: '1/20 & 1/10 İmalat Detayları'
  },
  {
    number: '04',
    title: 'Bitkisel Detay Paftası',
    subtitle: 'Fidan Dikim Çukuru & Bakım Künyesi',
    description: 'Bitki kök koruma şemaları, fidan dikim çukuru kesitleri, toprak harcı karışım oranları ve mevsimsel budama/bakım kılavuzları.',
    iconName: 'BookOpen',
    format: 'Botanik Künye & Teknik Kesit'
  },
  {
    number: '05',
    title: 'Metrajları',
    subtitle: 'Detaylı Malzeme & Keşif Tablosu',
    description: 'Uygulama ustasına veya müteahhide teslim edilecek; taş m², çim m², toprak m³, boru metreleri ve bitki adet dökümünü içeren Excel & PDF metraj listesi.',
    iconName: 'FileSpreadsheet',
    format: 'Excel (.XLSX) & .PDF Metraj Listesi'
  }
];

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'pro-1',
    slug: 'canakkale-bogaz-manzarali-villa-peyzaji',
    title: 'Çanakkale Boğaz Manzaralı Villa Peyzajı',
    category: 'visual3d',
    categoryName: '3D Görsel Tasarım & Peyzaj',
    location: 'Çanakkale / Merkez',
    area: '1.850 m²',
    duration: '5 İş Gününde Teslim Edildi',
    mainImage: '/images/slider/S1.jpeg',
    altText: 'Çanakkale Boğazı manzaralı modern lüks villa 3D fotogerçekçi peyzaj ve gece aydınlatma tasarımı',
    instagramPostUrl: 'https://www.instagram.com/detay_proje_mimarlik/',
    likesCount: 342,
    gallery: [
      '/images/slider/S1.jpeg',
      '/images/anasayfa/kolaj.png',
      '/images/slider/S2.jpeg'
    ],
    description: 'Doğayla uyumlu asırlık zeytin ağaçları, doğal traverten taş yürüyüş aksları, taşmalı yüzme havuzu ve rüzgara dayanıklı kıyı bitki seçkisi.',
    features: ['Yapısal Peyzaj', 'Bitkisel Pafta', '3D Render', 'Otomatik Sulama', 'Metraj Listesi']
  },
  {
    id: 'pro-2',
    slug: 'geyikli-eko-ciftlik-sulama-projesi',
    title: 'Geyikli Eko-Çiftlik & Otomatik Sulama Projesi',
    category: 'irrigation',
    categoryName: 'Sulama & Eko-Peyzaj',
    location: 'Çanakkale / Ezine',
    area: '3.200 m²',
    duration: '5 İş Gününde Teslim Edildi',
    mainImage: '/images/slider/S2.jpeg',
    altText: 'Geyikli çiftlik arazisi için Hunter akıllı otomatik damlama sulama ve bitkilendirme projesi',
    instagramPostUrl: 'https://www.instagram.com/detay_proje_mimarlik/',
    likesCount: 289,
    gallery: [
      '/images/slider/S2.jpeg',
      '/images/postImg/proje2.jpeg'
    ],
    description: 'Organik hobi bostanları, açık mutfak ve barbekü alanı, doğal nilüfer göleti ve Hunter akıllı damlama sulama zonlaması.',
    features: ['Hidrolik Sulama Projesi', 'Hobi Bostanı', 'Bitkisel Detay', 'Metraj Listesi']
  },
  {
    id: 'pro-3',
    slug: 'assos-tas-ev-ruhsat-peyzaj-projesi',
    title: 'Assos Taş Ev Belediyesi Ruhsat Projesi',
    category: 'ruhsat',
    categoryName: 'Ruhsat Peyzaj Projesi',
    location: 'Çanakkale / Ayvacık',
    area: '1.200 m²',
    duration: '4 İş Gününde Teslim Edildi',
    mainImage: '/images/slider/S3.jpeg',
    altText: 'Assos taş ev mimarisine uygun belediye onaylı AutoCAD DWG ve PDF peyzaj ruhsat projesi',
    instagramPostUrl: 'https://www.instagram.com/detay_proje_mimarlik/',
    likesCount: 415,
    gallery: [
      '/images/slider/S3.jpeg',
      '/images/slider/S1.jpeg'
    ],
    description: 'Assos doğal taş duvarları ile uyumlu begonviller, asırlık zeytin ağaçları, belediye onaylı ruhsat paftası ve detay kesitleri.',
    features: ['Ruhsat Onaylı DWG', 'Yapısal Pafta', 'Bitkisel Pafta', 'İmalat Detayları']
  },
  {
    id: 'pro-4',
    slug: 'bozcaada-bag-evi-peyzaji-havuz-tasarimi',
    title: 'Bozcaada Bağ Evi Peyzajı & Havuz Tasarımı',
    category: 'visual3d',
    categoryName: '3D Görsel Tasarım',
    location: 'Çanakkale / Bozcaada',
    area: '2.400 m²',
    duration: '5 İş Gününde Teslim Edildi',
    mainImage: '/images/anasayfa/kolaj.png',
    altText: 'Bozcaada bağ evi açık yüzme havuzu, ahşap teras ve 4K mimari 3D render tasarımı',
    instagramPostUrl: 'https://www.instagram.com/detay_proje_mimarlik/',
    likesCount: 524,
    gallery: [
      '/images/anasayfa/kolaj.png',
      '/images/postImg/proje2.jpeg'
    ],
    description: 'Ada iklimine özel rüzgar dayanımlı yerel floralar, modern açık havuz çevresi ahşap deck ve 4K fotogerçekçi gece renderları.',
    features: ['4K Gündüz & Gece Render', 'Yapısal Pafta', 'Otomatik Sulama', 'Metraj Listesi']
  },
  {
    id: 'pro-5',
    slug: 'biga-sanayi-ticari-ruhsat-peyzaj-projesi',
    title: 'Biga Sanayi & Ticari Ruhsat Peyzaj Projesi',
    category: 'ruhsat',
    categoryName: 'Ruhsat Peyzaj Projesi',
    location: 'Çanakkale / Biga',
    area: '4.000 m²',
    duration: '5 İş Gününde Teslim Edildi',
    mainImage: '/images/postImg/proje2.jpeg',
    altText: 'Biga sanayi ve ticari tesis çevre düzenleme, TMMOB standartlarında onaylı peyzaj ruhsat çizimi',
    instagramPostUrl: 'https://www.instagram.com/detay_proje_mimarlik/',
    likesCount: 198,
    gallery: [
      '/images/postImg/proje2.jpeg',
      '/images/slider/S1.jpeg'
    ],
    description: 'Geniş çim parterleri, botanik yürüyüş koridoru, resmi kurum onaylı yapısal ve bitkisel ruhsat paftaları ile tam metraj.',
    features: ['Ruhsat Projesi', 'Yapısal Detay', 'Bitkisel Detay', 'Excel Metraj']
  },
  {
    id: 'pro-6',
    slug: 'gelibolu-sahil-villasi-bahce-sulama-sistemi',
    title: 'Gelibolu Sahil Villası Bahçe & Sulama Sistemi',
    category: 'irrigation',
    categoryName: 'Sulama & 3D Proje',
    location: 'Çanakkale / Gelibolu',
    area: '1.450 m²',
    duration: '5 İş Gününde Teslim Edildi',
    mainImage: '/images/slider/S1.jpeg',
    altText: 'Gelibolu sahil villası otomatik pop-up sulama sistemi yerleşim planı ve 3D peyzaj tasarımı',
    instagramPostUrl: 'https://www.instagram.com/detay_proje_mimarlik/',
    likesCount: 377,
    gallery: [
      '/images/slider/S1.jpeg'
    ],
    description: 'Deniz rüzgarına dirençli bitki grupları, kademeli gabion teraslama, 3D modelleme ve otomatik pop-up sulama projesi.',
    features: ['Otomatik Sulama', '3D Render', 'Yapısal Detay', 'Metraj Listesi']
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    name: 'Dr. Mehmet Yılmaz',
    role: 'Villa Sahibi',
    location: 'Çanakkale / Merkez',
    avatar: '/images/acardion/2.jpg',
    comment: 'Arsamızın krokisini ve cep telefonuyla çektiğimiz 3 videoyu sisteme yükledik. 4. günde gelen 3D renderlar, ruhsat paftası ve bitki listesi tek kelimeyle kusursuzdu. Müteahhidimize teslim ettik ve sıfır hatayla uygulattık.',
    rating: 5,
    projectArea: '1.850 m²',
    projectStyle: 'Modern Villa'
  },
  {
    id: 't-2',
    name: 'Selin & Burak Kaya',
    role: 'Müstakil Ev Sahibi',
    location: 'Ezine / Çanakkale',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    comment: 'Peyzaj projesi ve sulama projesini birlikte seçtik. Dönüm indirimli şeffaf fiyatı ve 5 günlük taahhüdü harika bir güven verdi. Bahçemiz artık bir rüya.',
    rating: 5,
    projectArea: '950 m²',
    projectStyle: 'Doğal Taş Bahçe'
  },
  {
    id: 't-3',
    name: 'İlker Erdem',
    role: 'İnşaat Mühendisi & Yatırımcı',
    location: 'Bozcaada / Çanakkale',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    comment: '3 dönümlük bağ evi arazimiz için %20 indirimle proje siparişi verdik. Gelen AutoCAD paftası ve malzeme metrajları sayesinde uygulama yaparken %30 malzeme tasarrufu sağladık.',
    rating: 5,
    projectArea: '3.000 m²',
    projectStyle: 'Rustik Bağ Evi'
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Online proje siparişi vermek için hangi evrakları yüklemem gerekir?',
    answer: 'Tapu fotokopisi veya imar çapı/aplikasyon krokisi, arsanızın farklı açılardan çekilmiş net fotoğrafları veya kısa bir videosu yeterlidir. Varsa belediyeden onaylı mimari vaziyet planı (DWG/PDF) süreci daha da hızlandırır.',
    category: 'order'
  },
  {
    id: 'faq-2',
    question: '5 iş günü teslimat garantisi nasıl işliyor?',
    answer: 'Evraklarınızı ve ödemenizi tamamladığınız andan itibaren uzman peyzaj mimarlarımız çalışmaya başlar. 5. iş gününün sonunda tüm Yapısal, Bitkisel paftalar, 3D renderlar, sulama planı ve metraj tablonuz e-posta ve WhatsApp üzerinden yüksek çözünürlüklü olarak teslim edilir.',
    category: 'delivery'
  },
  {
    id: 'faq-3',
    question: 'Fiyat hesaplamada hizmet seçenekleri ve dönüm indirimleri nasıl çalışır?',
    answer: 'Peyzaj Projesi (12.000 TL/dönüm), 3D Görsel Tasarım (12.000 TL/dönüm) ve Sulama Projesi (6.000 TL/dönüm) seçeneklerinden ihtiyacınız olanları seçebilirsiniz. 1-2 dönüm arası %15, 2-3 dönüm arası %20, 3-4 dönüm arası %25 indirim seçilen toplam tutara otomatik uygulanır.',
    category: 'pricing'
  },
  {
    id: 'faq-4',
    question: 'Ruhsat peyzaj projeleri belediye onayına uygun mudur?',
    answer: 'Evet! Hazırladığımız ruhsat projeleri, Türkiye genelindeki tüm belediyelerin imar mevzuatına ve TMMOB Peyzaj Mimarları Odası standartlarına %100 uyumlu olarak hazırlanır.',
    category: 'application'
  },
  {
    id: 'faq-5',
    question: 'Mimarlık & Peyzaj ofisleri için fason (başlıksız / antetsiz) çizim yapıyor musunuz?',
    answer: 'Evet! Başka şehirlerdeki mimarlık, mühendislik ve peyzaj büroları için fason çizim desteği sunuyoruz. Projeler antetsiz (başlıksız) DWG ve PDF olarak teslim edilir; ofisler kendi antetlerini ve kaşelerini ekleyebilir.',
    category: 'application'
  },
  {
    id: 'faq-6',
    question: 'E-İmzalı ve Islak İmzalı / Kaşeli kargo gönderimi yapıyor musunuz?',
    answer: 'Evet! İhtiyacınıza göre projelerimiz resmi zaman damgalı E-İmza ile dijital olarak iletilir veya talep etmeniz halinde kaşelenip ıslak imzalanarak Türkiye geneline anlaşmalı kargo ile adresinize postalanır.',
    category: 'delivery'
  },
  {
    id: 'faq-7',
    question: 'Fatura ve ödeme süreci nasıl ilerler?',
    answer: 'Siparişiniz sırasında bireysel veya kurumsal fatura bilgilerinizi girersiniz. Ödemenizi 3D Secure güvenli kredi kartı veya banka havalesiyle gerçekleştirebilir, siparişinizin e-arşiv faturasını anında görüntüleyebilirsiniz.',
    category: 'payment'
  }
];
