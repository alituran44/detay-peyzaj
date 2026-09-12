// Vercel Serverless Function - Paynkolay / Aktif Bank 3D Secure Callback Handler
import nodemailer from 'nodemailer';
import { fetchCloudOrders, saveCloudOrders } from './orders.js';

async function sendMailNotification({ to, subject, html, text }) {
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

      await transporter.sendMail({
        from: `"Detay Peyzaj" <${smtpUser}>`,
        to,
        subject,
        html,
        text,
      });
      return true;
    } catch (err) {
      console.error('[CALLBACK MAIL ERROR]', err);
    }
  }
  return false;
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
    return res.status(200).end();
  }

  // Parse payload from POST (body) or GET (query)
  let params = {};
  if (req.method === 'POST') {
    if (typeof req.body === 'object' && req.body !== null) {
      params = req.body;
    } else if (typeof req.body === 'string') {
      try {
        params = JSON.parse(req.body);
      } catch {
        const urlParams = new URLSearchParams(req.body);
        for (const [key, value] of urlParams.entries()) {
          params[key] = value;
        }
      }
    }
  } else {
    params = req.query || {};
  }

  // Extract Paynkolay / Aktif Bank fields
  const orderId =
    params.OrderId ||
    params.orderId ||
    params.oid ||
    params.OrderNumber ||
    params.merchantOrderId ||
    params.order_id ||
    '';

  const responseCode =
    params.ResponseCode ||
    params.responseCode ||
    params.rc ||
    params.Response ||
    params.ProcReturnCode ||
    params.status ||
    params.Result ||
    '';

  const transId =
    params.TransId ||
    params.transId ||
    params.HostRefNum ||
    params.hostRefNum ||
    params.AuthCode ||
    params.authCode ||
    `PNK-${Date.now()}`;

  const amount = params.Amount || params.amount || params.totalAmount || '';
  const errorMessage =
    params.ErrorMessage ||
    params.errorMessage ||
    params.ErrMsg ||
    params.errMsg ||
    params.ResponseMessage ||
    params.statusDescription ||
    '';

  console.log('[PAYNKOLAY 3D CALLBACK RECEIVED]', {
    orderId,
    responseCode,
    transId,
    amount,
    errorMessage,
    method: req.method,
  });

  // Success evaluation: '00', 'Approved', 'Success', '1'
  const isSuccess =
    String(responseCode) === '00' ||
    String(responseCode).toUpperCase() === 'APPROVED' ||
    String(responseCode).toUpperCase() === 'SUCCESS' ||
    String(responseCode) === '1' ||
    (!responseCode && !errorMessage);

  const redirectBase = 'https://detaypeyzaj.com.tr';

  if (isSuccess && orderId) {
    // 1. Update cloud database
    try {
      const orders = await fetchCloudOrders();
      const existingIdx = orders.findIndex(
        (o) => o.id === orderId || o.id.toLowerCase() === orderId.toLowerCase()
      );

      if (existingIdx >= 0) {
        orders[existingIdx] = {
          ...orders[existingIdx],
          isPaid: true,
          status: '1_analiz',
          paymentMethod: 'credit_card',
          paidAt: new Date().toISOString(),
          transactionId: transId,
          paynkolayDetails: {
            transId,
            responseCode,
            amount,
            paidAt: new Date().toISOString(),
          },
        };
        await saveCloudOrders(orders);
        console.log(`[PAYNKOLAY CALLBACK] Order ${orderId} marked as PAID in cloud database.`);
      }
    } catch (e) {
      console.warn('[PAYNKOLAY CALLBACK] DB update notice:', e);
    }

    // 2. Dispatch email notification
    try {
      const TARGET_EMAILS = ['hhyildirimm@gmail.com', 'peyzajdetay@gmail.com'];
      const emailHtml = `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#fff;padding:24px;border-radius:12px;border:1px solid #22c55e;">
          <h2 style="color:#22c55e;margin-top:0;">💳 Paynkolay 3D Secure Ödeme Başarılı!</h2>
          <p>Müşterinin kredi kartı ödemesi Paynkolay Sanal POS (Aktif Bank) üzerinden 3D Secure ile başarıyla tahsil edildi.</p>
          <div style="background:#1e293b;padding:16px;border-radius:8px;margin:16px 0;">
            <p><strong>Sipariş No:</strong> ${orderId}</p>
            <p><strong>Banka Provizyon No (TransId):</strong> ${transId}</p>
            <p><strong>Tutar:</strong> ${amount ? `${amount} TL` : 'KDV Dahil Tutar'}</p>
            <p><strong>Tarih:</strong> ${new Date().toLocaleString('tr-TR')}</p>
          </div>
          <p><a href="https://detaypeyzaj.com.tr" style="background:#ea580c;color:#fff;padding:10px 20px;text-decoration:none;border-radius:6px;font-weight:bold;display:inline-block;">Yönetici Paneline Git</a></p>
        </div>
      `;

      await sendMailNotification({
        to: TARGET_EMAILS,
        subject: `💳 [ÖDEME ALINDI] Paynkolay 3D Secure - Sipariş ${orderId} (${transId})`,
        html: emailHtml,
        text: `Paynkolay 3D Secure ödemesi başarıyla alındı. Sipariş: ${orderId}, TransId: ${transId}`,
      });
    } catch (e) {
      console.warn('[PAYNKOLAY CALLBACK] Mail dispatch notice:', e);
    }

    const successRedirectUrl = `${redirectBase}/?payment=success&orderId=${encodeURIComponent(orderId)}&txnId=${encodeURIComponent(transId)}`;

    // Return auto-redirect HTML
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(`
      <!DOCTYPE html>
      <html lang="tr">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Ödeme Başarılı - Detay Peyzaj</title>
          <meta http-equiv="refresh" content="1; url=${successRedirectUrl}" />
          <style>
            body {
              background-color: #030712;
              color: #f8fafc;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
            }
            .card {
              background: #0f172a;
              border: 1px solid #ea580c;
              border-radius: 24px;
              padding: 40px;
              text-align: center;
              max-width: 440px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.6);
            }
            .icon {
              width: 64px;
              height: 64px;
              border-radius: 50%;
              background: rgba(34, 197, 94, 0.2);
              border: 2px solid #22c55e;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 20px;
              font-size: 32px;
              color: #22c55e;
            }
            h1 { font-size: 20px; color: #22c55e; margin: 0 0 10px; }
            p { font-size: 14px; color: #94a3b8; line-height: 1.5; margin: 0 0 20px; }
            .btn {
              display: inline-block;
              background: #ea580c;
              color: #fff;
              text-decoration: none;
              padding: 12px 28px;
              border-radius: 12px;
              font-weight: bold;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="icon">✓</div>
            <h1>3D Secure Ödeme Başarılı</h1>
            <p>Ödemeniz Paynkolay üzerinden onaylandı. Projeniz hazırlanmaya başlıyor, yönlendiriliyorsunuz...</p>
            <a class="btn" href="${successRedirectUrl}">Siparişi Görüntüle</a>
          </div>
          <script>
            setTimeout(function() {
              window.location.href = "${successRedirectUrl}";
            }, 800);
          </script>
        </body>
      </html>
    `);
  }

  // Payment Failed or Cancelled
  const failError = errorMessage || 'Banka 3D Secure doğrulama işlemi tamamlanamadı veya kart reddedildi.';
  const failRedirectUrl = `${redirectBase}/?payment=failed&orderId=${encodeURIComponent(orderId)}&error=${encodeURIComponent(failError)}`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.status(200).send(`
    <!DOCTYPE html>
    <html lang="tr">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Ödeme Tamamlanamadı - Detay Peyzaj</title>
        <meta http-equiv="refresh" content="2; url=${failRedirectUrl}" />
        <style>
          body {
            background-color: #030712;
            color: #f8fafc;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
          }
          .card {
            background: #0f172a;
            border: 1px solid #ef4444;
            border-radius: 24px;
            padding: 40px;
            text-align: center;
            max-width: 440px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.6);
          }
          .icon {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background: rgba(239, 68, 68, 0.2);
            border: 2px solid #ef4444;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 32px;
            color: #ef4444;
          }
          h1 { font-size: 20px; color: #ef4444; margin: 0 0 10px; }
          p { font-size: 14px; color: #94a3b8; line-height: 1.5; margin: 0 0 20px; }
          .btn {
            display: inline-block;
            background: #334155;
            color: #fff;
            text-decoration: none;
            padding: 12px 28px;
            border-radius: 12px;
            font-weight: bold;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon">✕</div>
          <h1>Ödeme Onaylanamadı</h1>
          <p>${failError}</p>
          <a class="btn" href="${failRedirectUrl}">Siparişe Geri Dön</a>
        </div>
        <script>
          setTimeout(function() {
            window.location.href = "${failRedirectUrl}";
          }, 1500);
        </script>
      </body>
    </html>
  `);
}
