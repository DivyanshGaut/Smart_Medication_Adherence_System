package com.elowen.config;

import com.elowen.entity.*;
import com.elowen.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final MedicationRepository medicationRepository;
    private final ScheduleRepository scheduleRepository;
    private final CareCircleMemberRepository careCircleMemberRepository;
    private final DoseLogRepository doseLogRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           MedicationRepository medicationRepository,
                           ScheduleRepository scheduleRepository,
                           CareCircleMemberRepository careCircleMemberRepository,
                           DoseLogRepository doseLogRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.medicationRepository = medicationRepository;
        this.scheduleRepository = scheduleRepository;
        this.careCircleMemberRepository = careCircleMemberRepository;
        this.doseLogRepository = doseLogRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            // Ensure any existing demo medications are updated to the current palette
            medicationRepository.findAll().forEach(med -> {
                if ("#84A282".equalsIgnoreCase(med.getColor())) {
                    med.setColor("#4F63D9");
                    medicationRepository.save(med);
                } else if ("#D699AE".equalsIgnoreCase(med.getColor())) {
                    med.setColor("#C9B7E8");
                    medicationRepository.save(med);
                } else if ("#B3A57C".equalsIgnoreCase(med.getColor())) {
                    med.setColor("#5E8F7A");
                    medicationRepository.save(med);
                }
            });
            return;
        }

        // 1. Create default demo user
        User user = new User();
        user.setEmail("alex@example.com");
        user.setPassword(passwordEncoder.encode("password123"));
        user.setName("Alex Morgan");
        user.setTimezone("Eastern Time");
        user.setPushNotifications(true);
        user.setEmailReports(true);
        user.setCaregiverAlerts(true);
        user = userRepository.save(user);

        // 2. Create Medications
        Medication lisinopril = new Medication(
                user, "Lisinopril", "10 mg", "10 mg \u00B7 1 tablet",
                22, 30, "#4F63D9", "L", "8:00 AM", "Nov 9"
        );
        Medication metformin = new Medication(
                user, "Metformin", "500 mg", "500 mg \u00B7 With lunch",
                8, 30, "#C9B7E8", "M", "1:00 PM", "in 4 days"
        );
        Medication vitaminD3 = new Medication(
                user, "Vitamin D3", "1000 IU", "1000 IU \u00B7 1 capsule",
                45, 50, "#5E8F7A", "D", "8:30 PM", "Dec 2"
        );

        lisinopril = medicationRepository.save(lisinopril);
        metformin = medicationRepository.save(metformin);
        vitaminD3 = medicationRepository.save(vitaminD3);

        // 3. Create Schedules
        scheduleRepository.save(new Schedule(user, "Morning routine", "Every day \u00B7 8:00 AM", "8:00 AM", "Lisinopril"));
        scheduleRepository.save(new Schedule(user, "Lunch routine", "Every day \u00B7 1:00 PM", "1:00 PM", "Metformin"));
        scheduleRepository.save(new Schedule(user, "Evening routine", "Weekdays \u00B7 8:30 PM", "8:30 PM", "Vitamin D3"));

        // 4. Create Care Circle Members
        careCircleMemberRepository.save(new CareCircleMember(
                user, "Maya Singh", "Primary caregiver \u00B7 Full dose alerts", "Active", "maya@example.com", "+1-555-0192"
        ));
        careCircleMemberRepository.save(new CareCircleMember(
                user, "Jordan Davis", "Family \u00B7 Missed dose alerts only", "Active", "jordan@example.com", "+1-555-0144"
        ));
        careCircleMemberRepository.save(new CareCircleMember(
                user, "Dr. Elena Park", "Clinician \u00B7 Monthly report", "Pending", "elena.park@hospital.org", "+1-555-0178"
        ));

        // 5. Create History and Today's logs
        LocalDate today = LocalDate.now();

        // Today's logs
        DoseLog todayLisinopril = new DoseLog(user, lisinopril, "Lisinopril", "8:00 AM", today, "Taken", "Lisinopril marked as taken");
        todayLisinopril.setLoggedAt(LocalDateTime.now().withHour(8).withMinute(2));
        doseLogRepository.save(todayLisinopril);

        DoseLog todayMetformin = new DoseLog(user, metformin, "Metformin", "1:00 PM", today, "Due soon", "Metformin due soon");
        doseLogRepository.save(todayMetformin);

        DoseLog todayVitamin = new DoseLog(user, vitaminD3, "Vitamin D3", "8:30 PM", today, "Upcoming", "Vitamin D3 upcoming tonight");
        doseLogRepository.save(todayVitamin);

        // Yesterday's logs
        LocalDate yesterday = today.minusDays(1);
        DoseLog yestVit = new DoseLog(user, vitaminD3, "Vitamin D3", "8:30 PM", yesterday, "Snoozed", "Vitamin D3 reminder snoozed 10 min");
        yestVit.setLoggedAt(LocalDateTime.now().minusDays(1).withHour(20).withMinute(35));
        doseLogRepository.save(yestVit);

        DoseLog yestMet = new DoseLog(user, metformin, "Metformin", "1:00 PM", yesterday, "Taken", "Metformin marked as taken");
        doseLogRepository.save(yestMet);

        DoseLog yestLis = new DoseLog(user, lisinopril, "Lisinopril", "8:00 AM", yesterday, "Taken", "Lisinopril marked as taken");
        doseLogRepository.save(yestLis);

        // Two days ago (missed dose)
        LocalDate dayBefore = today.minusDays(2);
        DoseLog missedLog = new DoseLog(user, metformin, "Metformin", "1:00 PM", dayBefore, "Missed", "Metformin reminder missed");
        missedLog.setLoggedAt(LocalDateTime.now().minusDays(2).withHour(13).withMinute(0));
        doseLogRepository.save(missedLog);

        // Seed 30 days of past logs for rich statistics (84 taken, 5 missed, 2 skipped)
        for (int i = 3; i <= 29; i++) {
            LocalDate pastDate = today.minusDays(i);
            String status1 = "Taken";
            String status2 = (i == 7 || i == 14 || i == 21) ? "Missed" : "Taken";
            String status3 = (i == 10 || i == 25) ? "Skipped" : "Taken";

            doseLogRepository.save(new DoseLog(user, lisinopril, "Lisinopril", "8:00 AM", pastDate, status1, "Routine dose"));
            doseLogRepository.save(new DoseLog(user, metformin, "Metformin", "1:00 PM", pastDate, status2, "Lunch dose"));
            doseLogRepository.save(new DoseLog(user, vitaminD3, "Vitamin D3", "8:30 PM", pastDate, status3, "Evening dose"));
        }
    }
}
