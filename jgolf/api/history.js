export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-cache");
  const CLOUDFLARE_URL = "https://tdb-cron.bukikorea.workers.dev/";
  try {
    const cfRes = await fetch(CLOUDFLARE_URL, { cache: "no-store" });
    if (cfRes.ok) {
      const cfData = await cfRes.json();
      if (Array.isArray(cfData) && cfData.length > 0) {
        return res.status(200).json(cfData);
      }
    }
  } catch(e){ console.error(e); }
  return res.status(200).json([]);
}
