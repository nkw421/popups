package com.popups.pupoo.board.review.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/**
 * 후기 작성 요청 DTO (pupoo_v3.6 기준)
 * - rating: 필수, 1~5
 * - content: 선택 (DB TEXT NULL)
 */
public class ReviewCreateRequest {

    @NotNull(message = "별점은 필수입니다.")
    @Min(value = 1, message = "별점은 1 이상이어야 합니다.")
    @Max(value = 5, message = "별점은 5 이하여야 합니다.")
    private Integer rating;

    private String content;

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}