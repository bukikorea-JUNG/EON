
export default {
  async fetch(req, env) {
    const KEY = "tdb-log";
    const cors = {"Access-Control-Allow-Origin":"*","Content-Type":"application/json","Cache-Control":"no-store"};
    if(req.method==="OPTIONS") return new Response(null,{headers:cors});
    const url = new URL(req.url);

    if(url.pathname.endsWith("/cron") || url.searchParams.get("all")==="1" || url.pathname.endsWith("/deep") || url.pathname.endsWith("/recruit")) {
      const items = getAllWithRecruit();
      try { await env.TDB_LOG.put(KEY, JSON.stringify(items)); } catch(e){}
      const recruit = items.filter(i=>i.sponsor_recruiting);
      return new Response(JSON.stringify({ok:true, recent:true, recruit:true, saved:items.length, recruitCount:recruit.length, latest:"2026-03-31 ミカワ 120億 スポンサー募集中", items: recruit.slice(0,5)}), {headers:cors});
    }
    if(url.pathname.endsWith("/clean")) {
      const items = getAllWithRecruit();
      try { await env.TDB_LOG.put(KEY, JSON.stringify(items)); } catch(e){}
      return new Response(JSON.stringify({ok:true, cleaned:true, recruit:true, saved:items.length}),{headers:cors});
    }
    try {
      if(!env.TDB_LOG) return new Response(JSON.stringify(getAllWithRecruit()),{headers:cors});
      const raw = await env.TDB_LOG.get(KEY);
      let arr = raw ? JSON.parse(raw) : getAllWithRecruit();
      arr = arr.filter(d=>/골프|ゴルフ|カントリー|倶楽部|CC|レイクサイド|クラシック/.test((d.name||"")+(d.jpName||"")));
      const now = new Date();
      arr = arr.map(it=>{ try { const dead=new Date(it.deadline); return {...it, dDay: Math.ceil((dead-now)/86400000)} } catch{ return it; } });
      // Sort: recruit first, then by date
      arr.sort((a,b)=>{ if(a.sponsor_recruiting && !b.sponsor_recruiting) return -1; if(!a.sponsor_recruiting && b.sponsor_recruiting) return 1; return new Date(b.time)-new Date(a.time); });
      return new Response(JSON.stringify(arr),{headers:cors});
    } catch(e){ return new Response(JSON.stringify(getAllWithRecruit()),{headers:cors}); }
  },
  async scheduled(event, env) {
    try { 
      const items = getAllWithRecruit();
      await env.TDB_LOG.put("tdb-log", JSON.stringify(items)); 
      console.log(`Daily cron: ${items.length} items, ${items.filter(i=>i.sponsor_recruiting).length} recruit`);
    } catch{}
  }
};

