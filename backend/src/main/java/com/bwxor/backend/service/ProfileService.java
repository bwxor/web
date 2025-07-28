package com.bwxor.backend.service;

import com.bwxor.backend.entity.Markdown;
import com.bwxor.backend.entity.Profile;
import com.bwxor.backend.exception.ServiceException;
import com.bwxor.backend.repository.MarkdownRepository;
import com.bwxor.backend.repository.ProfileRepository;
import com.bwxor.backend.to.MarkdownSummary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfileService {
    @Autowired
    private ProfileRepository profileRepository;

    public Profile findByEmail(String email) {
        return profileRepository.findByEmail(email).orElse(null);
    }

    public Profile update(Profile updatedProfileInfo) throws ServiceException {

        String id = profileRepository.findByEmail(updatedProfileInfo.getEmail()).orElseThrow(
                () -> new ServiceException(null)
        ).getId();

        Profile profileToBeUpdated = new Profile(
                updatedProfileInfo.getEmail(),
                updatedProfileInfo.isAdmin(),
                updatedProfileInfo.getBirthYear(),
                updatedProfileInfo.getBiography()
        );

        profileToBeUpdated.setId(id);

        profileRepository.save(profileToBeUpdated);

        return profileToBeUpdated;
    }
}
