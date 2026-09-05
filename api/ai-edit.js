// /api/ai-edit.js - Gemini 3.0 Flash
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'GET') return res.status(200).json({ error: 'POST only' });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const geminiKey = process.env.GEMINI_API_KEY;
  try {
    const { prompt, system } = req.body || {};
    const userPrompt = prompt || req.body?.messages?.[0]?.content || 'Hello';
    const sysPrompt = system || 'You are a GEO content editor. Keep images, edit text only.';

    if (!geminiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not set' });

    // 3.0 Flash 우선
    const tryModels = ['gemini-3.0-flash', 'gemini-2.5-flash', 'gemini-1.5-flash'];

    let lastError = null;
    for (const model of tryModels) {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${sysPrompt}\n\n${userPrompt}` }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
        })
      });
      const data = await r.json();
      if (r.ok) {
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return res.status(200).json({ choices: [{ message: { content: text } }], model_used: model });
      }
      lastError = data;
      if (data?.error?.code !== 404) {
        return res.status(r.status).json({ error: 'Gemini API error', details: data });
      }
    }
    return res.status(404).json({ error: 'Gemini API error', details: lastError });
  } catch (e) {
    return res.status(500).json({ error: 'Server error', details: String(e) });
  }
}
