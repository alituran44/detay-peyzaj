import React from 'react';

// Visa Logo
export const VisaLogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <svg className={className} viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="32" rx="4" fill="#FFFFFF" />
    <path
      d="M19.46 21.36L21.6 8.36H24.96L22.82 21.36H19.46ZM34.2 8.66C33.56 8.42 32.54 8.16 31.28 8.16C27.96 8.16 25.62 9.9 25.6 12.4C25.58 14.24 27.24 15.26 28.52 15.88C29.82 16.52 30.26 16.92 30.26 17.48C30.26 18.34 29.22 18.72 28.26 18.72C26.78 18.72 25.96 18.48 24.8 17.96L24.32 17.74L23.82 20.84C24.66 21.22 26.22 21.56 27.84 21.58C31.36 21.58 33.68 19.86 33.72 17.18C33.74 15.12 32.36 14.04 30.64 13.22C29.42 12.62 28.68 12.22 28.68 11.58C28.68 11.02 29.32 10.42 30.68 10.42C31.8 10.4 32.62 10.64 33.24 10.9L33.6 11.06L34.2 8.66ZM40.82 8.36H38.22C37.42 8.36 36.8 8.6 36.44 9.44L31.14 21.36H34.68L35.38 19.42H39.72L40.12 21.36H43.24L40.82 8.36ZM36.36 16.74L38.08 12.02L39.06 16.74H36.36ZM16.48 8.36L13.28 17.22L12.92 15.42C12.32 13.4 10.5 11.18 8.44 10.1L11.36 21.36H14.94L20.26 8.36H16.48ZM10.54 8.36H5.16L5.1 8.62C9.06 9.62 12.56 12.16 13.62 15.14L12.38 8.9C12.16 8.5 11.46 8.36 10.54 8.36Z"
      fill="#1A1F71"
    />
  </svg>
);

// Mastercard Logo
export const MastercardLogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <svg className={className} viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="32" rx="4" fill="#FFFFFF" />
    <circle cx="19" cy="16" r="9" fill="#EB001B" />
    <circle cx="29" cy="16" r="9" fill="#F79E1B" />
    <path
      d="M24 9.92A8.96 8.96 0 0 1 27.24 16 8.96 8.96 0 0 1 24 22.08 8.96 8.96 0 0 1 20.76 16 8.96 8.96 0 0 1 24 9.92Z"
      fill="#FF5F00"
    />
  </svg>
);

// Paynkolay Logo (Aktif Bank Güvenli Ödeme Altyapısı)
export const PaynkolayLogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <svg className={className} viewBox="0 0 96 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="96" height="32" rx="4" fill="#FFFFFF" />
    <rect x="5" y="6" width="20" height="20" rx="4" fill="#0A2540" />
    <path
      d="M10 11h4.5c1.4 0 2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5H10v-5zm0 2v1h4.5c.3 0 .5-.2.5-.5s-.2-.5-.5-.5H10z"
      fill="#F97316"
    />
    <circle cx="16" cy="20" r="1.5" fill="#00D4B2" />
    <text
      x="29"
      y="21"
      fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      fontSize="12.5"
      fontWeight="900"
      fill="#0A2540"
      letterSpacing="-0.3"
    >
      pay<tspan fill="#F97316">n</tspan>kolay
    </text>
  </svg>
);

// 256-Bit SSL Security Badge
export const SSLBadge: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <svg className={className} viewBox="0 0 115 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="115" height="32" rx="4" fill="#131915" stroke="#ea580c" strokeWidth="1" />
    <path
      d="M14 11a3 3 0 0 0-3 3v2h-1v7h8v-7h-1v-2a3 3 0 0 0-3-3zm1.5 5h-3v-2a1.5 1.5 0 0 1 3 0v2z"
      fill="#ea580c"
    />
    <text x="25" y="15" fontFamily="sans-serif" fontSize="8" fontWeight="bold" fill="#ea580c">
      256-BIT SSL
    </text>
    <text x="25" y="23" fontFamily="sans-serif" fontSize="7" fontWeight="medium" fill="#94a3b8">
      GÜVENLİ ÖDEME
    </text>
  </svg>
);
