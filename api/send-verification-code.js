import nodemailer from 'nodemailer';

// Helper function to send email via available providers
async function sendMailHelper({ to, subject, html, text }) {
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER || 'peyzajdetay@gmail.com';
  const smtpPass = (process.env.SMTP_PASS || process.env.GMAIL_PASS || process.env.GMAIL_APP_PASSWORD || 'ppxxlunfiqjasakh').replace(/\s+/g, '');
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = Number(process.env.SMTP_PORT) || 465;

  // 1. Try Nodemailer SMTP if password is provided
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
      });
    } catch (smtpErr) {
      console.error('Nodemailer SMTP dispatch error:', smtpErr);
    }
  }

  // 2. Try Resend API
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

  // 3. Try Brevo API
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
const MAX_REQUESTS_PER_WINDOW = 5;

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

function sanitizeString(str, maxLen = 200) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>]/g, '').trim().slice(0, maxLen);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
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

    const { email, code, userName, customTemplate, botField } = body;

    if (botField) {
      console.warn(`[SPAM BLOCKED] Honeypot field triggered from ${clientIp}`);
      return res.status(200).json({ success: true, message: 'İstek işlendi.' });
    }

    if (!email) {
      return res.status(400).json({ error: 'E-posta adresi zorunludur.' });
    }

    const cleanCode = code ? sanitizeString(code, 10) : Math.floor(100000 + Math.random() * 900000).toString();

    const cleanEmail = sanitizeString(email, 100).toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({ error: 'Geçersiz e-posta formatı.' });
    }

    const nameToGreet = sanitizeString(userName, 100) || 'Değerli Müşterimiz';

    // Dynamic fields with fallbacks
    const emailSubject = customTemplate?.subject || `🌿 [Detay Peyzaj] Aktivasyon & Doğrulama Kodunuz: ${cleanCode}`;
    const heading = customTemplate?.heading || 'Güvenli Hesap & Portal Aktivasyonu';
    const badge = customTemplate?.badge || '6 HANELİ DOĞRULAMA KODU';
    const badgeColor = customTemplate?.badgeColor || '#22c55e';
    const footerNote = customTemplate?.footerNote || 'Bu e-posta hesabınızın ve siparişinizin güvenliğini sağlamak amacıyla otomatik olarak iletilmiştir.';
    const buttonText = customTemplate?.buttonText || 'Portala Giriş Yap & Siparişi Tamamla';
    const buttonUrl = customTemplate?.buttonUrl || 'https://detaypeyzaj.com.tr';

    // Format body content (convert markdown **bold** to <strong> and newlines to <br/>)
    let bodyFormatted = customTemplate?.bodyContent
      ? customTemplate.bodyContent
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\n/g, '<br/>')
      : `Sayın <strong>${nameToGreet}</strong>,<br/><br/>Detay Peyzaj portalına güvenle erişebilmeniz ve siparişinizi onaylayabilmeniz için 6 haneli tek kullanımlık aktivasyon kodunuz:`;

    const htmlBody = `
      <div style="font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #090d16; color: #f8fafc; border-radius: 20px; overflow: hidden; border: 1px solid #ea580c; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #15803d 0%, #14532d 100%); padding: 28px 20px; text-align: center;">
          <div style="display: inline-block; padding: 4px 12px; background: rgba(0,0,0,0.25); border-radius: 9999px; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; color: #dcfce7; margin-bottom: 8px;">
            DETAY PEYZAJ MİMARLIK
          </div>
          <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">${heading}</h1>
          ${badge ? `<div style="display: inline-block; margin-top: 10px; padding: 4px 14px; background: ${badgeColor}22; border: 1px solid ${badgeColor}; border-radius: 9999px; font-size: 11px; font-weight: 700; color: #ffffff;">${badge}</div>` : ''}
        </div>

        <!-- Content -->
        <div style="padding: 32px 24px; text-align: center;">
          <div style="color: #cbd5e1; font-size: 14px; line-height: 1.7; text-align: left; background: #131b2e; padding: 20px; border-radius: 14px; border: 1px solid #1e293b; margin-bottom: 24px;">
            ${bodyFormatted}
          </div>

          <!-- OTP Code Box -->
          <div style="background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%); border: 2px dashed #22c55e; border-radius: 16px; padding: 20px; margin: 20px 0; display: inline-block; width: 85%;">
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #86efac; font-weight: 700; margin-bottom: 6px;">
              6 Haneli Doğrulama Kodunuz
            </div>
            <div style="font-size: 36px; font-weight: 900; letter-spacing: 10px; color: #22c55e; font-family: 'Courier New', monospace;">
              ${code}
            </div>
            <div style="font-size: 11px; color: #94a3b8; margin-top: 6px;">
              ⏳ Bu kod <strong>15 dakika</strong> boyunca geçerlidir.
            </div>
          </div>

          <!-- CTA Button -->
          <div style="margin: 28px 0 16px;">
            <a href="${buttonUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 15px rgba(22, 163, 74, 0.4);">
              ${buttonText}
            </a>
          </div>

          <!-- Footer Note -->
          <p style="color: #64748b; font-size: 11px; line-height: 1.5; margin-top: 24px;">
            ${footerNote}
          </p>

          <div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #1e293b; text-align: center; font-size: 11px; color: #475569;">
            Detay Peyzaj Mimarlık &bull; Çanakkale / Türkiye &bull; 0544 477 20 44 &bull; ${SENDER_EMAIL}
          </div>
        </div>
      </div>
    `;

    console.log(`[ACTIVATION CODE DISPATCHED] To: ${email} | Code: ${code}`);

    await sendMailHelper({
      to: email,
      subject: emailSubject,
      html: htmlBody,
      text: `Detay Peyzaj Aktivasyon Kodunuz: ${code}`,
    });

    return res.status(200).json({
      success: true,
      email,
      message: `Aktivasyon kodu ${email} adresine iletildi.`,
    });
  } catch (error) {
    console.error('Verification code sending error:', error);
    return res.status(500).json({ error: 'Aktivasyon kodu gönderilemedi', details: String(error) });
  }
}
