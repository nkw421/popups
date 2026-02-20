package com.popups.pupoo.board.review.domain.enums;

/**
 * 후기 상태 (DB: ENUM('PUBLIC','REPORTED','BLINDED','DELETED'))
 */
public enum ReviewStatus {
    PUBLIC,
    REPORTED,
    BLINDED,
    DELETED
}