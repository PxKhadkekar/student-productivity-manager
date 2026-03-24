package com.productivity.app.dto;

import java.util.List;

public class InsightDTO {
    private int completionRate;
    private long avgTimeSpent;
    private String mostProductiveDay;
    private String delayedPriority;
    private List<String> recommendations;

    public InsightDTO() {}

    public InsightDTO(int completionRate, long avgTimeSpent, String mostProductiveDay, String delayedPriority, List<String> recommendations) {
        this.completionRate = completionRate;
        this.avgTimeSpent = avgTimeSpent;
        this.mostProductiveDay = mostProductiveDay;
        this.delayedPriority = delayedPriority;
        this.recommendations = recommendations;
    }

    public int getCompletionRate() { return completionRate; }
    public void setCompletionRate(int completionRate) { this.completionRate = completionRate; }

    public long getAvgTimeSpent() { return avgTimeSpent; }
    public void setAvgTimeSpent(long avgTimeSpent) { this.avgTimeSpent = avgTimeSpent; }

    public String getMostProductiveDay() { return mostProductiveDay; }
    public void setMostProductiveDay(String mostProductiveDay) { this.mostProductiveDay = mostProductiveDay; }

    public String getDelayedPriority() { return delayedPriority; }
    public void setDelayedPriority(String delayedPriority) { this.delayedPriority = delayedPriority; }

    public List<String> getRecommendations() { return recommendations; }
    public void setRecommendations(List<String> recommendations) { this.recommendations = recommendations; }
}
