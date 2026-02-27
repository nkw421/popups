// file: src/main/java/com/popups/pupoo/program/api/ProgramAdminController.java
package com.popups.pupoo.program.api;

import com.popups.pupoo.common.api.ApiResponse;
import com.popups.pupoo.common.audit.annotation.AdminAudit;
import com.popups.pupoo.common.audit.domain.enums.AdminTargetType;
import com.popups.pupoo.program.application.ProgramAdminService;
import com.popups.pupoo.program.dto.ProgramCreateRequest;
import com.popups.pupoo.program.dto.ProgramResponse;
import com.popups.pupoo.program.dto.ProgramUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 프로그램(세션/콘테스트/체험) 관리자 API
 *
 * SpeakerAdminController 패턴과 동일하게 구성.
 * - POST   /api/admin/programs          → 프로그램 등록
 * - PATCH  /api/admin/programs/{id}     → 프로그램 수정
 * - DELETE /api/admin/programs/{id}     → 프로그램 삭제
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/programs")
public class ProgramAdminController {

    private final ProgramAdminService programAdminService;

    @PostMapping
    @AdminAudit(
            action = "PROGRAM_CREATE",
            targetType = AdminTargetType.OTHER,
            targetIdSpel = "#result.data.programId"
    )
    public ApiResponse<ProgramResponse> createProgram(@RequestBody ProgramCreateRequest req) {
        return ApiResponse.success(programAdminService.createProgram(req));
    }

    @PatchMapping("/{programId}")
    @AdminAudit(
            action = "PROGRAM_UPDATE",
            targetType = AdminTargetType.OTHER,
            targetIdSpel = "#programId"
    )
    public ApiResponse<ProgramResponse> updateProgram(
            @PathVariable("programId") Long programId,
            @RequestBody ProgramUpdateRequest req
    ) {
        return ApiResponse.success(programAdminService.updateProgram(programId, req));
    }

    @DeleteMapping("/{programId}")
    @AdminAudit(
            action = "PROGRAM_DELETE",
            targetType = AdminTargetType.OTHER,
            targetIdSpel = "#programId"
    )
    public ApiResponse<Void> deleteProgram(@PathVariable("programId") Long programId) {
        programAdminService.deleteProgram(programId);
        return ApiResponse.success(null);
    }
}
