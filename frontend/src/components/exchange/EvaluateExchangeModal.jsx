import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { exchangeService } from '../../services/exchangeService';

const EvaluateExchangeModal = ({ exchange, onSuccess, onCancel }) => {
  const queryClient = useQueryClient();
  const [offeredAmount, setOfferedAmount] = useState(
    exchange?.offeredAmount ? String(exchange.offeredAmount) : ''
  );
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: () => exchangeService.evaluateExchange(exchange.exchangeId, offeredAmount),
    onSuccess: () => {
      queryClient.invalidateQueries(['exchanges']);
      onSuccess('Exchange evaluated successfully');
    },
    onError: (err) => setError(err.response?.data?.message || 'Failed to evaluate exchange'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const val = parseFloat(offeredAmount);
    if (!offeredAmount || isNaN(val) || val <= 0) {
      setError('Please enter a valid offered amount greater than 0');
      return;
    }
    mutation.mutate();
  };

  if (!exchange) return null;

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ backgroundColor: '#F8FAFC', borderRadius: 8, padding: '0.875rem 1rem', fontSize: '0.8125rem', color: '#475569' }}>
        <p><strong>Vehicle:</strong> {exchange.oldVehicleMake} {exchange.oldVehicleModel} ({exchange.oldVehicleYear})</p>
        <p style={{ marginTop: 4 }}><strong>Registration:</strong> {exchange.oldVehicleRegistration}</p>
        <p style={{ marginTop: 4 }}><strong>KM Driven:</strong> {exchange.oldVehicleKmDriven?.toLocaleString('en-IN')} km</p>
        <p style={{ marginTop: 4 }}><strong>Condition:</strong> {exchange.oldVehicleCondition || '—'}</p>
      </div>

      <div className="form-group">
        <label className="form-label">
          Offered Amount (₹) <span style={{ color: '#DC2626' }}>*</span>
        </label>
        <input
          type="number"
          className="input-field"
          value={offeredAmount}
          onChange={(e) => setOfferedAmount(e.target.value)}
          placeholder="e.g. 450000"
          min="1"
          step="1000"
        />
        <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: 4 }}>
          This sets both the valuation and offered amount. Status will change to EVALUATED.
        </p>
      </div>

      {error && (
        <p style={{ fontSize: '0.8125rem', color: '#DC2626', backgroundColor: '#FEF2F2', padding: '0.5rem 0.75rem', borderRadius: 6 }}>
          {error}
        </p>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #E2E8F0' }}>
        <button type="button" onClick={onCancel} className="btn btn-secondary btn-sm">Cancel</button>
        <button type="submit" disabled={mutation.isPending} className="btn btn-primary btn-sm">
          {mutation.isPending && <span className="spinner spinner-sm" />}
          {mutation.isPending ? 'Saving...' : 'Save Evaluation'}
        </button>
      </div>
    </form>
  );
};

export default EvaluateExchangeModal;
