package com.dms.demo.service;

import com.dms.demo.dto.request.ChangePasswordRequest;
import com.dms.demo.dto.request.RegisterRequest;
import com.dms.demo.dto.response.UserResponse;
import java.util.List;

public interface UserService {
    UserResponse createUser(RegisterRequest request);
    UserResponse getUserById(Long id);
    List<UserResponse> getAllUsers();
    UserResponse updateUser(Long id, RegisterRequest request);
    UserResponse toggleUserStatus(Long id);
    void deleteUser(Long id);
    List<UserResponse> getUsersForDropdown(Long dealershipId, String role);
    void changePassword(Long userId, ChangePasswordRequest request);
}
