
// /api/inquiry.js - Gmail SMTP + 파일 저장 (백엔드 연동)
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'inquiries.json');

function saveToFile(inquiry) {
  try {
    let data = [];
    if (fs.existsSync(DATA_FILE)) {
      data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    } else {
      fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    }
    data.unshift(inquiry);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Save file error', e);
  }
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
      timestamp: timestamp || now.toISOString(),
      pageUrl: pageUrl || '',
      createdAt: now.toISOString(),
      receivedAt: now.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      status: '신규', // 신규, 연락완료, 계약진행, 완료, 보류
      memo: '',
      kakaoMemo: '',
      emailMemo: '',
      emailSent: false,
      emailError: null
    };

    const GMAIL_USER = process.env.GMAIL_USER || 'bukikorea@gmail.com';
    const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
    const TO_EMAIL = 'bukikorea@gmail.com';

    let emailSent = false;
    let emailError = null;

    if (GMAIL_APP_PASSWORD) {
      try {
        const cleanPass = GMAIL_APP_PASSWORD.replace(/[\s_]+/g, '');
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: GMAIL_USER, pass: cleanPass }
        });

        const info = await transporter.sendMail({
          from: `"솔라루프 문의" <${GMAIL_USER}>`,
          to: TO_EMAIL,
          subject: `[공장 지붕 임대] ${inquiry.name} - ${inquiry.address} (${inquiry.pyeong}평)`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e2e8f0;border-radius:16px">
              <h2 style="color:#0F4C81">🏭 신규 문의 - ${inquiry.status}</h2>
              <p style="color:#64748b;font-size:13px">${inquiry.receivedAt}</p>
              <p><a href="https://www.solarroof.kr/admin" style="background:#0F4C81;color:white;padding:8px 16px;border-radius:8px;text-decoration:none">관리자 페이지에서 관리</a></p>
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0">
              <table style="width:100%;font-size:14px;border-collapse:collapse">
                <tr><td style="padding:10px;font-weight:bold;background:#f8fafc;width:110px">담당자</td><td style="padding:10px">${inquiry.name}</td></tr>
                <tr><td style="padding:10px;font-weight:bold;background:#f8fafc">연락처</td><td style="padding:10px"><a href="tel:${inquiry.phone}">${inquiry.phone}</a></td></tr>
                <tr><td style="padding:10px;font-weight:bold;background:#f8fafc">주소</td><td style="padding:10px">${inquiry.address}</td></tr>
                <tr><td style="padding:10px;font-weight:bold;background:#f8fafc">평수</td><td style="padding:10px">${inquiry.pyeong}평</td></tr>
                <tr><td style="padding:10px;font-weight:bold;background:#f8fafc">지붕형태</td><td style="padding:10px">${inquiry.roofType}</td></tr>
                <tr><td style="padding:10px;font-weight:bold;background:#f8fafc">문의내용</td><td style="padding:10px;white-space:pre-wrap">${inquiry.message}</td></tr>
                <tr><td style="padding:10px;font-weight:bold;background:#f8fafc">페이지</td><td style="padding:10px;font-size:12px">${inquiry.pageUrl}</td></tr>
              </table>
            </div>`
        });
        emailSent = true;
        inquiry.emailSent = true;
      } catch (err) {
        emailError = err.message;
        inquiry.emailError = err.message;
        console.error('Mail error:', err);
      }
    } else {
      emailError = 'GMAIL_APP_PASSWORD 없음';
      inquiry.emailError = emailError;
    }

    // 파일에 저장 (백엔드용)
    saveToFile(inquiry);

    return res.status(200).json({ success: true, emailSent, emailError, data: inquiry });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
}
