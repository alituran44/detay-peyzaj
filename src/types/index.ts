export interface SelectedServices {
  landscapeProject: boolean; // 12.000 TL / dönüm
  visual3D: boolean;         // 12.000 TL / dönüm
  irrigationProject: boolean;// 6.000 TL / dönüm
}

export interface PricingBreakdown {
  areaM2: number;
  areaDonum: number;
  basePrice: number;
  discountRate: number;
  discountAmount: number;
  shippingFee: number;
  finalPrice: number;
  pricePerM2: number;
  services: SelectedServices;
  shippingOption: boolean;
}

export type PricingResult = PricingBreakdown;

export interface StyleOption {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
}

export interface FeatureOption {
  id: string;
  name: string;
  category: 'water' | 'structures' | 'flora' | 'recreation' | 'lighting';
  icon: string;
  popular?: boolean;
}

export interface PortfolioProject {
  id: string;
  slug?: string;
  title: string;
  category: 'ruhsat' | 'visual3d' | 'irrigation' | 'all';
  categoryName: string;
  location: string;
  area: string;
  duration: string;
  mainImage: string;
  altText?: string;
  instagramPostUrl?: string;
  likesCount?: number;
  gallery: string[];
  description: string;
  features: string[];
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  image: string;
  benefits: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  comment: string;
  rating: number;
  projectArea: string;
  projectStyle: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface InvoiceInfo {
  type: 'bireysel' | 'kurumsal';
  fullName: string;
  tcKimlikNo?: string;
  companyName?: string;
  taxOffice?: string;
  taxNumber?: string;
  email: string;
  phone: string;
  city: string;
  district: string;
  fullAddress: string;
  postalCode?: string;
}

export interface OrderFormData {
  areaM2: number;
  selectedServices: SelectedServices;
  selectedStyle: string;
  selectedFeatures: string[];
  documents: {
    titleDeed?: File | null;
    sketchPlan?: File | null;
    receipt?: File | null;
    photos: File[];
  };
  shippingOption: boolean;
  notes: string;
  invoice: InvoiceInfo;
  paymentMethod: 'credit_card' | 'bank_transfer';
}
