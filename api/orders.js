// Serverless API for cross-device order storage & synchronization
const CLOUD_STORE_URL = 'https://api.restful-api.dev/objects/ff808181a067127101a080b6001b48d4';

const DEFAULT_SEED_ORDERS = [
  {
    id: 'DP-2026-8492',
    userId: 'gulnihal@kooperatif.com',
    userEmail: 'peyzajdetay@gmail.com',
    createdAt: new Date().toISOString(),
    areaM2: 1000,
    selectedServices: { landscapeProject: true, visual3D: true, irrigationProject: true },
    selectedStyle: 'Modern Akdeniz',
    status: '1_analiz',
    progressPercent: 20,
    totalPrice: 12000,
    isPaid: true,
    paymentMethod: 'bank_transfer',
    invoice: {
      type: 'kurumsal',
      fullName: 'SINIRLI SORUMLU GÜLNİHALDE KONUT YAPI KOOPERATİFİ',
      companyName: 'SINIRLI SORUMLU GÜLNİHALDE KONUT YAPI KOOPERATİFİ',
      email: 'peyzajdetay@gmail.com',
      phone: '+90 544 477 20 44',
      tcKimlikNo: '48920194821',
      taxNumber: '48920194821',
      taxOffice: 'Çanakkale Vergi Dairesi',
      city: 'Çanakkale',
      district: 'Merkez',
      fullAddress: '106 Ada 2 Parsel, Çanakkale',
    },
    notes: 'Vaziyet planı ve banka ödeme dekontu eklenmiştir. Proje çizimine başlanabilir.',
    customerDocuments: [
      {
        id: 'doc-seed-1',
        title: 'Vaziyet Planı / DWG Çizim Dosyası',
        category: 'kroki',
        fileName: 'SINIRLI SORUMLU GÜLNİHALDE KONUT YAPI KOOPERATİFİ_106 ADA 2 PARSEL_ PEYZAJ PROJESİ 07 01 2025.dwg',
        fileSize: '2.1 MB',
        fileUrl: '#',
        uploadedAt: new Date().toISOString(),
      },
      {
        id: 'doc-seed-2',
        title: 'Banka Ödeme Dekontu (Havale/EFT)',
        category: 'dekont',
        fileName: 'WhatsApp Image 2026-08-28 at 16.49.54.jpeg',
        fileSize: '0.1 MB',
        fileUrl: '#',
        uploadedAt: new Date().toISOString(),
      }
    ],
    deliverables: [],
    tasks: [
      { id: 'task-seed-1', orderId: 'DP-2026-8492', title: 'Tapu, İmar Çapı ve Vaziyet Analizi', category: 'analiz', status: 'devam_ediyor', updatedAt: new Date().toISOString() },
      { id: 'task-seed-2', orderId: 'DP-2026-8492', title: 'AutoCAD Yapısal Peyzaj / Sert Zemin Planı', category: 'dwg', status: 'bekliyor', updatedAt: new Date().toISOString() },
      { id: 'task-seed-3', orderId: 'DP-2026-8492', title: 'Bitkisel Tasarım & Ağaç-Çalı Konumlandırması', category: 'bitki', status: 'bekliyor', updatedAt: new Date().toISOString() },
      { id: 'task-seed-4', orderId: 'DP-2026-8492', title: 'Otomatik Sulama & Boru Hidrolik Hesabı', category: 'sulama', status: 'bekliyor', updatedAt: new Date().toISOString() },
      { id: 'task-seed-5', orderId: 'DP-2026-8492', title: 'Gece Aydınlatması & Elektrik Altyapı Planı', category: 'aydinlatma', status: 'bekliyor', updatedAt: new Date().toISOString() },
      { id: 'task-seed-6', orderId: 'DP-2026-8492', title: 'Lumion / 3ds Max 4K Fotogerçekçi Renderlar', category: 'render', status: 'bekliyor', updatedAt: new Date().toISOString() },
      { id: 'task-seed-7', orderId: 'DP-2026-8492', title: 'Metraj & Yaklaşık Maliyet Keşif Özeti', category: 'metraj', status: 'bekliyor', updatedAt: new Date().toISOString() },
      { id: 'task-seed-8', orderId: 'DP-2026-8492', title: 'E-Fatura & Proje Teslim Paketi', category: 'fatura', status: 'bekliyor', updatedAt: new Date().toISOString() },
    ],
    invoiceIssued: false,
  }
];

