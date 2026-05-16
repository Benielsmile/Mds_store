import { NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function POST(request: Request) {
  const body = await request.json();
  const headers = Object.fromEntries(request.headers.entries());

  try {
    const res = await fetch(`${API_BASE}/payments/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.error('Webhook forward failed:', res.status, await res.text());
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook forward error:', err);
    return NextResponse.json({ received: true, forwarded: false });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Webhook endpoint ready. Send POST requests here.' });
}
