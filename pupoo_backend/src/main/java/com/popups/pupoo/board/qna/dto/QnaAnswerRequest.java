// file: src/main/java/com/popups/pupoo/board/qna/dto/QnaAnswerRequest.java
package com.popups.pupoo.board.qna.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class QnaAnswerRequest {

    @NotBlank
    private String content;
}
