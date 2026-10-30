package com.elowen.service;

import com.elowen.dto.ScheduleRequest;
import com.elowen.entity.Medication;
import com.elowen.entity.Schedule;
import com.elowen.entity.User;
import com.elowen.repository.MedicationRepository;
import com.elowen.repository.ScheduleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final MedicationRepository medicationRepository;

    public ScheduleService(ScheduleRepository scheduleRepository, MedicationRepository medicationRepository) {
        this.scheduleRepository = scheduleRepository;
        this.medicationRepository = medicationRepository;
    }

    public List<Schedule> getSchedules(User user) {
        return scheduleRepository.findByUserId(user.getId());
    }

    public Schedule addSchedule(User user, ScheduleRequest req) {
        Schedule schedule = new Schedule(
                user,
                req.getTitle() != null ? req.getTitle() : "Routine",
                req.getFrequency() != null ? req.getFrequency() : "Every day",
                req.getTimeStr() != null ? req.getTimeStr() : "8:00 AM",
                req.getMedicationName() != null ? req.getMedicationName() : "Medication"
        );
        return scheduleRepository.save(schedule);
    }

    public void deleteSchedule(User user, Long id) {
        Schedule schedule = scheduleRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Schedule not found"));
        scheduleRepository.delete(schedule);
    }

    public Schedule createNaturalLanguageSchedule(User user, String prompt) {
        if (prompt == null || prompt.trim().isEmpty()) {
            throw new IllegalArgumentException("Prompt cannot be empty");
        }

        String lower = prompt.toLowerCase();

        // 1. Extract or determine time
        String timeStr = "8:00 AM";
        Pattern timePattern = Pattern.compile("(\\d{1,2}(?::\\d{2})?\\s*(?:am|pm))", Pattern.CASE_INSENSITIVE);
        Matcher timeMatcher = timePattern.matcher(prompt);
        if (timeMatcher.find()) {
            timeStr = timeMatcher.group(1).toUpperCase();
            if (!timeStr.contains(":")) {
                timeStr = timeStr.replace("AM", ":00 AM").replace("PM", ":00 PM");
            }
        } else if (lower.contains("dinner") || lower.contains("evening") || lower.contains("night")) {
            timeStr = "7:30 PM";
        } else if (lower.contains("lunch") || lower.contains("afternoon") || lower.contains("noon")) {
            timeStr = "1:00 PM";
        } else if (lower.contains("morning") || lower.contains("breakfast")) {
            timeStr = "8:00 AM";
        }

        // 2. Extract frequency
        String frequency = "Every day \u00B7 " + timeStr;
        if (lower.contains("weekday") || lower.contains("weekdays")) {
            frequency = "Weekdays \u00B7 " + timeStr;
        } else if (lower.contains("weekend") || lower.contains("weekends")) {
            frequency = "Weekends \u00B7 " + timeStr;
        } else if (lower.contains("twice daily") || lower.contains("2 times")) {
            frequency = "Twice daily \u00B7 " + timeStr;
        } else if (lower.contains("once a week") || lower.contains("weekly")) {
            frequency = "Weekly \u00B7 " + timeStr;
        }

        // 3. Extract medication name
        List<Medication> userMeds = medicationRepository.findByUserId(user.getId());
        String detectedMed = null;
        for (Medication m : userMeds) {
            if (lower.contains(m.getName().toLowerCase())) {
                detectedMed = m.getName();
                break;
            }
        }

        if (detectedMed == null) {
            Pattern medPattern = Pattern.compile("(?:take|remind me to take|schedule)\\s+([a-zA-Z0-9]+)", Pattern.CASE_INSENSITIVE);
            Matcher medMatcher = medPattern.matcher(prompt);
            if (medMatcher.find()) {
                String candidate = medMatcher.group(1);
                if (!candidate.equalsIgnoreCase("my") && !candidate.equalsIgnoreCase("a") && !candidate.equalsIgnoreCase("the")) {
                    detectedMed = candidate.substring(0, 1).toUpperCase() + candidate.substring(1).toLowerCase();
                }
            }
        }

        if (detectedMed == null) {
            detectedMed = userMeds.isEmpty() ? "Metformin" : userMeds.get(0).getName();
        }

        // 4. Determine title
        String title;
        if (lower.contains("dinner")) title = "Dinner routine";
        else if (lower.contains("lunch")) title = "Lunch routine";
        else if (lower.contains("morning")) title = "Morning routine";
        else if (lower.contains("evening") || lower.contains("night")) title = "Evening routine";
        else title = detectedMed + " routine";

        Schedule schedule = new Schedule(user, title, frequency, timeStr, detectedMed);
        return scheduleRepository.save(schedule);
    }
}
