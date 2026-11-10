import { createHash } from 'node:crypto';
import { Resend } from 'resend';
import { checkRateLimit, clientIp } from './rateLimit';

export const runtime = 'nodejs';
const LIMITS: Record<string, number> = { name: 100, email: 254, project: 160, service: 100, website: 500, budget: 160, timeline: 160, message: 4000 };
const reply = (body: object, status: number, headers = {}) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } });
export async function POST(request: Request) {
  if (request.headers.get('origin') && request.headers.get('origin') !== new URL(request.url).origin) return reply({ error: 'Please use the contact form on our website.' }, 403);
  if (!request.headers.get('content-type')?.includes('application/json')) return reply({ error: 'Expected JSON.' }, 415);
  const rate = checkRateLimit(`contact:${clientIp(request)}`, { limit: 5, windowMs: 600_000 });
  if (!rate.allowed) return reply({ error: `Please wait ${Math.ceil(rate.retryAfterSec / 60)} minute(s) and retry. Your answers are preserved.` }, 429, { 'Retry-After': String(rate.retryAfterSec) });
  let raw: Record<string, unknown>;
  const reader = request.body?.getReader();
  if (!reader) return reply({ error: 'Empty message.' }, 400);
  try {
    let bytes = 0; const chunks: Uint8Array[] = [];
    while (true) { const { done, value } = await reader.read(); if (done) break; bytes += value.byteLength; if (bytes > 20_000) { await reader.cancel(); return reply({ error: 'Please shorten the brief.' }, 413); } chunks.push(value); }
    raw = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error();
  } catch { return reply({ error: 'We could not read the brief.' }, 400); }
  finally { reader.releaseLock(); }
  const values: Record<string, string> = {};
  for (const [key, max] of Object.entries(LIMITS)) {
    if (raw[key] !== undefined && typeof raw[key] !== 'string') return reply({ error: `Please check ${key}.` }, 400);
    values[key] = ((raw[key] as string | undefined) ?? '').trim();
    if (values[key].length > max) return reply({ error: `Please keep ${key} under ${max} characters.` }, 400);
  }
  if (!values.name || !values.message || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)) return reply({ error: 'Please include your name, a valid email address and a project brief.' }, 400);
  if (values.website) { try { const url = new URL(values.website); if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error(); } catch { return reply({ error: 'Use a public http:// or https:// website address without credentials.' }, 400); } }
  if (raw.consent !== true) return reply({ error: 'Please give permission for us to reply about your inquiry.' }, 400);
  if (typeof raw.requestId !== 'string' || !/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i.test(raw.requestId)) return reply({ error: 'Please refresh the page to create a request reference.' }, 400);
  if (!process.env.RESEND_API_KEY) return reply({ error: 'Online delivery is unavailable. Your brief is preserved; please email anbumalligarjunsri@gmail.com.' }, 503);
  const digest = createHash('sha256').update(JSON.stringify({ values, requestId: raw.requestId })).digest('hex');
  const reference = `SZ-${digest.slice(0, 12).toUpperCase()}`;
  try {
    const { data, error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'Sagittariuz <onboarding@resend.dev>',
      to: process.env.CONTACT_TO_EMAIL ?? 'anbumalligarjunsri@gmail.com', replyTo: values.email,
      subject: `Project conversation / ${reference}`,
      text: [`Sagittariuz / Contact inquiry / ${reference}`, ...Object.entries(values).map(([key, value]) => `${key}: ${value || 'Not provided'}`), 'Permission to discuss this inquiry: yes. Not a confirmed booking.'].join('\n\n'),
    }, { idempotencyKey: `contact/${digest}` });
    if (error || !data?.id) throw new Error();
    return reply({ ok: true, reference }, 200);
  } catch { return reply({ error: 'Delivery could not be confirmed. Retry unchanged within 24 hours, or email us with your brief.' }, 502); }
}
