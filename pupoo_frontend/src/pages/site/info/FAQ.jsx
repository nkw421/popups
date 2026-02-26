import { useEffect, useState } from "react";
import { faqApi } from "../../../api/faqApi";
import { mapApiError } from "../../../app/http/errorMapper";

function unwrap(res) {
  return res?.data?.data ?? res?.data ?? null;
}

export default function FAQ() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  const load = async (nextPage = 1) => {
    setLoading(true);
    setError("");
    try {
      const res = await faqApi.list(nextPage, 10);
      const data = unwrap(res);
      setItems(data?.content || []);
      setTotalPages(Math.max(1, data?.totalPages || 1));
      setPage(nextPage);
    } catch (e) {
      const mapped = mapApiError(e);
      setError(mapped.message || "FAQ를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
  }, []);

  const openDetail = async (postId) => {
    try {
      const res = await faqApi.get(postId);
      setSelected(unwrap(res));
    } catch (e) {
      const mapped = mapApiError(e);
      setError(mapped.message || "상세 조회 실패");
    }
  };

  return (
    <div style={{ maxWidth: 980, margin: "40px auto", padding: "0 16px" }}>
      <h1 style={{ marginBottom: 12 }}>FAQ</h1>

      {error && <div style={{ color: "#dc2626", marginBottom: 12 }}>{error}</div>}
      {loading ? (
        <div>로딩 중...</div>
      ) : items.length === 0 ? (
        <div>등록된 FAQ가 없습니다.</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {items.map((faq) => (
            <li
              key={faq.postId}
              onClick={() => openDetail(faq.postId)}
              style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 14, marginBottom: 10, cursor: "pointer" }}
            >
              <div style={{ fontWeight: 700 }}>{faq.title}</div>
              <div style={{ color: "#6b7280", marginTop: 6 }}>클릭하여 상세 보기</div>
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
        <button disabled={page <= 1} onClick={() => load(page - 1)}>이전</button>
        <span>{page} / {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => load(page + 1)}>다음</button>
      </div>

      {selected && (
        <div style={{ marginTop: 20, border: "1px solid #d1d5db", borderRadius: 10, padding: 14 }}>
          <h3>{selected.title}</h3>
          <div style={{ whiteSpace: "pre-wrap" }}>{selected.content}</div>
          <button style={{ marginTop: 10 }} onClick={() => setSelected(null)}>닫기</button>
        </div>
      )}
    </div>
  );
}
