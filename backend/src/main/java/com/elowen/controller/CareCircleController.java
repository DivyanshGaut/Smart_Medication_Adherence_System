package com.elowen.controller;

import com.elowen.dto.CareCircleRequest;
import com.elowen.entity.CareCircleMember;
import com.elowen.entity.User;
import com.elowen.service.AuthService;
import com.elowen.service.CareCircleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/care-circle")
@CrossOrigin(origins = "*")
public class CareCircleController {

    private final AuthService authService;
    private final CareCircleService careCircleService;

    public CareCircleController(AuthService authService, CareCircleService careCircleService) {
        this.authService = authService;
        this.careCircleService = careCircleService;
    }

    @GetMapping
    public ResponseEntity<List<CareCircleMember>> getMembers() {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(careCircleService.getMembers(user));
    }

    @PostMapping
    public ResponseEntity<CareCircleMember> addMember(@RequestBody CareCircleRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(careCircleService.addMember(user, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMember(@PathVariable Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        careCircleService.deleteMember(user, id);
        return ResponseEntity.ok(Map.of("message", "Member deleted successfully"));
    }
}
