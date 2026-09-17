export default async function handler(req, res) {
  return res.status(200).json({
    ok: true,
    time: new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }),
    note: "메인 수집은 Cloudflare tdb-cron 08:30 JST",
    cloudflare: "https://tdb-cron.bukikorea.workers.dev/"
  });
}
