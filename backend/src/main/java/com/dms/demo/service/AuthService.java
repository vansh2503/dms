package com.dms.demo.service;

import com.dms.demo.dto.request.LoginRequest;
import com.dms.demo.dto.request.RegisterRequest;
import com.dms.demo.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    AuthResponse register(RegisterRequest request);
}
