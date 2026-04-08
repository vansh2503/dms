import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { bookingService } from '../../services/bookingService';
import { AlertCircle } from 'lucide-react';
import ConfirmDialog from '../ui/ConfirmDialog';
import { getErrorMessage } from '../../utils/errorHandler';

const CancelBookingModal = ({ booking, onSuccess, onCancel }) => {
  const [cancellationReason, setCancellationReason] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  
  // Calculate cancellation charges (example: 10% of booking amount)
  const cancellationCharges = booking ? Math.round(booking.bookingAmount * 0.1) : 0;
  const refundAmount = booking ? booking.bookingAmount - cancellationCharges : 0;

  const mutation = useMutation({
    mutationFn: (data) => bookingService.cancelBooking(booking.bookingId, data),
    onSuccess: () => {
      setShowConfirm(false);
      onSuccess();
    },
    onError: (error) => {
      setError(getErrorMessage(error));
      setShowConfirm(false);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!cancellationReason.trim()) {
      setError('Please provide a cancellation reason');
      return;
    }

    setError('');
    setShowConfirm(true);
  };

  const confirmCancel = () => {
    mutation.mutate({
      cancellationReason,
      cancellationCharges
    });
  };

  if (!booking) return null;

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Warning */}
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-orange-800 font-medium">Warning</h4>
              <p className="text-orange-700 text-sm mt-1">
                Cancelling this booking will release the vehicle back to inventory and process a refund.
              </p>
            </div>
          </div>
        </div>

      {/* Booking Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-3">Booking Information</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Booking Number:</span>
            <span className="font-medium text-gray-900">{booking.bookingNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Customer:</span>
            <span className="font-medium text-gray-900">{booking.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Vehicle:</span>
            <span className="font-medium text-gray-900">{booking.vehicleModel}</span>
          </div>
        </div>
      </div>

      {/* Cancellation Reason */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cancellation Reason <span className="text-red-500">*</span>
        </label>
        <textarea
          value={cancellationReason}
          onChange={(e) => setCancellationReason(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hyundai-blue"
          placeholder="Please provide a reason for cancellation..."
          required
        />
      </div>

      {/* Charges Breakdown */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-3">Refund Calculation</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-blue-800">Booking Amount:</span>
            <span className="font-medium text-blue-900">
              ₹{booking.bookingAmount?.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-800">Cancellation Charges (10%):</span>
            <span className="font-medium text-red-600">
              - ₹{cancellationCharges.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-blue-300">
            <span className="text-blue-900 font-semibold">Refund Amount:</span>
            <span className="font-bold text-green-600 text-lg">
              ₹{refundAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Go Back
        </button>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {mutation.isPending ? 'Cancelling...' : 'Cancel Booking'}
        </button>
      </div>
    </form>

    {/* Confirmation Dialog */}
    <ConfirmDialog
      isOpen={showConfirm}
      onClose={() => setShowConfirm(false)}
      onConfirm={confirmCancel}
      title="Confirm Booking Cancellation"
      message={`Are you sure you want to cancel booking ${booking?.bookingNumber}? A refund of ₹${refundAmount.toLocaleString('en-IN')} will be processed.`}
      confirmText="Cancel Booking"
      variant="danger"
      isLoading={mutation.isPending}
    />
  </>
  );
};

export default CancelBookingModal;
