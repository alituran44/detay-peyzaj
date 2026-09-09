export interface CityClimateData {
  city: string;
  annualRainfallMm: number;
  sunshineHoursPerYear: number;
  frostRiskDays: number;
  climateZone: 'Ege-Marmara' | 'Akdeniz' | 'İç Anadolu' | 'Karadeniz' | 'Doğu Anadolu' | 'Güneydoğu';
  estimatedWaterSavingsPercent: number;
  recommendedIrrigationType: string;
  lat: number;
  lon: number;
}

export const CITY_CLIMATE_DATABASE: Record<string, CityClimateData> = {
  'Çanakkale': {
    city: 'Çanakkale',
    annualRainfallMm: 625,
    sunshineHoursPerYear: 2650,
    frostRiskDays: 12,
    climateZone: 'Ege-Marmara',
    estimatedWaterSavingsPercent: 48,
    recommendedIrrigationType: 'Rotor + Damlama Hibrit Hat',
    lat: 40.1553,
    lon: 26.4142
  },
  'İstanbul': {
    city: 'İstanbul',
    annualRainfallMm: 790,
    sunshineHoursPerYear: 2400,
    frostRiskDays: 18,
    climateZone: 'Ege-Marmara',
    estimatedWaterSavingsPercent: 42,
    recommendedIrrigationType: 'Otomatik Yağmurlama + Nem Sensörü',
    lat: 41.0082,
    lon: 28.9784
  },
  'İzmir': {
    city: 'İzmir',
    annualRainfallMm: 690,
    sunshineHoursPerYear: 2980,
    frostRiskDays: 4,
    climateZone: 'Ege-Marmara',
    estimatedWaterSavingsPercent: 52,
    recommendedIrrigationType: 'Basınç Dengelemeli Damlama + MP Rotator',
    lat: 38.4237,
    lon: 27.1428
  },
  'Balıkesir': {
    city: 'Balıkesir',
    annualRainfallMm: 580,
    sunshineHoursPerYear: 2550,
    frostRiskDays: 22,
    climateZone: 'Ege-Marmara',
    estimatedWaterSavingsPercent: 46,
    recommendedIrrigationType: 'Otomatik Zonlamalı Rotor Planı',
    lat: 39.6484,
    lon: 27.8826
  },
  'Antalya': {
    city: 'Antalya',
    annualRainfallMm: 1050,
    sunshineHoursPerYear: 3100,
    frostRiskDays: 1,
    climateZone: 'Akdeniz',
    estimatedWaterSavingsPercent: 55,
    recommendedIrrigationType: 'Akıllı Evapotranspirasyon Kontrollü Sulama',
    lat: 36.8969,
    lon: 30.7133
  },
  'Muğla': {
    city: 'Muğla (Bodrum / Fethiye)',
    annualRainfallMm: 1100,
    sunshineHoursPerYear: 3050,
    frostRiskDays: 3,
    climateZone: 'Akdeniz',
    estimatedWaterSavingsPercent: 54,
    recommendedIrrigationType: 'Damlama + Mikro Sprey Hatları',
    lat: 37.2153,
    lon: 28.3636
  },
  'Bursa': {
    city: 'Bursa',
    annualRainfallMm: 710,
    sunshineHoursPerYear: 2450,
    frostRiskDays: 25,
    climateZone: 'Ege-Marmara',
    estimatedWaterSavingsPercent: 44,
    recommendedIrrigationType: 'Çim Alan Rotor + Çalı Damlama',
    lat: 40.1885,
    lon: 29.0610
  },
  'Ankara': {
    city: 'Ankara',
    annualRainfallMm: 415,
    sunshineHoursPerYear: 2600,
    frostRiskDays: 68,
    climateZone: 'İç Anadolu',
    estimatedWaterSavingsPercent: 58,
    recommendedIrrigationType: 'Kök Bölgesi Derin Damlama + Don Tahliye Vanası',
    lat: 39.9334,
    lon: 32.8597
  }
};

export async function fetchLiveWeatherData(lat = 40.1553, lon = 26.4142) {
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`);
    if (!res.ok) throw new Error('Hava durumu verisi alınamadı');
    return await res.json();
  } catch (err) {
    console.error('Open-Meteo API hatası:', err);
    return null;
  }
}
