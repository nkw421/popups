package com.popups.pupoo.board.review.application;

import com.popups.pupoo.board.review.domain.model.Review;
import com.popups.pupoo.board.review.dto.ReviewCreateRequest;
import com.popups.pupoo.board.review.dto.ReviewResponse;
import com.popups.pupoo.board.review.dto.ReviewUpdateRequest;
import com.popups.pupoo.board.review.persistence.ReviewRepository;
import com.popups.pupoo.common.api.PageResponse;
import com.popups.pupoo.common.exception.BusinessException;
import com.popups.pupoo.common.exception.ErrorCode;
import com.popups.pupoo.event.persistence.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 후기 서비스 (pupoo_v3.6 기준)
 * - 작성/수정/삭제/목록 조회
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final EventRepository eventRepository;

    /**
     * 후기 작성 (행사 1건당 사용자 1건만 허용)
     */
    @Transactional
    public ReviewResponse createReview(Long eventId, Long userId, ReviewCreateRequest request) {
        if (!eventRepository.existsById(eventId)) {
            throw new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "존재하지 않는 행사입니다. eventId=" + eventId);
        }
        if (reviewRepository.findByEventIdAndUserIdAndIsDeletedFalse(eventId, userId).isPresent()) {
            throw new BusinessException(ErrorCode.DUPLICATE_RESOURCE, "이미 해당 행사에 후기를 작성하셨습니다.");
        }
        Review review = Review.create(eventId, userId, request.getRating(), request.getContent());
        Review saved = reviewRepository.save(review);
        return ReviewResponse.from(saved);
    }

    /**
     * 후기 수정 (본인만)
     */
    @Transactional
    public ReviewResponse updateReview(Long reviewId, Long userId, ReviewUpdateRequest request) {
        Review review = reviewRepository.findByIdAndNotDeleted(reviewId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "존재하지 않는 후기입니다. reviewId=" + reviewId));
        if (!review.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "후기를 수정할 권한이 없습니다.");
        }
        review.update(request.getRating(), request.getContent());
        return ReviewResponse.from(review);
    }

    /**
     * 후기 삭제 (소프트 삭제, 본인만)
     */
    @Transactional
    public void deleteReview(Long reviewId, Long userId) {
        Review review = reviewRepository.findByIdAndNotDeleted(reviewId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "존재하지 않는 후기입니다. reviewId=" + reviewId));
        if (!review.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "후기를 삭제할 권한이 없습니다.");
        }
        review.delete();
    }

    /**
     * 내 후기 목록
     */
    public PageResponse<ReviewResponse> getMyReviews(Long userId, Pageable pageable) {
        Page<Review> page = reviewRepository.findByUserId(userId, pageable);
        return PageResponse.from(page.map(ReviewResponse::from));
    }

    /**
     * 특정 행사의 후기 목록
     */
    public PageResponse<ReviewResponse> getEventReviews(Long eventId, Pageable pageable) {
        if (!eventRepository.existsById(eventId)) {
            throw new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "존재하지 않는 행사입니다. eventId=" + eventId);
        }
        Page<Review> page = reviewRepository.findByEventId(eventId, pageable);
        return PageResponse.from(page.map(ReviewResponse::from));
    }
}