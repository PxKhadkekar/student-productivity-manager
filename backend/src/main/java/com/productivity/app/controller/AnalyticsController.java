package com.productivity.app.controller;

import com.productivity.app.dto.InsightDTO;
import com.productivity.app.service.AnalyticsService;
import com.productivity.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private UserRepository userRepository;

    private String getCurrentUserId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Unauthorized")).getId();
    }

    @GetMapping("/insights")
    public ResponseEntity<InsightDTO> getInsights() {
        return ResponseEntity.ok(analyticsService.getInsights(getCurrentUserId()));
    }
}
