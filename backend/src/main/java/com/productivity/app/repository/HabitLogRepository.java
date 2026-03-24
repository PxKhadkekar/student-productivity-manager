package com.productivity.app.repository;

import com.productivity.app.model.HabitLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface HabitLogRepository extends MongoRepository<HabitLog, String> {
    List<HabitLog> findByHabitId(String habitId);
    Optional<HabitLog> findByHabitIdAndDate(String habitId, LocalDate date);
}
