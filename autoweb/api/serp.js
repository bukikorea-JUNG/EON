export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS') return res.status(200).end();
  const {keyword}=req.body||{};
  const auth=Buffer.from(`${process.env.DATAFORSEO_LOGIN}:${process.env.DATAFORSEO_PASSWORD}`).toString('base64');
  const r=await fetch('https://api.dataforseo.com/v3/serp/google/organic/live/advanced',{
    method:'POST',
    headers:{Authorization:`Basic ${auth}`,'Content-Type':'application/json'},
    body:JSON.stringify([{keyword, location_code:2410, language_code:'ko'}])
  });
  const data=await r.json();
  return res.status(200).json(data);
}
