package com.pupoo.popups.event.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.pupoo.popups.api.dto.EventDto;
import com.pupoo.popups.common.error.BusinessException;
import com.pupoo.popups.common.error.ErrorCode;
import com.pupoo.popups.event.domain.Event;
import com.pupoo.popups.event.repository.EventRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EventService {
  private final EventRepository eventRepository;

  public Page<EventDto> list(Pageable pageable) {
    return eventRepository.findAll(pageable).map(this::toDto);
  }

  public EventDto detail(Long eventId) {
    Event e = eventRepository.findById(eventId).orElseThrow(() -> new BusinessException(ErrorCode.EVENT_NOT_FOUND));
    return toDto(e);
  }

  private EventDto toDto(Event e) {
    return EventDto.builder()
      .eventId(e.getEventId())
      .eventName(e.getEventName())
      .description(e.getDescription())
      .startAt(e.getStartAt())
      .endAt(e.getEndAt())
      .build();
  }
}
