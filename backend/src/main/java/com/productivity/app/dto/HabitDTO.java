package com.productivity.app.dto;

import java.time.LocalDate;
import java.util.List;

public class HabitDTO {
    private String id;
    private String name;
    private LocalDate createdAt;
    private int currentStreak;
    private int longestStreak;
    private List<HabitLogDTO> logs;

    public HabitDTO() {}

    public HabitDTO(String id, String name, LocalDate createdAt, int currentStreak, int longestStreak, List<HabitLogDTO> logs) {
        this.id = id;
        this.name = name;
        this.createdAt = createdAt;
        this.currentStreak = currentStreak;
        this.longestStreak = longestStreak;
        this.logs = logs;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public LocalDate getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }
    public int getCurrentStreak() { return currentStreak; }
    public void setCurrentStreak(int currentStreak) { this.currentStreak = currentStreak; }
    public int getLongestStreak() { return longestStreak; }
    public void setLongestStreak(int longestStreak) { this.longestStreak = longestStreak; }
    public List<HabitLogDTO> getLogs() { return logs; }
    public void setLogs(List<HabitLogDTO> logs) { this.logs = logs; }
}
