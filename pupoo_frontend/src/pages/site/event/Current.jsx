import PageHeader from "../components/PageHeader";
import EventDetailModal from "./EventDetailModal";
import { useEffect, useMemo, useState } from "react";
import { eventApi } from "../../../app/http/eventApi"; // ✅ 추가
import {
  Play,
  MapPin,
  Users,
  Clock,
  Calendar,
  ChevronRight,
  Search,
  Zap,
  TrendingUp,
} from "lucide-react";

export const SERVICE_CATEGORIES = [
  { label: "현재 진행 행사", path: "/event/current" },
  { label: "예정 행사", path: "/event/upcoming" },
  { label: "종료 행사", path: "/event/closed" },
  { label: "행사 사전 등록", path: "/event/preregister" },
  { label: "행사 일정 안내", path: "/event/eventschedule" },
];

export const SUBTITLE_MAP = {
  "/event/current": "현재 진행 중인 행사 목록을 확인합니다",
  "/event/upcoming": "예정된 행사 일정을 확인합니다",
  "/event/closed": "종료된 행사 목록을 확인합니다",
  "/event/preregister": "행사 사전 등록을 진행합니다",
  "/event/eventschedule": "행사 일정을 안내합니다",
};

const styles = `
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');

  .ev-root {
    box-sizing: border-box;
    font-family: 'Pretendard Variable', 'Pretendard', -apple-system, sans-serif;
    background: #f8f9fc;
    min-height: 100vh;
  }
  .ev-root *, .ev-root *::before, .ev-root *::after { box-sizing: border-box; font-family: inherit; }

  .ev-header { background: #fff; border-bottom: 1px solid #e9ecef; padding: 0 32px; }
  .ev-header-inner { max-width: 1400px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; height: 64px; }
  .ev-header-left { display: flex; flex-direction: column; }
  .ev-header-title { font-size: 17px; font-weight: 800; color: #111827; }
  .ev-header-sub { font-size: 12px; color: #9ca3af; margin-top: 1px; }
  .ev-nav { display: flex; gap: 4px; }
  .ev-nav-btn { height: 34px; padding: 0 14px; border: none; border-radius: 8px; font-size: 13px; font-weight: 500; color: #6b7280; background: transparent; cursor: pointer; font-family: inherit; transition: all 0.15s; }
  .ev-nav-btn:hover { background: #f3f4f6; color: #111827; }
  .ev-nav-btn.active { background: #1a4fd6; color: #fff; font-weight: 600; }

  .ev-container { max-width: 1400px; margin: 0 auto; padding: 32px 24px 64px; }

  .ev-live-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; background: #fff0f0; border: 1px solid #fecaca; border-radius: 100px; font-size: 11px; font-weight: 700; color: #ef4444; margin-bottom: 20px; }
  .ev-live-dot { width: 7px; height: 7px; border-radius: 50%; background: #ef4444; animation: ev-pulse 1.4s ease-in-out infinite; }
  @keyframes ev-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); } }

  .ev-stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 24px; }
  .ev-stat-card { background: #fff; border: 1px solid #e9ecef; border-radius: 13px; padding: 20px 22px; display: flex; align-items: center; gap: 14px; }
  .ev-stat-icon { width: 44px; height: 44px; border-radius: 11px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .ev-stat-label { font-size: 12px; color: #6b7280; font-weight: 500; }
  .ev-stat-value { font-size: 22px; font-weight: 800; color: #111827; }

  .ev-toolbar { display: flex; gap: 10px; align-items: center; margin-bottom: 18px; }
  .ev-search-wrap { position: relative; flex: 1; }
  .ev-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #9ca3af; }
  .ev-search { width: 100%; height: 40px; padding: 0 13px 0 36px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13.5px; color: #111827; outline: none; font-family: inherit; background: #fff; transition: border-color 0.15s; }
  .ev-search:focus { border-color: #1a4fd6; box-shadow: 0 0 0 3px rgba(26,79,214,0.08); }

  .ev-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .ev-card { background: #fff; border: 1px solid #e9ecef; border-radius: 14px; overflow: hidden; transition: box-shadow 0.2s, transform 0.2s; cursor: pointer; }
  .ev-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.08); transform: translateY(-2px); }

  .ev-card-thumb { height: 160px; position: relative; overflow: hidden; }
  .ev-card-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease; }
  .ev-card:hover .ev-card-thumb img { transform: scale(1.05); }
  .ev-card-thumb-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.45) 100%); }
  .ev-card-thumb-label { position: absolute; top: 12px; left: 12px; display: flex; align-items: center; gap: 5px; background: rgba(0,0,0,0.55); color: #fff; padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 600; backdrop-filter: blur(4px); }
  .ev-card-thumb-fallback { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 48px; }

  .ev-card-body { padding: 18px 20px 20px; }
  .ev-card-category { font-size: 11px; font-weight: 600; color: #1a4fd6; margin-bottom: 6px; }
  .ev-card-title { font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 10px; line-height: 1.4; }
  .ev-card-meta { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
  .ev-card-meta-row { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: #6b7280; }
  .ev-card-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 12px; border-top: 1px solid #f1f3f5; }
  .ev-progress-wrap { flex: 1; margin-right: 14px; }
  .ev-progress-label { display: flex; justify-content: space-between; font-size: 11px; color: #9ca3af; margin-bottom: 4px; }
  .ev-progress-track { height: 5px; background: #f1f3f5; border-radius: 100px; overflow: hidden; }
  .ev-progress-fill { height: 100%; border-radius: 100px; background: #1a4fd6; }
  .ev-card-btn { height: 32px; padding: 0 14px; border: 1px solid #e2e8f0; border-radius: 8px; background: #fff; font-size: 12px; font-weight: 600; color: #374151; cursor: pointer; display: flex; align-items: center; gap: 4px; font-family: inherit; white-space: nowrap; transition: all 0.15s; flex-shrink: 0; }
  .ev-card-btn:hover { background: #1a4fd6; color: #fff; border-color: #1a4fd6; }

  .ev-state { margin: 18px 0; padding: 12px 14px; border-radius: 10px; background: #fff; border: 1px solid #e9ecef; color: #374151; font-size: 13px; }
  .ev-state.err { border-color: #fecaca; background: #fff1f2; color: #b91c1c; }

  @media (max-width: 1100px) { .ev-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 700px) { .ev-grid { grid-template-columns: 1fr; } .ev-stat-grid { grid-template-columns: repeat(3, 1fr); } }
`;

