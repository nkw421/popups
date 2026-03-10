package com.popups.pupoo.ai.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AdminEventPosterGenerateRequest(
        @Pattern(
                regexp = "MODERN|FESTIVAL|MINIMAL|PLAYFUL",
                message = "style must be one of MODERN, FESTIVAL, MINIMAL, PLAYFUL"
        )
        String style,
        @Size(max = 80, message = "tone must be 80 characters or fewer")
        String tone,
        @Pattern(
                regexp = "\\d+x\\d+",
                message = "size must follow WIDTHxHEIGHT format"
        )
        String size,
        @Pattern(
                regexp = "low|medium|high|auto",
                message = "quality must be one of low, medium, high, auto"
        )
        String quality,
        @Pattern(
                regexp = "auto|opaque|transparent",
                message = "background must be one of auto, opaque, transparent"
        )
        String background,
        @Pattern(
                regexp = "png|jpeg|webp",
                message = "outputFormat must be one of png, jpeg, webp"
        )
        String outputFormat,
        @Min(value = 0, message = "outputCompression must be at least 0")
        @Max(value = 100, message = "outputCompression must be 100 or less")
        Integer outputCompression
) {}
