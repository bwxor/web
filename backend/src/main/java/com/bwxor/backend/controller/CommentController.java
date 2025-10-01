package com.bwxor.backend.controller;

import com.bwxor.backend.dto.comment.CreateCommentRequestDto;
import com.bwxor.backend.dto.comment.DeleteCommentRequestDto;
import com.bwxor.backend.service.CommentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@Tag(name="Comments")
@RequestMapping("/api/comments")
@CrossOrigin(origins="*")
public class CommentController {
    @Autowired
    private CommentService commentService;

    @GetMapping("/post/{postId}")
    public ResponseEntity<?> getCommentsByPostId(@PathVariable String postId) {
        var findPagesResponse = commentService.findByPostId(postId);

        if (findPagesResponse.ok()) {
            return ResponseEntity.ok(findPagesResponse.item());
        }

        return ResponseEntity.badRequest().body(Map.of("message", findPagesResponse.serviceError().message()));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getNewest5ByUserId(@PathVariable String userId) {
        var findPageResponse = commentService.findNewest5ByKey(userId);

        if (findPageResponse.ok()) {
            return ResponseEntity.ok(findPageResponse.item());
        }

        return ResponseEntity.badRequest().body(Map.of("message", findPageResponse.serviceError().message()));
    }

    @PostMapping("/create")
    public ResponseEntity<?> createComment(@RequestBody CreateCommentRequestDto comment) {
        var createCommentResponse = commentService.createComment(comment);

        if (createCommentResponse.ok()) {
            return ResponseEntity.ok(createCommentResponse.item());
        }

        return ResponseEntity.badRequest().body(Map.of("message", createCommentResponse.serviceError().message()));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteComment(@RequestBody DeleteCommentRequestDto comment) {
        var deletePageResponse = commentService.deleteComment(comment);

        if (deletePageResponse.ok()) {
            return ResponseEntity.ok(deletePageResponse.item());
        }

        return ResponseEntity.badRequest().body(Map.of("message", deletePageResponse.serviceError().message()));
    }
}
