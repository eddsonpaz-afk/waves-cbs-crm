import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const payload = await request.json();
    const apiUrl = process.env.CRM_API_URL;

    if (!apiUrl) {
      return NextResponse.json({ success: false, demo: true, message: 'CRM_API_URL não configurada.' }, { status: 503 });
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      cache: 'no-store'
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); }
    catch { return NextResponse.json({ success: false, message: 'A API não retornou JSON válido.', detail: text.slice(0, 250) }, { status: 502 }); }

    return NextResponse.json(data, { status: response.ok ? 200 : 502 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error?.message || 'Erro inesperado.' }, { status: 500 });
  }
}
