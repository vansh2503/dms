import axiosInstance from '../utils/axiosConfig';

export const exchangeService = {
  getAllExchangeRequests: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.vehicleId) params.append('vehicleId', filters.vehicleId);
    if (filters.fromDate) params.append('fromDate', filters.fromDate);
    if (filters.toDate) params.append('toDate', filters.toDate);
    
    const queryString = params.toString();
    const url = queryString ? `/exchange?${queryString}` : '/exchange';
    const response = await axiosInstance.get(url);
    return response.data;
  },

  getExchangeRequestById: async (id) => {
    const response = await axiosInstance.get(`/exchange/${id}`);
    return response.data;
  },

  createExchangeRequest: async (data) => {
    const response = await axiosInstance.post('/exchange', data);
    return response.data;
  },

  evaluateExchange: async (id, offeredAmount) => {
    const response = await axiosInstance.patch(`/exchange/${id}/evaluate?offeredAmount=${offeredAmount}`);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await axiosInstance.patch(`/exchange/${id}/status?status=${status}`);
    return response.data;
  },
};
