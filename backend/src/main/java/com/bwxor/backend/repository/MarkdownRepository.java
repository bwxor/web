package com.bwxor.backend.repository;

import com.bwxor.backend.entity.Markdown;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarkdownRepository extends MongoRepository<Markdown, String> {
    List<Markdown> findByCategory(String category);
    List<Markdown> findByCategoryAndSlug(String category, String slug);
}
