# Backend Endpoint Inventory

## AuthController (`com/popups/pupoo/auth/api/AuthController.java`)
- `POST /api/auth/signup/start` | Controller: `AuthController` | Description: `signupStart`
- `POST /api/auth/signup/verify-otp` | Controller: `AuthController` | Description: `signupVerifyOtp`
- `POST /api/auth/signup/email/request` | Controller: `AuthController` | Description: `signupEmailRequest`
- `POST /api/auth/signup/email/confirm` | Controller: `AuthController` | Description: `signupEmailConfirm`
- `POST /api/auth/signup/complete` | Controller: `AuthController` | Description: `signupComplete`
- `POST /api/auth/oauth/kakao/exchange` | Controller: `AuthController` | Description: `kakaoExchange`
- `POST /api/auth/oauth/kakao/login` | Controller: `AuthController` | Description: `kakaoLogin`
- `POST /api/auth/login` | Controller: `AuthController` | Description: `login`
- `POST /api/auth/refresh` | Controller: `AuthController` | Description: `refreshToken`
- `POST /api/auth/logout` | Controller: `AuthController` | Description: `logout`
- `GET /api/auth/secure-ping` | Controller: `AuthController` | Description: `securePing`

## AuthVerificationController (`com/popups/pupoo/auth/api/AuthVerificationController.java`)
- `POST /api/users/me/email-verification/request` | Controller: `AuthVerificationController` | Description: `requestEmailVerification`
- `GET /api/auth/email/verification/confirm` | Controller: `AuthVerificationController` | Description: `confirmEmailVerification`
- `POST /api/users/me/phone-verification/request` | Controller: `AuthVerificationController` | Description: `requestPhoneVerification`
- `POST /api/users/me/phone-verification/confirm` | Controller: `AuthVerificationController` | Description: `confirmPhoneVerification`

## AdminModerationController (`com/popups/pupoo/board/boardinfo/api/AdminModerationController.java`)
- `GET /api/admin/moderation/posts` | Controller: `AdminModerationController` | Description: `searchPosts`
- `GET /api/admin/moderation/reviews` | Controller: `AdminModerationController` | Description: `searchReviews`
- `GET /api/admin/moderation/replies` | Controller: `AdminModerationController` | Description: `searchReplies`
- `PATCH /api/admin/moderation/posts/{postId}/hide` | Controller: `AdminModerationController` | Description: `hidePost`
- `PATCH /api/admin/moderation/posts/{postId}/restore` | Controller: `AdminModerationController` | Description: `restorePost`
- `DELETE /api/admin/moderation/posts/{postId}` | Controller: `AdminModerationController` | Description: `deletePost`
- `PATCH /api/admin/moderation/reviews/{reviewId}/blind` | Controller: `AdminModerationController` | Description: `blindReview`
- `PATCH /api/admin/moderation/reviews/{reviewId}/restore` | Controller: `AdminModerationController` | Description: `restoreReview`
- `DELETE /api/admin/moderation/reviews/{reviewId}` | Controller: `AdminModerationController` | Description: `deleteReview`
- `PATCH /api/admin/moderation/replies/{targetType}/{commentId}/hide` | Controller: `AdminModerationController` | Description: `hideReply`
- `PATCH /api/admin/moderation/replies/{targetType}/{commentId}/restore` | Controller: `AdminModerationController` | Description: `restoreReply`
- `DELETE /api/admin/moderation/replies/{targetType}/{commentId}` | Controller: `AdminModerationController` | Description: `deleteReply`

## BoardController (`com/popups/pupoo/board/boardinfo/api/BoardController.java`)
- `GET /api/boards` | Controller: `BoardController` | Description: `getBoards`
- `POST /api/admin/boards` | Controller: `BoardController` | Description: `createBoard`
- `GET /api/admin/boards/{boardId}` | Controller: `BoardController` | Description: `getBoard`
- `PUT /api/admin/boards/{boardId}` | Controller: `BoardController` | Description: `updateBoard`
- `PATCH /api/admin/boards/{boardId}/active` | Controller: `BoardController` | Description: `changeActive`

## AdminFaqController (`com/popups/pupoo/board/faq/api/AdminFaqController.java`)
- `POST /api/admin/faqs` | Controller: `AdminFaqController` | Description: `create`
- `PATCH /api/admin/faqs/{postId}` | Controller: `AdminFaqController` | Description: `update`
- `DELETE /api/admin/faqs/{postId}` | Controller: `AdminFaqController` | Description: `delete`

