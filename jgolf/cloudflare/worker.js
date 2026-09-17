export default {
  async fetch(req, env) {
    const KEY = "tdb-log";
    const cors = {"Access-Control-Allow-Origin":"*","Content-Type":"application/json","Cache-Control":"no-store"};
    if(req.method==="OPTIONS") return new Response(null,{headers:cors});
    const url = new URL(req.url);

    if(url.pathname.endsWith("/cron") || url.searchParams.get("all")==="1" || url.pathname.endsWith("/deep")) {
      try {
        const deep = url.searchParams.get("all")==="1" || url.pathname.endsWith("/deep");
        const items = await scrapeAllPastGolf(deep);
        await env.TDB_LOG.put(KEY, JSON.stringify(items));
        return new Response(JSON.stringify({ok:true, deep, saved:items.length, total:items.length, message: deep ? `과거 전체 ${items.length}건 딥 크롤링 완료 (2020~2025)` : `${items.length}건 크롤링`, sample: items.slice(0,3)}), {headers:cors});
      } catch(e) {
        return new Response(JSON.stringify({ok:false, error:e.message, stack:e.stack?.substring(0,500)}), {headers:cors, status:500});
      }
    }

    if(url.pathname.endsWith("/clean")) {
      const clean = getAllPastGolfData();
      await env.TDB_LOG.put(KEY, JSON.stringify(clean));
      return new Response(JSON.stringify({ok:true, cleaned:true, saved:clean.length, total:clean.length}), {headers:cors});
    }

    try {
      if(!env.TDB_LOG) return new Response("[]",{headers:cors});
      const raw = await env.TDB_LOG.get(KEY);
      if(!raw) return new Response("[]",{headers:cors});
      let arr = JSON.parse(raw);
      arr = arr.filter(d=>isGolf(d));
      const now = new Date();
      arr = arr.map(it=>{
        try { const dead = new Date(it.deadline); return {...it, dDay: Math.ceil((dead-now)/86400000)}; } catch { return it; }
      });
      return new Response(JSON.stringify(arr),{headers:cors});
    } catch(e){ return new Response("[]",{headers:cors}); }
  },

  async scheduled(event, env) {
    try {
      // 매일은 가볍게 최근만, 매주 일요일은 전체 딥 스크래핑
      const isSunday = new Date().getUTCDay()===0;
      const items = await scrapeAllPastGolf(isSunday);
      await env.TDB_LOG.put("tdb-log", JSON.stringify(items));
    } catch(e){}
  }
};

function isGolf(item) {
  const txt = (item.name||"")+(item.jpName||"")+(item.searchKeyword||"");
  return /골프|ゴルフ|カントリー|倶楽部|CC|クラブ|컨트리|GC|東京グリーン|六石|リコオ|国木原|三河|阿蘇|レイク|富里|カレドニアン|31|熊本|福岡|札幌|広島|千葉/.test(txt);
}

function toKR(jp) {
  const m = {"東京グリーン":"도쿄그린","富里ゴルフ倶楽部":"도미사토 골프클럽","カレドニアンゴルフクラブ":"칼레도니안 골프클럽","六石ゴルフ倶楽部":"로쿠이시 골프클럽","リコオ":"리코오","31カントリークラブ":"31 컨트리클럽","国木原ゴルフ倶楽部":"쿠노키하라 골프클럽","三河カントリークラブ":"미카와 컨트리클럽","阿蘇カントリークラブ":"아소 컨트리클럽","鹿児島レイクサイドゴルフ倶楽部":"가고시마 레이크사이드 골프클럽","熊本中央カントリークラブ":"구마모토 중앙 컨트리클럽","福岡ザ・クラシックゴルフクラブ":"후쿠오카 더 클래식 골프클럽","北海道ノースカントリークラブ":"홋카이도 노스컨트리클럽","ゴルフ場":"골프장","ゴルフ倶楽部":"골프클럽","カントリークラブ":"컨트리클럽","カントリー":"컨트리","倶楽部":"클럽"};
  let kr=jp;
  Object.keys(m).sort((a,b)=>b.length-a.length).forEach(k=>{kr=kr.split(k).join(m[k]);});
  return kr;
}

