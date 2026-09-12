
export default async function handler(req,res){
 if(req.method!=='POST') return res.status(405).json({ok:false});
 try{
  const {company,contact,address,area,unitPrice,message}=req.body||{};
  if(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY){
    const {createClient}=await import('@supabase/supabase-js');
    const supabase=createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    await supabase.from('inquiries').insert([{company,contact,address,area:Number(area)||0,unit_price:Number(unitPrice)||40000,message,created_at:new Date().toISOString()}]);
  }
  return res.status(200).json({ok:true});
 }catch(e){ console.error(e); return res.status(500).json({ok:false,error:String(e)}); }
}