## FaqController (`com/popups/pupoo/board/faq/api/FaqController.java`)
- `GET /api/faqs` | Controller: `FaqController` | Description: `list`
- `GET /api/faqs/{postId}` | Controller: `FaqController` | Description: `get`

## AdminPostController (`com/popups/pupoo/board/post/api/AdminPostController.java`)
- `PATCH /api/admin/posts/{postId}/delete` | Controller: `AdminPostController` | Description: `delete`

## PostController (`com/popups/pupoo/board/post/api/PostController.java`)
- `GET /api/posts` | Controller: `PostController` | Description: `getPosts`
- `GET /api/posts/{postId}` | Controller: `PostController` | Description: `getPost`
- `POST /api/posts/{postId}/report` | Controller: `PostController` | Description: `reportPost`
- `POST /api/posts` | Controller: `PostController` | Description: `createPost`
- `PUT /api/posts/{postId}` | Controller: `PostController` | Description: `updatePost`
- `DELETE /api/posts/{postId}` | Controller: `PostController` | Description: `deletePost`
- `PATCH /api/posts/{postId}/close` | Controller: `PostController` | Description: `closePost`

## AdminQnaController (`com/popups/pupoo/board/qna/api/AdminQnaController.java`)
- `POST /api/admin/qnas/{qnaId}/answer` | Controller: `AdminQnaController` | Description: `answer`

## QnaController (`com/popups/pupoo/board/qna/api/QnaController.java`)
- `POST /api/qnas` | Controller: `QnaController` | Description: `create`
- `GET /api/qnas/{qnaId}` | Controller: `QnaController` | Description: `get`
- `GET /api/qnas` | Controller: `QnaController` | Description: `list`
- `PATCH /api/qnas/{qnaId}` | Controller: `QnaController` | Description: `update`
- `DELETE /api/qnas/{qnaId}` | Controller: `QnaController` | Description: `delete`
- `POST /api/qnas/{qnaId}/close` | Controller: `QnaController` | Description: `close`

## ReviewController (`com/popups/pupoo/board/review/api/ReviewController.java`)
- `POST /api/reviews` | Controller: `ReviewController` | Description: `create`
- `GET /api/reviews/{reviewId}` | Controller: `ReviewController` | Description: `get`
- `GET /api/reviews` | Controller: `ReviewController` | Description: `list`
- `PATCH /api/reviews/{reviewId}` | Controller: `ReviewController` | Description: `update`
- `DELETE /api/reviews/{reviewId}` | Controller: `ReviewController` | Description: `delete`
- `POST /api/reviews/{reviewId}/report` | Controller: `ReviewController` | Description: `report`

## BoothController (`com/popups/pupoo/booth/api/BoothController.java`)
- `GET /api/events/{eventId}/booths` | Controller: `BoothController` | Description: `getEventBooths`
- `GET /api/booths/{boothId}` | Controller: `BoothController` | Description: `getBoothDetail`

## AdminAnalyticsController (`com/popups/pupoo/common/dashboard/analytics/api/AdminAnalyticsController.java`)
- `GET /api/admin/analytics/events` | Controller: `AdminAnalyticsController` | Description: `eventPerformance`
- `GET /api/admin/analytics/events/{eventId}/congestion-by-hour` | Controller: `AdminAnalyticsController` | Description: `congestionByHour`
- `GET /api/admin/analytics/yearly` | Controller: `AdminAnalyticsController` | Description: `yearly`

## AdminDashboardRealtimeController (`com/popups/pupoo/common/dashboard/api/AdminDashboardRealtimeController.java`)
- `GET /api/admin/dashboard/realtime/summary` | Controller: `AdminDashboardRealtimeController` | Description: `summary`
- `GET /api/admin/dashboard/realtime/events` | Controller: `AdminDashboardRealtimeController` | Description: `events`
- `GET /api/admin/dashboard/realtime/events/{eventId}/congestions` | Controller: `AdminDashboardRealtimeController` | Description: `congestions`

## DashboardController (`com/popups/pupoo/common/dashboard/api/DashboardController.java`)
- `GET /api/admin/dashboard` | Controller: `DashboardController` | Description: `summary`
- `GET /api/admin/dashboard/{id}` | Controller: `DashboardController` | Description: `summaryById`

