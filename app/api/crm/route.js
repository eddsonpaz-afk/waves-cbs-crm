import { NextResponse } from "next/server";

const CRM_API_URL = "https://script.google.com/macros/s/AKfycbwTYbWBQna3XjdxQOTpmwz34D4376ywJXwu1yn3bcAfOiIseJSCWA7oYJFekQjntpwz/exec";

export async function POST(request) {
  try {
    const payload = await request.json();
    const response = await fetch(CRM_API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      cache: "no-store",
      redirect: "follow"
    });
    const text = await response.text();
    let data;
    try { data = JSON.parse(text); }
    catch {
      return NextResponse.json({ success:false, message:"A API não retornou JSON válido.", detail:text.slice(0,500) }, { status:502 });
    }
    return NextResponse.json(data, { status:data.success ? 200 : 400 });
  } catch (error) {
    return NextResponse.json({ success:false, message:error instanceof Error ? error.message : "Erro inesperado." }, { status:500 });
  }
}
