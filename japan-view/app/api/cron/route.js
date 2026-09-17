import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const seoulTime = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
  const entry = {
    time: seoulTime,
    utc: new Date().toISOString(),
    tdb: 0,
    tsr: 0,
    note: "08:30 전국 체크"
  };

  let history = (await kv.get("history")) as any[] || [];
  history.push(entry);
  if (history.length > 365) history = history.slice(-365);
  await kv.set("history", history);

  return NextResponse.json({ ok: true, saved: entry });
}
