package com.pupoo.popups.api.dto;

import java.time.LocalDateTime;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class EventDto {
    private Long eventId;
    private String eventName;
    private String description;
    private LocalDateTime startAt;
    private LocalDateTime endAt;
}
