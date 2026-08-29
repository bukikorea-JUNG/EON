
// /api/inquiry.js - Gmail + Supabase 저장
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

function getSupabase() {
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, phone, address, pyeong, roofType, message, timestamp, pageUrl, currentPyeong } = req.body;
    if (!name || !phone || !address) return res.status(400).json({ error: '필수 항목 누락' });

    const now = new Date();
    const inquiry = {
      id: 'inq_' + now.getTime(),
      name, phone, address,
      pyeong: pyeong || currentPyeong || '미입력',
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

    // 1. Gmail 발송
    const GMAIL_USER = process.env.GMAIL_USER || 'bukikorea@gmail.com';
    const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
    let emailSent = false;
    let emailError = null;

    if (GMAIL_APP_PASSWORD) {
      try {
        const cleanPass = GMAIL_APP_PASSWORD.replace(/[\s_]+/g, '');
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: GMAIL_USER, pass: cleanPass }
        });
        await transporter.sendMail({
          from: `"솔라루프 문의" <${GMAIL_USER}>`,
          to: 'bukikorea@gmail.com',
          subject: `[공장 지붕 임대] ${inquiry.name} - ${inquiry.address} (${inquiry.pyeong}평)`,
          html: `<div style="font-family:sans-serif;max-width:600px;padding:20px;border:1px solid #e2e8f0;border-radius:16px">
            <h2>🏭 신규 문의 - ${inquiry.status}</h2>
            <p><a href="https://www.solarroof.kr/admin" style="background:#0F4C81;color:white;padding:8px 16px;border-radius:8px;text-decoration:none">관리자에서 관리</a></p>
            <table style="width:100%;font-size:14px;border-collapse:collapse">
              <tr><td style="padding:8px;background:#f8fafc;font-weight:bold">담당자</td><td style="padding:8px">${inquiry.name}</td></tr>
              <tr><td style="padding:8px;background:#f8fafc;font-weight:bold">연락처</td><td style="padding:8px"><a href="tel:${inquiry.phone}">${inquiry.phone}</a></td></tr>
              <tr><td style="padding:8px;background:#f8fafc;font-weight:bold">주소</td><td style="padding:8px">${inquiry.address}</td></tr>
              <tr><td style="padding:8px;background:#f8fafc;font-weight:bold">평수</td><td style="padding:8px">${inquiry.pyeong}</td></tr>
              <tr><td style="padding:8px;background:#f8fafc;font-weight:bold">지붕</td><td style="padding:8px">${inquiry.roofType}</td></tr>
              <tr><td style="padding:8px;background:#f8fafc;font-weight:bold">내용</td><td style="padding:8px">${inquiry.message}</td></tr>
            </table></div>`
        });
        emailSent = true;
        inquiry.emailSent = true;
      } catch (err) {
        emailError = err.message;
        inquiry.emailError = err.message;
      }
    }

    // 2. Supabase 저장 (영구 저장)
    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase.from('inquiries').insert([inquiry]);
      if (error) console.error('Supabase insert error', error);
    }

    return res.status(200).json({ success: true, emailSent, emailError, data: inquiry, supabase: !!supabase });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
}
