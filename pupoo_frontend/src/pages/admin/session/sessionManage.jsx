import { useState, useEffect, useCallback, useRef } from "react";
import {
  Plus,
  X,
  Pencil,
  Trash2,
  ChevronDown,
  Mic,
  Users,
  Clock,
  MapPin,
  AlertTriangle,
  Check,
  Loader2,
  Upload,
  ImageIcon,
} from "lucide-react";
import ds, { statusMap } from "../shared/designTokens";
import { Pill } from "../shared/Components";
import { adminSessionApi, unwrap } from "../../../api/sessionApi";

/* ═══════════════════════════════════════════
   API → 프론트 매핑 함수
   ═══════════════════════════════════════════ */
function mapSessionFromApi(p, speakers = []) {
  const startAt = p.startAt ? new Date(p.startAt) : null;
  const endAt = p.endAt ? new Date(p.endAt) : null;

  const date = startAt
    ? `${startAt.getFullYear()}-${String(startAt.getMonth() + 1).padStart(2, "0")}-${String(startAt.getDate()).padStart(2, "0")}`
    : "";

  const time = startAt
    ? `${String(startAt.getHours()).padStart(2, "0")}:${String(startAt.getMinutes()).padStart(2, "0")}`
    : "";

  const endTime = endAt
    ? `${String(endAt.getHours()).padStart(2, "0")}:${String(endAt.getMinutes()).padStart(2, "0")}`
    : "";

  const duration = startAt && endAt ? Math.round((endAt - startAt) / 60000) : 0;

  let status = "pending";
  if (p.ongoing) status = "active";
  else if (p.ended) status = "ended";
  else if (p.upcoming) status = "pending";

  const speakerName =
    speakers.length > 0 ? speakers.map((s) => s.speakerName).join(", ") : "-";

  return {
    id: `SS-${String(p.programId).padStart(3, "0")}`,
    programId: p.programId,
    eventId: p.eventId,
    boothId: p.boothId,
    name: p.programTitle || "",
    speaker: speakerName,
    speakers,
    date,
    time,
    endTime,
    duration,
    location: p.boothId ? `부스 #${p.boothId}` : "-",
    enrolled: 0,
    capacity: 50,
    status,
    description: p.description || "",
    imageUrl: p.imageUrl || null,
    _visible: true,
  };
}

function mapSessionToCreateApi(form, eventId = 1) {
  const dateStr = form.date || "";
  const startAt = dateStr && form.time ? `${dateStr}T${form.time}:00` : null;
  const endAt =
    dateStr && form.endTime ? `${dateStr}T${form.endTime}:00` : null;

  return {
    eventId: form.eventId || eventId,
    category: "SESSION",
    programTitle: form.name,
    description: form.description || "",
    startAt,
    endAt,
    boothId: form.boothId || null,
    imageUrl: form.imageUrl || null,
  };
}

function mapSessionToUpdateApi(form) {
  const dateStr = form.date || "";
  const startAt = dateStr && form.time ? `${dateStr}T${form.time}:00` : null;
  const endAt =
    dateStr && form.endTime ? `${dateStr}T${form.endTime}:00` : null;

  return {
    category: "SESSION",
    programTitle: form.name,
    description: form.description || "",
    startAt,
    endAt,
    boothId: form.boothId || null,
    imageUrl: form.imageUrl || null,
  };
}

/* ═══════════════════════════════════════════
   전역 스타일
   ═══════════════════════════════════════════ */
const styles = `
@keyframes toastIn{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}
@keyframes rowFadeOut{from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(-30px)}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.row-removing{animation:rowFadeOut .3s ease forwards}
input[type="date"],input[type="time"]{position:relative;cursor:pointer}
input[type="date"]::-webkit-calendar-picker-indicator,
input[type="time"]::-webkit-calendar-picker-indicator{cursor:pointer;opacity:0.5;padding:2px}
input[type="date"]::-webkit-calendar-picker-indicator:hover,
input[type="time"]::-webkit-calendar-picker-indicator:hover{opacity:1}
`;

/* ═══════════════════════════════════════════
   공통 UI 컴포넌트
   ═══════════════════════════════════════════ */
