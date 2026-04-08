import axiosInstance from '../utils/axiosConfig';

export const variantService = {
  getAllVariants: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.modelId) params.append('modelId', filters.modelId);
    if (filters.fuelType) params.append('fuelType', filters.fuelType);
    if (filters.transmission) params.append('transmission', filters.transmission);
    
    const queryString = params.toString();
    const url = queryString ? `/variants?${queryString}` : '/variants';
    const response = await axiosInstance.get(url);
    return response.data;
  },

  getVariantById: async (id) => {
    const response = await axiosInstance.get(`/variants/${id}`);
    return response.data;
  },

  getActiveVariants: async () => {
    const response = await axiosInstance.get('/variants/active');
    return response.data;
  },

  createVariant: async (variantData) => {
    const response = await axiosInstance.post('/variants', variantData);
    return response.data;
  },

  updateVariant: async (id, variantData) => {
    const response = await axiosInstance.put(`/variants/${id}`, variantData);
    return response.data;
  },

  deleteVariant: async (id) => {
    const response = await axiosInstance.delete(`/variants/${id}`);
    return response.data;
  }
};