// In-memory fallback cache across warm lambda invocations
let memoryOrdersCache = [...DEFAULT_SEED_ORDERS];

export async function fetchCloudOrders() {
  try {
    const res = await fetch(CLOUD_STORE_URL, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (res.ok) {
      const json = await res.json();
      if (json && json.data && Array.isArray(json.data.orders)) {
        if (json.data.orders.length > 0) {
          memoryOrdersCache = json.data.orders;
          return json.data.orders;
        } else {
          // Store is empty, seed it
          await saveCloudOrders(DEFAULT_SEED_ORDERS);
          return DEFAULT_SEED_ORDERS;
        }
      }
    }
  } catch (err) {
    console.warn('[CLOUD STORE] GET failed, using memory cache:', err);
  }
  return memoryOrdersCache;
}

export async function saveCloudOrders(orders) {
  memoryOrdersCache = orders;
  try {
    const res = await fetch(CLOUD_STORE_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        name: 'detay_orders',
        data: { orders },
      }),
    });
    return res.ok;
  } catch (err) {
    console.warn('[CLOUD STORE] PUT failed:', err);
    return false;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const orders = await fetchCloudOrders();
      return res.status(200).json({ success: true, orders });
    }

    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    } else if (!body) {
      body = {};
    }

    if (req.method === 'POST') {
      const { newOrder, allOrders } = body;
      const currentOrders = await fetchCloudOrders();

      let updatedOrders = [...currentOrders];

      if (Array.isArray(allOrders) && allOrders.length > 0) {
        // Merge list
        const orderMap = new Map();
        allOrders.forEach((o) => orderMap.set(o.id, o));
        currentOrders.forEach((o) => {
          if (!orderMap.has(o.id)) orderMap.set(o.id, o);
        });
        updatedOrders = Array.from(orderMap.values());
      } else if (newOrder && newOrder.id) {
        const existingIndex = updatedOrders.findIndex((o) => o.id === newOrder.id);
        if (existingIndex >= 0) {
          updatedOrders[existingIndex] = { ...updatedOrders[existingIndex], ...newOrder };
        } else {
          updatedOrders.unshift(newOrder);
        }
      }

      await saveCloudOrders(updatedOrders);
      return res.status(200).json({ success: true, orders: updatedOrders });
    }

    if (req.method === 'PATCH') {
      const { orderId, updates } = body;
      if (!orderId) {
        return res.status(400).json({ error: 'orderId is required' });
      }

      const currentOrders = await fetchCloudOrders();
      const updatedOrders = currentOrders.map((o) =>
        o.id === orderId ? { ...o, ...updates } : o
      );

      await saveCloudOrders(updatedOrders);
      return res.status(200).json({ success: true, orders: updatedOrders });
    }

    if (req.method === 'DELETE') {
      const { orderId, clearAll } = body;
      if (clearAll) {
        await saveCloudOrders([]);
        return res.status(200).json({ success: true, orders: [] });
      }

      if (orderId) {
        const currentOrders = await fetchCloudOrders();
        const updatedOrders = currentOrders.filter((o) => o.id !== orderId);
        await saveCloudOrders(updatedOrders);
        return res.status(200).json({ success: true, orders: updatedOrders });
      }

      return res.status(400).json({ error: 'orderId or clearAll is required' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API /api/orders error:', error);
    return res.status(500).json({ error: 'Internal server error', details: String(error) });
  }
}
