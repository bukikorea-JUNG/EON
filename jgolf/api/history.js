export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  res.setHeader("Pragma", "no-cache");

  const CLOUDFLARE_URL = "https://tdb-cron.bukikorea.workers.dev/";

  try {
    const cfRes = await fetch(CLOUDFLARE_URL, { 
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" }
    });
    
    if (cfRes.ok) {
      const text = await cfRes.text();
      try {
        const cfData = JSON.parse(text);
        // Cloudflare가 []여도 그대로 반환 (KV 비어있음 표시)
        return res.status(200).json(Array.isArray(cfData) ? cfData : []);
      } catch(e) {
        return res.status(200).json([]);
      }
    }
  } catch (e) {
    console.error("Cloudflare fetch failed:", e);
  }

  // Cloudflare 연결 실패시 빈 배열 (대시보드에서 데모 표시)
  return res.status(200).json([]);
}
