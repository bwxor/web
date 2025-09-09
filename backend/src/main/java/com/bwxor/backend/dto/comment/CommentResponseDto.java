package com.bwxor.backend.dto.comment;

import java.time.LocalDateTime;

public record CommentResponseDto(String commentId, String userId, String userDisplayName, String postId, String content, LocalDateTime dateTime) {
}
