package com.popups.pupoo.board.qna.api;

import com.popups.pupoo.auth.security.util.SecurityUtil;
import com.popups.pupoo.board.qna.application.QnaService;
import com.popups.pupoo.board.qna.dto.QnaCreateRequest;
import com.popups.pupoo.board.qna.dto.QnaResponse;
import com.popups.pupoo.board.qna.dto.QnaUpdateRequest;
import com.popups.pupoo.common.api.ApiResponse;
import com.popups.pupoo.common.api.PageResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

/**
 * QnA API
 * - POST   /api/events/{eventId}/qnas   QnA 작성
 * - PATCH  /api/qnas/{qnaId}           QnA 수정
 * - DELETE /api/qnas/{qnaId}           QnA 삭제
 * - GET    /api/qnas/{qnaId}           QnA 단건 조회 (조회수 증가)
 * - GET    /api/qnas/my                내 QnA 목록
 * - GET    /api/events/{eventId}/qnas  행사별 QnA 목록
 */
@RestController
@RequestMapping("/api")
public class QnaController {

    private final QnaService qnaService;
    private final SecurityUtil securityUtil;

    public QnaController(QnaService qnaService, SecurityUtil securityUtil) {
        this.qnaService = qnaService;
        this.securityUtil = securityUtil;
    }

    /** QnA 작성 (인증 필요) */
    @PostMapping("/events/{eventId}/qnas")
    public ApiResponse<QnaResponse> createQna(
            @PathVariable("eventId") Long eventId,
            @Valid @RequestBody QnaCreateRequest request
    ) {
        Long userId = securityUtil.currentUserId();
        return ApiResponse.success(qnaService.createQna(eventId, userId, request));
    }

    /** QnA 수정 (인증 필요) */
    @PatchMapping("/qnas/{qnaId}")
    public ApiResponse<QnaResponse> updateQna(
            @PathVariable("qnaId") Long qnaId,
            @Valid @RequestBody QnaUpdateRequest request
    ) {
        Long userId = securityUtil.currentUserId();
        return ApiResponse.success(qnaService.updateQna(qnaId, userId, request));
    }

    /** QnA 삭제 (인증 필요) */
    @DeleteMapping("/qnas/{qnaId}")
    public ApiResponse<Void> deleteQna(@PathVariable("qnaId") Long qnaId) {
        Long userId = securityUtil.currentUserId();
        qnaService.deleteQna(qnaId, userId);
        return ApiResponse.success(null);
    }

    /** QnA 단건 조회 (비인증 허용, 조회수 증가) */
    @GetMapping("/qnas/{qnaId}")
    public ApiResponse<QnaResponse> getQna(@PathVariable("qnaId") Long qnaId) {
        return ApiResponse.success(qnaService.getQna(qnaId));
    }

    /** 내 QnA 목록 (인증 필요) */
    @GetMapping("/qnas/my")
    public ApiResponse<PageResponse<QnaResponse>> getMyQnas(Pageable pageable) {
        Long userId = securityUtil.currentUserId();
        return ApiResponse.success(qnaService.getMyQnas(userId, pageable));
    }

    /** 행사별 QnA 목록 (비인증 허용) */
    @GetMapping("/events/{eventId}/qnas")
    public ApiResponse<PageResponse<QnaResponse>> getEventQnas(
            @PathVariable("eventId") Long eventId,
            Pageable pageable
    ) {
        return ApiResponse.success(qnaService.getEventQnas(eventId, pageable));
    }
}