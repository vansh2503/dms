# Change Password Feature - Implementation Guide

## 📋 Overview
A secure password change feature has been implemented for the Hyundai DMS project, allowing users to update their passwords with proper validation and security measures.

---

## 🔐 Security Features

### Backend Security:
- ✅ **Password Hashing:** Uses BCrypt for secure password storage
- ✅ **Current Password Verification:** Validates existing password before allowing change
- ✅ **Password Strength Validation:** Enforces strong password requirements
- ✅ **Authorization Check:** Users can only change their own password (unless SUPER_ADMIN)
- ✅ **Audit Logging:** All password changes are logged for security tracking

### Frontend Security:
- ✅ **Client-side Validation:** Real-time password strength feedback
- ✅ **Password Visibility Toggle:** Secure input with show/hide option
- ✅ **Confirmation Matching:** Ensures new password is entered correctly
- ✅ **Error Handling:** Clear, user-friendly error messages

---

## 🛠️ Backend Implementation

### 1. **DTO - ChangePasswordRequest.java**
Location: `backend/src/main/java/com/dms/demo/dto/request/ChangePasswordRequest.java`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordRequest {
    @NotBlank(message = "Current password is required")
    private String currentPassword;

    @NotBlank(message = "New password is required")
    @Size(min = 8, max = 50, message = "New password must be between 8 and 50 characters")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$",
        message = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    private String newPassword;

    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;
}
```

**Validation Rules:**
- Current password: Required
- New password: 8-50 characters, must contain:
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character (@$!%*?&#)
- Confirm password: Must match new password

---

### 2. **Exception - InvalidPasswordException.java**
Location: `backend/src/main/java/com/dms/demo/exception/InvalidPasswordException.java`

```java
public class InvalidPasswordException extends RuntimeException {
    public InvalidPasswordException(String message) {
        super(message);
    }
}
```

---

### 3. **Exception Handler - GlobalExceptionHandler.java**
Added handler for `InvalidPasswordException`:

```java
@ExceptionHandler(InvalidPasswordException.class)
public ResponseEntity<ApiResponse<Object>> handleInvalidPassword(InvalidPasswordException ex) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(ApiResponse.error(ex.getMessage(), "INVALID_PASSWORD"));
}
```

---

### 4. **Service Interface - UserService.java**
Added method signature:

```java
void changePassword(Long userId, ChangePasswordRequest request);
```

---

### 5. **Service Implementation - UserServiceImpl.java**
Location: `backend/src/main/java/com/dms/demo/service/impl/UserServiceImpl.java`

```java
@Override
@Transactional
public void changePassword(Long userId, ChangePasswordRequest request) {
    // Validate that new password and confirm password match
    if (!request.getNewPassword().equals(request.getConfirmPassword())) {
        throw new InvalidPasswordException("New password and confirm password do not match");
    }

    // Find user
    User user = findById(userId);

    // Verify current password
    if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
        throw new InvalidPasswordException("Current password is incorrect");
    }

    // Check if new password is same as current password
    if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
        throw new InvalidPasswordException("New password must be different from current password");
    }

    // Update password
    user.setPassword(passwordEncoder.encode(request.getNewPassword()));
    userRepository.save(user);
}
```

**Business Logic:**
1. Validates new password matches confirmation
2. Verifies current password is correct
3. Ensures new password is different from current
4. Hashes and saves new password

---

### 6. **Controller - UserController.java**
Location: `backend/src/main/java/com/dms/demo/controller/UserController.java`

```java
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
```

**API Endpoint:**
- **URL:** `POST /api/users/{id}/change-password`
- **Auth:** Required (JWT Bearer Token)
- **Authorization:** User can only change their own password (SUPER_ADMIN can change any)
- **Request Body:**
  ```json
  {
    "currentPassword": "OldPass@123",
    "newPassword": "NewPass@456",
    "confirmPassword": "NewPass@456"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "success": true,
    "message": "Password changed successfully",
    "data": "Password changed successfully"
  }
  ```
- **Error Responses:**
  - **400 Bad Request:** Validation errors or incorrect current password
  - **403 Forbidden:** Attempting to change another user's password
  - **404 Not Found:** User not found

---

## 🎨 Frontend Implementation

### 1. **Component - ChangePasswordModal.jsx**
Location: `frontend/src/components/auth/ChangePasswordModal.jsx`

**Features:**
- ✅ Three password fields with show/hide toggle
- ✅ Real-time password strength indicator
- ✅ Visual feedback for password requirements
- ✅ Form validation with react-hook-form
- ✅ Success/error message display
- ✅ Loading state during submission
- ✅ Responsive design

**Password Requirements Display:**
```
Password must contain:
● At least 8 characters
● One lowercase letter
● One uppercase letter
● One number
● One special character (@$!%*?&#)
```

**Props:**
- `userId` - ID of the user changing password
- `onSuccess` - Callback function on successful password change
- `onCancel` - Callback function to close modal

---

### 2. **Integration - Sidebar.jsx**
Location: `frontend/src/components/Sidebar.jsx`

**Changes:**
- Added "Change Password" button in sidebar footer
- Integrated ChangePasswordModal component
- Added KeyRound icon from lucide-react

**UI Location:**
```
Sidebar Footer:
├── User Profile Info
├── 🔑 Change Password (NEW)
└── 🚪 Sign Out
```

---

## 📝 Usage Instructions

### For End Users:

1. **Access Change Password:**
   - Click on "Change Password" button in the sidebar (bottom section)

2. **Fill the Form:**
   - Enter your current password
   - Enter your new password (must meet requirements)
   - Confirm your new password

3. **Submit:**
   - Click "Change Password" button
   - Wait for confirmation message
   - Modal will close automatically on success

4. **Password Requirements:**
   - Minimum 8 characters
   - At least one uppercase letter (A-Z)
   - At least one lowercase letter (a-z)
   - At least one number (0-9)
   - At least one special character (@$!%*?&#)

---

## 🧪 Testing Guide

### Backend Testing:

#### Test Case 1: Successful Password Change
```bash
POST /api/users/1/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "Admin@123",
  "newPassword": "NewAdmin@456",
  "confirmPassword": "NewAdmin@456"
}

