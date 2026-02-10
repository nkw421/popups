package com.pupoo.popups.board.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.pupoo.popups.common.response.ApiResponse;

@RestController
@RequestMapping("/api/boards")
public class BoardController {
  @GetMapping
  public ResponseEntity<ApiResponse<String>> list() {
    return ResponseEntity.ok(ApiResponse.ok("TODO: implement board list"));
  }
}
