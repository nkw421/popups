package com.popups.pupoo.board.qna.persistence;

import com.popups.pupoo.board.qna.domain.model.Qna;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

/**
 * QnA Repository
 * - QnA CRUD 및 행사별/사용자별 조회
 */
public interface QnaRepository extends JpaRepository<Qna, Long> {

    /**
     * 특정 행사의 QnA 목록 (삭제 안 된 것, 최신순)
     */
    @Query("""
        SELECT q
        FROM Qna q
        WHERE q.eventId = :eventId
          AND q.isDeleted = false
        ORDER BY q.createdAt DESC
    """)
    Page<Qna> findByEventId(@Param("eventId") Long eventId, Pageable pageable);

    /**
     * 특정 사용자의 QnA 목록 (내 질문, 삭제 안 된 것)
     */
    @Query("""
        SELECT q
        FROM Qna q
        WHERE q.userId = :userId
          AND q.isDeleted = false
        ORDER BY q.createdAt DESC
    """)
    Page<Qna> findByUserId(@Param("userId") Long userId, Pageable pageable);

    /**
     * QnA 단건 조회 (삭제 안 된 것 - 수정/삭제/답변 시 사용)
     */
    @Query("""
        SELECT q
        FROM Qna q
        WHERE q.qnaId = :qnaId
          AND q.isDeleted = false
    """)
    Optional<Qna> findByIdAndNotDeleted(@Param("qnaId") Long qnaId);
}