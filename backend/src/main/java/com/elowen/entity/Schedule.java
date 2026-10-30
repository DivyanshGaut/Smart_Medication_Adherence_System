package com.elowen.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "schedules")
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(nullable = false)
    private String title;

    private String frequency; // e.g. "Every day · 8:00 AM"
    private String timeStr;    // e.g. "8:00 AM"
    private String medicationName;
    private boolean active = true;

    public Schedule() {}

    public Schedule(User user, String title, String frequency, String timeStr, String medicationName) {
        this.user = user;
        this.title = title;
        this.frequency = frequency;
        this.timeStr = timeStr;
        this.medicationName = medicationName;
        this.active = true;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }

    public String getTimeStr() { return timeStr; }
    public void setTimeStr(String timeStr) { this.timeStr = timeStr; }

    public String getMedicationName() { return medicationName; }
    public void setMedicationName(String medicationName) { this.medicationName = medicationName; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
