package com.elowen.dto;

import com.elowen.entity.User;

public class UserDto {
    private Long id;
    private String email;
    private String name;
    private String timezone;
    private boolean pushNotifications;
    private boolean emailReports;
    private boolean caregiverAlerts;

    public UserDto() {}

    public UserDto(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.name = user.getName();
        this.timezone = user.getTimezone();
        this.pushNotifications = user.isPushNotifications();
        this.emailReports = user.isEmailReports();
        this.caregiverAlerts = user.isCaregiverAlerts();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getTimezone() { return timezone; }
    public void setTimezone(String timezone) { this.timezone = timezone; }

    public boolean isPushNotifications() { return pushNotifications; }
    public void setPushNotifications(boolean pushNotifications) { this.pushNotifications = pushNotifications; }

    public boolean isEmailReports() { return emailReports; }
    public void setEmailReports(boolean emailReports) { this.emailReports = emailReports; }

    public boolean isCaregiverAlerts() { return caregiverAlerts; }
    public void setCaregiverAlerts(boolean caregiverAlerts) { this.caregiverAlerts = caregiverAlerts; }
}
