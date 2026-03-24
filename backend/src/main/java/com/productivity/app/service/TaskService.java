package com.productivity.app.service;

import com.productivity.app.model.Task;
import com.productivity.app.repository.TaskRepository;
import com.productivity.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    private String getCurrentUserId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Unauthorized")).getId();
    }

    public List<Task> getAllTasks() {
        return taskRepository.findByUserId(getCurrentUserId());
    }

    public List<Task> getTasksForCalendar(java.util.Date start, java.util.Date end) {
        return taskRepository.findByUserIdAndDueDateBetween(getCurrentUserId(), start, end);
    }

    public Optional<Task> getTaskById(String id) {
        return taskRepository.findByIdAndUserId(id, getCurrentUserId());
    }

    public Task createTask(Task task) {
        task.setUserId(getCurrentUserId());
        if (task.getCategory() == null || task.getCategory().trim().isEmpty()) {
            task.setCategory("Uncategorized");
        }
        if (task.getTags() == null) {
            task.setTags(new java.util.ArrayList<>());
        }
        return taskRepository.save(task);
    }

    public Task updateTask(String id, Task taskDetails) {
        Optional<Task> optionalTask = taskRepository.findByIdAndUserId(id, getCurrentUserId());
        if (optionalTask.isPresent()) {
            Task task = optionalTask.get();
            task.setTitle(taskDetails.getTitle());
            task.setDescription(taskDetails.getDescription());
            task.setPriority(taskDetails.getPriority());
            task.setDueDate(taskDetails.getDueDate());
            task.setStartDate(taskDetails.getStartDate());
            task.setAllDay(taskDetails.getAllDay());
            task.setCompleted(taskDetails.isCompleted());
            
            if (taskDetails.getCategory() != null) {
                task.setCategory(taskDetails.getCategory());
            }
            if (taskDetails.getTags() != null) {
                task.setTags(taskDetails.getTags());
            }
            
            return taskRepository.save(task);
        }
        return null;
    }

    public Task updateTaskStatus(String id, String status) {
        Optional<Task> optionalTask = taskRepository.findByIdAndUserId(id, getCurrentUserId());
        if (optionalTask.isPresent()) {
            Task task = optionalTask.get();
            task.setStatus(status);
            if ("DONE".equals(status)) {
                task.setCompleted(true);
            } else if ("TODO".equals(status) || "IN_PROGRESS".equals(status)) {
                task.setCompleted(false);
            }
            return taskRepository.save(task);
        }
        return null;
    }

    public com.productivity.app.dto.TaskStats getTaskStats() {
        List<Task> tasks = taskRepository.findByUserId(getCurrentUserId());

        long totalTasks = tasks.size();
        long completedTasks = tasks.stream().filter(Task::isCompleted).count();

        long high = tasks.stream().filter(t -> "high".equalsIgnoreCase(t.getPriority()) && !t.isCompleted()).count();
        long medium = tasks.stream().filter(t -> "medium".equalsIgnoreCase(t.getPriority()) && !t.isCompleted()).count();
        long low = tasks.stream().filter(t -> "low".equalsIgnoreCase(t.getPriority()) && !t.isCompleted()).count();

        List<com.productivity.app.dto.TaskStats.PriorityStat> priorityStats = java.util.Arrays.asList(
            new com.productivity.app.dto.TaskStats.PriorityStat("High", high),
            new com.productivity.app.dto.TaskStats.PriorityStat("Medium", medium),
            new com.productivity.app.dto.TaskStats.PriorityStat("Low", low)
        );

        java.time.LocalDate today = java.time.LocalDate.now();
        List<com.productivity.app.dto.TaskStats.DailyStat> dailyStats = new java.util.ArrayList<>();
        for (int i = 0; i < 7; i++) {
            java.time.LocalDate date = today.plusDays(i);
            long count = tasks.stream()
                .filter(t -> t.getDueDate() != null && !t.isCompleted())
                .filter(t -> {
                    java.time.LocalDate d = t.getDueDate().toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDate();
                    return d.equals(date);
                })
                .count();
            // Store day name like 'Mon', 'Tue'
            String dayName = date.getDayOfWeek().toString().substring(0, 3);
            dailyStats.add(new com.productivity.app.dto.TaskStats.DailyStat(dayName, count));
        }

        return new com.productivity.app.dto.TaskStats(totalTasks, completedTasks, dailyStats, priorityStats);
    }

    public void deleteTask(String id) {
        Optional<Task> task = taskRepository.findByIdAndUserId(id, getCurrentUserId());
        task.ifPresent(t -> taskRepository.delete(t));
    }

    public Task logTime(String id, long extraSeconds) {
        Optional<Task> optionalTask = taskRepository.findByIdAndUserId(id, getCurrentUserId());
        if (optionalTask.isPresent()) {
            Task task = optionalTask.get();
            task.setTimeSpent(task.getTimeSpent() + extraSeconds);
            return taskRepository.save(task);
        }
        return null;
    }
}
