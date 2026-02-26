# Backend Endpoint Inventory (Controller Mappings)

## com/popups/pupoo/auth/api/AuthController.java  (base: `/api/auth`)
- `POST` `/api/auth/signup/start`
- `POST` `/api/auth/signup/verify-otp`
- `POST` `/api/auth/signup/email/request`
- `POST` `/api/auth/signup/email/confirm`
- `POST` `/api/auth/signup/complete`
- `POST` `/api/auth/oauth/kakao/exchange`
- `POST` `/api/auth/oauth/kakao/login`
- `POST` `/api/auth/login`
- `POST` `/api/auth/refresh`
- `POST` `/api/auth/logout`
- `GET` `/api/auth/secure-ping`

## com/popups/pupoo/auth/api/AuthVerificationController.java  (base: `(none)`)
- `POST` `/api/users/me/email-verification/request`
- `GET` `/api/auth/email/verification/confirm`
- `POST` `/api/users/me/phone-verification/request`
- `POST` `/api/users/me/phone-verification/confirm`

## com/popups/pupoo/board/boardinfo/api/AdminModerationController.java  (base: `/api/admin/moderation`)
- `GET` `/api/admin/moderation/posts`
- `GET` `/api/admin/moderation/reviews`
- `GET` `/api/admin/moderation/replies`
- `PATCH` `/api/admin/moderation/posts/{postId}/hide`
- `PATCH` `/api/admin/moderation/posts/{postId}/restore`
- `DELETE` `/api/admin/moderation/posts/{postId}`
- `PATCH` `/api/admin/moderation/reviews/{reviewId}/blind`
- `PATCH` `/api/admin/moderation/reviews/{reviewId}/restore`
- `DELETE` `/api/admin/moderation/reviews/{reviewId}`
- `PATCH` `/api/admin/moderation/replies/{targetType}/{commentId}/hide`
- `PATCH` `/api/admin/moderation/replies/{targetType}/{commentId}/restore`
- `DELETE` `/api/admin/moderation/replies/{targetType}/{commentId}`

## com/popups/pupoo/board/boardinfo/api/BoardController.java  (base: `(none)`)
- `GET` `/api/boards`
- `POST` `/api/admin/boards`
- `GET` `/api/admin/boards/{boardId}`
- `PUT` `/api/admin/boards/{boardId}`
- `PATCH` `/api/admin/boards/{boardId}/active`

## com/popups/pupoo/board/faq/api/AdminFaqController.java  (base: `/api/admin/faqs`)
- `POST` `/api/admin/faqs`
- `PATCH` `/api/admin/faqs/{postId}`
- `DELETE` `/api/admin/faqs/{postId}`

## com/popups/pupoo/board/faq/api/FaqController.java  (base: `/api/faqs`)
- `GET` `/api/faqs`
- `GET` `/api/faqs/{postId}`

## com/popups/pupoo/board/post/api/AdminPostController.java  (base: `/api/admin/posts`)
- `PATCH` `/api/admin/posts/{postId}/delete`

## com/popups/pupoo/board/post/api/PostController.java  (base: `/api/posts`)
- `GET` `/api/posts`
- `GET` `/api/posts/{postId}`
- `POST` `/api/posts/{postId}/report`
- `POST` `/api/posts`
- `PUT` `/api/posts/{postId}`
- `DELETE` `/api/posts/{postId}`
- `PATCH` `/api/posts/{postId}/close`

## com/popups/pupoo/board/qna/api/AdminQnaController.java  (base: `/api/admin/qnas`)
- `POST` `/api/admin/qnas/{qnaId}/answer`

## com/popups/pupoo/board/qna/api/QnaController.java  (base: `/api/qnas`)
- `POST` `/api/qnas`
- `GET` `/api/qnas/{qnaId}`
- `GET` `/api/qnas`
- `PATCH` `/api/qnas/{qnaId}`
- `DELETE` `/api/qnas/{qnaId}`
- `POST` `/api/qnas/{qnaId}/close`

## com/popups/pupoo/board/review/api/ReviewController.java  (base: `/api/reviews`)
- `POST` `/api/reviews`
- `GET` `/api/reviews/{reviewId}`
- `GET` `/api/reviews`
- `PATCH` `/api/reviews/{reviewId}`
- `DELETE` `/api/reviews/{reviewId}`
- `POST` `/api/reviews/{reviewId}/report`

## com/popups/pupoo/booth/api/BoothController.java  (base: `/api`)
- `GET` `/api/events/{eventId}/booths`
- `GET` `/api/booths/{boothId}`

