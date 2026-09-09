export interface PlantItem {
  id: string;
  name: string;
  botanicalName: string;
  category: 'Ağaç' | 'Çalı' | 'Yer Örtücü' | 'Aromatik';
  waterNeed: 'Düşük' | 'Orta' | 'Yüksek';
  sunNeed: 'Tam Güneş' | 'Yarı Gölge' | 'Gölge';
  climateZones: string[];
  image: string;
  description: string;
  purpose: string;
}

export const PLANT_DATABASE: PlantItem[] = [
  {
    id: 'olea-europaea',
    name: 'Zeytin Ağacı (Yetişkin Formlu)',
    botanicalName: 'Olea europaea',
    category: 'Ağaç',
    waterNeed: 'Düşük',
    sunNeed: 'Tam Güneş',
    climateZones: ['Ege-Marmara', 'Akdeniz'],
    image: '/images/slider/S1.jpeg',
    description: 'Kuraklığa, tuzlu rüzgara ve sıcağa son derece dayanıklı; Akdeniz ve Ege bahçelerinin prestijli odak ağacı.',
    purpose: 'Giriş aksı ve çim teras merkezlerinde heykelsi odak noktası.'
  },
  {
    id: 'cupressus-sempervirens',
    name: 'Akdeniz Servisi (İtalyan Servi)',
    botanicalName: 'Cupressus sempervirens',
    category: 'Ağaç',
    waterNeed: 'Düşük',
    sunNeed: 'Tam Güneş',
    climateZones: ['Ege-Marmara', 'Akdeniz', 'İç Anadolu'],
    image: '/images/slider/S2.jpeg',
    description: 'Sütun formuyla rüzgar kesici perde oluşturan, yaz-kış koyu yeşil kalan asil mimari ağaç.',
    purpose: 'Arsa sınırlarında mahremiyet perdesi ve yürüyüş yolu aksı.'
  },
  {
    id: 'lavandula-angustifolia',
    name: 'Lavanta (İngiliz Lavantası)',
    botanicalName: 'Lavandula angustifolia',
    category: 'Aromatik',
    waterNeed: 'Düşük',
    sunNeed: 'Tam Güneş',
    climateZones: ['Ege-Marmara', 'Akdeniz', 'İç Anadolu', 'Karadeniz'],
    image: '/images/slider/S3.jpeg',
    description: 'Mor çiçekleri ve ferahlatıcı kokusuyla sinek/böcek kaçıran, minimum su isteyen kurakçıl çalı.',
    purpose: 'Sert zemin bordürlerinde ve taş duvar diplerinde şerit dikim.'
  },
  {
    id: 'rosmarinus-officinalis',
    name: 'Biberiye (Sarkan & Çalı Formu)',
    botanicalName: 'Rosmarinus officinalis',
    category: 'Aromatik',
    waterNeed: 'Düşük',
    sunNeed: 'Tam Güneş',
    climateZones: ['Ege-Marmara', 'Akdeniz'],
    image: '/images/anasayfa/kolaj.png',
    description: 'Toprak erozyonunu önleyen, istinat duvarlarından sarkan, 4 mevsim canlı yeşil aromatik bitki.',
    purpose: 'İstinat duvarı üstleri ve eğimli şev stabilizasyonu.'
  },
  {
    id: 'festuca-glauca',
    name: 'Mavi Çim (Yumak Otu)',
    botanicalName: 'Festuca glauca',
    category: 'Yer Örtücü',
    waterNeed: 'Düşük',
    sunNeed: 'Tam Güneş',
    climateZones: ['Ege-Marmara', 'Akdeniz', 'İç Anadolu', 'Karadeniz'],
    image: '/images/postImg/proje2.jpeg',
    description: 'Gümüşi mavi küremsi yapraklarıyla malç ve beyaz tamburlanmış çakıl zeminlerde modern kontrast yaratır.',
    purpose: 'Modern kaya bahçeleri ve aydınlatma armatür çevreleri.'
  },
  {
    id: 'acer-palmatum',
    name: 'Japon Akçaağacı (Kırmızı Yapraklı)',
    botanicalName: 'Acer palmatum Atropurpureum',
    category: 'Ağaç',
    waterNeed: 'Orta',
    sunNeed: 'Yarı Gölge',
    climateZones: ['Ege-Marmara', 'Karadeniz', 'İç Anadolu'],
    image: '/images/postImg/iletisim.jpeg',
    description: 'Sonbaharda ateş kırmızısına dönen zarif yaprak formuyla lüks villa avlularının gözbebeği.',
    purpose: 'Süs havuzu kenarı ve gölgeli dinlenme verandaları.'
  }
];
