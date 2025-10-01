package com.bwxor.backend.dto.auth;

public record UpdateProfileRequestDto(String email, String displayName, boolean isAdmin, int birthYear, String biography) {
}
