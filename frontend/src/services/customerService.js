import axiosInstance from '../utils/axiosConfig';

export const customerService = {
  getAllCustomers: async (searchQuery = '', filters = {}) => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (filters.city) params.append('city', filters.city);
    if (filters.customerType) params.append('customerType', filters.customerType);
    if (filters.fromDate) params.append('fromDate', filters.fromDate);
    if (filters.toDate) params.append('toDate', filters.toDate);
    
    const queryString = params.toString();
    const response = await axiosInstance.get(`/customers${queryString ? `?${queryString}` : ''}`);
    return response.data;
  },

  getCustomerById: async (id) => {
    const response = await axiosInstance.get(`/customers/${id}`);
    return response.data;
  },

  createCustomer: async (customerData) => {
    const response = await axiosInstance.post('/customers', customerData);
    return response.data;
  },

  updateCustomer: async (id, customerData) => {
    const response = await axiosInstance.put(`/customers/${id}`, customerData);
    return response.data;
  },

  deleteCustomer: async (id) => {
    const response = await axiosInstance.delete(`/customers/${id}`);
    return response.data;
  },

  getCustomerBookings: async (id) => {
    const response = await axiosInstance.get(`/customers/${id}/bookings`);
    return response.data;
  },

  getCustomer360View: async (id) => {
    const response = await axiosInstance.get(`/customers/${id}/360`);
    return response.data;
  },

  importCustomers: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post('/customers/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  updateCustomerPhone: async (id, phone) => {
    const response = await axiosInstance.patch(`/customers/${id}/phone`, { phone });
    return response.data;
  },

  updateCustomerEmail: async (id, email) => {
    const response = await axiosInstance.patch(`/customers/${id}/email`, { email });
    return response.data;
  }
};
