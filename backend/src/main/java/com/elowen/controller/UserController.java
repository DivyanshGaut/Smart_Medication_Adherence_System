package com.elowen.controller;

import com.elowen.dto.NotificationSettingsRequest;
import com.elowen.dto.ProfileUpdateRequest;
import com.elowen.dto.UserDto;
import com.elowen.entity.User;
import com.elowen.repository.UserRepository;
import com.elowen.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public UserController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(new UserDto(user));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody ProfileUpdateRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            user.setName(request.getName().trim());
        }
        if (request.getTimezone() != null && !request.getTimezone().trim().isEmpty()) {
            user.setTimezone(request.getTimezone().trim());
        }
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty() && !request.getEmail().equalsIgnoreCase(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email already in use"));
            }
            user.setEmail(request.getEmail().trim());
        }

        user = userRepository.save(user);
        return ResponseEntity.ok(new UserDto(user));
    }

    @PutMapping("/notifications")
    public ResponseEntity<?> updateNotifications(@RequestBody NotificationSettingsRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        if (request.getPushNotifications() != null) {
            user.setPushNotifications(request.getPushNotifications());
        }
        if (request.getEmailReports() != null) {
            user.setEmailReports(request.getEmailReports());
        }
        if (request.getCaregiverAlerts() != null) {
            user.setCaregiverAlerts(request.getCaregiverAlerts());
        }

        user = userRepository.save(user);
        return ResponseEntity.ok(new UserDto(user));
    }
}
