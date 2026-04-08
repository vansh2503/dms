import { AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * FormInput Component - Enhanced input with validation feedback
 * 
 * @param {string} label - Field label
 * @param {string} name - Field name
 * @param {string} type - Input type (default: 'text')
 * @param {Object} register - React Hook Form register
 * @param {string} error - Error message
 * @param {boolean} required - Required field
 * @param {string} placeholder - Placeholder text
 * @param {string} hint - Helper text
 * @param {boolean} showSuccess - Show success indicator when valid
 * @param {Object} rest - Additional props
 */
const FormInput = ({
  label,
  name,
  type = 'text',
  register,
  error,
  required = false,
  placeholder,
  hint,
  showSuccess = false,
  children,
  ...rest
}) => {
  const hasError = !!error;
  const isValid = showSuccess && !hasError && rest.value;

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span style={{ color: '#DC2626', marginLeft: 4 }}>*</span>}
        </label>
      )}
      
      <div style={{ position: 'relative' }}>
        {children ? (
          children
        ) : (
          <input
            id={name}
            type={type}
            placeholder={placeholder}
            className={`form-input${hasError ? ' is-invalid' : ''}${isValid ? ' is-valid' : ''}`}
            {...(register ? register(name) : {})}
            {...rest}
            style={{
              paddingRight: (hasError || isValid) ? '2.5rem' : undefined,
              ...rest.style
            }}
          />
        )}
        
        {hasError && (
          <AlertCircle
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 16,
              height: 16,
              color: '#DC2626',
              pointerEvents: 'none'
            }}
          />
        )}
        
        {isValid && (
          <CheckCircle2
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 16,
              height: 16,
              color: '#15803D',
              pointerEvents: 'none'
            }}
          />
        )}
      </div>

      {hint && !error && (
        <small style={{ display: 'block', marginTop: '0.25rem', fontSize: '0.75rem', color: '#6B7280' }}>
          {hint}
        </small>
      )}

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
          <AlertCircle style={{ width: 14, height: 14, color: '#DC2626', flexShrink: 0 }} />
          <small style={{ fontSize: '0.75rem', color: '#DC2626' }}>
            {error}
          </small>
        </div>
      )}
    </div>
  );
};

export default FormInput;
