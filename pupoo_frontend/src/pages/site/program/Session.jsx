import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import {
  SERVICE_CATEGORIES,
  SUBTITLE_MAP,
} from "../constants/programConstants";
import { sessionApi, unwrap } from "../../../api/sessionApi";
import {
  Mic,
  Users,
  MapPin,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  PlayCircle,
  Star,
  UserCircle,
  Video,
  Loader2,
  AlertTriangle,
  Clock,
  X,
} from "lucide-react";

const styles = `
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');
  .ss-root { box-sizing: border-box; font-family: 'Pretendard Variable', 'Pretendard', -apple-system, sans-serif; background: #f8f9fc; min-height: 100vh; }
  .ss-root *, .ss-root *::before, .ss-root *::after { box-sizing: border-box; font-family: inherit; }
  .ss-container { max-width: 1400px; margin: 0 auto; padding: 32px 24px 64px; }

  .ss-live-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; background: #fff0f0; border: 1px solid #fecaca; border-radius: 100px; font-size: 11px; font-weight: 700; color: #ef4444; margin-bottom: 20px; }
  .ss-live-dot { width: 7px; height: 7px; border-radius: 50%; background: #ef4444; animation: ss-pulse 1.4s ease-in-out infinite; }
  @keyframes ss-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); } }

  .ss-stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 20px; }
  .ss-stat-card { background: #fff; border: 1px solid #e9ecef; border-radius: 13px; padding: 20px 22px; display: flex; align-items: center; gap: 14px; }
  .ss-stat-icon { width: 44px; height: 44px; border-radius: 11px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .ss-stat-label { font-size: 12px; color: #6b7280; font-weight: 500; }
  .ss-stat-value { font-size: 22px; font-weight: 800; color: #111827; }

  .ss-card { background: #fff; border: 1px solid #e9ecef; border-radius: 13px; padding: 24px 28px; margin-bottom: 16px; }
  .ss-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; padding-bottom: 14px; border-bottom: 1px solid #f1f3f5; }
  .ss-card-title { font-size: 15px; font-weight: 700; color: #111827; display: flex; align-items: center; gap: 8px; margin: 0; }
  .ss-card-title-icon { width: 24px; height: 24px; border-radius: 6px; background: #fffbeb; display: flex; align-items: center; justify-content: center; }
  .ss-card-tag { font-size: 11px; font-weight: 600; color: #6b7280; background: #f3f4f6; padding: 3px 10px; border-radius: 100px; }

  .ss-filter-bar { display: flex; gap: 8px; margin-bottom: 18px; flex-wrap: wrap; }
  .ss-filter-btn { padding: 7px 16px; border: 1px solid #e9ecef; border-radius: 100px; background: #fff; font-size: 12px; font-weight: 600; color: #6b7280; cursor: pointer; transition: all 0.15s; font-family: inherit; }
  .ss-filter-btn:hover { border-color: #1a4fd6; color: #1a4fd6; }
  .ss-filter-btn.active { background: #1a4fd6; border-color: #1a4fd6; color: #fff; }

  /* 세션 카드 그리드 */
  .ss-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .ss-item { background: #fff; border: 1px solid #e9ecef; border-radius: 14px; overflow: hidden; cursor: pointer; transition: all 0.2s; }
  .ss-item:hover { border-color: #1a4fd6; box-shadow: 0 4px 20px rgba(26,79,214,0.08); transform: translateY(-2px); }
  .ss-item-img { width: 100%; height: 160px; object-fit: cover; display: block; background: linear-gradient(135deg, #EEF2FF, #F0F4FF); }
  .ss-item-placeholder { width: 100%; height: 160px; display: flex; align-items: center; justify-content: center; }
  .ss-item-body { padding: 16px 18px 18px; }
  .ss-item-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
  .ss-item-badge { padding: 3px 10px; border-radius: 100px; font-size: 10px; font-weight: 700; }
  .ss-item-badge.live { background: #ecfdf5; color: #059669; }
  .ss-item-badge.upcoming { background: #fff7ed; color: #d97706; }
  .ss-item-badge.done { background: #f3f4f6; color: #9ca3af; }
  .ss-item-time { font-size: 11px; color: #9ca3af; font-weight: 600; display: flex; align-items: center; gap: 3px; }
  .ss-item-name { font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 4px; line-height: 1.35; }
  .ss-item-desc { font-size: 12px; color: #6b7280; line-height: 1.5; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .ss-item-speaker { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
  .ss-item-meta { display: flex; flex-wrap: wrap; gap: 10px; font-size: 11px; color: #9ca3af; }
  .ss-item-meta-item { display: flex; align-items: center; gap: 3px; }
  .ss-tag-list { display: flex; gap: 4px; margin-top: 10px; }
  .ss-tag { font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 100px; }
  .ss-tag.health { background: #ecfdf5; color: #059669; }
  .ss-tag.training { background: #eff4ff; color: #1a4fd6; }
  .ss-tag.nutrition { background: #fef3c7; color: #d97706; }
  .ss-tag.behavior { background: #fce7f3; color: #ec4899; }
  .ss-tag.care { background: #f5f3ff; color: #8b5cf6; }

  /* 상세 뷰 */
  .ss-detail-overlay { position: fixed; inset: 0; z-index: 5000; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; animation: ss-fadeIn .15s ease; }
  .ss-detail-modal { background: #fff; border-radius: 18px; width: 580px; max-height: 88vh; overflow: auto; box-shadow: 0 24px 60px rgba(0,0,0,0.2); animation: ss-slideUp .25s ease; }
  @keyframes ss-fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes ss-slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

  .ss-loading { display: flex; align-items: center; justify-content: center; padding: 60px 20px; flex-direction: column; gap: 10px; }
  .ss-error { background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 16px 20px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
  @keyframes ss-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  @media (max-width: 768px) {
    .ss-container { padding: 20px 16px 48px; }
    .ss-stat-grid { grid-template-columns: 1fr 1fr; }
    .ss-grid { grid-template-columns: 1fr; }
    .ss-detail-modal { width: 95%; margin: 16px; }
  }
`;

