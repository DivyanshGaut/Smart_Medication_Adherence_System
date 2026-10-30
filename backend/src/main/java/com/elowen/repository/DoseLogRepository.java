package com.elowen.repository;

import com.elowen.entity.DoseLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DoseLogRepository extends JpaRepository<DoseLog, Long> {
    List<DoseLog> findByUserIdOrderByLoggedAtDesc(Long userId);
    List<DoseLog> findByUserIdAndDoseDateOrderByScheduledTimeAsc(Long userId, LocalDate doseDate);
    List<DoseLog> findByUserIdAndDoseDateBetweenOrderByDoseDateAsc(Long userId, LocalDate startDate, LocalDate endDate);
    Optional<DoseLog> findTopByUserIdAndMedicationIdAndDoseDateOrderByLoggedAtDesc(Long userId, Long medicationId, LocalDate doseDate);
    Optional<DoseLog> findTopByUserIdAndMedicationNameIgnoreCaseAndDoseDateOrderByLoggedAtDesc(Long userId, String medicationName, LocalDate doseDate);
    long countByUserIdAndStatus(Long userId, String status);
    long countByUserId(Long userId);
}
