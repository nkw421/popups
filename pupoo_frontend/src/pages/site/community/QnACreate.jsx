import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { qnaApi, unwrap } from "../../../api/qnaApi";
import { useAuth } from "../auth/AuthProvider";

const SERVICE_CATEGORIES = [
  { label: "자유게시판", path: "/community/freeboard" },
  { label: "공지사항", path: "/community/notice" },
  { label: "행사후기", path: "/community/review" },
  { label: "질문/답변", path: "/community/qna" },
];

export default function QnACreate() {
  const navigate = useNavigate();
  const { isAuthed } = useAuth();
  const [currentPath, setCurrentPath] = useState("/community/qna");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthed) {
      navigate("/login", { state: { from: "/community/qna/new" } });
      return;
    }

    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 입력해 주세요.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await qnaApi.create({ title: title.trim(), content: content.trim() });
      unwrap(res);
      navigate("/community/qna");
    } catch (err) {
      console.error("[QnACreate] create error", err);
      setError("질문 등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="질문 등록"
        subtitle="서비스 이용과 관련된 문의사항을 등록해 주세요."
        categories={SERVICE_CATEGORIES}
        currentPath={currentPath}
        onNavigate={setCurrentPath}
      />

      <main
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "40px 20px",
          fontFamily: "'Noto Sans KR', sans-serif",
        }}
      >
        <form onSubmit={onSubmit} style={{ display: "grid", gap: "12px" }}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            style={{ border: "1px solid #ddd", padding: "10px 12px", borderRadius: "6px", fontSize: "14px" }}
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            rows={8}
            style={{ border: "1px solid #ddd", padding: "10px 12px", borderRadius: "6px", fontSize: "14px", resize: "vertical" }}
          />

          {error && <div style={{ color: "#DC2626", fontSize: "13px" }}>{error}</div>}

          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
            <button type="button" onClick={() => navigate("/community/qna")} style={{ border: "1px solid #ddd", background: "#fff", borderRadius: "6px", padding: "8px 12px", cursor: "pointer" }}>
              취소
            </button>
            <button type="submit" disabled={submitting} style={{ border: "none", background: "#2563EB", color: "#fff", borderRadius: "6px", padding: "8px 12px", cursor: "pointer", opacity: submitting ? 0.7 : 1 }}>
              {submitting ? "등록 중..." : "등록"}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
