package com.productivity.app.repository;

import com.productivity.app.model.Habit;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HabitRepository extends MongoRepository<Habit, String> {
    List<Habit> findByUserId(String userId);
    Optional<Habit> findByIdAndUserId(String id, String userId);
}
