import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { vehicleService } from '../../services/vehicleService';
import { variantService } from '../../services/variantService';
import { useAuth } from '../../context/AuthContext';
import { VehicleSchema } from '../../utils/schemas';
import { useFormToast } from '../../hooks/useFormToast';
import { getErrorMessage } from '../../utils/errorHandler';
import FormLoadingOverlay from '../ui/FormLoadingOverlay';
import FormToast from '../ui/FormToast';
import FormField from '../FormField';

const AddVehicleForm = ({ vehicle, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const { toast, showSuccess, showError, clearToast } = useFormToast();

  const { data: variantsResponse, isLoading: variantsLoading } = useQuery({
    queryKey: ['activeVariants'],
    queryFn: variantService.getActiveVariants,
  });
  const variants = variantsResponse?.data || [];

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(VehicleSchema),
    defaultValues: vehicle ? {
      variantId: String(vehicle.variantId || ''),
      vin: vehicle.vin || '',
      chassisNumber: vehicle.chassisNumber || '',
      engineNumber: vehicle.engineNumber || '',
      color: vehicle.color || '',
      manufacturingYear: vehicle.manufacturingYear || new Date().getFullYear(),
      manufacturingMonth: vehicle.manufacturingMonth || new Date().getMonth() + 1,
      sellingPrice: vehicle.price || vehicle.sellingPrice || '',
      purchasePrice: vehicle.purchasePrice || '',
      stockyardId: vehicle.stockyardId || '',
      arrivalDate: vehicle.arrivalDate || '',
    } : {
      variantId: '', vin: '', chassisNumber: '', engineNumber: '', color: '',
      manufacturingYear: new Date().getFullYear(),
      manufacturingMonth: new Date().getMonth() + 1,
      sellingPrice: '', purchasePrice: '', stockyardId: '', arrivalDate: '',
    }
  });

  const mutation = useMutation({
    mutationFn: (data) => vehicle ? vehicleService.updateVehicle(vehicle.id, data) : vehicleService.createVehicle(data),
    onSuccess: () => {
      showSuccess(vehicle ? 'Vehicle updated successfully' : 'Vehicle added successfully');
      setTimeout(onSuccess, 1200);
    },
    onError: (error) => showError(getErrorMessage(error)),
  });

  const onSubmit = (formData) => {
    clearToast();
    mutation.mutate({
      ...formData,
      variantId: Number(formData.variantId),
      purchasePrice: formData.purchasePrice ? Number(formData.purchasePrice) : null,
      stockyardId: formData.stockyardId ? Number(formData.stockyardId) : null,
      arrivalDate: formData.arrivalDate || null,
      dealershipId: user?.dealershipId ? Number(user.dealershipId) : 1,
    });
  };

  const colors = ['Polar White', 'Phantom Black', 'Titan Grey', 'Fiery Red', 'Starry Night', 'Typhoon Silver', 'Ranger Khaki', 'Atlas White', 'Mystic Lime', 'Digital Teal', 'Beckoning Red'];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <FormLoadingOverlay isLoading={mutation.isPending} message="Saving vehicle..." />
      <div style={{ maxHeight: '65vh', overflowY: 'auto', padding: '0 2px' }}>
        <FormToast toast={toast} onClose={clearToast} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <FormField
              label="Vehicle Variant"
              name="variantId"
              required
              register={register}
              error={errors.variantId?.message}
            >
              <select {...register('variantId')} className={`form-select${errors.variantId ? ' is-invalid' : ''}`} disabled={variantsLoading}>
                <option value="">{variantsLoading ? 'Loading variants...' : 'Select variant'}</option>
                {variants.map(v => (
                  <option key={v.id} value={v.id}>{v.model} — {v.variantName} ({v.fuelType}, {v.transmission})</option>
                ))}
              </select>
            </FormField>
          </div>

          <FormField
            label="VIN"
            name="vin"
            required
            register={register}
            error={errors.vin?.message}
            hint="17-character vehicle identification number"
            placeholder="MALA241DCXK000001"
            style={{ fontFamily: 'monospace' }}
          />
          <FormField
            label="Chassis Number"
            name="chassisNumber"
            required
            register={register}
            error={errors.chassisNumber?.message}
            placeholder="Min 10 characters"
          />
          <FormField
            label="Engine Number"
            name="engineNumber"
            required
            register={register}
            error={errors.engineNumber?.message}
            placeholder="Min 5 characters"
          />
          <FormField
            label="Color"
            name="color"
            required
            register={register}
            error={errors.color?.message}
          >
            <select {...register('color')} className={`form-select${errors.color ? ' is-invalid' : ''}`}>
              <option value="">Select color</option>
              {colors.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </FormField>
          <FormField
            label="Manufacturing Year"
            name="manufacturingYear"
            type="number"
            required
            register={register}
            error={errors.manufacturingYear?.message}
            min={2000}
            max={new Date().getFullYear() + 1}
          />
          <FormField
            label="Manufacturing Month"
            name="manufacturingMonth"
            required
            register={register}
            error={errors.manufacturingMonth?.message}
          >
            <select {...register('manufacturingMonth')} className={`form-select${errors.manufacturingMonth ? ' is-invalid' : ''}`}>
              <option value="">Select month</option>
              {months.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
            </select>
          </FormField>
          <FormField
            label="Selling Price (₹)"
            name="sellingPrice"
            type="number"
            required
            register={register}
            error={errors.sellingPrice?.message}
            placeholder="e.g. 1500000"
          />
          <FormField
            label="Purchase Price (₹)"
            name="purchasePrice"
            type="number"
            register={register}
            error={errors.purchasePrice?.message}
            placeholder="e.g. 1400000"
          />
          <FormField
            label="Arrival Date"
            name="arrivalDate"
            type="date"
            register={register}
            error={errors.arrivalDate?.message}
            hint="Date when vehicle arrived at dealership"
          />
          <div style={{ gridColumn: '1 / -1' }}>
            <FormField
              label="Stockyard ID"
              name="stockyardId"
              type="number"
              register={register}
              error={errors.stockyardId?.message}
              hint="Numeric ID of the stockyard (e.g. 1)"
              placeholder="e.g. 1"
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-cancel">Cancel</button>
        <button type="submit" disabled={mutation.isPending} className="btn-submit">
          {mutation.isPending && <span className="spinner spinner-sm" />}
          {mutation.isPending ? 'Saving...' : vehicle ? 'Update Vehicle' : 'Add Vehicle'}
        </button>
      </div>
    </form>
  );
};

export default AddVehicleForm;
