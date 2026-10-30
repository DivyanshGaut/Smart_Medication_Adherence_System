package com.elowen.controller;

import com.elowen.dto.MedicationRequest;
import com.elowen.entity.Medication;
import com.elowen.entity.User;
import com.elowen.service.AuthService;
import com.elowen.service.MedicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/medications")
@CrossOrigin(origins = "*")
public class MedicationController {

    private final AuthService authService;
    private final MedicationService medicationService;

    public MedicationController(AuthService authService, MedicationService medicationService) {
        this.authService = authService;
        this.medicationService = medicationService;
    }

    @GetMapping
    public ResponseEntity<List<Medication>> getMedications() {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(medicationService.getMedications(user));
    }

    @PostMapping
    public ResponseEntity<Medication> addMedication(@RequestBody MedicationRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(medicationService.addMedication(user, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Medication> updateMedication(@PathVariable Long id, @RequestBody MedicationRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(medicationService.updateMedication(user, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMedication(@PathVariable Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        medicationService.deleteMedication(user, id);
        return ResponseEntity.ok(Map.of("message", "Medication deleted successfully"));
    }
}
