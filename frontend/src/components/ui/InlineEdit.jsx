import { useState, useRef, useEffect } from 'react';
import { Check, X } from 'lucide-react';

/**
 * InlineEdit - Editable table cell component
 * 
 * @param {any} value - Current value
 * @param {function} onSave - Save handler (value) => Promise
 * @param {string} type - Input type: "text" | "number" | "select" | "date"
 * @param {Array} options - Options for select type: [{ value, label }]
 * @param {function} validator - Optional validation function
 * @param {function} formatter - Optional display formatter
 */
const InlineEdit = ({
  value,
  onSave,
  type = 'text',
  options = [],
  validator,
  formatter,
  placeholder = 'Click to edit'
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (type === 'text') {
        inputRef.current.select();
      }
    }
  }, [isEditing, type]);

  const handleSave = async () => {
    if (validator) {
      const validationError = validator(editValue);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    if (editValue === value) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      await onSave(editValue);
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setError('');
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && type !== 'textarea') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const displayValue = formatter ? formatter(value) : (value || placeholder);

  if (!isEditing) {
    return (
      <div
        onClick={() => setIsEditing(true)}
        style={{
          padding: '0.25rem 0.5rem',
          borderRadius: 4,
          cursor: 'pointer',
          transition: 'background-color 0.15s',
          minHeight: 24,
          display: 'flex',
          alignItems: 'center'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        title="Click to edit"
      >
        {displayValue}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', position: 'relative' }}>
      {type === 'select' ? (
        <select
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className="input-field"
          style={{ fontSize: '0.8125rem', padding: '0.25rem 0.5rem', minWidth: 120 }}
          disabled={isSaving}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          ref={inputRef}
          type={type}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className={`input-field ${error ? 'is-invalid' : ''}`}
          style={{ fontSize: '0.8125rem', padding: '0.25rem 0.5rem', minWidth: 120 }}
          disabled={isSaving}
        />
      )}
      
      <div style={{ display: 'flex', gap: '0.125rem' }}>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="btn btn-icon btn-sm"
          style={{ padding: '0.25rem', width: 24, height: 24 }}
          title="Save"
        >
          {isSaving ? (
            <div className="spinner spinner-sm" />
          ) : (
            <Check style={{ width: 12, height: 12, color: '#15803D' }} />
          )}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={isSaving}
          className="btn btn-icon btn-sm"
          style={{ padding: '0.25rem', width: 24, height: 24 }}
          title="Cancel"
        >
          <X style={{ width: 12, height: 12, color: '#DC2626' }} />
        </button>
      </div>
      
      {error && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          marginTop: 2,
          fontSize: '0.75rem',
          color: '#DC2626',
          whiteSpace: 'nowrap',
          backgroundColor: '#FEF2F2',
          padding: '0.25rem 0.5rem',
          borderRadius: 4,
          zIndex: 10
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default InlineEdit;
