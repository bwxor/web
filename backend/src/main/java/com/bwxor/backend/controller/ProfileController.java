package com.bwxor.backend.controller;

import com.bwxor.backend.dto.auth.UpdateProfileRequestDto;
import com.bwxor.backend.service.ProfileService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@Tag(name="Profile")
@RequestMapping("/api/profile/")
public class ProfileController {
    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("find/")
    public ResponseEntity<?> findAll() {
        var findProfileResponse = profileService.findAll();

        return ResponseEntity.ok().body(findProfileResponse);
    }

    @GetMapping("find/{key}")
    public ResponseEntity<?> findByKey(@PathVariable String key) {
        var findProfileResponse = profileService.findByKey(key);

        if (findProfileResponse.ok()) {
            return ResponseEntity.ok(findProfileResponse.item());
        }

        return ResponseEntity.badRequest().body(Map.of("message", findProfileResponse.serviceError().message()));
    }

    @PutMapping("update")
    public ResponseEntity<?> update(@RequestBody UpdateProfileRequestDto updateProfileRequestDto) {
        var updateProfileResponse = profileService.update(updateProfileRequestDto);

        if (updateProfileResponse.ok()) {
            return ResponseEntity.ok(updateProfileResponse.item());
        }

        return ResponseEntity.badRequest().body(Map.of("message", updateProfileResponse.serviceError().message()));
    }
}