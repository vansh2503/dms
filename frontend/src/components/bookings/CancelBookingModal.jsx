import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { bookingService } from '../../services/bookingService';
import { AlertCircle, Ban, Info, Wallet, FileText, ChevronRight } from 'lucide-react';
import ConfirmDialog from '../ui/ConfirmDialog';
import FormField from '../FormField';
import { getErrorMessage } from '../../utils/errorHandler';

const CancelBookingModal = ({ booking, onSuccess, onCancel }) => {
  const [cancellationReason, setCancellationReason] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

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
        {error && (
          <div className="alert-banner danger">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="alert-banner warning">
          <Ban className="w-5 h-5 flex-shrink-0" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold">Irreversible Action</h4>
            <p className="text-sm opacity-90">
              This will release the vehicle to inventory and trigger a refund process.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Booking Summary Card */}
          <div className="card bg-gray-50/50 border-gray-100">
            <div className="p-4 border-b border-gray-100 bg-white/50 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Booking Identity</h4>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight mb-0.5">Reference ID</p>
                <p className="text-sm font-semibold text-gray-900">{booking.bookingNumber}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight mb-0.5">Primary Customer</p>
                <p className="text-sm font-semibold text-gray-900">{booking.customerName}</p>
              </div>
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs font-medium text-gray-500">{booking.vehicleModel}</p>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-200 rounded text-gray-600">Reserved</span>
              </div>
            </div>
          </div>

          {/* Refund Logic Card */}
          <div className="card border-blue-100 bg-blue-50/10">
            <div className="p-4 border-b border-blue-100 bg-blue-50/30 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-blue-500" />
              <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider">Financial Breakdown</h4>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Deposit Amount</span>
                <span className="font-semibold text-gray-900">₹{booking.bookingAmount?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Admin Charges (10%)</span>
                <span className="font-bold text-red-500">- ₹{cancellationCharges.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-3 border-t border-blue-100 mt-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-blue-600 uppercase">Est. Refund</span>
                  <span className="text-xl font-bold text-blue-700">₹{refundAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <FormField
            label="Formal Reason for Cancellation"
            required
            error={error && !cancellationReason ? 'Reason is required' : null}
          >
            <textarea
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              className="input-field min-h-[100px] py-3"
              placeholder="Why is the booking being cancelled? Please provide details for the audit trail..."
              required
            />
          </FormField>
        </div>

        <div className="flex justify-end items-center gap-4 pt-6 mt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
          >
            Go Back
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="btn btn-danger px-10 py-3 shadow-lg shadow-red-100"
          >
            {mutation.isPending ? 'Processing...' : 'Effect Cancellation'}
          </button>
        </div>
      </form>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmCancel}
        title="Confirm Irreversible Cancellation"
        message={`Are you absolutely sure you want to cancel booking ${booking?.bookingNumber}? This will process a refund of ₹${refundAmount.toLocaleString('en-IN')} and cannot be undone.`}
        confirmText="Yes, Cancel Booking"
        variant="danger"
        isLoading={mutation.isPending}
      />
    </>
  );
};

export default CancelBookingModal;
