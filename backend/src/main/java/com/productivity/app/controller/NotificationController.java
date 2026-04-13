package com.productivity.app.controller;

import com.productivity.app.service.NotificationScheduler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationScheduler notificationScheduler;

    @GetMapping("/trigger-daily-emails")
    public ResponseEntity<?> forceTriggerDailyDigest() {
        notificationScheduler.processDailyNotifications();
        return ResponseEntity.ok(Map.of(
            "message", "Cron Job manually bypassed.",
            "status", "Email Digest Sweep Complete"
        ));
    }
}
