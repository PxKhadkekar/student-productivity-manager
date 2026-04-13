package com.productivity.app.controller;

import com.productivity.app.dto.AuthRequest;
import com.productivity.app.dto.AuthResponse;
import com.productivity.app.model.User;
import com.productivity.app.security.JwtUtil;
import com.productivity.app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.UUID;
import java.util.Optional;
import com.productivity.app.model.PasswordResetToken;
import com.productivity.app.repository.PasswordResetTokenRepository;
import com.productivity.app.service.EmailService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User registeredUser = userService.registerUser(user);
            String token = jwtUtil.generateToken(registeredUser.getEmail());
            return ResponseEntity.ok(new AuthResponse(token, registeredUser.getId(), registeredUser.getName(), registeredUser.getEmail()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody AuthRequest authRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
            );
            User user = userService.findByEmail(authRequest.getEmail()).orElseThrow();
            String token = jwtUtil.generateToken(user.getEmail());
            return ResponseEntity.ok(new AuthResponse(token, user.getId(), user.getName(), user.getEmail()));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        Optional<User> userOpt = userService.findByEmail(email);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Delete any existing tokens for this user
            tokenRepository.deleteByUserId(user.getId());
            
            String token = UUID.randomUUID().toString();
            PasswordResetToken resetToken = new PasswordResetToken(token, user.getId());
            tokenRepository.save(resetToken);
            
            emailService.sendPasswordResetEmail(user.getEmail(), token);
        }
        
        // Always return OK to prevent email enumeration attacks
        return ResponseEntity.ok().body("If an account with that email exists, a reset link has been deployed.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");
        
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(token);
        
        if (tokenOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid or missing token.");
        }
        
        PasswordResetToken resetToken = tokenOpt.get();
        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            return ResponseEntity.badRequest().body("Token has expired. Please request a new one.");
        }
        
        Optional<User> userOpt = userService.findById(resetToken.getUserId());
        if (userOpt.isPresent()) {
            userService.updatePassword(userOpt.get(), newPassword);
            tokenRepository.delete(resetToken);
            return ResponseEntity.ok().body("Password successfully reset");
        }
        return ResponseEntity.badRequest().body("User not found.");
    }
}
