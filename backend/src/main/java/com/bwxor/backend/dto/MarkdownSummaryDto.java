package com.bwxor.backend.dto;

import com.bwxor.backend.entity.Markdown;

public class MarkdownSummaryDto {
    private String title;
    private String slug;
    private String description;

    public MarkdownSummaryDto(Markdown markdown) {
        this.title = markdown.getTitle();
        this.slug = markdown.getSlug();
        this.description = markdown.getDescription();
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
