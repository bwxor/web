package com.bwxor.backend.dto.auth;

public record UpdateProfileRequestDto(String email, boolean isAdmin, int birthYear, String biography) {
}
