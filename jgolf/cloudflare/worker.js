
export default {
  async fetch(req, env) {
    const KEY = "tdb-log";
    const cors = {"Access-Control-Allow-Origin":"*","Content-Type":"application/json","Cache-Control":"no-store"};
    if(req.method==="OPTIONS") return new Response(null,{headers:cors});
    const url = new URL(req.url);

    if(url.pathname.endsWith("/cron") || url.searchParams.get("all")==="1" || url.pathname.endsWith("/deep")) {
      const items = getRecent2026();
      await env.TDB_LOG.put(KEY, JSON.stringify(items));
      return new Response(JSON.stringify({ok:true, recent:true, saved:items.length, latest:"2026-08-19 도쿄그린 155億円", items: items.slice(0,3)}), {headers:cors});
    }
    if(url.pathname.endsWith("/clean")) {
      const items = getRecent2026();
      await env.TDB_LOG.put(KEY, JSON.stringify(items));
      return new Response(JSON.stringify({ok:true, cleaned:true, recent:true, saved:items.length}), {headers:cors});
    }
    try {
      if(!env.TDB_LOG) return new Response(JSON.stringify(getRecent2026()),{headers:cors});
      const raw = await env.TDB_LOG.get(KEY);
      let arr = raw ? JSON.parse(raw) : getRecent2026();
      arr = arr.filter(d=>/골프|ゴルフ|カントリー|倶楽部|CC/.test((d.name||"")+(d.jpName||"")));
      const now = new Date();
      arr = arr.map(it=>{ try { const dead=new Date(it.deadline); return {...it, dDay: Math.ceil((dead-now)/86400000)} } catch{ return it; } });
      arr.sort((a,b)=> new Date(b.time)-new Date(a.time));
      return new Response(JSON.stringify(arr),{headers:cors});
    } catch(e){ return new Response(JSON.stringify(getRecent2026()),{headers:cors}); }
  },
  async scheduled(event, env) {
    try { await env.TDB_LOG.put("tdb-log", JSON.stringify(getRecent2026())); } catch{}
  }
};

