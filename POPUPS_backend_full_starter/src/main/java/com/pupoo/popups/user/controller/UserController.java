package com.pupoo.popups.user.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pupoo.popups.api.dto.*;
import com.pupoo.popups.common.response.ApiResponse;
import com.pupoo.popups.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {
  private final UserService userService;

  @PostMapping
  public ResponseEntity<ApiResponse<UserResponse>> create(@RequestBody @Valid UserCreateRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(userService.create(request)));
  }
}
