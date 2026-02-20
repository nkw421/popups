package com.popups.pupoo.board.review.domain.model;

import com.popups.pupoo.board.review.domain.enums.ReviewStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;

/**
 * Review 엔티티 (pupoo_v3.6 기준)
 *
 * 테이블: reviews
 * - review_id (PK), event_id, user_id
 * - rating (1~5), content (TEXT NULL), view_count
 * - created_at, updated_at
 * - is_deleted (TINYINT 0/1)
 * - review_status (PUBLIC/REPORTED/BLINDED/DELETED)
 *
 * 정책: 행사 1건당 사용자 1건 후기 (UNIQUE event_id, user_id)
 */
@Entity
@Table(
        name = "reviews",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_reviews_event_user", columnNames = {"event_id", "user_id"})
        },
        indexes = {
                @Index(name = "ix_reviews_event_id", columnList = "event_id"),
                @Index(name = "ix_reviews_user_id", columnList = "user_id"),
                @Index(name = "ix_reviews_status", columnList = "review_status")
        }
)
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Long reviewId;

    @Column(name = "event_id", nullable = false)
    private Long eventId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "rating", nullable = false)
    private Integer rating;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "view_count", nullable = false)
    private Integer viewCount = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "is_deleted", nullable = false, columnDefinition = "TINYINT(1)")
    private Boolean isDeleted = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "review_status", nullable = false, length = 20)
    private ReviewStatus reviewStatus = ReviewStatus.PUBLIC;

    protected Review() {}

    public static Review create(Long eventId, Long userId, Integer rating, String content) {
        Review r = new Review();
        r.eventId = eventId;
        r.userId = userId;
        r.rating = rating;
        r.content = content;
        r.viewCount = 0;
        r.isDeleted = false;
        r.reviewStatus = ReviewStatus.PUBLIC;
        LocalDateTime now = LocalDateTime.now();
        r.createdAt = now;
        r.updatedAt = now;
        return r;
    }

    public void update(Integer rating, String content) {
        this.rating = rating;
        this.content = content;
        this.updatedAt = LocalDateTime.now();
    }

    public void delete() {
        this.isDeleted = true;
        this.reviewStatus = ReviewStatus.DELETED;
        this.updatedAt = LocalDateTime.now();
    }

    public void incrementViewCount() {
        this.viewCount++;
    }

    public Long getReviewId() { return reviewId; }
    public Long getEventId() { return eventId; }
    public Long getUserId() { return userId; }
    public Integer getRating() { return rating; }
    public String getContent() { return content; }
    public Integer getViewCount() { return viewCount; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public Boolean getIsDeleted() { return isDeleted; }
    public ReviewStatus getReviewStatus() { return reviewStatus; }
    public boolean isDeleted() { return Boolean.TRUE.equals(isDeleted); }
}