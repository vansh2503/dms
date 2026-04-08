import { useState, useRef } from 'react';
import { Upload, X, FileText, Image as ImageIcon, AlertCircle } from 'lucide-react';

/**
 * FileUpload Component - Reusable drag-and-drop file upload
 * 
 * @param {string} label - Field label
 * @param {string} name - Field name
 * @param {function} onChange - Callback when files change: (files) => void
 * @param {string[]} accept - Accepted file types (e.g., ['image/jpeg', 'image/png', 'application/pdf'])
 * @param {number} maxSize - Max file size in MB (default: 5)
 * @param {boolean} multiple - Allow multiple files (default: false)
 * @param {string} error - Error message
 * @param {boolean} required - Required field
 * @param {string} hint - Helper text
 */
const FileUpload = ({
  label,
  name,
  onChange,
  accept = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
  maxSize = 5,
  multiple = false,
  error,
  required = false,
  hint
}) => {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const inputRef = useRef(null);

  const validateFile = (file) => {
    // Check file type
    if (!accept.includes(file.type)) {
      return `Invalid file type. Accepted: ${accept.map(t => t.split('/')[1]).join(', ')}`;
    }
    
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      return `File size exceeds ${maxSize}MB`;
    }
    
    return null;
  };

  const handleFiles = (newFiles) => {
    setUploadError('');
    const fileArray = Array.from(newFiles);
    
    // Validate each file
    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        setUploadError(error);
        return;
      }
    }
    
    // Handle multiple vs single file
    const updatedFiles = multiple ? [...files, ...fileArray] : fileArray;
    setFiles(updatedFiles);
    onChange?.(updatedFiles);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onChange?.(updatedFiles);
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon style={{ width: 16, height: 16 }} />;
    }
    return <FileText style={{ width: 16, height: 16 }} />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label}
          {required && <span style={{ color: '#DC2626', marginLeft: 4 }}>*</span>}
        </label>
      )}
      
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragActive ? '#1D4ED8' : error || uploadError ? '#DC2626' : '#D1D5DB'}`,
          borderRadius: 8,
          padding: '1.5rem',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: dragActive ? '#EFF6FF' : '#F9FAFB',
          transition: 'all 0.2s ease'
        }}
      >
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept={accept.join(',')}
          multiple={multiple}
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        
        <Upload style={{ width: 32, height: 32, color: '#9CA3AF', margin: '0 auto 0.5rem' }} />
        <p style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.25rem' }}>
          <span style={{ color: '#1D4ED8', fontWeight: 500 }}>Click to upload</span> or drag and drop
        </p>
        <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>
          {accept.map(t => t.split('/')[1].toUpperCase()).join(', ')} (max {maxSize}MB)
        </p>
      </div>

      {hint && !error && !uploadError && (
        <small style={{ display: 'block', marginTop: '0.25rem', fontSize: '0.75rem', color: '#6B7280' }}>
          {hint}
        </small>
      )}

      {(error || uploadError) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
          <AlertCircle style={{ width: 14, height: 14, color: '#DC2626', flexShrink: 0 }} />
          <small style={{ fontSize: '0.75rem', color: '#DC2626' }}>
            {error || uploadError}
          </small>
        </div>
      )}

      {files.length > 0 && (
        <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {files.map((file, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.625rem 0.75rem',
                backgroundColor: '#F3F4F6',
                borderRadius: 6,
                border: '1px solid #E5E7EB'
              }}
            >
              {getFileIcon(file)}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.8125rem', color: '#111827', fontWeight: 500, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {file.name}
                </p>
                <p style={{ fontSize: '0.6875rem', color: '#6B7280' }}>
                  {formatFileSize(file.size)}
                </p>
              </div>
              {file.type.startsWith('image/') && (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
                />
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 4,
                  color: '#6B7280',
                  display: 'flex',
                  alignItems: 'center'
                }}
                aria-label="Remove file"
              >
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
