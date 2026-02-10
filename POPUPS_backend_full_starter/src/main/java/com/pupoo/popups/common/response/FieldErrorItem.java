package com.pupoo.popups.common.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FieldErrorItem {
    private final String field;
    private final String message;
}
