// /api/ai-edit.js - Vercel Serverless Function with CORS fix
export default async function handler(req, res) {
  // --- CORS ---
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ error: 'POST only' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.META_LLAMA_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'META_LLAMA_API_KEY not set in Vercel' });
  }

  try {
    const { prompt, system, model } = req.body || {};
    
    // Meta Llama API - official endpoint
    const llamaRes = await fetch('https://api.llama.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model || 'Llama-4-Maverick-17B-128E-Instruct-FP8',
        messages: [
          { role: 'system', content: system || 'You are a GEO content editor. Keep images, edit text only.' },
          { role: 'user', content: prompt || req.body?.messages?.[0]?.content || 'Hello' }
        ]
      })
    });

    // Fallback: api.llama-api.com (if account is on old endpoint)
    let data;
    if (!llamaRes.ok) {
      const fallbackRes = await fetch('https://api.llama-api.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model || 'Llama-4-Maverick-17B-128E-Instruct-FP8',
          messages: [
            { role: 'system', content: system || 'You are a GEO content editor.' },
            { role: 'user', content: prompt || 'Hello' }
          ]
        })
      });
      data = await fallbackRes.json();
      if (!fallbackRes.ok) {
        return res.status(fallbackRes.status).json({ error: 'Llama API error', details: data });
      }
    } else {
      data = await llamaRes.json();
    }

    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: 'Server error', details: String(e) });
  }
}