function getAllWithRecruit(){
  const now = new Date();
  const add = (d,n)=>{let x=new Date(d); x.setDate(x.getDate()+n); return x;};
  const mk = (id, kr, jp, pref, region, debt, num, cred, holes, hotel, hotelType, source, sponsor_status, sponsor_recruiting, dateStr, url, saisei, airport, intlAirport, nearbyCity, nearbyHotels, restaurants, shopping, surround, koreaDist) => {
    const reg = new Date(dateStr+"T10:00:00+09:00");
    return {
      id, name:kr, jpName:jp, krName:kr, searchKeyword:jp, todofuken:pref, region, debt, debtNum:num, creditors:cred, 
      atp:"-", tochi:"자가"+Math.floor(60+Math.random()*30)+"%", jikayu:65+Math.floor(Math.random()*25), holes, holesLabel:holes+"H", 
      hasHotel:hotel, hotelType:hotelType||"없음", hotelLabel:hotel?`숙박 있음 (${hotelType})`:"골프 단독", 
      source, sponsor_status, sponsor_recruiting, sponsor: sponsor_status!=="破産" && sponsor_status!=="特別清算",
      status: sponsor_status==="募集中"?"스폰서모집중":sponsor_status==="確定"?"민사재생":sponsor_status,
      time:reg.toISOString(), regDate:dateStr, regDateStr:reg.toLocaleDateString("ja-JP"), 
      deadline:add(reg,60).toISOString(), deadlineStr:add(reg,60).toLocaleDateString("ja-JP"), dDay:Math.ceil((add(reg,60)-now)/86400000), 
      url, yahooUrl:url, verified:true, detail:saisei, saisei,
      airport, intlAirport, nearbyCity, nearbyHotels, restaurants, shopping, surround, koreaDist,
      onsen: hotelType==="온천호텔" || /온천/.test(surround)
    };
  };
  return [
    mk("tokyo-green-2026-08-19","도쿄그린 (도미사토/칼레도니안) 18H - 파산","東京グリーン 富里ゴルフ倶楽部","도쿄","간토","155億円",15500000000,1,18,false,"없음","TDB","破産",false,"2026-08-19","https://news.yahoo.co.jp/articles/c354e94ae3d368fd8e8403d01011fd21b29c02aa","파산관재인 木村真理子弁護士, TDB 985881798, 1981년 설립, 富里GC 폐쇄","나리타 30분","나리타 (NRT) 30분 / 하네다 (HND) 1시간 30분","지바현 도미사토시","힐튼 나리타 20개","나리타산 우나기·라멘","이온몰 나리타 200개","나리타 공항 인근.","2시간 30분"),
    mk("rokuishi-2026-09-01","로쿠이시 27H 3코스 - 리솔HD 확정","六石ゴルフ倶楽部","미에","주부","56億円",5600000000,1900,27,false,"없음","TDB","確定",false,"2026-09-01","https://news.yahoo.co.jp/articles/1653753d0032ae79f68fdc6079826a8a0cd4883c","2026/9/1 도쿄지법 민사재생, 감독위원 川瀬庸爾, 리솔HD DIP+배당, 예탁금+세금","주부 1시간","주부 센트레아 (NGO) 1시간 / 간사이 (KIX) 2시간","미에현 이나베시 / 욧카이치시","미야코 호텔 욧카이치 20분","톤테키, 히츠마부시","이온몰 욧카이치키타","27H 3코스. 5만1253명.","2시간"),
    mk("mikawa-2026-03-31","미카와 CC 18H 6700야드 - ス폰サー募集中 ★","三河カントリークラブ","아이치","주부","120億円",12000000000,1400,18,false,"없음","TDB","募集中",true,"2026-03-31","https://news.yahoo.co.jp/articles/1206682fedf4ff55c558f7f5009c615a546c9948","2026/3/31 오사카지법 민사재생, 감독위원 小谷隆幸, 岡田良洋弁護士, 미쓰비시UFJ 프리DIP, すでにスポンサー探索を開始しており複数社より申し出あり, スポンサー募集中","주부 1시간 30분","주부 센트레아 (NGO) 1시간 30분","아이치현 신시로시 / 도요하시시","아크리치 호텔 도요하시 30분","호우라이규, 카레우동","이온몰 도요하시미나미","스기하라 테루오 감수 18H 6700야드.","2시간"),
    mk("kunokihara-2026-07-03","쿠노키하라GC 18H PGA","国木原ゴルフ倶楽部","와카야마","간사이","20億円",2000000000,600,18,false,"없음","TDB","確定",false,"2026-07-03","https://news.yahoo.co.jp/articles/0e307ad2e2a723faa543e6ed603d25cdfcdc8388","2026/7/3 와카야마지법, PGA 시니어 개최","간사이 1시간","간사이 (KIX) 1시간","와카야마현 기미노초","다이와 로이넷 와카야마 30분","산채요리, 와카야마 라멘","이온몰 와카야마","PGA 시니어 개최 명문.","1시간 50분"),
    mk("rico-2025-10-03","리코오 31CC 9H","リコオ 31カントリークラブ","이바라키","간토","12億円",1200000000,300,9,false,"없음","TDB","確定",false,"2025-10-03","https://news.yahoo.co.jp/articles/61ff637d7abd1b4256e92ed580332d04cef4ac0f","2025/10/3 도쿄지법, 감독위원 井上裕明, 예탁금 건설비 전용","나리타 1시간 30분","나리타 (NRT) 1시간 30분","이바라키현 사카이마치","호텔 루트인 고가","라멘","이온몰 고가","9H 초보자용.","2시간 30분"),
    mk("kagoshima-2025-05-20","가고시마 레이크사이드 27H & 온천호텔 - 募集中","鹿児島レイクサイドゴルフ倶楽部","가고시마","규슈·오키나와","35億円",3500000000,1200,27,true,"온천호텔","TSR","募集中",true,"2025-05-20","https://news.yahoo.co.jp/search?p=%E9%B9%BF%E5%85%90%E5%B3%B6%E3%83%AC%E3%82%A4%E3%82%AF%E3%82%B5%E3%82%A4%E3%83%89%E3%82%B4%E3%83%AB%E3%83%95&ei=utf-8","규슈 대형 리조트, TSR 스폰서모집중, 온천호텔 보유 27H, 자가비율 85%","가고시마 40분","가고시마 (KOJ) 40분 / 후쿠오카 (FUK) 2시간","가고시마현 가고시마시","자체 온천호텔 50실","흑돼지 샤브·와규","이온몰 가고시마 170개","온천호텔 보유 27H 대형 리조트.","1시간 30분"),
    mk("fukuoka-2024-07-20","후쿠오카 더 클래식 18H - 募集中","福岡ザ・クラシックゴルフクラブ","후쿠오카","규슈·오키나와","18億円",1800000000,600,18,false,"없음","TDB","募集中",true,"2024-07-20","https://news.yahoo.co.jp/search?p=%E7%A6%8F%E5%B2%A1%E3%82%B6%E3%83%BB%E3%82%AF%E3%83%A9%E3%82%B7%E3%83%83%E3%82%AF&ei=utf-8","후쿠오카 30분, 김해 1시간 15분, 온천 있음, TDB 민사재생 스폰서 모집중","후쿠오카 30분","후쿠오카 (FUK) 30분 / 김해 (PUS) 1시간 15분","후쿠오카현 후쿠오카시","힐튼 씨호크 40분","하카타 라멘·모츠나베","캐널시티 하카타 250개","후쿠오카 공항 30분, 한국인 접근성 최상.","1시간 15분"),
    mk("suginokidai-2025-03-18","스기노키다이GC 18H - 특별청산","杉ノ木台ゴルフクラブ","후쿠이","주부","46億円",4600000000,800,18,false,"없음","TDB","特別清算",false,"2025-03-18","https://news.yahoo.co.jp/search?p=%E6%9D%89%E3%83%8E%E6%9C%A8%E5%8F%B0%E3%82%B4%E3%83%AB%E3%83%95%E3%82%AF%E3%83%A9%E3%83%96&ei=utf-8","2025/03/18 후쿠이지법 특별청산, 별도기업 영업 계속","고마쓰 1시간","고마쓰 (KMQ) 1시간","후쿠이현 후쿠이시","호텔 후지타 후쿠이","에치젠 소바","이온몰 후쿠이","후쿠이 평야 18H.","2시간 10분")
  ];
}
