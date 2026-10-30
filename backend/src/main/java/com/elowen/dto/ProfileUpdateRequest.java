package com.elowen.dto;

public class ProfileUpdateRequest {
    private String name;
    private String email;
    private String timezone;

    public ProfileUpdateRequest() {}

    public ProfileUpdateRequest(String name, String email, String timezone) {
        this.name = name;
        this.email = email;
        this.timezone = timezone;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTimezone() { return timezone; }
    public void setTimezone(String timezone) { this.timezone = timezone; }
}
