export default {
  // 매일 08:30 KST = 23:30 UTC 크론
  async scheduled(event, env) {
    const seoulTime = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
    const utcTime = new Date().toISOString();
    
    // TODO: 여기에 TDB/TSR 실제 크롤링 로직 넣기
    const entry = {
      time: seoulTime,
      utc: utcTime,
      tdb: 0,
      tsr: 0,
      note: "08:30 전국 체크"
    };

    try {
      let history = [];
      const raw = await env.TDB_LOG.get("history");
      if (raw) history = JSON.parse(raw);
      
      history.push(entry);
      const sliced = history.slice(-365);
      await env.TDB_LOG.put("history", JSON.stringify(sliced));
      console.log("✅ 저장됨", entry, `총 ${sliced.length}개`);
    } catch (e) {
      console.error("KV 저장 실패", e);
    }
  },

  async fetch(request, env) {
    const url = new URL(request.url);
    
    if (url.pathname === "/health") {
      return new Response(JSON.stringify({
        ok: true,
        cron: "30 23 * * *",
        kst: "매일 08:30 KST",
        kv: "tdb-log 연결됨"
      }), {
        headers: { "Content-Type": "application/json; charset=utf-8" }
      });
    }

    const history = await env.TDB_LOG.get("history") || "[]";
    return new Response(history, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache"
      }
    });
  }
}
