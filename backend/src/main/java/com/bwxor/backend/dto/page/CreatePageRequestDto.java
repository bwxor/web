package com.bwxor.backend.dto.page;

public record CreatePageRequestDto(String title, String slug, String category, String content, String description) {
}
