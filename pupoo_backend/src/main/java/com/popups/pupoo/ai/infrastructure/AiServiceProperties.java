package com.popups.pupoo.ai.infrastructure;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "ai.service")
public record AiServiceProperties(
        String baseUrl,
        String internalToken,
        String posterGeneratePath,
        String publicBaseUrl
) {}
