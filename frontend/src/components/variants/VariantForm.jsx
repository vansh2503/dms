import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { variantService } from '../../services/variantService';
import { modelService } from '../../services/modelService';
import { VariantSchema } from '../../utils/schemas';
import { useFormToast } from '../../hooks/useFormToast';
import FormToast from '../ui/FormToast';

const inp = (err) => `input-field${err ? ' is-invalid' : ''}`;
const sel = (err) => `form-select${err ? ' is-invalid' : ''}`;

const VariantForm = ({ initialData, onSuccess, onCancel }) => {
  const queryClient = useQueryClient();
  const { toast, showSuccess, showError, clearToast } = useFormToast();

  const { data: models } = useQuery({ queryKey: ['models'], queryFn: () => modelService.getAllModels() });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(VariantSchema),
    defaultValues: initialData ? {
      modelId: initialData.modelId || '', variantName: initialData.variantName || '',
      variantCode: initialData.variantCode || '', fuelType: initialData.fuelType || '',
      transmission: initialData.transmission || '', engineCapacity: initialData.engineCC || '',
      seatingCapacity: initialData.seatingCapacity || 5, basePrice: initialData.price || 0,
      exShowroomPrice: initialData.exShowroomPrice || 0, features: initialData.features || ''
    } : {
      modelId: '', variantName: '', variantCode: '', fuelType: 'PETROL', transmission: 'MANUAL',
      engineCapacity: '', seatingCapacity: 5, basePrice: 0, exShowroomPrice: 0, features: ''
    }
  });

  const mutation = useMutation({
    mutationFn: (data) => initialData ? variantService.updateVariant(initialData.id, data) : variantService.createVariant(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['variants']);
      showSuccess(initialData ? 'Variant updated successfully' : 'Variant added successfully');
      setTimeout(onSuccess, 1200);
    },
    onError: (error) => showError(error.response?.data?.message || 'Failed to save variant'),
  });

  return (
    <form onSubmit={handleSubmit((data) => { clearToast(); mutation.mutate(data); })} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <FormToast toast={toast} onClose={clearToast} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div className="form-group">
          <label className="form-label">Vehicle Model <span className="required-indicator">*</span></label>
          <select {...register('modelId')} className={sel(errors.modelId)}>
            <option value="">Select model</option>
            {models?.data?.map(m => <option key={m.modelId} value={m.modelId}>{m.modelName}</option>)}
          </select>
          {errors.modelId && <p className="form-error"><span>{errors.modelId.message}</span></p>}
        </div>
        <div className="form-group">
          <label className="form-label">Variant Name <span className="required-indicator">*</span></label>
          <input {...register('variantName')} className={inp(errors.variantName)} placeholder="e.g. SX (O)" />
          {errors.variantName && <p className="form-error"><span>{errors.variantName.message}</span></p>}
        </div>
        <div className="form-group">
          <label className="form-label">Variant Code <span className="required-indicator">*</span></label>
          <input {...register('variantCode')} className={inp(errors.variantCode)} placeholder="e.g. CRT-SX-P" />
          {errors.variantCode && <p className="form-error"><span>{errors.variantCode.message}</span></p>}
        </div>
        <div className="form-group">
          <label className="form-label">Engine Capacity</label>
          <input {...register('engineCapacity')} className={inp(errors.engineCapacity)} placeholder="e.g. 1497 cc" />
        </div>
        <div className="form-group">
          <label className="form-label">Fuel Type <span className="required-indicator">*</span></label>
          <select {...register('fuelType')} className="form-select">
            <option value="PETROL">Petrol</option><option value="DIESEL">Diesel</option>
            <option value="ELECTRIC">Electric</option><option value="HYBRID">Hybrid</option><option value="CNG">CNG</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Transmission <span className="required-indicator">*</span></label>
          <select {...register('transmission')} className="form-select">
            <option value="MANUAL">Manual</option><option value="AUTOMATIC">Automatic</option>
            <option value="IMT">iMT</option><option value="IVT">IVT</option><option value="DCT">DCT</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Seating Capacity</label>
          <input type="number" {...register('seatingCapacity')} className="input-field" min={2} max={9} />
        </div>
        <div className="form-group">
          <label className="form-label">Ex-Showroom Price (â‚¹) <span className="required-indicator">*</span></label>
          <input type="number" {...register('exShowroomPrice')} className={inp(errors.exShowroomPrice)} placeholder="e.g. 1545000" />
          {errors.exShowroomPrice && <p className="form-error"><span>{errors.exShowroomPrice.message}</span></p>}
        </div>
        <div className="form-group">
          <label className="form-label">Base Price (â‚¹)</label>
          <input type="number" {...register('basePrice')} className="input-field" placeholder="Internal cost" />
        </div>
        <div style={{ gridColumn: '1 / -1' }} className="form-group">
          <label className="form-label">Key Features</label>
          <textarea {...register('features')} rows={2} className="input-field" placeholder="List key highlights..." style={{ resize: 'vertical' }} />
        </div>
      </div>
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-cancel">Cancel</button>
        <button type="submit" disabled={mutation.isPending} className="btn-submit">
          {mutation.isPending && <span className="spinner spinner-sm" />}
          {mutation.isPending ? 'Saving...' : initialData ? 'Update Variant' : 'Add Variant'}
        </button>
      </div>
    </form>
  );
};

export default VariantForm;
