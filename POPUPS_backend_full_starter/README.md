# POPUPS Backend (Full Starter)

- 공통 응답 규칙 4개 고정(ApiResponse / PageResponse / ErrorCode / GlobalExceptionHandler)
- JWT 기반 인증/인가(Access/Refresh)
- 최소 구현: User/Auth, Event, Notice
- Board는 placeholder

## 실행 (H2 기본)
- ./gradlew bootRun
- H2 Console: /h2-console (JDBC URL: jdbc:h2:mem:popups)

## API
- POST /api/users
- POST /api/auth/login
- POST /api/auth/refresh
- POST /api/auth/logout (X-Refresh-Token)
- GET  /api/users/me (Authorization: Bearer <access>)
- GET  /api/events, /api/events/{eventId}
- GET  /api/notices
- POST /api/notices (ADMIN only)

## MySQL 전환
application.yml datasource를 MySQL로 바꾸고 ddl-auto는 팀 전략에 맞게 조정하세요.
