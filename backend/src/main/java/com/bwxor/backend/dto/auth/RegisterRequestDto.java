package com.bwxor.backend.dto.auth;

public record RegisterRequestDto(String email, String displayName, String password, String confirmPassword) {
}
