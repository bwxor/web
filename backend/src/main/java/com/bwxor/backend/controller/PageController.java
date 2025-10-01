package com.bwxor.backend.controller;

import com.bwxor.backend.dto.page.CreatePageRequestDto;
import com.bwxor.backend.dto.page.DeletePageRequestDto;
import com.bwxor.backend.dto.page.UpdatePageRequestDto;
import com.bwxor.backend.service.PageService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@Tag(name="Pages")
@RequestMapping("/api/pages")
@CrossOrigin(origins="*")
public class PageController {
    @Autowired
    private PageService pageService;

    @GetMapping("/find/{id}")
    public ResponseEntity<?> getPageById(@PathVariable String id) {
        var findPagesResponse = pageService.findById(id);

        if (findPagesResponse.ok()) {
            return ResponseEntity.ok(findPagesResponse.item());
        }

        return ResponseEntity.badRequest().body(Map.of("message", findPagesResponse.serviceError().message()));
    }

    @GetMapping("/{category}")
    public ResponseEntity<?> getPagesByCategory(@PathVariable String category) {
        var findPagesResponse = pageService.findByCategory(category);

        if (findPagesResponse.ok()) {
            return ResponseEntity.ok(findPagesResponse.item());
        }

        return ResponseEntity.badRequest().body(Map.of("message", findPagesResponse.serviceError().message()));
    }

    @GetMapping("/{category}/{slug}")
    public ResponseEntity<?> getPagesByCategoryAndSlug(@PathVariable String category, @PathVariable String slug) {
        var findPageResponse = pageService.findByCategoryAndSlug(category, slug);

        if (findPageResponse.ok()) {
            return ResponseEntity.ok(findPageResponse.item());
        }

        return ResponseEntity.badRequest().body(Map.of("message", findPageResponse.serviceError().message()));
    }

    @PostMapping("/create")
    public ResponseEntity<?> createPage(@RequestBody CreatePageRequestDto page) {
        var createPageResponse = pageService.createPage(page);

        if (createPageResponse.ok()) {
            return ResponseEntity.ok(createPageResponse.item());
        }

        return ResponseEntity.badRequest().body(Map.of("message", createPageResponse.serviceError().message()));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deletePage(@RequestBody DeletePageRequestDto page) {
        var deletePageResponse = pageService.deletePage(page);

        if (deletePageResponse.ok()) {
            return ResponseEntity.ok(deletePageResponse.item());
        }

        return ResponseEntity.badRequest().body(Map.of("message", deletePageResponse.serviceError().message()));
    }

    @PutMapping("/update")
    public ResponseEntity<?> updatePage(@RequestBody UpdatePageRequestDto page) {
        var updatePageResponse = pageService.updatePage(page);

        if (updatePageResponse.ok()) {
            return ResponseEntity.ok(updatePageResponse.item());
        }

        return ResponseEntity.badRequest().body(Map.of("message", updatePageResponse.serviceError().message()));
    }
}
