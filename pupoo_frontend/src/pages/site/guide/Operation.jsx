import { useState } from "react";
import PageHeader from "../components/PageHeader";

const styles = `
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');

  .info-root {
    box-sizing: border-box;
    font-family: 'Pretendard Variable', 'Pretendard', -apple-system, sans-serif;
    background: #f8f9fc;
    min-height: 100vh;
  }
  .info-root *, .info-root *::before, .info-root *::after { box-sizing: border-box; font-family: inherit; }

  .info-container { max-width: 1400px; margin: 0 auto; padding: 32px 24px 64px; }

  .info-section-title { font-size: 20px; font-weight: 700; color: #111827; margin: 0 0 6px; }
  .info-section-desc  { font-size: 14px; color: #6b7280; margin: 0 0 28px; }

  /* Card */
  .info-card { background: #fff; border: 1px solid #e9ecef; border-radius: 12px; padding: 24px 28px; margin-bottom: 16px; }
  .info-card-title {
    font-size: 17px; font-weight: 700; color: #111827;
    margin: 0 0 18px; padding-bottom: 14px; border-bottom: 1px solid #f1f3f5;
    display: flex; align-items: center; gap: 10px;
  }

  /* Zone grid */
  .info-zone-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .info-zone-item { border: 1px solid #e9ecef; border-radius: 10px; padding: 16px; text-align: center; transition: all 0.15s; }
  .info-zone-item:hover { border-color: #c7d7fb; box-shadow: 0 2px 8px rgba(26,79,214,0.06); }
  .info-zone-emoji { font-size: 28px; margin-bottom: 8px; }
  .info-zone-name { font-size: 13px; font-weight: 600; color: #111827; margin-bottom: 3px; }
  .info-zone-desc { font-size: 15px; color: #9ca3af; }
  .info-zone-floor { font-size: 13px; font-weight: 600; color: #1a4fd6; margin-top: 4px; }

  /* Notice list */
  .info-notice-list { display: flex; flex-direction: column; gap: 0; }
  .info-notice-item { display: flex; gap: 14px; align-items: flex-start; padding: 14px 0; border-bottom: 1px solid #f3f4f6; }
  .info-notice-item:last-child { border-bottom: none; }
  .info-notice-icon { width: 36px; height: 36px; border-radius: 9px; background: #f5f8ff; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
  .info-notice-title { font-size: 14px; font-weight: 600; color: #111827; margin-bottom: 3px; }
  .info-notice-desc  { font-size: 12.5px; color: #6b7280; line-height: 1.6; }

  /* Rule list */
  .info-rule-list { display: flex; flex-direction: column; gap: 8px; }
  .info-rule-item { display: flex; gap: 10px; align-items: flex-start; padding: 10px 12px; border-radius: 8px; font-size: 13px; color: #374151; line-height: 1.55; }
  .info-rule-item.warn { background: #fff7ed; }
  .info-rule-item.ok   { background: #f0fdf4; }
  .info-rule-item.info { background: #f0f9ff; }
  .info-rule-dot { font-size: 15px; flex-shrink: 0; margin-top: 1px; }

  /* ── TIMETABLE ── */
  .tt-day-tabs { display: flex; gap: 8px; margin-bottom: 24px; }
  .tt-day-tab {
    padding: 8px 20px; border-radius: 8px;
    font-size: 13px; font-weight: 600; cursor: pointer;
    border: 1.5px solid #e9ecef; background: #fff;
    color: #6b7280; transition: all 0.15s; font-family: inherit;
  }
  .tt-day-tab.active { border-color: #1a4fd6; background: #1a4fd6; color: #fff; }

  .tt-timeline { display: flex; flex-direction: column; gap: 0; }
  .tt-slot { display: flex; gap: 0; min-height: 72px; position: relative; }
  .tt-slot::before { content: ''; position: absolute; left: 72px; top: 0; bottom: 0; width: 1px; background: #f1f3f5; }
  .tt-time { width: 72px; flex-shrink: 0; padding: 16px 16px 0 0; font-size: 12px; font-weight: 600; color: #9ca3af; text-align: right; font-variant-numeric: tabular-nums; }
  .tt-events { flex: 1; padding: 8px 0 8px 16px; display: flex; flex-direction: column; gap: 6px; }
  .tt-event { border-radius: 8px; padding: 10px 14px; border-left: 3px solid; }
  .tt-event-title { font-size: 13px; font-weight: 600; color: #111827; }
  .tt-event-meta  { font-size: 15px; color: #6b7280; margin-top: 3px; }
  .tt-event-tag   { display: inline-block; font-size: 10.5px; font-weight: 600; padding: 1px 7px; border-radius: 4px; margin-right: 6px; }
  .tt-break { border-left: 3px solid #e2e8f0; background: #f9fafb; }
  .tt-break .tt-event-title { font-size: 12.5px; color: #9ca3af; font-weight: 500; }
  .tt-main { background: #f0f4ff; border-color: #3b5bdb; }
  .tt-sub  { background: #fdf2f8; border-color: #d946a8; }
  .tt-exp  { background: #f0fdf4; border-color: #16a34a; }

  /* ── MAP ── */
  .map-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  .map-info-item { background: #f9fafb; border: 1px solid #e9ecef; border-radius: 10px; padding: 16px 18px; display: flex; gap: 12px; align-items: flex-start; }
  .map-info-icon { width: 36px; height: 36px; border-radius: 9px; background: #eff4ff; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
  .map-info-label { font-size: 15px; color: #9ca3af; font-weight: 600; margin-bottom: 3px; }
  .map-info-value { font-size: 14px; font-weight: 600; color: #111827; line-height: 1.45; }

  .map-placeholder { width: 100%; height: 260px; background: linear-gradient(135deg, #e8eef7 0%, #dce6f5 100%); border-radius: 12px; overflow: hidden; position: relative; margin-bottom: 16px; border: 1px solid #d1dce8; }
  .map-grid-overlay { position: absolute; inset: 0; background-image: linear-gradient(rgba(180,195,220,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(180,195,220,0.3) 1px, transparent 1px); background-size: 40px 40px; }
  .map-road-h { position: absolute; height: 8px; background: #fff; opacity: 0.7; left: 0; right: 0; }
  .map-road-v { position: absolute; width: 8px; background: #fff; opacity: 0.7; top: 0; bottom: 0; }

  /* Transport */
  .trs-tabs { display: flex; gap: 6px; margin-bottom: 20px; }
  .trs-tab { padding: 7px 16px; border-radius: 100px; font-size: 12.5px; font-weight: 600; cursor: pointer; border: 1.5px solid #e9ecef; background: #fff; color: #6b7280; transition: all 0.15s; font-family: inherit; }
  .trs-tab.active { border-color: #1a4fd6; background: #eff4ff; color: #1a4fd6; }
  .trs-route { display: flex; flex-direction: column; gap: 0; }
  .trs-step { display: flex; gap: 12px; align-items: flex-start; padding: 10px 0; position: relative; }
  .trs-step:not(:last-child)::before { content: ''; position: absolute; left: 16px; top: 34px; width: 2px; height: calc(100% - 10px); background: #e2e8f0; }
  .trs-icon { width: 32px; height: 32px; border-radius: 50%; background: #f5f8ff; border: 1.5px solid #dbeafe; display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; z-index: 1; }
  .trs-main { font-size: 14px; font-weight: 600; color: #111827; }
  .trs-sub  { font-size: 12px; color: #6b7280; margin-top: 2px; }
  .trs-time { padding: 2px 8px; font-size: 15px; font-weight: 600; color: #1a4fd6; background: #eff4ff; border-radius: 4px; align-self: center; white-space: nowrap; }

  @media (max-width: 640px) {
    .info-zone-grid { grid-template-columns: repeat(2, 1fr); }
    .map-info-grid  { grid-template-columns: 1fr; }
    .info-container { padding: 20px 16px 48px; }
  }
`;

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const SERVICE_CATEGORIES = [
  { label: "현장 운영 안내", path: "/info/operation" },
  { label: "타임 테이블", path: "/info/timetable" },
  { label: "장소/오시는길", path: "/info/location" },
];

