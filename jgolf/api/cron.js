import { kv } from "@vercel/kv";

// Vercel Cron: 매일 08:30 KST = 23:30 UTC 에 호출
// vercel.json: { "path": "/api/cron", "schedule": "30 23 * * *" }
export default async function handler(req, res) {
  try {
    const seoulTime = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
    
    // TODO: 실제 TDB/TSR 크롤링 로직을 여기에 넣으면 KV에 자동 누적됩니다
    // const tdbData = await fetchTDB();
    const entry = {
      time: seoulTime,
      utc: new Date().toISOString(),
      source: "TDB/TSR",
      tdb: 0,
      tsr: 0,
      note: "08:30 전국 체크 (Vercel Cron)",
      // 실제 데이터는 여기서 파싱해서 넣기
    };

    let history = (await kv.get("history")) || [];
    history.push(entry);
    if (history.length > 365) history = history.slice(-365);
    await kv.set("history", history);

    console.log("✅ TDB/TSR 저장", entry);
    return res.status(200).json({ ok: true, saved: entry, total: history.length });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: String(e) });
  }
}
