import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const backendRes = await fetch('https://localhost:3050/API/v1/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const raw = await backendRes.text();

    try {
      const json = JSON.parse(raw);
      return NextResponse.json(json, { status: backendRes.status });
    } catch {
      return new NextResponse(raw, { status: backendRes.status });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Proxy error' }, { status: 500 });
  }
}