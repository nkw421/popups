package com.popups.pupoo.board.review.api;

import com.popups.pupoo.auth.security.util.SecurityUtil;
import com.popups.pupoo.board.review.application.ReviewService;
import com.popups.pupoo.board.review.dto.ReviewCreateRequest;
import com.popups.pupoo.board.review.dto.ReviewResponse;
import com.popups.pupoo.board.review.dto.ReviewUpdateRequest;
import com.popups.pupoo.common.api.ApiResponse;
import com.popups.pupoo.common.api.PageResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

/**
 * 후기 API (pupoo_v3.6 기준)
 * - POST   /api/events/{eventId}/reviews  후기 작성
 * - PATCH  /api/reviews/{reviewId}       후기 수정
 * - DELETE /api/reviews/{reviewId}       후기 삭제
 * - GET    /api/reviews/my               내 후기 목록
 * - GET    /api/events/{eventId}/reviews 행사별 후기 목록
 */
@RestController
@RequestMapping("/api")
public class ReviewController {

    private final ReviewService reviewService;
    private final SecurityUtil securityUtil;

    public ReviewController(ReviewService reviewService, SecurityUtil securityUtil) {
        this.reviewService = reviewService;
        this.securityUtil = securityUtil;
    }

    /** 후기 작성 (인증 필요) */
    @PostMapping("/events/{eventId}/reviews")
    public ApiResponse<ReviewResponse> createReview(
            @PathVariable("eventId") Long eventId,
            @Valid @RequestBody ReviewCreateRequest request
    ) {
        Long userId = securityUtil.currentUserId();
        return ApiResponse.success(reviewService.createReview(eventId, userId, request));
    }

    /** 후기 수정 (인증 필요) */
    @PatchMapping("/reviews/{reviewId}")
    public ApiResponse<ReviewResponse> updateReview(
            @PathVariable("reviewId") Long reviewId,
            @Valid @RequestBody ReviewUpdateRequest request
    ) {
        Long userId = securityUtil.currentUserId();
        return ApiResponse.success(reviewService.updateReview(reviewId, userId, request));
    }

    /** 후기 삭제 (인증 필요) */
    @DeleteMapping("/reviews/{reviewId}")
    public ApiResponse<Void> deleteReview(@PathVariable("reviewId") Long reviewId) {
        Long userId = securityUtil.currentUserId();
        reviewService.deleteReview(reviewId, userId);
        return ApiResponse.success(null);
    }

    /** 내 후기 목록 (인증 필요) */
    @GetMapping("/reviews/my")
    public ApiResponse<PageResponse<ReviewResponse>> getMyReviews(Pageable pageable) {
        Long userId = securityUtil.currentUserId();
        return ApiResponse.success(reviewService.getMyReviews(userId, pageable));
    }

    /** 행사별 후기 목록 (비인증 허용) */
    @GetMapping("/events/{eventId}/reviews")
    public ApiResponse<PageResponse<ReviewResponse>> getEventReviews(
            @PathVariable("eventId") Long eventId,
            Pageable pageable
    ) {
        return ApiResponse.success(reviewService.getEventReviews(eventId, pageable));
    }
}