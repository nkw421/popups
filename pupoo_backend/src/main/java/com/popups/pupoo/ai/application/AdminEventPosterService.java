package com.popups.pupoo.ai.application;

import com.popups.pupoo.ai.dto.AdminEventPosterApplyRequest;
import com.popups.pupoo.ai.dto.AdminEventPosterGenerateRequest;
import com.popups.pupoo.ai.dto.AdminEventPosterGenerateResponse;
import com.popups.pupoo.ai.infrastructure.AiPosterClient;
import com.popups.pupoo.common.audit.application.AdminLogService;
import com.popups.pupoo.common.audit.domain.enums.AdminTargetType;
import com.popups.pupoo.common.exception.BusinessException;
import com.popups.pupoo.common.exception.ErrorCode;
import com.popups.pupoo.event.domain.model.Event;
import com.popups.pupoo.event.dto.EventResponse;
import com.popups.pupoo.event.persistence.EventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class AdminEventPosterService {

    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private final EventRepository eventRepository;
    private final AiPosterClient aiPosterClient;
    private final AdminLogService adminLogService;

    public AdminEventPosterService(
            EventRepository eventRepository,
            AiPosterClient aiPosterClient,
            AdminLogService adminLogService
    ) {
        this.eventRepository = eventRepository;
        this.aiPosterClient = aiPosterClient;
        this.adminLogService = adminLogService;
    }

    public AdminEventPosterGenerateResponse generate(Long eventId, AdminEventPosterGenerateRequest request) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new BusinessException(ErrorCode.EVENT_NOT_FOUND));

        String outputFormat = resolveOutputFormat(request.outputFormat());
        validateOptionCombination(request.background(), outputFormat);

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("event_id", event.getEventId());
        payload.put("title", event.getEventName());
        payload.put("date_text", formatDateRange(event));
        payload.put("location", defaultText(event.getLocation(), "Location TBD"));
        payload.put("summary", defaultText(event.getDescription(), "No event summary provided."));
        payload.put("style", resolveStyle(request.style()));
        payload.put("tone", defaultText(request.tone(), "balanced"));
        payload.put("size", resolveSize(request.size()));
        payload.put("quality", resolveQuality(request.quality()));
        payload.put("background", resolveBackground(request.background()));
        payload.put("output_format", outputFormat);

        Integer outputCompression = request.outputCompression();
        if (outputCompression != null && ("jpeg".equals(outputFormat) || "webp".equals(outputFormat))) {
            payload.put("output_compression", outputCompression);
        }

        return aiPosterClient.generatePoster(payload, event.getEventId(), event.getEventName());
    }

    @Transactional
    public EventResponse apply(Long eventId, AdminEventPosterApplyRequest request) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new BusinessException(ErrorCode.EVENT_NOT_FOUND));

        String imageUrl = defaultText(request.imageUrl(), null);
        if (imageUrl == null) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST, "imageUrl is required");
        }

        event.updateImageUrl(imageUrl);
        adminLogService.write("EVENT_POSTER_APPLY", AdminTargetType.EVENT, eventId);
        return EventResponse.from(event);
    }

    private void validateOptionCombination(String background, String outputFormat) {
        if ("transparent".equalsIgnoreCase(defaultText(background, "auto")) && "jpeg".equals(outputFormat)) {
            throw new BusinessException(
                    ErrorCode.INVALID_REQUEST,
                    "Transparent background is not supported with jpeg output"
            );
        }
    }

    private String formatDateRange(Event event) {
        return DATE_TIME_FORMATTER.format(event.getStartAt()) + " - " + DATE_TIME_FORMATTER.format(event.getEndAt());
    }

    private String resolveStyle(String style) {
        return defaultText(style, "MODERN").toUpperCase();
    }

    private String resolveSize(String size) {
        return defaultText(size, "1024x1536");
    }

    private String resolveQuality(String quality) {
        return defaultText(quality, "high").toLowerCase();
    }

    private String resolveBackground(String background) {
        return defaultText(background, "auto").toLowerCase();
    }

    private String resolveOutputFormat(String outputFormat) {
        return defaultText(outputFormat, "png").toLowerCase();
    }

    private String defaultText(String value, String defaultValue) {
        if (value == null || value.isBlank()) {
            return defaultValue;
        }
        return value;
    }
}