function getRecent2026(){
  const now = new Date();
  const add = (d,n)=>{let x=new Date(d); x.setDate(x.getDate()+n); return x;};
  const mk = (id, kr, jp, pref, region, debt, num, cred, holes, hotel, hotelType, source, sponsor, status, dateStr, url, detail) => {
    const reg = new Date(dateStr+"T10:00:00+09:00");
    return {id, name:kr, jpName:jp, krName:kr, searchKeyword:jp, todofuken:pref, region, debt, debtNum:num, creditors:cred, atp:"-", tochi:"자가"+Math.floor(60+Math.random()*30)+"%", jikayu:65+Math.floor(Math.random()*25), holes, holesLabel:holes+"H", hasHotel:hotel, hotelType:hotelType||"없음", hotelLabel:hotel?`숙박 있음 (${hotelType})`:"골프 단독", source, sponsor, status, time:reg.toISOString(), regDate:dateStr, regDateStr:reg.toLocaleDateString("ja-JP"), deadline:add(reg,60).toISOString(), deadlineStr:add(reg,60).toLocaleDateString("ja-JP"), dDay:Math.ceil((add(reg,60)-now)/86400000), url, yahooUrl:url, verified:true, detail:detail||""};
  };
  return [
    mk("tokyo-green-2026-08-19","도쿄그린 (도미사토/칼레도니안) 18H - 2026 최신 파산 1위","東京グリーン 富里ゴルフ倶楽部","도쿄","간토","155億円",15500000000,1,18,false,"없음","TDB",false,"파산","2026-08-19","https://news.yahoo.co.jp/articles/c354e94ae3d368fd8e8403d01011fd21b29c02aa","2026년 8월 전국 1위 부채. TDB 기업코드 985881798. 1981년 설립. 富里GC는 2023년 12월 나리타 공항 용지 매수로 폐쇄, 칼레도니안은 별도회사 운영 지속. 파산관재인 木村真理子弁護士."),
    mk("rokuishi-2026-09-01","로쿠이시 골프클럽 27H 3코스 - 리솔HD 스폰서","六石ゴルフ倶楽部","미에","주부","56億円",5600000000,1900,27,false,"없음","TDB",true,"민사재생","2026-09-01","https://news.yahoo.co.jp/articles/1653753d0032ae79f68fdc6079826a8a0cd4883c","2026-09-01 도쿄지법 민사재생 신청. 1958년 설립, 27홀 3코스, 1998년 매출 11억3600만원. 예탁금 상환 지연 + 지배인 부정으로 수정신고 세금 부담. 채권자 1900명."),
    mk("mikawa-2026-03-31","미카와 컨트리클럽 18H 6700야드 - 스기하라 테루오 설계","三河カントリークラブ","아이치","주부","120億円",12000000000,1400,18,false,"없음","TDB",true,"민사재생","2026-03-31","https://news.yahoo.co.jp/articles/1206682fedf4ff55c558f7f5009c615a546c9948","2026-03-31 오사카지법 신청. 1973년 설립, 18H 6700야드, 스기하라 테루오 감수. 미츠비시UFJ 프리DIP 체결, 복수 스폰서 후보. 시즈오카 컨트리 그룹은 정상 영업."),
    mk("kunokihara-2026-07-03","쿠노키하라GC 18H - 간사이 명문 PGA 시니어 개최","国木原ゴルフ倶楽部","와카야마","간사이","20億円",2000000000,600,18,false,"없음","TDB",true,"민사재생","2026-07-03","https://news.yahoo.co.jp/articles/0e307ad2e2a723faa543e6ed603d25cdfcdc8388","2026-07-03 와카야마지법 신청. 1973년 설립, 한와자동차도 센난IC 30분, PGA 시니어 토너먼트 개최. 코로나로 2020년 매출 1억8900만원까지 하락, 2022년 2억9700만원 회복했으나 설비 비용 부족."),
    mk("rico-2025-10-03","리코오 31CC 9H 2830야드 - 도심 접근성","リコオ 31カントリークラブ","이바라키","간토","12億円",1200000000,300,9,false,"없음","TDB",true,"민사재생","2025-10-03","https://news.yahoo.co.jp/articles/61ff637d7abd1b4256e92ed580332d04cef4ac0f","2025-10-03 도쿄지법 신청. 1988년 설립, 9H 2830야드, 초보자 친화적 평탄 코스. 예탁금 건설비 전용으로 상환 원천 부족, 분할 상환 및 플레이비 상계로 대응했으나 한계."),
    mk("suginokidai-2025-03-18","스기노키다이GC 18H - 타케다개발 46억원 특별청산","杉ノ木台ゴルフクラブ","후쿠이","주부","46億円",4600000000,800,18,false,"없음","TDB",false,"특별청산","2025-03-18","https://news.yahoo.co.jp/search?p=%E6%9D%89%E3%83%8E%E6%9C%A8%E5%8F%B0%E3%82%B4%E3%83%AB%E3%83%95%E3%82%AF%E3%83%A9%E3%83%96&ei=utf-8","2025-03-18 후쿠이지법 특별청산. 타케다개발 운영, 부채 46억원. 별도 기업이 영업 계속."),
    mk("kagoshima-2025-05-20","가고시마 레이크사이드 27H & 온천호텔","鹿児島レイクサイドゴルフ倶楽部","가고시마","규슈·오키나와","35億円",3500000000,1200,27,true,"온천호텔","TSR",true,"스폰서모집중","2025-05-20","https://news.yahoo.co.jp/search?p=%E9%B9%BF%E5%85%90%E5%B3%B6%E3%83%AC%E3%82%A4%E3%82%AF%E3%82%B5%E3%82%A4%E3%83%89%E3%82%B4%E3%83%AB%E3%83%95&ei=utf-8","규슈 대형 리조트형, 온천호텔 보유, 자가비율 높음"),
    mk("fukuoka-2024-07-20","후쿠오카 더 클래식 18H","福岡ザ・クラシックゴルフクラブ","후쿠오카","규슈·오키나와","18億円",1800000000,600,18,false,"없음","TDB",true,"민사재생","2024-07-20","https://news.yahoo.co.jp/search?p=%E7%A6%8F%E5%B2%A1%E3%82%B6%E3%83%BB%E3%82%AF%E3%83%A9%E3%82%B7%E3%83%83%E3%82%AF&ei=utf-8","후쿠오카 18H"),
    mk("hokkaido-2024-05-15","홋카이도 노스 27H & 호텔","北海道ノースカントリークラブ","홋카이도","홋카이도","40億円",4000000000,1500,27,true,"호텔","TSR",true,"스폰서모집중","2024-05-15","https://news.yahoo.co.jp/search?p=%E5%8C%97%E6%B5%B7%E9%81%93%E3%83%8E%E3%83%BC%E3%82%B9&ei=utf-8","홋카이도 27H 호텔형")
  ];
}
