package com.productivity.app.service;

import com.productivity.app.dto.InsightDTO;
import com.productivity.app.model.Task;
import com.productivity.app.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

@Service
public class AnalyticsService {
    @Autowired
    private TaskRepository taskRepository;

    public InsightDTO getInsights(String userId) {
        List<Task> tasks = taskRepository.findByUserId(userId);
        if (tasks.isEmpty()) {
            return new InsightDTO(0, 0, "N/A", "N/A", List.of("Add some tasks to generate insights!"));
        }

        long total = tasks.size();
        long completed = tasks.stream().filter(Task::isCompleted).count();
        int completionRate = (int) Math.round(((double) completed / total) * 100);

        List<Task> completedTasks = tasks.stream().filter(Task::isCompleted).toList();
        long avgTimeSpent = 0;
        if (!completedTasks.isEmpty()) {
            long totalTime = completedTasks.stream().mapToLong(Task::getTimeSpent).sum();
            avgTimeSpent = totalTime / completedTasks.size();
        }

        // Most productive day (using dueDate of completed tasks as proxy for completion day)
        Map<String, Long> dayCounts = new HashMap<>();
        for (Task t : completedTasks) {
            if (t.getDueDate() != null) {
                LocalDate date = t.getDueDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                String dayOfWeek = date.getDayOfWeek().name();
                dayCounts.put(dayOfWeek, dayCounts.getOrDefault(dayOfWeek, 0L) + 1);
            }
        }
        String mostProductiveDay = dayCounts.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(e -> e.getKey().substring(0, 1) + e.getKey().substring(1).toLowerCase())
                .orElse("None yet");

        // Delayed priority
        Map<String, Long> delayedCounts = new HashMap<>();
        Date now = new Date();
        for (Task t : tasks) {
            if (!t.isCompleted() && t.getDueDate() != null && t.getDueDate().before(now)) {
                String p = t.getPriority() != null ? t.getPriority().substring(0,1).toUpperCase() + t.getPriority().substring(1) : "Unknown";
                delayedCounts.put(p, delayedCounts.getOrDefault(p, 0L) + 1);
            }
        }
        String delayedPriority = delayedCounts.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("None");

        // Recommendations
        List<String> recommendations = new ArrayList<>();
        if (completionRate < 50) {
            recommendations.add("Your completion rate is below 50%. Focus on clearing your backlog!");
        } else if (completionRate > 80) {
            recommendations.add("You're highly productive! Keep up the momentum.");
        }

        if (!"None".equals(delayedPriority)) {
            recommendations.add(delayedPriority + " priority tasks are frequently delayed. Address them first tomorrow.");
        }

        if (!"None yet".equals(mostProductiveDay)) {
            recommendations.add("You are most productive on " + mostProductiveDay + "s. Schedule deep work then.");
        }

        if (avgTimeSpent > 3600) {
            recommendations.add("You average over an hour per task. Try breaking them down into sub-tasks.");
        } else if (avgTimeSpent > 0 && avgTimeSpent < 300) {
             recommendations.add("Your tasks are completed very quickly. Excellent flow!");
        }

        if (recommendations.isEmpty()) {
            recommendations.add("Keep up the steady work! We are gathering more data to provide better insights.");
        }

        return new InsightDTO(completionRate, avgTimeSpent, mostProductiveDay, delayedPriority, recommendations);
    }
}
