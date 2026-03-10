package com.popups.pupoo.ai.dto;

public record AdminEventPosterGenerateResponse(
        Long eventId,
        String eventName,
        String status,
        String imageUrl,
        String prompt,
        String size,
        String quality,
        String background,
        String outputFormat,
        Integer outputCompression
) {}
