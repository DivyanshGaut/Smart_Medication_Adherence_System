package com.elowen.controller;

import com.elowen.dto.DoseActionRequest;
import com.elowen.entity.DoseLog;
import com.elowen.entity.User;
import com.elowen.service.AuthService;
import com.elowen.service.DoseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doses")
@CrossOrigin(origins = "*")
public class DoseController {

    private final AuthService authService;
    private final DoseService doseService;

    public DoseController(AuthService authService, DoseService doseService) {
        this.authService = authService;
        this.doseService = doseService;
    }

    @PostMapping("/action")
    public ResponseEntity<DoseLog> recordDoseAction(@RequestBody DoseActionRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        DoseLog log = doseService.recordDoseAction(user, request);
        return ResponseEntity.ok(log);
    }

    @GetMapping("/today")
    public ResponseEntity<List<DoseLog>> getTodayDoses() {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(doseService.getTodayDoses(user));
    }

    @GetMapping("/history")
    public ResponseEntity<List<DoseLog>> getHistory() {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(doseService.getHistory(user));
    }
}
