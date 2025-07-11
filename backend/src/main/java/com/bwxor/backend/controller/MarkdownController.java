package com.bwxor.backend.controller;

import com.bwxor.backend.entity.Markdown;
import com.bwxor.backend.service.MarkdownService;
import com.bwxor.backend.to.MarkdownSummary;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Tag(name="Pages")
@RequestMapping("/api/pages")
@CrossOrigin(origins="*")
public class MarkdownController {
    @Autowired
    private MarkdownService markdownService;

    @GetMapping("/{category}")
    public ResponseEntity<List<MarkdownSummary>> getPagesByCategory(@PathVariable String category) {
        List<MarkdownSummary> indexPage = markdownService.findByCategory(category);
        return ResponseEntity.ok(indexPage);
    }

    @GetMapping("/{category}/{slug}")
    public ResponseEntity<List<Markdown>> getPagesByCategoryAndSlug(@PathVariable String category, @PathVariable String slug) {
        List<Markdown> indexPage = markdownService.findByCategoryAndSlug(category, slug);
        return ResponseEntity.ok(indexPage);
    }
}
