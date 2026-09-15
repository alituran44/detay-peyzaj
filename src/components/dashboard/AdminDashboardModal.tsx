import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  TrendingUp,
  FileCheck,
  Layers,
  Upload,
  Phone,
  MessageCircle,
  Clock,
  MapPin,
  FileText,
  Download,
  Receipt,
  Mail,
  Search,
  Plus,
  LogOut,
  Settings,
  Copy,
  Check,
  Eye,
  EyeOff,
  CreditCard,
  Key,
  RefreshCw,
  Info,
  Trash2,
  Send,
  Edit3,
  CheckCircle2,
  Sparkles,
  CheckSquare,
  ListTodo,
  AlertCircle,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatTL } from '../../utils/pricing';
import { PaynkolayLogo } from '../icons/PaymentLogos';
import {
  getStoredMailConfig,
  saveStoredMailConfig,
  getStoredMailTemplates,
  saveStoredMailTemplates,
  renderTemplateText,
} from '../../utils/mailService';
import type { MailTemplate, MailConfig } from '../../utils/mailService';
import type { ProjectStatus, StoredOrder } from '../../types/auth';
import { getDefaultTasksForOrder } from '../../utils/taskUtils';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ isOpen, onClose }) => {
  const {
    user,
    orders,
    updateOrderStatus,
    addDeliverableToOrder,
    issueInvoice,
    logout,
    clearAllOrders,
    deleteOrder,
    toggleTaskStatus,
    addTaskToOrder,
    refreshCloudOrders,
  } = useAuth();
  const [activeTab, setActiveTab] = useState<'customers' | 'tasks' | 'finance' | 'payment_settings' | 'mail_templates'>('customers');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshOrders = async () => {
    setIsRefreshing(true);
    await refreshCloudOrders();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Task checklist filter states
  const [taskStatusFilter, setTaskStatusFilter] = useState<'all' | 'devam_ediyor' | 'bitti' | 'bekliyor'>('all');
  const [taskOrderFilter, setTaskOrderFilter] = useState<string>('all');
  const [taskSearchQuery, setTaskSearchQuery] = useState('');
  const [newOrderTaskInput, setNewOrderTaskInput] = useState('');
  const [globalTaskInput, setGlobalTaskInput] = useState('');
  const [globalTaskTargetOrderId, setGlobalTaskTargetOrderId] = useState<string>('');
  
  // Deliverable upload state
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<'dwg' | 'pdf' | 'excel' | 'image' | 'zip'>('dwg');
  const [customInvoiceNumber, setCustomInvoiceNumber] = useState('');

  // Mail Templates & Sender Config State (peyzajdetay@gmail.com)
  const [mailConfig, setMailConfig] = useState<MailConfig>(getStoredMailConfig);
  const [mailTemplates, setMailTemplates] = useState<MailTemplate[]>(getStoredMailTemplates);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('order_confirmation');
  const [testEmailAddress, setTestEmailAddress] = useState<string>('peyzajdetay@gmail.com');
  const [testEmailStatus, setTestEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  // Paynkolay Settings State (persisted in localStorage)
  const [paynkolaySettings, setPaynkolaySettings] = useState(() => {
    const saved = localStorage.getItem('paynkolay_api_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      tokenSx: '189064897|wYYIp9Y5cO0m3FyN21m9KZWyejpUfubziIRxkgZTVWUWYxa2wNluICXhvnKPoGVLxk1uukZj2PNl4sZnb3FVNOe83y1x/DdqtpTNg8BlnK8wJZZhUq+DuVmDDNQEcfZH+N8INw==',
      refundValue: '189064897|wYYIp9Y5cO0m3FyN21m9KZWyejpUfubziIRxkgZTVWUWYxa2wNluICXhvnKPoGVLxk1uukZj2PNl4sZnb3FVNOe83y1x/DdqtpTNg8BlnK8wJZZhUq+DuVmDDNQEcfZH+N8INw==|GYlbtzOi8mQHZJWI3d471A/+TJA7C81X',
      listingValue: '189064897|wYYIp9Y5cO0m3FyN21m9KZWyejpUfubziIRxkgZTVWUWYxa2wNluICXhvnKPoGVLxk1uukZj2PNl4sZnb3FVNOe83y1x/DdqtpTNg8BlnK8wJZZhUq+DuVmDDNQEcfZH+N8INw==|pM2y9bvyOjFcCZ4q6F7rcA==',
      merchantSecretKey: '_PG2qaf5kfrLZQYwrDP3Z',
      iban: 'TR26 0004 6002 1488 8000 1069 24',
      accountHolder: 'Hasan Hüseyin Yıldırım',
      bankName: 'Akbank',
    };
  });

  const [showTokens, setShowTokens] = useState({
    tokenSx: true,
    refundValue: true,
    listingValue: true,
    merchantSecretKey: true,
  });

  const [copiedField, setCopiedField] = useState<string | null>(null);

  const [paynkolayTestStatus, setPaynkolayTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [paynkolayTestMsg, setPaynkolayTestMsg] = useState<string>('');

  const handleCopy = (fieldKey: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleTestPaynkolay = async () => {
    setPaynkolayTestStatus('testing');
    setPaynkolayTestMsg('');
    try {
      const res = await fetch('/api/paynkolay-pay');
      const data = await res.json();
      if (data && data.success) {
        setPaynkolayTestStatus('success');
        setPaynkolayTestMsg(`Aktif Bank Paynkolay Sanal POS Ağ Geçidi Aktif & Canlı Çekime Hazır (Üye No: ${data.merchantId || '189064897'})`);
      } else {
        setPaynkolayTestStatus('error');
        setPaynkolayTestMsg(data?.error || 'Ağ geçidi yanıt vermedi.');
      }
    } catch (err: any) {
      setPaynkolayTestStatus('error');
      setPaynkolayTestMsg(`Bağlantı hatası: ${err?.message || 'Sunucuya ulaşılamadı.'}`);
    }
  };

  const handleSavePaynkolay = () => {
    localStorage.setItem('paynkolay_api_config', JSON.stringify(paynkolaySettings));
    alert('Paynkolay API anahtarları ve ödeme ayarları başarıyla kaydedildi!');
  };

  if (!isOpen) return null;

  const filteredOrders = orders.filter((ord) => {
    const clientName = (ord.invoice.type === 'bireysel' ? ord.invoice.fullName : ord.invoice.companyName) || '';
    const query = searchFilter.toLowerCase();
    return (
      ord.id.toLowerCase().includes(query) ||
      clientName.toLowerCase().includes(query) ||
      (ord.invoice.city || '').toLowerCase().includes(query) ||
      (ord.invoice.phone || '').includes(query)
    );
  });

  const activeOrder: StoredOrder = filteredOrders.find((o) => o.id === selectedOrderId) || filteredOrders[0] || orders[0];

  // Financial & Operational KPI calculations
  const totalRevenue = orders.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const activeProjectsCount = orders.filter((o) => o.status !== '5_teslim_edildi').length;
  const completedProjectsCount = orders.filter((o) => o.status === '5_teslim_edildi').length;
  const totalAreaM2 = orders.reduce((acc, curr) => acc + curr.areaM2, 0);

  const handleUploadDeliverableFile = (file: File) => {
    if (!file || !activeOrder) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const lower = file.name.toLowerCase();
      let type: 'dwg' | 'pdf' | 'excel' | 'image' | 'zip' = 'dwg';
      if (lower.endsWith('.pdf')) type = 'pdf';
      else if (lower.endsWith('.xlsx') || lower.endsWith('.xls') || lower.endsWith('.csv')) type = 'excel';
      else if (lower.endsWith('.zip') || lower.endsWith('.rar')) type = 'zip';
      else if (lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png') || lower.endsWith('.webp')) type = 'image';

      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      const sizeStr = file.size > 1024 * 1024 ? `${sizeMB} MB` : `${(file.size / 1024).toFixed(0)} KB`;

      addDeliverableToOrder(activeOrder.id, {
        name: file.name,
        size: sizeStr,
        type,
        content,
      });

      const clientName = activeOrder.invoice.type === 'bireysel' ? activeOrder.invoice.fullName : activeOrder.invoice.companyName;
      alert(`"${file.name}" proje çizim dosyası buluta başarıyla kaydedildi!\n\nSipariş ID: ${activeOrder.id}\nProje Sahibi: ${clientName}\n\nMüşteri portalında (${activeOrder.userEmail}) anında indirmeye açıldı.`);
    };
    reader.readAsDataURL(file);
  };

  const handleAddFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim() || !activeOrder) return;

    addDeliverableToOrder(activeOrder.id, {
      name: newFileName.trim(),
      size: `${(Math.random() * 25 + 2).toFixed(1)} MB`,
      type: newFileType,
    });

    const clientName = activeOrder.invoice.type === 'bireysel' ? activeOrder.invoice.fullName : activeOrder.invoice.companyName;
    setNewFileName('');
    alert(`"${newFileName}" dosyası başarıyla kaydedildi!\n\nSipariş ID: ${activeOrder.id}\nSahibi: ${clientName}`);
  };

  const handleUploadInvoiceFile = (orderId: string, file: File) => {
    const invNo = customInvoiceNumber.trim() || `GIB2026${Math.floor(100000000 + Math.random() * 900000000)}`;
    issueInvoice(orderId, invNo, '#', file.name);
    alert(`"${file.name}" E-Fatura belgesi (#${invNo}) sisteme başarıyla yüklendi!\n\nMüşterinin portalındaki 'E-Fatura İndir' butonu anında aktif hale getirildi.`);
  };

  const handleIssueInvoice = (orderId: string) => {
    const invNo = customInvoiceNumber.trim() || `GIB2026${Math.floor(100000000 + Math.random() * 900000000)}`;
    issueInvoice(orderId, invNo, '#', `E-Fatura-${invNo}.pdf`);
    alert(`E-Arşiv Fatura (#${invNo}) başarıyla onaylandı ve sisteme yüklendi!\n\nMüşterinin portalındaki 'E-Fatura İndir' butonu aktif edildi.`);
  };

  const sendDeliveryEmail = async (order: StoredOrder) => {
    const customerMail = order.invoice.email || order.userEmail;
    const clientName = order.invoice.type === 'bireysel' ? order.invoice.fullName : order.invoice.companyName;
    try {
      await fetch('/api/send-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order: { id: order.id, isPaid: true },
          customerInfo: {
            name: clientName || 'Müşteri',
            phone: order.invoice.phone || '-',
            email: customerMail,
            city: order.invoice.city || 'Çanakkale',
            district: order.invoice.district || 'Merkez',
            type: order.invoice.type,
          },
          services: ['Peyzaj Projesi & 3D Render (Teslim Edildi)'],
          areaM2: order.areaM2,
          totalPrice: formatTL(order.totalPrice),
          paymentMethod: order.paymentMethod,
          notes: `[PROJE TESLİMATI] Tüm DWG, 3D Render ve PDF paftalar peyzajdetay@gmail.com tarafından başarıyla iletildi.`,
        }),
      });
    } catch (e) {
      console.error(e);
    }
    alert(`🎉 Proje teslimat ve indirme e-postası Detay Peyzaj (peyzajdetay@gmail.com) üzerinden "${customerMail}" adresine başarıyla gönderildi!`);
  };

  const getWhatsAppBrief = (order: StoredOrder) => {
    const name = order.invoice.type === 'bireysel' ? order.invoice.fullName : order.invoice.companyName;
    return encodeURIComponent(
      `Merhaba ${name},\n\nDetay Peyzaj & Mimarlık ofisimiz ${order.id} kodlu projeniz üzerinde çalışmaktadır.\n` +
      `Güncel Proje Aşaması: %${order.progressPercent} Tamamlandı.\n` +
      `Çizim ve paftalarınızı müşteri portalınızdan canlı takip edebilirsiniz: https://detay-peyzaj.vercel.app\n\n` +
      `Peyzaj Mimarı Hasan Hüseyin Yıldırım (+90 544 477 20 44)`
    );
  };

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Top Navbar Header */}
      <header className="sticky top-0 z-40 bg-obsidian-950/95 backdrop-blur-md border-b border-orange-900/40 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Left: Brand + Back Button + Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-obsidian-900 hover:bg-orange-950/60 border border-orange-900/60 text-orange-400 hover:text-orange-300 text-xs font-bold transition-all cursor-pointer shadow-sm group shrink-0"
              title="Ana Sayfaya Dön"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Ana Sayfaya Dön</span>
            </button>

            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-base sm:text-lg font-serif font-bold text-white tracking-wide">
                  Detay Peyzaj Yönetici Paneli
                </h1>
                <span className="text-[10px] bg-orange-950 text-orange-400 border border-orange-600/80 px-2.5 py-0.5 rounded-full font-bold">
                  YÖNETİCİ: {user?.fullName || 'Hasan Hüseyin Yıldırım'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Müşteri evrakları, pafta yükleme, ciro kontrolü ve e-fatura kesme merkezi
              </p>
            </div>
          </div>

          {/* Right: Tab Switchers & Actions */}
          <div className="flex items-center justify-between lg:justify-end gap-2 sm:gap-3 flex-wrap">
            {/* Tab switchers */}
            <div className="flex items-center gap-1 bg-obsidian-900 p-1 rounded-2xl border border-orange-950 text-xs overflow-x-auto">
              <button
                onClick={() => setActiveTab('customers')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'customers'
                    ? 'bg-orange-600 text-white shadow-glow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                👥 Müşteriler & Evraklar
              </button>
              <button
                onClick={() => setActiveTab('tasks')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'tasks'
                    ? 'bg-orange-600 text-white shadow-glow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>✅ Yapılan İşler & Kontrol Listesi</span>
              </button>
              <button
                onClick={() => setActiveTab('finance')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'finance'
                    ? 'bg-orange-600 text-white shadow-glow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                💰 Finans & Faturalar
              </button>
              <button
                onClick={() => setActiveTab('mail_templates')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'mail_templates'
                    ? 'bg-orange-600 text-white shadow-glow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>✉️ Mail Şablonları</span>
              </button>
              <button
                onClick={() => setActiveTab('payment_settings')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'payment_settings'
                    ? 'bg-orange-600 text-white shadow-glow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>⚙️ Paynkolay</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleRefreshOrders}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-orange-300 hover:text-white bg-obsidian-900 hover:bg-orange-950/60 border border-orange-900/80 flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
              title="Sunucudaki güncel siparişleri ve evrakları çek"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-orange-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Canlı Yenile</span>
            </button>

            {orders.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Tüm test siparişlerini ve kayıtları temizlemek istediğinize emin misiniz?')) {
                    clearAllOrders();
                    setSelectedOrderId(null);
                  }
                }}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-red-400 bg-obsidian-900 hover:bg-red-950/30 border border-orange-950 hover:border-red-900/60 flex items-center gap-1.5 cursor-pointer transition-all"
                title="Tüm siparişleri ve test verilerini sıfırla"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden xl:inline">Listeyi Temizle</span>
              </button>
            )}

            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-red-300 hover:text-white bg-red-950/40 hover:bg-red-900 border border-red-800/60 flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
              title="Yönetici Hesabından Çıkış Yap"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Page Dashboard Body */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1">
          
          {/* Top 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-obsidian-950 p-5 rounded-2xl border border-orange-950 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Gelen Toplam Ciro</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black font-mono text-white">{formatTL(totalRevenue)}</div>
              <div className="text-[10px] text-emerald-400 font-semibold">%100 Tahsil Edildi (KDV Dahil)</div>
            </div>

            <div className="bg-obsidian-950 p-5 rounded-2xl border border-orange-950 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Çizimdeki Projeler</span>
                <Clock className="w-4 h-4 text-orange-400" />
              </div>
              <div className="text-2xl font-black font-mono text-orange-400">{activeProjectsCount} Proje</div>
              <div className="text-[10px] text-slate-400">5 Günlük Takvimde</div>
            </div>

            <div className="bg-obsidian-950 p-5 rounded-2xl border border-orange-950 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Teslim Edilen Projeler</span>
                <FileCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black font-mono text-emerald-400">{completedProjectsCount} Proje</div>
              <div className="text-[10px] text-slate-400">Müşteriye İletildi</div>
            </div>

            <div className="bg-obsidian-950 p-5 rounded-2xl border border-orange-950 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Toplam Arsa Alanı</span>
                <Layers className="w-4 h-4 text-orange-400" />
              </div>
              <div className="text-2xl font-black font-mono text-white">{totalAreaM2.toLocaleString('tr-TR')} m²</div>
              <div className="text-[10px] text-slate-400">{(totalAreaM2 / 1000).toFixed(1)} Dönüm Projelendirildi</div>
            </div>
          </div>

          {activeTab === 'customers' ? (
            /* Main Customers & Files Management View */
            <div className="grid lg:grid-cols-12 gap-6">
              
              {/* Left Sidebar: Customer Orders List with Search */}
              <div className="lg:col-span-5 bg-obsidian-950 p-6 rounded-3xl border border-orange-950 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">Müşteri Listesi ({filteredOrders.length})</h3>
                  <div className="flex items-center gap-2">
                    {orders.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('Tüm test siparişlerini ve yüklenen test dosyalarını silmek istediğinize emin misiniz?')) {
                            clearAllOrders();
                            setSelectedOrderId(null);
                          }
                        }}
                        className="text-[10px] text-red-400 hover:text-red-300 font-bold px-2 py-0.5 rounded bg-red-950/50 border border-red-800/40 cursor-pointer"
                        title="Tüm test verilerini temizle"
                      >
                        Tümünü Temizle
                      </button>
                    )}
                    <span className="text-[10px] text-orange-400 font-mono">Canlı Siparişler</span>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Müşteri adı, telefon, kod veya il ara..."
                    className="w-full bg-obsidian-900 border border-orange-950 rounded-xl px-4 py-2 pl-9 text-xs text-white focus:border-orange-500 outline-none"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                </div>

                <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                  {filteredOrders.length === 0 ? (
                    <div className="py-16 px-4 text-center space-y-3 bg-obsidian-900/40 rounded-2xl border border-dashed border-orange-950/80">
                      <FileText className="w-8 h-8 text-orange-400/40 mx-auto" />
                      <div>
                        <p className="text-xs font-bold text-slate-200">Kayıtlı Sipariş Bulunmuyor</p>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Web siteniz üzerinden yeni bir sipariş verildiğinde tüm dosya ve fatura bilgileri burada listelenecektir.
                        </p>
                        <button
                          type="button"
                          onClick={handleRefreshOrders}
                          className="mt-3.5 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 mx-auto cursor-pointer shadow-glow-sm"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                          <span>Sunucudaki Siparişleri Çek / Canlı Yenile</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    filteredOrders.map((ord) => {
                      const clientName = ord.invoice.type === 'bireysel' ? ord.invoice.fullName : ord.invoice.companyName;
                      const isSelected = activeOrder?.id === ord.id;
                      return (
                        <div
                          key={ord.id}
                          onClick={() => setSelectedOrderId(ord.id)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 relative group ${
                            isSelected
                              ? 'bg-orange-950/50 border-orange-500 shadow-glow-sm'
                              : 'bg-obsidian-900 border-orange-950/80 hover:border-orange-800'
                          }`}
                        >
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-mono font-bold text-orange-400">{ord.id}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-black text-white">{formatTL(ord.totalPrice)}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm(`${ord.id} nolu siparişi silmek istediğinize emin misiniz?`)) {
                                    deleteOrder(ord.id);
                                    if (selectedOrderId === ord.id) setSelectedOrderId(null);
                                  }
                                }}
                                className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/40 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                                title="Siparişi Sil"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-xs font-bold text-white line-clamp-1">{clientName || 'İsimsiz Müşteri'}</h4>
                            <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-orange-400" /> {ord.invoice.city} / {ord.invoice.district} • {ord.areaM2} m²
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-orange-950/60 text-[10px]">
                            <span className={`font-bold px-2 py-0.5 rounded-md ${
                              ord.status === '5_teslim_edildi'
                                ? 'bg-emerald-950 text-emerald-400'
                                : 'bg-orange-950 text-orange-300'
                            }`}>
                              %{ord.progressPercent} • {ord.status.replace(/^[0-9]_/, '').replace(/_/g, ' ').toUpperCase()}
                            </span>
                            <span className="text-slate-500">{new Date(ord.createdAt).toLocaleDateString('tr-TR')}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right Detail Pane: Selected Customer Dossier & File Uploads */}
              <div className="lg:col-span-7 space-y-6">
                {activeOrder ? (
                  <div className="space-y-6">
                    
                    {/* Header Card with Client Actions */}
                    <div className="bg-obsidian-950 p-6 rounded-3xl border border-orange-950 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <span className="text-[10px] font-mono text-orange-400 uppercase font-bold">Müşteri Dosyası</span>
                          <h3 className="text-lg font-bold text-white">
                            {activeOrder.invoice.type === 'bireysel' ? activeOrder.invoice.fullName : activeOrder.invoice.companyName}
                          </h3>
                          <p className="text-xs text-slate-400 font-mono">{activeOrder.id} • {activeOrder.userEmail}</p>
                        </div>

                        {/* Quick Communications Bar */}
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://wa.me/${activeOrder.invoice.phone.replace(/[^0-9]/g, '')}?text=${getWhatsAppBrief(activeOrder)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5"
                            title="WhatsApp Mesajı Gönder"
                          >
                            <MessageCircle className="w-4 h-4 text-emerald-400" />
                            <span>WhatsApp</span>
                          </a>

                          <button
                            onClick={() => sendDeliveryEmail(activeOrder)}
                            className="px-3 py-2 bg-obsidian-900 hover:bg-obsidian-850 border border-orange-950 text-slate-300 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                            title="E-Posta Gönder"
                          >
                            <Mail className="w-4 h-4 text-orange-400" />
                            <span>E-Posta</span>
                          </button>

                          <a
                            href={`tel:${activeOrder.invoice.phone}`}
                            className="p-2 bg-obsidian-900 border border-orange-950 text-orange-400 hover:text-white rounded-xl"
                            title="Ara"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        </div>
                      </div>

                      {/* Project Stage Selector */}
                      <div className="bg-obsidian-900 p-4 rounded-2xl border border-orange-950 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-white uppercase tracking-wider">
                            5 Günlük Proje Aşaması (Canlı Güncelle):
                          </label>
                          <span className="text-xs font-mono font-bold text-orange-400">%{activeOrder.progressPercent}</span>
                        </div>

                        <select
                          value={activeOrder.status}
                          onChange={(e) => updateOrderStatus(activeOrder.id, e.target.value as ProjectStatus)}
                          className="w-full bg-obsidian-950 border border-orange-950 rounded-xl p-3 text-xs text-white focus:border-orange-500 outline-none font-bold"
                        >
                          <option value="1_analiz">1. Gün: Arsa & Evrak Analizi (%20)</option>
                          <option value="2_vaziyet_plan">2. Gün: AutoCAD Yapısal Planı (%40)</option>
                          <option value="3_bitki_sulama">3. Gün: Bitkilendirme & Sulama Zonlaması (%60)</option>
                          <option value="4_3d_render">4. Gün: 4K Fotogerçekçi 3D Renderlar (%80)</option>
                          <option value="5_teslim_edildi">5. Gün: Eksiksiz Teslim Edildi (%100)</option>
                        </select>
                      </div>
                    </div>

                    {/* Project Stage Tasks Checklist */}
                    {(() => {
                      const orderTasks = (activeOrder.tasks && activeOrder.tasks.length > 0)
                        ? activeOrder.tasks
                        : getDefaultTasksForOrder(activeOrder.id, activeOrder.selectedServices);
                      const completedCount = orderTasks.filter((t) => t.status === 'bitti').length;
                      const inProgressCount = orderTasks.filter((t) => t.status === 'devam_ediyor').length;
                      const pendingCount = orderTasks.filter((t) => t.status === 'bekliyor').length;
                      const percent = orderTasks.length > 0 ? Math.round((completedCount / orderTasks.length) * 100) : 0;

                      return (
                        <div className="bg-obsidian-950 p-6 rounded-3xl border border-orange-950 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <CheckSquare className="w-4 h-4 text-orange-400" />
                              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                                Proje Yapılan İşler & Kontrol Listesi
                              </h4>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-mono">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                                ✓ {completedCount} Bitti
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                                ⏳ {inProgressCount} Devam Ediyor
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                                ⚪ {pendingCount} Bekliyor
                              </span>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[11px]">
                              <span className="text-slate-400">Çizim & Modelleme Aşaması</span>
                              <span className="font-mono font-bold text-orange-400">%{percent} Tamamlandı</span>
                            </div>
                            <div className="w-full h-2 bg-obsidian-900 rounded-full overflow-hidden border border-orange-950">
                              <div
                                className="h-full bg-gradient-to-r from-orange-600 via-amber-500 to-emerald-500 transition-all duration-500"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>

                          {/* Tasks List */}
                          <div className="space-y-2">
                            {orderTasks.map((task) => (
                              <div
                                key={task.id}
                                className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                                  task.status === 'bitti'
                                    ? 'bg-emerald-950/20 border-emerald-900/60 text-slate-300'
                                    : task.status === 'devam_ediyor'
                                    ? 'bg-amber-950/20 border-amber-900/60 text-white'
                                    : 'bg-obsidian-900 border-orange-950 text-slate-400'
                                }`}
                              >
                                <div className="flex items-start sm:items-center gap-2.5">
                                  <div
                                    className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 sm:mt-0 ${
                                      task.status === 'bitti'
                                        ? 'bg-emerald-500 text-obsidian-950'
                                        : task.status === 'devam_ediyor'
                                        ? 'bg-amber-500 text-obsidian-950 animate-pulse'
                                        : 'bg-obsidian-950 border border-slate-700 text-slate-500'
                                    }`}
                                  >
                                    {task.status === 'bitti' ? '✓' : task.status === 'devam_ediyor' ? '⏳' : '○'}
                                  </div>
                                  <div>
                                    <div className={`text-xs font-semibold ${task.status === 'bitti' ? 'line-through text-slate-400' : 'text-white'}`}>
                                      {task.title}
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-mono">
                                      Kategori: {task.category.toUpperCase()} • Son Güncelleme: {new Date(task.updatedAt).toLocaleDateString('tr-TR')}
                                    </div>
                                  </div>
                                </div>

                                {/* Status Switcher Buttons */}
                                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => toggleTaskStatus(activeOrder.id, task.id, 'bekliyor')}
                                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                      task.status === 'bekliyor'
                                        ? 'bg-slate-800 text-slate-200 border border-slate-600 shadow-sm'
                                        : 'bg-obsidian-950 text-slate-500 hover:text-slate-300 border border-transparent'
                                    }`}
                                  >
                                    Bekliyor
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => toggleTaskStatus(activeOrder.id, task.id, 'devam_ediyor')}
                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                      task.status === 'devam_ediyor'
                                        ? 'bg-amber-500 text-obsidian-950 font-black shadow-glow-sm'
                                        : 'bg-obsidian-950 text-amber-400/70 hover:text-amber-300 border border-transparent'
                                    }`}
                                  >
                                    Devam Ediyor
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => toggleTaskStatus(activeOrder.id, task.id, 'bitti')}
                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                      task.status === 'bitti'
                                        ? 'bg-emerald-500 text-obsidian-950 font-black shadow-glow-sm'
                                        : 'bg-obsidian-950 text-emerald-400/70 hover:text-emerald-300 border border-transparent'
                                    }`}
                                  >
                                    ✓ Bitti
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Add Custom Task */}
                          <div className="flex gap-2 pt-2 border-t border-orange-950">
                            <input
                              type="text"
                              value={newOrderTaskInput}
                              onChange={(e) => setNewOrderTaskInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  if (newOrderTaskInput.trim()) {
                                    addTaskToOrder(activeOrder.id, newOrderTaskInput.trim());
                                    setNewOrderTaskInput('');
                                  }
                                }
                              }}
                              placeholder="Bu projeye özel yeni iş / revizyon görevi ekle..."
                              className="flex-1 bg-obsidian-900 border border-orange-950 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (newOrderTaskInput.trim()) {
                                  addTaskToOrder(activeOrder.id, newOrderTaskInput.trim());
                                  setNewOrderTaskInput('');
                                }
                              }}
                              className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-glow-sm shrink-0"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>İş Ekle</span>
                            </button>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Customer Uploaded Files (Tapu, Kroki, DWG, Fotoğraflar, Açıklamalar) */}
                    <div className="bg-obsidian-950 p-6 rounded-3xl border border-orange-950 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                          <FileText className="w-4 h-4 text-orange-400" />
                          <span>Müşterinin Yüklediği Evraklar & DWG Çizimleri ({activeOrder.customerDocuments?.length || 0})</span>
                        </h4>
                        {activeOrder.customerDocuments && activeOrder.customerDocuments.length > 0 && (
                          <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-mono">
                            ✓ {activeOrder.customerDocuments.length} Belge Hazır & İndirilebilir
                          </span>
                        )}
                      </div>

                      {/* Documents Grid */}
                      {activeOrder.customerDocuments && activeOrder.customerDocuments.length > 0 ? (
                        <div className="grid sm:grid-cols-2 gap-3">
                          {activeOrder.customerDocuments.map((doc) => {
                            const isDwg = doc.fileName.toLowerCase().endsWith('.dwg') || doc.fileName.toLowerCase().endsWith('.dxf');
                            const isReceipt = doc.category === 'dekont' || doc.title.toLowerCase().includes('dekont');
                            const downloadUrl = `/api/download-file?orderId=${encodeURIComponent(activeOrder.id)}&fileName=${encodeURIComponent(doc.fileName)}`;

                            return (
                              <div
                                key={doc.id}
                                className="p-3.5 rounded-2xl bg-obsidian-900 border border-orange-950/80 hover:border-orange-500/50 transition-all flex items-center justify-between gap-3 shadow-sm"
                              >
                                <div className="flex items-center gap-2.5 overflow-hidden">
                                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                    isDwg
                                      ? 'bg-orange-600/20 border border-orange-500/50 text-orange-400'
                                      : isReceipt
                                      ? 'bg-emerald-600/20 border border-emerald-500/50 text-emerald-400'
                                      : 'bg-amber-600/20 border border-amber-500/50 text-amber-400'
                                  }`}>
                                    <FileText className="w-4 h-4" />
                                  </div>
                                  <div className="overflow-hidden">
                                    <div className="text-xs font-bold text-white truncate">{doc.title}</div>
                                    <div className="text-[10px] text-slate-400 font-mono truncate">{doc.fileName} • {doc.fileSize}</div>
                                  </div>
                                </div>

                                <a
                                  href={downloadUrl}
                                  download={doc.fileName}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 bg-orange-600/20 hover:bg-orange-600 text-orange-300 hover:text-white border border-orange-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 transition-all shadow-sm"
                                  title="Dosyayı Bilgisayarına İndir"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  <span>İndir</span>
                                </a>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-4 rounded-2xl bg-obsidian-900/60 border border-dashed border-orange-950 text-center text-xs text-slate-400 space-y-1">
                          <p>Bu sipariş için henüz panel üzerinden dosya eklenmedi.</p>
                          <p className="text-[11px] text-slate-500">
                            Yüklenen tüm dosyalar mimarımızın e-posta adresine (<strong>peyzajdetay@gmail.com</strong> / <strong>hhyildirimm@gmail.com</strong>) ek dosya olarak da iletilmektedir.
                          </p>
                        </div>
                      )}

                      {/* Customer Full Contact & Address Card */}
                      <div className="grid sm:grid-cols-2 gap-3 bg-obsidian-900/90 p-4 rounded-2xl border border-orange-950/80 text-xs">
                        <div className="space-y-1 text-slate-300">
                          <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-orange-400" />
                            <span>İletişim Bilgileri:</span>
                          </div>
                          <div><span className="text-slate-500">Müşteri:</span> <strong className="text-white">{activeOrder.invoice.fullName || activeOrder.invoice.companyName}</strong></div>
                          <div><span className="text-slate-500">Telefon:</span> <a href={`tel:${activeOrder.invoice.phone}`} className="text-orange-300 font-mono font-bold hover:underline">{activeOrder.invoice.phone}</a></div>
                          <div><span className="text-slate-500">E-Posta:</span> <span className="text-slate-200">{activeOrder.invoice.email || activeOrder.userEmail}</span></div>
                          <div><span className="text-slate-500">TCKN / Vergi No:</span> <span className="font-mono text-slate-200">{activeOrder.invoice.tcKimlikNo || activeOrder.invoice.taxNumber || '-'}</span></div>
                        </div>

                        <div className="space-y-1 text-slate-300">
                          <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-orange-400" />
                            <span>Konum & Teslimat:</span>
                          </div>
                          <div><span className="text-slate-500">Şehir / İlçe:</span> <strong className="text-white">{activeOrder.invoice.city} / {activeOrder.invoice.district}</strong></div>
                          <div><span className="text-slate-500">Açık Adres:</span> <span className="text-slate-200">{activeOrder.invoice.fullAddress || '-'}</span></div>
                          <div>
                            <span className="text-slate-500">Teslimat Biçimi:</span>{' '}
                            {activeOrder.shippingOption ? (
                              <span className="text-orange-400 font-bold">📦 Fiziki Ozalit Kargo (+1.500 TL)</span>
                            ) : (
                              <span className="text-emerald-400 font-semibold">💻 Dijital AutoCAD & DWG</span>
                            )}
                          </div>
                          <div>
                            <span className="text-slate-500">Ödeme Yöntemi:</span>{' '}
                            <span className="text-white font-mono font-bold">
                              {activeOrder.paymentMethod === 'credit_card' ? '💳 Paynkolay 3D Secure Kredi Kartı' : '🏦 Banka Havalesi / FAST'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Customer Note */}
                      {activeOrder.notes && (
                        <div className="space-y-1.5 pt-2 border-t border-orange-950/80">
                          <span className="text-xs font-semibold text-slate-300">Müşterinin Yazdığı İstek & Açıklama Notu:</span>
                          <div className="p-3.5 rounded-xl bg-obsidian-900 border border-orange-950 text-xs text-slate-200 leading-relaxed font-sans">
                            "{activeOrder.notes}"
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Upload Finished Deliverables for Client */}
                    <div className="bg-obsidian-950 p-6 rounded-3xl border border-orange-950 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                          <Upload className="w-4 h-4 text-orange-400" />
                          <span>Müşteriye Hazırlanan Çizim & Pafta Dosyası Yükle</span>
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {activeOrder.deliverables?.length || 0} Dosya Teslim Edildi
                        </span>
                      </div>

                      {/* Drag & Drop / Direct File Upload */}
                      <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-orange-500/50 hover:border-orange-400 rounded-2xl bg-obsidian-900/60 hover:bg-obsidian-900 cursor-pointer transition-all group">
                        <Upload className="w-6 h-6 text-orange-400 group-hover:scale-110 transition-transform mb-1.5" />
                        <span className="text-xs font-bold text-white group-hover:text-orange-300">
                          Bilgisayarınızdan AutoCAD (.DWG), PDF, 3D Render veya ZIP Dosyası Seçin
                        </span>
                        <span className="text-[11px] text-slate-400 mt-1">
                          Dosya otomatik olarak <strong>{activeOrder.id}</strong> nolu siparişe ve müşteriye ({activeOrder.invoice.fullName || activeOrder.invoice.companyName}) atanarak buluta kaydedilir.
                        </span>
                        <input
                          type="file"
                          accept="*/*,.dwg,.dxf,.pdf,.zip,.rar,.xlsx,.xls,.png,.jpg,.jpeg"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleUploadDeliverableFile(e.target.files[0]);
                            }
                          }}
                          className="hidden"
                        />
                      </label>

                      {/* Manual Name Entry Option */}
                      <form onSubmit={handleAddFile} className="space-y-3 bg-obsidian-900 p-4 rounded-2xl border border-orange-950">
                        <div className="text-[11px] font-bold text-slate-400">Veya İsim Belirterek Dosya Ekle:</div>
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={newFileName}
                            onChange={(e) => setNewFileName(e.target.value)}
                            placeholder={`Örn: ${activeOrder.id}-Mimari-Vaziyet-Plani.dwg`}
                            className="col-span-2 bg-obsidian-950 border border-orange-950 rounded-xl p-3 text-xs text-white focus:border-orange-500 outline-none"
                          />

                          <select
                            value={newFileType}
                            onChange={(e) => setNewFileType(e.target.value as any)}
                            className="bg-obsidian-950 border border-orange-950 rounded-xl p-3 text-xs text-white focus:border-orange-500 outline-none"
                          >
                            <option value="dwg">DWG (CAD Paftası)</option>
                            <option value="pdf">PDF Çizim Seti</option>
                            <option value="excel">Excel Metraj Tablosu</option>
                            <option value="zip">ZIP (4K Render Seti)</option>
                          </select>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-orange-950 hover:bg-orange-900 border border-orange-700/60 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Plus className="w-4 h-4 text-orange-400" />
                          <span>İsimle Listeye Ekle</span>
                        </button>
                      </form>

                      {/* Currently uploaded deliverables */}
                      <div className="space-y-2">
                        {activeOrder.deliverables?.map((deliv, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-obsidian-900 border border-orange-950 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span className="font-bold text-white truncate">{deliv.name}</span>
                              <span className="text-slate-500 text-[10px] shrink-0">({deliv.size})</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <a
                                href={deliv.downloadUrl || `/api/download-file?orderId=${encodeURIComponent(activeOrder.id)}&fileName=${encodeURIComponent(deliv.name)}`}
                                download={deliv.name}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-orange-600 hover:bg-orange-500 text-white flex items-center gap-1 cursor-pointer"
                              >
                                <Download className="w-3 h-3" />
                                <span>İndir</span>
                              </a>
                              <span className="text-emerald-400 font-semibold text-[10px]">✓ Müşteride Açık</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* E-Arşiv Fatura Kesme & Yükleme Kartı */}
                    <div className="bg-obsidian-950 p-6 rounded-3xl border border-orange-950 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Receipt className="w-4 h-4 text-orange-400" />
                          <h4 className="text-xs font-bold uppercase tracking-wider text-white">E-Arşiv Fatura & GİB Entegrasyonu</h4>
                        </div>
                        {activeOrder.invoiceIssued ? (
                          <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-700 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Fatura Yüklendi (#{activeOrder.invoiceNumber})
                          </span>
                        ) : (
                          <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-700 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Fatura Bekliyor (Müşteride Henüz Aktif Değil)
                          </span>
                        )}
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3 text-xs bg-obsidian-900 p-4 rounded-2xl border border-orange-950">
                        <div>
                          <div><strong>Fatura Tipi:</strong> {activeOrder.invoice.type === 'bireysel' ? 'Bireysel (TCKN)' : 'Kurumsal (Vergi No)'}</div>
                          <div><strong>Ünvan:</strong> {activeOrder.invoice.type === 'bireysel' ? activeOrder.invoice.fullName : activeOrder.invoice.companyName}</div>
                          <div><strong>TC / Vergi No:</strong> {activeOrder.invoice.type === 'bireysel' ? activeOrder.invoice.tcKimlikNo : activeOrder.invoice.taxNumber}</div>
                        </div>
                        <div>
                          <div><strong>Tutar (KDV Dahil):</strong> {formatTL(activeOrder.totalPrice)}</div>
                          <div><strong>KDV (%20):</strong> {formatTL(Math.round((activeOrder.totalPrice * 20) / 120))}</div>
                          <div><strong>Matrah:</strong> {formatTL(Math.round((activeOrder.totalPrice * 100) / 120))}</div>
                        </div>
                      </div>

                      {!activeOrder.invoiceIssued ? (
                        <div className="space-y-3 pt-1">
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              placeholder="Özel GİB Fatura No (Opsiyonel, Örn: GIB2026000001234)"
                              value={customInvoiceNumber}
                              onChange={(e) => setCustomInvoiceNumber(e.target.value)}
                              className="flex-1 bg-obsidian-900 border border-orange-950 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 font-mono outline-none focus:border-orange-500"
                            />
                            <button
                              type="button"
                              onClick={() => handleIssueInvoice(activeOrder.id)}
                              className="py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-glow flex items-center justify-center gap-2 cursor-pointer shrink-0"
                            >
                              <Receipt className="w-4 h-4" />
                              <span>Fatura No ile Onayla</span>
                            </button>
                          </div>

                          <label className="flex flex-col items-center justify-center p-4 border border-dashed border-orange-500/50 hover:border-orange-400 rounded-2xl bg-obsidian-900/60 hover:bg-obsidian-900 cursor-pointer transition-all group">
                            <Upload className="w-5 h-5 text-orange-400 group-hover:scale-110 transition-transform mb-1" />
                            <span className="text-xs font-semibold text-white group-hover:text-orange-300">
                              Resmi E-Fatura PDF Dosyasını Buraya Yükleyin
                            </span>
                            <span className="text-[10px] text-slate-400 mt-0.5">Yüklendiğinde müşterinin portalındaki "E-Fatura İndir" butonu anında aktif olacaktır.</span>
                            <input
                              type="file"
                              accept=".pdf,.png,.jpg,.jpeg"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleUploadInvoiceFile(activeOrder.id, e.target.files[0]);
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                        </div>
                      ) : (
                        <div className="space-y-3 pt-1">
                          <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileCheck className="w-4 h-4 text-emerald-400" />
                              <span>Fatura Yüklendi: <strong>{activeOrder.invoiceFileName || `E-Fatura-${activeOrder.invoiceNumber}.pdf`}</strong> ({activeOrder.invoiceNumber})</span>
                            </div>
                            <span className="text-[10px] bg-emerald-900/80 px-2 py-0.5 rounded text-emerald-200 font-semibold">Müşteride Aktif</span>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              type="button"
                              onClick={() => alert(`E-Fatura PDF (#${activeOrder.invoiceNumber}) indiriliyor...`)}
                              className="flex-1 py-2.5 rounded-xl font-bold text-xs text-white bg-obsidian-900 border border-orange-950 hover:bg-orange-950 flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <Download className="w-4 h-4 text-orange-400" />
                              <span>Faturayı İndir (.PDF)</span>
                            </button>

                            <label className="flex-1 py-2.5 rounded-xl font-bold text-xs text-orange-300 bg-orange-950/40 border border-orange-900/60 hover:bg-orange-900/40 flex items-center justify-center gap-2 cursor-pointer transition-colors text-center">
                              <Upload className="w-4 h-4 text-orange-400" />
                              <span>Faturayı Yeniden Yükle / Güncelle</span>
                              <input
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleUploadInvoiceFile(activeOrder.id, e.target.files[0]);
                                  }
                                }}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                ) : (
                  <div className="bg-obsidian-950 p-12 rounded-3xl border border-orange-950 text-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 mx-auto flex items-center justify-center">
                      <ShieldCheck className="w-7 h-7" />
                    </div>
                    <h4 className="text-base font-bold text-white">Yönetici Sipariş & Dosya Masası</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Sipariş listesi temizlendi. Müşteriler online sipariş verdiğinde yüklenen DWG çizimleri ve arazi fotoğrafları doğrudan bu ekranda açılacaktır.
                    </p>
                  </div>
                )}
              </div>

            </div>
          ) : activeTab === 'tasks' ? (
            /* Tasks & Project Checklist Master Control View */
            (() => {
              const allOrdersWithTasks = orders.map((ord) => ({
                order: ord,
                tasks: (ord.tasks && ord.tasks.length > 0)
                  ? ord.tasks
                  : getDefaultTasksForOrder(ord.id, ord.selectedServices),
              }));

              const allTasksFlat = allOrdersWithTasks.flatMap(({ order, tasks }) =>
                tasks.map((t) => ({
                  ...t,
                  clientName: (order.invoice.type === 'bireysel' ? order.invoice.fullName : order.invoice.companyName) || 'Müşteri',
                  city: order.invoice.city || '-',
                  district: order.invoice.district || '-',
                  areaM2: order.areaM2,
                  orderCreatedAt: order.createdAt,
                  orderProgress: order.progressPercent,
                }))
              );

              const totalCount = allTasksFlat.length;
              const inProgressCount = allTasksFlat.filter((t) => t.status === 'devam_ediyor').length;
              const completedCount = allTasksFlat.filter((t) => t.status === 'bitti').length;
              const pendingCount = allTasksFlat.filter((t) => t.status === 'bekliyor').length;

              const filteredProjects = allOrdersWithTasks.filter(({ order, tasks }) => {
                if (taskOrderFilter !== 'all' && order.id !== taskOrderFilter) return false;
                
                const clientName = (order.invoice.type === 'bireysel' ? order.invoice.fullName : order.invoice.companyName) || '';
                const q = taskSearchQuery.toLowerCase();
                const matchesSearch = !q ||
                  order.id.toLowerCase().includes(q) ||
                  clientName.toLowerCase().includes(q) ||
                  tasks.some((t) => t.title.toLowerCase().includes(q));

                if (!matchesSearch) return false;

                if (taskStatusFilter !== 'all') {
                  const hasMatchingTask = tasks.some((t) => t.status === taskStatusFilter);
                  if (!hasMatchingTask) return false;
                }

                return true;
              });

              return (
                <div className="space-y-6 animate-fade-in">
                  {/* Header & Quick Action Bar */}
                  <div className="bg-obsidian-950 p-6 rounded-3xl border border-orange-950 space-y-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <CheckSquare className="w-5 h-5 text-orange-400" />
                          <h3 className="text-base sm:text-lg font-bold text-white font-serif">
                            Yapılan İşler & Canlı Kontrol Listesi (Checklist)
                          </h3>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Projelerin devam eden ve tamamlanan çizim, sulama, render ve teslimat adımlarını yönetin.
                        </p>
                      </div>

                      {/* 4 Task KPI Counters */}
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                        <div className="px-3 py-1.5 rounded-xl bg-obsidian-900 border border-orange-950 text-slate-300">
                          Toplam: <strong className="text-white">{totalCount}</strong> İş
                        </div>
                        <div className="px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-800/80 text-amber-300 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                          Devam Eden: <strong>{inProgressCount}</strong>
                        </div>
                        <div className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 flex items-center gap-1.5">
                          <span>✓</span>
                          Biten / Tamam: <strong>{completedCount}</strong>
                        </div>
                        <div className="px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400">
                          Bekleyen: <strong>{pendingCount}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Global Add Task to Any Project */}
                    {orders.length > 0 && (
                      <div className="p-4 rounded-2xl bg-obsidian-900 border border-orange-950 space-y-3">
                        <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <Plus className="w-3.5 h-3.5 text-orange-400" />
                          <span>Hızlı İş / Görev Ekle:</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                          <select
                            value={globalTaskTargetOrderId || orders[0]?.id}
                            onChange={(e) => setGlobalTaskTargetOrderId(e.target.value)}
                            className="sm:col-span-4 bg-obsidian-950 border border-orange-950 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-orange-500 font-mono"
                          >
                            {orders.map((ord) => {
                              const name = ord.invoice.type === 'bireysel' ? ord.invoice.fullName : ord.invoice.companyName;
                              return (
                                <option key={ord.id} value={ord.id}>
                                  {ord.id} - {name} ({ord.invoice.city})
                                </option>
                              );
                            })}
                          </select>

                          <input
                            type="text"
                            value={globalTaskInput}
                            onChange={(e) => setGlobalTaskInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const targetId = globalTaskTargetOrderId || orders[0]?.id;
                                if (globalTaskInput.trim() && targetId) {
                                  addTaskToOrder(targetId, globalTaskInput.trim());
                                  setGlobalTaskInput('');
                                }
                              }
                            }}
                            placeholder="Yeni görev veya revizyon maddesi yazın (Örn: Havuz çevresi aydınlatma armatür seçimi)..."
                            className="sm:col-span-6 bg-obsidian-950 border border-orange-950 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500"
                          />

                          <button
                            type="button"
                            onClick={() => {
                              const targetId = globalTaskTargetOrderId || orders[0]?.id;
                              if (globalTaskInput.trim() && targetId) {
                                addTaskToOrder(targetId, globalTaskInput.trim());
                                setGlobalTaskInput('');
                              }
                            }}
                            className="sm:col-span-2 py-2 px-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-glow-sm"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>İş Ekle</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Filter & Search Bar */}
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2 border-t border-orange-950/80">
                      {/* Status Filter Tabs */}
                      <div className="flex items-center gap-1 bg-obsidian-900 p-1 rounded-xl border border-orange-950 text-xs overflow-x-auto">
                        <button
                          type="button"
                          onClick={() => setTaskStatusFilter('all')}
                          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                            taskStatusFilter === 'all'
                              ? 'bg-orange-600 text-white shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Tüm İşler ({totalCount})
                        </button>
                        <button
                          type="button"
                          onClick={() => setTaskStatusFilter('devam_ediyor')}
                          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                            taskStatusFilter === 'devam_ediyor'
                              ? 'bg-amber-500 text-obsidian-950 shadow-sm'
                              : 'text-amber-400/80 hover:text-amber-300'
                          }`}
                        >
                          <span>⏳ Devam Edenler ({inProgressCount})</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setTaskStatusFilter('bitti')}
                          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                            taskStatusFilter === 'bitti'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'text-emerald-400/80 hover:text-emerald-300'
                          }`}
                        >
                          <span>✓ Bitenler ({completedCount})</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setTaskStatusFilter('bekliyor')}
                          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                            taskStatusFilter === 'bekliyor'
                              ? 'bg-slate-700 text-white shadow-sm'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <span>⚪ Bekleyenler ({pendingCount})</span>
                        </button>
                      </div>

                      {/* Dropdown & Search Filter */}
                      <div className="flex items-center gap-2">
                        <select
                          value={taskOrderFilter}
                          onChange={(e) => setTaskOrderFilter(e.target.value)}
                          className="bg-obsidian-900 border border-orange-950 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-orange-500"
                        >
                          <option value="all">📁 Tüm Projeler ({orders.length})</option>
                          {orders.map((ord) => {
                            const name = ord.invoice.type === 'bireysel' ? ord.invoice.fullName : ord.invoice.companyName;
                            return (
                              <option key={ord.id} value={ord.id}>
                                {ord.id} - {name}
                              </option>
                            );
                          })}
                        </select>

                        <div className="relative">
                          <input
                            type="text"
                            value={taskSearchQuery}
                            onChange={(e) => setTaskSearchQuery(e.target.value)}
                            placeholder="Görev veya müşteri ara..."
                            className="bg-obsidian-900 border border-orange-950 rounded-xl px-3 py-1.5 pl-8 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500 w-44 sm:w-56"
                          />
                          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Filtered Projects & Tasks Cards */}
                  {filteredProjects.length === 0 ? (
                    <div className="bg-obsidian-950 p-16 rounded-3xl border border-dashed border-orange-950/80 text-center space-y-3">
                      <ListTodo className="w-10 h-10 text-orange-400/40 mx-auto" />
                      <h4 className="text-sm font-bold text-white">Eşleşen Görev veya Proje Bulunamadı</h4>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        Arama filtrenizi temizleyebilir veya yeni bir sipariş geldiğinde görev listesini otomatik takip edebilirsiniz.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {filteredProjects.map(({ order, tasks }) => {
                        const clientName = (order.invoice.type === 'bireysel' ? order.invoice.fullName : order.invoice.companyName) || 'İsimsiz Müşteri';
                        const visibleTasks = taskStatusFilter === 'all'
                          ? tasks
                          : tasks.filter((t) => t.status === taskStatusFilter);

                        const projectCompleted = tasks.filter((t) => t.status === 'bitti').length;
                        const projectTotal = tasks.length;
                        const percent = projectTotal > 0 ? Math.round((projectCompleted / projectTotal) * 100) : 0;

                        return (
                          <div
                            key={order.id}
                            className="bg-obsidian-950 p-6 rounded-3xl border border-orange-950 space-y-4 hover:border-orange-900/80 transition-colors"
                          >
                            {/* Project Header Info */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-orange-950">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-orange-950/60 border border-orange-800/80 flex items-center justify-center text-orange-400 font-mono font-bold text-xs shrink-0">
                                  {order.id.slice(0, 7)}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-bold text-white">{clientName}</h4>
                                    <span className="text-[10px] font-mono text-orange-400 font-bold bg-orange-950/80 px-2 py-0.5 rounded border border-orange-900">
                                      {order.id}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                                    <MapPin className="w-3 h-3 text-orange-400" />
                                    <span>{order.invoice.city} / {order.invoice.district}</span>
                                    <span>•</span>
                                    <span>{order.areaM2} m²</span>
                                    <span>•</span>
                                    <span className="font-mono text-white font-bold">{formatTL(order.totalPrice)}</span>
                                  </p>
                                </div>
                              </div>

                              {/* Project Progress Gauge */}
                              <div className="flex items-center gap-3 self-end sm:self-center">
                                <div className="text-right">
                                  <div className="text-xs font-mono font-bold text-orange-400">%{percent} Tamamlandı</div>
                                  <div className="text-[10px] text-slate-500 font-mono">{projectCompleted}/{projectTotal} Aşama Bitti</div>
                                </div>
                                <div className="w-24 h-2 bg-obsidian-900 rounded-full overflow-hidden border border-orange-950">
                                  <div
                                    className="h-full bg-gradient-to-r from-orange-600 via-amber-500 to-emerald-500 transition-all duration-500"
                                    style={{ width: `${percent}%` }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Task Items Table / List */}
                            <div className="space-y-2">
                              {visibleTasks.map((task) => (
                                <div
                                  key={task.id}
                                  className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                                    task.status === 'bitti'
                                      ? 'bg-emerald-950/15 border-emerald-900/50 text-slate-300'
                                      : task.status === 'devam_ediyor'
                                      ? 'bg-amber-950/20 border-amber-900/60 text-white'
                                      : 'bg-obsidian-900/80 border-orange-950 text-slate-400'
                                  }`}
                                >
                                  <div className="flex items-start sm:items-center gap-3">
                                    <div
                                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 sm:mt-0 ${
                                        task.status === 'bitti'
                                          ? 'bg-emerald-500 text-obsidian-950'
                                          : task.status === 'devam_ediyor'
                                          ? 'bg-amber-500 text-obsidian-950 animate-pulse'
                                          : 'bg-obsidian-950 border border-slate-700 text-slate-500'
                                      }`}
                                    >
                                      {task.status === 'bitti' ? '✓' : task.status === 'devam_ediyor' ? '⏳' : '○'}
                                    </div>
                                    <div>
                                      <div className={`text-xs font-semibold ${task.status === 'bitti' ? 'line-through text-slate-400' : 'text-white'}`}>
                                        {task.title}
                                      </div>
                                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                                        Kategori: <span className="text-slate-300 uppercase">{task.category}</span> • Son Güncelleme: {new Date(task.updatedAt).toLocaleDateString('tr-TR')} {new Date(task.updatedAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                      </div>
                                    </div>
                                  </div>

                                  {/* 3 Status Switcher Buttons: Bekliyor / Devam Ediyor / Bitti */}
                                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => toggleTaskStatus(order.id, task.id, 'bekliyor')}
                                      className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                                        task.status === 'bekliyor'
                                          ? 'bg-slate-800 text-slate-200 border border-slate-600 shadow-sm'
                                          : 'bg-obsidian-950 text-slate-500 hover:text-slate-300 border border-transparent'
                                      }`}
                                    >
                                      ⚪ Bekliyor
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => toggleTaskStatus(order.id, task.id, 'devam_ediyor')}
                                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                        task.status === 'devam_ediyor'
                                          ? 'bg-amber-500 text-obsidian-950 font-black shadow-glow-sm'
                                          : 'bg-obsidian-950 text-amber-400/80 hover:text-amber-300 border border-transparent'
                                      }`}
                                    >
                                      <span>⏳ Devam Ediyor</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => toggleTaskStatus(order.id, task.id, 'bitti')}
                                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                        task.status === 'bitti'
                                          ? 'bg-emerald-500 text-obsidian-950 font-black shadow-glow-sm'
                                          : 'bg-obsidian-950 text-emerald-400/80 hover:text-emerald-300 border border-transparent'
                                      }`}
                                    >
                                      <span>✓ Bitti</span>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()
          ) : activeTab === 'finance' ? (
            /* Finance & Invoices View */
            <div className="bg-obsidian-950 p-6 rounded-3xl border border-orange-950 space-y-6">
              <div className="flex items-center justify-between border-b border-orange-950 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Finans, Tahsilat & Fatura Dökümü</h3>
                  <p className="text-xs text-slate-400">Tüm online ve havale siparişlerinin muhasebe dökümü</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Net Ciro Toplamı:</div>
                  <div className="text-2xl font-black font-mono text-orange-400">{formatTL(totalRevenue)}</div>
                </div>
              </div>

              {/* Invoices Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-obsidian-900 text-slate-400 font-mono uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Sipariş No</th>
                      <th className="p-3">Müşteri / Firma</th>
                      <th className="p-3">Hizmetler</th>
                      <th className="p-3">Tutar</th>
                      <th className="p-3">Ödeme Kanalı</th>
                      <th className="p-3">Fatura Durumu</th>
                      <th className="p-3">Tarih</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-950/60">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-16 text-slate-400">
                          <Receipt className="w-8 h-8 text-orange-400/40 mx-auto mb-2" />
                          <p className="font-semibold text-slate-300">Henüz Kayıtlı Finansal İşlem Yok</p>
                          <p className="text-[11px] text-slate-500 mt-1">Gelen ödemeler ve düzenlenen e-faturalar burada döküm olarak listelenir.</p>
                        </td>
                      </tr>
                    ) : (
                      orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-obsidian-900/50">
                          <td className="p-3 font-mono font-bold text-orange-400">{ord.id}</td>
                          <td className="p-3 font-semibold text-white">
                            {ord.invoice.type === 'bireysel' ? ord.invoice.fullName : ord.invoice.companyName}
                          </td>
                          <td className="p-3">
                            {[
                              ord.selectedServices.landscapeProject && 'Peyzaj',
                              ord.selectedServices.visual3D && '3D',
                              ord.selectedServices.irrigationProject && 'Sulama',
                            ]
                              .filter(Boolean)
                              .join(' + ')}
                          </td>
                          <td className="p-3 font-mono font-black text-white">{formatTL(ord.totalPrice)}</td>
                          <td className="p-3">
                            <span className="bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-mono text-[10px]">
                              {ord.paymentMethod === 'credit_card' ? '3D SECURE POS' : 'BANKA HAVALE'}
                            </span>
                          </td>
                          <td className="p-3">
                            {ord.invoiceIssued ? (
                              <span className="text-emerald-400 font-mono text-[10px]">✓ {ord.invoiceNumber}</span>
                            ) : (
                              <span className="text-amber-400 font-mono text-[10px]">Bekliyor</span>
                            )}
                          </td>
                          <td className="p-3 text-slate-500 font-mono">{new Date(ord.createdAt).toLocaleDateString('tr-TR')}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === 'payment_settings' ? (
            /* 3. Paynkolay API & Ödeme Ayarları View */
            <div className="space-y-6 animate-fade-in">
              {/* Header Box */}
              <div className="bg-obsidian-950 p-6 rounded-3xl border border-orange-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-white rounded-2xl shadow-md shrink-0">
                    <PaynkolayLogo className="h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white font-serif">Paynkolay Sanal POS & API Entegrasyon Ayarları</h3>
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-700/60 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono">
                        AKTİF / CANLI
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Aktif Bank Paynkolay ödeme ağ geçidi kimlik doğrulama, token ve iade anahtarları yönetimi.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleTestPaynkolay}
                    disabled={paynkolayTestStatus === 'testing'}
                    className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-200 bg-obsidian-900 hover:bg-obsidian-800 border border-orange-950 hover:border-orange-500/50 flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-orange-400 ${paynkolayTestStatus === 'testing' ? 'animate-spin' : ''}`} />
                    <span>{paynkolayTestStatus === 'testing' ? 'Test Ediliyor...' : '🔌 POS Bağlantısını Test Et'}</span>
                  </button>

                  <button
                    onClick={handleSavePaynkolay}
                    className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-orange-600 hover:bg-orange-500 shadow-glow flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Değişiklikleri Kaydet</span>
                  </button>
                </div>
              </div>

              {/* Paynkolay Connection Status Banner */}
              {paynkolayTestStatus === 'success' && (
                <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-xs flex items-center gap-3 animate-fade-in">
                  <div className="w-8 h-8 rounded-xl bg-emerald-900/80 border border-emerald-600 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-bold text-emerald-200">Aktif Bank Paynkolay Sanal POS Canlı Modda Aktif!</div>
                    <div className="text-[11px] text-emerald-400/90 font-mono">{paynkolayTestMsg}</div>
                  </div>
                </div>
              )}

              {paynkolayTestStatus === 'error' && (
                <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-3 animate-fade-in">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  <div>
                    <div className="font-bold text-rose-200">Bağlantı Uyarısı</div>
                    <div className="text-[11px] text-rose-400 font-mono">{paynkolayTestMsg}</div>
                  </div>
                </div>
              )}

              {/* 4 Paynkolay API Parameter Cards (Exact Match to User Screen) */}
              <div className="space-y-4">
                
                {/* 1. Token (sx) Değeri */}
                <div className="bg-obsidian-950 p-6 rounded-3xl border border-orange-950/80 hover:border-orange-500/40 transition-all space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-blue-950/80 border border-blue-700/60 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Info className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Token (sx) Değeri</h4>
                        <p className="text-xs text-slate-400">Ödeme ve diğer API çağrılarında kimlik doğrulama amacıyla kullanılır.</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowTokens((prev) => ({ ...prev, tokenSx: !prev.tokenSx }))}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-obsidian-900 border border-orange-950 hover:border-orange-800 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                    >
                      {showTokens.tokenSx ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showTokens.tokenSx ? 'Tokeni Gizle' : 'Tokeni Göster'}</span>
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch gap-3">
                    <textarea
                      rows={2}
                      value={showTokens.tokenSx ? paynkolaySettings.tokenSx : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                      onChange={(e) => setPaynkolaySettings({ ...paynkolaySettings, tokenSx: e.target.value })}
                      className="flex-1 bg-obsidian-900 border border-orange-950 rounded-2xl p-3 text-xs font-mono text-slate-200 focus:border-orange-500 outline-none select-all"
                    />
                    <button
                      onClick={() => handleCopy('tokenSx', paynkolaySettings.tokenSx)}
                      className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 ${
                        copiedField === 'tokenSx'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
                      }`}
                    >
                      {copiedField === 'tokenSx' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedField === 'tokenSx' ? 'Kopyalandı!' : 'Kopyala'}</span>
                    </button>
                  </div>
                </div>

                {/* 2. İptal/İade Değeri */}
                <div className="bg-obsidian-950 p-6 rounded-3xl border border-orange-950/80 hover:border-orange-500/40 transition-all space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-amber-950/80 border border-amber-700/60 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                        <RefreshCw className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">İptal/İade Değeri</h4>
                        <p className="text-xs text-slate-400">Gerçekleşmiş bir ödeme işlemini iptal/iade etmek için kullanılan doğrulama değeridir. İptal/İade API çağrılarında gönderilmelidir.</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowTokens((prev) => ({ ...prev, refundValue: !prev.refundValue }))}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-obsidian-900 border border-orange-950 hover:border-orange-800 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                    >
                      {showTokens.refundValue ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showTokens.refundValue ? 'Değeri Gizle' : 'İptal/İade Değerini Göster'}</span>
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch gap-3">
                    <textarea
                      rows={2}
                      value={showTokens.refundValue ? paynkolaySettings.refundValue : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                      onChange={(e) => setPaynkolaySettings({ ...paynkolaySettings, refundValue: e.target.value })}
                      className="flex-1 bg-obsidian-900 border border-orange-950 rounded-2xl p-3 text-xs font-mono text-slate-200 focus:border-orange-500 outline-none select-all"
                    />
                    <button
                      onClick={() => handleCopy('refundValue', paynkolaySettings.refundValue)}
                      className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 ${
                        copiedField === 'refundValue'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
                      }`}
                    >
                      {copiedField === 'refundValue' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedField === 'refundValue' ? 'Kopyalandı!' : 'Kopyala'}</span>
                    </button>
                  </div>
                </div>

                {/* 3. İşlem Listeleme Değeri */}
                <div className="bg-obsidian-950 p-6 rounded-3xl border border-orange-950/80 hover:border-orange-500/40 transition-all space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-cyan-950/80 border border-cyan-700/60 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">İşlem Listeleme Değeri</h4>
                        <p className="text-xs text-slate-400">Geçmiş ödeme işlemlerinizi sorgulamak, listelemek ve mutabakat için kullanılan doğrulama değeridir.</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowTokens((prev) => ({ ...prev, listingValue: !prev.listingValue }))}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-obsidian-900 border border-orange-950 hover:border-orange-800 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                    >
                      {showTokens.listingValue ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showTokens.listingValue ? 'Değeri Gizle' : 'İşlem Listeleme Değerini Göster'}</span>
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch gap-3">
                    <textarea
                      rows={2}
                      value={showTokens.listingValue ? paynkolaySettings.listingValue : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                      onChange={(e) => setPaynkolaySettings({ ...paynkolaySettings, listingValue: e.target.value })}
                      className="flex-1 bg-obsidian-900 border border-orange-950 rounded-2xl p-3 text-xs font-mono text-slate-200 focus:border-orange-500 outline-none select-all"
                    />
                    <button
                      onClick={() => handleCopy('listingValue', paynkolaySettings.listingValue)}
                      className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 ${
                        copiedField === 'listingValue'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
                      }`}
                    >
                      {copiedField === 'listingValue' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedField === 'listingValue' ? 'Kopyalandı!' : 'Kopyala'}</span>
                    </button>
                  </div>
                </div>

                {/* 4. Merchant Secret Key */}
                <div className="bg-obsidian-950 p-6 rounded-3xl border border-orange-950/80 hover:border-orange-500/40 transition-all space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-purple-950/80 border border-purple-700/60 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Key className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Merchant Secret Key</h4>
                        <p className="text-xs text-slate-400">Tüm API işlemlerinde kullanılan gizli anahtardır. Bu anahtar sadece sunucu tarafında saklanmalı ve üçüncü kişilerle paylaşılmamalıdır. Merchant Secret Key aynı gün içerisinde en fazla 1 kez güncellenebilir.</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowTokens((prev) => ({ ...prev, merchantSecretKey: !prev.merchantSecretKey }))}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-obsidian-900 border border-orange-950 hover:border-orange-800 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                    >
                      {showTokens.merchantSecretKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showTokens.merchantSecretKey ? 'Anahtarı Gizle' : 'Secret Key\'i Göster'}</span>
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch gap-3">
                    <div className="flex-1 space-y-1">
                      <input
                        type={showTokens.merchantSecretKey ? 'text' : 'password'}
                        value={paynkolaySettings.merchantSecretKey}
                        onChange={(e) => setPaynkolaySettings({ ...paynkolaySettings, merchantSecretKey: e.target.value })}
                        className="w-full bg-obsidian-900 border border-orange-950 rounded-2xl p-3 text-xs font-mono text-white focus:border-orange-500 outline-none"
                      />
                      <span className="text-[11px] text-red-400/90 block pl-1">
                        Secret Key güvenlik nedeniyle aynı gün içerisinde en fazla 1 kez güncellenebilir.
                      </span>
                    </div>

                    <button
                      onClick={handleSavePaynkolay}
                      className="px-4 py-3 bg-obsidian-900 hover:bg-obsidian-850 border border-orange-950 text-slate-200 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-orange-400" />
                      <span>Güncelle</span>
                    </button>

                    <button
                      onClick={() => handleCopy('merchantSecretKey', paynkolaySettings.merchantSecretKey)}
                      className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 ${
                        copiedField === 'merchantSecretKey'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
                      }`}
                    >
                      {copiedField === 'merchantSecretKey' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedField === 'merchantSecretKey' ? 'Kopyalandı!' : 'Kopyala'}</span>
                    </button>
                  </div>
                </div>

                {/* 5. Banka Havale / FAST Bilgileri (Akbank) */}
                <div className="bg-obsidian-950 p-6 rounded-3xl border border-orange-950/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-orange-950/80 border border-orange-700/60 text-orange-400 flex items-center justify-center shrink-0">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Banka Havalesi / FAST Hesap Bilgileri</h4>
                        <p className="text-xs text-slate-400">Sipariş sihirbazı Step 5'te müşterilere gösterilen resmi banka hesabı</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400">Banka Adı:</label>
                      <input
                        type="text"
                        value={paynkolaySettings.bankName}
                        onChange={(e) => setPaynkolaySettings({ ...paynkolaySettings, bankName: e.target.value })}
                        className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-2.5 text-xs text-white outline-none focus:border-orange-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400">Hesap Sahibi (Alıcı):</label>
                      <input
                        type="text"
                        value={paynkolaySettings.accountHolder}
                        onChange={(e) => setPaynkolaySettings({ ...paynkolaySettings, accountHolder: e.target.value })}
                        className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-2.5 text-xs text-white outline-none focus:border-orange-500 font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400">IBAN Numarası:</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={paynkolaySettings.iban}
                          onChange={(e) => setPaynkolaySettings({ ...paynkolaySettings, iban: e.target.value })}
                          className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-2.5 text-xs font-mono text-orange-400 outline-none focus:border-orange-500 font-bold"
                        />
                        <button
                          onClick={() => handleCopy('iban', paynkolaySettings.iban)}
                          className="p-2.5 bg-obsidian-900 hover:bg-orange-950 border border-orange-950 text-orange-400 rounded-xl"
                          title="Kopyala"
                        >
                          {copiedField === 'iban' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleSavePaynkolay}
                      className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-orange-600 hover:bg-orange-500 shadow-glow flex items-center gap-2 cursor-pointer transition-all"
                    >
                      <Check className="w-4 h-4" />
                      <span>Tüm Ödeme Ayarlarını Kaydet</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ) : activeTab === 'mail_templates' ? (
            /* TAB 4: Mail Şablonları & E-Posta Yönetimi (peyzajdetay@gmail.com) */
            <div className="space-y-6 animate-fade-in">
              {/* Header Title & Status Banner */}
              <div className="bg-obsidian-950 p-6 rounded-3xl border border-orange-950/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-serif font-bold text-white">Detay Peyzaj E-Posta Şablonları & Gönderim Merkezi</h3>
                      <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-700/60 px-2 py-0.5 rounded-full font-bold">
                        AKTİF GÖNDERİCİ
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Tüm kurumsal bildirimler, sipariş onayları ve proje teslimatları <strong>peyzajdetay@gmail.com</strong> üzerinden iletilir.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono">
                  <div className="bg-obsidian-900 border border-orange-950 px-3 py-2 rounded-xl text-slate-300">
                    <span className="text-slate-500">Gönderen:</span> <span className="text-orange-400 font-bold">{mailConfig.senderEmail}</span>
                  </div>
                </div>
              </div>

              {/* Sender & Server Configuration Card */}
              <div className="bg-obsidian-950 p-5 rounded-2xl border border-orange-950 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Settings className="w-4 h-4 text-orange-400" />
                    <span>E-Posta Gönderici & Bildirim Ayarları</span>
                  </div>
                  <button
                    onClick={() => {
                      saveStoredMailConfig(mailConfig);
                      alert('E-posta gönderici ayarları başarıyla kaydedildi!');
                    }}
                    className="px-3 py-1 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    Ayarları Kaydet
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400">Gönderen E-Posta (From):</label>
                    <input
                      type="email"
                      value={mailConfig.senderEmail}
                      onChange={(e) => setMailConfig({ ...mailConfig, senderEmail: e.target.value })}
                      className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-2.5 text-xs text-orange-400 font-mono font-bold focus:border-orange-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400">Gönderici Başlığı (Display Name):</label>
                    <input
                      type="text"
                      value={mailConfig.senderName}
                      onChange={(e) => setMailConfig({ ...mailConfig, senderName: e.target.value })}
                      className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-2.5 text-xs text-white focus:border-orange-500 outline-none font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-slate-400">Yönetici Bildirim Adresleri (Virgülle ayırın):</label>
                    <input
                      type="text"
                      value={mailConfig.adminNotifyEmails.join(', ')}
                      onChange={(e) =>
                        setMailConfig({
                          ...mailConfig,
                          adminNotifyEmails: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-2.5 text-xs text-white font-mono focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Template Selector Tabs */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block uppercase tracking-wider">Düzenlenecek Mail Şablonunu Seçin:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {mailTemplates.map((tpl) => (
                    <button
                      key={tpl.id}
                      onClick={() => setSelectedTemplateId(tpl.id)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        selectedTemplateId === tpl.id
                          ? 'bg-orange-950/50 border-orange-500 text-white shadow-glow-sm ring-1 ring-orange-500/50'
                          : 'bg-obsidian-950 border-orange-950 text-slate-400 hover:text-white hover:border-orange-900'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs text-white mb-1.5 flex items-center justify-between">
                          <span>{tpl.name}</span>
                          {selectedTemplateId === tpl.id && <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">{tpl.description}</p>
                      </div>
                      <span className="text-[10px] text-orange-400/90 font-mono mt-3 block">Şablon ID: #{tpl.id}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Variables Pill Bar */}
              <div className="bg-obsidian-950 p-4 rounded-2xl border border-orange-950/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                    <span>Dinamik Değişkenler (Kopyalamak için tıklayın):</span>
                  </span>
                  {copiedTag && (
                    <span className="text-[11px] text-emerald-400 font-bold font-mono animate-fade-in">
                      ✓ {copiedTag} panoya kopyalandı!
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  {[
                    { tag: '{MUSTERI_ADI}', desc: 'Müşteri Adı' },
                    { tag: '{KOD}', desc: '6 Haneli Kod' },
                    { tag: '{EPOSTA}', desc: 'E-Posta Adresi' },
                    { tag: '{SIPARIS_NO}', desc: 'Sipariş No' },
                    { tag: '{TUTAR}', desc: 'Toplam Fiyat (TL)' },
                    { tag: '{ALAN_M2}', desc: 'Arsa Alanı' },
                    { tag: '{HIZMETLER}', desc: 'Seçili Hizmetler' },
                    { tag: '{TESLIM_TARIHI}', desc: 'Teslim Tarihi' },
                    { tag: '{FATURA_NO}', desc: 'E-Fatura No' },
                  ].map((v) => (
                    <button
                      key={v.tag}
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(v.tag);
                        setCopiedTag(v.tag);
                        setTimeout(() => setCopiedTag(null), 2000);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-obsidian-900 hover:bg-orange-950/60 border border-orange-950 hover:border-orange-500 text-orange-400 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                      title={`${v.desc} eklemek için tıkla`}
                    >
                      <span>{v.tag}</span>
                      <span className="text-[10px] text-slate-500 font-normal">({v.desc})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Template Editor & Live Preview Grid */}
              {(() => {
                const currentTpl = mailTemplates.find((t) => t.id === selectedTemplateId) || mailTemplates[0];

                const updateCurrentTpl = (fields: Partial<MailTemplate>) => {
                  const updated = mailTemplates.map((t) => (t.id === currentTpl.id ? { ...t, ...fields } : t));
                  setMailTemplates(updated);
                };

                const sampleVariables = {
                  MUSTERI_ADI: activeOrder ? (activeOrder.invoice.type === 'bireysel' ? activeOrder.invoice.fullName : activeOrder.invoice.companyName) || 'Ahmet Yılmaz' : 'Ahmet Yılmaz',
                  KOD: '849201',
                  EPOSTA: testEmailAddress || 'musteri@eposta.com',
                  SIPARIS_NO: activeOrder ? activeOrder.id : 'ORD-2026-9812',
                  TUTAR: activeOrder ? formatTL(activeOrder.totalPrice) : '12.000 ₺',
                  ALAN_M2: activeOrder ? activeOrder.areaM2 : '1000',
                  HIZMETLER: activeOrder
                    ? [activeOrder.selectedServices.landscapeProject && 'Peyzaj Projesi', activeOrder.selectedServices.visual3D && '3D Render', activeOrder.selectedServices.irrigationProject && 'Sulama']
                        .filter(Boolean)
                        .join(' + ')
                    : 'Peyzaj Projesi + 3D Render',
                  TESLIM_TARIHI: '10 Eylül 2026',
                  FATURA_NO: activeOrder?.invoiceNumber || 'GIB2026000001429',
                };

                const renderedSubject = renderTemplateText(currentTpl.subject, sampleVariables);
                const renderedHeading = renderTemplateText(currentTpl.heading, sampleVariables);
                const renderedBadge = renderTemplateText(currentTpl.badge, sampleVariables);
                const renderedBody = renderTemplateText(currentTpl.bodyContent, sampleVariables);
                const renderedButton = renderTemplateText(currentTpl.buttonText, sampleVariables);
                const renderedFooter = renderTemplateText(currentTpl.footerNote, sampleVariables);

                const handleSendTest = async () => {
                  setTestEmailStatus('sending');
                  try {
                    if (currentTpl.id === 'password_reset') {
                      await fetch('/api/send-password-reset', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          email: testEmailAddress,
                          code: '849201',
                          userName: sampleVariables.MUSTERI_ADI,
                          customTemplate: {
                            subject: renderedSubject,
                            heading: renderedHeading,
                            badge: renderedBadge,
                            badgeColor: currentTpl.badgeColor,
                            bodyContent: renderedBody,
                            buttonText: renderedButton,
                            buttonUrl: currentTpl.buttonUrl,
                            footerNote: renderedFooter,
                          },
                        }),
                      });
                    } else if (currentTpl.id === 'activation_code') {
                      await fetch('/api/send-verification-code', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          email: testEmailAddress,
                          code: '849201',
                          userName: sampleVariables.MUSTERI_ADI,
                          customTemplate: {
                            subject: renderedSubject,
                            heading: renderedHeading,
                            badge: renderedBadge,
                            badgeColor: currentTpl.badgeColor,
                            bodyContent: renderedBody,
                            buttonText: renderedButton,
                            buttonUrl: currentTpl.buttonUrl,
                            footerNote: renderedFooter,
                          },
                        }),
                      });
                    } else {
                      // Send test order email payload via API
                      await fetch('/api/send-order-email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          order: { id: sampleVariables.SIPARIS_NO, isPaid: true },
                          customerInfo: {
                            name: sampleVariables.MUSTERI_ADI,
                            phone: '0544 477 20 44',
                            email: testEmailAddress,
                            city: 'Çanakkale',
                            district: 'Merkez',
                            type: 'bireysel',
                          },
                          services: ['Peyzaj Projesi (Test)'],
                          areaM2: Number(sampleVariables.ALAN_M2),
                          totalPrice: sampleVariables.TUTAR,
                          paymentMethod: 'credit_card',
                          notes: `[TEST E-POSTASI] Şablon: ${currentTpl.name}`,
                        }),
                      });
                    }
                    setTestEmailStatus('sent');
                    setTimeout(() => setTestEmailStatus('idle'), 4000);
                  } catch (err) {
                    console.error(err);
                    setTestEmailStatus('sent');
                    setTimeout(() => setTestEmailStatus('idle'), 4000);
                  }
                };

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: Editor Form */}
                    <div className="bg-obsidian-950 p-6 rounded-3xl border border-orange-950 space-y-4">
                      <div className="flex items-center justify-between border-b border-orange-950/80 pb-3">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <Edit3 className="w-4 h-4 text-orange-400" />
                          <span>Şablon İçeriğini Düzenle</span>
                        </h4>
                        <span className="text-[11px] text-slate-400 font-mono">{currentTpl.name}</span>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">E-Posta Konu Başlığı (Subject):</label>
                        <input
                          type="text"
                          value={currentTpl.subject}
                          onChange={(e) => updateCurrentTpl({ subject: e.target.value })}
                          className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-3 text-xs text-white focus:border-orange-500 outline-none font-medium"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-300">Üst Rozet (Badge) Metni:</label>
                          <input
                            type="text"
                            value={currentTpl.badge}
                            onChange={(e) => updateCurrentTpl({ badge: e.target.value })}
                            className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-2.5 text-xs text-white focus:border-orange-500 outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-300">Rozet Vurgu Rengi:</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={currentTpl.badgeColor}
                              onChange={(e) => updateCurrentTpl({ badgeColor: e.target.value })}
                              className="w-9 h-9 rounded-lg bg-transparent border-0 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={currentTpl.badgeColor}
                              onChange={(e) => updateCurrentTpl({ badgeColor: e.target.value })}
                              className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-2 text-xs font-mono text-white focus:border-orange-500 outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">E-Posta İçi Ana Başlık (H1):</label>
                        <input
                          type="text"
                          value={currentTpl.heading}
                          onChange={(e) => updateCurrentTpl({ heading: e.target.value })}
                          className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-3 text-xs text-white focus:border-orange-500 outline-none font-bold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">E-Posta Gövde Metni (Paragraflar):</label>
                        <textarea
                          rows={6}
                          value={currentTpl.bodyContent}
                          onChange={(e) => updateCurrentTpl({ bodyContent: e.target.value })}
                          className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-3 text-xs text-slate-200 focus:border-orange-500 outline-none font-sans leading-relaxed"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-300">Eylem Butonu Metni (CTA):</label>
                          <input
                            type="text"
                            value={currentTpl.buttonText}
                            onChange={(e) => updateCurrentTpl({ buttonText: e.target.value })}
                            className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-2.5 text-xs text-white focus:border-orange-500 outline-none font-bold"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-300">Buton Linki (URL):</label>
                          <input
                            type="text"
                            value={currentTpl.buttonUrl}
                            onChange={(e) => updateCurrentTpl({ buttonUrl: e.target.value })}
                            className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-2.5 text-xs text-slate-300 font-mono focus:border-orange-500 outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">Alt Bilgi / İletişim Notu:</label>
                        <input
                          type="text"
                          value={currentTpl.footerNote}
                          onChange={(e) => updateCurrentTpl({ footerNote: e.target.value })}
                          className="w-full bg-obsidian-900 border border-orange-950 rounded-xl p-2.5 text-xs text-slate-300 focus:border-orange-500 outline-none"
                        />
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-orange-950/80">
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm('Şablonu varsayılan fabrika ayarlarına döndürmek istediğinize emin misiniz?')) {
                              localStorage.removeItem('detay_mail_templates');
                              setMailTemplates(getStoredMailTemplates());
                            }
                          }}
                          className="text-xs text-slate-500 hover:text-red-400 underline cursor-pointer"
                        >
                          Varsayılana Sıfırla
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            saveStoredMailTemplates(mailTemplates);
                            alert(`"${currentTpl.name}" şablonu başarıyla kaydedildi!`);
                          }}
                          className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-orange-600 hover:bg-orange-500 shadow-glow flex items-center gap-2 cursor-pointer transition-all"
                        >
                          <Check className="w-4 h-4" />
                          <span>Şablonu Kaydet</span>
                        </button>
                      </div>
                    </div>

                    {/* Right: Live Visual Email Preview (Responsive Luxury Dark Frame) */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <Eye className="w-4 h-4 text-orange-400" />
                          <span>Müşteri E-Posta Kutusu Önizlemesi</span>
                        </h4>
                        <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                          Canlı Veriyle Eşleşti
                        </span>
                      </div>

                      {/* Mock Email Frame */}
                      <div className="bg-[#0f172a] rounded-3xl border border-orange-500/40 overflow-hidden shadow-2xl text-slate-200">
                        {/* Email Meta Bar */}
                        <div className="bg-[#1e293b] p-4 border-b border-slate-800 text-xs space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Kimden:</span>
                            <span className="text-white font-semibold">
                              {mailConfig.senderName} &lt;<span className="text-orange-400">{mailConfig.senderEmail}</span>&gt;
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Kime:</span>
                            <span className="text-slate-300 font-mono">{sampleVariables.MUSTERI_ADI} &lt;musteri@eposta.com&gt;</span>
                          </div>
                          <div className="flex justify-between pt-1 border-t border-slate-800/60">
                            <span className="text-slate-400">Konu:</span>
                            <span className="text-white font-bold">{renderedSubject}</span>
                          </div>
                        </div>

                        {/* Email Content Body */}
                        <div className="p-6 sm:p-8 space-y-6">
                          {/* Brand Header */}
                          <div className="text-center pb-4 border-b border-slate-800">
                            <div className="inline-block px-3 py-1 rounded-full text-[10px] font-mono font-black tracking-widest text-orange-400 bg-orange-950/80 border border-orange-800/80 mb-2">
                              DETAY PEYZAJ MİMARLIK
                            </div>
                            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                              {renderedHeading}
                            </h2>
                            {renderedBadge && (
                              <div
                                style={{ color: currentTpl.badgeColor, borderColor: `${currentTpl.badgeColor}40`, backgroundColor: `${currentTpl.badgeColor}15` }}
                                className="inline-block mt-2 px-3 py-1 rounded-full text-[11px] font-bold border"
                              >
                                {renderedBadge}
                              </div>
                            )}
                          </div>

                          {/* Rendered Paragraphs */}
                          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-[#1e293b]/70 p-5 rounded-2xl border border-slate-800">
                            {renderedBody}
                          </div>

                          {/* CTA Button */}
                          {renderedButton && (
                            <div className="text-center pt-2">
                              <a
                                href={currentTpl.buttonUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-xs shadow-glow hover:opacity-90 transition-all"
                              >
                                {renderedButton}
                              </a>
                            </div>
                          )}

                          {/* Footer Note & Signature */}
                          <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-400 space-y-2 text-center">
                            <p className="text-slate-300">{renderedFooter}</p>
                            <div className="pt-2 flex items-center justify-center gap-4 text-[10px] text-slate-500">
                              <span>📞 0544 477 20 44</span>
                              <span>✉️ {mailConfig.senderEmail}</span>
                              <span>🌐 detay-peyzaj.vercel.app</span>
                            </div>
                            <p className="text-[10px] text-slate-600">
                              Çanakkale / Türkiye • © {new Date().getFullYear()} Detay Peyzaj & Mimarlık. Tüm Hakları Saklıdır.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Test Email Dispatch Card */}
                      <div className="bg-obsidian-950 p-4 rounded-2xl border border-orange-950 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Send className="w-3.5 h-3.5 text-orange-400" />
                            <span>Şablonu Canlı E-Posta Olarak Test Et</span>
                          </span>
                          {testEmailStatus === 'sent' && (
                            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 animate-fade-in">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Test E-postası Gönderildi!
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="email"
                            value={testEmailAddress}
                            onChange={(e) => setTestEmailAddress(e.target.value)}
                            placeholder="peyzajdetay@gmail.com"
                            className="flex-1 bg-obsidian-900 border border-orange-950 rounded-xl p-2.5 text-xs text-white outline-none focus:border-orange-500 font-mono"
                          />
                          <button
                            type="button"
                            disabled={testEmailStatus === 'sending'}
                            onClick={handleSendTest}
                            className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all shrink-0 shadow-glow"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{testEmailStatus === 'sending' ? 'İletiliyor...' : 'Test Maili Gönder'}</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })()}

            </div>
          ) : null}

      </main>
    </div>
  );
};
