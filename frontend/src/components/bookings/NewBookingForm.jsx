import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingService } from '../../services/bookingService';
import { customerService } from '../../services/customerService';
import { vehicleService } from '../../services/vehicleService';
import { BookingSchema } from '../../utils/schemas';
import { useFormToast } from '../../hooks/useFormToast';
import { getErrorMessage } from '../../utils/errorHandler';
import FormLoadingOverlay from '../ui/FormLoadingOverlay';
import FormToast from '../ui/FormToast';
import SearchableSelect from '../ui/SearchableSelect';
import FormField from '../FormField';
import Modal from '../Modal';
import AddCustomerForm from '../customer/AddCustomerForm';

const NewBookingForm = ({ onSuccess, onCancel }) => {
  const { toast, showSuccess, showError, clearToast } = useFormToast();
  const queryClient = useQueryClient();
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newlyCreatedCustomer, setNewlyCreatedCustomer] = useState(null);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(BookingSchema),
    defaultValues: { bookingAmount: '', expectedDeliveryDate: '', customerId: '', vehicleId: '' }
  });

  const selectedCustomerId = watch('customerId');
  const selectedVehicleId = watch('vehicleId');

  const mutation = useMutation({
    mutationFn: bookingService.createBooking,
    onSuccess: () => {
      showSuccess('Booking created successfully');
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
      bookingAmount: Number(data.bookingAmount),
      expectedDeliveryDate: data.expectedDeliveryDate,
    });
  };

  const handleCustomerCreated = (apiResponse) => {
    // customerService.createCustomer returns response.data (the full ApiResponse)
    // ApiResponse structure: { success: true, data: CustomerResponse, message: "..." }
    const customer = apiResponse?.data;

    if (!customer?.customerId) {
      showError('Customer creation failed — no data returned');
      return;
    }

    // Normalize the customer object for display in SearchableSelect
    const normalizedCustomer = {
      ...customer,
      fullName: customer.fullName || `${customer.firstName} ${customer.lastName}`.trim(),
      id: customer.customerId,
    };

    // 1. Set the customer in the dropdown
    setNewlyCreatedCustomer(normalizedCustomer);

    // 2. Set the form field value
    setValue('customerId', customer.customerId);

    // 3. Invalidate ALL customer queries so Customers page refreshes
    // Customers page uses key: ['customers', searchTerm, filters]
    // Passing just ['customers'] invalidates all queries that START with that key
    queryClient.invalidateQueries({ queryKey: ['customers'] });

    // 4. Close the modal
    setShowAddCustomerModal(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <FormLoadingOverlay isLoading={mutation.isPending} message="Creating booking..." />
      <FormToast toast={toast} onClose={clearToast} />

      {/* Customer Search */}
      <SearchableSelect
        label="Customer"
        required
        queryKey="customers-search"
        queryFn={(search) => customerService.getAllCustomers(search)}
        onSelect={(customer) => {
          setValue('customerId', customer ? (customer.customerId || customer.id) : '');
          setNewlyCreatedCustomer(null); // Clear if user selects different customer
        }}
        renderItem={(c) => (
          <>
            <p className="result-primary">{c.fullName}</p>
            <p className="result-secondary">{c.phone}{c.email ? ` · ${c.email}` : ''}</p>
          </>
        )}
        renderSelected={(c) => `${c.fullName || c.name} — ${c.phone}`}
        placeholder="Search by name, phone or email..."
        error={!selectedCustomerId && errors.customerId?.message}
        onAddNew={() => setShowAddCustomerModal(true)}
        addNewLabel="+ Add New Customer"
        preselectedItem={newlyCreatedCustomer}
      />

      {/* Vehicle Search */}
      <SearchableSelect
        label="Vehicle"
        required
        queryKey="vehicles-search"
        queryFn={(search) => vehicleService.getAllVehicles({ search, status: 'IN_SHOWROOM' })}
        onSelect={(vehicle) => {
          setValue('vehicleId', vehicle ? vehicle.id : '');
          if (vehicle) {
            setValue('bookingAmount', Math.round(vehicle.price * 0.1));
          }
        }}
        renderItem={(v) => (
          <>
            <p className="result-primary">{v.model} — {v.variant}</p>
            <p className="result-secondary">{v.color} · {v.fuelType} · ₹{v.price?.toLocaleString('en-IN')}</p>
          </>
        )}
        renderSelected={(v) => `${v.model} — ${v.variant} (₹${v.price?.toLocaleString('en-IN')})`}
        placeholder="Search by model, variant or color..."
        error={!selectedVehicleId && errors.vehicleId?.message}
      />

      {/* Booking Amount + Delivery Date */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <FormField
          label="Booking Amount (₹)"
          name="bookingAmount"
          type="number"
          required
          register={register}
          error={errors.bookingAmount?.message}
          placeholder="e.g. 50000"
        />
        <FormField
          label="Expected Delivery Date"
          name="expectedDeliveryDate"
          type="date"
          required
          register={register}
          error={errors.expectedDeliveryDate?.message}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-cancel">Cancel</button>
        <button type="submit" disabled={mutation.isPending} className="btn-submit">
          {mutation.isPending && <span className="spinner spinner-sm" />}
          {mutation.isPending ? 'Creating...' : 'Create Booking'}
        </button>
      </div>

      {/* Add Customer Modal */}
      <Modal 
        isOpen={showAddCustomerModal} 
        onClose={() => setShowAddCustomerModal(false)} 
        title="Add New Customer" 
        size="lg"
      >
        <AddCustomerForm
          onSuccess={handleCustomerCreated}
          onCancel={() => setShowAddCustomerModal(false)}
        />
      </Modal>
    </form>
  );
};

export default NewBookingForm;
