import Container from "../../components/Container";
import Button from "../../components/Button";
import Card from "../../components/Card";
import ImageBlock from "../../components/ImageBlock";
import SectionTitle from "../../components/SectionTitle";
import { highlights, newsPosts, categories } from "../../data/mock";
import { Link } from "react-router-dom";

const HERO_1 = "https://images.unsplash.com/photo-1551739440-5dd934d3a94a?auto=format&fit=crop&w=2000&q=80";
const HERO_2 = "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=2000&q=80";
const HERO_3 = "https://images.unsplash.com/photo-1525253086316-d0c936c814f8?auto=format&fit=crop&w=2000&q=80";
const HERO_4 = "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=2000&q=80";
const HERO_5 = "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=2000&q=80";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-white">
        <div className="relative">
          <ImageBlock src={HERO_1} overlay className="h-[520px] md:h-[620px] rounded-none">
            <div className="flex h-full items-center">
              <Container>
                <div className="max-w-2xl text-white">
                  <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
                    pupoo, 애견 행사를 잇다
                  </h1>
                  <p className="mt-4 text-sm md:text-base leading-7 text-white/90">
                    애견 박람회·포럼의 운영 전 과정을 하나로 연결해요. 체크인부터 대기 관리, 공지, 참여기록까지.
                  </p>
                  <div className="mt-8 flex gap-3">
                    <Button
                      as={Link}
                      to="/project"
                      variant="outline"
                      className="bg-white/10 text-white border-white/30 hover:bg-white/15"
                    >
                      자세히
                    </Button>
                    <Button as={Link} to="/admin" variant="primary">
                      관리자 콘솔
                    </Button>
                  </div>
                </div>
              </Container>
            </div>
          </ImageBlock>
        </div>
      </section>

      {/* Intro split */}
      <section className="section-divider bg-white">
        <Container className="py-14 md:py-18">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <div className="text-xs font-semibold text-[var(--color-accent)]">Pet Expo</div>
              <h2 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight">
                클라우드 애견 행사 플랫폼, pupoo
              </h2>
              <p className="mt-4 text-sm md:text-base leading-7 text-[var(--color-sub)]">
                pupoo는 애견 박람회·포럼 등 오프라인 대형 행사를 위한 클라우드 기반 통합 운영 플랫폼입니다.
                사전 신청부터 QR 체크인, 실시간 혼잡도/대기 관리, 공지 전파, 참여기록까지 한 번에 관리합니다.
              </p>
            </div>
            <ImageBlock src={HERO_2} className="h-[240px] md:h-[320px]" />
          </div>
        </Container>
      </section>

      {/* Big headline + 3 value props on image */}
      <section className="section-divider bg-white">
        <Container className="py-14">
          <SectionTitle
            kicker="Cloud Native"
            title="Cloud Native 애견 행사 플랫폼 pupoo로 박람회·포럼 운영을 더 쉽게"
            desc="현장 운영을 자동화하고 데이터를 축적해 다음 행사를 더 안전하고 효율적으로 만듭니다."
          />
        </Container>

        <div className="px-6 pb-14">
          <div className="mx-auto max-w-6xl">
            <ImageBlock src={HERO_4} overlay className="h-[360px] md:h-[420px]">
              <div className="flex h-full items-center">
                <div className="w-full px-8 md:px-12">
                  <div className="max-w-5xl text-white">
                    <div className="text-center text-xl md:text-2xl font-extrabold">
                      pupoo, 애견 행사의 모든 순간을 연결해요
                    </div>
                    <div className="mt-8 grid gap-6 md:grid-cols-3">
                      {highlights.map((h) => (
                        <div
                          key={h.title}
                          className="rounded-[var(--radius)] border border-white/25 bg-white/10 p-6 backdrop-blur"
                        >
                          <div className="text-sm font-extrabold">{h.title}</div>
                          <p className="mt-2 text-sm leading-6 text-white/85">{h.desc}</p>
                          <div className="mt-4 text-xs text-white/80">• {h.tag}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </ImageBlock>
          </div>
        </div>
      </section>

      {/* Split image + text */}
      <section className="section-divider bg-white">
        <Container className="py-14">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <ImageBlock src={HERO_5} className="h-[280px] md:h-[360px]" />
            <div>
              <div className="text-xs font-semibold text-[var(--color-accent)]">Cloud Native 애견 행사 플랫폼</div>
              <h3 className="mt-2 text-xl md:text-2xl font-extrabold tracking-tight">
                운영자는 더 가볍게, 참가자는 더 편하게
              </h3>
              <p className="mt-4 text-sm md:text-base leading-7 text-[var(--color-sub)]">
                운영자 콘솔에서 참가자/세션/체험존을 관리하고, 참가자는 모바일로 체크인과 안내를 받습니다.
                행사 이후에는 참여 이력을 축적해 다음 운영 개선에 활용할 수 있어요.
              </p>
              <div className="mt-6 flex gap-3">
                <Button as={Link} to="/features" variant="primary">
                  기능 보기
                </Button>
                <Button as={Link} to="/use-cases" variant="outline">
                  이용 흐름
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Statement + cards + big image */}
      <section className="section-divider bg-white">
        <Container className="py-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="text-xs font-semibold text-[var(--color-accent)]">pupoo, 애견 행사 통합 플랫폼</div>
              <h3 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                pupoo, 애견<br />
                행사를 더<br />
                따뜻하고<br />
                스마트하게
              </h3>
              <p className="mt-4 text-sm md:text-base leading-7 text-[var(--color-sub)]">
                Cloud Native 기반으로 행사 운영을 자동화하고, 데이터로 안전을 강화합니다.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                "실시간 운영 데이터로 혼잡/대기를 줄이고, 현장 안내를 자동화합니다.",
                "체험/세션 참여 기록을 축적해 다음 행사 운영 개선에 활용합니다.",
                "공지와 알림을 통합해 참가자에게 정확한 정보를 전달합니다.",
                "체크인/결제/환불을 한 곳에서 관리해 운영 부담을 줄입니다."
              ].map((t, i) => (
                <Card key={i} className="p-6">
                  <p className="text-sm leading-6 text-[var(--color-sub)]">{t}</p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[var(--color-surface-2)]"></div>
                    <div className="text-xs text-[var(--color-sub)]">운영팀 · pupoo</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Container>

        <div className="mx-auto max-w-6xl px-6 pb-14">
          <ImageBlock src={HERO_3} className="h-[220px] md:h-[320px]" />
        </div>
      </section>

      {/* News */}
      <section className="section-divider bg-white">
        <Container className="py-14">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-extrabold tracking-tight">News</h3>
            <Link to="/news" className="text-sm text-[var(--color-sub)] hover:text-[var(--color-text)]">
              전체 보기 →
            </Link>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {newsPosts.map((p) => (
              <div key={p.id}>
                <ImageBlock src={p.image} className="h-[200px] md:h-[240px]" />
                <div className="mt-4 text-xs text-[var(--color-sub)]">{p.category} 블로그</div>
                <div className="mt-2 text-lg font-extrabold leading-snug">{p.title}</div>
                <p className="mt-3 text-sm leading-6 text-[var(--color-sub)]">{p.excerpt}</p>
                <div className="mt-4 text-sm text-[var(--color-accent)]">더 알아보기 →</div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-6 items-center justify-center">
            {categories.map((c) => (
              <div key={c.key} className="flex flex-col items-center gap-2">
                <div className="h-14 w-14 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-line)]"></div>
                <div className="text-xs text-[var(--color-sub)]">{c.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <Card className="p-7">
              <div className="text-xs text-[var(--color-accent)] font-semibold">신규가입 이벤트</div>
              <div className="mt-2 text-lg font-extrabold">
                지금 신규 가입하고
                <br />
                50% 할인 쿠폰을 받아보세요!
              </div>
              <Button className="mt-6" variant="primary">
                할인쿠폰 받기
              </Button>
            </Card>
            <ImageBlock src={HERO_2} className="h-[220px] md:h-[260px]" />
          </div>
        </Container>

        <div className="mt-10">
          <ImageBlock src={HERO_4} overlay className="h-[260px] md:h-[320px] rounded-none">
            <div className="flex h-full items-center">
              <Container>
                <div className="max-w-2xl text-white">
                  <div className="text-2xl md:text-3xl font-extrabold">
                    Cloud Native 애견 행사 통합 운영 플랫폼,
                    <br />
                    pupoo입니다
                  </div>
                  <p className="mt-3 text-sm md:text-base leading-7 text-white/90">
                    참가 등록, 체크인, 대기 관리, 공지, 결제, 참여 이력까지 한 번에.
                  </p>
                  <Button
                    className="mt-6"
                    variant="outline"
                    as={Link}
                    to="/project"
                    className="bg-white/10 text-white border-white/30 hover:bg-white/15"
                  >
                    더 알아보기
                  </Button>
                </div>
              </Container>
            </div>
          </ImageBlock>
        </div>
      </section>
    </div>
  );
}
