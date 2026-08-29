
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
    const { name, phone, address, pyeong, roofType, message, pageUrl, currentPyeong } = req.body;
    if (!name || !phone || !address) return res.status(400).json({ error: '필수 항목 누락' });

    const now = new Date();
    const inquiry = {
      id: 'inq_' + now.getTime(),
      name, phone, address,
      pyeong: String(pyeong || currentPyeong || '미입력'),
      roofType: roofType || '미선택',
      message: message || '없음',
      pageUrl: pageUrl || '',
      createdAt: now.toISOString(),
      receivedAt: now.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      updatedAt: now.toISOString(),
      status: '신규',
      memo: '',
      kakaoMemo: '',
      emailMemo: '',
      emailSent: false,
      emailError: null
    };

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
          subject: `[지붕임대] ${inquiry.name} - ${inquiry.address}`,
          html: `<h3>${inquiry.name} / ${inquiry.phone}</h3><p>${inquiry.address} / ${inquiry.pyeong}평 / ${inquiry.roofType}</p><p>${inquiry.message}</p><p><a href="https://www.solarroof.kr/admin">관리자</a></p>`
        });
        emailSent = true;
        inquiry.emailSent = true;
      } catch (e) {
        inquiry.emailError = e.message;
      }
    }

    const supabase = getSupabase();
    let supabaseSaved = false, supabaseError = null;
    if (supabase) {
      const { error } = await supabase.from('inquiries').insert([inquiry]);
      if (error) { supabaseError = error.message; console.error(error); }
      else supabaseSaved = true;
    }

    return res.status(200).json({ success: true, emailSent, supabaseSaved, supabaseError });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
