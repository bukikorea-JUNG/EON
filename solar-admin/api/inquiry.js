
// /api/inquiry.js - Vercel Serverless Function
// Env required: SUPABASE_URL, SUPABASE_ANON_KEY, KAKAO_CHANNEL_TOKEN (optional)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }
  try {
    const { company, name, contact, address, area, unitPrice, message, timestamp } = req.body || {};

    if (!contact || !area) {
      return res.status(400).json({ ok: false, error: 'contact, area required' });
    }

    // 1. Supabase 저장 (키 있으면)
    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
      const { error } = await supabase.from('inquiries').insert([{
        company: company || null,
        contact_name: name || null,
        contact: contact,
        address: address || null,
        area: Number(area) || 0,
        unit_price: Number(unitPrice) || 40000,
        message: message || null,
        created_at: new Date().toISOString()
      }]);
      if (error) console.error('Supabase insert error:', error);
    } else {
      console.log('SUPABASE_URL/ANON_KEY not set - skipping DB save, mock mode');
    }

    // 2. 카카오 알림 (선택 - 키 있으면)
    if (process.env.KAKAO_CHANNEL_TOKEN) {
      // 예시: 카카오 비즈니스 알림톡 API 호출 자리
      // await fetch('https://api.kakao.com/...', { method:'POST', headers:{ Authorization: `Bearer ${process.env.KAKAO_CHANNEL_TOKEN}` }, body: JSON.stringify({ to: contact, text: `[SOLARROOF] ${company||''} ${area}평 문의` }) })
      console.log('Kakao notification would be sent');
    }

    return res.status(200).json({ ok: true, message: '문의 접수 완료 - 24시간 내 연락드립니다.' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: String(e) });
  }
}
