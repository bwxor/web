package com.bwxor.backend.service;

import com.bwxor.backend.dto.auth.UpdateProfileRequestDto;
import com.bwxor.backend.repository.UserRepository;
import com.bwxor.backend.reqres.ServiceResponse;
import com.bwxor.backend.entity.Profile;
import com.bwxor.backend.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class ProfileService {
    @Autowired
    private ProfileRepository profileRepository;
    @Autowired
    private UserRepository userRepository;

    public ServiceResponse<Profile> findByKey(String key) {
        var foundProfile = profileRepository.findByEmail(key);

        if (foundProfile.isPresent()) {
            return ServiceResponse.ofItem(foundProfile.get());
        }

        var foundUser = userRepository.findById(key);

        if (foundUser.isPresent()) {
            foundProfile = profileRepository.findByEmail(foundUser.get().getEmail());

            if (foundProfile.isPresent()) {
                return ServiceResponse.ofItem(foundProfile.get());
            }
        }

        return ServiceResponse.ofError(Profile.class, "Could not find profile with specified email or id.");
    }

    public ServiceResponse<Profile> update(UpdateProfileRequestDto updateProfileInfo) {
        if (updateProfileInfo.biography().isEmpty()) {
            return ServiceResponse.ofError(Profile.class, "Biography cannot be empty.");
        }

        if (updateProfileInfo.biography().length() >= 64) {
            return ServiceResponse.ofError(Profile.class, "Biography should not be longer than 64 characters.");
        }

        if (updateProfileInfo.birthYear() < 1900 || updateProfileInfo.birthYear() > LocalDate.now().getYear()) {
            return ServiceResponse.ofError(Profile.class, "Invalid birth year.");
        }

        var foundProfile = profileRepository.findByEmail(updateProfileInfo.email());

        if (foundProfile.isEmpty()) {
            return ServiceResponse.ofError(Profile.class, "Could not find profile with specified email.");
        }

        Profile newProfileData = new Profile(
                updateProfileInfo.email(),
                updateProfileInfo.displayName(),
                updateProfileInfo.isAdmin(),
                updateProfileInfo.birthYear(),
                updateProfileInfo.biography()
        );

        newProfileData.setId(foundProfile.get().getId());
        profileRepository.save(newProfileData);

        return ServiceResponse.ofItem(newProfileData);
    }
}