function Checkbox({ checked, onChange, size = 18 }) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onChange?.();
      }}
      style={{
        width: size,
        height: size,
        borderRadius: 5,
        border: checked ? "none" : "1.8px solid #CBD5E1",
        background: checked ? ds.brand : "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all .15s ease",
        flexShrink: 0,
      }}
    >
      {checked && <Check size={size - 6} color="#fff" strokeWidth={3} />}
    </div>
  );
}

function MiniProgress({ value, max }) {
  const pct = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0;
  const color = pct >= 90 ? "#EF4444" : pct >= 70 ? "#F59E0B" : ds.brand;
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 100 }}
    >
      <div
        style={{
          flex: 1,
          height: 5,
          borderRadius: 3,
          background: "#F1F5F9",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            borderRadius: 3,
            background: color,
            transition: "width .3s ease",
          }}
        />
      </div>
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          color,
          minWidth: 32,
          textAlign: "right",
        }}
      >
        {pct}%
      </span>
    </div>
  );
}

function Toast({ msg, type = "success", onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);
  const bg =
    type === "success" ? "#10B981" : type === "error" ? "#EF4444" : "#F59E0B";
  return (
    <div
      style={{
        position: "fixed",
        top: 24,
        right: 24,
        zIndex: 9999,
        background: bg,
        color: "#fff",
        padding: "12px 22px",
        borderRadius: 10,
        fontSize: 13.5,
        fontWeight: 600,
        fontFamily: ds.ff,
        boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
        animation: "toastIn .25s ease",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      {type === "success" ? "✓" : "✕"} {msg}
    </div>
  );
}

function Overlay({ children, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 5000,
        background: "rgba(0,0,0,0.32)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "fadeIn .15s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 16,
          width: 500,
          maxHeight: "85vh",
          overflow: "auto",
          boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
          animation: "slideUp .2s ease",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function ConfirmModal({ title, msg, onConfirm, onCancel }) {
  return (
    <Overlay onClose={onCancel}>
      <div style={{ padding: "28px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "#FEF2F2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AlertTriangle size={18} color="#EF4444" />
          </div>
          <h3
            style={{ fontSize: 16, fontWeight: 800, color: ds.ink, margin: 0 }}
          >
            {title}
          </h3>
        </div>
        <p
          style={{
            fontSize: 13.5,
            color: "#64748B",
            lineHeight: 1.6,
            whiteSpace: "pre-line",
            margin: "0 0 24px",
          }}
        >
          {msg}
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button
            onClick={onCancel}
            style={{
              padding: "9px 20px",
              borderRadius: 8,
              border: "1px solid #E2E8F0",
              background: "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: ds.ff,
              color: "#64748B",
            }}
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "9px 20px",
              borderRadius: 8,
              border: "none",
              background: "#EF4444",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: ds.ff,
            }}
          >
            삭제
          </button>
        </div>
      </div>
    </Overlay>
  );
}

function Field({ label, children, required }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#64748B",
          marginBottom: 7,
          display: "block",
          letterSpacing: 0.2,
        }}
      >
        {label} {required && <span style={{ color: "#EF4444" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 9,
  border: "1.5px solid #E2E8F0",
  fontSize: 13.5,
  fontFamily: ds.ff,
  color: ds.ink,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color .15s, box-shadow .15s",
  background: "#fff",
};
const inputFocus = (e) => {
  e.target.style.borderColor = ds.brand;
  e.target.style.boxShadow = `0 0 0 3px ${ds.brand}15`;
};
const inputBlur = (e) => {
  e.target.style.borderColor = "#E2E8F0";
  e.target.style.boxShadow = "none";
};

/* ═══════════════════════════════════════════
   이미지 업로드 컴포넌트
   ═══════════════════════════════════════════ */
function ImageUploader({ value, onChange }) {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(value || null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      onChange?.(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange?.(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        style={{ display: "none" }}
      />
      {preview ? (
        <div
          style={{
            position: "relative",
            borderRadius: 10,
            overflow: "hidden",
            border: "1.5px solid #E2E8F0",
          }}
        >
          <img
            src={preview}
            alt="세션 이미지"
            style={{
              width: "100%",
              height: 140,
              objectFit: "cover",
              display: "block",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              display: "flex",
              gap: 4,
            }}
          >
            <button
              onClick={() => fileRef.current?.click()}
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                border: "none",
                background: "rgba(255,255,255,0.9)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
              }}
            >
              <Upload size={12} color="#64748B" />
            </button>
            <button
              onClick={handleRemove}
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                border: "none",
                background: "rgba(255,255,255,0.9)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
              }}
            >
              <X size={12} color="#EF4444" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileRef.current?.click()}
          style={{
            border: "1.5px dashed #CBD5E1",
            borderRadius: 10,
            padding: "24px 16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            transition: "all .15s",
            background: "#FAFBFC",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = ds.brand;
            e.currentTarget.style.background = `${ds.brand}05`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#CBD5E1";
            e.currentTarget.style.background = "#FAFBFC";
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              background: "#F1F5F9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ImageIcon size={16} color="#94A3B8" />
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8" }}>
            이미지 업로드
          </span>
          <span style={{ fontSize: 10.5, color: "#CBD5E1" }}>
            JPG, PNG (권장 800×400)
          </span>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   슬라이드 패널 (등록 / 수정)
   ═══════════════════════════════════════════ */
function SlidePanel({ item, onSave, onClose, isEdit }) {
  const [form, setForm] = useState(
    item || {
      name: "",
      speaker: "",
      date: "",
      time: "10:00",
      endTime: "11:00",
      location: "",
      status: "pending",
      description: "",
      imageUrl: null,
    },
  );
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.name || !form.date) {
      setErr("강연명, 일시는 필수입니다.");
      return;
    }
    if (!form.time || !form.endTime) {
      setErr("시작 시간과 종료 시간을 입력해주세요.");
      return;
    }
    if (form.time >= form.endTime) {
      setErr("종료 시간은 시작 시간 이후여야 합니다.");
      return;
    }
    setSaving(true);
    setErr("");
    try {
      await onSave(form);
    } catch (e) {
      setErr(
        e?.response?.data?.message || e?.message || "저장에 실패했습니다.",
      );
    } finally {
      setSaving(false);
    }
  };

  // 소요시간 자동 계산
  const calcDuration = () => {
    if (!form.time || !form.endTime) return "-";
    const [sh, sm] = form.time.split(":").map(Number);
    const [eh, em] = form.endTime.split(":").map(Number);
    const diff = eh * 60 + em - (sh * 60 + sm);
    return diff > 0 ? `${diff}분` : "-";
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 4999,
          background: "rgba(0,0,0,0.15)",
          animation: "fadeIn .15s ease",
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 5000,
          width: 460,
          background: "#fff",
          boxShadow: "-4px 0 30px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          animation: "slideIn .25s cubic-bezier(.22,1,.36,1)",
        }}
      >
        {/* 헤더 */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #F1F5F9",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div>
            <h3
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: ds.ink,
                margin: 0,
              }}
            >
              {isEdit ? "세션 수정" : "새 세션 등록"}
            </h3>
            <p style={{ fontSize: 11.5, color: "#94A3B8", margin: "3px 0 0" }}>
              {isEdit ? "세션 정보를 수정합니다" : "새로운 세션을 등록합니다"}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              border: "1px solid #E2E8F0",
              background: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={14} color="#94A3B8" />
          </button>
        </div>

        {/* 폼 */}
        <div style={{ flex: 1, overflow: "auto", padding: "24px" }}>
          {err && (
            <div
              style={{
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: 9,
                padding: "10px 14px",
                fontSize: 12.5,
                color: "#DC2626",
                marginBottom: 18,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <AlertTriangle size={14} /> {err}
            </div>
          )}

          {/* 세션 이미지 */}
          <Field label="세션 이미지">
            <ImageUploader
              value={form.imageUrl}
              onChange={(v) => set("imageUrl", v)}
            />
          </Field>

          {/* 강연명 */}
          <Field label="강연명" required>
            <input
              style={inputStyle}
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              onFocus={inputFocus}
              onBlur={inputBlur}
              placeholder="예: 반려견 행동학 기초"
            />
          </Field>

          {/* 강연자 + 장소 */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <Field label="강연자">
              <input
                style={inputStyle}
                value={form.speaker}
                onChange={(e) => set("speaker", e.target.value)}
                onFocus={inputFocus}
                onBlur={inputBlur}
                placeholder="강연자명"
              />
            </Field>
            <Field label="장소">
              <input
                style={inputStyle}
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                onFocus={inputFocus}
                onBlur={inputBlur}
                placeholder="세미나실 A"
              />
            </Field>
          </div>

          {/* 일시 + 시간 (2열) */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <Field label="일시" required>
              <input
                type="date"
                style={{ ...inputStyle, cursor: "pointer" }}
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                onFocus={inputFocus}
                onBlur={inputBlur}
              />
            </Field>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 7,
                }}
              >
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#64748B",
                    letterSpacing: 0.2,
                  }}
                >
                  소요 시간
                </label>
                <span
                  style={{ fontSize: 12, fontWeight: 700, color: ds.brand }}
                >
                  {calcDuration()}
                </span>
              </div>
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 9,
                  border: "1.5px solid #F1F5F9",
                  background: "#F8FAFC",
                  fontSize: 13.5,
                  color: "#94A3B8",
                  textAlign: "center",
                }}
              >
                자동 계산
              </div>
            </div>
          </div>

          {/* 시작시간 + 종료시간 (2열) */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <Field label="시작 시간" required>
              <input
                type="time"
                style={{ ...inputStyle, cursor: "pointer" }}
                value={form.time}
                onChange={(e) => set("time", e.target.value)}
                onFocus={inputFocus}
                onBlur={inputBlur}
              />
            </Field>
            <Field label="종료 시간" required>
              <input
                type="time"
                style={{ ...inputStyle, cursor: "pointer" }}
                value={form.endTime}
                onChange={(e) => set("endTime", e.target.value)}
                onFocus={inputFocus}
                onBlur={inputBlur}
              />
            </Field>
          </div>

          {/* 설명 */}
          <Field label="설명">
            <textarea
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
              value={form.description || ""}
              onChange={(e) => set("description", e.target.value)}
              onFocus={inputFocus}
              onBlur={inputBlur}
              placeholder="세션 설명을 입력하세요"
            />
          </Field>
        </div>

        {/* 하단 버튼 */}
        <div
          style={{
            padding: "14px 24px",
            borderTop: "1px solid #F1F5F9",
            display: "flex",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <button
            onClick={onClose}
            disabled={saving}
            style={{
              flex: 1,
              padding: "11px 0",
              borderRadius: 9,
              border: "1px solid #E2E8F0",
              background: "#fff",
              fontSize: 13.5,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: ds.ff,
              color: "#64748B",
            }}
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              flex: 1,
              padding: "11px 0",
              borderRadius: 9,
              border: "none",
              background: saving ? "#94A3B8" : ds.brand,
              color: "#fff",
              fontSize: 13.5,
              fontWeight: 700,
              cursor: saving ? "not-allowed" : "pointer",
              fontFamily: ds.ff,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            {saving && (
              <Loader2
                size={14}
                style={{ animation: "spin 1s linear infinite" }}
              />
            )}
            {isEdit ? "수정 완료" : "등록하기"}
          </button>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   상세 모달
   ═══════════════════════════════════════════ */
function DetailModal({ item, onClose, onEdit, onDelete }) {
  const st = statusMap[item.status];
  return (
    <Overlay onClose={onClose}>
      <div style={{ padding: "28px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h3
            style={{ fontSize: 16, fontWeight: 800, color: ds.ink, margin: 0 }}
          >
            세션 상세
          </h3>
          <button
            onClick={onClose}
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              border: "none",
              background: "#F1F5F9",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={14} color="#94A3B8" />
          </button>
        </div>

        {/* 이미지 */}
        {item.imageUrl && (
          <div
            style={{ borderRadius: 12, overflow: "hidden", marginBottom: 16 }}
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              style={{
                width: "100%",
                height: 180,
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        )}

        <div
          style={{
            background: "#F8FAFC",
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#94A3B8",
                fontFamily: "monospace",
              }}
            >
              {item.id}
            </span>
            <Pill color={st.c} bg={st.bg}>
              {st.l}
            </Pill>
          </div>
          <h4
            style={{
              fontSize: 17,
              fontWeight: 800,
              color: ds.ink,
              margin: "0 0 14px",
            }}
          >
            {item.name}
          </h4>
          {[
            { l: "강연자", v: item.speaker },
            {
              l: "일시",
              v: `${(item.date || "").replace(/-/g, ".")} ${item.time} ~ ${item.endTime}`,
            },
            { l: "소요 시간", v: `${item.duration}분` },
            { l: "장소", v: item.location },
          ].map((r) => (
            <div
              key={r.l}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "9px 0",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <span style={{ fontSize: 13, color: "#64748B", fontWeight: 500 }}>
                {r.l}
              </span>
              <span style={{ fontSize: 13, color: ds.ink, fontWeight: 600 }}>
                {r.v}
              </span>
            </div>
          ))}
          {item.description && (
            <div style={{ marginTop: 14 }}>
              <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 600 }}>
                설명
              </span>
              <p
                style={{
                  fontSize: 13,
                  color: "#475569",
                  lineHeight: 1.6,
                  marginTop: 6,
                }}
              >
                {item.description}
              </p>
            </div>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button
            onClick={() => {
              onClose();
              onDelete(item);
            }}
            style={{
              padding: "9px 16px",
              borderRadius: 8,
              border: "1px solid #FECACA",
              background: "#FEF2F2",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: ds.ff,
              color: "#DC2626",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Trash2 size={13} /> 삭제
          </button>
          <button
            onClick={() => {
              onClose();
              onEdit(item);
            }}
            style={{
              padding: "9px 16px",
              borderRadius: 8,
              border: "none",
              background: ds.brand,
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: ds.ff,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Pencil size={13} /> 수정하기
          </button>
        </div>
      </div>
    </Overlay>
  );
}

/* ═══════════════════════════════════════════
   통계 / 로딩 / 에러
   ═══════════════════════════════════════════ */
function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: "14px 16px",
        border: "1px solid #F1F5F9",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 9,
          background: `${color}10`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={16} color={color} strokeWidth={2.2} />
      </div>
      <div>
        <div
          style={{
            fontSize: 10.5,
            color: "#94A3B8",
            fontWeight: 600,
            marginBottom: 1,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: ds.ink,
            letterSpacing: -0.5,
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 20px",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <Loader2
        size={32}
        color={ds.brand}
        style={{ animation: "spin 1s linear infinite" }}
      />
      <span style={{ fontSize: 13, color: "#94A3B8", fontWeight: 500 }}>
        세션 데이터를 불러오는 중...
      </span>
    </div>
  );
}

function ErrorBanner({ message, onRetry }) {
  return (
    <div
      style={{
        background: "#FEF2F2",
        border: "1px solid #FECACA",
        borderRadius: 12,
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <AlertTriangle size={18} color="#EF4444" />
        <span style={{ fontSize: 13.5, color: "#DC2626", fontWeight: 600 }}>
          {message}
        </span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: "6px 14px",
            borderRadius: 7,
            border: "1px solid #FECACA",
            background: "#fff",
            fontSize: 12,
            fontWeight: 600,
            color: "#DC2626",
            cursor: "pointer",
            fontFamily: ds.ff,
          }}
        >
          다시 시도
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   메인 컴포넌트
   ═══════════════════════════════════════════ */
const DEFAULT_EVENT_ID = 1;

export default function SessionManage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null);
  const [panel, setPanel] = useState(null);
  const [toast, setToast] = useState(null);
  const [removing, setRemoving] = useState(null);
  const [selected, setSelected] = useState(new Set());

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminSessionApi.list(DEFAULT_EVENT_ID, 1, 100);
      const raw = unwrap(res);
      const list = Array.isArray(raw) ? raw : (raw?.content ?? []);
      const sessions = list.filter(
        (p) => (p.category || "").toUpperCase() === "SESSION",
      );
      const mapped = await Promise.all(
        sessions.map(async (p) => {
          let speakers = [];
          try {
            const spkRes = await adminSessionApi.getSpeakers(p.programId);
            const d = unwrap(spkRes);
            speakers = Array.isArray(d) ? d : [];
          } catch {}
          return mapSessionFromApi(p, speakers);
        }),
      );
      setItems(mapped);
    } catch (e) {
      setError(
        e?.response?.data?.message ||
          e?.message ||
          "세션 목록을 불러오지 못했습니다.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const rows = items.filter((e) => e._visible);
  const totalSessions = rows.length;
  const activeSessions = rows.filter((e) => e.status === "active").length;
  const totalEnrolled = rows.reduce((a, b) => a + b.enrolled, 0);
  const totalCapacity = rows.reduce((a, b) => a + b.capacity, 0);

  const isAllSelected =
    rows.length > 0 && rows.every((r) => selected.has(r.id));
  const hasSelected = selected.size > 0;
  const toggleAll = () => {
    if (isAllSelected) setSelected(new Set());
    else setSelected(new Set(rows.map((r) => r.id)));
  };
  const toggleOne = (id) => {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const handleCreate = async (form) => {
    const payload = mapSessionToCreateApi(form, DEFAULT_EVENT_ID);
    await adminSessionApi.create(payload);
    setPanel(null);
    showToast("새 세션이 등록되었습니다.");
    fetchSessions();
  };
  const handleUpdate = async (form) => {
    const payload = mapSessionToUpdateApi(form);
    await adminSessionApi.update(form.programId, payload);
    setPanel(null);
    showToast("세션이 수정되었습니다.");
    fetchSessions();
  };
  const handleDelete = async () => {
    const item = modal.item;
    setModal(null);
    try {
      await adminSessionApi.delete(item.programId);
      setRemoving(item.id);
      setTimeout(() => {
        setItems((p) =>
          p.map((e) => (e.id === item.id ? { ...e, _visible: false } : e)),
        );
        setRemoving(null);
        setSelected((prev) => {
          const n = new Set(prev);
          n.delete(item.id);
          return n;
        });
        showToast("세션이 삭제되었습니다.");
      }, 300);
    } catch (e) {
      showToast(e?.response?.data?.message || "삭제에 실패했습니다.", "error");
    }
  };
  const handleBulkDelete = async () => {
    const ids = [...selected];
    setModal(null);
    try {
      const targets = items.filter((i) => ids.includes(i.id));
      await Promise.all(
        targets.map((t) => adminSessionApi.delete(t.programId)),
      );
      setItems((p) =>
        p.map((e) => (ids.includes(e.id) ? { ...e, _visible: false } : e)),
      );
      setSelected(new Set());
      showToast(`${ids.length}건의 세션이 삭제되었습니다.`);
    } catch {
      showToast("일부 삭제에 실패했습니다.", "error");
    }
  };
  const handleDeleteAll = async () => {
    const allRows = [...rows];
    setModal(null);
    try {
      await Promise.all(
        allRows.map((t) => adminSessionApi.delete(t.programId)),
      );
      setItems((p) =>
        p.map((e) =>
          allRows.some((r) => r.id === e.id) ? { ...e, _visible: false } : e,
        ),
      );
      setSelected(new Set());
      showToast(`${allRows.length}건의 세션이 삭제되었습니다.`);
    } catch {
      showToast("일부 삭제에 실패했습니다.", "error");
    }
  };

  return (
    <div>
      <style>{styles}</style>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <StatCard
          icon={Mic}
          label="전체 세션"
          value={totalSessions}
          color={ds.brand}
        />
        <StatCard
          icon={Clock}
          label="진행 중"
          value={activeSessions}
          color="#10B981"
        />
        <StatCard
          icon={Users}
          label="총 등록 인원"
          value={totalEnrolled}
          color="#8B5CF6"
        />
        <StatCard
          icon={MapPin}
          label="총 정원"
          value={totalCapacity}
          color="#F59E0B"
        />
      </div>

      {error && (
        <div style={{ marginBottom: 16 }}>
          <ErrorBanner message={error} onRetry={fetchSessions} />
        </div>
      )}

      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          border: "1px solid #F1F5F9",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "12px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #F1F5F9",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: ds.ink }}>
              세션/강연 목록
            </span>
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                color: "#94A3B8",
                background: "#F1F5F9",
                padding: "2px 8px",
                borderRadius: 5,
              }}
            >
              {rows.length}
            </span>
            {hasSelected && (
              <span
                style={{
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: ds.brand,
                  background: `${ds.brand}0C`,
                  padding: "4px 10px",
                  borderRadius: 6,
                  animation: "fadeIn .15s ease",
                }}
              >
                {selected.size}건 선택됨
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {hasSelected && (
              <button
                onClick={() => setModal({ type: "bulkDelete" })}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "6px 12px",
                  borderRadius: 7,
                  border: "1px solid #FECACA",
                  background: "#FEF2F2",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#DC2626",
                  cursor: "pointer",
                  fontFamily: ds.ff,
                }}
              >
                <Trash2 size={12} /> 선택 삭제 ({selected.size})
              </button>
            )}
            {hasSelected && rows.length > 0 && (
              <button
                onClick={() => setModal({ type: "deleteAll" })}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "6px 12px",
                  borderRadius: 7,
                  border: "1px solid #E2E8F0",
                  background: "#fff",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#64748B",
                  cursor: "pointer",
                  fontFamily: ds.ff,
                }}
              >
                <Trash2 size={12} /> 전체 삭제
              </button>
            )}
            <button
              onClick={() => setPanel({ type: "create" })}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "6px 14px",
                borderRadius: 7,
                border: "none",
                background: ds.brand,
                color: "#fff",
                fontSize: 12.5,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: ds.ff,
              }}
            >
              <Plus size={13} strokeWidth={2.5} /> 세션 등록
            </button>
          </div>
        </div>

        {loading && <LoadingSpinner />}

        {!loading && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                <th style={{ width: 44, padding: "10px 14px" }}>
                  <Checkbox checked={isAllSelected} onChange={toggleAll} />
                </th>
                {[
                  { label: "강연명", w: "25%" },
                  { label: "강연자", w: 120 },
                  { label: "일시", w: 100 },
                  { label: "시간", w: 120 },
                  { label: "장소", w: 100 },
                  { label: "상태", w: 72 },
                  { label: "", w: 150 },
                ].map((c, i) => (
                  <th
                    key={i}
                    style={{
                      padding: "10px 14px",
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: "#94A3B8",
                      textAlign: "left",
                      letterSpacing: 0.3,
                      ...(c.w ? { width: c.w } : {}),
                    }}
                  >
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const st = statusMap[r.status];
                return (
                  <tr
                    key={r.id}
                    className={removing === r.id ? "row-removing" : ""}
                    onClick={() => setModal({ type: "detail", item: r })}
                    style={{
                      borderBottom: "1px solid #F8FAFC",
                      cursor: "pointer",
                      transition: "background .1s",
                      background: selected.has(r.id)
                        ? `${ds.brand}06`
                        : "transparent",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = selected.has(r.id)
                        ? `${ds.brand}0A`
                        : "#F4F6F8")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = selected.has(r.id)
                        ? `${ds.brand}06`
                        : "transparent")
                    }
                  >
                    <td style={{ width: 44, padding: "11px 14px" }}>
                      <Checkbox
                        checked={selected.has(r.id)}
                        onChange={() => toggleOne(r.id)}
                      />
                    </td>
                    <td style={{ padding: "11px 14px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        {r.imageUrl && (
                          <img
                            src={r.imageUrl}
                            alt=""
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 7,
                              objectFit: "cover",
                              flexShrink: 0,
                            }}
                          />
                        )}
                        <div>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: ds.ink,
                            }}
                          >
                            {r.name}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: "#94A3B8",
                              fontFamily: "monospace",
                              marginTop: 1,
                            }}
                          >
                            {r.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "11px 14px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 13,
                          color: "#475569",
                        }}
                      >
                        <Mic size={12} color="#8B5CF6" /> {r.speaker}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "11px 14px",
                        fontSize: 13,
                        color: "#475569",
                      }}
                    >
                      {(r.date || "").replace(/-/g, ".")}
                    </td>
                    <td
                      style={{
                        padding: "11px 14px",
                        fontSize: 13,
                        color: "#475569",
                      }}
                    >
                      {r.time} ~ {r.endTime}
                    </td>
                    <td
                      style={{
                        padding: "11px 14px",
                        fontSize: 13,
                        color: "#64748B",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <MapPin size={12} color="#94A3B8" /> {r.location}
                      </span>
                    </td>
                    <td style={{ padding: "11px 14px" }}>
                      <Pill color={st.c} bg={st.bg}>
                        {st.l}
                      </Pill>
                    </td>
                    <td style={{ padding: "11px 10px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 3,
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setModal({ type: "detail", item: r });
                          }}
                          style={{
                            padding: "4px 9px",
                            borderRadius: 6,
                            border: "1px solid #E2E8F0",
                            background: "#fff",
                            fontSize: 11,
                            fontWeight: 600,
                            color: "#64748B",
                            cursor: "pointer",
                            fontFamily: ds.ff,
                            lineHeight: 1.2,
                          }}
                        >
                          상세
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPanel({ type: "edit", item: r });
                          }}
                          style={{
                            padding: "4px 9px",
                            borderRadius: 6,
                            border: `1px solid ${ds.brand}25`,
                            background: `${ds.brand}06`,
                            fontSize: 11,
                            fontWeight: 600,
                            color: ds.brand,
                            cursor: "pointer",
                            fontFamily: ds.ff,
                            lineHeight: 1.2,
                          }}
                        >
                          수정
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setModal({ type: "delete", item: r });
                          }}
                          style={{
                            padding: "4px 9px",
                            borderRadius: 6,
                            border: "1px solid #FECACA50",
                            background: "#FEF2F208",
                            fontSize: 11,
                            fontWeight: 600,
                            color: "#EF4444",
                            cursor: "pointer",
                            fontFamily: ds.ff,
                            lineHeight: 1.2,
                            opacity: 0.7,
                          }}
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {!loading && rows.length === 0 && !error && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <Mic size={36} color="#CBD5E1" style={{ marginBottom: 12 }} />
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#64748B",
                marginBottom: 4,
              }}
            >
              등록된 세션이 없습니다
            </div>
            <div style={{ fontSize: 12.5, color: "#94A3B8" }}>
              새 세션을 등록해보세요
            </div>
          </div>
        )}
      </div>

      {panel?.type === "create" && (
        <SlidePanel onSave={handleCreate} onClose={() => setPanel(null)} />
      )}
      {panel?.type === "edit" && (
        <SlidePanel
          item={panel.item}
          isEdit
          onSave={handleUpdate}
          onClose={() => setPanel(null)}
        />
      )}
      {modal?.type === "detail" && (
        <DetailModal
          item={modal.item}
          onClose={() => setModal(null)}
          onEdit={(item) => {
            setModal(null);
            setPanel({ type: "edit", item });
          }}
          onDelete={(item) => setModal({ type: "delete", item })}
        />
      )}
      {modal?.type === "delete" && (
        <ConfirmModal
          title="세션 삭제"
          msg={`"${modal.item.name}" 세션을 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.`}
          onConfirm={handleDelete}
          onCancel={() => setModal(null)}
        />
      )}
      {modal?.type === "bulkDelete" && (
        <ConfirmModal
          title="선택 세션 삭제"
          msg={`선택한 ${selected.size}건의 세션을 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.`}
          onConfirm={handleBulkDelete}
          onCancel={() => setModal(null)}
        />
      )}
      {modal?.type === "deleteAll" && (
        <ConfirmModal
          title="전체 세션 삭제"
          msg={`현재 목록의 ${rows.length}건 세션을 모두 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.`}
          onConfirm={handleDeleteAll}
          onCancel={() => setModal(null)}
        />
      )}
      {toast && (
        <Toast
          msg={toast.msg}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}
    </div>
  );
}
