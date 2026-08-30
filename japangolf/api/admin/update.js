import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method!== 'PATCH' && req.method!== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const body = req.body
    const { id, linked_listing, linked_listing_id,...rest } = body

    if (!id) return res.status(400).json({ error: 'id required' })

    let updateData = {...rest, updated_at: new Date().toISOString() }

    // linked_listing 처리 - 이름이 오면 그대로 저장 + id도 찾아서 저장
    if (linked_listing) {
      updateData.linked_listing = linked_listing
      // 이름으로 id 찾기 시도
      const { data: listing } = await supabase
       .from('golf_listings')
       .select('id')
       .eq('name', linked_listing)
       .single()
      if (listing?.id) {
        updateData.linked_listing_id = listing.id
      }
    }
    if (linked_listing_id) {
      updateData.linked_listing_id = linked_listing_id
    }

    // 빈 값 정리
    Object.keys(updateData).forEach(k => {
      if (updateData[k] === '' || updateData[k] === undefined) {
        delete updateData[k]
      }
    })

    console.log('UPDATE:', id, updateData)

    const { data, error } = await supabase
     .from('inquiries')
     .update(updateData)
     .eq('id', id)
     .select()
     .single()

    if (error) {
      console.error('UPDATE ERROR:', error)
      throw error
    }

    return res.status(200).json({ success: true, data })
  } catch (e) {
    console.error('ADMIN UPDATE FAILED:', e.message)
    return res.status(500).json({
      success: false,
      error: e.message,
      hint: 'linked_listing은 이제 text 컬럼에 저장됩니다. SQL 1)번 실행했는지 확인'
    })
  }
}
