export default async function handler(req,res){
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Cache-Control","no-store");
  try{
    const r=await fetch("https://tdb-cron.bukikorea.workers.dev/",{cache:"no-store"});
    if(r.ok){const t=await r.text(); return res.status(200).json(JSON.parse(t));}
  }catch(e){}
  return res.status(200).json([]);
}