Expected: 200 OK with success message
```

#### Test Case 2: Incorrect Current Password
```bash
{
  "currentPassword": "WrongPassword",
  "newPassword": "NewAdmin@456",
  "confirmPassword": "NewAdmin@456"
}

Expected: 400 Bad Request
Error: "Current password is incorrect"
```

#### Test Case 3: Password Mismatch
```bash
{
  "currentPassword": "Admin@123",
  "newPassword": "NewAdmin@456",
  "confirmPassword": "DifferentPass@789"
}

Expected: 400 Bad Request
Error: "New password and confirm password do not match"
```

#### Test Case 4: Weak Password
```bash
{
  "currentPassword": "Admin@123",
  "newPassword": "weak",
  "confirmPassword": "weak"
}

Expected: 400 Bad Request
Error: Validation error about password requirements
```

#### Test Case 5: Same as Current Password
```bash
{
  "currentPassword": "Admin@123",
  "newPassword": "Admin@123",
  "confirmPassword": "Admin@123"
}

Expected: 400 Bad Request
Error: "New password must be different from current password"
```

#### Test Case 6: Unauthorized Access
```bash
POST /api/users/2/change-password
Authorization: Bearer <user1_token>

Expected: 403 Forbidden
Error: "You can only change your own password"
```

---

### Frontend Testing:

1. **UI Rendering:**
   - ✅ Modal opens when clicking "Change Password"
   - ✅ All three password fields are visible
   - ✅ Show/hide password toggles work
   - ✅ Password requirements are displayed

2. **Validation:**
   - ✅ Required field validation
   - ✅ Password strength validation
   - ✅ Confirm password matching
   - ✅ Real-time feedback on requirements

3. **API Integration:**
   - ✅ Successful password change shows success message
   - ✅ Incorrect current password shows error
   - ✅ Network errors are handled gracefully
   - ✅ Loading state during submission

4. **User Experience:**
   - ✅ Form resets after successful change
   - ✅ Modal closes automatically on success
   - ✅ Cancel button works correctly
   - ✅ Responsive on mobile devices

---

## 🔒 Security Considerations

### Implemented:
✅ Password hashing with BCrypt (cost factor 10)
✅ Current password verification before change
✅ Strong password policy enforcement
✅ Authorization checks (users can only change own password)
✅ Audit logging for all password changes
✅ No plain text password storage
✅ Secure password transmission (HTTPS recommended)
✅ Protection against password reuse (same as current)

### Recommended Enhancements:
- 🔄 Password history (prevent reusing last N passwords)
- 🔄 Rate limiting on password change attempts
- 🔄 Email notification on password change
- 🔄 Two-factor authentication requirement
- 🔄 Password expiry policy
- 🔄 Account lockout after failed attempts

---

## 📊 API Documentation

### Endpoint: Change Password

**URL:** `POST /api/users/{id}/change-password`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | Long | Yes | User ID |

**Request Body:**
```json
{
  "currentPassword": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}
