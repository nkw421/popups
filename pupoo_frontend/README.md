# pupoo Platform Web Template (Vite + React + Tailwind v4)

## Run
```bash
npm install
npm run dev
```

## Public routes
- /
- /project
- /features
- /use-cases
- /tech
- /news

## Admin routes
- /admin
- /admin/events
- /admin/participants
- /admin/checkin
- /admin/payments
- /admin/notices
- /admin/community
- /admin/settings

## Tailwind v4
- Uses official @tailwindcss/vite plugin.
- Do NOT add tailwindcss into postcss.config.js.

## API 연결 설정
- 현재 프로젝트는 **CORS direct mode** 기준입니다. (Vite proxy 사용 금지)
- 프론트는 `VITE_API_BASE_URL`을 사용해 백엔드 주소를 결정합니다.
- 미설정 시 기본값은 `http://localhost:8080` 입니다.
- `withCredentials: true`가 기본 적용되어 refresh_token(HttpOnly Cookie) 연동을 지원합니다.

### .env.local 예시
```bash
VITE_API_BASE_URL=http://localhost:8080
```

## 로컬 CORS / 쿠키 점검 가이드
refresh_token 쿠키가 로컬에서 안 붙으면 아래를 점검하세요.

1) 백엔드 CORS
- `allowCredentials(true)` 설정
- `allowedOrigins`에 `http://localhost:5173` 명시 (`*` 불가)

2) 쿠키 속성
- 로컬 HTTP 개발: `Secure=false`, `SameSite=Lax` 또는 정책에 맞는 값
- 운영 HTTPS: `Secure=true` + 적절한 `SameSite`

3) 프론트 요청
- axios `withCredentials: true`
- 요청/응답 도메인 및 포트 일치 여부 확인
