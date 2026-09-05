export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS') return res.status(200).end();
  if(req.method!=='POST') return res.status(405).json({error:'POST only'});
  const API_KEY = process.env.META_LLAMA_API_KEY || process.env.LLAMA_API_KEY;
  try{
    const r = await fetch('https://api.llama.com/compat/v1/chat/completions',{
      method:'POST',
      headers:{'Authorization':`Bearer ${API_KEY}`,'Content-Type':'application/json'},
      body: JSON.stringify({
        model:'Llama-4-Maverick-17B-128E-Instruct-FP8',
        messages:[
          {role:'system',content:`너는 GEO 전문 카피라이터. 규칙: 이미지 수정 금지, JSON만 리턴: {"h2":"...","h3":"...","body":"...","bullets":["..."],"layout":"left|right|grid|full"}`},
          {role:'user',content: JSON.stringify(req.body)}
        ]
      })
    });
    const data = await r.json();
    if(data.error) return res.status(r.status).json(data);
    const content = data.choices?.[0]?.message?.content || '{}';
    const jsonStr = content.replace(/```json|```/g,'').trim();
    return res.status(200).json(JSON.parse(jsonStr));
  }catch(e){ return res.status(500).json({error:e.message});}
}
