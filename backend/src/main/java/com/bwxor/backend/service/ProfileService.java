package com.bwxor.backend.service;

import com.bwxor.backend.dto.auth.UpdateProfileRequestDto;
import com.bwxor.backend.reqres.ServiceResponse;
import com.bwxor.backend.entity.Profile;
import com.bwxor.backend.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {
    @Autowired
    private ProfileRepository profileRepository;

    public ServiceResponse<Profile> findByEmail(String email) {
        var foundProfile = profileRepository.findByEmail(email);

        if (foundProfile.isPresent()) {
            return ServiceResponse.ofItem(foundProfile.get());
        }

        return ServiceResponse.ofError(Profile.class, "Could not find profile with specified email.");
    }

    public ServiceResponse<Profile> update(UpdateProfileRequestDto updateProfileInfo) {
        var foundProfile = profileRepository.findByEmail(updateProfileInfo.email());

        if (foundProfile.isEmpty()) {
            return ServiceResponse.ofError(Profile.class, "Could not find profile with specified email.");
        }

        Profile newProfileData = new Profile(
                updateProfileInfo.email(),
                updateProfileInfo.isAdmin(),
                updateProfileInfo.birthYear(),
                updateProfileInfo.biography()
        );

        newProfileData.setId(foundProfile.get().getId());
        profileRepository.save(newProfileData);

        return ServiceResponse.ofItem(newProfileData);
    }
}
