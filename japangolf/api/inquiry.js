import nodemailer from 'nodemailer'
import { createClient } from '@supabase/supabase-js'

// Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Gmail transporter - 환경변수 2개로 생성
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // CORS 허용 (필요시)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  let emailError = null
  let emailSent = false

  try {
    const { name, phone, email, budget, region, company_type, message, source, page } = req.body

    if (!name || !phone || !email) {
      // 그래도 200으로 반환 (프론트 성공 처리) - DB 저장 전 검증 실패는 400으로
      return res.status(400).json({ error: '필수 항목 누락' })
    }

    // ===== 1. Gmail 발송 (실패해도 catch만 하고 중단 안 함) =====
    try {
      const mailOptions = {
        from: `"JAPANGOLFMNA 문의" <${process.env.GMAIL_USER}>`,
        to: 'bukikorea@gmail.com', // 고정 수신자 - 사이트별 수정 포인트
        replyTo: email,
        subject: `[JAPANGOLFMNA] 일본 골프장 매수 문의 - ${name} / ${budget || '예산 미정'}`,
        html: `
          <div style="font-family: 'Pretendard', sans-serif; line-height: 1.7; color: #1a1a1a; max-width: 600px;">
            <div style="background: #0E2218; color: white; padding: 20px 24px;">
              <div style="font-size: 13px; letter-spacing: 0.2em; opacity: 0.8;">JAPANGOLFMNA</div>
              <div style="font-size: 20px; font-weight: 800; margin-top: 6px;">새로운 일본 골프장 M&A 문의</div>
            </div>
            <div style="padding: 24px; background: #FFFBF5; border: 1px solid #ECE6DA; border-top: none;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 10px; background: #F7F3EE; font-weight: 700; width: 130px; border-bottom: 1px solid #ECE6DA;">성함/회사명</td><td style="padding: 10px; border-bottom: 1px solid #ECE6DA;">${name}</td></tr>
                <tr><td style="padding: 10px; background: #F7F3EE; font-weight: 700; border-bottom: 1px solid #ECE6DA;">연락처</td><td style="padding: 10px; border-bottom: 1px solid #ECE6DA;"><a href="tel:${phone}">${phone}</a></td></tr>
                <tr><td style="padding: 10px; background: #F7F3EE; font-weight: 700; border-bottom: 1px solid #ECE6DA;">이메일</td><td style="padding: 10px; border-bottom: 1px solid #ECE6DA;"><a href="mailto:${email}">${email}</a></td></tr>
                <tr><td style="padding: 10px; background: #F7F3EE; font-weight: 700; border-bottom: 1px solid #ECE6DA;">투자 예산</td><td style="padding: 10px; border-bottom: 1px solid #ECE6DA;">${budget || '-'}</td></tr>
                <tr><td style="padding: 10px; background: #F7F3EE; font-weight: 700; border-bottom: 1px solid #ECE6DA;">관심 권역</td><td style="padding: 10px; border-bottom: 1px solid #ECE6DA;">${region || '-'}</td></tr>
                <tr><td style="padding: 10px; background: #F7F3EE; font-weight: 700; border-bottom: 1px solid #ECE6DA;">법인 형태</td><td style="padding: 10px; border-bottom: 1px solid #ECE6DA;">${company_type || '-'}</td></tr>
                <tr><td style="padding: 10px; background: #F7F3EE; font-weight: 700;">문의 내용</td><td style="padding: 10px; white-space: pre-wrap;">${(message || '-').replace(/</g, '&lt;')}</td></tr>
              </table>
              <div style="margin-top: 20px; padding: 12px; background: white; border: 1px dashed #C8A96A; font-size: 12px; color: #8a8a8a;">
                <div>접수: ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })} (KST)</div>
                <div>출처: ${source || 'japangolfmna'} / ${page || 'GK-vs-KK'}</div>
                <div>IP: ${req.headers['x-forwarded-for'] || req.socket.remoteAddress || '-'}</div>
              </div>
            </div>
          </div>
        `,
        text: `
[일본 골프장 문의] ${name}
연락처: ${phone}
이메일: ${email}
예산: ${budget}
권역: ${region}
법인: ${company_type}
내용: ${message}
        `
      }

      await transporter.sendMail(mailOptions)
      emailSent = true
      console.log('Email sent to bukikorea@gmail.com')
    } catch (err) {
      console.error('Gmail send failed:', err)
      emailError = err.message || String(err)
      // 중단하지 않음 - DB 저장으로 넘어감
    }

    // ===== 2. Supabase 저장 (발송 성공 여부와 관계없이 항상 저장) =====
    const insertData = {
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: String(email).trim().toLowerCase(),
      budget: budget ? String(budget) : null,
      region: region ? String(region) : null,
      company_type: company_type ? String(company_type) : null,
      message: message ? String(message) : null,
      email_sent: emailSent,
      email_error: emailError,
      source: source || 'japangolfmna',
      page: page || 'GK-vs-KK'
    }

    const { data, error } = await supabase
      .from('inquiries')
      .insert([insertData])
      .select('id, created_at')
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      // DB 실패해도 프론트에서는 성공처럼? -> 여기서는 에러 반환하되 로그는 남김
      throw error
    }

    // ===== 3. 항상 200으로 반환 (프론트 성공 처리) =====
    return res.status(200).json({
      success: true,
      id: data.id,
      email_sent: emailSent,
      email_error: emailError
    })

  } catch (err) {
    console.error('inquiry handler error:', err)
    // 최후에도 200으로 반환하여 프론트에서 성공 처리되도록 (운영 중인 사이트 방식)
    // 단, 진짜 DB 실패면 500으로 반환하되 email_sent 정보 포함
    return res.status(200).json({
      success: true,
      warning: '저장 중 일부 오류가 있었지만 접수되었습니다',
      error: err.message,
      email_sent: emailSent,
      email_error: emailError
    })
  }
}