## com/popups/pupoo/common/dashboard/analytics/api/AdminAnalyticsController.java  (base: `/api/admin/analytics`)
- `GET` `/api/admin/analytics/events`
- `GET` `/api/admin/analytics/events/{eventId}/congestion-by-hour`
- `GET` `/api/admin/analytics/yearly`

## com/popups/pupoo/common/dashboard/api/AdminDashboardRealtimeController.java  (base: `/api/admin/dashboard/realtime`)
- `GET` `/api/admin/dashboard/realtime/summary`
- `GET` `/api/admin/dashboard/realtime/events`
- `GET` `/api/admin/dashboard/realtime/events/{eventId}/congestions`

## com/popups/pupoo/common/dashboard/api/DashboardController.java  (base: `/api/admin/dashboard`)
- `GET` `/api/admin/dashboard`
- `GET` `/api/admin/dashboard/{id}`

## com/popups/pupoo/contest/vote/api/ContestVoteController.java  (base: `/api/programs/{programId}/votes`)
- `POST` `/api/programs/{programId}/votes`
- `DELETE` `/api/programs/{programId}/votes`
- `GET` `/api/programs/{programId}/votes/result`

## com/popups/pupoo/event/api/AdminEventOperationController.java  (base: `/api/admin/events`)
- `POST` `/api/admin/events`
- `PATCH` `/api/admin/events/{eventId}`
- `GET` `/api/admin/events`
- `GET` `/api/admin/events/{eventId}`
- `PATCH` `/api/admin/events/{eventId}/status`

## com/popups/pupoo/event/api/EventController.java  (base: `/api/events`)
- `GET` `/api/events`
- `GET` `/api/events/{eventId}`
- `GET` `/api/events/{eventId}/galleries`

## com/popups/pupoo/event/api/EventRegistrationController.java  (base: `(none)`)
- `POST` `/api/event-registrations`
- `DELETE` `/api/event-registrations/{applyId}`
- `GET` `/api/users/me/event-registrations`

## com/popups/pupoo/gallery/api/GalleryAdminController.java  (base: `/api/admin/galleries`)
- `POST` `/api/admin/galleries`
- `PATCH` `/api/admin/galleries/{galleryId}`
- `DELETE` `/api/admin/galleries/{galleryId}`

## com/popups/pupoo/gallery/api/GalleryController.java  (base: `/api/galleries`)
- `GET` `/api/galleries/{galleryId}`
- `GET` `/api/galleries`
- `POST` `/api/galleries`
- `PATCH` `/api/galleries/{galleryId}`
- `DELETE` `/api/galleries/{galleryId}`
- `POST` `/api/galleries/{galleryId}/like`
- `DELETE` `/api/galleries/{galleryId}/like`

## com/popups/pupoo/inquiry/api/InquiryController.java  (base: `(none)`)
- `POST` `/api/inquiries`
- `GET` `/api/inquiries/mine`
- `GET` `/api/inquiries/{inquiryId}`
- `PUT` `/api/inquiries/{inquiryId}`
- `PATCH` `/api/inquiries/{inquiryId}/close`
- `GET` `/api/admin/inquiries`
- `PUT` `/api/admin/inquiries/{inquiryId}/answer`
- `PATCH` `/api/admin/inquiries/{inquiryId}/status`

## com/popups/pupoo/interest/api/InterestController.java  (base: `/api/interests`)
- `GET` `/api/interests`
- `POST` `/api/interests/subscribe`
- `POST` `/api/interests/unsubscribe`
- `POST` `/api/interests/mysubscriptions`

## com/popups/pupoo/notice/api/AdminNoticeController.java  (base: `/api/admin/notices`)
- `GET` `/api/admin/notices`
- `GET` `/api/admin/notices/{id}`
- `POST` `/api/admin/notices`
- `PATCH` `/api/admin/notices/{id}`
- `DELETE` `/api/admin/notices/{id}`

## com/popups/pupoo/notice/api/NoticeController.java  (base: `/api/notices`)
- `GET` `/api/notices`
- `GET` `/api/notices/{noticeId}`

## com/popups/pupoo/notification/api/AdminNotificationController.java  (base: `/api/admin/notifications`)
- `POST` `/api/admin/notifications/event`

## com/popups/pupoo/notification/api/NotificationController.java  (base: `/api/notifications`)
- `GET` `/api/notifications`
- `POST` `/api/notifications/{inboxId}/click`
- `GET` `/api/notifications/settings`
- `PUT` `/api/notifications/settings`

## com/popups/pupoo/payment/api/AdminPaymentsController.java  (base: `/api/admin`)
- `GET` `/api/admin/payments`
- `GET` `/api/admin/payments/{id}`

