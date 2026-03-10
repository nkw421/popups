package com.popups.pupoo.ai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AdminEventPosterApplyRequest(
        @NotBlank(message = "imageUrl is required")
        @Size(max = 1000, message = "imageUrl must be 1000 characters or fewer")
        String imageUrl
) {}
