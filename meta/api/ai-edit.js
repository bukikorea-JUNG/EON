// api/ai-edit.js
export default async function handler(req, res) {
  // CORS 허용 (아티팩트에서 호출 가능하게)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method!== 'POST') return res.status(405).json({ error: 'POST only' });

  const { prompt, h2, h3, body, bullets, layout, context } = req.body;

  const systemPrompt = `너는 제품 상세페이지 GEO 전문가 카피라이터다.
규칙:
1. 이미지는 절대 수정하지 않는다. 텍스트(h2,h3,body,bullets)와 구도(layout,gridCols,align)만 수정
2. 반드시 JSON만 리턴, 다른 설명 금지: {"h2":"...","h3":"...","body":"...","bullets":["...","..."],"layout":"left|right|grid|full","gridCols":2,"align":"left|center|right"}
3. 사용자 요청: ${prompt}
4. 제품 컨텍스트: ${JSON.stringify(context || {})}`;

  try {
    const r = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta-llama/Meta-Llama-3.1-70B-Instruct',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `현재 값: h2=${h2}, h3=${h3}, body=${body}, bullets=${JSON.stringify(bullets)}, layout=${layout}` }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!r.ok) {
      const t = await r.text();
      return res.status(r.status).json({ error: t });
    }
    const data = await r.json();
    const content = data.choices[0].message.content;
    // JSON 추출 (마크다운 코드블록 제거)
    const jsonStr = content.replace(/```json|```/g, '').trim();
    const result = JSON.parse(jsonStr);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
