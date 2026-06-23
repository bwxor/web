package com.bwxor.backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("Plugin")
public class Plugin {
    @Id
    private String id;
    private String name;
    private String description;
    private String author;
    private String downloadUrl;

    public Plugin() {}

    public Plugin(String name, String description, String author, String downloadUrl) {
        this.name = name;
        this.description = description;
        this.author = author;
        this.downloadUrl = downloadUrl;
    }

    public Plugin(String id, String name, String description, String author, String downloadUrl) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.author = author;
        this.downloadUrl = downloadUrl;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getDownloadUrl() {
        return downloadUrl;
    }

    public void setDownloadUrl(String downloadUrl) {
        this.downloadUrl = downloadUrl;
    }
}


