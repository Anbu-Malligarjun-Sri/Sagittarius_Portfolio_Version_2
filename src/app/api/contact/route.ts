import { NextResponse } from 'next/server';

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
};

const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;

    const name = body.name?.trim() ?? '';
    const email = body.email?.trim() ?? '';
    const message = body.message?.trim() ?? '';

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: 'Please fill in all fields.' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: 'Please provide a valid email address.' }, { status: 400 });
    }

    // This endpoint intentionally keeps no external dependency.
    // Replace this with your mail provider integration (Resend/SendGrid) when keys are ready.
    console.info('[ContactRequest]', { name, email, messageLength: message.length });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request payload.' }, { status: 400 });
  }
}
