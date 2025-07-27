package com.bwxor.backend.controller;

import com.bwxor.backend.dto.LoginDto;
import com.bwxor.backend.dto.RegisterDto;
import com.bwxor.backend.entity.User;
import com.bwxor.backend.response.LoginResponse;
import com.bwxor.backend.service.AuthenticationService;
import com.bwxor.backend.service.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.security.auth.login.LoginException;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth/")
public class AuthenticationController {
    private final JwtService jwtService;

    private final AuthenticationService authenticationService;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterDto registerUserDto) {
        User registeredUser = null;
        try {
            registeredUser = authenticationService.register(registerUserDto);
        } catch (LoginException e) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginDto loginUserDto) {
        User authenticatedUser = authenticationService.login(loginUserDto);

        Map<String, Object> extraClaims = Map.of(
                "userId", authenticatedUser.getId()
        );

        String jwtToken = jwtService.generateToken(extraClaims, authenticatedUser);

        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setToken(jwtToken);
        loginResponse.setExpiresIn(jwtService.getExpirationTime());
        loginResponse.setUser(authenticatedUser);


        return ResponseEntity.ok(loginResponse);
    }
}