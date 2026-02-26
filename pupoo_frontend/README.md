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
- 기본 동작은 same-origin(`/`) 기준으로 API를 호출합니다.
- 로컬 개발에서는 `vite.config.js`의 `/api` 프록시가 `http://localhost:8080`으로 전달합니다.
- 필요 시 아래 환경변수로 오버라이드할 수 있습니다.
  - `VITE_API_BASE_URL` (예: `http://localhost:8080`)
  - `VITE_PROXY_TARGET` (예: `http://localhost:8080`)
