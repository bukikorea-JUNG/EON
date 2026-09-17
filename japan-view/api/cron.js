import { kv } from "@vercel/kv";

// Vercel Cron: 매일 08:30 KST = 23:30 UTC
// vercel.json에서 "30 23 * * *" 로 호출됨
export default async function handler(req, res) {
  // Vercel Cron 인증 (선택) - CRON_SECRET 설정시 검증
  // Vercel이 자동으로 x-vercel-cron 헤더를 보내지만, 커스텀 secret도 가능
  // if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return res.status(401).json({ error: 'Unauthorized' });
  // }

  try {
    const seoulTime = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
    
    // TODO: TDB/TSR 크롤링 로직
    // const tdb = await fetchTDB();
    // const tsr = await fetchTSR();

    const entry = {
      time: seoulTime,
      utc: new Date().toISOString(),
      tdb: 0,
      tsr: 0,
      note: "08:30 전국 체크 (Vercel Cron)"
    };

    // Vercel KV (Upstash Redis)에 누적
    let history = (await kv.get("history")) || [];
    history.push(entry);
    // 최근 365개만 보관
    if (history.length > 365) history = history.slice(-365);
    
    await kv.set("history", history);

    console.log("✅ 저장됨", entry);

    return res.status(200).json({ ok: true, saved: entry, total: history.length });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: String(e) });
  }
}
