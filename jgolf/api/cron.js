export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  return res.status(200).json({
    ok: true,
    time: new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }),
    kst: new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
    note: "메인 수집은 Cloudflare tdb-cron 08:30 JST",
    cloudflare: "https://tdb-cron.bukikorea.workers.dev/",
    manual_trigger: "https://tdb-cron.bukikorea.workers.dev/cron"
  });
}
