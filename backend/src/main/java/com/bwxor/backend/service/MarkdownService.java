package com.bwxor.backend.service;

import com.bwxor.backend.entity.Markdown;
import com.bwxor.backend.repository.MarkdownRepository;
import com.bwxor.backend.to.MarkdownSummary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MarkdownService {
    @Autowired
    private MarkdownRepository markdownRepository;

    public List<MarkdownSummary> findByCategory(String category) {
        return markdownRepository.findByCategory(category).stream()
                .map(MarkdownSummary::new)
                .collect(Collectors.toList());
    }

    public List<Markdown> findByCategoryAndSlug(String category, String slug) {
        return markdownRepository.findByCategoryAndSlug(category, slug);
    }

    public void createMarkdown() {

    }
}
