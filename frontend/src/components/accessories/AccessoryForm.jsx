import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { accessoryService } from '../../services/accessoryService';
import { AccessorySchema } from '../../utils/schemas';
import { useFormToast } from '../../hooks/useFormToast';
import { getErrorMessage } from '../../utils/errorHandler';
import FormToast from '../ui/FormToast';
import FormField from '../FormField';

const AccessoryForm = ({ initialData, onSuccess, onCancel }) => {
  const queryClient = useQueryClient();
  const { toast, showSuccess, showError, clearToast } = useFormToast();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(AccessorySchema),
    defaultValues: initialData ? {
      accessoryName: initialData.name || '',
      accessoryCode: initialData.accessoryCode || '',
      category: initialData.category || '',
      description: initialData.description || '',
      price: initialData.price || 0
    } : { accessoryName: '', accessoryCode: '', category: '', description: '', price: 0 }
  });

  const mutation = useMutation({
    mutationFn: (data) => initialData ? accessoryService.updateAccessory(initialData.id, data) : accessoryService.createAccessory(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['accessories']);
      showSuccess(initialData ? 'Accessory updated successfully' : 'Accessory added successfully');
      setTimeout(onSuccess, 1200);
    },
    onError: (error) => showError(getErrorMessage(error)),
  });

  return (
    <form onSubmit={handleSubmit((data) => { clearToast(); mutation.mutate(data); })} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <FormToast toast={toast} onClose={clearToast} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <FormField
          label="Accessory Name"
          name="accessoryName"
          required
          register={register}
          error={errors.accessoryName?.message}
          placeholder="e.g. 3D Floor Mats"
        />
        <FormField
          label="Accessory Code"
          name="accessoryCode"
          required
          register={register}
          error={errors.accessoryCode?.message}
          placeholder="e.g. ACC-FM-001"
        />
        <FormField
          label="Category"
          name="category"
          register={register}
          error={errors.category?.message}
          placeholder="e.g. Interior"
        />
        <FormField
          label="Price (₹)"
          name="price"
          type="number"
          required
          register={register}
          error={errors.price?.message}
          placeholder="e.g. 3500"
          step="0.01"
        />
        <div style={{ gridColumn: '1 / -1' }}>
          <FormField
            label="Description"
            name="description"
            register={register}
            error={errors.description?.message}
          >
            <textarea 
              {...register('description')} 
              rows={3} 
              className={`input-field${errors.description ? ' is-invalid' : ''}`}
              placeholder="Brief description of the accessory..." 
              style={{ resize: 'vertical' }} 
            />
          </FormField>
        </div>
      </div>
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-cancel">Cancel</button>
        <button type="submit" disabled={mutation.isPending} className="btn-submit">
          {mutation.isPending && <span className="spinner spinner-sm" />}
          {mutation.isPending ? 'Saving...' : initialData ? 'Update Accessory' : 'Add Accessory'}
        </button>
      </div>
    </form>
  );
};

export default AccessoryForm;
