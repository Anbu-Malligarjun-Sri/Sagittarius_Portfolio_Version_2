import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { checkRateLimit, clientIp } from './rateLimit';

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  nationality?: unknown;
  github?: unknown;
  message?: unknown;
};

// 5 messages per address per 10 minutes.
const RATE_LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 };
const MAX_BODY_BYTES = 20_000;

// Server-side caps, set a little above what the form itself allows.
const MAX_LENGTH = { name: 100, email: 254, phone: 40, nationality: 80, github: 300, message: 9000 } as const;

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const fail = (error: string, status: number, headers?: Record<string, string>) =>
  NextResponse.json({ ok: false, error }, { status, headers });

export async function POST(request: Request) {
  const limited = checkRateLimit(`contact:${clientIp(request)}`, RATE_LIMIT);
  if (!limited.allowed) {
    return fail('You have sent a few messages already. Please try again in a little while.', 429, {
      'Retry-After': String(limited.retryAfterSec),
    });
  }

  if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) {
    return fail('That message is too large.', 413);
  }

  let body: ContactPayload;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) return fail('That message is too large.', 413);
    body = JSON.parse(text) as ContactPayload;
  } catch {
    return fail('Invalid request payload.', 400);
  }

  const read = (value: unknown) => (typeof value === 'string' ? value.trim() : '');
  const name = read(body.name);
  const email = read(body.email);
  const phone = read(body.phone);
  const nationality = read(body.nationality);
  const github = read(body.github);
  const message = read(body.message);

  if (!name || !email || !phone || !nationality || !message) {
    return fail('Please fill in all fields.', 400);
  }

  if (
    name.length > MAX_LENGTH.name ||
    email.length > MAX_LENGTH.email ||
    phone.length > MAX_LENGTH.phone ||
    nationality.length > MAX_LENGTH.nationality ||
    github.length > MAX_LENGTH.github ||
    message.length > MAX_LENGTH.message
  ) {
    return fail('One of the fields is too long.', 400);
  }

  if (!isValidEmail(email)) {
    return fail('Please provide a valid email address.', 400);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return fail('Mail service is not configured.', 503);
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'Sagittarius <onboarding@resend.dev>',
      to: process.env.CONTACT_TO_EMAIL ?? 'anbumalligarjunsri@gmail.com',
      replyTo: email,
      subject: `New message from ${name.replace(/[\r\n]+/g, ' ')}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Nationality:</strong> ${escapeHtml(nationality)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
          ${github ? `<p><strong>GitHub / URL:</strong> ${escapeHtml(github)}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message).replaceAll('\n', '<br />')}</p>
        </div>
      `,
    });
    if (error) throw new Error(error.message);
  } catch (error) {
    console.error('[contact] failed to send message:', error);
    return fail('We could not send your message right now. Please try again shortly.', 502);
  }

  return NextResponse.json({ ok: true });
}
