package com.elowen.dto;

public class CareCircleRequest {
    private String name;
    private String relationship;
    private String status;
    private String email;
    private String phone;

    public CareCircleRequest() {}

    public CareCircleRequest(String name, String relationship, String status, String email, String phone) {
        this.name = name;
        this.relationship = relationship;
        this.status = status;
        this.email = email;
        this.phone = phone;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRelationship() { return relationship; }
    public void setRelationship(String relationship) { this.relationship = relationship; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}
