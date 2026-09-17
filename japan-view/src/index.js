export default {
  // 매일 08:30 KST = 23:30 UTC 크론
  async scheduled(event, env) {
    const seoulTime = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
    
    // TODO: 여기에 TDB/TSR 실제 크롤링 로직 넣기
    // const tdbCount = await fetchTDB();
    // const tsrCount = await fetchTSR();
    
    const entry = {
      time: seoulTime,
      utc: new Date().toISOString(),
      tdb: 0,
      tsr: 0,
      note: "08:30 전국 체크"
    };

    try {
      let history = [];
      const raw = await env.TDB_LOG.get("history");
      if (raw) history = JSON.parse(raw);
      
      history.push(entry);
      // 최근 365일만 보관
      const sliced = history.slice(-365);
      await env.TDB_LOG.put("history", JSON.stringify(sliced));
      console.log("✅ 저장됨", entry);
    } catch (e) {
      console.error("KV 저장 실패", e);
    }
  },

  // 대시보드에서 fetch할 JSON API
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // /history 로 들어오면 히스토리 반환
    if (url.pathname === "/" || url.pathname === "/history") {
      const history = await env.TDB_LOG.get("history") || "[]";
      return new Response(history, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache"
        }
      });
    }
    
    // /health 체크
    if (url.pathname === "/health") {
      return new Response(JSON.stringify({ ok: true, cron: "30 23 * * * (08:30 KST)" }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response("tdb-cron OK - 매일 08:30 KST 실행", { status: 200 });
  }
}
