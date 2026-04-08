import { useState, useCallback } from 'react';

/**
 * Lightweight inline toast for forms.
 * Returns { toast, showSuccess, showError, clearToast }
 * toast: { type: 'success'|'error', message: string } | null
 */
export const useFormToast = () => {
  const [toast, setToast] = useState(null);

  const showSuccess = useCallback((message) => {
    setToast({ type: 'success', message });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const showError = useCallback((message) => {
    setToast({ type: 'error', message });
  }, []);

  const clearToast = useCallback(() => setToast(null), []);

  return { toast, showSuccess, showError, clearToast };
};