const FILTERS = ["전체", "진행 중", "예정", "종료"];
const FILTER_STATUS = { "진행 중": "live", 예정: "upcoming", 종료: "done" };
const TAG_MAP = {
  health: "건강",
  training: "훈련",
  nutrition: "영양",
  behavior: "행동학",
  care: "케어",
};
const STATUS_LABEL = { live: "진행 중", upcoming: "예정", done: "완료" };
const COLORS = [
  "#10b981",
  "#1a4fd6",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#ef4444",
];
const GRADIENTS = [
  "linear-gradient(135deg, #E0F2FE 0%, #DBEAFE 50%, #EDE9FE 100%)",
  "linear-gradient(135deg, #FCE7F3 0%, #FDE4CF 50%, #FEF3C7 100%)",
  "linear-gradient(135deg, #D1FAE5 0%, #CFFAFE 50%, #E0E7FF 100%)",
  "linear-gradient(135deg, #EDE9FE 0%, #FCE7F3 50%, #FFE4E6 100%)",
  "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 50%, #FCD34D33 100%)",
  "linear-gradient(135deg, #CCFBF1 0%, #A7F3D0 50%, #BBF7D0 100%)",
];

function mapSessionFromApi(p, speakers = [], index = 0) {
  const startAt = p.startAt ? new Date(p.startAt) : null;
  const endAt = p.endAt ? new Date(p.endAt) : null;
  const fmt = (d) =>
    d
      ? `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
      : "";
  const duration = startAt && endAt ? Math.round((endAt - startAt) / 60000) : 0;

  let status = "upcoming";
  if (p.ongoing) status = "live";
  else if (p.ended) status = "done";

  const mainSpeaker = speakers[0] || {};
  const tags = inferTags(p.programTitle, p.description);

  return {
    programId: p.programId,
    name: p.programTitle || "",
    desc: p.description || "",
    speaker: mainSpeaker.speakerName || "-",
    role: mainSpeaker.speakerBio || "",
    time: fmt(startAt),
    endTime: fmt(endAt),
    duration,
    date: startAt
      ? `${startAt.getFullYear()}.${String(startAt.getMonth() + 1).padStart(2, "0")}.${String(startAt.getDate()).padStart(2, "0")}`
      : "",
    zone: p.boothId ? `부스 #${p.boothId}` : "",
    people: 0,
    max: 0,
    rating: null,
    tags,
    status,
    color: COLORS[index % COLORS.length],
    gradient: GRADIENTS[index % GRADIENTS.length],
    imageUrl: p.imageUrl || null,
  };
}

