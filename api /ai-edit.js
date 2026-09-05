export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method!== 'POST') return res.status(405).json({ error: 'POST only' });

  const API_KEY = process.env.META_LLAMA_API_KEY || process.env.LLAMA_API_KEY || process.env.TOGETHER_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: 'No API key in env' });

  const { prompt, h2, h3, body, bullets, layout } = req.body;

  try {
    // 공식 Meta Llama API 엔드포인트 【7827524890047277227†L5-L7】
    // 호환 엔드포인트는 /compat/v1/chat/completions 【7827524890047277227†L11-L14】
    const r = await fetch('https://api.llama.com/compat/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // 공식 모델명 예시: Llama-4-Maverick-17B-128E-Instruct-FP8 【7827524890047277227†L21-L24】
        model: 'Llama-4-Maverick-17B-128E-Instruct-FP8',
        messages: [
          {
            role: 'system',
            content: `너는 GEO 전문 카피라이터. 규칙: 1.이미지 수정 금지, 텍스트와 구도만 수정 2.오직 JSON만 리턴: {"h2":"...","h3":"...","body":"...","bullets":["..."],"layout":"left|right|grid|full","gridCols":2,"align":"left"} 3.사용자 요청: ${prompt}`
          },
          { role: 'user', content: `현재: h2=${h2}, h3=${h3}, body=${body}, bullets=${JSON.stringify(bullets)}, layout=${layout}` }
        ],
        temperature: 0.7
      })
    });

    const data = await r.json();
    if (data.error) return res.status(r.status).json(data);

    const content = data.choices?.[0]?.message?.content || '{}';
    const jsonStr = content.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(jsonStr);
    return res.status(200).json(parsed);

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