/** 날짜/시간 유틸 (백엔드 포맷이 ISO 문자열/LocalDateTime 문자열이어도 최대한 안전하게 표시) */
function safeText(v, fallback = "-") {
  if (v === null || v === undefined) return fallback;
  const s = String(v).trim();
  return s.length ? s : fallback;
}

function formatDateKorean(dt) {
  // dt가 "2026-02-23T09:00:00" 또는 "2026-02-23 09:00:00" 등일 수 있음
  const s = safeText(dt, "");
  if (!s) return "-";
  // 날짜만 뽑기
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return s;
  return `${m[1]}.${m[2]}.${m[3]}`;
}

function formatTimeRange(startAt, endAt) {
  const a = safeText(startAt, "");
  const b = safeText(endAt, "");
  // HH:mm 추출
  const pickHm = (x) => {
    const m = x.match(/(\d{2}):(\d{2})/);
    return m ? `${m[1]}:${m[2]}` : "";
  };
  const ahm = pickHm(a);
  const bhm = pickHm(b);
  if (ahm && bhm) return `${ahm} ~ ${bhm}`;
  if (ahm) return `${ahm}`;
  return "-";
}

/**
 * ✅ 백엔드 이벤트 응답 -> 기존 UI 카드가 기대하는 모양으로 변환
 * - 백엔드 필드는 프로젝트마다 조금씩 달라서 "가능한 후보"를 넓게 잡았음.
 */
