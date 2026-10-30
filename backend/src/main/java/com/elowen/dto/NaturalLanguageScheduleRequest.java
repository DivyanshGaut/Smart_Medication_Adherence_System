package com.elowen.dto;

public class NaturalLanguageScheduleRequest {
    private String prompt;

    public NaturalLanguageScheduleRequest() {}

    public NaturalLanguageScheduleRequest(String prompt) {
        this.prompt = prompt;
    }

    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }
}
