package com.elowen.dto;

public class DoseActionRequest {
    private Long medicationId;
    private String medicationName;
    private String status; // TAKEN, SNOOZED, MISSED, SKIPPED
    private String notes;

    public DoseActionRequest() {}

    public DoseActionRequest(Long medicationId, String medicationName, String status, String notes) {
        this.medicationId = medicationId;
        this.medicationName = medicationName;
        this.status = status;
        this.notes = notes;
    }

    public Long getMedicationId() { return medicationId; }
    public void setMedicationId(Long medicationId) { this.medicationId = medicationId; }

    public String getMedicationName() { return medicationName; }
    public void setMedicationName(String medicationName) { this.medicationName = medicationName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
