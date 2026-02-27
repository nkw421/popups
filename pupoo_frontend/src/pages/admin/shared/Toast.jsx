// src/pages/admin/shared/Toast.jsx
// ──────────────────────────────────────────────────
// 에러/성공 토스트 알림 시스템
// ──────────────────────────────────────────────────
// 사용법:
//   import { toast } from "./Toast";
//   toast.error("저장에 실패했습니다.");
//   toast.success("저장되었습니다.");
// ──────────────────────────────────────────────────
import { useState, useEffect, useCallback } from "react";

/* ── 이벤트 기반 토스트 관리 ── */
const TOAST_EVENT = "pupoo:toast";

/** 토스트 표시 함수 */
export const toast = {
  error: (msg) => fire("error", msg),
  success: (msg) => fire("success", msg),
  warn: (msg) => fire("warn", msg),
  info: (msg) => fire("info", msg),
};

function fire(type, message) {
  window.dispatchEvent(
    new CustomEvent(TOAST_EVENT, {
      detail: { id: Date.now(), type, message },
    })
  );
}

/* ── 아이콘 ── */
const icons = {
  error: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  success: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="16 10 11 15 8 12" />
    </svg>
  ),
  warn: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  info: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
};

/* ── 토스트 컨테이너 컴포넌트 ── */
export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const item = e.detail;
      setToasts((prev) => [...prev, item]);

      // 4초 후 자동 제거
      setTimeout(() => remove(item.id), 4000);
    };

    window.addEventListener(TOAST_EVENT, handler);
    return () => window.removeEventListener(TOAST_EVENT, handler);
  }, [remove]);

  if (toasts.length === 0) return null;

  return (
    <>
      <style>{styles}</style>
      <div className="toast-container">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast-item toast-item--${t.type}`}
            onClick={() => remove(t.id)}
          >
            <span className="toast-item__icon">{icons[t.type]}</span>
            <span className="toast-item__msg">{t.message}</span>
            <button className="toast-item__close" onClick={() => remove(t.id)}>
              ✕
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

const styles = `
  .toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 99998;
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 420px;
    width: calc(100% - 40px);
  }

  .toast-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    color: #fff;
    cursor: pointer;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    animation: toastSlideIn 0.3s ease;
  }

  @keyframes toastSlideIn {
    from { opacity: 0; transform: translateX(40px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .toast-item--error   { background: #ef4444; }
  .toast-item--success { background: #22c55e; }
  .toast-item--warn    { background: #f59e0b; color: #1a1a2e; }
  .toast-item--info    { background: #3b82f6; }

  .toast-item__icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }

  .toast-item__msg {
    flex: 1;
    line-height: 1.4;
  }

  .toast-item__close {
    flex-shrink: 0;
    background: none;
    border: none;
    color: inherit;
    opacity: 0.7;
    font-size: 14px;
    cursor: pointer;
    padding: 0 2px;
  }

  .toast-item__close:hover {
    opacity: 1;
  }
`;
