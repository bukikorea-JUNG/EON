module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { keyword } = req.body || {};
  if (!keyword) return res.status(400).json({ error: 'keyword required' });

  // 1. https://app.dataforseo.com/api-access 에서 확인한 로그인 이메일과 API Password
  const dfsLogin = process.env.DATAFORSEO_LOGIN || 'bukikorea@gmail.com';
  const dfsPassword = process.env.DATAFORSEO_PASSWORD || '75b437aaffbf6b55'; // API Access 페이지의 API Password

  // 2. Basic Auth 표준 (email:password 형태를 Base64 인코딩)
  const authHeader = 'Basic ' + Buffer.from(`${dfsLogin}:${dfsPassword}`).toString('base64');

  try {
    const r = await fetch('https://api.dataforseo.com/v3/serp/google/organic/live/advanced', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{
        keyword: keyword,
        location_name: "South Korea",
        location_code: 2410,
        language_code: "ko"
      }])
    });

    const data = await r.json();

    // 에러 응답 처리
    if (data.status_code !== 20000) {
      return res.status(400).json({ error: data.status_message, data });
    }

    const items = data?.tasks?.[0]?.result?.[0]?.items || [];

    return res.status(200).json({
      success: true,
      keyword: keyword,
      count: items.length,
      items: items.map(item => ({
        type: item.type,
        rank: item.rank_group,
        title: item.title,
        url: item.url,
        description: item.description
      }))
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
