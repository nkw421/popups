package com.pupoo.popups.auth.service;

import java.time.LocalDateTime;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.pupoo.popups.api.dto.*;
import com.pupoo.popups.auth.domain.RefreshToken;
import com.pupoo.popups.auth.jwt.JwtTokenProvider;
import com.pupoo.popups.auth.repository.RefreshTokenRepository;
import com.pupoo.popups.common.error.BusinessException;
import com.pupoo.popups.common.error.ErrorCode;
import com.pupoo.popups.user.domain.User;
import com.pupoo.popups.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
  private final UserRepository userRepository;
  private final RefreshTokenRepository refreshTokenRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtTokenProvider tokenProvider;

  public LoginResponse login(LoginRequest request) {
    User u = userRepository.findByEmail(request.getEmail())
      .orElseThrow(() -> new BusinessException(ErrorCode.AUTH_BAD_CREDENTIALS));
    if (!passwordEncoder.matches(request.getPassword(), u.getPassword())) {
      throw new BusinessException(ErrorCode.AUTH_BAD_CREDENTIALS);
    }
    String access = tokenProvider.createAccessToken(u.getUserId(), u.getRole().name());
    String refresh = tokenProvider.createRefreshToken(u.getUserId());
    refreshTokenRepository.save(RefreshToken.builder()
      .userId(u.getUserId())
      .token(refresh)
      .expiresAt(LocalDateTime.now().plusDays(14))
      .build());
    return LoginResponse.builder().accessToken(access).refreshToken(refresh).build();
  }

  public TokenResponse refresh(RefreshRequest request) {
    RefreshToken rt = refreshTokenRepository.findByToken(request.getRefreshToken())
      .orElseThrow(() -> new BusinessException(ErrorCode.AUTH_INVALID_TOKEN));
    Long userId = Long.valueOf(tokenProvider.parse(rt.getToken()).getPayload().getSubject());
    User u = userRepository.findById(userId)
      .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
    String access = tokenProvider.createAccessToken(u.getUserId(), u.getRole().name());
    return TokenResponse.builder().accessToken(access).build();
  }

  public void logout(String refreshToken) {
    if (refreshToken != null && !refreshToken.isBlank()) refreshTokenRepository.deleteByToken(refreshToken);
  }
}
