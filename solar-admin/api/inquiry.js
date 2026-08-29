
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

function getSupabase() {
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, phone, address, pyeong, roofType, roof_type, message, pageUrl, page_url, currentPyeong } = req.body;
    if (!name || !phone || !address) return res.status(400).json({ error: '필수 항목 누락' });

    const now = new Date();
    // DB는 snake_case로 저장 (PGRST204 방지)
    const row = {
      id: 'inq_' + now.getTime(),
      name, phone, address,
      pyeong: String(pyeong || currentPyeong || '미입력'),
      roof_type: roofType || roof_type || '미선택',
      message: message || '없음',
      page_url: pageUrl || page_url || '',
      created_at: now.toISOString(),
      received_at: now.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      updated_at: now.toISOString(),
      status: '신규',
      memo: '',
      kakao_memo: '',
      email_memo: '',
      email_sent: false,
      email_error: null
    };

    // Gmail
    const GMAIL_USER = process.env.GMAIL_USER || 'bukikorea@gmail.com';
    const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
    let emailSent = false;
    if (GMAIL_APP_PASSWORD) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD.replace(/[\s_]+/g, '') }
        });
        await transporter.sendMail({
          from: `"솔라루프 문의" <${GMAIL_USER}>`,
          to: 'bukikorea@gmail.com',
          subject: `[지붕임대] ${row.name} - ${row.address}`,
          html: `<h3>${row.name} / ${row.phone}</h3><p>${row.address} / ${row.pyeong}평 / ${row.roof_type}</p><p>${row.message}</p><p><a href="https://www.solarroof.kr/admin">관리자</a></p>`
        });
        emailSent = true;
        row.email_sent = true;
      } catch (e) {
        row.email_error = e.message;
      }
    }

    const supabase = getSupabase();
    if (!supabase) return res.status(200).json({ success: true, emailSent, warning: 'Supabase ENV missing, mail only' });

    const { error } = await supabase.from('inquiries').insert([row]);
    if (error) {
      console.error('Supabase insert error', error);
      return res.status(500).json({ error: error.message, code: error.code, details: error.details, hint: 'Supabase SQL을 다시 실행하고 30초 후 재시도하세요' });
    }

    return res.status(200).json({ success: true, emailSent, supabaseSaved: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
}
