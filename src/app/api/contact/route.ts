import { NextResponse } from 'next/server';
import { Resend } from 'resend';

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  nationality?: string;
  github?: string;
  message?: string;
};

const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;

    const name = body.name?.trim() ?? '';
    const email = body.email?.trim() ?? '';
    const phone = body.phone?.trim() ?? '';
    const nationality = body.nationality?.trim() ?? '';
    const github = body.github?.trim() ?? '';
    const message = body.message?.trim() ?? '';

    if (!name || !email || !phone || !nationality || !message) {
      return NextResponse.json({ ok: false, error: 'Please fill in all fields.' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: 'Please provide a valid email address.' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ ok: false, error: 'Mail service is not configured.' }, { status: 503 });
    }

    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'Sagittarius <onboarding@resend.dev>',
      to: process.env.CONTACT_TO_EMAIL ?? 'anbumalligarjunsri@gmail.com',
      replyTo: email,
      subject: `New message from ${name}`,
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

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request payload.' }, { status: 400 });
  }
}
