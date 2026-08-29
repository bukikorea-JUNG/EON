export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const { metroCd = '41', cityCd = '553' } = req.query;
  const API_KEY = process.env.KEPCO_API_KEY || 'OyI2AGBsFpYqCkJ569TxzVmWrs346x1xQfBIv6d4';
  const url = `https://bigdata.kepco.co.kr/openapi/v1/dispersedGeneration.do?apiKey=${API_KEY}&metroCd=${metroCd}&cityCd=${cityCd}&returnType=json`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`KEPCO API error: ${response.status}`);
    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');
    return res.status(200).json({ success: true, metroCd, cityCd, data, proxied: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message, metroCd, cityCd, fallback: true });
  }
}
