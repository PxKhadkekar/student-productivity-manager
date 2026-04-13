package com.productivity.app.service;

import com.productivity.app.model.Task;
import com.productivity.app.model.User;
import com.productivity.app.repository.TaskRepository;
import com.productivity.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Service
public class NotificationScheduler {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private EmailService emailService;

    // Fires exactly at 8:00 AM every day automatically
    @Scheduled(cron = "0 0 8 * * ?")
    public void processDailyNotifications() {
        System.out.println("🤖 [CRON WORKER] Starting Daily Aggregation Job...");
        
        List<User> allUsers = userRepository.findAll();
        LocalDate today = LocalDate.now();
        
        for (User user : allUsers) {
            List<Task> userTasks = taskRepository.findByUserId(user.getId());
            
            int overdueCount = 0;
            int dueTodayCount = 0;
            
            for (Task task : userTasks) {
                if (task.isCompleted() || task.getDueDate() == null) {
                    continue;
                }
                
                LocalDate dueDate = task.getDueDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                
                if (dueDate.isBefore(today)) {
                    overdueCount++;
                } else if (dueDate.isEqual(today)) {
                    dueTodayCount++;
                }
            }
            
            if (overdueCount > 0 || dueTodayCount > 0) {
                String name = user.getName() != null && !user.getName().isEmpty() ? user.getName() : "Student";
                emailService.sendDailyReminderEmail(user.getEmail(), name, overdueCount, dueTodayCount);
            }
        }
        System.out.println("✅ [CRON WORKER] Dispatch Sweep Complete.");
    }
}
