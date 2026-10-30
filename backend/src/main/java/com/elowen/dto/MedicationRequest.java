package com.elowen.dto;

public class MedicationRequest {
    private String name;
    private String dosage;
    private String detail;
    private Integer pillCount;
    private Integer totalCapacity;
    private String color;
    private String icon;
    private String scheduleTime;
    private String refillDate;

    public MedicationRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }

    public String getDetail() { return detail; }
    public void setDetail(String detail) { this.detail = detail; }

    public Integer getPillCount() { return pillCount; }
    public void setPillCount(Integer pillCount) { this.pillCount = pillCount; }

    public Integer getTotalCapacity() { return totalCapacity; }
    public void setTotalCapacity(Integer totalCapacity) { this.totalCapacity = totalCapacity; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getScheduleTime() { return scheduleTime; }
    public void setScheduleTime(String scheduleTime) { this.scheduleTime = scheduleTime; }

    public String getRefillDate() { return refillDate; }
    public void setRefillDate(String refillDate) { this.refillDate = refillDate; }
}
