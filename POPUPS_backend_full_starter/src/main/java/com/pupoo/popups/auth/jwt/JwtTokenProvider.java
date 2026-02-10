package com.pupoo.popups.auth.jwt;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtTokenProvider {
  private final JwtProperties props;

  private SecretKey key() {
    return Keys.hmacShaKeyFor(props.getSecret().getBytes(StandardCharsets.UTF_8));
  }

  public String createAccessToken(Long userId, String role) {
    Instant now = Instant.now();
    Instant exp = now.plusSeconds(props.getAccessTokenMinutes()*60L);
    return Jwts.builder()
      .issuer(props.getIssuer())
      .subject(String.valueOf(userId))
      .claims(Map.of("role", role))
      .issuedAt(Date.from(now))
      .expiration(Date.from(exp))
      .signWith(key(), Jwts.SIG.HS256)
      .compact();
  }

  public String createRefreshToken(Long userId) {
    Instant now = Instant.now();
    Instant exp = now.plusSeconds(props.getRefreshTokenDays()*24L*3600L);
    return Jwts.builder()
      .issuer(props.getIssuer())
      .subject(String.valueOf(userId))
      .issuedAt(Date.from(now))
      .expiration(Date.from(exp))
      .signWith(key(), Jwts.SIG.HS256)
      .compact();
  }

  public Jws<Claims> parse(String token) {
    return Jwts.parser()
      .verifyWith(key())
      .requireIssuer(props.getIssuer())
      .build()
      .parseSignedClaims(token);
  }
}
