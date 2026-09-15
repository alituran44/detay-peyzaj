// Serverless API for cross-device order storage & synchronization
const CLOUD_STORE_URL = 'https://api.restful-api.dev/objects/ff808181a067127101a080b6001b48d4';

const DEFAULT_SEED_ORDERS = [];

// In-memory fallback cache across warm lambda invocations
let memoryOrdersCache = [];

export async function fetchCloudOrders() {
  try {
    const res = await fetch(CLOUD_STORE_URL, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (res.ok) {
      const json = await res.json();
      if (json && json.data && Array.isArray(json.data.orders)) {
        memoryOrdersCache = json.data.orders;
        return json.data.orders;
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
