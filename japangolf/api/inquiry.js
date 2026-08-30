
import nodemailer from 'nodemailer'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'})
  try{
    const {name,phone,email,budget,region,company_type,message,source,page} = req.body
    if(!name || !phone || !email){
      return res.status(400).json({success:false, error:'name/phone/email required'})
    }
    // 1. DB 먼저 저장 - 대시보드에 보이는 핵심
    let inserted = null
    let dbError = null
    try{
      const {data, error} = await supabase.from('inquiries').insert([{
        name, phone, email, budget, region, company_type, message,
        source: source||'japangolfmna',
        page: page||'GK-vs-KK',
        email_sent: false,
        status: 'new'
      }]).select().single()
      if(error) throw error
      inserted = data
    }catch(e){
      dbError = e.message
      console.error('SUPABASE INSERT ERROR:', e.message)
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
        replyTo: email,
        subject: `[일본골프장 문의] ${name} / ${budget} / ${region}`,
        html: `<h3>신규 문의 (일본 전용)</h3><p>이름: ${name}<br>연락처: ${phone}<br>이메일: ${email}<br>예산: ${budget}<br>권역: ${region}<br>법인: ${company_type}<br>내용: ${message||''}</p><p>DB ID: ${inserted?.id||'insert failed'}</p>`
      })
      email_sent = true
    }catch(e){
      email_error = e.message
      console.error('GMAIL ERROR:', e.message)
    }
    // 3. DB에 메일 결과 업데이트
    if(inserted?.id){
      try{
        await supabase.from('inquiries').update({email_sent, email_error}).eq('id', inserted.id)
      }catch(e){
        console.error('UPDATE email_sent failed', e.message)
      }
    }
    return res.status(200).json({success:true, email_sent, email_error, dbError, id: inserted?.id})
  }catch(e){
    console.error('API ERROR:', e)
    return res.status(200).json({success:false, error:e.message})
  }
}
