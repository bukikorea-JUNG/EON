import nodemailer from 'nodemailer'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'})
  try{
    const {name,phone,email,budget,region,company_type,message,source,page} = req.body
    // 1. DB 먼저 저장 (이게 대시보드에 보이는 핵심)
    const {data: inserted, error: dbError} = await supabase.from('inquiries').insert([{
      name, phone, email, budget, region, company_type, message, source, page,
      email_sent: false, status: 'new'
    }]).select().single()
    if(dbError){
      console.error('SUPABASE INSERT ERROR:', dbError)
      // DB 실패해도 메일은 보내기 위해 계속 진행
    }
    // 2. 메일 발송
    let email_sent = false, email_error = null
    try{
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD }
      })
      await transporter.sendMail({
        from: `"JAPANGOLFMNA" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER,
        subject: `[일본골프장 문의] ${name} / ${budget} / ${region}`,
        html: `<h3>신규 문의</h3><p>이름: ${name}<br>연락처: ${phone}<br>이메일: ${email}<br>예산: ${budget}<br>권역: ${region}<br>법인: ${company_type}<br>내용: ${message}</p>`
      })
      email_sent = true
    }catch(e){
      email_error = e.message
      console.error('GMAIL ERROR:', e.message)
    }
    // 3. DB에 메일 결과 업데이트
    if(inserted?.id){
      await supabase.from('inquiries').update({email_sent, email_error}).eq('id', inserted.id)
    }
    return res.status(200).json({success:true, email_sent, email_error, dbError: dbError?.message, id: inserted?.id})
  }catch(e){
    console.error('API ERROR:', e)
    return res.status(200).json({success:false, error:e.message})
  }
}
