package com.elowen.service;

import com.elowen.dto.DoseActionRequest;
import com.elowen.entity.DoseLog;
import com.elowen.entity.Medication;
import com.elowen.entity.User;
import com.elowen.repository.DoseLogRepository;
import com.elowen.repository.MedicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DoseService {

    private final DoseLogRepository doseLogRepository;
    private final MedicationRepository medicationRepository;

    public DoseService(DoseLogRepository doseLogRepository, MedicationRepository medicationRepository) {
        this.doseLogRepository = doseLogRepository;
        this.medicationRepository = medicationRepository;
    }

    @Transactional
    public DoseLog recordDoseAction(User user, DoseActionRequest req) {
        LocalDate today = LocalDate.now();
        Medication medication = null;

        if (req.getMedicationId() != null) {
            medication = medicationRepository.findByIdAndUserId(req.getMedicationId(), user.getId()).orElse(null);
        }

        String medName = req.getMedicationName();
        if (medication != null && (medName == null || medName.isEmpty())) {
            medName = medication.getName();
        } else if (medName != null && medication == null) {
            medication = medicationRepository.findByNameIgnoreCaseAndUserId(medName, user.getId()).orElse(null);
        }

        if (medName == null) {
            medName = "Medication";
        }

        // Check if there's already a log for today for this medication
        Optional<DoseLog> existingLog = Optional.empty();
        if (medication != null) {
            existingLog = doseLogRepository.findTopByUserIdAndMedicationIdAndDoseDateOrderByLoggedAtDesc(user.getId(), medication.getId(), today);
        }
        if (existingLog.isEmpty()) {
            existingLog = doseLogRepository.findTopByUserIdAndMedicationNameIgnoreCaseAndDoseDateOrderByLoggedAtDesc(user.getId(), medName, today);
        }

        DoseLog doseLog;
        String normalizedStatus = req.getStatus() != null ? req.getStatus().toUpperCase() : "TAKEN";
        // Standardize status representation (Taken, Snoozed, Missed, Skipped)
        String displayStatus = switch (normalizedStatus) {
            case "TAKEN" -> "Taken";
            case "SNOOZED" -> "Snoozed";
            case "MISSED" -> "Missed";
            case "SKIPPED" -> "Skipped";
            case "DUE_SOON", "DUE SOON" -> "Due soon";
            default -> "Upcoming";
        };

        if (existingLog.isPresent()) {
            doseLog = existingLog.get();
            doseLog.setStatus(displayStatus);
            doseLog.setNotes(req.getNotes() != null ? req.getNotes() : (medName + " marked as " + displayStatus.toLowerCase()));
            doseLog.setLoggedAt(LocalDateTime.now());
        } else {
            String scheduledTime = medication != null ? medication.getScheduleTime() : "8:00 AM";
            doseLog = new DoseLog(
                    user,
                    medication,
                    medName,
                    scheduledTime,
                    today,
                    displayStatus,
                    req.getNotes() != null ? req.getNotes() : (medName + " marked as " + displayStatus.toLowerCase())
            );
        }

        // If Taken, decrement remaining pills by 1
        if ("Taken".equals(displayStatus) && medication != null && medication.getPillCount() != null && medication.getPillCount() > 0) {
            medication.setPillCount(medication.getPillCount() - 1);
            medicationRepository.save(medication);
        }

        return doseLogRepository.save(doseLog);
    }

    public List<DoseLog> getTodayDoses(User user) {
        return doseLogRepository.findByUserIdAndDoseDateOrderByScheduledTimeAsc(user.getId(), LocalDate.now());
    }

    public List<DoseLog> getHistory(User user) {
        return doseLogRepository.findByUserIdOrderByLoggedAtDesc(user.getId());
    }
}
