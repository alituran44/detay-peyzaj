export interface CustomerReview {
  id: string;
  orderId?: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  comment: string;
  rating: number;
  projectArea: string;
  projectStyle: string;
  createdAt: string;
  isVerified: boolean;
}

export const INITIAL_TESTIMONIALS: CustomerReview[] = [
  {
    id: 't-1',
    name: 'Dr. Mehmet Yılmaz',
    role: 'Villa Sahibi',
    location: 'Çanakkale / Merkez',
    avatar: '/images/acardion/2.jpg',
    comment: 'Arsamızın krokisini ve cep telefonuyla çektiğimiz 3 videoyu sisteme yükledik. 4. günde gelen 3D renderlar, ruhsat paftası ve bitki listesi tek kelimeyle kusursuzdu. Müteahhidimize teslim ettik ve sıfır hatayla uygulattık.',
    rating: 5,
    projectArea: '1.850 m²',
    projectStyle: 'Modern Villa',
    createdAt: '2026-08-15T10:00:00.000Z',
    isVerified: true,
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
    projectStyle: 'Doğal Taş Bahçe',
    createdAt: '2026-08-20T14:30:00.000Z',
    isVerified: true,
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
    projectStyle: 'Rustik Bağ Evi',
    createdAt: '2026-08-28T09:15:00.000Z',
    isVerified: true,
  },
];

const STORAGE_KEY = 'detay_customer_reviews';

export function getCustomerReviews(): CustomerReview[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.error('Failed to parse customer reviews:', e);
    }
  }
  return INITIAL_TESTIMONIALS;
}

export function saveCustomerReview(review: Omit<CustomerReview, 'id' | 'createdAt' | 'isVerified'> & { orderId?: string; isVerified?: boolean }): CustomerReview {
  const existing = getCustomerReviews();
  const newReview: CustomerReview = {
    ...review,
    id: 'rev-' + Date.now(),
    createdAt: new Date().toISOString(),
    isVerified: review.isVerified ?? true,
    avatar: review.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  };

  const updated = [newReview, ...existing];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('reviews_updated'));
  return newReview;
}

export function deleteCustomerReview(reviewId: string): void {
  const existing = getCustomerReviews();
  const updated = existing.filter((r) => r.id !== reviewId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('reviews_updated'));
}

export function hasUserReviewedOrder(orderId: string): boolean {
  const existing = getCustomerReviews();
  return existing.some((r) => r.orderId === orderId);
}
