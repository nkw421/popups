package com.pupoo.popups.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pupoo.popups.api.dto.*;
import com.pupoo.popups.auth.service.AuthService;
import com.pupoo.popups.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
  private final AuthService authService;

  @PostMapping("/login")
  public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody @Valid LoginRequest request) {
    return ResponseEntity.ok(ApiResponse.ok(authService.login(request)));
  }

  @PostMapping("/refresh")
  public ResponseEntity<ApiResponse<TokenResponse>> refresh(@RequestBody @Valid RefreshRequest request) {
    return ResponseEntity.ok(ApiResponse.ok(authService.refresh(request)));
  }

  @PostMapping("/logout")
  public ResponseEntity<ApiResponse<Void>> logout(@RequestHeader(value="X-Refresh-Token", required=false) String refreshToken) {
    authService.logout(refreshToken);
    return ResponseEntity.ok(ApiResponse.ok());
  }
}
