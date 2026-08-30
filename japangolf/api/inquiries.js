import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // 간단한 인증 - 쿼리 파라미터나 헤더로 보호 (필요시 강화)
  // const auth = req.headers['authorization']
  // if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200)

    if (error) throw error

    return res.status(200).json({ success: true, data })
  } catch (err) {
    console.error('inquiries fetch error:', err)
    return res.status(500).json({ error: err.message })
  }
}
