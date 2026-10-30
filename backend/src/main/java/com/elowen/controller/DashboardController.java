package com.elowen.controller;

import com.elowen.dto.DashboardOverviewDto;
import com.elowen.entity.User;
import com.elowen.service.AuthService;
import com.elowen.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final AuthService authService;
    private final DashboardService dashboardService;

    public DashboardController(AuthService authService, DashboardService dashboardService) {
        this.authService = authService;
        this.dashboardService = dashboardService;
    }

    @GetMapping("/overview")
    public ResponseEntity<DashboardOverviewDto> getOverview() {
        User user = authService.getCurrentAuthenticatedUser();
        DashboardOverviewDto overview = dashboardService.getOverview(user);
        return ResponseEntity.ok(overview);
    }
}
