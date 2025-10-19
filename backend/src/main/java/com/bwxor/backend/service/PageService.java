package com.bwxor.backend.service;

import com.bwxor.backend.dto.page.CreatePageRequestDto;
import com.bwxor.backend.dto.page.DeletePageRequestDto;
import com.bwxor.backend.dto.page.UpdatePageRequestDto;
import com.bwxor.backend.repository.CommentRepository;
import com.bwxor.backend.reqres.ServiceResponse;
import com.bwxor.backend.entity.Page;
import com.bwxor.backend.entity.Profile;
import com.bwxor.backend.repository.PageRepository;
import com.bwxor.backend.repository.ProfileRepository;
import com.bwxor.backend.validator.impl.SlugValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PageService {
    private static final int KB_512 = 524_288;

    @Autowired
    private PageRepository pageRepository;
    @Autowired
    private ProfileRepository profileRepository;
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private SlugValidator slugValidator;


    public ServiceResponse<Page> findById(String id) {
        var page = pageRepository.findById(id);

        if (page.isPresent()) {
            return ServiceResponse.ofItem(page.get());
        }

        return ServiceResponse.ofError(Page.class, "Unable to find page with specified id.");
    }

    public ServiceResponse<List<Page>> findByCategory(String category) {
        var pagesWithGivenCategory = pageRepository.findByCategory(category);
        return ServiceResponse.ofItem(pagesWithGivenCategory);
    }

    public ServiceResponse<Page> findByCategoryAndSlug(String category, String slug) {
        var pageWithCategoryAndSlug = pageRepository.findByCategoryAndSlug(category, slug);

        if (pageWithCategoryAndSlug.isEmpty()) {
            return ServiceResponse.ofError(Page.class, "Unable to find page.");
        }

        return ServiceResponse.ofItem(pageWithCategoryAndSlug.get());
    }

    public ServiceResponse<Page> createPage(CreatePageRequestDto pageInfo) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {
            if (authentication.getPrincipal() instanceof UserDetails userDetails) {
                String email = userDetails.getUsername();

                Optional<Profile> profile = profileRepository.findByEmail(email);

                if (profile.isEmpty() || !profile.get().isAdmin()) {
                    return ServiceResponse.ofError(Page.class, "Cannot create page with current identity.");
                }

                if (pageInfo.title().isBlank()
                        || pageInfo.slug().isBlank()
                        || pageInfo.category().isBlank()
                        || pageInfo.content().isBlank()
                        || pageInfo.description().isBlank()) {
                    return ServiceResponse.ofError(Page.class, "Page contents cannot be blank.");
                }

                if (!slugValidator.isValid(pageInfo.slug())) {
                    return ServiceResponse.ofError(Page.class, "Specified slug is invalid.");
                }

                if (pageRepository.findByCategoryAndSlug(pageInfo.category(), pageInfo.slug()).isPresent()) {
                    return ServiceResponse.ofError(Page.class, "Page with specified slug already exists for the current category.");
                }

                String title = pageInfo.title().trim();
                String slug = pageInfo.slug().trim();
                String category = pageInfo.category().trim();
                String content = pageInfo.content().trim();
                String description = pageInfo.description().trim();

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

                var newPage = new Page(title, slug, category, content, description);

                var createdPage = pageRepository.save(newPage);
                return ServiceResponse.ofItem(createdPage);
            } else {
                return ServiceResponse.ofError(Page.class, "Could not fetch authentication details.");
            }
        } else {
            return ServiceResponse.ofError(Page.class, "You are not authenticated.");
        }
    }

    public ServiceResponse<Page> deletePage(DeletePageRequestDto deletePageRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {
            if (authentication.getPrincipal() instanceof UserDetails userDetails) {
                String email = userDetails.getUsername();

                Optional<Profile> profile = profileRepository.findByEmail(email);

                if (profile.isEmpty() || !profile.get().isAdmin()) {
                    return ServiceResponse.ofError(Page.class, "Cannot delete page with current identity.");
                }

                var foundPage = pageRepository.findByCategoryAndSlug(deletePageRequestDto.category(), deletePageRequestDto.slug());
                if (foundPage.isEmpty()) {
                    return ServiceResponse.ofError(Page.class, "Could not find page with specified slug for current category.");
                }

                commentRepository.removeByPostId(foundPage.get().getId());
                pageRepository.deleteById(foundPage.get().getId());
                return ServiceResponse.ofItem(foundPage.get());
            } else {
                return ServiceResponse.ofError(Page.class, "Could not fetch authentication info.");
            }
        } else {
            return ServiceResponse.ofError(Page.class, "You are not authenticated.");
        }
    }

    public ServiceResponse<Page> updatePage(UpdatePageRequestDto updatePageRequestDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()) {
            if (authentication.getPrincipal() instanceof UserDetails userDetails) {
                String email = userDetails.getUsername();

                Optional<Profile> profile = profileRepository.findByEmail(email);

                if (profile.isEmpty() || !profile.get().isAdmin()) {
                    return ServiceResponse.ofError(Page.class, "Cannot delete page with current identity.");
                }

                var oldPage = pageRepository.findByCategoryAndSlug(updatePageRequestDto.category(), updatePageRequestDto.oldSlug());
                String id = oldPage.get().getId();

                if (!updatePageRequestDto.oldSlug().equals(updatePageRequestDto.newSlug())) {
                    var foundPage = pageRepository.findByCategoryAndSlug(updatePageRequestDto.category(), updatePageRequestDto.newSlug());
                    if (foundPage.isPresent()) {
                        return ServiceResponse.ofError(Page.class, "Page with specified slug already exists for the current category.");
                    }
                }

                var newPage = new Page(id, updatePageRequestDto.title(), updatePageRequestDto.newSlug(), oldPage.get().getCategory(), updatePageRequestDto.content(), updatePageRequestDto.description());
                pageRepository.save(newPage);

                return ServiceResponse.ofItem(newPage);
            } else {
                return ServiceResponse.ofError(Page.class, "Could not fetch authentication info.");
            }
        } else {
            return ServiceResponse.ofError(Page.class, "You are not authenticated.");
        }
    }
}
