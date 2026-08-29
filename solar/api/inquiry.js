// /api/inquiry.js - Gmail SMTP 버전 (Resend 가입 불필요)
// bukikorea@gmail.com 으로 문의 메일 발송
// Vercel Env: GMAIL_USER, GMAIL_APP_PASSWORD 필요

import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, phone, address, pyeong, roofType, message, timestamp, pageUrl, currentPyeong } = req.body;
    if (!name || !phone || !address) {
      return res.status(400).json({ error: '필수 항목 누락' });
    }

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
    const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD; // 16자리 앱 비밀번호
    const TO_EMAIL = 'bukikorea@gmail.com';

    let emailSent = false;
    let emailError = null;

    // Gmail SMTP 설정이 있으면 메일 발송
    if (GMAIL_APP_PASSWORD) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: GMAIL_USER,
            pass: GMAIL_APP_PASSWORD.replace(/\s/g, '') // 공백 제거
          }
        });

        const mailOptions = {
          from: `"솔라루프 문의폼" <${GMAIL_USER}>`,
          to: TO_EMAIL,
          subject: `[공장 지붕 임대 문의] ${data.name} - ${data.address} (${data.pyeong}평)`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px;">
              <h2 style="color: #0F4C81;">🏭 공장 지붕 임대 신규 문의</h2>
              <p style="color: #64748b; font-size: 13px;">${data.receivedAt} 접수</p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr><td style="padding: 10px; font-weight: bold; background: #f8fafc; width: 120px;">담당자명</td><td style="padding: 10px;">${data.name}</td></tr>
                <tr><td style="padding: 10px; font-weight: bold; background: #f8fafc;">연락처</td><td style="padding: 10px;"><a href="tel:${data.phone}">${data.phone}</a> / <a href="sms:${data.phone}">문자</a></td></tr>
                <tr><td style="padding: 10px; font-weight: bold; background: #f8fafc;">공장 주소</td><td style="padding: 10px;">${data.address}</td></tr>
                <tr><td style="padding: 10px; font-weight: bold; background: #f8fafc;">지붕 평수</td><td style="padding: 10px;">${data.pyeong}평 - 선급금 약 ${Math.floor((parseFloat(data.pyeong)||0)*47)}만원</td></tr>
                <tr><td style="padding: 10px; font-weight: bold; background: #f8fafc;">지붕 형태</td><td style="padding: 10px;">${data.roofType}</td></tr>
                <tr><td style="padding: 10px; font-weight: bold; background: #f8fafc;">문의 내용</td><td style="padding: 10px; white-space: pre-wrap;">${data.message}</td></tr>
                <tr><td style="padding: 10px; font-weight: bold; background: #f8fafc;">유입 페이지</td><td style="padding: 10px; font-size: 12px;">${data.pageUrl}</td></tr>
              </table>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
              <div style="background: #f0f9ff; padding: 12px; border-radius: 8px; font-size: 12px;">
                💡 30초 한전 계통 조회 후 30분 이내 연락 바랍니다.<br>
                변전소/주변압기/배전선로 여유용량 확인 필요
              </div>
            </div>
          `
        };

        const info = await transporter.sendMail(mailOptions);
        emailSent = true;
        console.log('Gmail sent:', info.messageId);

      } catch (err) {
        emailError = err.message;
        console.error('Gmail send error:', err);
      }
    } else {
      emailError = 'GMAIL_APP_PASSWORD 환경변수 없음';
    }

    console.log('=== 공장 지붕 임대 문의 ===', JSON.stringify(data, null, 2));

    return res.status(200).json({
      success: true,
      message: '문의 접수 완료',
      data,
      emailSent,
      emailError: emailSent ? null : emailError,
      note: emailSent ? 'bukikorea@gmail.com으로 메일 발송 완료' : 'Vercel 환경변수 GMAIL_APP_PASSWORD 설정 필요'
    });

  } catch (error) {
    console.error('Inquiry error:', error);
    return res.status(500).json({ error: error.message });
  }
}
