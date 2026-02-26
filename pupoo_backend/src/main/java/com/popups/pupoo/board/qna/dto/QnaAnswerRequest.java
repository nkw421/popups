// file: src/main/java/com/popups/pupoo/board/qna/dto/QnaAnswerRequest.java
package com.popups.pupoo.board.qna.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class QnaAnswerRequest {

    @NotBlank(message = "답변 내용은 필수입니다.")
    @Size(max = 2000, message = "답변 내용은 최대 2000자까지 가능합니다.")
    private String answerContent;
}