## ContestVoteController (`com/popups/pupoo/contest/vote/api/ContestVoteController.java`)
- `POST /api/programs/{programId}/votes` | Controller: `ContestVoteController` | Description: `vote`
- `DELETE /api/programs/{programId}/votes` | Controller: `ContestVoteController` | Description: `cancel`
- `GET /api/programs/{programId}/votes/result` | Controller: `ContestVoteController` | Description: `result`

## AdminEventOperationController (`com/popups/pupoo/event/api/AdminEventOperationController.java`)
- `POST /api/admin/events` | Controller: `AdminEventOperationController` | Description: `createEvent`
- `PATCH /api/admin/events/{eventId}` | Controller: `AdminEventOperationController` | Description: `updateEvent`
- `GET /api/admin/events` | Controller: `AdminEventOperationController` | Description: `list`
- `GET /api/admin/events/{eventId}` | Controller: `AdminEventOperationController` | Description: `get`
- `PATCH /api/admin/events/{eventId}/status` | Controller: `AdminEventOperationController` | Description: `changeStatus`

## EventController (`com/popups/pupoo/event/api/EventController.java`)
- `GET /api/events` | Controller: `EventController` | Description: `getEvents`
- `GET /api/events/{eventId}` | Controller: `EventController` | Description: `getEvent`
- `GET /api/events/{eventId}/galleries` | Controller: `EventController` | Description: `getEventGalleries`

## EventRegistrationController (`com/popups/pupoo/event/api/EventRegistrationController.java`)
- `POST /api/event-registrations` | Controller: `EventRegistrationController` | Description: `apply`
- `DELETE /api/event-registrations/{applyId}` | Controller: `EventRegistrationController` | Description: `cancel`
- `GET /api/users/me/event-registrations` | Controller: `EventRegistrationController` | Description: `myRegistrations`

## GalleryAdminController (`com/popups/pupoo/gallery/api/GalleryAdminController.java`)
- `POST /api/admin/galleries` | Controller: `GalleryAdminController` | Description: `create`
- `PATCH /api/admin/galleries/{galleryId}` | Controller: `GalleryAdminController` | Description: `update`
- `DELETE /api/admin/galleries/{galleryId}` | Controller: `GalleryAdminController` | Description: `delete`

## GalleryController (`com/popups/pupoo/gallery/api/GalleryController.java`)
- `GET /api/galleries/{galleryId}` | Controller: `GalleryController` | Description: `get`
- `GET /api/galleries` | Controller: `GalleryController` | Description: `list`
- `POST /api/galleries` | Controller: `GalleryController` | Description: `create`
- `PATCH /api/galleries/{galleryId}` | Controller: `GalleryController` | Description: `update`
- `DELETE /api/galleries/{galleryId}` | Controller: `GalleryController` | Description: `delete`
- `POST /api/galleries/{galleryId}/like` | Controller: `GalleryController` | Description: `like`
- `DELETE /api/galleries/{galleryId}/like` | Controller: `GalleryController` | Description: `unlike`

## InquiryController (`com/popups/pupoo/inquiry/api/InquiryController.java`)
- `POST /api/inquiries` | Controller: `InquiryController` | Description: `createInquiry`
- `GET /api/inquiries/mine` | Controller: `InquiryController` | Description: `getMyInquiries`
- `GET /api/inquiries/{inquiryId}` | Controller: `InquiryController` | Description: `getMyInquiry`
- `PUT /api/inquiries/{inquiryId}` | Controller: `InquiryController` | Description: `updateMyInquiry`
- `PATCH /api/inquiries/{inquiryId}/close` | Controller: `InquiryController` | Description: `closeMyInquiry`
- `GET /api/admin/inquiries` | Controller: `InquiryController` | Description: `getInquiries`
- `PUT /api/admin/inquiries/{inquiryId}/answer` | Controller: `InquiryController` | Description: `answer`
- `PATCH /api/admin/inquiries/{inquiryId}/status` | Controller: `InquiryController` | Description: `changeStatus`

## InterestController (`com/popups/pupoo/interest/api/InterestController.java`)
- `GET /api/interests` | Controller: `InterestController` | Description: `getAll`
- `POST /api/interests/subscribe` | Controller: `InterestController` | Description: `subscribe`
- `POST /api/interests/unsubscribe` | Controller: `InterestController` | Description: `unsubscribe`
- `POST /api/interests/mysubscriptions` | Controller: `InterestController` | Description: `mySubscriptions`

