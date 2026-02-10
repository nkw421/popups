package com.pupoo.popups.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class NoticeCreateRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String content;
}
