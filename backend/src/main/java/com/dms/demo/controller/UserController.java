package com.dms.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dms.demo.dto.request.ChangePasswordRequest;
import com.dms.demo.dto.response.ApiResponse;
import com.dms.demo.dto.request.RegisterRequest;
import com.dms.demo.dto.response.UserResponse;
import com.dms.demo.entity.User;
import com.dms.demo.service.UserService;
import com.dms.demo.service.AuditService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final AuditService auditService;

    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> create(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(userService.createUser(request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserById(id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(userService.getAllUsers()));
    }
    
    @GetMapping("/dropdown")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getUsersForDropdown(
            @org.springframework.web.bind.annotation.RequestParam(required = false) Long dealershipId,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String role) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUsersForDropdown(dealershipId, role)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> update(@PathVariable Long id, @Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(ApiResponse.success(userService.updateUser(id, request)));
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<ApiResponse<UserResponse>> toggleStatus(@PathVariable Long id) {
        UserResponse response = userService.toggleUserStatus(id);
        auditService.log("TOGGLE_USER_STATUS", "Admin", "Toggled status for User ID: " + id + " to " + (response.getIsActive() ? "ACTIVE" : "INACTIVE"));
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @PathVariable Long id,
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication) {
        
        // Get current logged-in user
        User currentUser = (User) authentication.getPrincipal();
        
        // Users can only change their own password (unless they're SUPER_ADMIN)
        if (!currentUser.getUserId().equals(id) && 
            !currentUser.getRole().name().equals("SUPER_ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("You can only change your own password", "FORBIDDEN"));
        }
        
        userService.changePassword(id, request);
        auditService.log("CHANGE_PASSWORD", currentUser.getUsername(), "Password changed for User ID: " + id);
        
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully"));
    }
}