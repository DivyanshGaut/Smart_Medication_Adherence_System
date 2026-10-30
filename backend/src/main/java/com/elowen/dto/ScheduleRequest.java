package com.elowen.dto;

public class ScheduleRequest {
    private String title;
    private String frequency;
    private String timeStr;
    private String medicationName;

    public ScheduleRequest() {}

    public ScheduleRequest(String title, String frequency, String timeStr, String medicationName) {
        this.title = title;
        this.frequency = frequency;
        this.timeStr = timeStr;
        this.medicationName = medicationName;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }

    public String getTimeStr() { return timeStr; }
    public void setTimeStr(String timeStr) { this.timeStr = timeStr; }

    public String getMedicationName() { return medicationName; }
    public void setMedicationName(String medicationName) { this.medicationName = medicationName; }
}
