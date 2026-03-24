package com.productivity.app.service;

import com.productivity.app.dto.HabitDTO;
import com.productivity.app.dto.HabitLogDTO;
import com.productivity.app.model.Habit;
import com.productivity.app.model.HabitLog;
import com.productivity.app.repository.HabitLogRepository;
import com.productivity.app.repository.HabitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class HabitService {
    @Autowired
    private HabitRepository habitRepository;
    
    @Autowired
    private HabitLogRepository habitLogRepository;

    public Habit createHabit(String userId, String name) {
        return habitRepository.save(new Habit(userId, name));
    }

    public List<HabitDTO> getUserHabits(String userId) {
        List<Habit> habits = habitRepository.findByUserId(userId);
        return habits.stream().map(this::buildHabitDTO).collect(Collectors.toList());
    }

    public HabitLog logHabit(String habitId, String userId, LocalDate date, boolean completed) {
        Optional<Habit> habitOpt = habitRepository.findByIdAndUserId(habitId, userId);
        if (habitOpt.isEmpty()) {
            throw new RuntimeException("Habit not found");
        }
        
        Optional<HabitLog> logOpt = habitLogRepository.findByHabitIdAndDate(habitId, date);
        HabitLog log;
        if (logOpt.isPresent()) {
            log = logOpt.get();
            log.setCompleted(completed);
        } else {
            log = new HabitLog(habitId, date, completed);
        }
        return habitLogRepository.save(log);
    }

    private HabitDTO buildHabitDTO(Habit h) {
        List<HabitLog> logs = habitLogRepository.findByHabitId(h.getId());
        
        logs.sort((a, b) -> b.getDate().compareTo(a.getDate()));
        
        int currentStreak = 0;
        int longestStreak = 0;
        
        LocalDate today = LocalDate.now();
        LocalDate checkDate = today;
        
        Set<LocalDate> completedDates = logs.stream()
            .filter(HabitLog::isCompleted)
            .map(HabitLog::getDate)
            .collect(Collectors.toSet());
            
        if (completedDates.contains(today)) {
            checkDate = today;
        } else if (completedDates.contains(today.minusDays(1))) {
            checkDate = today.minusDays(1);
        } else {
            checkDate = null;
        }
        
        if (checkDate != null) {
            while (completedDates.contains(checkDate)) {
                currentStreak++;
                checkDate = checkDate.minusDays(1);
            }
        }
        
        List<LocalDate> sortedCompleted = new ArrayList<>(completedDates);
        Collections.sort(sortedCompleted);
        
        if (!sortedCompleted.isEmpty()) {
            int tempStreak = 1;
            longestStreak = 1;
            for (int i = 1; i < sortedCompleted.size(); i++) {
                if (sortedCompleted.get(i).minusDays(1).equals(sortedCompleted.get(i-1))) {
                    tempStreak++;
                    longestStreak = Math.max(longestStreak, tempStreak);
                } else {
                    tempStreak = 1;
                }
            }
        }

        List<HabitLogDTO> logDTOs = logs.stream()
            .map(l -> new HabitLogDTO(l.getDate(), l.isCompleted()))
            .collect(Collectors.toList());

        return new HabitDTO(h.getId(), h.getName(), h.getCreatedAt(), currentStreak, longestStreak, logDTOs);
    }
}
