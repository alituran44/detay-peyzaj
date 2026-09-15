import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthUser, UserRole, StoredOrder, ProjectStatus, CustomerUploadedDoc, ProjectFile, ProjectTask } from '../types/auth';
import { getStoredMailTemplates, renderTemplateText } from '../utils/mailService';
import { getDefaultTasksForOrder } from '../utils/taskUtils';

interface RegisteredUserRecord {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  password?: string;
  createdAt: string;
}

interface VerificationRecord {
  code: string;
  expiresAt: number;
}

interface AuthContextType {
  user: AuthUser | null;
  orders: StoredOrder[];
  login: (email: string, pass: string) => { success: boolean; role?: UserRole; user?: AuthUser };
  loginWithGoogle: (customEmail?: string, customName?: string, avatar?: string, markVerified?: boolean) => { role: UserRole; user: AuthUser };
  registerCustomer: (data: { email: string; fullName: string; phone?: string; password?: string }) => { success: boolean; error?: string };
  loginAsDemoCustomer: () => { role: UserRole; user: AuthUser };
  loginAsDemoAdmin: () => { role: UserRole; user: AuthUser };
  logout: () => void;
  sendVerificationCode: (email: string, userName?: string) => Promise<{ success: boolean; message: string; debugCode?: string }>;
  verifyEmailCode: (email: string, code: string) => boolean;
  sendPasswordResetCode: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPasswordWithCode: (email: string, code: string, newPass: string) => { success: boolean; message?: string };
  isEmailVerified: (email?: string) => boolean;
  createOrder: (orderData: Omit<StoredOrder, 'id' | 'createdAt' | 'status' | 'progressPercent' | 'customerDocuments' | 'deliverables'> & { customerDocuments?: CustomerUploadedDoc[] }) => StoredOrder;
  updateOrderStatus: (orderId: string, newStatus: ProjectStatus) => void;
  updateOrder: (orderId: string, updatedData: Partial<StoredOrder>) => void;
  addDeliverableToOrder: (orderId: string, file: Omit<ProjectFile, 'uploadedAt' | 'downloadUrl'>) => void;
  addCustomerDocument: (orderId: string, doc: Omit<CustomerUploadedDoc, 'id' | 'uploadedAt'>) => void;
  deleteCustomerDocument: (orderId: string, docId: string) => void;
  updateOrderTasks: (orderId: string, tasks: ProjectTask[]) => void;
  toggleTaskStatus: (orderId: string, taskId: string, newStatus: 'bekliyor' | 'devam_ediyor' | 'bitti') => void;
  addTaskToOrder: (orderId: string, title: string) => void;
  issueInvoice: (orderId: string, customNumber?: string, invoiceUrl?: string, invoiceFileName?: string) => string;
  getUserOrders: () => StoredOrder[];
  clearAllOrders: () => void;
  deleteOrder: (orderId: string) => void;
  refreshCloudOrders: () => Promise<void>;
}

