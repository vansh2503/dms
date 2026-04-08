import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { testDriveService } from '../../services/testDriveService';
import { useFormToast } from '../../hooks/useFormToast';
import FormToast from '../ui/FormToast';

const FeedbackModal = ({ testDrive, onSuccess, onCancel }) => {
  const [feedback, setFeedback] = useState('');
  const { toast, showSuccess, showError, clearToast } = useFormToast();

  const mutation = useMutation({
    mutationFn: () => testDriveService.updateStatus(testDrive.testDriveId, 'COMPLETED', feedback.trim() || null),
    onSuccess: () => {
      showSuccess('Test drive marked as completed');
      setTimeout(onSuccess, 1200);
    },
    onError: (error) => showError(error.response?.data?.message || 'Failed to update test drive'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    clearToast();
    mutation.mutate();
  };

  if (!testDrive) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div style={{ marginBottom: '1rem' }}>
        <FormToast toast={toast} onClose={clearToast} />
      </div>
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-3">Test Drive Information</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Customer:</span>
            <span className="font-medium text-gray-900">{testDrive.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Vehicle:</span>
            <span className="font-medium text-gray-900">{testDrive.vehicleModel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Scheduled:</span>
            <span className="font-medium text-gray-900">
              {new Date(testDrive.scheduledDateTime).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short'
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Feedback */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Customer Feedback (Optional)
        </label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hyundai-blue"
          placeholder="Enter customer feedback about the test drive experience..."
        />
        <p className="text-sm text-gray-500 mt-1">
          Capture customer's impressions, concerns, or interest level
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {mutation.isPending ? 'Saving...' : 'Mark as Completed'}
        </button>
      </div>
    </form>
  );
};

export default FeedbackModal;
