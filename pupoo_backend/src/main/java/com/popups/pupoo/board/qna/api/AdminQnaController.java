// file: src/main/java/com/popups/pupoo/board/qna/api/AdminQnaController.java
package com.popups.pupoo.board.qna.api;

import com.popups.pupoo.board.qna.application.QnaService;
import com.popups.pupoo.board.qna.dto.QnaAnswerRequest;
import com.popups.pupoo.board.qna.dto.QnaResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 운영자 전용 QnA API
 * - 정책: ADMIN은 /api/admin/** 로만 접근
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/qnas")
public class AdminQnaController {

    private final QnaService qnaService;

    /**
     * 운영자 답변 등록/수정
     * - DB(v4.5)에는 answer_admin_id가 없으므로 adminId는 저장되지 않는다.
     */
    @PostMapping("/{qnaId}/answer")
    public ResponseEntity<QnaResponse> answer(@RequestHeader("X-ADMIN-ID") Long adminId,
                                              @PathVariable Long qnaId,
                                              @Valid @RequestBody QnaAnswerRequest request) {
        return ResponseEntity.ok(qnaService.answer(adminId, qnaId, request));
    }
}
