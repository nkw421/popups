package com.pupoo.popups.event.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pupoo.popups.api.dto.EventDto;
import com.pupoo.popups.common.response.ApiResponse;
import com.pupoo.popups.common.response.PageResponse;
import com.pupoo.popups.event.service.EventService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/events")
public class EventController {
  private final EventService eventService;

  @GetMapping
  public ResponseEntity<PageResponse<EventDto>> list(Pageable pageable) {
    return ResponseEntity.ok(PageResponse.of(eventService.list(pageable)));
  }

  @GetMapping("/{eventId}")
  public ResponseEntity<ApiResponse<EventDto>> detail(@PathVariable Long eventId) {
    return ResponseEntity.ok(ApiResponse.ok(eventService.detail(eventId)));
  }
}
