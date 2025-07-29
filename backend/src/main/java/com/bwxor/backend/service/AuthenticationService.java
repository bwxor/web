package com.bwxor.backend.service;

import com.bwxor.backend.dto.LoginDto;
import com.bwxor.backend.dto.RegisterDto;
import com.bwxor.backend.entity.Profile;
import com.bwxor.backend.repository.ProfileRepository;
import com.bwxor.backend.repository.UserRepository;
import com.bwxor.backend.util.PasswordValidator;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import com.bwxor.backend.entity.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.security.auth.login.LoginException;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final PasswordValidator passwordValidator;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    public AuthenticationService(
            UserRepository userRepository,
            ProfileRepository profileRepository,
            AuthenticationManager authenticationManager,
            PasswordValidator passwordValidator,
            PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.passwordValidator = passwordValidator;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(RegisterDto input) throws LoginException {
        if (input.getEmail() == null || input.getEmail().trim().isBlank()) {
            throw new LoginException("Email address cannot be empty.");
        }

        if (input.getDisplayName() == null || input.getDisplayName().trim().isBlank()) {
            throw new LoginException("Display name cannot be empty.");
        }

        if (input.getPassword() == null || input.getPassword().trim().isBlank()) {
            throw new LoginException("Password cannot be empty.");
        }

        if (!input.getPassword().equals(input.getConfirmPassword())) {
            throw new LoginException("Confirmed password is incorrect.");
        }

        if (userRepository.findByEmail(input.getEmail()).isPresent()) {
            throw new LoginException("A user with the same email already exists.");
        }

        if (!passwordValidator.validatePassword(input.getPassword())) {
            throw new LoginException("Password doesn't meet the given criteria.");
        }

        User user = new User(input.getEmail(), input.getDisplayName(), passwordEncoder.encode(input.getPassword()));
        User savedUser = userRepository.save(user);

        Profile profile = new Profile(user.getEmail(), false, 1900, "Unspecified");
        profileRepository.save(profile);
        return savedUser;
    }

    public User login(LoginDto input) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.getEmail(),
                        input.getPassword()
                )
        );

        User user = userRepository.findByEmail(input.getEmail())
                .orElseThrow();

        userRepository.save(user);
        return user;
    }
}