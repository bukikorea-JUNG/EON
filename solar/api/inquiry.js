// /api/inquiry.js - Gmail SMTP - bukikorea@gmail.com
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, phone, address, pyeong, roofType, message, timestamp, pageUrl, currentPyeong } = req.body;
    if (!name || !phone || !address) return res.status(400).json({ error: '필수 항목 누락' });

    const data = {
      name, phone, address,
      pyeong: pyeong || currentPyeong || '미입력',
      roofType: roofType || '미선택',
      message: message || '없음',
      timestamp: timestamp || new Date().toISOString(),
      pageUrl: pageUrl || '',
      receivedAt: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
    };

    const GMAIL_USER = process.env.GMAIL_USER || 'bukikorea@gmail.com';
    const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
    const TO_EMAIL = 'bukikorea@gmail.com';

    let emailSent = false;
    let emailError = null;

    console.log('ENV CHECK:', { hasUser: !!GMAIL_USER, hasPass: !!GMAIL_APP_PASSWORD, user: GMAIL_USER });

    if (GMAIL_APP_PASSWORD) {
      try {
        // 공백, 언더바 모두 제거
        const cleanPass = GMAIL_APP_PASSWORD.replace(/[\s_]+/g, '');
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: GMAIL_USER, pass: cleanPass }
        });

        const info = await transporter.sendMail({
          from: `"솔라루프 문의" <${GMAIL_USER}>`,
          to: TO_EMAIL,
          subject: `[공장 지붕 임대] ${data.name} - ${data.address} (${data.pyeong}평)`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e2e8f0;border-radius:16px">
              <h2 style="color:#0F4C81">🏭 신규 문의</h2>
              <p style="color:#64748b;font-size:13px">${data.receivedAt}</p>
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0">
              <table style="width:100%;font-size:14px;border-collapse:collapse">
                <tr><td style="padding:10px;font-weight:bold;background:#f8fafc;width:110px">담당자</td><td style="padding:10px">${data.name}</td></tr>
                <tr><td style="padding:10px;font-weight:bold;background:#f8fafc">연락처</td><td style="padding:10px"><a href="tel:${data.phone}">${data.phone}</a> (클릭시 010-3194-7270 연결)</td></tr>
                <tr><td style="padding:10px;font-weight:bold;background:#f8fafc">주소</td><td style="padding:10px">${data.address}</td></tr>
                <tr><td style="padding:10px;font-weight:bold;background:#f8fafc">평수</td><td style="padding:10px">${data.pyeong}평 / 선급금 약 ${Math.floor((parseFloat(data.pyeong)||0)*47)}만원</td></tr>
                <tr><td style="padding:10px;font-weight:bold;background:#f8fafc">지붕형태</td><td style="padding:10px">${data.roofType}</td></tr>
                <tr><td style="padding:10px;font-weight:bold;background:#f8fafc">문의내용</td><td style="padding:10px;white-space:pre-wrap">${data.message}</td></tr>
                <tr><td style="padding:10px;font-weight:bold;background:#f8fafc">페이지</td><td style="padding:10px;font-size:12px">${data.pageUrl}</td></tr>
              </table>
            </div>`
        });
        emailSent = true;
        console.log('Mail sent:', info.messageId);
      } catch (err) {
        emailError = err.message;
        console.error('Mail error:', err);
      }
    } else {
      emailError = 'GMAIL_APP_PASSWORD 없음 - Vercel 환경변수 설정 필요';
    }

    return res.status(200).json({ success: true, emailSent, emailError, data });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
}
