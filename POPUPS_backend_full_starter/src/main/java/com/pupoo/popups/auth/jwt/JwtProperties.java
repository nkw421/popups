package com.pupoo.popups.auth.jwt;

import org.springframework.boot.context.properties.ConfigurationProperties;
import lombok.Getter; import lombok.Setter;

@Getter @Setter
@ConfigurationProperties(prefix="app.jwt")
public class JwtProperties {
  private String issuer;
  private String secret;
  private int accessTokenMinutes;
  private int refreshTokenDays;
}
