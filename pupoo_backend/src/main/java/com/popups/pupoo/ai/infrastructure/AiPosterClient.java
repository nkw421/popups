package com.popups.pupoo.ai.infrastructure;

import com.popups.pupoo.ai.dto.AdminEventPosterGenerateResponse;
import com.popups.pupoo.common.exception.BusinessException;
import com.popups.pupoo.common.exception.ErrorCode;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.Map;

@Component
public class AiPosterClient {

    private static final ParameterizedTypeReference<AiServiceEnvelope<AiPosterResult>> POSTER_RESULT_TYPE =
            new ParameterizedTypeReference<>() {};

    private final RestClient restClient;
    private final AiServiceProperties properties;

    public AiPosterClient(RestClient.Builder builder, AiServiceProperties properties) {
        this.properties = properties;
        this.restClient = builder
                .baseUrl(properties.baseUrl())
                .defaultHeader("X-Internal-Token", properties.internalToken())
                .build();
    }

    public AdminEventPosterGenerateResponse generatePoster(Map<String, Object> payload, Long eventId, String eventName) {
        try {
            AiServiceEnvelope<AiPosterResult> response = restClient.post()
                    .uri(properties.posterGeneratePath())
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .body(POSTER_RESULT_TYPE);

            if (response == null || !response.success() || response.data() == null) {
                throw new BusinessException(ErrorCode.INTERNAL_ERROR, "AI poster generation returned an empty response");
            }

            AiPosterResult data = response.data();
            String imageUrl = normalizeImageUrl(data.imageUrl());

            return new AdminEventPosterGenerateResponse(
                    eventId,
                    eventName,
                    data.status(),
                    imageUrl,
                    data.prompt(),
                    data.size(),
                    data.quality(),
                    data.background(),
                    data.outputFormat(),
                    data.outputCompression()
            );
        } catch (RestClientResponseException e) {
            throw new BusinessException(
                    ErrorCode.INTERNAL_ERROR,
                    "AI poster generation failed: status=%s body=%s".formatted(
                            e.getStatusCode().value(),
                            e.getResponseBodyAsString()
                    )
            );
        }
    }

    private String normalizeImageUrl(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) {
            return imageUrl;
        }
        if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
            return imageUrl;
        }

        String publicBaseUrl = properties.publicBaseUrl();
        String baseUrl = (publicBaseUrl == null || publicBaseUrl.isBlank()) ? properties.baseUrl() : publicBaseUrl;
        String normalizedBase = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        String normalizedPath = imageUrl.startsWith("/") ? imageUrl : "/" + imageUrl;
        return normalizedBase + normalizedPath;
    }

    private record AiServiceEnvelope<T>(
            boolean success,
            String code,
            String message,
            String traceId,
            T data
    ) {}

    private record AiPosterResult(
            String jobId,
            Long eventId,
            String status,
            String imageUrl,
            String prompt,
            String size,
            String quality,
            String background,
            String outputFormat,
            Integer outputCompression,
            String errorMessage
    ) {}
}
