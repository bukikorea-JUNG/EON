// Autoweb/api/serp.js - Vercel Serverless Function
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed, use POST' });
  }

  const { keyword } = req.body || {};
  if (!keyword) {
    return res.status(400).json({ error: 'keyword required' });
  }

  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;

  if (!login || !password) {
    return res.status(500).json({ 
      error: 'DATAFORSEO_LOGIN / PASSWORD env missing',
      hint: 'Vercel Settings > Environment Variables에 넣고 Redeploy 필요'
    });
  }

  const auth = Buffer.from(`${login}:${password}`).toString('base64');

  try {
    const r = await fetch('https://api.dataforseo.com/v3/serp/google/organic/live/advanced', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{
        keyword: keyword,
        location_code: 2410, // South Korea - 2126 아님, 2410이 정답
        language_code: 'ko',
        depth: 10
      }])
    });

    const data = await r.json();
    return res.status(200).json(data);

  } catch (e) {
    return res.status(500).json({ 
      error: 'DataForSEO fetch failed',
      message: e.message 
    });
  }
}