const SUBTITLE_MAP = {
  "/info/operation": "행사 참가 전 꼭 확인하세요",
  "/info/timetable": "행사 프로그램 일정을 확인하세요",
  "/info/location": "행사장 위치 및 교통 정보를 안내합니다",
};

const SCHEDULE = {
  day1: [
    {
      time: "09:30",
      events: [
        {
          title: "개막식 & 환영사",
          track: "main",
          tag: "메인",
          speaker: "조직위원장 김민준",
          room: "메인홀",
        },
      ],
    },
    {
      time: "10:00",
      events: [
        {
          title: "반려동물 복지 현황과 미래 전망",
          track: "main",
          tag: "강연",
          speaker: "수의사 이서연",
          room: "메인홀",
        },
        {
          title: "강아지 훈련 기초 클래스",
          track: "exp",
          tag: "체험",
          speaker: "트레이너 박도현",
          room: "체험존 A",
        },
      ],
    },
    { time: "11:00", events: [{ title: "점심 및 자유 관람", track: "break" }] },
    {
      time: "13:00",
      events: [
        {
          title: "반려견 건강 검진 & Q&A",
          track: "main",
          tag: "강연",
          speaker: "수의사 최지원",
          room: "메인홀",
        },
        {
          title: "고양이 그루밍 시연",
          track: "sub",
          tag: "시연",
          speaker: "그루머 한예진",
          room: "시연 무대",
        },
      ],
    },
    { time: "14:30", events: [{ title: "휴식", track: "break" }] },
    {
      time: "15:00",
      events: [
        {
          title: "인기 반려견 선발 대회",
          track: "main",
          tag: "이벤트",
          room: "메인홀",
        },
        {
          title: "반려동물 사진 촬영 클래스",
          track: "exp",
          tag: "체험",
          speaker: "포토그래퍼 오준혁",
          room: "체험존 B",
        },
      ],
    },
    {
      time: "17:00",
      events: [
        {
          title: "Day 1 마무리 & 경품 추첨",
          track: "main",
          tag: "이벤트",
          room: "메인홀",
        },
      ],
    },
    { time: "18:00", events: [{ title: "행사 종료", track: "break" }] },
  ],
  day2: [
    {
      time: "10:00",
      events: [
        {
          title: "반려동물 영양학 특강",
          track: "main",
          tag: "강연",
          speaker: "영양사 윤지수",
          room: "메인홀",
        },
        {
          title: "강아지 어질리티 체험",
          track: "exp",
          tag: "체험",
          room: "야외 운동장",
        },
      ],
    },
    { time: "11:30", events: [{ title: "점심 및 자유 관람", track: "break" }] },
    {
      time: "13:00",
      events: [
        {
          title: "입양 연계 프로그램 소개",
          track: "sub",
          tag: "특별",
          speaker: "유기견 보호소 대표",
          room: "소강당",
        },
        {
          title: "반려동물 아로마테라피",
          track: "exp",
          tag: "체험",
          room: "체험존 A",
        },
      ],
    },
    { time: "14:30", events: [{ title: "휴식", track: "break" }] },
    {
      time: "15:00",
      events: [
        {
          title: "전문가 패널 토크 & 폐막식",
          track: "main",
          tag: "메인",
          room: "메인홀",
        },
      ],
    },
    { time: "17:00", events: [{ title: "행사 종료", track: "break" }] },
  ],
};

