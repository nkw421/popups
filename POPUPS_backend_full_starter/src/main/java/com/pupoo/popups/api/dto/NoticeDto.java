package com.pupoo.popups.api.dto;

import java.time.LocalDateTime;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class NoticeDto {
    private Long noticeId;
    private String title;
    private String content;
    private LocalDateTime createdAt;
}
