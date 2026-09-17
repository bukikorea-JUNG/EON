import { kv } from "@vercel/kv";

// 대시보드가 fetch할 API: GET /api/history
export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const history = (await kv.get("history")) || [];
    return res.status(200).json(history);
  } catch (e) {
    return res.status(500).json({ error: String(e), history: [] });
  }
}
