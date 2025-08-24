package com.bwxor.backend.dto.page;

public record UpdatePageRequestDto(String title, String oldSlug, String newSlug, String category, String content, String description) {
}
