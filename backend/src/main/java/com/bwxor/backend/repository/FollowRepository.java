package com.bwxor.backend.repository;

import com.bwxor.backend.entity.Follow;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FollowRepository extends MongoRepository<Follow, String> {
    Optional<Follow> findFirstByFromIdAndToId(String fromId, String toId);
    long countByToId(String toId);
}
