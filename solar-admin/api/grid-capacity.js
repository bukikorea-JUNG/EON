
// /api/grid-capacity.js - Vercel Serverless Function
// Env required: KEPCO_API_KEY (한전 파워플래너 또는 KDN 연계 키)
// Cache: 1시간

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }
  const { addr, sido, sigungu, reqKw } = req.query;
  const requestedKw = Number(reqKw) || 99;

  try {
    let result = null;

    // 실제 한전 API 호출 (키 있으면)
    if (process.env.KEPCO_API_KEY) {
      try {
        // 실제 엔드포인트는 계약한 한전 API에 맞게 교체 필요
        // 예시: 한전 파워플래너 계통용량 조회
        // const kepcoRes = await fetch(`https://powerplanner.kepco.co.kr/api/grid?addr=${encodeURIComponent(addr||'')}&sido=${sido||''}&sigungu=${sigungu||''}`, {
        //   headers: { Authorization: `Bearer ${process.env.KEPCO_API_KEY}`, 'Content-Type':'application/json' }
        // });
        // const kepcoData = await kepcoRes.json();
        // result = { substation: kepcoData.substation, transformer: kepcoData.transformer, dl: kepcoData.dl, dlPercent: kepcoData.dlPercent, possible: kepcoData.possible }

        // 현재는 키가 있어도 실제 API 스펙 미확정이므로 모의 + 키 존재 로깅
        console.log('KEPCO_API_KEY exists, real API call placeholder - using mock until endpoint confirmed');
        result = null; // 아래 mock으로 fallback, 실제 연동시 위 주석 해제
      } catch (e) {
        console.error('KEPCO API call failed, fallback to mock', e);
      }
    }

    // Mock fallback (개발/키 없을 때) - 프론트 목업과 동일한 12,500/3,200/850 5.9% 구조
    if (!result) {
      // DL 5.9% = 간신히 가능, 5% 이하 불가 로직 반영
      const dlPercent = 5.9; // 모의: 평택/화성 평균, 실제로는 한전 데이터
      const possible = dlPercent > 5;
      const remainingDl = 850; // kW
      result = {
        substation: 12500, // 변전소 kW
        transformer: 3200, // 주변압기 kW
        dl: remainingDl,
        dlPercent: dlPercent,
        possible: possible,
        requestedKw: requestedKw,
        source: process.env.KEPCO_API_KEY ? 'mock-with-key' : 'mock',
        message: possible ? '접속 가능' : 'DL 용량 부족 - 저압 분산(99kW 2개) 권장'
      };
    }

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=300');
    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: String(e) });
  }
}
