package com.productivity.app.service;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        String resetUrl = "http://localhost:3000/reset-password?token=" + resetToken;

        System.out.println("\n\n=======================================================");
        System.out.println("💌 [MOCK EMAIL SERVICE] Preparing to send recovery logic...");
        System.out.println("=======================================================");
        System.out.println("TO: " + toEmail);
        System.out.println("SUBJECT: Reset Your Password - Productivity App");
        System.out.println("-------------------------------------------------------");
        System.out.println("Hello,");
        System.out.println("");
        System.out.println("We received a request to reset your password.");
        System.out.println("Click the link below to securely create a new password:");
        System.out.println("");
        System.out.println(">> " + resetUrl);
        System.out.println("");
        System.out.println("If you did not request a password reset, please ignore this email.");
        System.out.println("This link will expire in exactly 15 minutes.");
        System.out.println("=======================================================\n\n");
    }

    public void sendDailyReminderEmail(String toEmail, String userName, int overdueCount, int dueTodayCount) {
        System.out.println("\n\n=======================================================");
        System.out.println("📬 [MOCK EMAIL SERVICE] Preparing Daily Digest...");
        System.out.println("=======================================================");
        System.out.println("TO: " + toEmail);
        System.out.println("SUBJECT: Your Daily Plan - " + java.time.LocalDate.now().toString());
        System.out.println("-------------------------------------------------------");
        System.out.println("Good morning " + userName + ",");
        System.out.println("");
        System.out.println("Here is a quick breakdown of exactly what requires your");
        System.out.println("attention today:");
        System.out.println("");
        System.out.println("🔥 Overdue Tasks: " + overdueCount);
        System.out.println("⚡ Due Today: " + dueTodayCount);
        System.out.println("");
        System.out.println("Head over to your Daily Planner module to tackle them!");
        System.out.println(">> http://localhost:3000/planner");
        System.out.println("");
        System.out.println("Have a highly productive day!");
        System.out.println("=======================================================\n\n");
    }
}
