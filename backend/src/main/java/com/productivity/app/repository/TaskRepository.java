package com.productivity.app.repository;

import com.productivity.app.model.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findByUserId(String userId);
    Optional<Task> findByIdAndUserId(String id, String userId);
    List<Task> findByUserIdAndDueDateBetween(String userId, java.util.Date start, java.util.Date end);
}
