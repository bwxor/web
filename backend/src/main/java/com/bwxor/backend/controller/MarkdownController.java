package com.bwxor.backend.controller;

import com.bwxor.backend.entity.Markdown;
import com.bwxor.backend.service.MarkdownService;
import com.bwxor.backend.dto.MarkdownSummaryDto;
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
    public ResponseEntity<List<MarkdownSummaryDto>> getPagesByCategory(@PathVariable String category) {
        List<MarkdownSummaryDto> pages = markdownService.findByCategory(category);
        return ResponseEntity.ok(pages);
    }

    @GetMapping("/{category}/{slug}")
    public ResponseEntity<List<Markdown>> getPagesByCategoryAndSlug(@PathVariable String category, @PathVariable String slug) {
        List<Markdown> pages = markdownService.findByCategoryAndSlug(category, slug);
        return ResponseEntity.ok(pages);
    }
}
