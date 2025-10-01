package com.bwxor.backend.repository;

import com.bwxor.backend.entity.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByPostIdOrderByDateTimeAsc(String postId);
    List<Comment> findByUserId(String userId);
    Optional<Comment> findFirstByUserIdOrderByDateTimeDesc(String userId);
    List<Comment> findFirst5ByUserIdOrderByDateTimeDesc(String userId);
}