```

**Validation Rules:**
| Field | Rules |
|-------|-------|
| currentPassword | Required, not blank |
| newPassword | Required, 8-50 chars, must contain uppercase, lowercase, number, special char |
| confirmPassword | Required, must match newPassword |

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": "Password changed successfully",
  "timestamp": "2026-04-15T10:30:00Z"
}
```

**Error Responses:**

**400 Bad Request - Validation Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "error": "VALIDATION_ERROR",
  "data": {
    "newPassword": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  },
  "timestamp": "2026-04-15T10:30:00Z"
}
```

**400 Bad Request - Incorrect Current Password:**
```json
{
  "success": false,
  "message": "Current password is incorrect",
  "error": "INVALID_PASSWORD",
  "timestamp": "2026-04-15T10:30:00Z"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "You can only change your own password",
  "error": "FORBIDDEN",
  "timestamp": "2026-04-15T10:30:00Z"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "User not found with id: 999",
  "error": "RESOURCE_NOT_FOUND",
  "timestamp": "2026-04-15T10:30:00Z"
}
```

---

## 🎯 Summary

### What Was Implemented:

**Backend (Spring Boot):**
- ✅ ChangePasswordRequest DTO with validation
- ✅ InvalidPasswordException custom exception
- ✅ Exception handler for password errors
- ✅ UserService.changePassword() method
- ✅ UserController endpoint with authorization
- ✅ Audit logging integration
- ✅ BCrypt password hashing

**Frontend (React):**
- ✅ ChangePasswordModal component
- ✅ Password strength indicator
- ✅ Real-time validation feedback
- ✅ Show/hide password toggles
- ✅ Success/error message handling
- ✅ Integration with Sidebar
- ✅ Responsive design

### Files Created/Modified:

**Backend:**
1. ✅ `ChangePasswordRequest.java` (NEW)
2. ✅ `InvalidPasswordException.java` (NEW)
3. ✅ `GlobalExceptionHandler.java` (MODIFIED)
4. ✅ `UserService.java` (MODIFIED)
5. ✅ `UserServiceImpl.java` (MODIFIED)
6. ✅ `UserController.java` (MODIFIED)

**Frontend:**
1. ✅ `ChangePasswordModal.jsx` (NEW)
2. ✅ `Sidebar.jsx` (MODIFIED)

---

## 🚀 Deployment Notes

1. **Database:** No schema changes required
2. **Environment:** No new environment variables needed
3. **Dependencies:** No new dependencies added
4. **Testing:** Test all scenarios before production deployment
5. **Documentation:** Update API documentation with new endpoint

---

**Feature Status:** ✅ **COMPLETE AND READY FOR TESTING**

**Implemented By:** Kiro AI  
**Date:** April 15, 2026  
**Version:** 1.0
