package com.dms.demo.dto.request;

import com.dms.demo.enums.CustomerType;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CustomerRequest {
    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "First name must contain only letters and spaces")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "Last name must contain only letters and spaces")
    private String lastName;
    
    @Email(message = "Email must be valid")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;
    
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Phone number must be a valid 10-digit Indian mobile number")
    private String phone;
    
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Alternate phone must be a valid 10-digit Indian mobile number")
    private String alternatePhone;
    
    @Size(max = 500, message = "Address must not exceed 500 characters")
    private String address;
    
    @Size(max = 50, message = "City must not exceed 50 characters")
    private String city;
    
    @Size(max = 50, message = "State must not exceed 50 characters")
    private String state;
    
    @Pattern(regexp = "^\\d{6}$", message = "Pincode must be a valid 6-digit number")
    private String pincode;
    
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;
    
    @PastOrPresent(message = "Anniversary date cannot be in the future")
    private LocalDate anniversaryDate;
    
    @Pattern(regexp = "^[A-Z]{5}\\d{4}[A-Z]$", message = "PAN number must be in format: ABCDE1234F")
    private String panNumber;
    
    @Pattern(regexp = "^\\d{12}$", message = "Aadhar number must be a 12-digit number")
    private String aadharNumber;
    
    @Size(max = 20, message = "Driving license must not exceed 20 characters")
    private String drivingLicense;
    
    @NotNull(message = "Customer type is required")
    private CustomerType customerType;
    
    @Min(value = 0, message = "Loyalty points cannot be negative")
    private Integer loyaltyPoints;
    
    @Size(max = 100, message = "Referred by must not exceed 100 characters")
    private String referredBy;
    
    @Size(max = 1000, message = "Notes must not exceed 1000 characters")
    private String notes;
}
