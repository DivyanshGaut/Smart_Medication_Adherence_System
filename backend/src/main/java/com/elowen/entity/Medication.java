package com.elowen.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "medications")
public class Medication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(nullable = false)
    private String name;

    private String dosage; // e.g. "10 mg", "500 mg"
    private String detail; // e.g. "10 mg · 1 tablet", "500 mg · With lunch"
    private Integer pillCount = 30;
    private Integer totalCapacity = 30;
    private String color = "#4F63D9";
    private String icon = "pill";
    private String scheduleTime = "8:00 AM";
    private String refillDate = "Nov 9";
    private boolean active = true;

    public Medication() {}

    public Medication(User user, String name, String dosage, String detail, Integer pillCount, Integer totalCapacity, String color, String icon, String scheduleTime, String refillDate) {
        this.user = user;
        this.name = name;
        this.dosage = dosage;
        this.detail = detail;
        this.pillCount = pillCount;
        this.totalCapacity = totalCapacity;
        this.color = color;
        this.icon = icon;
        this.scheduleTime = scheduleTime;
        this.refillDate = refillDate;
        this.active = true;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

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

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
