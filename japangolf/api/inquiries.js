import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
export default async function handler(req,res){
  try{
    const {data,error} = await supabase.from('inquiries').select('*').order('created_at',{ascending:false}).limit(200)
    if(error) throw error
    return res.status(200).json({success:true, data})
  }catch(e){
    console.error('INQUIRIES FETCH ERROR:', e.message)
    return res.status(500).json({success:false, error:e.message, hint:'SUPABASE_URL/SERVICE_ROLE_KEY 확인, 테이블 존재 여부 확인'})
  }
}
