
export default async function handler(req,res){
 if(req.method!=='GET') return res.status(405).json({ok:false});
 const {addr,reqKw}=req.query;
 const requestedKw=Number(reqKw)||99;
 try{
  let result=null;
  if(process.env.KEPCO_API_KEY){ console.log('KEPCO key exists - placeholder'); }
  if(!result){
    const dlPercent=5.9; const possible=dlPercent>5;
    result={substation:12500,transformer:3200,dl:850,dlPercent,possible,requestedKw,source:process.env.KEPCO_API_KEY?'mock-with-key':'mock',message:possible?'접속 가능':'DL 부족'};
  }
  res.setHeader('Cache-Control','s-maxage=3600, stale-while-revalidate=300');
  return res.status(200).json(result);
 }catch(e){ return res.status(500).json({ok:false,error:String(e)}); }
}
