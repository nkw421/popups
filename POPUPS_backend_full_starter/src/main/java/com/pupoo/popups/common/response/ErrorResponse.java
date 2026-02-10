package com.pupoo.popups.common.response;

import java.util.List;

import com.pupoo.popups.common.error.ErrorCode;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ErrorResponse {

    private final boolean success;
    private final String code;
    private final String message;
    private final List<FieldErrorItem> fieldErrors;

    public static ErrorResponse from(ErrorCode errorCode) {
        return new ErrorResponse(false, errorCode.getCode(), errorCode.getMessage(), null);
    }

    public static ErrorResponse from(ErrorCode errorCode, List<FieldErrorItem> fieldErrors) {
        return new ErrorResponse(false, errorCode.getCode(), errorCode.getMessage(), fieldErrors);
    }
}
