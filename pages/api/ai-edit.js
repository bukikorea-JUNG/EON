// /api/ai-edit.js - Gemini + Llama dual support
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'GET') return res.status(200).json({ error: 'POST only' });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const geminiKey = process.env.GEMINI_API_KEY;
  const llamaKey = process.env.META_LLAMA_API_KEY || process.env.LLAMA_API_KEY;

  try {
    const { prompt, system } = req.body || {};
    const userPrompt = prompt || req.body?.messages?.[0]?.content || 'Hello';
    const sysPrompt = system || 'You are a GEO content editor. Keep images, edit text only.';

    // --- 1. GEMINI 우선 ---
    if (geminiKey) {
      const gemRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${sysPrompt}\n\n${userPrompt}` }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
        })
      });
      const gemData = await gemRes.json();
      if (!gemRes.ok) {
        return res.status(gemRes.status).json({ error: 'Gemini API error', details: gemData });
      }
      const text = gemData.candidates?.[0]?.content?.parts?.[0]?.text || '';
      // OpenAI 호환 형태로 변환해서 프론트가 그대로 쓰게
      return res.status(200).json({
        choices: [{ message: { content: text } }],
        gemini_raw: gemData
      });
    }

    // --- 2. Llama fallback ---
    if (!llamaKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY or META_LLAMA_API_KEY not set' });
    }
    const llamaRes = await fetch('https://api.llama.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${llamaKey}`
      },
      body: JSON.stringify({
        model: 'Llama-4-Maverick-17B-128E-Instruct-FP8',
        messages: [
          { role: 'system', content: sysPrompt },
          { role: 'user', content: userPrompt }
        ]
      })
    });
    const data = await llamaRes.json();
    if (!llamaRes.ok) return res.status(llamaRes.status).json({ error: 'Llama API error', details: data });
    return res.status(200).json(data);

  } catch (e) {
    return res.status(500).json({ error: 'Server error', details: String(e) });
  }
}