## AdminNoticeController (`com/popups/pupoo/notice/api/AdminNoticeController.java`)
- `GET /api/admin/notices` | Controller: `AdminNoticeController` | Description: `list`
- `GET /api/admin/notices/{id}` | Controller: `AdminNoticeController` | Description: `get`
- `POST /api/admin/notices` | Controller: `AdminNoticeController` | Description: `create`
- `PATCH /api/admin/notices/{id}` | Controller: `AdminNoticeController` | Description: `update`
- `DELETE /api/admin/notices/{id}` | Controller: `AdminNoticeController` | Description: `delete`

## NoticeController (`com/popups/pupoo/notice/api/NoticeController.java`)
- `GET /api/notices` | Controller: `NoticeController` | Description: `list`
- `GET /api/notices/{noticeId}` | Controller: `NoticeController` | Description: `get`

## AdminNotificationController (`com/popups/pupoo/notification/api/AdminNotificationController.java`)
- `POST /api/admin/notifications/event` | Controller: `AdminNotificationController` | Description: `publishEvent`

## NotificationController (`com/popups/pupoo/notification/api/NotificationController.java`)
- `GET /api/notifications` | Controller: `NotificationController` | Description: `myInbox`
- `POST /api/notifications/{inboxId}/click` | Controller: `NotificationController` | Description: `click`
- `GET /api/notifications/settings` | Controller: `NotificationController` | Description: `getSettings`
- `PUT /api/notifications/settings` | Controller: `NotificationController` | Description: `updateSettings`

## AdminPaymentsController (`com/popups/pupoo/payment/api/AdminPaymentsController.java`)
- `GET /api/admin/payments` | Controller: `AdminPaymentsController` | Description: `payments`
- `GET /api/admin/payments/{id}` | Controller: `AdminPaymentsController` | Description: `payment`

## PaymentController (`com/popups/pupoo/payment/api/PaymentController.java`)
- `POST /api/events/{eventId}/payments` | Controller: `PaymentController` | Description: `requestPayment`
- `GET /api/payments/my` | Controller: `PaymentController` | Description: `myPayments`
- `GET /api/payments/{paymentId}/approve` | Controller: `PaymentController` | Description: `approve`
- `POST /api/payments/{paymentId}/cancel` | Controller: `PaymentController` | Description: `cancel`

## AdminRefundsController (`com/popups/pupoo/payment/refund/api/AdminRefundsController.java`)
- `GET /api/admin/refunds` | Controller: `AdminRefundsController` | Description: `refunds`
- `GET /api/admin/refunds/{id}` | Controller: `AdminRefundsController` | Description: `refund`
- `PATCH /api/admin/refunds/{refundId}/approve` | Controller: `AdminRefundsController` | Description: `approve`
- `PATCH /api/admin/refunds/{refundId}/reject` | Controller: `AdminRefundsController` | Description: `reject`
- `POST /api/admin/refunds/{refundId}/execute` | Controller: `AdminRefundsController` | Description: `execute`

## RefundController (`com/popups/pupoo/payment/refund/api/RefundController.java`)
- `POST /api/refunds` | Controller: `RefundController` | Description: `requestRefund`
- `GET /api/refunds/my` | Controller: `RefundController` | Description: `myRefunds`

## PetController (`com/popups/pupoo/pet/api/PetController.java`)
- `GET /api/pets/me` | Controller: `PetController` | Description: `getMe`
- `PATCH /api/pets/{petId}` | Controller: `PetController` | Description: `update`
- `DELETE /api/pets/{petId}` | Controller: `PetController` | Description: `delete`

## ProgramController (`com/popups/pupoo/program/api/ProgramController.java`)
- `GET /events/{eventId}/programs` | Controller: `ProgramController` | Description: `getPrograms`
- `GET /programs/{programId}` | Controller: `ProgramController` | Description: `getProgramDetail`

## ProgramSpeakerController (`com/popups/pupoo/program/api/ProgramSpeakerController.java`)
- `GET /api/programs/{programId}/speakers` | Controller: `ProgramSpeakerController` | Description: `getProgramSpeakers`
- `GET /api/programs/{programId}/speakers/{speakerId}` | Controller: `ProgramSpeakerController` | Description: `getProgramSpeaker`

## ProgramApplyController (`com/popups/pupoo/program/apply/api/ProgramApplyController.java`)
- `GET /api/program-applies/my` | Controller: `ProgramApplyController` | Description: `my`
- `POST /api/program-applies` | Controller: `ProgramApplyController` | Description: `create`
- `PATCH /api/program-applies/{id}/cancel` | Controller: `ProgramApplyController` | Description: `cancel`
- `GET /api/program-applies/{id}` | Controller: `ProgramApplyController` | Description: `get`

