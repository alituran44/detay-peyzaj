import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  Download,
  Sparkles,
  MessageCircle,
  AlertCircle,
  Layers,
  UploadCloud,
  Plus,
  LogOut,
  Star,
  CheckCircle2,
  MessageSquare,
  Trash2,
  Edit3,
  Check,
  Truck,
  AlertTriangle,
  Mail,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatTL } from '../../utils/pricing';
import { hasUserReviewedOrder } from '../../utils/testimonialsService';
import { ReviewModal } from '../ReviewModal';
import type { StoredOrder } from '../../types/auth';

interface CustomerPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOrderWizard: () => void;
  onOpenAdminDashboard?: () => void;
}

export const CustomerPortalModal: React.FC<CustomerPortalModalProps> = ({
  isOpen,
  onClose,
  onOpenOrderWizard,
  onOpenAdminDashboard,
}) => {
  const {
    user,
    getUserOrders,
    addCustomerDocument,
    deleteCustomerDocument,
    updateOrder,
    deleteOrder,
    logout,
    sendVerificationCode,
    verifyEmailCode,
  } = useAuth();

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isAddingDoc, setIsAddingDoc] = useState<boolean>(false);
  const [newDocTitle, setNewDocTitle] = useState<string>('');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);

  // Portal OTP States
  const [portalOtpInput, setPortalOtpInput] = useState<string>('');
  const [portalOtpError, setPortalOtpError] = useState<string | null>(null);
  const [portalOtpSuccess, setPortalOtpSuccess] = useState<string | null>(null);
  const [isPortalSendingOtp, setIsPortalSendingOtp] = useState<boolean>(false);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editFormData, setEditFormData] = useState<{
    fullName: string;
    phone: string;
    city: string;
    district: string;
    fullAddress: string;
    notes: string;
    shippingOption: boolean;
  }>({
    fullName: '',
    phone: '',
    city: '',
    district: '',
    fullAddress: '',
    notes: '',
    shippingOption: false,
  });

  // Delete Confirmation State
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<boolean>(false);
  const [orderToDelete, setOrderToDelete] = useState<StoredOrder | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // If an admin user ever has CustomerPortalModal opened, immediately redirect to Admin Dashboard
  useEffect(() => {
    if (isOpen && user?.role === 'admin') {
      onClose();
      if (onOpenAdminDashboard) {
        onOpenAdminDashboard();
      }
    }
  }, [isOpen, user?.role, onClose, onOpenAdminDashboard]);

  const orders = getUserOrders();
  const activeOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  useEffect(() => {
    if (activeOrder) {
      setEditFormData({
        fullName: activeOrder.invoice.type === 'kurumsal' 
          ? (activeOrder.invoice.companyName || activeOrder.invoice.fullName)
          : activeOrder.invoice.fullName,
        phone: activeOrder.invoice.phone || '',
        city: activeOrder.invoice.city || '',
        district: activeOrder.invoice.district || '',
        fullAddress: activeOrder.invoice.fullAddress || '',
        notes: activeOrder.notes || '',
        shippingOption: !!activeOrder.shippingOption,
      });
    }
  }, [activeOrder?.id, isEditModalOpen]);

  const handlePortalSendOtp = async () => {
    if (!user?.email) return;
    setIsPortalSendingOtp(true);
    setPortalOtpError(null);
    await sendVerificationCode(user.email, user.fullName);
    setIsPortalSendingOtp(false);
  };

  const handlePortalVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;
    if (!portalOtpInput.trim()) {
      setPortalOtpError('Lütfen 6 haneli güvenlik kodunu giriniz.');
      return;
    }

    const valid = verifyEmailCode(user.email, portalOtpInput);
    if (valid) {
      setPortalOtpSuccess('✓ E-posta adresiniz başarıyla doğrulandı!');
      setPortalOtpError(null);
    } else {
      setPortalOtpError('Hatalı doğrulama kodu. Lütfen kontrol edip tekrar deneyiniz.');
    }
  };

  useEffect(() => {
    if (isOpen && user && !user.isEmailVerified) {
      handlePortalSendOtp();
    }
  }, [isOpen, user?.email, user?.isEmailVerified]);

  if (!isOpen || user?.role === 'admin') return null;

  const getStatusLabel = (status: string) => {
    switch (status) {
      case '1_analiz':
        return '1. Gün: Arsa & Evrak Analizi Yapılıyor';
      case '2_vaziyet_plan':
        return '2. Gün: AutoCAD Yapısal Vaziyet Planı Çiziliyor';
      case '3_bitki_sulama':
        return '3. Gün: Bitkilendirme & Sulama Zonlaması Hazırlanıyor';
      case '4_3d_render':
        return '4. Gün: 4K Fotogerçekçi 3D Renderlar Üretiliyor';
      case '5_teslim_edildi':
        return '5. Gün: Tamamlandı & İndirmeye Hazır';
      default:
        return 'İşleniyor';
    }
  };

  const handleUploadAdditionalDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim() || !activeOrder) return;

    const docItem = {
      title: newDocTitle.trim(),
      category: 'ek_belge' as const,
      fileName: `${newDocTitle.trim().replace(/\s+/g, '-')}.pdf`,
      fileSize: '3.2 MB',
      fileUrl: '#',
    };

    addCustomerDocument(activeOrder.id, docItem);

    // Send email alert to hhyildirimm@gmail.com & peyzajdetay@gmail.com
    try {
      await fetch('/api/send-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order: { id: activeOrder.id, isPaid: true },
          customerInfo: {
            name: (activeOrder.invoice.type === 'bireysel' ? activeOrder.invoice.fullName : activeOrder.invoice.companyName) || 'Müşteri',
            phone: activeOrder.invoice.phone || '-',
            email: activeOrder.invoice.email || activeOrder.userEmail,
            city: activeOrder.invoice.city || 'Çanakkale',
            district: activeOrder.invoice.district || 'Merkez',
            type: activeOrder.invoice.type,
          },
          services: ['Müşteri Portaldan Ek Belge / Not Ekledi'],
          areaM2: activeOrder.areaM2,
          totalPrice: formatTL(activeOrder.totalPrice),
          paymentMethod: activeOrder.paymentMethod,
          documents: [
            {
              title: `Ek Belge: ${docItem.title}`,
              fileName: docItem.fileName,
              fileSize: docItem.fileSize,
            },
          ],
          notes: `[PORTALDAN YENİ BELGE EKLENDİ] Müşteri "${docItem.title}" başlıklı yeni bir belge yükledi. Yönetici Masasından inceleyebilirsiniz.`,
        }),
      });
    } catch (err) {
      console.warn('Mail dispatch error:', err);
    }

    setNewDocTitle('');
    setIsAddingDoc(false);
    showFeedback('success', 'Ek belgeniz mimarımızın incelemesi için projeye eklendi ve bilgilendirme iletildi.');
  };

  const handleDeleteDoc = (docId: string, docTitle: string) => {
    if (!activeOrder) return;
    if (window.confirm(`"${docTitle}" belgesini projeden silmek istediğinize emin misiniz?`)) {
      deleteCustomerDocument(activeOrder.id, docId);
      showFeedback('success', `"${docTitle}" belgesi silindi.`);
    }
  };

  const handleOpenEditModal = () => {
    if (!activeOrder) return;
    setEditFormData({
      fullName: activeOrder.invoice.type === 'kurumsal' 
        ? (activeOrder.invoice.companyName || activeOrder.invoice.fullName)
        : activeOrder.invoice.fullName,
      phone: activeOrder.invoice.phone || '',
      city: activeOrder.invoice.city || '',
      district: activeOrder.invoice.district || '',
      fullAddress: activeOrder.invoice.fullAddress || '',
      notes: activeOrder.notes || '',
      shippingOption: !!activeOrder.shippingOption,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;

    const hadShipping = !!activeOrder.shippingOption;
    const nowShipping = editFormData.shippingOption;
    let newPrice = activeOrder.totalPrice;

    // Adjust price if shipping option changed
    if (!hadShipping && nowShipping) {
      newPrice += 1500;
    } else if (hadShipping && !nowShipping) {
      newPrice = Math.max(0, newPrice - 1500);
    }

    const updatedInvoice = {
      ...activeOrder.invoice,
      fullName: activeOrder.invoice.type === 'bireysel' ? editFormData.fullName : activeOrder.invoice.fullName,
      companyName: activeOrder.invoice.type === 'kurumsal' ? editFormData.fullName : activeOrder.invoice.companyName,
      phone: editFormData.phone,
      city: editFormData.city,
      district: editFormData.district,
      fullAddress: editFormData.fullAddress,
    };

    updateOrder(activeOrder.id, {
      notes: editFormData.notes,
      shippingOption: nowShipping,
      shippingFee: nowShipping ? 1500 : 0,
      totalPrice: newPrice,
      invoice: updatedInvoice,
    });

    setIsEditModalOpen(false);
    showFeedback('success', `${activeOrder.id} numaralı proje bilgileri başarıyla güncellendi.`);
  };

  const handlePromptDelete = (order: StoredOrder) => {
    setOrderToDelete(order);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!orderToDelete) return;
    const orderId = orderToDelete.id;
    deleteOrder(orderId);
    setIsDeleteConfirmOpen(false);
    setOrderToDelete(null);
    showFeedback('success', `${orderId} numaralı proje kaydı başarıyla silindi.`);
  };

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/90 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-5xl bg-obsidian-900 border border-orange-500/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Toast Feedback Notification */}
        {feedbackMsg && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-2xl bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs font-bold shadow-2xl flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="p-6 sm:px-8 border-b border-orange-950 flex items-center justify-between bg-obsidian-950">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-serif font-bold text-white">Müşteri Proje Portalı</h2>
                <span className="text-[10px] bg-orange-950 text-orange-300 border border-orange-700/60 px-2 py-0.5 rounded-full font-mono">
                  {user?.fullName || 'Müşteri'}
                </span>
              </div>
              <p className="text-xs text-slate-400">Canlı 5 günlük teslimat durumu, paftalarınız, düzenleme ve e-faturanız</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-red-300 hover:text-white bg-red-950/40 hover:bg-red-900 border border-red-800/60 flex items-center gap-1.5 cursor-pointer transition-all"
              title="Hesaptan Güvenli Çıkış Yap"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Çıkış Yap</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-obsidian-950 text-slate-400 hover:text-white border border-orange-950 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Grid or Email Verification Gate */}
        {!user?.isEmailVerified ? (
          <div className="p-8 sm:p-12 overflow-y-auto flex-1 flex items-center justify-center">
            <form onSubmit={handlePortalVerifyOtp} className="w-full max-w-md bg-obsidian-950 p-6 sm:p-8 rounded-3xl border-2 border-orange-500/60 shadow-2xl space-y-5 animate-fade-in">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 mx-auto">
                  <Mail className="w-7 h-7 animate-pulse" />
                </div>
                <h3 className="text-base font-serif font-bold text-white">E-Posta Doğrulaması Gereklidir</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Güvenliğiniz için <span className="text-orange-400 font-mono font-semibold">peyzajdetay@gmail.com</span> tarafından <strong className="text-white">{user?.email}</strong> adresinize 6 haneli onay kodu iletildi.
                </p>
              </div>

              {portalOtpError && (
                <div className="bg-rose-950/60 border border-rose-800/60 p-3 rounded-xl flex items-center gap-2 text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{portalOtpError}</span>
                </div>
              )}

              {portalOtpSuccess && (
                <div className="bg-emerald-950/60 border border-emerald-800/60 p-3 rounded-xl flex items-center gap-2 text-emerald-300 text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{portalOtpSuccess}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 text-center block">6 Haneli Doğrulama Kodunu Giriniz:</label>
                <input
                  type="text"
                  maxLength={6}
                  value={portalOtpInput}
                  onChange={(e) => setPortalOtpInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••••"
                  autoFocus
                  className="w-full bg-obsidian-900 border-2 border-orange-500/80 focus:border-orange-400 rounded-2xl p-4 text-center text-2xl font-mono text-white tracking-[0.4em] outline-none shadow-glow-sm"
                />
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={isPortalSendingOtp}
                  className="w-full py-3.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-glow transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Doğrula ve Projelere Eriş</span>
                </button>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={handlePortalSendOtp}
                    disabled={isPortalSendingOtp}
                    className="text-orange-400 hover:text-orange-300 font-medium cursor-pointer"
                  >
                    {isPortalSendingOtp ? 'Kod Gönderiliyor...' : 'Tekrar Kod Gönder'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    Farklı Hesapla Giriş Yap
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          /* Body Grid */
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 grid lg:grid-cols-12 gap-6">
          
          {/* Left Sidebar: Order History List */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Projelerim ({orders.length})</h3>
              <button
                onClick={() => {
                  onClose();
                  onOpenOrderWizard();
                }}
                className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" /> + Yeni Sipariş
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="p-6 rounded-2xl bg-obsidian-950 border border-orange-950 text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">Henüz kayıtlı bir projeniz bulunmuyor.</p>
              </div>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrderId(ord.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 relative group ${
                    activeOrder?.id === ord.id
                      ? 'bg-orange-950/40 border-orange-500/80 shadow-glow-sm'
                      : 'bg-obsidian-950 border-orange-950/80 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono font-bold text-white">{ord.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ord.status === '5_teslim_edildi'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-orange-950 text-orange-300 border border-orange-800'
                    }`}>
                      %{ord.progressPercent} Tamamlandı
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 font-medium">
                    {ord.areaM2} m² • {ord.invoice.city} / {ord.invoice.district}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="text-[11px] font-mono text-orange-400 font-bold">
                      {formatTL(ord.totalPrice)} (KDV Dahil)
                    </div>

                    {/* Quick Delete icon on list item */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePromptDelete(ord);
                      }}
                      className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/50 opacity-60 group-hover:opacity-100 transition-all cursor-pointer"
                      title="Projeyi Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Main Details: Active Order Tracking & Deliverables */}
          <div className="lg:col-span-8 space-y-6">
            {activeOrder ? (
              <div className="space-y-6">
                
                {/* Project Header Action Bar: Projeyi Düzenle & Projeyi Sil */}
                <div className="bg-obsidian-950 p-4 px-6 rounded-2xl border border-orange-950 flex flex-wrap items-center justify-between gap-3 shadow-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-orange-400">{activeOrder.id}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-300 font-medium">{activeOrder.areaM2} m² Peyzaj Projesi</span>
                    {activeOrder.shippingOption && (
                      <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                        <Truck className="w-3 h-3" /> Fiziki Kargo
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleOpenEditModal}
                      className="px-3.5 py-1.5 bg-orange-950/80 hover:bg-orange-900 border border-orange-600/80 text-orange-300 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-glow-sm transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-orange-400" />
                      <span>Projeyi Düzenle</span>
                    </button>

                    <button
                      onClick={() => handlePromptDelete(activeOrder)}
                      className="px-3.5 py-1.5 bg-red-950/40 hover:bg-red-900/80 border border-red-800/60 text-red-300 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      <span>Projeyi Sil</span>
                    </button>
                  </div>
                </div>

                {/* 5-Day Visual Progress Track */}
                <div className="bg-obsidian-950 p-6 rounded-3xl border border-orange-950 space-y-4 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-orange-950 pb-3">
                    <div>
                      <span className="text-[10px] text-orange-400 font-mono uppercase font-bold">Garantili Teslimat Takvimi</span>
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <span>{getStatusLabel(activeOrder.status)}</span>
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black font-mono text-orange-400">%{activeOrder.progressPercent}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3 bg-obsidian-900 rounded-full overflow-hidden border border-orange-950">
                    <div
                      className="h-full bg-gradient-to-r from-orange-600 to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${activeOrder.progressPercent}%` }}
                    />
                  </div>

                  {/* 5-Day Step Dots */}
                  <div className="grid grid-cols-5 gap-1 text-center text-[10px] font-mono text-slate-400">
                    <div className={activeOrder.progressPercent >= 20 ? 'text-orange-400 font-bold' : ''}>1. Gün (Analiz)</div>
                    <div className={activeOrder.progressPercent >= 40 ? 'text-orange-400 font-bold' : ''}>2. Gün (Plan)</div>
                    <div className={activeOrder.progressPercent >= 60 ? 'text-orange-400 font-bold' : ''}>3. Gün (Sulama)</div>
                    <div className={activeOrder.progressPercent >= 80 ? 'text-orange-400 font-bold' : ''}>4. Gün (3D)</div>
                    <div className={activeOrder.progressPercent >= 100 ? 'text-emerald-400 font-bold' : ''}>5. Gün (Teslim)</div>
                  </div>
                </div>

                {/* Ready Deliverables & Downloads */}
                <div className="bg-obsidian-950 p-6 rounded-3xl border border-orange-950 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                      <Download className="w-4 h-4 text-orange-400" />
                      <span>Teslim Edilen Çizim & Pafta Dosyaları</span>
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {activeOrder.deliverables?.length || 0} Dosya Hazır
                    </span>
                  </div>

                  {(!activeOrder.deliverables || activeOrder.deliverables.length === 0) ? (
                    <div className="p-4 rounded-xl bg-obsidian-900 border border-orange-950 text-center text-xs text-slate-400">
                      Mimarımız çizimleri hazırlıyor. Tamamlanan paftalar burada anında indirmeye açılacaktır.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {activeOrder.deliverables.map((file, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-obsidian-900 border border-orange-950 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-orange-400 shrink-0" />
                            <div>
                              <div className="text-xs font-bold text-white">{file.name}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{file.size} • {new Date(file.uploadedAt).toLocaleDateString('tr-TR')}</div>
                            </div>
                          </div>

                          <button
                            onClick={() => alert(`"${file.name}" başarıyla indiriliyor...`)}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 flex items-center gap-1.5 cursor-pointer shadow-sm"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>İndir</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Customer Review / Testimonial Feedback Card */}
                <div className="bg-obsidian-950 p-6 rounded-3xl border border-orange-950/80 hover:border-orange-500/40 transition-all space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Star className="w-5 h-5 fill-amber-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">Proje Deneyiminizi Değerlendirin</h4>
                          {hasUserReviewedOrder(activeOrder.id) && (
                            <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-700/60 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Yorumunuz Yayında
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">
                          {hasUserReviewedOrder(activeOrder.id)
                            ? 'Bu projeniz için yorumunuz ana sayfadaki müşteri yorumları arasında yayınlanmaktadır. Dilerseniz tekrar değerlendirebilirsiniz.'
                            : 'Teslim aldığınız AutoCAD çizimleri, 3D görseller ve hizmet sürecimiz hakkındaki görüşlerinizi ana sayfada paylaşın.'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsReviewModalOpen(true)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs shadow-glow flex items-center gap-2 cursor-pointer transition-all shrink-0 self-start sm:self-auto"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{hasUserReviewedOrder(activeOrder.id) ? 'Yorumu Güncelle' : '⭐ Yorum Yap & Puan Ver'}</span>
                    </button>
                  </div>
                </div>

                {/* Customer Uploaded Evraklar & Belge Yönetimi */}
                <div className="bg-obsidian-950 p-6 rounded-3xl border border-orange-950 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                      <UploadCloud className="w-4 h-4 text-orange-400" />
                      <span>Yüklediğiniz Arsa Belgeleri & Fotoğraflar ({activeOrder.customerDocuments?.length || 0})</span>
                    </h4>

                    <button
                      onClick={() => setIsAddingDoc(!isAddingDoc)}
                      className="px-3 py-1 bg-obsidian-900 hover:bg-orange-950 border border-orange-900 text-orange-300 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ek Belge Yükle</span>
                    </button>
                  </div>

                  {/* Add Document Form */}
                  {isAddingDoc && (
                    <form onSubmit={handleUploadAdditionalDoc} className="p-4 bg-obsidian-900 rounded-2xl border border-orange-950 space-y-3 animate-fade-in">
                      <label className="text-xs font-semibold text-slate-300">Yüklenecek Ek Belge / Fotoğraf Adı:</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newDocTitle}
                          onChange={(e) => setNewDocTitle(e.target.value)}
                          placeholder="Örn: Güncel İmar Durumu veya Bahçe Videosu"
                          className="flex-1 bg-obsidian-950 border border-orange-950 rounded-xl p-2.5 text-xs text-white focus:border-orange-500 outline-none"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold cursor-pointer shadow-glow-sm"
                        >
                          Yükle
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="grid sm:grid-cols-2 gap-3">
                    {activeOrder.customerDocuments?.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-3 rounded-xl bg-obsidian-900 border border-orange-950 flex items-center justify-between gap-3 text-xs group"
                      >
                        <div className="overflow-hidden">
                          <div className="font-bold text-white truncate">{doc.title}</div>
                          <div className="text-[10px] text-slate-400 font-mono truncate">{doc.fileName} ({doc.fileSize})</div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-emerald-400 text-[10px] font-semibold">✓ İletildi</span>
                          <button
                            onClick={() => handleDeleteDoc(doc.id, doc.title)}
                            className="p-1 text-slate-500 hover:text-red-400 hover:bg-red-950/40 rounded transition-all cursor-pointer"
                            title="Bu belgeyi sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Project Notes & Special Requests display */}
                {activeOrder.notes && (
                  <div className="bg-obsidian-950 p-6 rounded-3xl border border-orange-950 text-xs space-y-2">
                    <span className="font-bold text-orange-400 uppercase tracking-wider block">Proje Notlarınız & Mimari Talepleriniz:</span>
                    <p className="text-slate-300 italic bg-obsidian-900 p-3.5 rounded-xl border border-orange-950">
                      "{activeOrder.notes}"
                    </p>
                  </div>
                )}

                {/* Order Meta & Invoice & WhatsApp Communication */}
                <div className="grid sm:grid-cols-2 gap-4 bg-obsidian-950 p-6 rounded-3xl border border-orange-950 text-xs">
                  <div className="space-y-2 border-r border-orange-950/80 pr-4">
                    <span className="font-bold text-white uppercase tracking-wider block mb-1">E-Arşiv Fatura Bilgileri:</span>
                    <div><strong>Alıcı:</strong> {activeOrder.invoice.type === 'bireysel' ? activeOrder.invoice.fullName : activeOrder.invoice.companyName}</div>
                    <div><strong>Telefon:</strong> {activeOrder.invoice.phone || 'Belirtilmedi'}</div>
                    <div><strong>Teslimat Adresi:</strong> {activeOrder.invoice.fullAddress ? `${activeOrder.invoice.fullAddress} - ${activeOrder.invoice.district}/${activeOrder.invoice.city}` : `${activeOrder.invoice.district}/${activeOrder.invoice.city}`}</div>
                    
                    {activeOrder.invoiceIssued ? (
                      <>
                        <div><strong>Fatura No:</strong> <span className="font-mono text-emerald-400 font-bold">{activeOrder.invoiceNumber || 'GIB2026000008492'}</span></div>
                        {activeOrder.invoiceDate && <div><strong>Fatura Tarihi:</strong> <span className="text-slate-300">{activeOrder.invoiceDate}</span></div>}
                        {activeOrder.invoiceFileName && <div><strong>Belge:</strong> <span className="text-slate-300">{activeOrder.invoiceFileName}</span></div>}
                        <button
                          onClick={() => {
                            if (activeOrder.invoiceUrl && activeOrder.invoiceUrl !== '#') {
                              window.open(activeOrder.invoiceUrl, '_blank');
                            } else {
                              alert(`E-Arşiv Faturanız (${activeOrder.invoiceNumber || 'GIB2026'}).pdf indiriliyor...`);
                            }
                          }}
                          className="mt-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold flex items-center gap-2 shadow-glow transition-all cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                          <span>E-Fatura Belgesini İndir (.PDF)</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <div><strong>Fatura Durumu:</strong> <span className="text-amber-400 font-semibold">Hazırlanıyor (İş Bitiminde Yüklenecek)</span></div>
                        <div className="mt-3 p-3 rounded-xl bg-obsidian-900 border border-orange-950/80 text-[11px] text-slate-400 flex items-start gap-2">
                          <Clock className="w-4 h-4 text-amber-400/90 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-slate-200 block mb-0.5">Fatura Henüz Sisteme Yüklenmedi</strong>
                            Resmi e-Arşiv faturanız mimari projeniz tamamlanıp iş bitiminde sisteme yüklendiğinde indirme butonu aktif olacaktır.
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="space-y-2">
                    <span className="font-bold text-white uppercase tracking-wider block mb-1">Peyzaj Mimarınızla İletişim:</span>
                    <div><strong>Sorumlu Mimar:</strong> Hasan Hüseyin Yıldırım</div>
                    <div><strong>Ofis Telefonu:</strong> +90 544 477 20 44</div>
                    <a
                      href="https://wa.me/905444772044"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-orange-400 hover:text-orange-300 font-bold mt-2"
                    >
                      <MessageCircle className="w-4 h-4" /> Mimarımıza WhatsApp'tan Yazın
                    </a>
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-obsidian-950 p-12 rounded-3xl border border-orange-950 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 mx-auto flex items-center justify-center">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white font-serif">Detay Peyzaj Proje Masası</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Henüz kayıtlı bir proje siparişiniz bulunmamaktadır. İhtiyacınız olan peyzaj, 3D görselleştirme veya otomatik sulama projesi için hemen online sipariş oluşturabilirsiniz.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onOpenOrderWizard();
                  }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold shadow-glow inline-flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Yeni Proje Siparişi Oluştur</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

        {/* Edit Project Modal */}
        {isEditModalOpen && activeOrder && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-obsidian-950/90 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-xl bg-obsidian-900 border border-orange-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-orange-950 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Proje Bilgilerini Düzenle</h3>
                    <p className="text-xs text-slate-400 font-mono">{activeOrder.id} • {activeOrder.areaM2} m²</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 rounded-full text-slate-400 hover:text-white bg-obsidian-950 border border-orange-950 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Ad Soyad / Firma Ünvanı:</label>
                    <input
                      type="text"
                      value={editFormData.fullName}
                      onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                      className="w-full bg-obsidian-950 border border-orange-950 focus:border-orange-500 rounded-xl p-2.5 text-white outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Telefon Numarası:</label>
                    <input
                      type="tel"
                      value={editFormData.phone}
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                      className="w-full bg-obsidian-950 border border-orange-950 focus:border-orange-500 rounded-xl p-2.5 text-white outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Şehir / İl:</label>
                    <input
                      type="text"
                      value={editFormData.city}
                      onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                      className="w-full bg-obsidian-950 border border-orange-950 focus:border-orange-500 rounded-xl p-2.5 text-white outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">İlçe:</label>
                    <input
                      type="text"
                      value={editFormData.district}
                      onChange={(e) => setEditFormData({ ...editFormData, district: e.target.value })}
                      className="w-full bg-obsidian-950 border border-orange-950 focus:border-orange-500 rounded-xl p-2.5 text-white outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Teslimat / Fatura Açık Adresi:</label>
                  <textarea
                    rows={2}
                    value={editFormData.fullAddress}
                    onChange={(e) => setEditFormData({ ...editFormData, fullAddress: e.target.value })}
                    placeholder="Mahalle, sokak, kapı no..."
                    className="w-full bg-obsidian-950 border border-orange-950 focus:border-orange-500 rounded-xl p-2.5 text-white outline-none resize-none"
                  />
                </div>

                {/* Shipping Option Toggle */}
                <div className="p-3.5 rounded-2xl bg-obsidian-950 border border-orange-950 hover:border-orange-500/50 transition-all flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="editShippingOption"
                    checked={editFormData.shippingOption}
                    onChange={(e) => setEditFormData({ ...editFormData, shippingOption: e.target.checked })}
                    className="mt-1 w-4 h-4 accent-orange-500 cursor-pointer"
                  />
                  <label htmlFor="editShippingOption" className="cursor-pointer">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-orange-400" />
                      <span>Projeyi Basılı Olarak Adrese Gönder (Fiziki Kargo Teslimatı)</span>
                      <span className="text-amber-400 text-[10px] font-mono font-bold">(+1.500 TL)</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Renkli A3 ve A1 kuşe baskılı ciltli paftalar ve flash bellek ile adresinize anlaşmalı kargo ile ulaştırılır.
                    </p>
                  </label>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Mimar İçin Notlar & Özel İstekler:</label>
                  <textarea
                    rows={3}
                    value={editFormData.notes}
                    onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                    placeholder="Örn: Ateş çukuru istiyoruz, otomatik sulama damlama zonları eklensin..."
                    className="w-full bg-obsidian-950 border border-orange-950 focus:border-orange-500 rounded-xl p-2.5 text-white outline-none resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-orange-950 text-slate-300 hover:text-white bg-obsidian-950 cursor-pointer"
                  >
                    Vazgeç
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold shadow-glow flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>Değişiklikleri Kaydet</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteConfirmOpen && orderToDelete && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-obsidian-950/90 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-md bg-obsidian-900 border border-red-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 mx-auto flex items-center justify-center">
                <AlertTriangle className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white font-serif">Projeyi Silmek İstiyor musunuz?</h3>
                <p className="text-xs text-slate-400 mt-2">
                  <span className="font-mono font-bold text-orange-400">{orderToDelete.id}</span> kodlu proje kaydı, yüklenen tüm evraklar ve çizim süreçleri kalıcı olarak silinecektir.
                </p>
              </div>

              <div className="p-3 bg-obsidian-950 rounded-xl border border-red-950 text-[11px] text-red-300/90">
                Bu işlem geri alınamaz.
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteConfirmOpen(false);
                    setOrderToDelete(null);
                  }}
                  className="px-5 py-2.5 rounded-xl border border-orange-950 text-slate-300 hover:text-white bg-obsidian-950 cursor-pointer text-xs font-bold"
                >
                  Vazgeç
                </button>

                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-glow flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Evet, Projeyi Sil</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Review Modal for Active Order */}
        {activeOrder && (
          <ReviewModal
            isOpen={isReviewModalOpen}
            onClose={() => setIsReviewModalOpen(false)}
            order={activeOrder}
          />
        )}

      </div>
    </div>
  );
};
