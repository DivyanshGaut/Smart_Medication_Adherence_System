package com.elowen.service;

import com.elowen.dto.AuthRequest;
import com.elowen.dto.AuthResponse;
import com.elowen.dto.UserDto;
import com.elowen.entity.User;
import com.elowen.repository.UserRepository;
import com.elowen.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(AuthRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered: " + request.getEmail());
        }

        String name = request.getName();
        if (name == null || name.trim().isEmpty()) {
            name = request.getEmail().split("@")[0];
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(name);
        user = userRepository.save(user);

        String token = tokenProvider.generateToken(user.getEmail(), user.getId());
        return new AuthResponse(token, new UserDto(user), "Account created successfully");
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = tokenProvider.generateToken(user.getEmail(), user.getId());
        return new AuthResponse(token, new UserDto(user), "Signed in successfully");
    }

    public AuthResponse loginWithGoogle() {
        // Find demo user or create Google authenticated user
        User user = userRepository.findByEmail("alex@example.com")
                .orElseGet(() -> {
                    User newUser = new User("alex@example.com", passwordEncoder.encode("password123"), "Alex Morgan");
                    return userRepository.save(newUser);
                });

        String token = tokenProvider.generateToken(user.getEmail(), user.getId());
        return new AuthResponse(token, new UserDto(user), "Signed in with Google");
    }

    public User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Not authenticated");
        }

        Object principal = authentication.getPrincipal();
        String email;
        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else {
            email = principal.toString();
        }

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }
}
