// src/components/auth/AuthOverlay.jsx
// ──────────────────────────────────────────────────
// 401 발생 시 대시보드 블러 + 로그인 팝업 오버레이
// ──────────────────────────────────────────────────
// 사용법:
//   관리자 레이아웃 최상단에 <AuthOverlay /> 하나만 넣으면 됩니다.
//   예) AdminLayout.jsx → return <><AuthOverlay /><Outlet /></>
// ──────────────────────────────────────────────────
import { useState, useEffect, useRef } from "react";
import { onAuthExpired } from "../../app/http/interceptors";
import { axiosInstance } from "../../app/http/axiosInstance";

/* ── 토큰 저장 (기존 프로젝트 패턴) ── */
const TOKEN_KEY = "pupoo_admin_token";
const REFRESH_KEY = "pupoo_admin_refresh";

export default function AuthOverlay() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const emailRef = useRef(null);

  /* ── 401 이벤트 구독 ── */
  useEffect(() => {
    const unsubscribe = onAuthExpired(() => {
      setVisible(true);
      setError("");
      setPassword("");
      setTimeout(() => emailRef.current?.focus(), 200);
    });
    return unsubscribe;
  }, []);

  /* ── 로그인 처리 ── */
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axiosInstance.post("/api/auth/login", {
        email: email.trim(),
        password,
      });

      const data = res?.data?.data ?? res?.data;
      const accessToken = data?.accessToken ?? data?.access_token ?? data?.token;
      const refreshToken = data?.refreshToken ?? data?.refresh_token;

      if (accessToken) {
        localStorage.setItem(TOKEN_KEY, accessToken);
        if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);

        setVisible(false);
        setPassword("");
        setError("");

        // 페이지 새로고침하여 API 재호출 (작업 복구)
        window.location.reload();
      } else {
        setError("로그인 응답에 토큰이 없습니다.");
      }
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else if (status >= 500) {
        setError("서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
      } else {
        setError("로그인에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <>
      <style>{styles}</style>
      <div className="auth-overlay">
        {/* 블러 배경 */}
        <div className="auth-overlay__backdrop" />

        {/* 로그인 모달 */}
        <div className="auth-overlay__modal">
          {/* 아이콘 */}
          <div className="auth-overlay__icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h2 className="auth-overlay__title">세션이 만료되었습니다</h2>
          <p className="auth-overlay__desc">
            계속하려면 다시 로그인해주세요.
          </p>

          {/* 에러 메시지 */}
          {error && (
            <div className="auth-overlay__error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* 로그인 폼 */}
          <form onSubmit={handleLogin} className="auth-overlay__form">
            <div className="auth-overlay__field">
              <label htmlFor="auth-email">이메일</label>
              <input
                ref={emailRef}
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pupoo.com"
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div className="auth-overlay__field">
              <label htmlFor="auth-password">비밀번호</label>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호 입력"
                autoComplete="current-password"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="auth-overlay__btn"
              disabled={loading}
            >
              {loading ? (
                <span className="auth-overlay__spinner" />
              ) : (
                "로그인"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

/* ── 스타일 ── */
const styles = `
  .auth-overlay {
    position: fixed;
    inset: 0;
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: authFadeIn 0.25s ease;
  }

  @keyframes authFadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* 블러 배경 */
  .auth-overlay__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }

  /* 모달 카드 */
  .auth-overlay__modal {
    position: relative;
    width: 100%;
    max-width: 400px;
    margin: 0 20px;
    background: #fff;
    border-radius: 16px;
    padding: 40px 32px 32px;
    box-shadow: 0 25px 60px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05);
    animation: authSlideUp 0.3s ease;
  }

  @keyframes authSlideUp {
    from { opacity: 0; transform: translateY(20px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* 잠금 아이콘 */
  .auth-overlay__icon {
    width: 72px;
    height: 72px;
    margin: 0 auto 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f0f4ff;
    border-radius: 50%;
    color: #4f6ef7;
  }

  /* 텍스트 */
  .auth-overlay__title {
    margin: 0 0 6px;
    font-size: 20px;
    font-weight: 700;
    text-align: center;
    color: #1a1a2e;
  }

  .auth-overlay__desc {
    margin: 0 0 24px;
    font-size: 14px;
    text-align: center;
    color: #6b7280;
  }

  /* 에러 */
  .auth-overlay__error {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    padding: 10px 14px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 10px;
    color: #dc2626;
    font-size: 13px;
  }

  /* 폼 */
  .auth-overlay__form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .auth-overlay__field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .auth-overlay__field label {
    font-size: 13px;
    font-weight: 600;
    color: #374151;
  }

  .auth-overlay__field input {
    height: 44px;
    padding: 0 14px;
    border: 1.5px solid #d1d5db;
    border-radius: 10px;
    font-size: 14px;
    color: #111;
    background: #fff;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .auth-overlay__field input:focus {
    border-color: #4f6ef7;
    box-shadow: 0 0 0 3px rgba(79, 110, 247, 0.12);
  }

  .auth-overlay__field input:disabled {
    background: #f9fafb;
    color: #9ca3af;
  }

  .auth-overlay__field input::placeholder {
    color: #9ca3af;
  }

  /* 버튼 */
  .auth-overlay__btn {
    height: 46px;
    margin-top: 4px;
    border: none;
    border-radius: 10px;
    background: #4f6ef7;
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s, transform 0.1s;
  }

  .auth-overlay__btn:hover:not(:disabled) {
    background: #3b5de7;
  }

  .auth-overlay__btn:active:not(:disabled) {
    transform: scale(0.98);
  }

  .auth-overlay__btn:disabled {
    background: #93a3f8;
    cursor: not-allowed;
  }

  /* 스피너 */
  .auth-overlay__spinner {
    width: 20px;
    height: 20px;
    border: 2.5px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: authSpin 0.6s linear infinite;
  }

  @keyframes authSpin {
    to { transform: rotate(360deg); }
  }
`;
