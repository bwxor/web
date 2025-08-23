package com.bwxor.backend.controller;

import com.bwxor.backend.dto.auth.LoginRequestDto;
import com.bwxor.backend.dto.auth.RegisterRequestDto;
import com.bwxor.backend.service.AuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth/")
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDto registerUserDto) {
        var registerResponse = authenticationService.register(registerUserDto);

        if (registerResponse.ok()) {
            return ResponseEntity.ok(registerResponse.item());
        }

        return ResponseEntity.badRequest().body(Map.of("message", registerResponse.serviceError().message()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody LoginRequestDto loginUserDto) {
        var loginResponse = authenticationService.login(loginUserDto);

        if (!loginResponse.ok()) {
            return ResponseEntity.badRequest().body(Map.of("message", loginResponse.serviceError().message()));
        }

        return ResponseEntity.ok(loginResponse.item());
    }
}