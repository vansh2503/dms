import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { testDriveService } from '../../services/testDriveService';
import { customerService } from '../../services/customerService';
import { vehicleService } from '../../services/vehicleService';
import { TestDriveSchema } from '../../utils/schemas';
import { useFormToast } from '../../hooks/useFormToast';
import { getErrorMessage } from '../../utils/errorHandler';
import FormToast from '../ui/FormToast';
import SearchableSelect from '../ui/SearchableSelect';
import FormField from '../FormField';

const BookTestDriveForm = ({ onSuccess, onCancel }) => {
  const { toast, showSuccess, showError, clearToast } = useFormToast();

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(TestDriveSchema),
    defaultValues: { date: '', time: '', customerId: '', vehicleId: '' }
  });

  const selectedCustomerId = watch('customerId');
  const selectedVehicleId = watch('vehicleId');

  const mutation = useMutation({
    mutationFn: testDriveService.createTestDrive,
    onSuccess: () => {
      showSuccess('Test drive booked successfully');
      setTimeout(onSuccess, 1200);
    },
    onError: (error) => showError(getErrorMessage(error)),
  });

  const onSubmit = (data) => {
    clearToast();
    if (!data.customerId) { showError('Please select a customer'); return; }
    if (!data.vehicleId)  { showError('Please select a vehicle');  return; }
    mutation.mutate({
      customerId: Number(data.customerId),
      vehicleId: Number(data.vehicleId),
      dealershipId: 1, // Default dealership
      salesExecutiveId: 1, // Default sales executive
      scheduledDate: data.date,
      scheduledTime: data.time,
    });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <FormToast toast={toast} onClose={clearToast} />

      {/* Customer Search */}
      <SearchableSelect
        label="Customer"
        required
        queryKey="customers-search"
        queryFn={(search) => customerService.getAllCustomers(search)}
        onSelect={(customer) => {
          setValue('customerId', customer ? customer.customerId : '');
        }}
        renderItem={(c) => (
          <>
            <p className="result-primary">{c.fullName}</p>
            <p className="result-secondary">{c.phone}{c.email ? ` · ${c.email}` : ''}</p>
          </>
        )}
        renderSelected={(c) => `${c.fullName} — ${c.phone}`}
        placeholder="Search by name, phone or email..."
        error={!selectedCustomerId && errors.customerId?.message}
      />

      {/* Vehicle Search */}
      <SearchableSelect
        label="Vehicle"
        required
        queryKey="vehicles-search"
        queryFn={(search) => vehicleService.getAllVehicles({ search, status: 'IN_SHOWROOM' })}
        onSelect={(vehicle) => {
          setValue('vehicleId', vehicle ? vehicle.id : '');
        }}
        renderItem={(v) => (
          <>
            <p className="result-primary">{v.model} — {v.variant}</p>
            <p className="result-secondary">{v.color} · {v.fuelType}</p>
          </>
        )}
        renderSelected={(v) => `${v.model} — ${v.variant} (${v.color})`}
        placeholder="Search by model or variant..."
        error={!selectedVehicleId && errors.vehicleId?.message}
      />

      {/* Date + Time */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <FormField
          label="Date"
          name="date"
          type="date"
          required
          register={register}
          error={errors.date?.message}
          min={today}
        />
        <FormField
          label="Time"
          name="time"
          type="time"
          required
          register={register}
          error={errors.time?.message}
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-cancel">Cancel</button>
        <button type="submit" disabled={mutation.isPending} className="btn-submit">
          {mutation.isPending && <span className="spinner spinner-sm" />}
          {mutation.isPending ? 'Booking...' : 'Book Test Drive'}
        </button>
      </div>
    </form>
  );
};

export default BookTestDriveForm;
