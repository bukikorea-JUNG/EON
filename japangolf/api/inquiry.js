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
    const { name, phone, email, budget, region, source, page } = req.body

    if (!name || !phone || !email || !budget) {
      return res.status(400).json({ error: '필수 항목 누락 (이름/연락처/이메일/예산)' })
    }

    const { data, error } = await supabase
      .from('inquiries')
      .insert([{
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        budget,
        region: region || null,
        source: source || 'japangolfmna',
        page: page || 'GK-vs-KK',
        status: 'new'
      }])
      .select('id, created_at')
      .single()

    if (error) throw error

    return res.status(200).json({ success: true, id: data.id })

  } catch (err) {
    console.error('inquiry error:', err)
    return res.status(500).json({ error: err.message || '서버 오류' })
  }
}
