import nodemailer from 'nodemailer';
import { fetchCloudOrders, saveCloudOrders } from './orders.js';

async function sendMailHelper({ to, subject, html, text, attachments }) {
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER || 'peyzajdetay@gmail.com';
  const smtpPass = (process.env.SMTP_PASS || process.env.GMAIL_PASS || process.env.GMAIL_APP_PASSWORD || 'ppxxlunfiqjasakh').replace(/\s+/g, '');
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = Number(process.env.SMTP_PORT) || 465;

  if (smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      return await transporter.sendMail({
        from: `"Detay Peyzaj" <${smtpUser}>`,
        to,
        subject,
        html,
        text,
        attachments: Array.isArray(attachments)
          ? attachments.map((a) => {
              const raw = a.content || '';
              const cleanBase64 = typeof raw === 'string' && raw.includes(',') ? raw.split(',')[1] : String(raw);
              return {
                filename: a.filename || a.fileName || 'dosya',
                content: Buffer.from(cleanBase64, 'base64'),
                contentType: a.contentType || 'application/octet-stream',
              };
            })
          : [],
      });
    } catch (smtpErr) {
      console.error('Nodemailer SMTP dispatch error:', smtpErr);
    }
  }

  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || `Detay Peyzaj <onboarding@resend.dev>`,
          to: Array.isArray(to) ? to : [to],
          reply_to: 'peyzajdetay@gmail.com',
          subject,
          html,
        }),
      });
      return await res.json();
    } catch (resendErr) {
      console.error('Resend API dispatch error:', resendErr);
    }
  }

  if (process.env.BREVO_API_KEY) {
    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
        },
        body: JSON.stringify({
          sender: { name: 'Detay Peyzaj & Mimarlik', email: 'peyzajdetay@gmail.com' },
          to: (Array.isArray(to) ? to : [to]).map(e => ({ email: e })),
          subject,
          htmlContent: html,
        }),
      });
      return await res.json();
    } catch (brevoErr) {
      console.error('Brevo API dispatch error:', brevoErr);
    }
  }
}

// Simple in-memory rate limiter per IP
const requestCounts = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 6;