function normalizeEvent(raw) {
  const eventId = raw?.eventId ?? raw?.id ?? raw?.event_id;
  const title = raw?.eventName ?? raw?.name ?? raw?.title ?? "행사";
  const location =
    raw?.location ??
    raw?.place ??
    raw?.address ??
    raw?.venue ??
    raw?.eventLocation ??
    "-";

  const startAt =
    raw?.startAt ?? raw?.start_at ?? raw?.startedAt ?? raw?.startDateTime;
  const endAt = raw?.endAt ?? raw?.end_at ?? raw?.endedAt ?? raw?.endDateTime;

  const date = formatDateKorean(startAt);
  const time = formatTimeRange(startAt, endAt);

  const participants =
    raw?.participants ??
    raw?.currentParticipants ??
    raw?.appliedCount ??
    raw?.applyCount ??
    0;

  const capacity =
    raw?.capacity ??
    raw?.maxParticipants ??
    raw?.limitCount ??
    raw?.maxCount ??
    100;

  const category =
    raw?.category ??
    raw?.eventCategory ??
    raw?.type ??
    raw?.eventType ??
    "행사";

  const image =
    raw?.imageUrl ??
    raw?.thumbnailUrl ??
    raw?.bannerUrl ??
    raw?.posterUrl ??
    null;

  const status = raw?.status ?? raw?.eventStatus ?? "ONGOING";

  const fallback = "🐶"; // 프로젝트 컨셉에 맞춰 기본 이모지

  return {
    // ✅ 기존 카드에서 쓰는 필드 유지
    id: Number(eventId),
    category: String(category),
    title: String(title),
    location: String(location),
    time,
    date,
    participants: Number(participants) || 0,
    capacity: Number(capacity) || 0,
    image,
    fallback,
    status: String(status),
    // 모달에서 필요할 수 있는 원본도 붙여둠
    raw,
  };
}

function statusLabel(status) {
  if (status === "ONGOING") return "진행 중";
  if (status === "PLANNED") return "예정";
  if (status === "ENDED") return "종료";
  if (status === "CANCELLED") return "취소";
  return "진행";
}

function EventThumb({ ev }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="ev-card-thumb">
      {ev.image && !imgError ? (
        <img
          src={ev.image}
          alt={ev.title}
          onError={() => setImgError(true)}
          loading="lazy"
        />
      ) : (
        <div
          className="ev-card-thumb-fallback"
          style={{
            background: "linear-gradient(135deg, #1a4fd6 0%, #6366f1 100%)",
          }}
        >
          {ev.fallback}
        </div>
      )}

      <div className="ev-card-thumb-overlay" />

      <div className="ev-card-thumb-label">
        <Zap size={10} />
        {statusLabel(ev.status)}
      </div>
    </div>
  );
}

