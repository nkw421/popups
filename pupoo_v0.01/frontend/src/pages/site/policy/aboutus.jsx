export default function WorldHeritageFestivalBI() {
  return (
    <div className="pt-36 pb-32 bg-white min-h-screen">
      <div className="max-w-[820px] mx-auto px-6 text-gray-900">
        {/* ================= 타이틀 (그대로 유지) ================= */}
        <div className="mb-20">
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            전자금융거래 기본약관
          </h1>
          <p className="text-gray-500 text-sm">
            최종 수정일자 : 2025-08-05 (Ver 1.0)
          </p>
        </div>

        {/* ================= BI 설명 ================= */}
        <section className="mb-24 bg-gray-100 p-10">
          <div className="space-y-10">
            <div className="flex flex-col items-center text-center">
              <div className="w-56 h-56 bg-gray-300 flex items-center justify-center mb-6">
                LOGO
              </div>
              <div className="text-2xl font-bold text-teal-700">
                세계유산축전
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-6 text-center">
                세계유산의 축적과 계승
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
                <p>
                  한국 전통 민화의 여러 겹으로 겹친 곡선을 모티브로 한
                  디자인입니다.
                </p>
                <p>
                  자연을 형상화한 여러 겹의 라인을 세계유산의 축적을 상징하는
                  라인으로
                </p>
                <p>재해석하여 자연유산, 문화유산, 복합유산을 의미합니다.</p>
                <p>
                  세 가지 세계유산이 층층이 쌓여 미래로 계승된다는 메시지를 담고
                  있습니다.
                </p>
              </div>

              <div className="flex justify-center gap-4 mt-10">
                <button className="px-6 py-3 border text-sm">
                  AI 다운로드 ⬇
                </button>
                <button className="px-6 py-3 border text-sm">
                  JPG 다운로드 ⬇
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 국문형 / 영문형 ================= */}
        <section className="mb-24 bg-gray-100 p-10 text-center space-y-16">
          <div>
            <div className="w-full h-48 bg-gray-300 flex items-center justify-center mb-4">
              LOGO
            </div>
            <p className="font-bold text-teal-700 mb-2">세계유산축전</p>
            <p className="text-sm text-gray-600">국문형</p>
          </div>

          <div>
            <div className="w-full h-48 bg-gray-300 flex items-center justify-center mb-4">
              LOGO
            </div>
            <p className="font-bold text-teal-700 uppercase mb-2">
              WORLD HERITAGE FESTIVAL
            </p>
            <p className="text-sm text-gray-600">영문형</p>
          </div>
        </section>

        {/* ================= 전용색상 ================= */}
        <section className="mb-24">
          <h2 className="text-2xl font-bold mb-10">전용색상·색상활용</h2>

          <div className="space-y-10">
            {[
              { bg: "#A4D21E", pantone: "2290 C" },
              { bg: "#3BB0A2", pantone: "7465 C" },
              { bg: "#00968F", pantone: "7479 C" },
              { bg: "#0B5B5F", pantone: "3292 C" },
            ].map((color, i) => (
              <div key={i} className="border">
                <div className="h-40" style={{ backgroundColor: color.bg }} />
                <div className="p-4 text-sm space-y-2">
                  <div>PANTONE {color.pantone}</div>
                  <div>CMYK C00 M00 Y00 K00</div>
                  <div>RGB R00 G00 B00</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= White / Black ================= */}
        <section className="space-y-16">
          <div>
            <h3 className="text-lg font-bold mb-6 text-center">White</h3>
            <div className="border bg-white p-10 flex flex-col items-center space-y-4">
              <div className="w-32 h-32 bg-gray-300 flex items-center justify-center">
                LOGO
              </div>
              <p className="font-bold">2025</p>
              <p className="font-bold">세계유산축전</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 text-center">Black</h3>
            <div className="bg-black p-10 flex flex-col items-center space-y-4">
              <div className="w-32 h-32 bg-gray-600 flex items-center justify-center text-white">
                LOGO
              </div>
              <p className="font-bold text-white">2025</p>
              <p className="font-bold text-white">세계유산축전</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