function isRateLimited(ip) {
  const now = Date.now();
  const clientData = requestCounts.get(ip) || { count: 0, firstRequestTime: now };

  if (now - clientData.firstRequestTime > RATE_LIMIT_WINDOW_MS) {
    requestCounts.set(ip, { count: 1, firstRequestTime: now });
    return false;
  }

  if (clientData.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  clientData.count += 1;
  requestCounts.set(ip, clientData);
  return false;
}

function sanitizeString(str, maxLen = 500) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>]/g, '').trim().slice(0, maxLen);
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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate Limiting
  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown-ip';
  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: 'Çok fazla istek gönderildi. Lütfen bir süre sonra tekrar deneyiniz.' });
  }

  try {
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

    const { order, customerInfo, services, areaM2, totalPrice, paymentMethod, documents, attachments, notes, botField } = body;

    // Honeypot spam check
    if (botField) {
      console.warn(`[SPAM BLOCKED] Honeypot field triggered from ${clientIp}`);
      return res.status(200).json({ success: true, message: 'İstek işlendi.' });
    }

    if (!order || !order.id) {
      return res.status(400).json({ error: 'Geçersiz sipariş bilgisi.' });
    }

    // Input sanitization
    const cleanCustomerName = sanitizeString(customerInfo?.name || 'Müşteri', 100);
    const cleanPhone = sanitizeString(customerInfo?.phone || '-', 30);
    const cleanEmail = sanitizeString(customerInfo?.email || '', 100);
    const cleanTaxId = sanitizeString(customerInfo?.taxId || '-', 20);
    const cleanCity = sanitizeString(customerInfo?.city || '', 50);
    const cleanDistrict = sanitizeString(customerInfo?.district || '', 50);
    const cleanAddress = sanitizeString(customerInfo?.address || '-', 300);
    const cleanNotes = sanitizeString(notes || '', 1000);
    const cleanAreaM2 = Number(areaM2) > 0 ? Number(areaM2) : 1000;
    const cleanOrderId = sanitizeString(order.id, 50);

    const isQuotation = Boolean(body.customHtml || body.isQuotation);
    const TARGET_EMAILS = ['hhyildirimm@gmail.com', 'peyzajdetay@gmail.com'];
    const recipients = [...TARGET_EMAILS];
    if (cleanEmail && cleanEmail.includes('@') && !recipients.includes(cleanEmail)) {
      recipients.push(cleanEmail);
    }

    const emailSubject = isQuotation
      ? `🌿 [RESMİ PEYZAJ UYGULAMA TEKLİF FORMU] ${cleanOrderId} - ${cleanCustomerName} (${totalPrice})`
      : `🌿 [DETAY PEYZAJ SIPARIS] ${cleanOrderId} - ${cleanCustomerName} (${cleanAreaM2} m² - ${totalPrice} TL)`;

    const defaultHtmlBody = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 680px; margin: 0 auto; background-color: #0f172a; color: #f8fafc; border-radius: 16px; overflow: hidden; border: 1px solid #ea580c;">
        <div style="background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%); padding: 24px; text-align: center;">
          <h1 style="margin: 0; color: #ffffff; font-size: 24px; letter-spacing: 1px;">DETAY PEYZAJ MIMARLIK</h1>
          <p style="margin: 6px 0 0; color: #ffedd5; font-size: 14px;">Yeni Online Proje Siparişi & Odeme Alindi</p>
        </div>

        <div style="padding: 28px;">
          <div style="background-color: #1e293b; border-left: 4px solid #22c55e; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
            <div style="font-size: 18px; font-weight: bold; color: #22c55e;">Siparis No: ${cleanOrderId}</div>
            <div style="font-size: 14px; color: #94a3b8; margin-top: 4px;">Odeme Durumu: <strong style="color: #4ade80;">✓ ${paymentMethod === 'credit_card' ? '3D Secure Kredi Karti ile Tahsil Edildi' : 'Banka Havalesi Bildirimi'}</strong></div>
            <div style="font-size: 20px; font-weight: bold; color: #f97316; margin-top: 8px;">Toplam Tutar: ${totalPrice} TL (KDV Dahil)</div>
          </div>

          <h3 style="color: #fb923c; border-bottom: 1px solid #334155; padding-bottom: 8px; margin-top: 24px; font-size: 16px;">👤 Musteri & Fatura Bilgileri</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 12px;">
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; width: 35%;">Musteri / Unvan:</td>
              <td style="padding: 8px 0; color: #ffffff; font-weight: bold;">${cleanCustomerName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;">Telefon Numarasi:</td>
              <td style="padding: 8px 0; color: #38bdf8; font-weight: bold;">${cleanPhone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;">E-Posta:</td>
              <td style="padding: 8px 0; color: #ffffff;">${cleanEmail}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;">TCKN / Vergi No:</td>
              <td style="padding: 8px 0; color: #ffffff; font-family: monospace;">${cleanTaxId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;">Konum / Adres:</td>
              <td style="padding: 8px 0; color: #ffffff;">${cleanCity} / ${cleanDistrict} - ${cleanAddress}</td>
            </tr>
          </table>

          <h3 style="color: #fb923c; border-bottom: 1px solid #334155; padding-bottom: 8px; margin-top: 28px; font-size: 16px;">📐 Proje & Arsa Bilgileri</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 12px;">
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; width: 35%;">Arsa Buyuklugu:</td>
              <td style="padding: 8px 0; color: #facc15; font-weight: bold;">${cleanAreaM2} m²</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;">Satin Alinan Hizmetler:</td>
              <td style="padding: 8px 0; color: #ffffff; font-weight: bold;">${services?.join(' + ') || 'Peyzaj Projesi'}</td>
            </tr>
          </table>

          <!-- 📁 Yüklenen Proje Dosyaları & Belgeler -->
          <div style="margin-top: 28px; padding: 20px; background-color: #1e293b; border-radius: 12px; border: 1px solid #ea580c;">
            <h3 style="margin: 0 0 10px 0; color: #fb923c; font-size: 16px; border-bottom: 1px solid #334155; padding-bottom: 8px;">
              📁 Proje Dosyaları & Yüklenen Belgeler (${Array.isArray(documents) ? documents.length : 0} Adet)
            </h3>
            
            ${Array.isArray(documents) && documents.length > 0 ? `
              <div style="background-color: #0f172a; border-left: 4px solid #38bdf8; padding: 12px 14px; border-radius: 8px; margin-bottom: 16px;">
                <p style="margin: 0; font-size: 13px; color: #e2e8f0; line-height: 1.6;">
                  📎 <strong>Dosyalar Bu E-Postanın Ekindedir:</strong><br/>
                  Yüklenen <strong>AutoCAD DWG çizimleri, dekontlar ve belgeler</strong> bu e-postaya doğrudan <strong>ek dosya (attachment)</strong> olarak iliştirilmiştir. Gmail'in <strong>en altında yer alan ek kutucuklarındaki (⬇️ İndir)</strong> simgesine tıklayarak dosyaları anında bilgisayarınıza veya telefonunuza indirebilirsiniz.
                </p>
              </div>

              <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 16px;">
                ${documents.map(d => `
                  <tr style="border-bottom: 1px solid #334155;">
                    <td style="padding: 12px 0; color: #f8fafc; font-weight: 600;">
                      📄 ${d.title || d.fileName}
                      <div style="font-size: 11px; color: #94a3b8; font-weight: normal; margin-top: 3px;">
                        ${d.fileName} (${d.fileSize || 'Hazır'})
                      </div>
                    </td>
                    <td style="padding: 12px 0; text-align: right; vertical-align: middle;">
                      <a href="https://detaypeyzaj.com.tr/api/download-file?orderId=${encodeURIComponent(cleanOrderId)}&fileName=${encodeURIComponent(d.fileName)}" download="${d.fileName}" target="_blank" style="display: inline-block; background-color: #ea580c; color: #ffffff; text-decoration: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; font-size: 12px; white-space: nowrap; box-shadow: 0 2px 8px rgba(234, 88, 12, 0.4);">
                        ⬇️ Dosyayı İndir
                      </a>
                    </td>
                  </tr>
                `).join('')}
              </table>
            ` : `
              <p style="font-size: 13px; color: #94a3b8; margin: 0;">Bu siparişte ek dosya yüklenmemiştir.</p>
            `}

            <div style="text-align: center; margin-top: 16px;">
              <a href="https://detaypeyzaj.com.tr" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%); color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 12px rgba(234, 88, 12, 0.4);">
                📂 Yönetici Masasında Siparişi & Dosyaları Aç
              </a>
            </div>
          </div>

          ${cleanNotes ? `<div style="margin-top: 20px; padding: 14px; background: #1e293b; border-radius: 8px; border-left: 3px solid #f97316;"><strong>Müşteri Notu:</strong> ${cleanNotes}</div>` : ''}
        </div>
      </div>
    `;

    console.log(`[ORDER EMAIL DISPATCHED] To: ${TARGET_EMAILS.join(', ')} | Order: ${order.id}`);

    // Automatically save & sync order to cloud storage for admin dashboard across devices
    try {
      const currentOrders = await fetchCloudOrders();
      const existingIdx = currentOrders.findIndex(o => o.id === cleanOrderId);
      
      const priceNum = typeof totalPrice === 'number' ? totalPrice : Number(String(totalPrice).replace(/[^0-9]/g, '')) || 0;

      const orderToSave = {
        id: cleanOrderId,
        userId: cleanEmail || `user-${Date.now()}`,
        userEmail: cleanEmail || 'musteri@detaypeyzaj.com.tr',
        createdAt: new Date().toISOString(),
        areaM2: cleanAreaM2,
        selectedServices: {
          landscapeProject: true,
          visual3D: Array.isArray(services) ? services.some(s => s.includes('3D')) : true,
          irrigationProject: Array.isArray(services) ? services.some(s => s.includes('Sulama')) : true,
        },
        selectedStyle: 'Modern Akdeniz',
        status: '1_analiz',
        progressPercent: 20,
        totalPrice: priceNum,
        isPaid: true,
        paymentMethod: paymentMethod || 'credit_card',
        invoice: {
          type: customerInfo?.type || 'bireysel',
          fullName: cleanCustomerName,
          companyName: cleanCustomerName,
          email: cleanEmail,
          phone: cleanPhone,
          tcKimlikNo: cleanTaxId,
          taxNumber: cleanTaxId,
          city: cleanCity || 'Çanakkale',
          district: cleanDistrict || 'Merkez',
          fullAddress: cleanAddress,
        },
        notes: cleanNotes,
        customerDocuments: Array.isArray(documents) ? documents.map((d, idx) => {
          const matchingAtt = Array.isArray(attachments) ? attachments.find(a => (a.filename || a.fileName) === d.fileName) : null;
          return {
            id: `doc-${Date.now()}-${idx}`,
            title: d.title || d.fileName || 'Müşteri Belgesi',
            category: (d.title?.toLowerCase().includes('dekont') ? 'dekont' : 'kroki'),
            fileName: d.fileName || 'dosya',
            fileSize: d.fileSize || '1.0 MB',
            fileUrl: `/api/download-file?orderId=${encodeURIComponent(cleanOrderId)}&fileName=${encodeURIComponent(d.fileName)}`,
            content: matchingAtt?.content || undefined,
            uploadedAt: new Date().toISOString(),
          };
        }) : [],
        deliverables: [],
        tasks: [
          { id: `task-${cleanOrderId}-1`, orderId: cleanOrderId, title: 'Tapu, İmar Çapı ve Vaziyet Analizi', category: 'analiz', status: 'devam_ediyor', updatedAt: new Date().toISOString() },
          { id: `task-${cleanOrderId}-2`, orderId: cleanOrderId, title: 'AutoCAD Yapısal Peyzaj / Sert Zemin Planı', category: 'dwg', status: 'bekliyor', updatedAt: new Date().toISOString() },
          { id: `task-${cleanOrderId}-3`, orderId: cleanOrderId, title: 'Bitkisel Tasarım & Ağaç-Çalı Konumlandırması', category: 'bitki', status: 'bekliyor', updatedAt: new Date().toISOString() },
          { id: `task-${cleanOrderId}-4`, orderId: cleanOrderId, title: 'Otomatik Sulama & Boru Hidrolik Hesabı', category: 'sulama', status: 'bekliyor', updatedAt: new Date().toISOString() },
          { id: `task-${cleanOrderId}-5`, orderId: cleanOrderId, title: 'Gece Aydınlatması & Elektrik Altyapı Planı', category: 'aydinlatma', status: 'bekliyor', updatedAt: new Date().toISOString() },
          { id: `task-${cleanOrderId}-6`, orderId: cleanOrderId, title: 'Lumion / 3ds Max 4K Fotogerçekçi Renderlar', category: 'render', status: 'bekliyor', updatedAt: new Date().toISOString() },
          { id: `task-${cleanOrderId}-7`, orderId: cleanOrderId, title: 'Metraj & Yaklaşık Maliyet Keşif Özeti', category: 'metraj', status: 'bekliyor', updatedAt: new Date().toISOString() },
          { id: `task-${cleanOrderId}-8`, orderId: cleanOrderId, title: 'E-Fatura & Proje Teslim Paketi', category: 'fatura', status: 'bekliyor', updatedAt: new Date().toISOString() },
        ],
        invoiceIssued: false,
      };

      if (existingIdx >= 0) {
        currentOrders[existingIdx] = { ...currentOrders[existingIdx], ...orderToSave };
      } else {
        currentOrders.unshift(orderToSave);
      }
      await saveCloudOrders(currentOrders);
      console.log(`[ORDER CLOUD PERSISTED] Order ${cleanOrderId} saved to cloud database.`);
    } catch (saveErr) {
      console.warn('[ORDER CLOUD PERSIST ERROR]', saveErr);
    }

    await sendMailHelper({
      to: recipients,
      subject: emailSubject,
      html: body.customHtml || defaultHtmlBody,
      text: isQuotation ? `Detay Peyzaj Teklif: ${cleanOrderId} - Toplam: ${totalPrice}` : `Detay Peyzaj Yeni Siparis: ${order.id}`,
      attachments: Array.isArray(attachments) ? attachments : [],
    });

    return res.status(200).json({
      success: true,
      recipients,
      orderId: order.id,
      message: 'Mail başarıyla iletildi.',
    });
  } catch (error) {
    console.error('Order email error:', error);
    return res.status(500).json({ error: 'Siparis maili gonderilemedi', details: String(error) });
  }
}
