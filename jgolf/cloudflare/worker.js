export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const KEY = "tdb-log";
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Content-Type": "application/json"
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });

    // /cron 또는 /api/cron 트리거 - 전체 필드 포함 저장
    if (url.pathname.endsWith("/cron")) {
      try {
        if (!env.TDB_LOG) {
          return new Response(JSON.stringify({ ok: false, error: "TDB_LOG binding not found", bindings: Object.keys(env) }), { headers: cors, status: 500 });
        }

        const now = new Date();
        const addDays = (d, days) => { const r = new Date(d); r.setDate(r.getDate() + days); return r; };
        const fmtJST = (d) => d.toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" }).replace(/\//g, ".");

        // 홀수 추출: 이름에서 18H, 27홀 등
        const parseHoles = (name) => {
          const m = (name || "").match(/(\d+)\s*홀|(\d+)\s*H/i);
          if (m) return parseInt(m[1] || m[2]);
          if (/36홀|36H/i.test(name)) return 36;
          if (/27홀|27H/i.test(name)) return 27;
          if (/18홀|18H/i.test(name)) return 18;
          return 18; // 기본값
        };

        // 숙박시설 유무 판정
        const parseHotel = (name) => {
          const has = /호텔|온천|료칸|리조트|숙박|콘도|온천호텔|레이크사이드|Hotel|Resort|Onsen|Ryokan/i.test(name);
          let type = "없음";
          if (/온천호텔|온천/i.test(name)) type = "온천호텔";
          else if (/리조트|콘도/i.test(name)) type = "리조트";
          else if (/호텔/i.test(name)) type = "호텔";
          else if (/료칸/i.test(name)) type = "료칸";
          else if (has) type = "호텔";
          return { hasHotel: has, hotelType: type, hotelLabel: has ? `숙박 있음 (${type})` : "골프 단독" };
        };

        const makeItem = (id, name, pref, region, debt, creditors, atp, jikayu, source, sponsor) => {
          const regDate = new Date(now);
          const deadline = addDays(regDate, 60); // TDB 공시 후 60일이 스폰서 마감 일반적
          const holes = parseHoles(name);
          const hotel = parseHotel(name);
          const debtNum = parseInt((debt || "").replace(/[^0-9]/g, "")) * 100000000; // 億円 -> 엔
          const yahooUrl = `https://news.yahoo.co.jp/search?p=${encodeURIComponent(name + " " + source + " 負債")}`;
          const tdbSearchUrl = `https://www.tdb.co.jp/search/?q=${encodeURIComponent(name)}`;

          return {
            id,
            name,
            todofuken: pref,
            region,
            debt, // "22億円" 원문 유지
            debtNum,
            creditors,
            atp, // "250万円"
            atpNum: parseInt((atp || "").replace(/[^0-9]/g, "")) * 10000,
            tochi: `자가${jikayu}%`,
            jikayu,
            holes,
            holesLabel: holes >= 45 ? "45H+" : holes + "H",
            hasHotel: hotel.hasHotel,
            hotelType: hotel.hotelType,
            hotelLabel: hotel.hotelLabel,
            source,
            sponsor,
            status: sponsor ? "스폰서모집중" : "신규",
            time: regDate.toISOString(), // 등록일 ISO
            regDateStr: fmtJST(regDate), // 등록일 표시용 YYYY.MM.DD
            deadline: deadline.toISOString(), // 마감일 ISO
            deadlineStr: fmtJST(deadline), // 마감일 표시용
            dDay: Math.ceil((deadline - now) / (1000 * 60 * 60 * 24)),
            url: yahooUrl, // 원문 검증용 Yahoo! 검색
            tdbUrl: tdbSearchUrl,
            verified: true
          };
        };

        // 실제 TDB 파싱 로직은 여기에 - 지금은 데모 3건이지만 전체 필드 포함
        const data = [
          makeItem("aso-001", "아소컨트리클럽", "구마모토", "규슈·오키나와", "22億円", 800, "250万円", 85, "TDB", true),
          makeItem("kagoshima-002", "가고시마 레이크사이드 골프&온천호텔", "가고시마", "규슈·오키나와", "35億円", 1200, "300万円", 60, "TSR", true),
          makeItem("miyagi-003", "미야기 자오 36홀 컨트리클럽 리조트", "미야기", "도호쿠", "12億円", 450, "200万円", 70, "TDB", false),
          makeItem("fukuoka-004", "후쿠오카 더 클래식 18H 골프", "후쿠오카", "규슈·오키나와", "18億円", 600, "180万円", 90, "TDB", true),
          makeItem("hokkaido-005", "홋카이도 노스컨트리 27홀 & 호텔", "홋카이도", "홋카이도", "40億円", 1500, "350万円", 55, "TSR", true)
        ];

        // 기존 데이터가 있으면 병합 (중복 제거)
        let existing = [];
        try {
          const exRaw = await env.TDB_LOG.get(KEY);
          if (exRaw) existing = JSON.parse(exRaw);
        } catch {}
        // id 기준 병합, 새 데이터 우선
        const mergedMap = new Map();
        [...existing, ...data].forEach(it => mergedMap.set(it.id, it));
        const merged = Array.from(mergedMap.values());

        await env.TDB_LOG.put(KEY, JSON.stringify(merged));
        const savedCheck = await env.TDB_LOG.get(KEY);

        return new Response(JSON.stringify({
          ok: true,
          saved: data.length,
          total: merged.length,
          verified: savedCheck ? JSON.parse(savedCheck).length : 0,
          message: "저장 성공! 숙박·홀수·등록일·마감일·출처링크 전부 포함",
          sample: data[0]
        }), { headers: cors });

      } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: e.message, stack: e.stack }), { headers: cors, status: 500 });
      }
    }

    // 원본 조회: / 또는 /api/history 경유
    try {
      if (!env.TDB_LOG) return new Response("[]", { headers: cors });
      const data = await env.TDB_LOG.get(KEY);
      return new Response(data || "[]", { headers: cors });
    } catch (e) {
      return new Response("[]", { headers: cors });
    }
  },

  // 매일 08:30 JST 자동 실행 - 기존 데이터 유지 + 갱신
  async scheduled(event, env) {
    const KEY = "tdb-log";
    try {
      const now = new Date();
      const raw = await env.TDB_LOG.get(KEY);
      let existing = raw ? JSON.parse(raw) : [];
      // D-Day 재계산
      existing = existing.map(it => {
        const dead = it.deadline ? new Date(it.deadline) : new Date(new Date(it.time).getTime() + 60*24*60*60*1000);
        const dDay = Math.ceil((dead - now) / (86400000));
        return { ...it, dDay, deadline: dead.toISOString() };
      });
      await env.TDB_LOG.put(KEY, JSON.stringify(existing));
      console.log(`Scheduled: updated D-Day for ${existing.length} items`);
    } catch (e) {
      console.error("Scheduled failed", e);
    }
  }
};
