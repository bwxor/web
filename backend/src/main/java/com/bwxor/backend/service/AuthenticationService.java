package com.bwxor.backend.service;

import com.bwxor.backend.dto.auth.LoginRequestDto;
import com.bwxor.backend.dto.auth.RegisterRequestDto;
import com.bwxor.backend.reqres.ServiceResponse;
import com.bwxor.backend.entity.Profile;
import com.bwxor.backend.repository.ProfileRepository;
import com.bwxor.backend.repository.UserRepository;
import com.bwxor.backend.dto.auth.LoginResponseDto;
import com.bwxor.backend.util.PasswordValidator;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import com.bwxor.backend.entity.User;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthenticationService {
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final PasswordValidator passwordValidator;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    public AuthenticationService(
            JwtService jwtService,
            UserRepository userRepository,
            ProfileRepository profileRepository,
            AuthenticationManager authenticationManager,
            PasswordValidator passwordValidator,
            PasswordEncoder passwordEncoder
    ) {
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.passwordValidator = passwordValidator;
        this.passwordEncoder = passwordEncoder;
    }

    public ServiceResponse<User> register(RegisterRequestDto input) {
        if (input.email() == null || input.email().trim().isBlank()) {
            return ServiceResponse.ofError(User.class,"Email address cannot be empty.");
        }

        if (input.displayName() == null || input.displayName().trim().isBlank()) {
            return ServiceResponse.ofError(User.class, "Display name cannot be empty.");
        }

        if (input.password() == null || input.password().trim().isBlank()) {
            return ServiceResponse.ofError(User.class, "Password cannot be empty.");
        }

        if (!input.password().equals(input.confirmPassword())) {
            return ServiceResponse.ofError(User.class, "Confirmed password is incorrect.");
        }

        if (userRepository.findByEmail(input.email()).isPresent()) {
            return ServiceResponse.ofError(User.class, "A user with the same email already exists.");
        }

        if (!passwordValidator.validatePassword(input.password())) {
            return ServiceResponse.ofError(User.class, "Password doesn't meet the given criteria.");
        }

        User user = new User(input.email(), input.displayName(), passwordEncoder.encode(input.password()));
        User savedUser = userRepository.save(user);

        Profile profile = new Profile(user.getEmail(), false, 1900, "Unspecified");
        profileRepository.save(profile);
        return ServiceResponse.ofItem(savedUser);
    }

    public ServiceResponse<LoginResponseDto> login(LoginRequestDto input) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            input.email(),
                            input.password()
                    )
            );
        } catch(AuthenticationException ex) {
            return ServiceResponse.ofError(LoginResponseDto.class, "Email or password are invalid.");
        }

        var user = userRepository.findByEmail(input.email());
        if (user.isEmpty()) {
            return ServiceResponse.ofError(LoginResponseDto.class, "Could not find user with specified email.");
        }

        userRepository.save(user.get());

        Map<String, Object> extraClaims = Map.of(
                "userId", user.get().getId()
        );

        String jwtToken = jwtService.generateToken(extraClaims, user.get());

        LoginResponseDto loginResponse = new LoginResponseDto();
        loginResponse.setToken(jwtToken);
        loginResponse.setExpiresIn(jwtService.getExpirationTime());
        loginResponse.setUser(user.get());

        return ServiceResponse.ofItem(loginResponse);
    }
}