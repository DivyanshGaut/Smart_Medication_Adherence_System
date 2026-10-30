package com.elowen.dto;

import java.util.List;

public class InsightDto {
    private String bestDay;
    private String bestDayStat;
    private String needsAttention;
    private String needsAttentionStat;
    private String strongestMed;
    private String strongestMedStat;
    private List<MedicationRankDto> rankings;
    private String insightTitle;
    private String insightDescription;
    private String suggestedAction;

    public InsightDto() {}

    public static class MedicationRankDto {
        private String name;
        private int adherencePercentage;

        public MedicationRankDto() {}

        public MedicationRankDto(String name, int adherencePercentage) {
            this.name = name;
            this.adherencePercentage = adherencePercentage;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public int getAdherencePercentage() { return adherencePercentage; }
        public void setAdherencePercentage(int adherencePercentage) { this.adherencePercentage = adherencePercentage; }
    }

    public String getBestDay() { return bestDay; }
    public void setBestDay(String bestDay) { this.bestDay = bestDay; }

    public String getBestDayStat() { return bestDayStat; }
    public void setBestDayStat(String bestDayStat) { this.bestDayStat = bestDayStat; }

    public String getNeedsAttention() { return needsAttention; }
    public void setNeedsAttention(String needsAttention) { this.needsAttention = needsAttention; }

    public String getNeedsAttentionStat() { return needsAttentionStat; }
    public void setNeedsAttentionStat(String needsAttentionStat) { this.needsAttentionStat = needsAttentionStat; }

    public String getStrongestMed() { return strongestMed; }
    public void setStrongestMed(String strongestMed) { this.strongestMed = strongestMed; }

    public String getStrongestMedStat() { return strongestMedStat; }
    public void setStrongestMedStat(String strongestMedStat) { this.strongestMedStat = strongestMedStat; }

    public List<MedicationRankDto> getRankings() { return rankings; }
    public void setRankings(List<MedicationRankDto> rankings) { this.rankings = rankings; }

    public String getInsightTitle() { return insightTitle; }
    public void setInsightTitle(String insightTitle) { this.insightTitle = insightTitle; }

    public String getInsightDescription() { return insightDescription; }
    public void setInsightDescription(String insightDescription) { this.insightDescription = insightDescription; }

    public String getSuggestedAction() { return suggestedAction; }
    public void setSuggestedAction(String suggestedAction) { this.suggestedAction = suggestedAction; }
}
