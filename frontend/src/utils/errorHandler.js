/**
 * Error Handler Utility
 * Maps backend errors to user-friendly messages
 */

export const getErrorMessage = (error) => {
  // Network errors
  if (!error.response) {
    return 'Network error. Please check your connection and try again.';
  }

  const { status, data } = error.response;

  // Extract message from response
  const backendMessage = data?.message || data?.error || '';

  // Map common HTTP status codes
  switch (status) {
    case 400:
      return backendMessage || 'Invalid request. Please check your input and try again.';
    
    case 401:
      return 'Your session has expired. Please log in again.';
    
    case 403:
      return 'You don\'t have permission to perform this action.';
    
    case 404:
      return backendMessage || 'The requested resource was not found.';
    
    case 409:
      return backendMessage || 'This action conflicts with existing data.';
    
    case 422:
      return backendMessage || 'Validation failed. Please check your input.';
    
    case 500:
      return 'Server error. Please try again later or contact support.';
    
    case 503:
      return 'Service temporarily unavailable. Please try again later.';
    
    default:
      return backendMessage || 'An unexpected error occurred. Please try again.';
  }
};

/**
 * Extract field-specific validation errors from backend response
 * @param {Object} error - Axios error object
 * @returns {Object} - Field errors object { fieldName: errorMessage }
 */
export const getFieldErrors = (error) => {
  if (!error.response?.data) return {};

  const { data } = error.response;

  // Handle Spring Boot validation errors
  if (data.errors && Array.isArray(data.errors)) {
    return data.errors.reduce((acc, err) => {
      if (err.field) {
        acc[err.field] = err.message || err.defaultMessage;
      }
      return acc;
    }, {});
  }

  // Handle custom field errors
  if (data.fieldErrors) {
    return data.fieldErrors;
  }

  return {};
};

/**
 * Check if error is a validation error
 */
export const isValidationError = (error) => {
  return error.response?.status === 400 || error.response?.status === 422;
};

/**
 * Check if error is an authentication error
 */
export const isAuthError = (error) => {
  return error.response?.status === 401;
};

/**
 * Check if error is a permission error
 */
export const isPermissionError = (error) => {
  return error.response?.status === 403;
};
