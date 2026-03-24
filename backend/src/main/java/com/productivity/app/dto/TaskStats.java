package com.productivity.app.dto;

import java.util.List;

public class TaskStats {
    private long totalTasks;
    private long completedTasks;
    private List<DailyStat> upcomingTasksByDay;
    private List<PriorityStat> tasksByPriority;

    public TaskStats() {}

    public TaskStats(long totalTasks, long completedTasks, List<DailyStat> upcomingTasksByDay, List<PriorityStat> tasksByPriority) {
        this.totalTasks = totalTasks;
        this.completedTasks = completedTasks;
        this.upcomingTasksByDay = upcomingTasksByDay;
        this.tasksByPriority = tasksByPriority;
    }

    public long getTotalTasks() { return totalTasks; }
    public void setTotalTasks(long totalTasks) { this.totalTasks = totalTasks; }

    public long getCompletedTasks() { return completedTasks; }
    public void setCompletedTasks(long completedTasks) { this.completedTasks = completedTasks; }

    public List<DailyStat> getUpcomingTasksByDay() { return upcomingTasksByDay; }
    public void setUpcomingTasksByDay(List<DailyStat> upcomingTasksByDay) { this.upcomingTasksByDay = upcomingTasksByDay; }

    public List<PriorityStat> getTasksByPriority() { return tasksByPriority; }
    public void setTasksByPriority(List<PriorityStat> tasksByPriority) { this.tasksByPriority = tasksByPriority; }

    public static class DailyStat {
        private String date;
        private long count;

        public DailyStat(String date, long count) {
            this.date = date;
            this.count = count;
        }

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
        public long getCount() { return count; }
        public void setCount(long count) { this.count = count; }
    }

    public static class PriorityStat {
        private String priority;
        private long count;

        public PriorityStat(String priority, long count) {
            this.priority = priority;
            this.count = count;
        }

        public String getPriority() { return priority; }
        public void setPriority(String priority) { this.priority = priority; }
        public long getCount() { return count; }
        public void setCount(long count) { this.count = count; }
    }
}
