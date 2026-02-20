package com.popups.pupoo.board.qna.application;

import com.popups.pupoo.board.qna.domain.model.Qna;
import com.popups.pupoo.board.qna.dto.QnaCreateRequest;
import com.popups.pupoo.board.qna.dto.QnaResponse;
import com.popups.pupoo.board.qna.dto.QnaUpdateRequest;
import com.popups.pupoo.board.qna.persistence.QnaRepository;
import com.popups.pupoo.common.api.PageResponse;
import com.popups.pupoo.common.exception.BusinessException;
import com.popups.pupoo.common.exception.ErrorCode;
import com.popups.pupoo.event.persistence.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * QnA 서비스
 * - 작성/수정/삭제/목록 조회/단건 조회(조회수 증가)
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class QnaService {

    private final QnaRepository qnaRepository;
    private final EventRepository eventRepository;

    /**
     * QnA 작성
     */
    @Transactional
    public QnaResponse createQna(Long eventId, Long userId, QnaCreateRequest request) {
        if (!eventRepository.existsById(eventId)) {
            throw new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "존재하지 않는 행사입니다. eventId=" + eventId);
        }
        Qna qna = Qna.create(eventId, userId, request.getTitle(), request.getContent());
        Qna saved = qnaRepository.save(qna);
        return QnaResponse.from(saved);
    }

    /**
     * QnA 수정 (본인만, 답변 전만 허용하려면 qnaStatus == PENDING 체크 추가 가능)
     */
    @Transactional
    public QnaResponse updateQna(Long qnaId, Long userId, QnaUpdateRequest request) {
        Qna qna = qnaRepository.findByIdAndNotDeleted(qnaId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "존재하지 않는 QnA입니다. qnaId=" + qnaId));
        if (!qna.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "QnA를 수정할 권한이 없습니다.");
        }
        qna.update(request.getTitle(), request.getContent());
        return QnaResponse.from(qna);
    }

    /**
     * QnA 삭제 (소프트 삭제, 본인만)
     */
    @Transactional
    public void deleteQna(Long qnaId, Long userId) {
        Qna qna = qnaRepository.findByIdAndNotDeleted(qnaId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "존재하지 않는 QnA입니다. qnaId=" + qnaId));
        if (!qna.getUserId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "QnA를 삭제할 권한이 없습니다.");
        }
        qna.delete();
    }

    /**
     * QnA 단건 조회 (조회수 증가)
     */
    @Transactional
    public QnaResponse getQna(Long qnaId) {
        Qna qna = qnaRepository.findByIdAndNotDeleted(qnaId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "존재하지 않는 QnA입니다. qnaId=" + qnaId));
        qna.incrementViewCount();
        return QnaResponse.from(qna);
    }

    /**
     * 내 QnA 목록
     */
    public PageResponse<QnaResponse> getMyQnas(Long userId, Pageable pageable) {
        Page<Qna> page = qnaRepository.findByUserId(userId, pageable);
        return PageResponse.from(page.map(QnaResponse::from));
    }

    /**
     * 특정 행사의 QnA 목록
     */
    public PageResponse<QnaResponse> getEventQnas(Long eventId, Pageable pageable) {
        if (!eventRepository.existsById(eventId)) {
            throw new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "존재하지 않는 행사입니다. eventId=" + eventId);
        }
        Page<Qna> page = qnaRepository.findByEventId(eventId, pageable);
        return PageResponse.from(page.map(QnaResponse::from));
    }
}