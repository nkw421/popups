package com.popups.pupoo.board.qna.domain.model;

import com.popups.pupoo.board.qna.domain.enums.QnaStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;

/**
 * QnA 엔티티
 *
 * 테이블: qnas
 * - qna_id (PK), event_id, user_id
 * - title, content (TEXT), answer (TEXT NULL)
 * - view_count, created_at, updated_at
 * - is_deleted (TINYINT 0/1)
 * - qna_status (PENDING/ANSWERED/DELETED)
 */
@Entity
@Table(
        name = "qnas",
        indexes = {
                @Index(name = "ix_qnas_event_id", columnList = "event_id"),
                @Index(name = "ix_qnas_user_id", columnList = "user_id"),
                @Index(name = "ix_qnas_status", columnList = "qna_status")
        }
)
public class Qna {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "qna_id")
    private Long qnaId;

    @Column(name = "event_id", nullable = false)
    private Long eventId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "answer", columnDefinition = "TEXT")
    private String answer;

    @Column(name = "view_count", nullable = false)
    private Integer viewCount = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "is_deleted", nullable = false, columnDefinition = "TINYINT(1)")
    private Boolean isDeleted = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "qna_status", nullable = false, length = 20)
    private QnaStatus qnaStatus = QnaStatus.PENDING;

    protected Qna() {}

    public static Qna create(Long eventId, Long userId, String title, String content) {
        Qna q = new Qna();
        q.eventId = eventId;
        q.userId = userId;
        q.title = title;
        q.content = content;
        q.answer = null;
        q.viewCount = 0;
        q.isDeleted = false;
        q.qnaStatus = QnaStatus.PENDING;
        LocalDateTime now = LocalDateTime.now();
        q.createdAt = now;
        q.updatedAt = now;
        return q;
    }

    public void update(String title, String content) {
        this.title = title;
        this.content = content;
        this.updatedAt = LocalDateTime.now();
    }

    public void answer(String answer) {
        this.answer = answer;
        this.qnaStatus = QnaStatus.ANSWERED;
        this.updatedAt = LocalDateTime.now();
    }

    public void delete() {
        this.isDeleted = true;
        this.qnaStatus = QnaStatus.DELETED;
        this.updatedAt = LocalDateTime.now();
    }

    public void incrementViewCount() {
        this.viewCount++;
    }

    public Long getQnaId() { return qnaId; }
    public Long getEventId() { return eventId; }
    public Long getUserId() { return userId; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public String getAnswer() { return answer; }
    public Integer getViewCount() { return viewCount; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public Boolean getIsDeleted() { return isDeleted; }
    public QnaStatus getQnaStatus() { return qnaStatus; }
    public boolean isDeleted() { return Boolean.TRUE.equals(isDeleted); }
}