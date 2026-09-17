export default async function handler(req,res){
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Cache-Control","no-store");
  try{
    const r = await fetch("https://tdb-cron.bukikorea.workers.dev/",{cache:"no-store"});
    if(r.ok){
      const t = await r.text();
      const j = JSON.parse(t);
      return res.status(200).json(Array.isArray(j)?j:[]);
    }
  }catch(e){ console.error(e); }
  return res.status(200).json([]);
}