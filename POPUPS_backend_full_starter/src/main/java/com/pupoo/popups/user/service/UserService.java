package com.pupoo.popups.user.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.pupoo.popups.api.dto.*;
import com.pupoo.popups.common.error.BusinessException;
import com.pupoo.popups.common.error.ErrorCode;
import com.pupoo.popups.user.domain.Role;
import com.pupoo.popups.user.domain.User;
import com.pupoo.popups.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public UserResponse create(UserCreateRequest request) {
    if (userRepository.existsByEmail(request.getEmail())) throw new BusinessException(ErrorCode.USER_EMAIL_DUPLICATED);
    User u = userRepository.save(User.builder()
      .email(request.getEmail())
      .password(passwordEncoder.encode(request.getPassword()))
      .nickname(request.getNickname())
      .role(Role.USER)
      .build());
    return UserResponse.builder()
      .userId(u.getUserId())
      .email(u.getEmail())
      .nickname(u.getNickname())
      .role(u.getRole().name())
      .build();
  }

  public UserResponse me(Long userId) {
    User u = userRepository.findById(userId).orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
    return UserResponse.builder()
      .userId(u.getUserId())
      .email(u.getEmail())
      .nickname(u.getNickname())
      .role(u.getRole().name())
      .build();
  }
}
