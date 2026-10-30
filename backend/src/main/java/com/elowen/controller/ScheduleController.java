package com.elowen.controller;

import com.elowen.dto.NaturalLanguageScheduleRequest;
import com.elowen.dto.ScheduleRequest;
import com.elowen.entity.Schedule;
import com.elowen.entity.User;
import com.elowen.service.AuthService;
import com.elowen.service.ScheduleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/schedules")
@CrossOrigin(origins = "*")
public class ScheduleController {

    private final AuthService authService;
    private final ScheduleService scheduleService;

    public ScheduleController(AuthService authService, ScheduleService scheduleService) {
        this.authService = authService;
        this.scheduleService = scheduleService;
    }

    @GetMapping
    public ResponseEntity<List<Schedule>> getSchedules() {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(scheduleService.getSchedules(user));
    }

    @PostMapping
    public ResponseEntity<Schedule> addSchedule(@RequestBody ScheduleRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(scheduleService.addSchedule(user, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSchedule(@PathVariable Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        scheduleService.deleteSchedule(user, id);
        return ResponseEntity.ok(Map.of("message", "Schedule deleted successfully"));
    }

    @PostMapping("/natural-language")
    public ResponseEntity<Schedule> createNaturalLanguageSchedule(@RequestBody NaturalLanguageScheduleRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        Schedule schedule = scheduleService.createNaturalLanguageSchedule(user, request.getPrompt());
        return ResponseEntity.ok(schedule);
    }
}
