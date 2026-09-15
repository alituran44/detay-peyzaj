import type { SelectedServices, PricingBreakdown } from '../types';

export const SERVICE_RATES = {
  landscapeProject: 12000, // 12.000 TL / Dönüm (Kademeli İndirime Tabi)
  visual3D: 12000,         // 12.000 TL / Dönüm (Sabit Tarife)
  irrigationProject: 8000, // 8.000 TL / Dönüm (Sabit Tarife)
} as const;

export const SHIPPING_RATE = 1500; // 1.500 TL Fiziki Renkli Proje Baskı & Adrese Kargo Gönderimi

// Site ilk açıldığında yalnızca tek hizmet (Peyzaj Projesi) seçili gelir:
export const DEFAULT_SERVICES: SelectedServices = {
  landscapeProject: true,
  visual3D: false,
  irrigationProject: false,
};

export function getDiscountRate(areaM2: number): number {
  if (areaM2 <= 1000) return 0;   // 1 Dönüme kadar: %0
  if (areaM2 <= 2000) return 15;  // 1 - 2 Dönüm: %15 İndirim (Sadece Peyzaj Projesine)
  if (areaM2 <= 3000) return 20;  // 2 - 3 Dönüm: %20 İndirim (Sadece Peyzaj Projesine)
  return 25;                      // 3 - 4 Dönüm: %25 İndirim (Sadece Peyzaj Projesine)
}

export function calculatePricing(areaM2: number, services: SelectedServices, shippingOption: boolean = false): PricingBreakdown {
  // 1 dönüme (1000 m²) kadar taban alan 1 dönüm olarak ücretlendirilir (1 Dönüme kadar: 12.000 TL).
  // 1 dönüm üzeri projelerde gerçek dönüm hesabı ve kademeli indirimler uygulanır.
  const effectiveDonum = Math.max(1, areaM2 / 1000);
  const actualDonum = areaM2 / 1000;
  
  // 1. Peyzaj Projesi Tutarı ve İndirimi
  let landscapeBase = 0;
  let landscapeDiscount = 0;
  const discountRate = getDiscountRate(areaM2);

  if (services.landscapeProject) {
    landscapeBase = effectiveDonum * SERVICE_RATES.landscapeProject;
    landscapeDiscount = (landscapeBase * discountRate) / 100;
  }

  // 2. 3D Görsel Tasarım Tutarı (Sabit - İndirimsiz)
  let visual3DBase = 0;
  if (services.visual3D) {
    visual3DBase = effectiveDonum * SERVICE_RATES.visual3D;
  }

  // 3. Sulama Projesi Tutarı (Sabit - İndirimsiz)
  let irrigationBase = 0;
  if (services.irrigationProject) {
    irrigationBase = effectiveDonum * SERVICE_RATES.irrigationProject;
  }

  const basePrice = Math.round(landscapeBase + visual3DBase + irrigationBase);
  const discountAmount = Math.round(landscapeDiscount); // Sadece peyzaj projesinden düşer
  const shippingFee = shippingOption ? SHIPPING_RATE : 0;
  const finalPrice = basePrice - discountAmount + shippingFee;
  const pricePerM2 = areaM2 > 0 ? Math.round(finalPrice / areaM2) : 0;

  return {
    areaM2,
    areaDonum: Number(actualDonum.toFixed(2)),
    basePrice,
    discountRate: services.landscapeProject ? discountRate : 0,
    discountAmount,
    shippingFee,
    finalPrice,
    pricePerM2,
    services,
    shippingOption,
  };
}

export function formatTL(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(amount);
}
