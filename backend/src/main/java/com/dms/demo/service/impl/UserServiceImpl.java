package com.dms.demo.service.impl;

import com.dms.demo.dto.request.RegisterRequest;
import com.dms.demo.dto.response.UserResponse;
import com.dms.demo.entity.Dealership;
import com.dms.demo.entity.User;
import com.dms.demo.enums.UserRole;
import com.dms.demo.exception.BadRequestException;
import com.dms.demo.exception.ResourceNotFoundException;
import com.dms.demo.repository.DealershipRepository;
import com.dms.demo.repository.UserRepository;
import com.dms.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final DealershipRepository dealershipRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserResponse createUser(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }
        User user = new User();
        mapToEntity(request, user, true);
        return mapToResponse(userRepository.save(user));
    }

    @Override
    public UserResponse getUserById(Long id) {
        return mapToResponse(findById(id));
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserResponse updateUser(Long id, RegisterRequest request) {
        User user = findById(id);
        if (!user.getUsername().equals(request.getUsername()) && userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already taken");
        }
        if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }
        mapToEntity(request, user, request.getPassword() != null && !request.getPassword().isBlank());
        return mapToResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public UserResponse toggleUserStatus(Long id) {
        User user = findById(id);
        user.setIsActive(!user.getIsActive());
        return mapToResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        User user = findById(id);
        // Soft delete - preserve data integrity by marking as inactive
        user.setIsActive(false);
        userRepository.save(user);
    }
    
    @Override
    public List<UserResponse> getUsersForDropdown(Long dealershipId, String roleStr) {
        List<User> users;
        
        if (dealershipId != null && roleStr != null && !roleStr.isBlank()) {
            UserRole role = UserRole.valueOf(roleStr.toUpperCase());
            users = userRepository.findByDealershipDealershipIdAndRoleAndIsActiveTrue(dealershipId, role);
        } else if (dealershipId != null) {
            users = userRepository.findByDealershipDealershipIdAndIsActiveTrue(dealershipId);
        } else if (roleStr != null && !roleStr.isBlank()) {
            UserRole role = UserRole.valueOf(roleStr.toUpperCase());
            users = userRepository.findByRoleAndIsActiveTrue(role);
        } else {
            users = userRepository.findByIsActiveTrue();
        }
        
        return users.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void changePassword(Long userId, com.dms.demo.dto.request.ChangePasswordRequest request) {
        // Validate that new password and confirm password match
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new com.dms.demo.exception.InvalidPasswordException("New password and confirm password do not match");
        }

        // Find user
        User user = findById(userId);

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new com.dms.demo.exception.InvalidPasswordException("Current password is incorrect");
        }

        // Check if new password is same as current password
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new com.dms.demo.exception.InvalidPasswordException("New password must be different from current password");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    private void mapToEntity(RegisterRequest request, User user, boolean encodePassword) {
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setRole(request.getRole() != null ? request.getRole() : UserRole.SALES_EXECUTIVE);
        if (encodePassword) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getDealershipId() != null) {
            Dealership dealership = dealershipRepository.findById(request.getDealershipId())
                    .orElseThrow(() -> new ResourceNotFoundException("Dealership not found"));
            user.setDealership(dealership);
        }
    }

    private UserResponse mapToResponse(User user) {
        UserResponse response = new UserResponse();
        response.setUserId(user.getUserId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setPhone(user.getPhone());
        response.setRole(user.getRole().name());
        response.setDealershipId(user.getDealership() != null ? user.getDealership().getDealershipId() : null);
        response.setIsActive(user.getIsActive());
        return response;
    }
}
