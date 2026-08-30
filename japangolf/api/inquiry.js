import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { name, phone, email, budget, region, company_type, message, source, page } = req.body

    if (!name || !phone || !email || !budget) {
      return res.status(400).json({ error: '필수 항목 누락 (이름/연락처/이메일/예산)' })
    }

    // 컬럼명 정확히 일치시키기 - 모두 소문자
    const insertData = {
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: String(email).trim().toLowerCase(),
      budget: String(budget),
      region: region ? String(region) : null,
      company_type: company_type ? String(company_type) : null,
      message: message ? String(message) : null,
      source: source || 'japangolfmna',
      page: page || 'GK-vs-KK',
      status: 'new'
    }

    console.log('Inserting:', insertData)

    const { data, error } = await supabase
      .from('inquiries')
      .insert([insertData])
      .select('id, created_at')
      .single()

    if (error) {
      console.error('Supabase error:', error)
      // 스키마 캐시 에러면 힌트 제공
      if (error.message.includes('schema cache') || error.message.includes('column')) {
        return res.status(500).json({ 
          error: `스키마 오류: ${error.message}. Supabase에서 SQL Editor로 스키마를 다시 생성해주세요.`,
          hint: 'NOTIFY pgrst, \'reload schema\' 실행 필요'
        })
      }
      throw error
    }

    return res.status(200).json({ success: true, id: data.id })

  } catch (err) {
    console.error('inquiry error:', err)
    return res.status(500).json({ error: err.message || '서버 오류' })
  }
}
