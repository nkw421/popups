package com.pupoo.popups.user.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.pupoo.popups.api.dto.UserResponse;
import com.pupoo.popups.auth.security.PrincipalUser;
import com.pupoo.popups.common.response.ApiResponse;
import com.pupoo.popups.user.service.UserService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class MyPageController {
  private final UserService userService;

  @GetMapping("/me")
  public ResponseEntity<ApiResponse<UserResponse>> me(@AuthenticationPrincipal PrincipalUser principal) {
    return ResponseEntity.ok(ApiResponse.ok(userService.me(principal.getUserId())));
  }
}