const INITIAL_DEMO_ORDERS: StoredOrder[] = [];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('detay_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [verifiedEmails, setVerifiedEmails] = useState<string[]>(() => {
    const saved = localStorage.getItem('detay_verified_emails');
    return saved ? JSON.parse(saved) : ['admin@detaypeyzaj.com.tr', 'peyzajdetay@gmail.com'];
  });

  const [verificationCodes, setVerificationCodes] = useState<Record<string, VerificationRecord>>({});

  const [orders, setOrders] = useState<StoredOrder[]>(() => {
    // Clear legacy demo orders
    localStorage.removeItem('detay_orders_v2');
    localStorage.removeItem('detay_orders');
    const saved = localStorage.getItem('detay_orders_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((o: StoredOrder) => o.id !== 'DP-2026-8492' && !o.id.startsWith('DP-DEMO-'));
        }
      } catch {
        return [];
      }
    }
    return INITIAL_DEMO_ORDERS;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('detay_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('detay_auth_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('detay_verified_emails', JSON.stringify(verifiedEmails));
  }, [verifiedEmails]);

  useEffect(() => {
    localStorage.setItem('detay_orders_v3', JSON.stringify(orders));
  }, [orders]);

  const isEmailVerified = (email?: string): boolean => {
    const checkEmail = (email || user?.email || '').trim().toLowerCase();
    if (!checkEmail) return false;
    return verifiedEmails.includes(checkEmail);
  };

  const loginWithGoogle = (
    customEmail?: string,
    customName?: string,
    avatar?: string,
    markVerified?: boolean
  ): { role: UserRole; user: AuthUser } => {
    const email = (customEmail || 'peyzajdetay@gmail.com').trim().toLowerCase();
    const isAdmin = email === 'peyzajdetay@gmail.com' || email === 'admin@detaypeyzaj.com.tr';
    const fullName = customName || (isAdmin ? 'Hasan Hüseyin Yıldırım (Peyzaj Mimarı)' : (customEmail ? customEmail.split('@')[0].toUpperCase() : 'Google Müşterisi'));

    const isVerified = markVerified !== undefined ? markVerified : verifiedEmails.includes(email);

    const googleUser: AuthUser = {
      id: isAdmin ? 'admin-1' : `google-${Date.now()}`,
      email,
      fullName,
      role: isAdmin ? 'admin' : 'customer',
      authProvider: 'google',
      avatar: avatar || undefined,
      isEmailVerified: isVerified,
      registeredAt: new Date().toISOString(),
    };

    setUser(googleUser);
    if (isVerified) {
      setVerifiedEmails((prev: string[]) => (prev.includes(email) ? prev : [...prev, email]));
    }
    return { role: googleUser.role, user: googleUser };
  };

  const registerCustomer = (data: { email: string; fullName: string; phone?: string; password?: string }): { success: boolean; error?: string } => {
    const normalizedEmail = data.email.trim().toLowerCase();

    if (!normalizedEmail || !data.fullName.trim()) {
      return { success: false, error: 'Lütfen ad soyad ve geçerli bir e-posta adresi girin.' };
    }

    const registeredUsersStr = localStorage.getItem('detay_registered_users');
    const registeredUsers: RegisteredUserRecord[] = registeredUsersStr ? JSON.parse(registeredUsersStr) : [];

    const existing = registeredUsers.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      // User exists, log them in
      const authUser: AuthUser = {
        id: existing.id,
        email: existing.email,
        fullName: existing.fullName,
        role: 'customer',
        phone: existing.phone || data.phone,
        authProvider: 'local',
        isEmailVerified: verifiedEmails.includes(normalizedEmail),
      };
      setUser(authUser);
      return { success: true };
    }

    const newRecord: RegisteredUserRecord = {
      id: `cust-${Date.now()}`,
      email: normalizedEmail,
      fullName: data.fullName.trim(),
      phone: data.phone?.trim() || '',
      password: data.password || '',
      createdAt: new Date().toISOString(),
    };

    registeredUsers.push(newRecord);
    localStorage.setItem('detay_registered_users', JSON.stringify(registeredUsers));

    const authUser: AuthUser = {
      id: newRecord.id,
      email: newRecord.email,
      fullName: newRecord.fullName,
      role: 'customer',
      phone: newRecord.phone,
      authProvider: 'local',
      isEmailVerified: verifiedEmails.includes(normalizedEmail),
      registeredAt: newRecord.createdAt,
    };

    setUser(authUser);
    return { success: true };
  };

  const sendVerificationCode = async (email: string, userName?: string): Promise<{ success: boolean; message: string; debugCode?: string }> => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      return { success: false, message: 'Geçersiz e-posta adresi.' };
    }

    // Generate 6-digit random OTP code
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 mins

    setVerificationCodes((prev) => ({
      ...prev,
      [normalizedEmail]: { code: generatedCode, expiresAt },
    }));

    // Send via API endpoint
    try {
      const templates = getStoredMailTemplates();
      const activationTpl = templates.find((t) => t.id === 'activation_code');
      const recipientName = userName || user?.fullName || normalizedEmail.split('@')[0] || 'Değerli Müşterimiz';

      const customTemplate = activationTpl
        ? {
            subject: renderTemplateText(activationTpl.subject, { MUSTERI_ADI: recipientName, KOD: generatedCode, EPOSTA: normalizedEmail }),
            heading: renderTemplateText(activationTpl.heading, { MUSTERI_ADI: recipientName, KOD: generatedCode, EPOSTA: normalizedEmail }),
            badge: renderTemplateText(activationTpl.badge, { MUSTERI_ADI: recipientName, KOD: generatedCode, EPOSTA: normalizedEmail }),
            badgeColor: activationTpl.badgeColor,
            bodyContent: renderTemplateText(activationTpl.bodyContent, { MUSTERI_ADI: recipientName, KOD: generatedCode, EPOSTA: normalizedEmail }),
            buttonText: renderTemplateText(activationTpl.buttonText, { MUSTERI_ADI: recipientName, KOD: generatedCode, EPOSTA: normalizedEmail }),
            buttonUrl: activationTpl.buttonUrl,
            footerNote: renderTemplateText(activationTpl.footerNote, { MUSTERI_ADI: recipientName, KOD: generatedCode, EPOSTA: normalizedEmail }),
          }
        : undefined;

      await fetch('/api/send-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: normalizedEmail,
          code: generatedCode,
          userName: recipientName,
          customTemplate,
        }),
      });
    } catch (err) {
      console.warn('Direct API verification call handled:', err);
    }

    return {
      success: true,
      message: `${normalizedEmail} adresinize 6 haneli doğrulama kodu iletildi. Lütfen gelen kutunuzu (ve spam klasörünü) kontrol ediniz.`,
      debugCode: generatedCode,
    };
  };

  const verifyEmailCode = (email: string, inputCode: string): boolean => {
    const normalizedEmail = email.trim().toLowerCase();
    const cleanCode = inputCode.trim();

    const record = verificationCodes[normalizedEmail];
    
    // Strict match against generated code
    const isValid = Boolean(record && record.code === cleanCode && Date.now() <= record.expiresAt);

    if (isValid) {
      setVerifiedEmails((prev: string[]) => (prev.includes(normalizedEmail) ? prev : [...prev, normalizedEmail]));
      if (user && user.email.toLowerCase() === normalizedEmail) {
        setUser((prev: AuthUser | null) => (prev ? { ...prev, isEmailVerified: true } : null));
      }
      return true;
    }

    return false;
  };

  const sendPasswordResetCode = async (email: string): Promise<{ success: boolean; message: string }> => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      return { success: false, message: 'Lütfen geçerli bir e-posta adresi giriniz.' };
    }

    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000;

    setVerificationCodes((prev) => ({
      ...prev,
      [normalizedEmail]: { code: generatedCode, expiresAt },
    }));

    try {
      const templates = getStoredMailTemplates();
      const resetTpl = templates.find((t) => t.id === 'password_reset');
      const recipientName = normalizedEmail.split('@')[0] || 'Değerli Müşterimiz';

      const customTemplate = resetTpl
        ? {
            subject: renderTemplateText(resetTpl.subject, { MUSTERI_ADI: recipientName, KOD: generatedCode, EPOSTA: normalizedEmail }),
            heading: renderTemplateText(resetTpl.heading, { MUSTERI_ADI: recipientName, KOD: generatedCode, EPOSTA: normalizedEmail }),
            badge: renderTemplateText(resetTpl.badge, { MUSTERI_ADI: recipientName, KOD: generatedCode, EPOSTA: normalizedEmail }),
            badgeColor: resetTpl.badgeColor,
            bodyContent: renderTemplateText(resetTpl.bodyContent, { MUSTERI_ADI: recipientName, KOD: generatedCode, EPOSTA: normalizedEmail }),
            buttonText: renderTemplateText(resetTpl.buttonText, { MUSTERI_ADI: recipientName, KOD: generatedCode, EPOSTA: normalizedEmail }),
            buttonUrl: resetTpl.buttonUrl,
            footerNote: renderTemplateText(resetTpl.footerNote, { MUSTERI_ADI: recipientName, KOD: generatedCode, EPOSTA: normalizedEmail }),
          }
        : undefined;

      await fetch('/api/send-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: normalizedEmail,
          code: generatedCode,
          userName: recipientName,
          customTemplate,
        }),
      });
    } catch (err) {
      console.warn('Password reset API call error:', err);
    }

    return {
      success: true,
      message: `${normalizedEmail} adresinize 6 haneli şifre sıfırlama kodu gönderildi. Lütfen gelen kutunuzu kontrol ediniz.`,
    };
  };

  const resetPasswordWithCode = (email: string, code: string, newPass: string): { success: boolean; message?: string } => {
    const normalizedEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();

    const record = verificationCodes[normalizedEmail];
    const isValid = Boolean(record && record.code === cleanCode && Date.now() <= record.expiresAt);

    if (!isValid) {
      return { success: false, message: 'Hatalı veya süresi dolmuş güvenlik kodu girdiniz.' };
    }

    if (newPass.length < 6) {
      return { success: false, message: 'Yeni şifreniz en az 6 karakter olmalıdır.' };
    }

    const registeredUsersStr = localStorage.getItem('detay_registered_users');
    const registeredUsers: RegisteredUserRecord[] = registeredUsersStr ? JSON.parse(registeredUsersStr) : [];
    const index = registeredUsers.findIndex((u) => u.email.toLowerCase() === normalizedEmail);

    if (index >= 0) {
      registeredUsers[index].password = newPass;
      localStorage.setItem('detay_registered_users', JSON.stringify(registeredUsers));
    } else {
      registeredUsers.push({
        id: `cust-${Date.now()}`,
        email: normalizedEmail,
        fullName: normalizedEmail.split('@')[0].toUpperCase(),
        password: newPass,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('detay_registered_users', JSON.stringify(registeredUsers));
    }

    // Auto verify email
    setVerifiedEmails((prev: string[]) => (prev.includes(normalizedEmail) ? prev : [...prev, normalizedEmail]));
    return { success: true, message: 'Şifreniz başarıyla güncellendi! Yeni şifrenizle giriş yapabilirsiniz.' };
  };

  const login = (email: string, pass: string): { success: boolean; role?: UserRole; user?: AuthUser } => {
    const normalizedEmail = email.trim().toLowerCase();
    
    // Admin Login - Direct zero-friction access, email verification check disabled for admin
    if (
      normalizedEmail === 'admin@detaypeyzaj.com.tr' ||
      normalizedEmail === 'peyzajdetay@gmail.com' ||
      normalizedEmail === 'hhyildirimm@gmail.com' ||
      normalizedEmail === 'admin'
    ) {
      const adminUser: AuthUser = {
        id: 'admin-1',
        email: normalizedEmail.includes('@') ? normalizedEmail : 'peyzajdetay@gmail.com',
        fullName: 'Hasan Hüseyin Yıldırım (Peyzaj Mimarı)',
        role: 'admin',
        phone: '+90 544 477 20 44',
        authProvider: 'local',
        isEmailVerified: true,
      };
      setUser(adminUser);
      setVerifiedEmails((prev: string[]) => (prev.includes(adminUser.email) ? prev : [...prev, adminUser.email]));
      return { success: true, role: 'admin', user: adminUser };
    }

    // Customer Login check from registered users or generic
    const registeredUsersStr = localStorage.getItem('detay_registered_users');
    const registeredUsers: RegisteredUserRecord[] = registeredUsersStr ? JSON.parse(registeredUsersStr) : [];
    const found = registeredUsers.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (found) {
      const customerUser: AuthUser = {
        id: found.id,
        email: found.email,
        fullName: found.fullName,
        role: 'customer',
        phone: found.phone,
        authProvider: 'local',
        isEmailVerified: verifiedEmails.includes(normalizedEmail),
      };
      setUser(customerUser);
      return { success: true, role: 'customer', user: customerUser };
    }

    if (pass.length >= 4) {
      const customerUser: AuthUser = {
        id: `cust-${Date.now()}`,
        email: normalizedEmail,
        fullName: normalizedEmail.split('@')[0].toUpperCase(),
        role: 'customer',
        authProvider: 'local',
        isEmailVerified: verifiedEmails.includes(normalizedEmail),
      };
      setUser(customerUser);
      return { success: true, role: 'customer', user: customerUser };
    }

    return { success: false };
  };

  const loginAsDemoCustomer = (): { role: UserRole; user: AuthUser } => {
    const demoEmail = 'demo@musteri.com';
    const demoUser: AuthUser = {
      id: 'cust-1',
      email: demoEmail,
      fullName: 'Ahmet Yılmaz',
      role: 'customer',
      phone: '0532 111 22 33',
      authProvider: 'demo',
      isEmailVerified: true,
    };
    setUser(demoUser);
    setVerifiedEmails((prev: string[]) => (prev.includes(demoEmail) ? prev : [...prev, demoEmail]));
    return { role: 'customer', user: demoUser };
  };

  const loginAsDemoAdmin = (): { role: UserRole; user: AuthUser } => {
    const adminUser: AuthUser = {
      id: 'admin-1',
      email: 'admin@detaypeyzaj.com.tr',
      fullName: 'Hasan Hüseyin Yıldırım (Peyzaj Mimarı)',
      role: 'admin',
      phone: '+90 544 477 20 44',
      authProvider: 'local',
      isEmailVerified: true,
    };
    setUser(adminUser);
    setVerifiedEmails((prev: string[]) => (prev.includes('admin@detaypeyzaj.com.tr') ? prev : [...prev, 'admin@detaypeyzaj.com.tr']));
    return { role: 'admin', user: adminUser };
  };

  const logout = () => {
    setUser(null);
  };

  const createOrder = (
    orderData: Omit<StoredOrder, 'id' | 'createdAt' | 'status' | 'progressPercent' | 'customerDocuments' | 'deliverables'> & {
      customerDocuments?: CustomerUploadedDoc[];
    }
  ): StoredOrder => {
    const newOrderId = `DP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: StoredOrder = {
      ...orderData,
      id: newOrderId,
      createdAt: new Date().toISOString(),
      status: '1_analiz',
      progressPercent: 20,
      customerDocuments: orderData.customerDocuments && orderData.customerDocuments.length > 0
        ? orderData.customerDocuments
        : [
            {
              id: `doc-${Date.now()}-1`,
              title: 'Mevcut Vaziyet / DWG Çizim Dosyası',
              category: 'kroki',
              fileName: 'Musteri-Vaziyet-Planı.dwg',
              fileSize: '6.2 MB',
              fileUrl: '#',
              uploadedAt: new Date().toISOString(),
            },
            {
              id: `doc-${Date.now()}-2`,
              title: 'Arazi Çevre Fotoğrafları & Video',
              category: 'fotograf',
              fileName: 'Arsa-Fotoğraflar-Paketi.zip',
              fileSize: '18.4 MB',
              fileUrl: '#',
              uploadedAt: new Date().toISOString(),
            },
          ],
      deliverables: [],
      tasks: getDefaultTasksForOrder(newOrderId, orderData.selectedServices),
      invoiceIssued: false,
    };

    setOrders((prev: StoredOrder[]) => [newOrder, ...prev]);
    syncOrderToCloud(newOrder);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: ProjectStatus) => {
    const progressMap: Record<ProjectStatus, number> = {
      '1_analiz': 20,
      '2_vaziyet_plan': 40,
      '3_bitki_sulama': 60,
      '4_3d_render': 80,
      '5_teslim_edildi': 100,
    };

    setOrders((prev: StoredOrder[]) => {
      const next = prev.map((o: StoredOrder) => {
        if (o.id === orderId) {
          const updated = { ...o, status: newStatus, progressPercent: progressMap[newStatus] };
          syncOrderToCloud(updated);
          return updated;
        }
        return o;
      });
      return next;
    });
  };

  const updateOrder = (orderId: string, updatedData: Partial<StoredOrder>) => {
    setOrders((prev: StoredOrder[]) => {
      const next = prev.map((o: StoredOrder) => {
        if (o.id === orderId) {
          const updated = {
            ...o,
            ...updatedData,
            invoice: updatedData.invoice
              ? { ...o.invoice, ...updatedData.invoice }
              : o.invoice,
          };
          syncOrderToCloud(updated);
          return updated;
        }
        return o;
      });
      return next;
    });
  };

  const addDeliverableToOrder = (
    orderId: string,
    file: Omit<ProjectFile, 'uploadedAt' | 'downloadUrl'>
  ) => {
    setOrders((prev: StoredOrder[]) => {
      const next = prev.map((o: StoredOrder) => {
        if (o.id === orderId) {
          const newDeliverables = [
            ...(o.deliverables || []),
            {
              ...file,
              id: `deliv-${Date.now()}`,
              downloadUrl: `/api/download-file?orderId=${encodeURIComponent(orderId)}&fileName=${encodeURIComponent(file.name)}`,
              uploadedAt: new Date().toISOString(),
            },
          ];
          const updated = { ...o, deliverables: newDeliverables };
          syncOrderToCloud(updated);
          return updated;
        }
        return o;
      });
      return next;
    });
  };

  const addCustomerDocument = (
    orderId: string,
    doc: Omit<CustomerUploadedDoc, 'id' | 'uploadedAt'>
  ) => {
    setOrders((prev: StoredOrder[]) => {
      const next = prev.map((o: StoredOrder) => {
        if (o.id === orderId) {
          const newDocs = [
            ...(o.customerDocuments || []),
            {
              ...doc,
              id: `doc-${Date.now()}`,
              uploadedAt: new Date().toISOString(),
              fileUrl: `/api/download-file?orderId=${encodeURIComponent(orderId)}&fileName=${encodeURIComponent(doc.fileName)}`,
            },
          ];
          const updated = { ...o, customerDocuments: newDocs };
          syncOrderToCloud(updated);
          return updated;
        }
        return o;
      });
      return next;
    });
  };

  const deleteCustomerDocument = (orderId: string, docId: string) => {
    setOrders((prev: StoredOrder[]) => {
      const next = prev.map((o: StoredOrder) => {
        if (o.id === orderId) {
          const updated = {
            ...o,
            customerDocuments: (o.customerDocuments || []).filter((d) => d.id !== docId),
          };
          syncOrderToCloud(updated);
          return updated;
        }
        return o;
      });
      return next;
    });
  };

  const issueInvoice = (
    orderId: string,
    customNumber?: string,
    invoiceUrl?: string,
    invoiceFileName?: string
  ): string => {
    const invNo = customNumber?.trim() || `GIB2026${Math.floor(100000000 + Math.random() * 900000000)}`;
    setOrders((prev: StoredOrder[]) => {
      const next = prev.map((o: StoredOrder) => {
        if (o.id === orderId) {
          const updated = {
            ...o,
            invoiceIssued: true,
            invoiceNumber: invNo,
            invoiceDate: new Date().toISOString().split('T')[0],
            invoiceUrl: invoiceUrl || `/api/download-file?orderId=${encodeURIComponent(orderId)}&fileName=${encodeURIComponent(invoiceFileName || `E-Fatura-${invNo}.pdf`)}`,
            invoiceFileName: invoiceFileName || `E-Fatura-${invNo}.pdf`,
          };
          syncOrderToCloud(updated);
          return updated;
        }
        return o;
      });
      return next;
    });
    return invNo;
  };

  const updateOrderTasks = (orderId: string, tasks: ProjectTask[]) => {
    setOrders((prev: StoredOrder[]) => {
      const next = prev.map((o: StoredOrder) => {
        if (o.id === orderId) {
          const total = tasks.length;
          const completed = tasks.filter((t) => t.status === 'bitti').length;
          const progressPercent = total > 0 ? Math.round((completed / total) * 100) : o.progressPercent;
          const updated = {
            ...o,
            tasks,
            progressPercent,
            status: progressPercent === 100 ? '5_teslim_edildi' : o.status,
          };
          syncOrderToCloud(updated);
          return updated;
        }
        return o;
      });
      return next;
    });
  };

  const toggleTaskStatus = (
    orderId: string,
    taskId: string,
    newStatus: 'bekliyor' | 'devam_ediyor' | 'bitti'
  ) => {
    setOrders((prev: StoredOrder[]) => {
      const next = prev.map((o: StoredOrder) => {
        if (o.id === orderId) {
          const currentTasks = o.tasks && o.tasks.length > 0
            ? o.tasks
            : getDefaultTasksForOrder(orderId, o.selectedServices);
          
          const updatedTasks = currentTasks.map((t) =>
            t.id === taskId
              ? { ...t, status: newStatus, updatedAt: new Date().toISOString() }
              : t
          );

          const total = updatedTasks.length;
          const completed = updatedTasks.filter((t) => t.status === 'bitti').length;
          const progressPercent = total > 0 ? Math.round((completed / total) * 100) : o.progressPercent;

          const updated = {
            ...o,
            tasks: updatedTasks,
            progressPercent,
            status: progressPercent === 100 ? '5_teslim_edildi' : (o.status === '5_teslim_edildi' && progressPercent < 100 ? '4_3d_render' : o.status),
          };
          syncOrderToCloud(updated);
          return updated;
        }
        return o;
      });
      return next;
    });
  };

  const addTaskToOrder = (orderId: string, title: string) => {
    if (!title.trim()) return;
    setOrders((prev: StoredOrder[]) => {
      const next = prev.map((o: StoredOrder) => {
        if (o.id === orderId) {
          const currentTasks = o.tasks && o.tasks.length > 0
            ? o.tasks
            : getDefaultTasksForOrder(orderId, o.selectedServices);
          
          const newTask: ProjectTask = {
            id: `task-${Date.now()}`,
            orderId,
            title: title.trim(),
            category: 'genel',
            status: 'devam_ediyor',
            updatedAt: new Date().toISOString(),
          };

          const updatedTasks = [...currentTasks, newTask];
          const total = updatedTasks.length;
          const completed = updatedTasks.filter((t) => t.status === 'bitti').length;
          const progressPercent = total > 0 ? Math.round((completed / total) * 100) : o.progressPercent;

          const updated = {
            ...o,
            tasks: updatedTasks,
            progressPercent,
          };
          syncOrderToCloud(updated);
          return updated;
        }
        return o;
      });
      return next;
    });
  };

  const syncOrderToCloud = async (order: StoredOrder) => {
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newOrder: order }),
      });
    } catch (e) {
      console.warn('[CLOUD SYNC] Failed to push order:', e);
    }
  };

  const syncDeleteOrderFromCloud = async (orderId: string, clearAll?: boolean) => {
    try {
      await fetch('/api/orders', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, clearAll }),
      });
    } catch (e) {
      console.warn('[CLOUD SYNC] Failed to delete order:', e);
    }
  };

  const refreshCloudOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const json = await res.json();
        if (json && Array.isArray(json.orders)) {
          const cleanOrders = json.orders.filter(
            (o: StoredOrder) => o.id !== 'DP-2026-8492' && !o.id.startsWith('DP-DEMO-')
          );
          setOrders(cleanOrders);
          localStorage.setItem('detay_orders_v3', JSON.stringify(cleanOrders));
        }
      }
    } catch (err) {
      console.warn('[AUTH CONTEXT] Cloud sync error:', err);
    }
  };

  useEffect(() => {
    refreshCloudOrders();
    const interval = setInterval(refreshCloudOrders, 4000); // 4s fast cross-device sync
    return () => clearInterval(interval);
  }, []);

  const getUserOrders = () => {
    if (!user) return [];
    if (user.role === 'admin') return orders;
    return orders.filter((o: StoredOrder) => o.userEmail.toLowerCase() === user.email.toLowerCase());
  };

  const clearAllOrders = () => {
    setOrders([]);
    localStorage.removeItem('detay_orders_v3');
    localStorage.removeItem('detay_orders_v2');
    localStorage.removeItem('detay_orders');
    localStorage.removeItem('detay_registered_users');
    localStorage.removeItem('detay_saved_customer_profile');
    syncDeleteOrderFromCloud('', true);
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev: StoredOrder[]) => prev.filter((o: StoredOrder) => o.id !== orderId));
    syncDeleteOrderFromCloud(orderId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        orders,
        login,
        loginWithGoogle,
        registerCustomer,
        loginAsDemoCustomer,
        loginAsDemoAdmin,
        logout,
        sendVerificationCode,
        verifyEmailCode,
        sendPasswordResetCode,
        resetPasswordWithCode,
        isEmailVerified,
        createOrder,
        updateOrderStatus,
        updateOrder,
        addDeliverableToOrder,
        addCustomerDocument,
        deleteCustomerDocument,
        updateOrderTasks,
        toggleTaskStatus,
        addTaskToOrder,
        issueInvoice,
        getUserOrders,
        clearAllOrders,
        deleteOrder,
        refreshCloudOrders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
