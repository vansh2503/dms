/**
 * FormField Component - Enhanced form field with validation
 * 
 * Props:
 *   label: string
 *   name: string
 *   type: string (default: 'text')
 *   required: boolean
 *   error: string (error message)
 *   hint: string (helper text)
 *   register: react-hook-form register function
 *   className: string
 *   ...rest: other input props
 */
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const FormField = ({
  label,
  name,
  type = 'text',
  required = false,
  error,
  hint,
  success,
  register,
  className = '',
  children,
  ...rest
}) => {
  const inputClassName = `input-field ${error ? 'is-invalid' : ''} ${className}`.trim();

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
      )}
      
      {children || (
        <input
          id={name}
          type={type}
          className={inputClassName}
          {...(register ? register(name) : {})}
          {...rest}
        />
      )}
      
      {error && (
        <div className="form-error">
          <AlertCircle className="form-error-icon" />
          <span>{error}</span>
        </div>
      )}
      
      {success && !error && (
        <div className="form-success">
          <CheckCircle2 className="form-success-icon" />
          <span>{success}</span>
        </div>
      )}
      
      {hint && !error && !success && (
        <div className="form-hint">{hint}</div>
      )}
    </div>
  );
};

export default FormField;
