import axiosInstance from '../utils/axiosConfig';

export const accessoryService = {
  getAllAccessories: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    
    const queryString = params.toString();
    const url = queryString ? `/accessories?${queryString}` : '/accessories';
    const response = await axiosInstance.get(url);
    return response.data;
  },

  getAccessoryById: async (id) => {
    const response = await axiosInstance.get(`/accessories/${id}`);
    return response.data;
  },

  createAccessory: async (accessoryData) => {
    const response = await axiosInstance.post('/accessories', accessoryData);
    return response.data;
  },

  updateAccessory: async (id, accessoryData) => {
    const response = await axiosInstance.put(`/accessories/${id}`, accessoryData);
    return response.data;
  },

  deleteAccessory: async (id) => {
    const response = await axiosInstance.delete(`/accessories/${id}`);
    return response.data;
  },

  getAllAccessoryOrders: async () => {
    const response = await axiosInstance.get('/accessory-orders');
    return response.data;
  },

  createAccessoryOrder: async (orderData) => {
    const response = await axiosInstance.post('/accessory-orders', orderData);
    return response.data;
  }
};
