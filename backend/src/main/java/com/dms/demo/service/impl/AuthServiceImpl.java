package com.dms.demo.service.impl;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dms.demo.dto.request.LoginRequest;
import com.dms.demo.dto.request.RegisterRequest;
import com.dms.demo.dto.response.AuthResponse;
import com.dms.demo.entity.User;
import com.dms.demo.enums.UserRole;
import com.dms.demo.exception.BadRequestException;
import com.dms.demo.repository.UserRepository;
import com.dms.demo.security.jwt.JwtTokenProvider;
import com.dms.demo.service.AuthService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Override
    public AuthResponse login(LoginRequest request) {
        // Find user by email or username
        String input = request.getUsernameOrEmail();
        User user = userRepository.findByEmail(input)
                .orElseGet(() -> userRepository.findByUsername(input)
                        .orElseThrow(() -> new BadRequestException("Invalid username/email or password")));
        
        // Check if user is active
        if (!user.getIsActive()) {
            log.warn("Login failed - user account is inactive: {}", user.getUsername());
            throw new BadRequestException("Account is inactive. Please contact administrator.");
        }
        
        String resolvedUsername = user.getUsername();
        
        // Authenticate user with credentials
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(resolvedUsername, request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        // Generate JWT token with user role embedded
        String token = tokenProvider.generateToken(authentication);

        log.info("Login successful for user: {}, role: {}", resolvedUsername, user.getRole());
        
        // Return authentication response with user details and role
        return new AuthResponse(
                token, 
                user.getUsername(), 
                user.getRole().name(),
                user.getUserId(),
                user.getDealership() != null ? user.getDealership().getDealershipId() : null,
                user.getFullName()
        );
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Registration attempt for email: {}", request.getEmail());
        
        String username = (request.getUsername() != null && !request.getUsername().isBlank())
                ? request.getUsername()
                : request.getEmail().split("@")[0];

        if (userRepository.existsByUsername(username)) {
            username = username + "_" + System.currentTimeMillis() % 10000;
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Registration failed - email already exists: {}", request.getEmail());
            throw new BadRequestException("Email already exists");
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setRole(request.getRole() != null ? request.getRole() : UserRole.SALES_EXECUTIVE);
        user.setIsActive(true);

        userRepository.save(user);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, request.getPassword())
        );

        String token = tokenProvider.generateToken(authentication);

        log.info("Registration successful for user: {}, role: {}", username, user.getRole());
        return new AuthResponse(token, user.getUsername(), user.getRole().name(),
                user.getUserId(),
                user.getDealership() != null ? user.getDealership().getDealershipId() : null,
                user.getFullName());
    }
}