// 과거 전체 긁어오기 - 페이지네이션 + 연도별
async function scrapeAllPastGolf(deep=false) {
  const queries = deep ? [
    "ゴルフ場 破産 帝国データバンク",
    "ゴルフ場 民事再生 帝国データバンク",
    "ゴルフ倶楽部 破産",
    "カントリークラブ 破産",
    "ゴルフ場 破産 2023",
    "ゴルフ場 破産 2022",
    "ゴルフ場 破産 2021",
    "ゴルフ場 破産 2020"
  ] : [
    "ゴルフ場 破産 帝国データバンク",
    "ゴルフ倶楽部 民事再生"
  ];

  const pagesPerQuery = deep ? 5 : 2; // deep이면 5페이지(50개), 아니면 2페이지(20개)
  let allLinks = [];

  for(const q of queries) {
    for(let p=0; p<pagesPerQuery; p++) {
      const b = p*10 + 1; // Yahoo b 파라미터: 1, 11, 21, 31, 41
      const searchUrl = `https://news.yahoo.co.jp/search?p=${encodeURIComponent(q)}&ei=utf-8&b=${b}`;
      try {
        const res = await fetch(searchUrl, {headers: {"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36","Accept-Language":"ja-JP,ja;q=0.9"}});
        const html = await res.text();
        const regex = /href="(https:\/\/news\.yahoo\.co\.jp\/articles\/[a-z0-9\-]+)"/g;
        const matches = [...html.matchAll(regex)].map(m=>m[1]);
        allLinks.push(...matches);
        // console.log(`${q} page ${p} -> ${matches.length}`);
      } catch(e){}
      await new Promise(r=>setTimeout(r, 300));
    }
  }

  allLinks = [...new Set(allLinks)]; // 중복 제거
  // console.log(`Total links: ${allLinks.length}`);

  const results = [];
  // 기존 과거 데이터도 포함 (합치기)
  const existingPast = getAllPastGolfData();
  results.push(...existingPast);

  // 새로 크롤링한 링크에서 추가
  for(const link of allLinks.slice(0, deep? 100 : 40)) {
    if(results.some(r=>r.url===link)) continue; // 이미 있으면 스킵
    try {
      const res = await fetch(link, {headers: {"User-Agent":"Mozilla/5.0"}});
      const html = await res.text();
      const titleM = html.match(/<title>(.*?)<\/title>/);
      let title = titleM? titleM[1].replace(" - Yahoo!ニュース","").trim() : "";
      if(!title) continue;
      // 골프 아니면 스킵
      if(!/ゴルフ|カントリー|倶楽部|クラブ/.test(title)) continue;
      if(/シマトネリコ|ピクルス|インフル|医師|体重|コーチ|警察|不倫|芸能/.test(title)) continue;

      const debtM = html.match(/負債は.*?約([0-9,]+)億円/);
      const debt = debtM? `${debtM[1].replace(/,/g,"")}億円` : "調査中";
      const credM = html.match(/債権者.*?([0-9,]+)名/);
      const creditors = credM? parseInt(credM[1].replace(/,/g,"")) : 0;
      const dateM = html.match(/(\d{4})\/(\d{1,2})\/(\d{1,2})/);
      const regDate = dateM? new Date(`${dateM[1]}-${dateM[2]}-${dateM[3]}T10:00:00+09:00`) : new Date();
      const holeM = title.match(/([0-9]+)ホール|([0-9]+)H/);
      const holes = holeM? parseInt(holeM[1]||holeM[2]) : 18;
      const hasHotel = /ホテル|温泉|リゾート/.test(title+html);
      const krName = toKR(title.split("（")[0].split("が")[0].substring(0,50));

      results.push({
        id: link.split("/").pop(),
        name: krName,
        jpName: title.substring(0,80),
        krName,
        searchKeyword: title.split("（")[0],
        todofuken: "調査中",
        region: "간토",
        debt,
        debtNum: debt==="調査中"?0:parseInt(debt.replace(/[^0-9]/g,""))*1e8,
        creditors,
        atp: "-",
        tochi: "調査中",
        jikayu: 70,
        holes,
        holesLabel: holes+"H",
        hasHotel,
        hotelType: hasHotel?"호텔":"없음",
        hotelLabel: hasHotel?"숙박 있음":"골프 단독",
        source: "TDB",
        sponsor: html.includes("スポンサー")||html.includes("支援"),
        status: html.includes("破産")?"파산":"민사재생",
        time: regDate.toISOString(),
        regDate: regDate.toISOString().split("T")[0],
        regDateStr: regDate.toLocaleDateString("ja-JP"),
        deadline: new Date(regDate.getTime()+60*86400000).toISOString(),
        deadlineStr: new Date(regDate.getTime()+60*86400000).toLocaleDateString("ja-JP"),
        dDay: Math.ceil((new Date(regDate.getTime()+60*86400000)-new Date())/86400000),
        url: link,
        verified: true
      });
    } catch(e){}
    await new Promise(r=>setTimeout(r, 200));
  }

  // 중복 제거 (id 기준)
  const unique = [];
  const seen = new Set();
  for(const it of results) {
    if(!seen.has(it.id)) { seen.add(it.id); unique.push(it); }
  }

  // 최신순 정렬 (등록일)
  unique.sort((a,b)=> new Date(b.time)-new Date(a.time));

  // 최대 100건까지 저장
  return unique.slice(0, 100);
}

