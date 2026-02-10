package com.pupoo.popups.api.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class UserResponse {
    private Long userId;
    private String email;
    private String nickname;
    private String role;
}
