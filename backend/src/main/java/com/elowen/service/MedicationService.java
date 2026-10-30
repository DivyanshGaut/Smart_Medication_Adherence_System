package com.elowen.service;

import com.elowen.dto.MedicationRequest;
import com.elowen.entity.Medication;
import com.elowen.entity.User;
import com.elowen.repository.MedicationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicationService {

    private final MedicationRepository medicationRepository;

    public MedicationService(MedicationRepository medicationRepository) {
        this.medicationRepository = medicationRepository;
    }

    public List<Medication> getMedications(User user) {
        return medicationRepository.findByUserId(user.getId());
    }

    public Medication addMedication(User user, MedicationRequest req) {
        Medication medication = new Medication();
        medication.setUser(user);
        medication.setName(req.getName());
        medication.setDosage(req.getDosage() != null ? req.getDosage() : "10 mg");
        medication.setDetail(req.getDetail() != null ? req.getDetail() : req.getDosage() + " · Once daily");
        medication.setPillCount(req.getPillCount() != null ? req.getPillCount() : 30);
        medication.setTotalCapacity(req.getTotalCapacity() != null ? req.getTotalCapacity() : 30);
        medication.setColor(req.getColor() != null ? req.getColor() : "#4F63D9");
        medication.setIcon(req.getIcon() != null ? req.getIcon() : (req.getName().isEmpty() ? "M" : req.getName().substring(0, 1).toUpperCase()));
        medication.setScheduleTime(req.getScheduleTime() != null ? req.getScheduleTime() : "8:00 AM");
        medication.setRefillDate(req.getRefillDate() != null ? req.getRefillDate() : "in 30 days");
        medication.setActive(true);

        return medicationRepository.save(medication);
    }

    public Medication updateMedication(User user, Long id, MedicationRequest req) {
        Medication medication = medicationRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Medication not found"));

        if (req.getName() != null) medication.setName(req.getName());
        if (req.getDosage() != null) medication.setDosage(req.getDosage());
        if (req.getDetail() != null) medication.setDetail(req.getDetail());
        if (req.getPillCount() != null) medication.setPillCount(req.getPillCount());
        if (req.getTotalCapacity() != null) medication.setTotalCapacity(req.getTotalCapacity());
        if (req.getColor() != null) medication.setColor(req.getColor());
        if (req.getIcon() != null) medication.setIcon(req.getIcon());
        if (req.getScheduleTime() != null) medication.setScheduleTime(req.getScheduleTime());
        if (req.getRefillDate() != null) medication.setRefillDate(req.getRefillDate());

        return medicationRepository.save(medication);
    }

    public void deleteMedication(User user, Long id) {
        Medication medication = medicationRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Medication not found"));
        medicationRepository.delete(medication);
    }
}