## SpeakerAdminController (`com/popups/pupoo/program/speaker/api/SpeakerAdminController.java`)

## SpeakerController (`com/popups/pupoo/program/speaker/api/SpeakerController.java`)
- `GET /api/speakers` | Controller: `SpeakerController` | Description: `getSpeakers`
- `GET /api/speakers/{speakerId}` | Controller: `SpeakerController` | Description: `getSpeaker`

## QrAdminController (`com/popups/pupoo/qr/api/QrAdminController.java`)
- `POST /api/admin/operations/events/{eventId}/booths/{boothId}/qr/check-in` | Controller: `QrAdminController` | Description: `checkIn`
- `POST /api/admin/operations/events/{eventId}/booths/{boothId}/qr/check-out` | Controller: `QrAdminController` | Description: `checkOut`

## QrController (`com/popups/pupoo/qr/api/QrController.java`)
- `GET /api/qr/me` | Controller: `QrController` | Description: `getMyQr`
- `GET /api/me/booth-visits` | Controller: `QrController` | Description: `getMyBoothVisitsGroupedByEvent`
- `GET /api/events/{eventId}/me/booth-visits` | Controller: `QrController` | Description: `getMyBoothVisits`
- `GET /api/events/{eventId}/booths/{boothId}/me/visits` | Controller: `QrController` | Description: `getMyBoothVisitLogs`

## ReplyController (`com/popups/pupoo/reply/api/ReplyController.java`)
- `POST /api/replies` | Controller: `ReplyController` | Description: `create`
- `GET /api/replies` | Controller: `ReplyController` | Description: `list`
- `PATCH /api/replies/{replyId}` | Controller: `ReplyController` | Description: `update`
- `DELETE /api/replies/{replyId}` | Controller: `ReplyController` | Description: `delete`
- `POST /api/replies/{targetType}/{replyId}/report` | Controller: `ReplyController` | Description: `report`

## AdminReportController (`com/popups/pupoo/report/api/AdminReportController.java`)
- `GET /api/admin/reports` | Controller: `AdminReportController` | Description: `list`
- `PATCH /api/admin/reports/{reportId}` | Controller: `AdminReportController` | Description: `decide`

## ReportReasonController (`com/popups/pupoo/report/api/ReportReasonController.java`)
- `GET /api/report-reasons` | Controller: `ReportReasonController` | Description: `list`

## StorageController (`com/popups/pupoo/storage/api/StorageController.java`)
- `POST /api/files` | Controller: `StorageController` | Description: `upload`
- `POST /api/files/admin/notice` | Controller: `StorageController` | Description: `uploadNoticeByAdmin`
- `GET /api/files/{fileId}` | Controller: `StorageController` | Description: `get`
- `GET /api/files/{fileId}/download` | Controller: `StorageController` | Description: `redirectToStatic`
- `DELETE /api/files/{fileId}` | Controller: `StorageController` | Description: `delete`
- `DELETE /api/files/admin/{fileId}` | Controller: `StorageController` | Description: `deleteByAdmin`

## AdminUserController (`com/popups/pupoo/user/api/AdminUserController.java`)
- `GET /api/admin/users` | Controller: `AdminUserController` | Description: `list`
- `GET /api/admin/users/{id}` | Controller: `AdminUserController` | Description: `get`
- `POST /api/admin/users` | Controller: `AdminUserController` | Description: `create`
- `PATCH /api/admin/users/{id}` | Controller: `AdminUserController` | Description: `update`
- `DELETE /api/admin/users/{id}` | Controller: `AdminUserController` | Description: `delete`

## UserController (`com/popups/pupoo/user/api/UserController.java`)
- `GET /api/users/me` | Controller: `UserController` | Description: `getMe`
- `PATCH /api/users/me` | Controller: `UserController` | Description: `updateMe`
- `DELETE /api/users/me` | Controller: `UserController` | Description: `deleteMe`

## SocialAccountController (`com/popups/pupoo/user/social/api/SocialAccountController.java`)
- `GET (class-level path only)` | Controller: `SocialAccountController` | Description: `getMySocialAccounts`
- `POST /link` | Controller: `SocialAccountController` | Description: `linkSocialAccount`
- `DELETE /unlink` | Controller: `SocialAccountController` | Description: `unlinkSocialAccount`
