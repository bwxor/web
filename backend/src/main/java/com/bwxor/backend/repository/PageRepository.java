package com.bwxor.backend.repository;

import com.bwxor.backend.entity.Page;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PageRepository extends MongoRepository<Page, String> {
    List<Page> findByCategory(String category);
    Optional<Page> findByCategoryAndSlug(String category, String slug);
}
