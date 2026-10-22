/**
 * Vercel serverless function for the two-field contact form.
 * Accepts application/x-www-form-urlencoded or JSON, filters spam with a
 * honeypot field (no CAPTCHA; rate limiting belongs at the host, e.g. Vercel
 * WAF rules), then delivers via Resend
 * (RESEND_API_KEY) or forwards to CONTACT_WEBHOOK_URL. Redirects browsers to
 * /contact/thanks so the form works without client-side JavaScript.
 */
export const config = { runtime: 'nodejs' };

interface Payload { email: string; message: string; website?: string }

async function parse(req: Request): Promise<Payload> {
  const ct = req.headers.get('content-type') ?? '';
  if (ct.includes('application/json')) {
    const body: unknown = await req.json();
    const obj = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;
    // Non-string fields are treated as empty so validation rejects them with a 400.
    const str = (v: unknown) => (typeof v === 'string' ? v : '');
    return { email: str(obj.email), message: str(obj.message), website: str(obj.website) };
  }
  const form = await req.formData();
  const get = (k: string) => (form.get(k) ?? '').toString();
  return { email: get('email'), message: get('message'), website: get('website') };
}

function wantsHtml(req: Request): boolean {
  return (req.headers.get('accept') ?? '').includes('text/html');
}

function respond(req: Request, status: number, body: string): Response {
  if (wantsHtml(req) && status < 400) return Response.redirect(new URL('/contact/thanks', req.url), 303);
  return new Response(JSON.stringify({ ok: status < 400, message: body }), { status, headers: { 'Content-Type': 'application/json' } });
}

// Named method export: Vercel's Node runtime treats a default-exported function
// as a legacy (req, res) handler, which crashes on req.headers.get and never
// sends the returned Response. Other methods get a 405 from the platform.
export async function POST(req: Request): Promise<Response> {
  const origin = req.headers.get('origin');
  const allowed = process.env.CONTACT_ALLOWED_ORIGIN ?? 'https://mlsecopshub.com';
  if (origin && origin !== allowed) return new Response('Forbidden', { status: 403 });

  let p: Payload;
  try { p = await parse(req); } catch { return respond(req, 400, 'Could not read the form.'); }

  // Silent success for bots that fill the hidden honeypot field.
  if (p.website) return respond(req, 200, 'Received.');

  const email = (p.email ?? '').trim();
  const message = (p.message ?? '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return respond(req, 400, 'A valid email is required.');
  if (message.length < 20 || message.length > 4000) return respond(req, 400, 'Message must be between 20 and 4000 characters.');

  const to = process.env.CONTACT_TO_EMAIL ?? 'hello@mlsecopshub.com';
  const text = `From: ${email}\nReceived: ${new Date().toISOString()}\n\n${message}\n`;

  if (process.env.RESEND_API_KEY) {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: process.env.CONTACT_FROM_EMAIL ?? 'contact@mlsecopshub.com', to: [to], reply_to: email, subject: `mlsecopshub.com contact: ${email}`, text }),
    });
    if (!r.ok) return respond(req, 502, 'Delivery failed. Email hello@mlsecopshub.com directly.');
  } else if (process.env.CONTACT_WEBHOOK_URL) {
    const r = await fetch(process.env.CONTACT_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, message, receivedAt: new Date().toISOString() }) });
    if (!r.ok) return respond(req, 502, 'Delivery failed. Email hello@mlsecopshub.com directly.');
  } else {
    console.warn('[contact] no delivery configured; message logged only', { email });
  }
  return respond(req, 200, 'Received.');
}
