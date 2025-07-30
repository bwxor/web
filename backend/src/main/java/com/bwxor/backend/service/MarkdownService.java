package com.bwxor.backend.service;

import com.bwxor.backend.dto.CreatePageDto;
import com.bwxor.backend.entity.Markdown;
import com.bwxor.backend.entity.Profile;
import com.bwxor.backend.repository.MarkdownRepository;
import com.bwxor.backend.dto.MarkdownSummaryDto;
import com.bwxor.backend.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MarkdownService {
    private static final int KB_512 = 524_288;

    @Autowired
    private MarkdownRepository markdownRepository;
    @Autowired
    private ProfileRepository profileRepository;

    private boolean isValidSlug(String str) {
        if (str.startsWith("-") || str.endsWith("-")) {
            return false;
        }

        boolean minusPreviously = false;

        for (int i = 0; i < str.length(); i++) {
            char ch = str.charAt(i);
            int code = (int) ch;

            if (!((code > 47 && code < 58) || // 0-9
                    (code > 64 && code < 91) || // A-Z
                    (code > 96 && code < 123) || // a-z
                    code == 45)) { // '-'
                return false;
            }

            if (code == 45) {
                if (minusPreviously) {
                    return true;
                }
                minusPreviously = true;
            } else {
                minusPreviously = false;
            }
        }

        return true;
    }


    public List<MarkdownSummaryDto> findByCategory(String category) {
        return markdownRepository.findByCategory(category).stream()
                .map(MarkdownSummaryDto::new)
                .collect(Collectors.toList());
    }

    public List<Markdown> findByCategoryAndSlug(String category, String slug) {
        return markdownRepository.findByCategoryAndSlug(category, slug);
    }

    public Markdown createPage(CreatePageDto pageInfo) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {
            if (authentication.getPrincipal() instanceof UserDetails userDetails) {
                String email = userDetails.getUsername();

                Optional<Profile> profile = profileRepository.findByEmail(email);

                if (profile.isEmpty() || !profile.get().isAdmin()) {
                    return null;
                }

                if (pageInfo.getTitle().isBlank()
                        || pageInfo.getSlug().isBlank()
                        || pageInfo.getCategory().isBlank()
                        || pageInfo.getContent().isBlank()
                || pageInfo.getDescription().isBlank()) {
                    return null;
                }

                if (!isValidSlug(pageInfo.getSlug())) {
                    return null;
                }

                if (!markdownRepository.findByCategoryAndSlug(pageInfo.getCategory(), pageInfo.getSlug()).isEmpty()) {
                    return null;
                }

                String title = pageInfo.getTitle().trim();
                String slug = pageInfo.getSlug().trim();
                String category = pageInfo.getCategory().trim();
                String content = pageInfo.getContent().trim();
                String description = pageInfo.getDescription().trim();

                if (title.length() > 64) {
                    title = title.substring(0, 64);
                }
                if (slug.length() > 32) {
                    slug = slug.substring(0, 32);
                }
                if (category.length() > 16) {
                    category = category.substring(0, 16);
                }
                if (content.length() > KB_512) {
                    content = content.substring(0, KB_512);
                }
                if (description.length() > 128) {
                    description = description.substring(0, 128);
                }

                var markdown = new Markdown(title, slug, category, content, description);
                return markdownRepository.save(markdown);
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
}
