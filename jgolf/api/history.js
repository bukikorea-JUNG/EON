export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Cloudflare Worker에서 실제 데이터 가져오기 (선택)
  // const cf = await fetch("https://tdb-cron.bukikorea.workers.dev/").then(r=>r.json()).catch(()=>[]);
  const demo = [
    { time: new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }), tdb: 12, tsr: 8, note: "데모 - Cloudflare KV 연결 후 실제 데이터로 교체" }
  ];
  return res.status(200).json(demo);
}
