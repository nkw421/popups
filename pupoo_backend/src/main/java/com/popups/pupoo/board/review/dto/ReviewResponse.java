package com.popups.pupoo.board.review.dto;

import com.popups.pupoo.board.review.domain.model.Review;

import java.time.LocalDateTime;

/**
 * 후기 응답 DTO (pupoo_v3.6 기준)
 */
public class ReviewResponse {

    private Long reviewId;
    private Long eventId;
    private Long userId;
    private Integer rating;
    private String content;
    private Integer viewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ReviewResponse() {
    }

    public ReviewResponse(Long reviewId, Long eventId, Long userId, Integer rating, String content,
                          Integer viewCount, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.reviewId = reviewId;
        this.eventId = eventId;
        this.userId = userId;
        this.rating = rating;
        this.content = content;
        this.viewCount = viewCount;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static ReviewResponse from(Review review) {
        return new ReviewResponse(
                review.getReviewId(),
                review.getEventId(),
                review.getUserId(),
                review.getRating(),
                review.getContent(),
                review.getViewCount(),
                review.getCreatedAt(),
                review.getUpdatedAt()
        );
    }

    public Long getReviewId() { return reviewId; }
    public void setReviewId(Long reviewId) { this.reviewId = reviewId; }
    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Integer getViewCount() { return viewCount; }
    public void setViewCount(Integer viewCount) { this.viewCount = viewCount; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}