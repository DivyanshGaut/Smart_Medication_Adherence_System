package com.elowen.dto;

import java.util.List;

public class DashboardOverviewDto {
    private int adherenceRate;
    private int todayTaken;
    private int todayTotal;
    private int streakDays;
    private int bestStreakDays;
    private int missedDosesCount;
    private List<TodayDoseDto> todaySchedule;
    private ScoreBreakdownDto scoreBreakdown;
    private TrendChartDto trend;
    private List<MedicationStockDto> inventory;
    private List<List<String>> consistencyHeatmap;

    public DashboardOverviewDto() {}

    public static class TodayDoseDto {
        private Long medicationId;
        private String time;
        private String name;
        private String detail;
        private String color;
        private String status;
        private String icon;

        public TodayDoseDto() {}

        public TodayDoseDto(Long medicationId, String time, String name, String detail, String color, String status, String icon) {
            this.medicationId = medicationId;
            this.time = time;
            this.name = name;
            this.detail = detail;
            this.color = color;
            this.status = status;
            this.icon = icon;
        }

        public Long getMedicationId() { return medicationId; }
        public void setMedicationId(Long medicationId) { this.medicationId = medicationId; }

        public String getTime() { return time; }
        public void setTime(String time) { this.time = time; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getDetail() { return detail; }
        public void setDetail(String detail) { this.detail = detail; }

        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public String getIcon() { return icon; }
        public void setIcon(String icon) { this.icon = icon; }
    }

    public static class ScoreBreakdownDto {
        private int taken;
        private int missed;
        private int skipped;
        private int adherencePercent;

        public ScoreBreakdownDto() {}

        public ScoreBreakdownDto(int taken, int missed, int skipped, int adherencePercent) {
            this.taken = taken;
            this.missed = missed;
            this.skipped = skipped;
            this.adherencePercent = adherencePercent;
        }

        public int getTaken() { return taken; }
        public void setTaken(int taken) { this.taken = taken; }

        public int getMissed() { return missed; }
        public void setMissed(int missed) { this.missed = missed; }

        public int getSkipped() { return skipped; }
        public void setSkipped(int skipped) { this.skipped = skipped; }

        public int getAdherencePercent() { return adherencePercent; }
        public void setAdherencePercent(int adherencePercent) { this.adherencePercent = adherencePercent; }
    }

    public static class TrendChartDto {
        private List<String> labels;
        private List<Integer> values;
        private int average;

        public TrendChartDto() {}

        public TrendChartDto(List<String> labels, List<Integer> values, int average) {
            this.labels = labels;
            this.values = values;
            this.average = average;
        }

        public List<String> getLabels() { return labels; }
        public void setLabels(List<String> labels) { this.labels = labels; }

        public List<Integer> getValues() { return values; }
        public void setValues(List<Integer> values) { this.values = values; }

        public int getAverage() { return average; }
        public void setAverage(int average) { this.average = average; }
    }

    public static class MedicationStockDto {
        private String name;
        private String count;
        private String width;
        private String date;
        private String color;

        public MedicationStockDto() {}

        public MedicationStockDto(String name, String count, String width, String date, String color) {
            this.name = name;
            this.count = count;
            this.width = width;
            this.date = date;
            this.color = color;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getCount() { return count; }
        public void setCount(String count) { this.count = count; }

        public String getWidth() { return width; }
        public void setWidth(String width) { this.width = width; }

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }

        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }
    }

    public int getAdherenceRate() { return adherenceRate; }
    public void setAdherenceRate(int adherenceRate) { this.adherenceRate = adherenceRate; }

    public int getTodayTaken() { return todayTaken; }
    public void setTodayTaken(int todayTaken) { this.todayTaken = todayTaken; }

    public int getTodayTotal() { return todayTotal; }
    public void setTodayTotal(int todayTotal) { this.todayTotal = todayTotal; }

    public int getStreakDays() { return streakDays; }
    public void setStreakDays(int streakDays) { this.streakDays = streakDays; }

    public int getBestStreakDays() { return bestStreakDays; }
    public void setBestStreakDays(int bestStreakDays) { this.bestStreakDays = bestStreakDays; }

    public int getMissedDosesCount() { return missedDosesCount; }
    public void setMissedDosesCount(int missedDosesCount) { this.missedDosesCount = missedDosesCount; }

    public List<TodayDoseDto> getTodaySchedule() { return todaySchedule; }
    public void setTodaySchedule(List<TodayDoseDto> todaySchedule) { this.todaySchedule = todaySchedule; }

    public ScoreBreakdownDto getScoreBreakdown() { return scoreBreakdown; }
    public void setScoreBreakdown(ScoreBreakdownDto scoreBreakdown) { this.scoreBreakdown = scoreBreakdown; }

    public TrendChartDto getTrend() { return trend; }
    public void setTrend(TrendChartDto trend) { this.trend = trend; }

    public List<MedicationStockDto> getInventory() { return inventory; }
    public void setInventory(List<MedicationStockDto> inventory) { this.inventory = inventory; }

    public List<List<String>> getConsistencyHeatmap() { return consistencyHeatmap; }
    public void setConsistencyHeatmap(List<List<String>> consistencyHeatmap) { this.consistencyHeatmap = consistencyHeatmap; }
}
