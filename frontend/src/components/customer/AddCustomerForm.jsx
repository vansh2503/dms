import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerService } from '../../services/customerService';
import { CustomerSchema } from '../../utils/schemas';
import { useFormToast } from '../../hooks/useFormToast';
import { getErrorMessage } from '../../utils/errorHandler';
import FormLoadingOverlay from '../ui/FormLoadingOverlay';
import FormToast from '../ui/FormToast';
import FormField from '../FormField';

const AddCustomerForm = ({ initialData, onSuccess, onCancel }) => {
  const { toast, showSuccess, showError, clearToast } = useFormToast();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(CustomerSchema),
    defaultValues: initialData ? {
      firstName: initialData.firstName || '',
      lastName: initialData.lastName || '',
      email: initialData.email || '',
      phone: initialData.phone || '',
      alternatePhone: initialData.alternatePhone || '',
      address: initialData.address || '',
      city: initialData.city || '',
      state: initialData.state || '',
      pincode: initialData.pincode || '',
      dateOfBirth: initialData.dateOfBirth || '',
      anniversaryDate: initialData.anniversaryDate || '',
      panNumber: initialData.panNumber || '',
      aadharNumber: initialData.aadharNumber || '',
      drivingLicense: initialData.drivingLicense || '',
      customerType: initialData.customerType || 'INDIVIDUAL',
      notes: initialData.notes || ''
    } : {
      firstName: '', lastName: '', email: '', phone: '', alternatePhone: '',
      address: '', city: '', state: '', pincode: '', dateOfBirth: '',
      anniversaryDate: '', panNumber: '', aadharNumber: '', drivingLicense: '',
      customerType: 'INDIVIDUAL', notes: ''
    }
  });

  const mutation = useMutation({
    mutationFn: (data) => initialData
      ? customerService.updateCustomer(initialData.customerId, data)
      : customerService.createCustomer(data),
    onSuccess: (response) => {
      showSuccess(initialData ? 'Customer updated successfully' : 'Customer added successfully');
      setTimeout(() => onSuccess(response), 1200);
    },
    onError: (error) => showError(getErrorMessage(error)),
  });

  const onSubmit = (formData) => {
    clearToast();
    const payload = Object.fromEntries(
      Object.entries(formData).map(([k, v]) => [k, v === '' ? null : v])
    );
    mutation.mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <FormLoadingOverlay isLoading={mutation.isPending} message="Saving customer..." />
      <div style={{ maxHeight: '65vh', overflowY: 'auto', padding: '0 2px' }}>
        <FormToast toast={toast} onClose={clearToast} />

        {/* Personal Information */}
        <p className="form-section-title">Personal Information</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <FormField
            label="First Name"
            name="firstName"
            required
            register={register}
            error={errors.firstName?.message}
            placeholder="e.g. Rajesh"
          />
          <FormField
            label="Last Name"
            name="lastName"
            required
            register={register}
            error={errors.lastName?.message}
            placeholder="e.g. Kumar"
          />
          <FormField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            register={register}
            error={errors.dateOfBirth?.message}
            max={new Date().toISOString().split('T')[0]}
          />
          <FormField
            label="Customer Type"
            name="customerType"
            required
            register={register}
            error={errors.customerType?.message}
          >
            <select {...register('customerType')} className={`form-select${errors.customerType ? ' is-invalid' : ''}`}>
              <option value="INDIVIDUAL">Individual</option>
              <option value="CORPORATE">Corporate</option>
            </select>
          </FormField>
        </div>

        {/* Contact Information */}
        <p className="form-section-title">Contact Information</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <FormField
            label="Phone Number"
            name="phone"
            required
            register={register}
            error={errors.phone?.message}
            placeholder="9876543210"
          />
          <FormField
            label="Alternate Phone"
            name="alternatePhone"
            register={register}
            error={errors.alternatePhone?.message}
            placeholder="9876543210"
          />
          <div style={{ gridColumn: '1 / -1' }}>
            <FormField
              label="Email Address"
              name="email"
              type="email"
              register={register}
              error={errors.email?.message}
              placeholder="email@example.com"
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <FormField
              label="Address"
              name="address"
              register={register}
              error={errors.address?.message}
            >
              <textarea 
                {...register('address')} 
                className={`input-field${errors.address ? ' is-invalid' : ''}`}
                rows={2} 
                placeholder="Street address" 
                style={{ resize: 'vertical' }} 
              />
            </FormField>
          </div>
          <FormField
            label="City"
            name="city"
            register={register}
            error={errors.city?.message}
            placeholder="Mumbai"
          />
          <FormField
            label="State"
            name="state"
            register={register}
            error={errors.state?.message}
            placeholder="Maharashtra"
          />
          <FormField
            label="Pincode"
            name="pincode"
            register={register}
            error={errors.pincode?.message}
            placeholder="400001"
            maxLength={6}
          />
        </div>

        {/* Identification */}
        <p className="form-section-title">Identification</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <FormField
            label="PAN Number"
            name="panNumber"
            register={register}
            error={errors.panNumber?.message}
            placeholder="ABCDE1234F"
            style={{ textTransform: 'uppercase' }}
          />
          <FormField
            label="Aadhar Number"
            name="aadharNumber"
            register={register}
            error={errors.aadharNumber?.message}
            placeholder="123456789012"
            maxLength={12}
          />
          <FormField
            label="Driving License"
            name="drivingLicense"
            register={register}
            error={errors.drivingLicense?.message}
            placeholder="DL0120150034567"
          />
          <FormField
            label="Anniversary Date"
            name="anniversaryDate"
            type="date"
            register={register}
            error={errors.anniversaryDate?.message}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-cancel">Cancel</button>
        <button type="submit" disabled={mutation.isPending} className="btn-submit">
          {mutation.isPending && <span className="spinner spinner-sm" />}
          {mutation.isPending ? 'Saving...' : initialData ? 'Update Customer' : 'Add Customer'}
        </button>
      </div>
    </form>
  );
};

export default AddCustomerForm;