const TRANSPORT = {
  subway: [
    {
      icon: "🚇",
      main: "5호선 올림픽공원역 3번 출구",
      sub: "도보 5분 · 평화의 광장 방향",
      time: "도보 5분",
    },
    {
      icon: "🚇",
      main: "9호선 한성백제역 1번 출구",
      sub: "도보 10분 · 서문 방향",
      time: "도보 10분",
    },
    {
      icon: "🚌",
      main: "30, 31, 333, 340, 3411번 버스",
      sub: "올림픽공원 정류장 하차",
      time: "버스 이용",
    },
  ],
  car: [
    {
      icon: "🚗",
      main: "서울 올림픽공원 주차장 (동문)",
      sub: "주소: 서울 송파구 올림픽로 424",
      time: "",
    },
    {
      icon: "🅿️",
      main: "행사 기간 주차 요금 50% 할인",
      sub: "주차권 발급 필요 · 현장 안내 데스크 문의",
      time: "",
    },
    {
      icon: "⚠️",
      main: "대중교통 이용 강력 권장",
      sub: "행사 당일 인근 도로 혼잡 예상",
      time: "",
    },
  ],
  shuttle: [
    {
      icon: "🚌",
      main: "5호선 올림픽공원역 셔틀 운행",
      sub: "09:00 ~ 19:00, 20분 간격",
      time: "무료",
    },
    {
      icon: "🚌",
      main: "강남역 셔틀 (특별 운행)",
      sub: "09:30, 10:30, 14:00, 15:30 출발",
      time: "무료",
    },
  ],
};

