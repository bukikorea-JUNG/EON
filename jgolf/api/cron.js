export default async function handler(req, res) {
  const seoulTime = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
  return res.status(200).json({ 
    ok: true, 
    time: seoulTime,
    note: "Cloudflare tdb-cron이 실제 데이터 수집 (08:30 KST)",
    kv: "Vercel KV는 Settings > Storage에서 추가하면 활성화됨"
  });
}
