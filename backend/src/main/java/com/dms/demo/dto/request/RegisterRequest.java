package com.dms.demo.dto.request;

import com.dms.demo.enums.UserRole;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    // Optional: auto-derived from email if not provided
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z0-9._@-]+$", message = "Username can only contain letters, numbers, dots, underscores, hyphens, and @ symbols")
    private String username;
    
    // Password is optional on update, required only on create (validated in service layer)
    @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$", message = "Password must contain at least one uppercase letter, one lowercase letter, and one number")
    private String password;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;
    
    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;
    
    @Pattern(regexp = "^(\\+91)?0?[6-9]\\d{9}$", message = "Phone must be a valid 10-digit Indian mobile number (optionally prefixed with +91 or 0)")
    private String phone;
    
    private UserRole role;
    
    // Optional: can be null for users not associated with a dealership
    private Long dealershipId;
}