/* ─────────────────────────────────────────────
   현장 운영 안내
───────────────────────────────────────────── */
function OperationGuide() {
  return (
    <>
      <div className="info-card">
        <div className="info-card-title">📌 운영 기본 정보</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 12,
          }}
        >
          {[
            { label: "행사 기간", value: "2026.04.12(토) ~ 13(일)" },
            { label: "운영 시간", value: "10:00 ~ 18:00" },
            { label: "장소", value: "서울 올림픽공원 체조경기장" },
            { label: "입장 가능", value: "반려동물 동반 가능" },
            { label: "주차", value: "올림픽공원 내 주차장" },
            { label: "문의", value: "02-1234-5678" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: "#f9fafb",
                borderRadius: 8,
                padding: "12px 14px",
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  color: "#9ca3af",
                  fontWeight: 600,
                  marginBottom: 4,
                }}
              >
                {item.label}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="info-card">
        <div className="info-card-title">🗺️ 행사장 구역 안내</div>
        <div className="info-zone-grid">
          {[
            {
              emoji: "🎤",
              name: "메인 무대",
              desc: "강연 및 시상식",
              floor: "1F 중앙",
            },
            {
              emoji: "🎪",
              name: "체험존 A·B",
              desc: "훈련 · 그루밍 체험",
              floor: "1F 동측",
            },
            {
              emoji: "🛍️",
              name: "펫 마켓",
              desc: "브랜드 부스 50+",
              floor: "2F 전체",
            },
            {
              emoji: "📸",
              name: "포토 부스",
              desc: "반려동물 사진 촬영",
              floor: "1F 서측",
            },
            {
              emoji: "🍽️",
              name: "푸드 코트",
              desc: "반려동물 간식 포함",
              floor: "B1F",
            },
            {
              emoji: "🏥",
              name: "긴급 수의 클리닉",
              desc: "현장 응급 진료",
              floor: "1F 북측",
            },
          ].map((z) => (
            <div key={z.name} className="info-zone-item">
              <div className="info-zone-emoji">{z.emoji}</div>
              <div className="info-zone-name">{z.name}</div>
              <div className="info-zone-desc">{z.desc}</div>
              <div className="info-zone-floor">{z.floor}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="info-card" style={{ marginBottom: 0 }}>
          <div className="info-card-title">🐾 반려동물 동반 규정</div>
          <div className="info-rule-list">
            {[
              {
                type: "ok",
                icon: "✅",
                text: "소형~대형견 모두 동반 가능 (목줄 필수)",
              },
              { type: "ok", icon: "✅", text: "고양이 이동장 동반 가능" },
              {
                type: "warn",
                icon: "⚠️",
                text: "입장 전 예방접종 확인서 지참 필수",
              },
              {
                type: "warn",
                icon: "⚠️",
                text: "공격성 있는 반려동물은 입마개 착용",
              },
              {
                type: "info",
                icon: "ℹ️",
                text: "반려동물 배변봉투 현장 무료 제공",
              },
            ].map((r, i) => (
              <div key={i} className={`info-rule-item ${r.type}`}>
                <span className="info-rule-dot">{r.icon}</span>
                <span>{r.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="info-card" style={{ marginBottom: 0 }}>
          <div className="info-card-title">📋 입장 안내</div>
          <div className="info-notice-list">
            {[
              {
                icon: "🎫",
                title: "티켓 확인",
                desc: "QR 코드 또는 예약 확인증 지참",
              },
              {
                icon: "⏰",
                title: "입장 시간",
                desc: "행사 시작 30분 전 게이트 오픈",
              },
              {
                icon: "🎁",
                title: "굿즈 수령",
                desc: "VIP 패키지 수령처: 2번 게이트 옆",
              },
              {
                icon: "🚭",
                title: "금연 구역",
                desc: "행사장 내 전 구역 금연",
              },
            ].map((n) => (
              <div key={n.title} className="info-notice-item">
                <div className="info-notice-icon">{n.icon}</div>
                <div>
                  <div className="info-notice-title">{n.title}</div>
                  <div className="info-notice-desc">{n.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   타임 테이블
───────────────────────────────────────────── */
function TimeTable() {
  const [day, setDay] = useState("day1");
  const schedule = SCHEDULE[day];
  const trackClass = {
    main: "tt-main",
    sub: "tt-sub",
    exp: "tt-exp",
    break: "tt-break",
  };
  const tagStyle = {
    main: { bg: "#dbeafe", color: "#1d4ed8" },
    sub: { bg: "#fce7f3", color: "#be185d" },
    exp: { bg: "#dcfce7", color: "#15803d" },
  };

  return (
    <>
      <div className="info-section-title">타임 테이블</div>
      <div className="info-section-desc">행사 프로그램 일정을 확인하세요</div>

      <div className="tt-day-tabs">
        <button
          className={`tt-day-tab${day === "day1" ? " active" : ""}`}
          onClick={() => setDay("day1")}
        >
          Day 1 · 04월 12일 (토)
        </button>
        <button
          className={`tt-day-tab${day === "day2" ? " active" : ""}`}
          onClick={() => setDay("day2")}
        >
          Day 2 · 04월 13일 (일)
        </button>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        {[
          { color: "#3b5bdb", label: "메인 무대" },
          { color: "#d946a8", label: "서브 무대" },
          { color: "#16a34a", label: "체험 프로그램" },
        ].map((t) => (
          <span
            key={t.label}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              fontSize: 12,
              color: "#6b7280",
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: t.color,
                display: "inline-block",
              }}
            />
            {t.label}
          </span>
        ))}
      </div>

      <div className="info-card">
        <div className="tt-timeline">
          {schedule.map((slot, i) => (
            <div key={i} className="tt-slot">
              <div className="tt-time">{slot.time}</div>
              <div className="tt-events">
                {slot.events.map((ev, j) => (
                  <div key={j} className={`tt-event ${trackClass[ev.track]}`}>
                    <div className="tt-event-title">
                      {ev.tag && (
                        <span
                          className="tt-event-tag"
                          style={{
                            background: tagStyle[ev.track]?.bg,
                            color: tagStyle[ev.track]?.color,
                          }}
                        >
                          {ev.tag}
                        </span>
                      )}
                      {ev.title}
                    </div>
                    {(ev.speaker || ev.room) && (
                      <div className="tt-event-meta">
                        {ev.speaker && <span>🎤 {ev.speaker}</span>}
                        {ev.speaker && ev.room && (
                          <span style={{ margin: "0 6px", color: "#d1d5db" }}>
                            |
                          </span>
                        )}
                        {ev.room && <span>📍 {ev.room}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   장소 / 오시는길
───────────────────────────────────────────── */
function LocationGuide() {
  const [transport, setTransport] = useState("subway");
  const routes = TRANSPORT[transport];

  return (
    <>
      <div className="info-section-title">장소 / 오시는 길</div>
      <div className="info-section-desc">
        행사장 위치 및 교통 정보를 안내합니다
      </div>

      <div className="map-info-grid">
        {[
          {
            icon: "📍",
            label: "행사장",
            value: "서울 올림픽공원 체조경기장\n서울특별시 송파구 올림픽로 424",
          },
          {
            icon: "📞",
            label: "문의 전화",
            value: "02-1234-5678\n평일 09:00 ~ 18:00",
          },
          {
            icon: "📅",
            label: "행사 일정",
            value: "2026.04.12 (토) ~ 04.13 (일)\n매일 10:00 ~ 18:00",
          },
          {
            icon: "🚇",
            label: "지하철",
            value: "5호선 올림픽공원역 3번 출구\n도보 5분",
          },
        ].map((item) => (
          <div key={item.label} className="map-info-item">
            <div className="map-info-icon">{item.icon}</div>
            <div>
              <div className="map-info-label">{item.label}</div>
              <div
                className="map-info-value"
                style={{ whiteSpace: "pre-line" }}
              >
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fake map */}
      <div className="map-placeholder">
        <div className="map-grid-overlay" />
        <div className="map-road-h" style={{ top: "40%" }} />
        <div className="map-road-h" style={{ top: "65%" }} />
        <div className="map-road-v" style={{ left: "35%" }} />
        <div className="map-road-v" style={{ left: "60%" }} />
        <div
          style={{
            position: "absolute",
            top: "38%",
            left: "44%",
            background: "#1a4fd6",
            borderRadius: 8,
            padding: "6px 14px",
            color: "#fff",
            fontSize: 12,
            fontWeight: 700,
            boxShadow: "0 2px 12px rgba(26,79,214,0.4)",
            zIndex: 2,
          }}
        >
          📍 올림픽공원 체조경기장
        </div>
        <div
          style={{
            position: "absolute",
            top: "60%",
            left: "20%",
            background: "#fff",
            borderRadius: 6,
            padding: "4px 10px",
            color: "#374151",
            fontSize: 11,
            fontWeight: 600,
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          }}
        >
          올림픽공원역
        </div>
        <button
          style={{
            position: "absolute",
            bottom: 12,
            right: 12,
            padding: "8px 16px",
            background: "#1a4fd6",
            color: "#fff",
            border: "none",
            borderRadius: 7,
            fontSize: 12.5,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          지도 앱으로 보기 →
        </button>
      </div>

      <div className="info-card">
        <div className="info-card-title">🚌 대중교통 안내</div>
        <div className="trs-tabs">
          {[
            { id: "subway", label: "🚇 지하철 · 버스" },
            { id: "car", label: "🚗 자가용" },
            { id: "shuttle", label: "🚌 셔틀버스" },
          ].map((t) => (
            <button
              key={t.id}
              className={`trs-tab${transport === t.id ? " active" : ""}`}
              onClick={() => setTransport(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="trs-route">
          {routes.map((r, i) => (
            <div key={i} className="trs-step">
              <div className="trs-icon">{r.icon}</div>
              <div style={{ flex: 1 }}>
                <div className="trs-main">{r.main}</div>
                <div className="trs-sub">{r.sub}</div>
              </div>
              {r.time && <span className="trs-time">{r.time}</span>}
            </div>
          ))}
        </div>
      </div>

      <div
        className="info-card"
        style={{ background: "#fffbeb", borderColor: "#fde68a" }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <span style={{ fontSize: 20 }}>💡</span>
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#92400e",
                marginBottom: 4,
              }}
            >
              행사 당일 교통 혼잡 안내
            </div>
            <div style={{ fontSize: 13, color: "#78350f", lineHeight: 1.65 }}>
              행사 기간 동안 올림픽공원 주변 도로가 매우 혼잡할 것으로
              예상됩니다. 대중교통 또는 셔틀버스 이용을 적극 권장하며, 자가용
              방문 시 인근 공영주차장을 미리 확인하세요.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function ParticipationGuide() {
  const [currentPath, setCurrentPath] = useState("/info/operation");

  const renderContent = () => {
    switch (currentPath) {
      case "/info/operation":
        return <OperationGuide />;
      case "/info/timetable":
        return <TimeTable />;
      case "/info/location":
        return <LocationGuide />;
      default:
        return <OperationGuide />;
    }
  };

  return (
    <div className="info-root">
      <style>{styles}</style>

      <PageHeader
        title="현장 운영 안내"
        subtitle={SUBTITLE_MAP[currentPath]}
        categories={SERVICE_CATEGORIES}
        currentPath={currentPath}
        onNavigate={setCurrentPath}
      />

      <main className="info-container">{renderContent()}</main>
    </div>
  );
}
