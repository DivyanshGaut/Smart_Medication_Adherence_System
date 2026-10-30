package com.elowen.controller;

import com.elowen.dto.InsightDto;
import com.elowen.entity.User;
import com.elowen.service.AuthService;
import com.elowen.service.InsightService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/insights")
@CrossOrigin(origins = "*")
public class InsightController {

    private final AuthService authService;
    private final InsightService insightService;

    public InsightController(AuthService authService, InsightService insightService) {
        this.authService = authService;
        this.insightService = insightService;
    }

    @GetMapping
    public ResponseEntity<InsightDto> getInsights() {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(insightService.getInsights(user));
    }

    @PostMapping("/refresh")
    public ResponseEntity<InsightDto> refreshInsights() {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(insightService.refreshInsights(user));
    }
}
