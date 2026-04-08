import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { exchangeService } from '../../services/exchangeService';
import { customerService } from '../../services/customerService';
import { bookingService } from '../../services/bookingService';
import { getErrorMessage } from '../../utils/errorHandler';
import { useFormToast } from '../../hooks/useFormToast';
import SearchableSelect from '../ui/SearchableSelect';
import FormField from '../FormField';
import FormToast from '../ui/FormToast';

const CURRENT_YEAR = new Date().getFullYear();
const CONDITIONS = ['Excellent', 'Good', 'Average', 'Poor'];

const ExchangeSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  bookingId: z.string().min(1, 'Booking is required'),
  oldVehicleMake: z.string().min(1, 'Make is required'),
  oldVehicleModel: z.string().min(1, 'Model is required'),
  oldVehicleVariant: z.string().optional(),
  oldVehicleYear: z.string().min(1, 'Year is required'),
  oldVehicleRegistration: z.string().min(1, 'Registration number is required'),
  oldVehicleKmDriven: z.string().optional(),
  oldVehicleCondition: z.string(),
  remarks: z.string().optional(),
});

const NewExchangeForm = ({ onSuccess, onCancel }) => {
  const queryClient = useQueryClient();
  const { toast, showSuccess, showError, clearToast } = useFormToast();
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(ExchangeSchema),
    defaultValues: {
      customerId: '',
      bookingId: '',
      oldVehicleMake: '',
      oldVehicleModel: '',
      oldVehicleVariant: '',
      oldVehicleYear: '',
      oldVehicleRegistration: '',
      oldVehicleKmDriven: '',
      oldVehicleCondition: 'Good',
      remarks: '',
    },
  });

  const customerId = watch('customerId');

  const { data: customers } = useQuery({
    queryKey: ['customers-search'],
    queryFn: () => customerService.getAllCustomers(),
  });

  const { data: bookings } = useQuery({
    queryKey: ['bookings-list'],
    queryFn: () => bookingService.getAllBookings(),
    enabled: !!customerId,
  });

  // Filter bookings for selected customer
  const customerBookings = (bookings?.data || []).filter(
    (b) => String(b.customerId) === String(customerId) &&
           b.status !== 'CANCELLED' && b.status !== 'COMPLETED'
  );

  const mutation = useMutation({
    mutationFn: (data) => exchangeService.createExchangeRequest({
      ...data,
      customerId: Number(data.customerId),
      bookingId: Number(data.bookingId),
      oldVehicleYear: Number(data.oldVehicleYear),
      oldVehicleKmDriven: data.oldVehicleKmDriven ? Number(data.oldVehicleKmDriven) : null,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['exchanges']);
      showSuccess('Exchange request created successfully');
      setTimeout(() => onSuccess(), 1200);
    },
    onError: (error) => showError(getErrorMessage(error)),
  });

  const onSubmit = (data) => {
    clearToast();
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <FormToast toast={toast} onClose={clearToast} />

      {/* Customer + Booking */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <SearchableSelect
          label="Customer"
          required
          queryKey="customers-search"
          queryFn={(search) => customerService.getAllCustomers(search)}
          onSelect={(customer) => {
            setValue('customerId', customer?.customerId || '');
            setValue('bookingId', ''); // Reset booking when customer changes
          }}
          renderItem={(c) => (
            <>
              <p className="result-primary">{c.fullName}</p>
              <p className="result-secondary">{c.phone}</p>
            </>
          )}
          renderSelected={(c) => `${c.fullName} — ${c.phone}`}
          placeholder="Search by name, phone or email..."
          error={errors.customerId?.message}
        />

        <FormField
          label="Booking"
          name="bookingId"
          required
          register={register}
          error={errors.bookingId?.message}
        >
          <select 
            {...register('bookingId')} 
            className={`form-select${errors.bookingId ? ' is-invalid' : ''}`}
            disabled={!customerId}
          >
            <option value="">Select booking</option>
            {customerBookings.map((b) => (
              <option key={b.bookingId} value={b.bookingId}>
                {b.bookingNumber} — {b.vehicleModel}
              </option>
            ))}
          </select>
          {customerId && customerBookings.length === 0 && (
            <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: 4 }}>
              No active bookings for this customer
            </p>
          )}
        </FormField>
      </div>

      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#002C5F', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: -4 }}>
        Old Vehicle Details
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <FormField
          label="Make"
          name="oldVehicleMake"
          required
          register={register}
          error={errors.oldVehicleMake?.message}
          placeholder="e.g. Maruti"
        />
        <FormField
          label="Model"
          name="oldVehicleModel"
          required
          register={register}
          error={errors.oldVehicleModel?.message}
          placeholder="e.g. Swift"
        />
        <FormField
          label="Variant"
          name="oldVehicleVariant"
          register={register}
          error={errors.oldVehicleVariant?.message}
          placeholder="e.g. ZXI AT"
        />
        <FormField
          label="Year"
          name="oldVehicleYear"
          type="number"
          required
          register={register}
          error={errors.oldVehicleYear?.message}
          placeholder={String(CURRENT_YEAR - 3)}
          min="1980"
          max={CURRENT_YEAR}
        />
        <FormField
          label="Registration No."
          name="oldVehicleRegistration"
          required
          register={register}
          error={errors.oldVehicleRegistration?.message}
          placeholder="e.g. KA01AB1234"
          style={{ textTransform: 'uppercase' }}
        />
        <FormField
          label="KM Driven"
          name="oldVehicleKmDriven"
          type="number"
          register={register}
          error={errors.oldVehicleKmDriven?.message}
          placeholder="e.g. 45000"
          min="0"
        />
        <FormField
          label="Condition"
          name="oldVehicleCondition"
          register={register}
          error={errors.oldVehicleCondition?.message}
        >
          <select 
            {...register('oldVehicleCondition')} 
            className={`form-select${errors.oldVehicleCondition ? ' is-invalid' : ''}`}
          >
            {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </FormField>
      </div>

      <FormField
        label="Remarks"
        name="remarks"
        register={register}
        error={errors.remarks?.message}
      >
        <textarea 
          {...register('remarks')} 
          className={`input-field${errors.remarks ? ' is-invalid' : ''}`}
          rows={2}
          placeholder="Any additional notes..."
          style={{ resize: 'vertical' }}
        />
      </FormField>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #E2E8F0' }}>
        <button type="button" onClick={onCancel} className="btn btn-secondary btn-sm">
          Cancel
        </button>
        <button type="submit" disabled={mutation.isPending} className="btn btn-primary btn-sm">
          {mutation.isPending && <span className="spinner spinner-sm" />}
          {mutation.isPending ? 'Submitting...' : 'Submit Request'}
        </button>
      </div>
    </form>
  );
};

export default NewExchangeForm;
