import type { SelectedServices, InvoiceInfo } from './index';
export type { SelectedServices, InvoiceInfo };

export type UserRole = 'customer' | 'admin';

export type ProjectStatus = 
  | '1_analiz'        // 1. Gün: Arsa & Evrak Analizi
  | '2_vaziyet_plan'  // 2. Gün: AutoCAD Yapısal Plan
  | '3_bitki_sulama'  // 3. Gün: Bitkilendirme & Sulama
  | '4_3d_render'     // 4. Gün: 3D Modelleme & Render
  | '5_teslim_edildi';// 5. Gün: Teslim Edildi

export interface ProjectFile {
  id?: string;
  name: string;
  size: string;
  type: 'dwg' | 'pdf' | 'excel' | 'image' | 'zip';
  downloadUrl: string;
  uploadedAt: string;
}

export interface CustomerUploadedDoc {
  id: string;
  title: string;
  category: 'tapu' | 'kroki' | 'fotograf' | 'ek_belge' | 'dekont';
  fileName: string;
  fileSize: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface ProjectTask {
  id: string;
  orderId: string;
  title: string;
  category: string;
  status: 'bekliyor' | 'devam_ediyor' | 'bitti';
  updatedAt: string;
}

export interface StoredOrder {
  id: string; // DP-2026-XXXX
  userId: string;
  userEmail: string;
  createdAt: string;
  areaM2: number;
  selectedServices: SelectedServices;
  selectedStyle: string;
  status: ProjectStatus;
  progressPercent: number;
  totalPrice: number;
  shippingOption?: boolean;
  shippingFee?: number;
  isPaid: boolean;
  paymentMethod: 'credit_card' | 'bank_transfer';
  invoice: InvoiceInfo;
  notes?: string;
  customerDocuments: CustomerUploadedDoc[];
  deliverables: ProjectFile[];
  tasks?: ProjectTask[];
  invoiceIssued?: boolean;
  invoiceNumber?: string;
  invoiceDate?: string;
  invoiceUrl?: string;
  invoiceFileName?: string;
  revisionRequests?: string[];
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  authProvider?: 'google' | 'local' | 'demo';
  isEmailVerified?: boolean;
  registeredAt?: string;
}
