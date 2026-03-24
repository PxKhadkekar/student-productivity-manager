package com.productivity.app.controller;

import com.productivity.app.dto.HabitDTO;
import com.productivity.app.model.Habit;
import com.productivity.app.model.HabitLog;
import com.productivity.app.service.HabitService;
import com.productivity.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/habits")
public class HabitController {

    @Autowired
    private HabitService habitService;

    @Autowired
    private UserRepository userRepository;

    private String getCurrentUserId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Unauthorized")).getId();
    }

    @GetMapping
    public ResponseEntity<List<HabitDTO>> getUserHabits() {
        return ResponseEntity.ok(habitService.getUserHabits(getCurrentUserId()));
    }

    @PostMapping
    public ResponseEntity<Habit> createHabit(@RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        return ResponseEntity.ok(habitService.createHabit(getCurrentUserId(), name));
    }

    @PostMapping("/{id}/log")
    public ResponseEntity<HabitLog> logHabit(@PathVariable String id, @RequestBody Map<String, Object> payload) {
        LocalDate date = LocalDate.parse((String) payload.get("date"));
        boolean completed = (Boolean) payload.get("completed");
        return ResponseEntity.ok(habitService.logHabit(id, getCurrentUserId(), date, completed));
    }
}