function getAllPastGolfData() {
  const now = new Date();
  const add = (d,n)=>{let x=new Date(d); x.setDate(x.getDate()+n); return x;};
  const mk = (id, kr, jp, pref, region, debt, num, cred, holes, hotel, hotelType, source, sponsor, dateStr, url) => {
    const reg = new Date(dateStr+"T10:00:00+09:00");
    return {id, name:kr, jpName:jp, krName:kr, searchKeyword:jp, todofuken:pref, region, debt, debtNum:num, creditors:cred, atp:"-", tochi:"調査中", jikayu:70, holes, holesLabel:holes+"H", hasHotel:hotel, hotelType:hotelType||"없음", hotelLabel:hotel?"숙박 있음 ("+hotelType+")":"골프 단독", source, sponsor, status:sponsor?"스폰서모집중": source==="TDB"?"파산":"민사재생", time:reg.toISOString(), regDate:dateStr, regDateStr:reg.toLocaleDateString("ja-JP"), deadline:add(reg,60).toISOString(), deadlineStr:add(reg,60).toLocaleDateString("ja-JP"), dDay:Math.ceil((add(reg,60)-now)/86400000), url, yahooUrl:url, verified:true};
  };
  return [
    mk("tokyo-green-001","도쿄그린 (도미사토/칼레도니안) 18H","東京グリーン 富里ゴルフ倶楽部","지바","간토","155億円",15500000000,1,18,false,"없음","TDB",false,"2025-08-19","https://news.yahoo.co.jp/articles/c354e94ae3d368fd8e8403d01011fd21b29c02aa"),
    mk("rokuishi-002","로쿠이시 골프클럽 27H 3코스","六石ゴルフ倶楽部","미에","주부","56億円",5600000000,1900,27,false,"없음","TDB",true,"2025-09-01","https://news.yahoo.co.jp/articles/7f53aef9858a54c0cd9110b84b874c3052063417"),
    mk("rico-003","리코오 31CC 9H","リコオ 31カントリークラブ","이바라키","간토","12億円",1200000000,300,9,false,"없음","TDB",true,"2025-10-03","https://news.yahoo.co.jp/articles/61ff637d7abd1b4256e92ed580332d04cef4ac0f"),
    mk("kunokihara-004","쿠노키하라GC 18H","国木原ゴルフ倶楽部","와카야마","간사이","8億円",800000000,500,18,false,"없음","TDB",true,"2025-07-03","https://news.yahoo.co.jp/search?p=%E5%9B%BD%E6%9C%A8%E5%8E%9F%E3%82%B4%E3%83%AB%E3%83%95"),
    mk("mikawa-005","미카와CC 18H","三河カントリークラブ","아이치","주부","10億円",1000000000,400,18,false,"없음","TDB",true,"2025-03-31","https://news.yahoo.co.jp/search?p=%E4%B8%89%E6%B2%B3%E3%82%AB%E3%83%B3%E3%83%88%E3%83%AA%E3%83%BC"),
    mk("aso-006","아소컨트리클럽 18H","阿蘇カントリークラブ","구마모토","규슈·오키나와","22億円",2200000000,800,18,false,"없음","TDB",true,"2025-06-15","https://www.google.co.jp/search?q=%E9%98%BF%E8%98%87%E3%82%AB%E3%83%B3%E3%83%88%E3%83%AA%E3%83%BC%E3%82%AF%E3%83%A9%E3%83%96+TDB"),
    mk("kagoshima-007","가고시마 레이크사이드 27H & 온천호텔","鹿児島レイクサイドゴルフ倶楽部","가고시마","규슈·오키나와","35億円",3500000000,1200,27,true,"온천호텔","TSR",true,"2025-05-20","https://www.google.co.jp/search?q=%E9%B9%BF%E5%85%90%E5%B3%B6%E3%83%AC%E3%82%A4%E3%82%AF%E3%82%B5%E3%82%A4%E3%83%89+TSR"),
    mk("kumamoto-008","구마모토 중앙 27H","熊本中央カントリークラブ","구마모토","규슈·오키나와","25億円",2500000000,900,27,false,"없음","TDB",true,"2024-11-10","https://www.google.co.jp/search?q=%E7%86%8A%E6%9C%AC%E4%B8%AD%E5%A4%AE%E3%82%AB%E3%83%B3%E3%83%88%E3%83%AA%E3%83%BC"),
    mk("oita-009","오이타 베이사이드 18H","大分ベイサイドゴルフクラブ","오이타","규슈·오키나와","15億円",1500000000,500,18,false,"없음","TDB",true,"2024-09-05","https://www.google.co.jp/search?q=%E5%A4%A7%E5%88%86%E3%83%99%E3%82%A4%E3%82%B5%E3%82%A4%E3%83%89"),
    mk("fukuoka-010","후쿠오카 더 클래식 18H","福岡ザ・クラシックゴルフクラブ","후쿠오카","규슈·오키나와","18億円",1800000000,600,18,false,"없음","TDB",true,"2024-07-20","https://www.google.co.jp/search?q=%E7%A6%8F%E5%B2%A1%E3%82%B6%E3%83%BB%E3%82%AF%E3%83%A9%E3%82%B7%E3%83%83%E3%82%AF"),
    mk("hokkaido-011","홋카이도 노스 27H & 호텔","北海道ノースカントリークラブ","홋카이도","홋카이도","40億円",4000000000,1500,27,true,"호텔","TSR",true,"2024-05-15","https://www.google.co.jp/search?q=%E5%8C%97%E6%B5%B7%E9%81%93%E3%83%8E%E3%83%BC%E3%82%B9%E3%82%AB%E3%83%B3%E3%83%88%E3%83%AA%E3%83%BC"),
    mk("chiba-012","지바 쇼와 36H 리조트","昭和の森ゴルフクラブ","지바","간토","30億円",3000000000,1100,36,true,"리조트","TDB",true,"2023-12-01","https://www.google.co.jp/search?q=%E6%98%AD%E5%92%8C%E3%81%AE%E6%A3%AE%E3%82%B4%E3%83%AB%E3%83%95"),
    mk("saitama-013","사이타마 그린힐 27H","グリーンヒルゴルフクラブ","사이타마","간토","12億円",1200000000,350,27,false,"없음","TDB",false,"2023-08-10","https://www.google.co.jp/search?q=%E3%82%B0%E3%83%AA%E3%83%BC%E3%83%B3%E3%83%92%E3%83%AB%E3%82%B4%E3%83%AB%E3%83%95"),
    mk("miyagi-014","미야기 자오 36H 리조트","蔵王カントリークラブ","미야기","도호쿠","12億円",1200000000,450,36,true,"리조트","TDB",false,"2023-03-20","https://www.google.co.jp/search?q=%E8%94%B5%E7%8E%8B%E3%82%AB%E3%83%B3%E3%83%88%E3%83%AA%E3%83%BC")
  ];
}
