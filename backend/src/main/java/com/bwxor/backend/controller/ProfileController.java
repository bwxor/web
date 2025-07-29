package com.bwxor.backend.controller;

import com.bwxor.backend.dto.ProfileDto;
import com.bwxor.backend.entity.Profile;
import com.bwxor.backend.exception.ServiceException;
import com.bwxor.backend.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/profile/")
public class ProfileController {
    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("find/{email}")
    public ResponseEntity<Profile> findByEmail(@PathVariable String email) {
        Profile foundProfile = profileService.findByEmail(email);
        return ResponseEntity.ok(foundProfile);
    }

    @PutMapping("update")
    public ResponseEntity<Profile> update(@RequestBody ProfileDto profileDto) {
        Profile updatedProfile;

        try {
            updatedProfile = profileService.update(profileDto);
        } catch (ServiceException e) {
            return ResponseEntity.badRequest().build();
        }

        if (updatedProfile != null) {
            return ResponseEntity.ok(updatedProfile);
        }
        else {
            return ResponseEntity.badRequest().build();
        }
    }
}