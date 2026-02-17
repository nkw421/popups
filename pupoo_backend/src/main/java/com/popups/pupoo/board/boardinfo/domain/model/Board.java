package com.popups.pupoo.board.boardinfo.domain.model;

import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(name = "boards")
@Entity
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "board_id", nullable = false)
    private Long boardId; // bigint -> Long

    @Column(name = "board_name", nullable = false, length = 50)
    private String boardName; // 게시판명

    @Enumerated(EnumType.STRING)
    @Column(name = "board_type", nullable = false)
    private BoardType boardType; // 게시판 유형 (FREE, INFO 등)

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = true; // tinyint(1) -> boolean, 기본값 활성(1)

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", nullable = false, updatable = false)
    private Date createdAt;

    // --- ENUM 정의 ---
    public enum BoardType {
        FREE, INFO, REVIEW, QNA
    }

    // --- 시간 자동 설정 (Date 버전) ---
    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = new Date(System.currentTimeMillis());
        }
    }
}