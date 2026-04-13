package com.productivity.app.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "tasks")
public class Task {
    @Id
    private String id;
    private String userId;
    private String title;
    private String description;
    private String priority; // low/medium/high
    private Date dueDate;
    private boolean completed;
    private long timeSpent; // Total time spent in seconds
    private String category;
    private java.util.List<String> tags;
    private java.util.List<SubTask> subtasks;
    private String status = "TODO"; // TODO, IN_PROGRESS, DONE
    private Date startDate;
    private Boolean allDay = false;

    public Task() {}

    public Task(String title, String description, String priority, Date dueDate, boolean completed) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.dueDate = dueDate;
        this.completed = completed;
        this.timeSpent = 0;
        this.category = "Uncategorized";
        this.tags = new java.util.ArrayList<>();
        this.subtasks = new java.util.ArrayList<>();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public Date getDueDate() { return dueDate; }
    public void setDueDate(Date dueDate) { this.dueDate = dueDate; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public long getTimeSpent() { return timeSpent; }
    public void setTimeSpent(long timeSpent) { this.timeSpent = timeSpent; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public java.util.List<String> getTags() { return tags; }
    public void setTags(java.util.List<String> tags) { this.tags = tags; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Date getStartDate() { return startDate; }
    public void setStartDate(Date startDate) { this.startDate = startDate; }

    public Boolean getAllDay() { return allDay != null && allDay; }
    public void setAllDay(Boolean allDay) { this.allDay = allDay; }

    public java.util.List<SubTask> getSubtasks() { return subtasks; }
    public void setSubtasks(java.util.List<SubTask> subtasks) { this.subtasks = subtasks; }
}