export default function Current() {
  const [query, setQuery] = useState("");
  const [currentPath, setCurrentPath] = useState("/event/current");
  const [selectedEvent, setSelectedEvent] = useState(null);

  // ✅ 서버 데이터
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ✅ 최초 로딩 시 현재 진행(ONGOING)만 조회
  useEffect(() => {
    let mounted = true;

    const fetchEvents = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        // 백엔드 /api/events
        // eventApi.getEvents(params) 가 ApiResponse<PageResponse>를 반환하는 구조를 기준으로 처리
        const res = await eventApi.getEvents({
          status: "ONGOING",
          page: 0,
          size: 50,
        });

        const content = res?.data?.data?.content ?? res?.data?.data ?? [];
        const list = Array.isArray(content) ? content : [];

        const normalized = list.map(normalizeEvent).filter((e) => !!e.id);
        if (mounted) setEvents(normalized);
      } catch (e) {
        const statusCode = e?.response?.status;
        const msg =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          "행사 목록 조회 실패";
        if (mounted) setErrorMsg(statusCode ? `[${statusCode}] ${msg}` : msg);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchEvents();
    return () => {
      mounted = false;
    };
  }, []);

  // ✅ 검색 필터 (기존 로직 유지 + 대소문자 무시)
  const filtered = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return events;
    return events.filter((e) => {
      const t = (e.title || "").toLowerCase();
      const c = (e.category || "").toLowerCase();
      const l = (e.location || "").toLowerCase();
      return t.includes(q) || c.includes(q) || l.includes(q);
    });
  }, [events, query]);

  // ✅ 통계 (기존 UI 유지)
  const stats = useMemo(() => {
    const totalParticipants = events.reduce(
      (a, e) => a + (e.participants || 0),
      0,
    );
    const avgRate =
      events.length === 0
        ? 0
        : Math.round(
            (events.reduce(
              (a, e) =>
                a + ((e.capacity ? e.participants / e.capacity : 0) || 0),
              0,
            ) /
              events.length) *
              100,
          );

    return {
      count: events.length,
      totalParticipants,
      avgRate,
    };
  }, [events]);

  return (
    <div className="ev-root">
      <style>{styles}</style>

      <PageHeader
        title="현재 진행 행사"
        subtitle={SUBTITLE_MAP[currentPath]}
        categories={SERVICE_CATEGORIES}
        currentPath={currentPath}
        onNavigate={setCurrentPath}
      />

      <main className="ev-container">
        <div className="ev-live-badge">
          <div className="ev-live-dot" />
          LIVE · {stats.count}개 행사 진행 중
        </div>

        {/* 상태 메시지 */}
        {loading && <div className="ev-state">행사 목록 불러오는 중...</div>}
        {errorMsg && <div className="ev-state err">에러: {errorMsg}</div>}

        <div className="ev-stat-grid">
          {[
            {
              label: "진행 중 행사",
              value: `${stats.count}개`,
              icon: <Play size={20} color="#1a4fd6" />,
              bg: "#eff4ff",
            },
            {
              label: "총 참가자",
              value: `${stats.totalParticipants.toLocaleString()}명`,
              icon: <Users size={20} color="#10b981" />,
              bg: "#ecfdf5",
            },
            {
              label: "평균 참석률",
              value: `${stats.avgRate}%`,
              icon: <TrendingUp size={20} color="#f59e0b" />,
              bg: "#fffbeb",
            },
          ].map((s) => (
            <div key={s.label} className="ev-stat-card">
              <div className="ev-stat-icon" style={{ background: s.bg }}>
                {s.icon}
              </div>
              <div>
                <div className="ev-stat-label">{s.label}</div>
                <div className="ev-stat-value">{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="ev-toolbar">
          <div className="ev-search-wrap">
            <Search size={15} className="ev-search-icon" />
            <input
              className="ev-search"
              placeholder="행사명, 카테고리, 장소 검색"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="ev-grid">
          {filtered.map((ev) => {
            const pct =
              ev.capacity > 0
                ? Math.min(
                    100,
                    Math.round((ev.participants / ev.capacity) * 100),
                  )
                : 0;

            return (
              <div
                key={ev.id}
                className="ev-card"
                onClick={() => setSelectedEvent(ev)}
              >
                <EventThumb ev={ev} />

                <div className="ev-card-body">
                  <div className="ev-card-category">{ev.category}</div>
                  <div className="ev-card-title">{ev.title}</div>

                  <div className="ev-card-meta">
                    <div className="ev-card-meta-row">
                      <MapPin size={12} />
                      {safeText(ev.location)}
                    </div>
                    <div className="ev-card-meta-row">
                      <Clock size={12} />
                      {safeText(ev.time)}
                    </div>
                    <div className="ev-card-meta-row">
                      <Calendar size={12} />
                      {safeText(ev.date)}
                    </div>
                  </div>

                  <div className="ev-card-footer">
                    <div className="ev-progress-wrap">
                      <div className="ev-progress-label">
                        <span>
                          참가자 {Number(ev.participants || 0).toLocaleString()}
                          명
                        </span>
                        <span>{pct}%</span>
                      </div>
                      <div className="ev-progress-track">
                        <div
                          className="ev-progress-fill"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    <button
                      className="ev-card-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(ev);
                      }}
                    >
                      상세 <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Detail Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent} // ✅ 기존 그대로 (단, now normalized event)
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
