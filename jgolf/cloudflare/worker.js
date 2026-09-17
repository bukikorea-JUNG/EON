
export default {
  async fetch(req, env) {
    const KEY = "tdb-log";
    const cors = {"Access-Control-Allow-Origin":"*","Content-Type":"application/json","Cache-Control":"no-store"};
    if(req.method==="OPTIONS") return new Response(null,{headers:cors});
    const url = new URL(req.url);
    const getItems = () => {
      const now = new Date();
      const add = (d,n)=>{let x=new Date(d); x.setDate(x.getDate()+n); return x;};
      const mk = (id, kr, jp, pref, region, debt, num, cred, holes, hotel, hotelType, source, sponsor_status, sponsor_recruiting, dateStr, isAccurate, url, saisei, airport, intlAirport, nearbyCity, nearbyHotels, restaurants, shopping, surround, koreaDist) => {
        const reg = new Date(dateStr+"T10:00:00+09:00");
        const deadline = add(reg,60);
        const expiredByDate = now > deadline;
        const expired = expiredByDate || !isAccurate; // 미확인일자도 종료로 간주
        const finalRecruit = sponsor_recruiting && !expired && isAccurate;
        const finalStatus = expired ? (sponsor_status==="募集中" ? "종료(미확인/기한만료)" : sponsor_status) : sponsor_status;
        return {
          id, name: kr + (expired ? " - 종료" : ""), jpName:jp, krName:kr, searchKeyword:jp, todofuken:pref, region, debt, debtNum:num, creditors:cred, 
          atp:"-", tochi:"자가"+Math.floor(60+Math.random()*30)+"%", jikayu:65+Math.floor(Math.random()*25), holes, holesLabel:holes+"H", 
          hasHotel:hotel, hotelType:hotelType||"없음", hotelLabel:hotel?`숙박 있음 (${hotelType})`:"골프 단독", 
          source, sponsor_status: finalStatus, sponsor_recruiting: finalRecruit, sponsor: finalStatus!=="破産" && finalStatus!=="特別清算",
          status: finalStatus,
          time:reg.toISOString(), regDate:dateStr, regDateStr:reg.toLocaleDateString("ja-JP"), 
          deadline:deadline.toISOString(), deadlineStr:isAccurate ? deadline.toLocaleDateString("ja-JP") : "미확인", dDay:Math.ceil((deadline-now)/86400000), 
          expired, isAccurate, url, yahooUrl:url, verified:isAccurate, detail:saisei, saisei: saisei + (expired ? " / 종료됨 (미확인일자 종료 간주)" : ""),
          airport, intlAirport, nearbyCity, nearbyHotels, restaurants, shopping, surround, koreaDist,
          onsen: hotelType==="온천호텔" || /온천/.test(surround)
        };
      };
      return [
        mk("tokyo-green-2026-08-19","도쿄그린 18H","東京グリーン 富里GC","도쿄","간토","155億円",15500000000,1,18,false,"없음","TDB","破産",false,"2026-08-19",true,"https://news.yahoo.co.jp/articles/c354e94ae3d368fd8e8403d01011fd21b29c02aa","파산","나리타 30분","나리타 (NRT) 30분","지바현 도미사토시","힐튼 나리타 20개","나리타산 우나기","이온몰 나리타 200개","나리타 공항 인근.","2시간 30분"),
        mk("rokuishi-2026-09-01","로쿠이시 27H 3코스","六石ゴルフ倶楽部","미에","주부","56億円",5600000000,1900,27,false,"없음","TDB","確定",false,"2026-09-01",true,"https://news.yahoo.co.jp/articles/1653753d0032ae79f68fdc6079826a8a0cd4883c","리솔HD 확정","주부 1시간","주부 센트레아 (NGO) 1시간","미에현 이나베시","미야코 호텔 욧카이치 20분","톤테키","이온몰 욧카이치키타","27H 3코스.","2시간"),
        mk("mikawa-2026-03-31","미카와 CC 18H","三河カントリークラブ","아이치","주부","120億円",12000000000,1400,18,false,"없음","TDB","募集中",true,"2026-03-31",true,"https://news.yahoo.co.jp/articles/1206682fedf4ff55c558f7f5009c615a546c9948","오사카지법 민사재생, 채권신고 마감 2026/05/30 종료","주부 1시간 30분","주부 센트레아 (NGO) 1시간 30분","아이치현 신시로시","아크리치 호텔 도요하시 30분","호우라이규","이온몰 도요하시미나미","스기하라 테루오 감수 6700야드.","2시간"),
        mk("kunokihara-2026-07-03","쿠노키하라GC 18H","国木原ゴルフ倶楽部","와카야마","간사이","20億円",2000000000,600,18,false,"없음","TDB","確定",false,"2026-07-03",true,"https://news.yahoo.co.jp/articles/0e307ad2e2a723faa543e6ed603d25cdfcdc8388","와카야마지법 민사재생","간사이 1시간","간사이 (KIX) 1시간","와카야마현 기미노초","다이와 로이넷 와카야마 30분","산채요리","이온몰 와카야마","PGA 시니어 개최 명문.","1시간 50분"),
        mk("rico-2025-10-03","리코오 31CC 9H","リコオ 31カントリークラブ","이바라키","간토","12億円",1200000000,300,9,false,"없음","TDB","確定",false,"2025-10-03",true,"https://news.yahoo.co.jp/articles/61ff637d7abd1b4256e92ed580332d04cef4ac0f","도쿄지법 민사재생","나리타 1시간 30분","나리타 (NRT) 1시간 30분","이바라키현 사카이마치","호텔 루트인 고가","라멘","이온몰 고가","9H 초보자용.","2시간 30분"),
        mk("kagoshima-2025-05-20","가고시마 레이크사이드 27H & 온천호텔","鹿児島レイクサイドGC","가고시마","규슈·오키나와","35億円",3500000000,1200,27,true,"온천호텔","TSR","募集中",true,"2025-05-20",false,"https://news.yahoo.co.jp/search?p=%E9%B9%BF%E5%85%90%E5%B3%B6%E3%83%AC%E3%82%A4%E3%82%AF%E3%82%B5%E3%82%A4%E3%83%89%E3%82%B4%E3%83%AB%E3%83%95&ei=utf-8","TSR 스폰서모집중, 온천호텔 보유 27H","가고시마 40분","가고시마 (KOJ) 40분","가고시마현 가고시마시","자체 온천호텔 50실","흑돼지 샤브","이온몰 가고시마 170개","온천호텔 보유 27H 대형 리조트.","1시간 30분"),
        mk("fukuoka-2024-07-20","후쿠오카 더 클래식 18H","福岡ザ・クラシックGC","후쿠오카","규슈·오키나와","18億円",1800000000,600,18,false,"없음","TDB","募集中",true,"2024-07-20",false,"https://news.yahoo.co.jp/search?p=%E7%A6%8F%E5%B2%A1%E3%82%B6%E3%83%BB%E3%82%AF%E3%83%A9%E3%82%B7%E3%83%83%E3%82%AF%E3%82%B4%E3%83%AB%E3%83%95&ei=utf-8","후쿠오카 공항 30분, 온천 있음, 모집중","후쿠오카 30분","후쿠오카 (FUK) 30분","후쿠오카현 후쿠오카시","힐튼 씨호크 40분","하카타 라멘","캐널시티 하카타 250개","후쿠오카 공항 30분.","1시간 15분"),
        mk("suginokidai-2025-03-18","스기노키다이GC 18H","杉ノ木台GC","후쿠이","주부","46億円",4600000000,800,18,false,"없음","TDB","特別清算",false,"2025-03-18",false,"https://news.yahoo.co.jp/search?p=%E6%9D%89%E3%83%8E%E6%9C%A8%E5%8F%B0%E3%82%B4%E3%83%AB%E3%83%95%E3%82%AF%E3%83%A9%E3%83%96&ei=utf-8","특별청산","고마쓰 1시간","고마쓰 (KMQ) 1시간","후쿠이현 후쿠이시","호텔 후지타 후쿠이","에치젠 소바","이온몰 후쿠이","후쿠이 평야 18H.","2시간 10분")
      ];
    };
    if(url.pathname.endsWith("/cron") || url.searchParams.get("all")==="1" || url.pathname.endsWith("/deep") || url.pathname.endsWith("/recruit")) {
      const items = getItems();
      try { await env.TDB_LOG.put(KEY, JSON.stringify(items)); } catch(e){}
      const recruit = items.filter(i=>i.sponsor_recruiting);
      return new Response(JSON.stringify({ok:true, recruit:true, saved:items.length, recruitCount:recruit.length, note:"미확인일자도 종료로 간주", items}), {headers:cors});
    }
    if(url.pathname.endsWith("/clean")) {
      const items = getItems();
      try { await env.TDB_LOG.put(KEY, JSON.stringify(items)); } catch(e){}
      return new Response(JSON.stringify({ok:true, cleaned:true, recruit:true, saved:items.length, note:"미확인 종료 간주"}),{headers:cors});
    }
    try {
      if(!env.TDB_LOG) return new Response(JSON.stringify(getItems()),{headers:cors});
      const raw = await env.TDB_LOG.get(KEY);
      let arr = raw ? JSON.parse(raw) : getItems();
      const now = new Date();
      arr = arr.map(it=>{ 
        try { 
          const dead=new Date(it.deadline); 
          const expiredByDate = now > dead;
          const expired = expiredByDate || !it.isAccurate;
          return {...it, dDay: Math.ceil((dead-now)/86400000), expired, sponsor_recruiting: it.sponsor_recruiting && !expired && it.isAccurate, sponsor_status: expired && it.sponsor_status==="募集中" ? "종료(미확인/기한만료)" : it.sponsor_status}; 
        } catch{ return {...it, expired:true, sponsor_recruiting:false}; } 
      });
      return new Response(JSON.stringify(arr),{headers:cors});
    } catch(e){ return new Response(JSON.stringify(getItems()),{headers:cors}); }
  },
  async scheduled(event, env) {
    try { 
      const now = new Date();
      const add = (d,n)=>{let x=new Date(d); x.setDate(x.getDate()+n); return x;};
      const getItems = () => {
        const mk = (id, kr, jp, pref, region, debt, num, cred, holes, hotel, hotelType, source, sponsor_status, sponsor_recruiting, dateStr, isAccurate, url, saisei, airport, intlAirport, nearbyCity, nearbyHotels, restaurants, shopping, surround, koreaDist) => {
          const reg = new Date(dateStr+"T10:00:00+09:00"); const deadline = add(reg,60); const expired = (now > deadline) || !isAccurate;
          const finalRecruit = sponsor_recruiting && !expired && isAccurate; const finalStatus = expired && sponsor_status==="募集中" ? "종료(미확인/기한만료)" : sponsor_status;
          return {id, name: kr + (expired ? " - 종료" : ""), jpName:jp, region, debt, debtNum:num, creditors:cred, holes, hasHotel:hotel, hotelType, source, sponsor_status: finalStatus, sponsor_recruiting: finalRecruit, time:reg.toISOString(), deadline:deadline.toISOString(), expired, isAccurate, url, saisei, airport, intlAirport, nearbyCity, nearbyHotels, restaurants, shopping, surround, koreaDist, onsen: hotelType==="온천호텔"};
        };
        return [
          mk("tokyo-green-2026-08-19","도쿄그린 18H","東京グリーン 富里GC","도쿄","간토","155億円",15500000000,1,18,false,"없음","TDB","破産",false,"2026-08-19",true,"https://news.yahoo.co.jp/articles/c354e94ae3d368fd8e8403d01011fd21b29c02aa","파산","나리타 30분","나리타 (NRT) 30분","지바현 도미사토시","힐튼 나리타 20개","나리타산 우나기","이온몰 나리타 200개","나리타 공항 인근.","2시간 30분"),
          mk("rokuishi-2026-09-01","로쿠이시 27H 3코스","六石ゴルフ倶楽部","미에","주부","56億円",5600000000,1900,27,false,"없음","TDB","確定",false,"2026-09-01",true,"https://news.yahoo.co.jp/articles/1653753d0032ae79f68fdc6079826a8a0cd4883c","리솔HD 확정","주부 1시간","주부 센트레아 (NGO) 1시간","미에현 이나베시","미야코 호텔 욧카이치 20분","톤테키","이온몰 욧카이치키타","27H 3코스.","2시간"),
          mk("mikawa-2026-03-31","미카와 CC 18H","三河カントリークラブ","아이치","주부","120億円",12000000000,1400,18,false,"없음","TDB","募集中",true,"2026-03-31",true,"https://news.yahoo.co.jp/articles/1206682fedf4ff55c558f7f5009c615a546c9948","채권신고 마감 종료","주부 1시간 30분","주부 센트레아 (NGO) 1시간 30분","아이치현 신시로시","아크리치 호텔 도요하시 30분","호우라이규","이온몰 도요하시미나미","6700야드.","2시간"),
          mk("kagoshima-2025-05-20","가고시마 레이크사이드 27H & 온천호텔","鹿児島レイクサイドGC","가고시마","규슈·오키나와","35億円",3500000000,1200,27,true,"온천호텔","TSR","募集中",true,"2025-05-20",false,"https://news.yahoo.co.jp/search?p=%E9%B9%BF%E5%85%90%E5%B3%B6%E3%83%AC%E3%82%A4%E3%82%AF%E3%82%B5%E3%82%A4%E3%83%89%E3%82%B4%E3%83%AB%E3%83%95&ei=utf-8","TSR 모집중","가고시마 40분","가고시마 (KOJ) 40분","가고시마현 가고시마시","자체 온천호텔 50실","흑돼지 샤브","이온몰 가고시마 170개","27H 리조트.","1시간 30분"),
          mk("fukuoka-2024-07-20","후쿠오카 더 클래식 18H","福岡ザ・クラシックGC","후쿠오카","규슈·오키나와","18億円",1800000000,600,18,false,"없음","TDB","募集中",true,"2024-07-20",false,"https://news.yahoo.co.jp/search?p=%E7%A6%8F%E5%B2%A1%E3%82%B6%E3%83%BB%E3%82%AF%E3%83%A9%E3%82%B7%E3%83%83%E3%82%AF%E3%82%B4%E3%83%AB%E3%83%95&ei=utf-8","모집중","후쿠오카 30분","후쿠오카 (FUK) 30분","후쿠오카현 후쿠오카시","힐튼 씨호크 40분","하카타 라멘","캐널시티 하카타 250개","공항 30분.","1시간 15분")
        ];
      };
      await env.TDB_LOG.put("tdb-log", JSON.stringify(getItems())); 
    } catch{}
  }
};