function inferTags(title = "", desc = "") {
  const text = `${title} ${desc}`.toLowerCase();
  const tags = [];
  if (text.includes("건강") || text.includes("검진") || text.includes("의료"))
    tags.push("health");
  if (
    text.includes("훈련") ||
    text.includes("사회화") ||
    text.includes("어질리티")
  )
    tags.push("training");
  if (text.includes("영양") || text.includes("사료") || text.includes("식습관"))
    tags.push("nutrition");
  if (text.includes("행동") || text.includes("불안") || text.includes("교정"))
    tags.push("behavior");
  if (text.includes("케어") || text.includes("재활") || text.includes("노견"))
    tags.push("care");
  return tags.length > 0 ? tags : ["health"];
}

/* ═══════════════════════════════════════════
   세션 상세 모달
   ═══════════════════════════════════════════ */
function SessionDetailModal({ session, onClose }) {
  if (!session) return null;
  const s = session;
  return (
    <div className="ss-detail-overlay" onClick={onClose}>
      <div className="ss-detail-modal" onClick={(e) => e.stopPropagation()}>
        {/* 이미지 */}
        {s.imageUrl ? (
          <img
            src={s.imageUrl}
            alt={s.name}
            style={{
              width: "100%",
              height: 220,
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: 180,
              background:
                s.gradient ||
                "linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 50%, #FFF1F2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Mic
              size={40}
              color={s.color || "#CBD5E1"}
              style={{ opacity: 0.45 }}
            />
          </div>
        )}

        <div style={{ padding: "24px 28px 28px" }}>
          {/* 닫기 */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 16,
            }}
          >
            <div>
              <span
                className={`ss-item-badge ${s.status}`}
                style={{ marginBottom: 8, display: "inline-block" }}
              >
                {STATUS_LABEL[s.status]}
              </span>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#111827",
                  margin: "8px 0 0",
                  lineHeight: 1.3,
                }}
              >
                {s.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: "none",
                background: "#F1F5F9",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <X size={16} color="#64748B" />
            </button>
          </div>

          {/* 설명 */}
          {s.desc && (
            <p
              style={{
                fontSize: 14,
                color: "#6b7280",
                lineHeight: 1.7,
                margin: "0 0 20px",
              }}
            >
              {s.desc}
            </p>
          )}

          {/* 정보 카드 */}
          <div
            style={{
              background: "#F8FAFC",
              borderRadius: 12,
              padding: "16px 20px",
              marginBottom: 20,
            }}
          >
            {[
              {
                icon: <UserCircle size={15} color="#8b5cf6" />,
                label: "강연자",
                value: `${s.speaker}${s.role ? ` · ${s.role}` : ""}`,
              },
              {
                icon: <Clock size={15} color="#1a4fd6" />,
                label: "시간",
                value: `${s.date} ${s.time} ~ ${s.endTime} (${s.duration}분)`,
              },
              {
                icon: <MapPin size={15} color="#f59e0b" />,
                label: "장소",
                value: s.zone || "미정",
              },
            ].map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 0",
                  borderBottom: i < 2 ? "1px solid #E9ECEF" : "none",
                }}
              >
                {r.icon}
                <span
                  style={{
                    fontSize: 12,
                    color: "#9ca3af",
                    fontWeight: 600,
                    width: 50,
                  }}
                >
                  {r.label}
                </span>
                <span
                  style={{ fontSize: 13, color: "#111827", fontWeight: 600 }}
                >
                  {r.value}
                </span>
              </div>
            ))}
          </div>

          {/* 태그 */}
          <div style={{ display: "flex", gap: 6 }}>
            {s.tags.map((t) => (
              <span
                key={t}
                className={`ss-tag ${t}`}
                style={{ fontSize: 11, padding: "3px 10px" }}
              >
                {TAG_MAP[t]}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SessionContent
   ═══════════════════════════════════════════ */
function SessionContent({ eventId }) {
  const [filter, setFilter] = useState("전체");
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detail, setDetail] = useState(null);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await sessionApi.list(eventId, 1, 100);
      const raw = unwrap(res);
      const list = Array.isArray(raw) ? raw : (raw?.content ?? []);
      const sessionList = list.filter(
        (p) => (p.category || "").toUpperCase() === "SESSION",
      );
      const mapped = await Promise.all(
        sessionList.map(async (p, idx) => {
          let speakers = [];
          try {
            const spkRes = await sessionApi.getSpeakers(p.programId);
            const d = unwrap(spkRes);
            speakers = Array.isArray(d) ? d : [];
          } catch {}
          return mapSessionFromApi(p, speakers, idx);
        }),
      );
      setSessions(mapped);
    } catch (e) {
      setError(
        e?.response?.data?.message ||
          e?.message ||
          "세션 목록을 불러오지 못했습니다.",
      );
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    if (eventId) fetchSessions();
  }, [eventId, fetchSessions]);

  const filtered =
    filter === "전체"
      ? sessions
      : sessions.filter((s) => s.status === FILTER_STATUS[filter]);
  const totalSessions = sessions.length;
  const liveSessions = sessions.filter((s) => s.status === "live").length;
  const totalAttendees = sessions.reduce((a, b) => a + b.people, 0);
  const hasLive = liveSessions > 0;

  return (
    <>
      {hasLive && (
        <div className="ss-live-badge">
          <div className="ss-live-dot" />
          LIVE
        </div>
      )}

      <div className="ss-stat-grid">
        {[
          {
            label: "전체 세션",
            value: `${totalSessions}개`,
            icon: <Mic size={20} color="#1a4fd6" />,
            bg: "#eff4ff",
          },
          {
            label: "진행 중",
            value: `${liveSessions}개`,
            icon: <PlayCircle size={20} color="#10b981" />,
            bg: "#ecfdf5",
          },
          {
            label: "총 참석자",
            value: `${totalAttendees}명`,
            icon: <Users size={20} color="#f59e0b" />,
            bg: "#fffbeb",
          },
          {
            label: "평균 평점",
            value: "-",
            icon: <Star size={20} color="#ec4899" />,
            bg: "#fce7f3",
          },
        ].map((s) => (
          <div key={s.label} className="ss-stat-card">
            <div className="ss-stat-icon" style={{ background: s.bg }}>
              {s.icon}
            </div>
            <div>
              <div className="ss-stat-label">{s.label}</div>
              <div className="ss-stat-value">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="ss-error">
          <AlertTriangle size={16} color="#ef4444" />
          <span style={{ fontSize: 13, color: "#dc2626", fontWeight: 600 }}>
            {error}
          </span>
          <button
            onClick={fetchSessions}
            style={{
              marginLeft: "auto",
              padding: "4px 12px",
              borderRadius: 6,
              border: "1px solid #fecaca",
              background: "#fff",
              fontSize: 12,
              fontWeight: 600,
              color: "#dc2626",
              cursor: "pointer",
            }}
          >
            다시 시도
          </button>
        </div>
      )}

      <div className="ss-card">
        <div className="ss-card-header">
          <div className="ss-card-title">
            <div className="ss-card-title-icon">
              <BookOpen size={14} color="#f59e0b" />
            </div>
            세션 ．강연
          </div>
          <span className="ss-card-tag">총 {sessions.length}개</span>
        </div>

        <div className="ss-filter-bar">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`ss-filter-btn${filter === f ? " active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {loading && (
          <div className="ss-loading">
            <Loader2
              size={28}
              color="#1a4fd6"
              style={{ animation: "ss-spin 1s linear infinite" }}
            />
            <span style={{ fontSize: 13, color: "#9ca3af" }}>
              세션 정보를 불러오는 중...
            </span>
          </div>
        )}

        {!loading && (
          <div className="ss-grid">
            {filtered.map((s) => (
              <div
                key={s.programId}
                className="ss-item"
                onClick={() => setDetail(s)}
              >
                {/* 이미지 또는 플레이스홀더 */}
                {s.imageUrl ? (
                  <img src={s.imageUrl} alt={s.name} className="ss-item-img" />
                ) : (
                  <div
                    className="ss-item-placeholder"
                    style={{ background: s.gradient }}
                  >
                    <Mic size={32} color={s.color} style={{ opacity: 0.5 }} />
                  </div>
                )}

                <div className="ss-item-body">
                  <div className="ss-item-top">
                    <span className={`ss-item-badge ${s.status}`}>
                      {STATUS_LABEL[s.status]}
                    </span>
                    <span className="ss-item-time">
                      <Clock size={11} /> {s.time} ~ {s.endTime}
                    </span>
                  </div>

                  <div className="ss-item-name">{s.name}</div>
                  {s.desc && <div className="ss-item-desc">{s.desc}</div>}

                  <div className="ss-item-speaker">
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: "#f3f4f6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <UserCircle size={14} color="#9ca3af" />
                    </div>
                    <div>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#111827",
                        }}
                      >
                        {s.speaker}
                      </span>
                      {s.role && (
                        <span
                          style={{
                            fontSize: 11,
                            color: "#9ca3af",
                            marginLeft: 6,
                          }}
                        >
                          {s.role}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="ss-item-meta">
                    <span className="ss-item-meta-item">
                      <MapPin size={11} /> {s.zone || "미정"}
                    </span>
                    {s.status === "live" && (
                      <span className="ss-item-meta-item">
                        <Video size={11} /> 실시간
                      </span>
                    )}
                  </div>

                  <div className="ss-tag-list">
                    {s.tags.map((t) => (
                      <span key={t} className={`ss-tag ${t}`}>
                        {TAG_MAP[t]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <Mic size={32} color="#d1d5db" style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 14, color: "#6b7280", fontWeight: 600 }}>
              {filter === "전체"
                ? "등록된 세션이 없습니다"
                : `'${filter}' 상태의 세션이 없습니다`}
            </div>
          </div>
        )}
      </div>

      {/* 상세 모달 */}
      {detail && (
        <SessionDetailModal session={detail} onClose={() => setDetail(null)} />
      )}
    </>
  );
}

/* ═══════════════════════════════════════════
   메인
   ═══════════════════════════════════════════ */
export default function Session() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const currentPath = "/program/session";

  // eventId가 없으면 기본값 1 사용 (이벤트 선택 페이지 건너뜀)
  const resolvedEventId = eventId || "1";

  return (
    <div className="ss-root">
      <style>{styles}</style>
      <PageHeader
        title="세션 · 강연"
        subtitle={
          SUBTITLE_MAP[currentPath] ||
          "행사를 선택해 세션과 강연 일정을 확인하세요"
        }
        categories={SERVICE_CATEGORIES}
        currentPath={currentPath}
        onNavigate={(path) => navigate(path)}
      />
      <main className="ss-container">
        <SessionContent eventId={resolvedEventId} />
      </main>
    </div>
  );
}
