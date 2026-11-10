import { createHash } from 'node:crypto';
import { Resend } from 'resend';
import { parseInquiry } from '@/features/services/inquirySchema';
import { checkRateLimit, clientIp } from '../contact/rateLimit';

export const runtime = 'nodejs';
const MAX_BYTES = 24_000;
const reply = (body: object, status: number, headers = {}) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } });

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return reply({ error: 'Please send this brief from our website.' }, 403);
  if (!request.headers.get('content-type')?.includes('application/json')) return reply({ error: 'Expected a JSON brief.' }, 415);
  const rate = checkRateLimit(`inquiry:${clientIp(request)}`, { limit: 5, windowMs: 10 * 60_000 });
  if (!rate.allowed) return reply({ error: `Please wait ${Math.ceil(rate.retryAfterSec / 60)} minute(s) before trying again. Your answers are still here.` }, 429, { 'Retry-After': String(rate.retryAfterSec) });

  // Count actual bytes, including chunked requests; Content-Length is not trusted.
  const reader = request.body?.getReader();
  if (!reader) return reply({ error: 'The brief is empty.' }, 400);
  let input: unknown;
  try {
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_BYTES) { await reader.cancel(); return reply({ error: 'This brief is too long. Please shorten your answers.' }, 413); }
      chunks.push(value);
    }
    input = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch { return reply({ error: 'We could not read this brief. Please try again.' }, 400); }
  finally { reader.releaseLock(); }
  const parsed = parseInquiry(input);
  if ('error' in parsed) return reply(parsed, 400);
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return reply({ error: 'Online delivery is temporarily unavailable. Download your brief below and email it to us.' }, 503);
  const { data, fields } = parsed;
  // Canonical field order ensures identical retries receive the same provider key.
  const digest = createHash('sha256').update(JSON.stringify(data)).digest('hex');
  const reference = `SZ-${digest.slice(0, 12).toUpperCase()}`;
  try {
    const { data: sent, error } = await new Resend(apiKey).emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'Sagittariuz <onboarding@resend.dev>',
      to: process.env.CONTACT_TO_EMAIL ?? 'anbumalligarjunsri@gmail.com',
      replyTo: data.answers.email,
      subject: `Project inquiry: ${data.service} · ${reference}`,
      // Plain text keeps user input out of HTML and email headers.
      text: [`SAGITTARIUZ — PROJECT INQUIRY`, `Reference: ${reference}`, `Service: ${data.service}`, 'This is an inquiry, not a confirmed booking.', ...fields.map(f => `${f.label}\n${data.answers[f.key] || 'Not provided'}`), 'Permission to contact about this inquiry: yes'].join('\n\n'),
    }, { idempotencyKey: `inquiry/${digest}` });
    if (error || !sent?.id) return reply({ error: 'Delivery could not be confirmed. Keep your answers unchanged and retry, or download the brief and contact us.' }, 502);
    return reply({ ok: true, reference }, 200);
  } catch {
    return reply({ error: 'Delivery could not be confirmed. Your answers are still here. Retry with the same answers or download your brief.' }, 502);
  }
}
