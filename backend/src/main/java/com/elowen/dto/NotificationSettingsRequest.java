package com.elowen.dto;

public class NotificationSettingsRequest {
    private Boolean pushNotifications;
    private Boolean emailReports;
    private Boolean caregiverAlerts;

    public NotificationSettingsRequest() {}

    public NotificationSettingsRequest(Boolean pushNotifications, Boolean emailReports, Boolean caregiverAlerts) {
        this.pushNotifications = pushNotifications;
        this.emailReports = emailReports;
        this.caregiverAlerts = caregiverAlerts;
    }

    public Boolean getPushNotifications() { return pushNotifications; }
    public void setPushNotifications(Boolean pushNotifications) { this.pushNotifications = pushNotifications; }

    public Boolean getEmailReports() { return emailReports; }
    public void setEmailReports(Boolean emailReports) { this.emailReports = emailReports; }

    public Boolean getCaregiverAlerts() { return caregiverAlerts; }
    public void setCaregiverAlerts(Boolean caregiverAlerts) { this.caregiverAlerts = caregiverAlerts; }
}