## com/popups/pupoo/payment/api/PaymentController.java  (base: `/api`)
- `POST` `/api/events/{eventId}/payments`
- `GET` `/api/payments/my`
- `GET` `/api/payments/{paymentId}/approve`
- `POST` `/api/payments/{paymentId}/cancel`

## com/popups/pupoo/payment/refund/api/AdminRefundsController.java  (base: `/api/admin`)
- `GET` `/api/admin/refunds`
- `GET` `/api/admin/refunds/{id}`
- `PATCH` `/api/admin/refunds/{refundId}/approve`
- `PATCH` `/api/admin/refunds/{refundId}/reject`
- `POST` `/api/admin/refunds/{refundId}/execute`

## com/popups/pupoo/payment/refund/api/RefundController.java  (base: `/api`)
- `POST` `/api/refunds`
- `GET` `/api/refunds/my`

## com/popups/pupoo/pet/api/PetController.java  (base: `/api/pets`)
- `POST` `/api/pets`
- `GET` `/api/pets/me`
- `PATCH` `/api/pets/{petId}`
- `DELETE` `/api/pets/{petId}`

## com/popups/pupoo/program/api/ProgramController.java  (base: `(none)`)
- `GET` `/events/{eventId}/programs`
- `GET` `/programs/{programId}`

## com/popups/pupoo/program/api/ProgramSpeakerController.java  (base: `/api/programs/{programId}/speakers`)
- `GET` `/api/programs/{programId}/speakers`
- `GET` `/api/programs/{programId}/speakers/{speakerId}`

## com/popups/pupoo/program/apply/api/ProgramApplyController.java  (base: `/api/program-applies`)
- `GET` `/api/program-applies/my`
- `POST` `/api/program-applies`
- `PATCH` `/api/program-applies/{id}/cancel`
- `GET` `/api/program-applies/{id}`

## com/popups/pupoo/program/speaker/api/SpeakerAdminController.java  (base: `/api/admin/speakers`)
- `POST` `/api/admin/speakers`
- `PATCH` `/api/admin/speakers/{speakerId}`
- `DELETE` `/api/admin/speakers/{speakerId}`

## com/popups/pupoo/program/speaker/api/SpeakerController.java  (base: `/api/speakers`)
- `GET` `/api/speakers`
- `GET` `/api/speakers/{speakerId}`

## com/popups/pupoo/qr/api/QrAdminController.java  (base: `/api/admin/operations`)
- `POST` `/api/admin/operations/events/{eventId}/booths/{boothId}/qr/check-in`
- `POST` `/api/admin/operations/events/{eventId}/booths/{boothId}/qr/check-out`

## com/popups/pupoo/qr/api/QrController.java  (base: `/api`)
- `GET` `/api/qr/me`
- `GET` `/api/me/booth-visits`
- `GET` `/api/events/{eventId}/me/booth-visits`
- `GET` `/api/events/{eventId}/booths/{boothId}/me/visits`

## com/popups/pupoo/reply/api/ReplyController.java  (base: `/api/replies`)
- `POST` `/api/replies`
- `GET` `/api/replies`
- `PATCH` `/api/replies/{replyId}`
- `DELETE` `/api/replies/{replyId}`
- `POST` `/api/replies/{targetType}/{replyId}/report`

## com/popups/pupoo/report/api/AdminReportController.java  (base: `/api/admin/reports`)
- `GET` `/api/admin/reports`
- `PATCH` `/api/admin/reports/{reportId}`

## com/popups/pupoo/report/api/ReportReasonController.java  (base: `/api/report-reasons`)
- `GET` `/api/report-reasons`

## com/popups/pupoo/storage/api/StorageController.java  (base: `/api/files`)
- `POST` `/api/files`
- `POST` `/api/files/admin/notice`
- `GET` `/api/files/{fileId}`
- `GET` `/api/files/{fileId}/download`
- `DELETE` `/api/files/{fileId}`
- `DELETE` `/api/files/admin/{fileId}`

## com/popups/pupoo/user/api/AdminUserController.java  (base: `/api/admin/users`)
- `GET` `/api/admin/users`
- `GET` `/api/admin/users/{id}`
- `POST` `/api/admin/users`
- `PATCH` `/api/admin/users/{id}`
- `DELETE` `/api/admin/users/{id}`

## com/popups/pupoo/user/api/UserController.java  (base: `/api/users`)
- `GET` `/api/users/me`
- `PATCH` `/api/users/me`
- `DELETE` `/api/users/me`

## com/popups/pupoo/user/social/api/SocialAccountController.java  (base: `(none)`)
- `GET` `(class-level path only)`
- `POST` `/link`
- `DELETE` `/unlink`
