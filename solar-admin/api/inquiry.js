
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';


function isValidPhone(phone){
  if (!phone) return false;
  const cleaned = String(phone).replace(/[^0-9]/g, '');
  if (cleaned.length < 9 || cleaned.length > 11) return false;
  if (!cleaned.startsWith('0')) return false;
  return /^0[0-9]{8,10}$/.test(cleaned);
}
function isValidEmail(email){
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email)) && String(email).length <= 254;
}


export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  const gmailUser = process.env.GMAIL_USER || 'bukikorea@gmail.com';
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  console.log('ENV check', { hasUrl: !!supabaseUrl, hasKey: !!supabaseKey, hasGmail: !!gmailPass, url: supabaseUrl });

  try {
    const b = req.body || {};
    const name = b.name, phone = b.phone, address = b.address, email = b.email;
    if (!name || !phone || !address || !email) return res.status(400).json({ success: false, error: '필수 항목 누락 (이름/전화/주소/이메일)' });
    if (!isValidPhone(phone)) return res.status(400).json({ success: false, error: '전화번호 형식이 올바르지 않습니다. 예: 010-1234-5678' });
    if (!isValidEmail(email)) return res.status(400).json({ success: false, error: '이메일 형식이 올바르지 않습니다. 예: factory@company.com' });

    const now = new Date();
    const row = {
      id: 'inq_' + now.getTime(),
      name: name,
      phone: phone,
      email: email,
      address: address,
      pyeong: String(b.pyeong || b.currentPyeong || '미입력'),
      roof_type: b.roofType || b.roof_type || '미선택',
      message: b.message || '없음',
      page_url: b.pageUrl || b.page_url || '',
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

    let emailSent = false;
    let emailError = null;
    if (gmailPass) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: gmailUser, pass: String(gmailPass).replace(/[\s_]+/g, '') }
        });
        await transporter.sendMail({
          from: `"솔라루프 문의" <${gmailUser}>`,
          to: 'bukikorea@gmail.com',
          subject: `[지붕임대] ${row.name} - ${row.address} - ${row.email}`,
          html: `<h3>${row.name} / ${row.phone} / ${row.email}</h3><p>${row.address} / ${row.pyeong}평 / ${row.roof_type}</p><p>${row.message}</p><p>고객 이메일: ${row.email}</p><p><a href="https://www.solarroof.kr/admin">관리자</a></p>`,
          replyTo: row.email
        });
        emailSent = true;
        row.email_sent = true;
      } catch (e) {
        console.error('Gmail fail', e);
        emailError = e.message;
        row.email_error = e.message;
      }
    } else {
      emailError = 'GMAIL_APP_PASSWORD 없음';
    }

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase ENV missing');
      return res.status(200).json({ success: true, emailSent, emailError, supabaseSaved: false, warning: 'SUPABASE_URL/KEY 없음 - 메일만 발송됨' });
    }

    try {
      const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
      const { error } = await supabase.from('inquiries').insert([row]);
      if (error) {
        console.error('Supabase insert error', error);
        return res.status(200).json({ success: true, emailSent, emailError, supabaseSaved: false, supabaseError: error.message, code: error.code });
      }
      return res.status(200).json({ success: true, emailSent, supabaseSaved: true });
    } catch (e) {
      console.error('Supabase client error', e);
      return res.status(200).json({ success: true, emailSent, emailError, supabaseSaved: false, supabaseError: e.message });
    }

  } catch (e) {
    console.error('Handler crash', e);
    return res.status(200).json({ success: false, error: e.message, stack: e.stack });
  }
}
