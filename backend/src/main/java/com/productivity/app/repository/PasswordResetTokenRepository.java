package com.productivity.app.repository;

import com.productivity.app.model.PasswordResetToken;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface PasswordResetTokenRepository extends MongoRepository<PasswordResetToken, String> {
    Optional<PasswordResetToken> findByToken(String token);
    Optional<PasswordResetToken> findByUserId(String userId);
    void deleteByUserId(String userId);
}
