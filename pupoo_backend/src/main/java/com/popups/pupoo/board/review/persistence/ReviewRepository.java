package com.popups.pupoo.board.review.persistence;

import com.popups.pupoo.board.review.domain.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

/**
 * Review Repository (pupoo_v3.6 기준)
 * - 후기 CRUD 및 행사별/사용자별 조회
 */
public interface ReviewRepository extends JpaRepository<Review, Long> {

    /**
     * 특정 행사의 후기 목록 (삭제 안 된 것, PUBLIC만)
     */
    @Query("""
        SELECT r
        FROM Review r
        WHERE r.eventId = :eventId
          AND r.isDeleted = false
          AND r.reviewStatus = 'PUBLIC'
        ORDER BY r.createdAt DESC
    """)
    Page<Review> findByEventId(@Param("eventId") Long eventId, Pageable pageable);

    /**
     * 특정 사용자의 후기 목록 (내 후기, 삭제 안 된 것, PUBLIC만)
     */
    @Query("""
        SELECT r
        FROM Review r
        WHERE r.userId = :userId
          AND r.isDeleted = false
          AND r.reviewStatus = 'PUBLIC'
        ORDER BY r.createdAt DESC
    """)
    Page<Review> findByUserId(@Param("userId") Long userId, Pageable pageable);

    /**
     * 행사 + 사용자로 후기 조회 (삭제 안 된 것만, 중복 작성 체크용)
     */
    @Query("""
        SELECT r
        FROM Review r
        WHERE r.eventId = :eventId
          AND r.userId = :userId
          AND r.isDeleted = false
    """)
    Optional<Review> findByEventIdAndUserIdAndIsDeletedFalse(
            @Param("eventId") Long eventId,
            @Param("userId") Long userId);

    /**
     * 후기 단건 조회 (삭제 안 된 것, PUBLIC만 - 수정/삭제 시 사용)
     */
    @Query("""
        SELECT r
        FROM Review r
        WHERE r.reviewId = :reviewId
          AND r.isDeleted = false
          AND r.reviewStatus = 'PUBLIC'
    """)
    Optional<Review> findByIdAndNotDeleted(@Param("reviewId") Long reviewId);
}