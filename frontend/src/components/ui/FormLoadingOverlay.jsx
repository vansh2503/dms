/**
 * FormLoadingOverlay Component
 * 
 * Displays a loading overlay on forms during submission to prevent
 * multiple submissions and provide clear visual feedback.
 */

const FormLoadingOverlay = ({ isLoading, message = 'Processing...' }) => {
  if (!isLoading) return null;

  return (
    <div className="form-loading-overlay">
      <div className="form-loading-content">
        <div className="spinner spinner-lg" />
        <p className="form-loading-message">{message}</p>
      </div>
    </div>
  );
};

export default FormLoadingOverlay;
