import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import { tokenStore } from "../../../../app/http/tokenStore";
import { useAuth } from "../AuthProvider";

export default function KakaoJoin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const initial = useMemo(() => {
    const state = location.state || {};
    const socialProviderUid =
      state.socialProviderUid || sessionStorage.getItem("kakao_provider_uid") || "";
    const email = state.email ?? sessionStorage.getItem("kakao_email") ?? "";
    const nickname =
      state.nickname ?? sessionStorage.getItem("kakao_nickname") ?? "";
    const socialProvider = state.socialProvider || "KAKAO";

    return { socialProviderUid, email, nickname, socialProvider };
  }, [location.state]);

  const [email, setEmail] = useState(initial.email);
  const [nickname, setNickname] = useState(initial.nickname);
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState("FORM");
  const [signupKey, setSignupKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const normalizeDigits = (value) => (value || "").replace(/[^0-9]/g, "");

  const pickErrorMessage = (err) =>
    err?.response?.data?.error?.message ||
    err?.response?.data?.message ||
    err?.message ||
    "Request failed.";

  const validateForm = () => {
    const emailTrim = (email || "").trim();
    const nicknameTrim = (nickname || "").trim();
    const phoneDigits = normalizeDigits(phone);

    if (!initial.socialProviderUid) {
      throw new Error("Missing social provider UID. Please restart Kakao signup.");
    }
    if (!emailTrim) throw new Error("Email is required.");
    if (!nicknameTrim) throw new Error("Nickname is required.");
    if (!phoneDigits) throw new Error("Phone is required.");
    if (phoneDigits.length !== 11) {
      throw new Error("Phone number must be 11 digits.");
    }

    return { emailTrim, nicknameTrim, phoneDigits };
  };

  const handleStart = async () => {
    setError("");

    let values;
    try {
      values = validateForm();
    } catch (err) {
      setError(err?.message ?? "Invalid input.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        signupType: "SOCIAL",
        socialProvider: initial.socialProvider || "KAKAO",
        socialProviderUid: initial.socialProviderUid,
        email: values.emailTrim,
        nickname: values.nicknameTrim,
        phone: values.phoneDigits,
      };

      const res = await authApi.signupStart(payload);

      const key = res?.signupKey;
      if (!key) throw new Error("signupKey is missing from response.");

      setSignupKey(key);
      setStep("OTP");

      if (res?.devOtp) setOtpCode(String(res.devOtp));
    } catch (err) {
      setError(pickErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");

    const phoneDigits = normalizeDigits(phone);
    const otpTrim = (otpCode || "").trim();

    if (!signupKey) {
      setError("signupKey is missing. Please restart signup.");
      return;
    }
    if (!phoneDigits) {
      setError("Phone is required.");
      return;
    }
    if (phoneDigits.length !== 11) {
      setError("Phone number must be 11 digits.");
      return;
    }
    if (!otpTrim) {
      setError("OTP code is required.");
      return;
    }

    setLoading(true);
    try {
      await authApi.signupVerifyOtp({
        signupKey,
        phone: phoneDigits,
        otpCode: otpTrim,
      });

      const res = await authApi.signupComplete({ signupKey });
      const accessToken =
        res?.accessToken || res?.data?.accessToken || res?.data?.data?.accessToken;

      if (!accessToken) {
        throw new Error("accessToken is missing from response.");
      }

      tokenStore.setAccess(accessToken);
      login();

      const redirectTo = sessionStorage.getItem("post_login_redirect") || "/";
      sessionStorage.removeItem("post_login_redirect");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(pickErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!initial.socialProviderUid) {
    return (
      <div style={{ maxWidth: 520, margin: "60px auto", padding: 20 }}>
        <h2>Kakao Signup</h2>
        <p style={{ marginTop: 12, color: "#a00" }}>
          Missing social signup context. Please restart Kakao signup.
        </p>
        <button
          type="button"
          onClick={() => navigate("/auth/login", { replace: true })}
          style={{
            width: "100%",
            height: 44,
            marginTop: 14,
            borderRadius: 8,
            border: "1px solid #ddd",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 520, margin: "60px auto", padding: 20 }}>
      <h2 style={{ textAlign: "center" }}>Kakao Social Signup</h2>

      {error && <p style={{ color: "#a00", marginTop: 10 }}>{error}</p>}

      {step === "FORM" && (
        <div style={{ marginTop: 16 }}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            disabled={loading}
            style={{
              width: "100%",
              height: 44,
              padding: "0 12px",
              borderRadius: 8,
              border: "1px solid #ddd",
              marginBottom: 10,
            }}
          />

          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Nickname"
            disabled={loading}
            style={{
              width: "100%",
              height: 44,
              padding: "0 12px",
              borderRadius: 8,
              border: "1px solid #ddd",
              marginBottom: 10,
            }}
          />

          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone (OTP)"
            disabled={loading}
            style={{
              width: "100%",
              height: 44,
              padding: "0 12px",
              borderRadius: 8,
              border: "1px solid #ddd",
            }}
          />

          <button
            type="button"
            onClick={handleStart}
            disabled={loading}
            style={{
              width: "100%",
              height: 48,
              marginTop: 14,
              borderRadius: 8,
              border: "none",
              background: "#FEE500",
              color: "#191919",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </div>
      )}

      {step === "OTP" && (
        <div style={{ marginTop: 16 }}>
          <input
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="OTP Code"
            maxLength={6}
            inputMode="numeric"
            disabled={loading}
            style={{
              width: "100%",
              height: 44,
              padding: "0 12px",
              borderRadius: 8,
              border: "1px solid #ddd",
            }}
          />

          <button
            type="button"
            onClick={handleVerifyOtp}
            disabled={loading}
            style={{
              width: "100%",
              height: 48,
              marginTop: 14,
              borderRadius: 8,
              border: "none",
              background: "#1a9ac9",
              color: "#fff",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Verifying..." : "Verify OTP & Complete"}
          </button>

          <button
            type="button"
            onClick={() => {
              setStep("FORM");
              setSignupKey("");
              setOtpCode("");
            }}
            disabled={loading}
            style={{
              width: "100%",
              height: 44,
              marginTop: 10,
              borderRadius: 8,
              border: "1px solid #ddd",
              background: "#fff",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}
