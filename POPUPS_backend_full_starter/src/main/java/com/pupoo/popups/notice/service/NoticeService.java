package com.pupoo.popups.notice.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.pupoo.popups.api.dto.NoticeCreateRequest;
import com.pupoo.popups.api.dto.NoticeDto;
import com.pupoo.popups.notice.domain.Notice;
import com.pupoo.popups.notice.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NoticeService {
  private final NoticeRepository noticeRepository;

  public Page<NoticeDto> list(Pageable pageable) {
    return noticeRepository.findAll(pageable).map(this::toDto);
  }

  public NoticeDto create(NoticeCreateRequest req) {
    Notice n = noticeRepository.save(Notice.builder().title(req.getTitle()).content(req.getContent()).build());
    return toDto(n);
  }

  private NoticeDto toDto(Notice n) {
    return NoticeDto.builder()
      .noticeId(n.getNoticeId())
      .title(n.getTitle())
      .content(n.getContent())
      .createdAt(n.getCreatedAt())
      .build();
  }
}
