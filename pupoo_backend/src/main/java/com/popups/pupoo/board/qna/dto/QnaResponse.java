package com.popups.pupoo.board.qna.dto;

import com.popups.pupoo.board.qna.domain.enums.QnaStatus;
import com.popups.pupoo.board.qna.domain.model.Qna;

import java.time.LocalDateTime;

/**
 * QnA 응답 DTO
 */
public class QnaResponse {

    private Long qnaId;
    private Long eventId;
    private Long userId;
    private String title;
    private String content;
    private String answer;
    private Integer viewCount;
    private QnaStatus qnaStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public QnaResponse() {
    }

    public QnaResponse(Long qnaId, Long eventId, Long userId, String title, String content,
                       String answer, Integer viewCount, QnaStatus qnaStatus,
                       LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.qnaId = qnaId;
        this.eventId = eventId;
        this.userId = userId;
        this.title = title;
        this.content = content;
        this.answer = answer;
        this.viewCount = viewCount;
        this.qnaStatus = qnaStatus;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static QnaResponse from(Qna qna) {
        return new QnaResponse(
                qna.getQnaId(),
                qna.getEventId(),
                qna.getUserId(),
                qna.getTitle(),
                qna.getContent(),
                qna.getAnswer(),
                qna.getViewCount(),
                qna.getQnaStatus(),
                qna.getCreatedAt(),
                qna.getUpdatedAt()
        );
    }

    public Long getQnaId() { return qnaId; }
    public void setQnaId(Long qnaId) { this.qnaId = qnaId; }
    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }
    public Integer getViewCount() { return viewCount; }
    public void setViewCount(Integer viewCount) { this.viewCount = viewCount; }
    public QnaStatus getQnaStatus() { return qnaStatus; }
    public void setQnaStatus(QnaStatus qnaStatus) { this.qnaStatus = qnaStatus; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}