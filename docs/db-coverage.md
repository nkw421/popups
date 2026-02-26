# DB Coverage Map (DB → API → UI)

Source of truth: `pupoo_backend/src/main/resources/data/pupoo_v4.5.sql`.

> This map focuses on **meaningful domain tables** and the current integration state.

| Domain/Table(s) | Backend endpoint(s) | Frontend API module(s) | UI screen(s) | Coverage |
|---|---|---|---|---|
| `notices` | `GET /api/notices`, `GET /api/notices/{noticeId}`, `GET/POST/PATCH/DELETE /api/admin/notices/**` | `src/api/noticeApi.js` | `src/pages/site/community/Notice.jsx`, `src/pages/admin/board/Notice.jsx`, `src/pages/site/home/Home.jsx` | ✅ Public + Admin CRUD connected |
| `qna` (`posts` boardType QNA) | `GET/POST/PATCH/DELETE /api/qnas`, `POST /api/qnas/{qnaId}/close`, `POST /api/admin/qnas/{qnaId}/answer` | `src/api/qnaApi.js` | `src/pages/site/community/QnA.jsx`, `src/pages/admin/board/boardManage.jsx` | ✅ connected (admin write only answer) |
| `faqs` | `GET /api/faqs`, `GET /api/faqs/{postId}`, `POST/PATCH/DELETE /api/admin/faqs/**` | `src/api/faqApi.js` | `src/pages/site/info/FAQ.jsx` | ✅ public list/detail connected (admin UI pending) |
| `posts` | `GET/POST/PUT/DELETE /api/posts`, `PATCH /api/posts/{postId}/close`, `PATCH /api/admin/posts/{postId}/delete` | `src/api/postApi.js` | `src/pages/site/community/FreeBoard.jsx` (existing), admin board pages | ⚠️ partially connected (legacy/local state remains) |
| `events` | `GET /api/events`, `GET /api/events/{eventId}`, admin `GET/POST/PATCH /api/admin/events/**` | `src/app/http/eventApi.js` | `src/pages/site/event/*`, `src/pages/admin/event/eventManage.jsx` | ⚠️ partially connected |
| `booths` | `GET /api/events/{eventId}/booths`, `GET /api/booths/{boothId}` | (to align) `src/api/boothApi.js` missing | `src/pages/site/program/Booth.jsx` | ❌ endpoint exists but mock/local data still used |
| `event_program`, `speakers` | `GET /events/{eventId}/programs`, `GET /programs/{programId}`, `GET /api/speakers/**` | `src/app/http/programApi.js` | `src/pages/site/event/EventSchedule.jsx`, `src/pages/admin/program/programManage.jsx` | ⚠️ partial (route/mapping check needed for `/events` base) |
| `galleries` | `GET /api/galleries`, `GET /api/galleries/{galleryId}`, admin CRUD `/api/admin/galleries/**` | `src/app/http/galleryApi.js` | `src/pages/site/gallery/*`, `src/pages/admin/gallery/Gallery.jsx` | ⚠️ partial; admin still has local `DATA` usage |
| `payments`, `refunds` | `POST /api/events/{eventId}/payments`, `GET /api/payments/my`, `GET/POST /api/payments/{id}/...`, admin payments/refunds | `src/api/paymentApi.js` | `src/pages/site/registration/*`, `src/pages/admin/participant/*` | ⚠️ partial |
| `notification*` | `GET /api/notifications`, `POST /api/notifications/{inboxId}/click`, `GET/PUT /api/notifications/settings`, admin send event | `src/api/notificationApi.js` | `src/pages/site/auth/Mypage.jsx` | ⚠️ partial |
| `users`, `pet`, `interests`, `inquiries` | `/api/users/me`, `/api/pets/**`, `/api/interests/**`, `/api/inquiries/**` | mixed (`src/app/http/userApi.js`, others missing) | mypage/join/apply related pages | ⚠️ partial |

## Tables with endpoint but UI not fully connected (priority)
- `booths`
- `galleries`
- `interests`
- 일부 admin dashboard/realtime aggregates (`congestions`, stats 테이블)

## Backend gaps (table exists, endpoint 없음/불충분)
- `event_history`, `program_participation_stats`, `gallery_images`, `gallery_likes`, `payment_transactions`, `qr_codes`, `qr_logs`, `admin_logs` 등.
- 위 항목은 프론트에서 엔드포인트를 새로 만들지 않고 백엔드 보강 필요.

## Enum / Status fields (schema)
대표 상태 컬럼: `status`, `apply_status`, `payment_status`, `refund_status`, `visibility`, `role_name`.
(세부 값은 `pupoo_v4.5.sql`의 각 테이블 정의 enum 참고)
