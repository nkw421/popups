package com.pupoo.popups.notice.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.pupoo.popups.api.dto.*;
import com.pupoo.popups.common.response.ApiResponse;
import com.pupoo.popups.common.response.PageResponse;
import com.pupoo.popups.notice.service.NoticeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notices")
public class NoticeController {
  private final NoticeService noticeService;

  @GetMapping
  public ResponseEntity<PageResponse<NoticeDto>> list(Pageable pageable) {
    return ResponseEntity.ok(PageResponse.of(noticeService.list(pageable)));
  }

  @PreAuthorize("hasRole('ADMIN')")
  @PostMapping
  public ResponseEntity<ApiResponse<NoticeDto>> create(@RequestBody @Valid NoticeCreateRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(noticeService.create(request)));
  }
}
