package com.bwxor.backend.controller;

import com.bwxor.backend.dto.follow.CreateFollowDto;
import com.bwxor.backend.dto.follow.DeleteFollowDto;
import com.bwxor.backend.service.FollowService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@Tag(name="Follows")
@RequestMapping("/api/follows")
@CrossOrigin(origins="*")
public class FollowController {
    @Autowired
    private FollowService followService;

    @PostMapping("/create")
    public ResponseEntity<?> createFollow(@RequestBody CreateFollowDto createFollowDto) {
        var createFollowResponse = followService.createFollow(createFollowDto);

        if (createFollowResponse.ok()) {
            return ResponseEntity.ok(createFollowResponse.item());
        }

        return ResponseEntity.badRequest().body(Map.of("message", createFollowResponse.serviceError().message()));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteFollow(@RequestBody DeleteFollowDto deleteFollowDto) {
        var deleteFollowResponse = followService.deleteFollow(deleteFollowDto);

        if (deleteFollowResponse.ok()) {
            return ResponseEntity.ok(deleteFollowResponse.item());
        }

        return ResponseEntity.badRequest().body(Map.of("message", deleteFollowResponse.serviceError().message()));
    }

    @GetMapping("/count/{toKey}")
    public ResponseEntity<?> getCount(@PathVariable String toKey) {
        var followCountResponse = followService.findCountByKey(toKey);

        if (followCountResponse.ok()) {
            return ResponseEntity.ok(followCountResponse.item());
        }

        return ResponseEntity.badRequest().body(Map.of("message", followCountResponse.serviceError().message()));
    }

    @GetMapping("/status/{toKey}")
    public ResponseEntity<?> getFollowStatus(@PathVariable String toKey) {
        var followCountResponse = followService.findFollowStatus(toKey);

        if (followCountResponse.ok()) {
            return ResponseEntity.ok(followCountResponse.item());
        }

        return ResponseEntity.badRequest().body(Map.of("message", followCountResponse.serviceError().message()));
    }

    @GetMapping("/list/{toKey}")
    public ResponseEntity<?> getFollowers(@PathVariable String toKey) {
        var followCountResponse = followService.findFollowers(toKey);

        if (followCountResponse.ok()) {
            return ResponseEntity.ok(followCountResponse.item());
        }

        return ResponseEntity.badRequest().body(Map.of("message", followCountResponse.serviceError().message()));
    }
}
