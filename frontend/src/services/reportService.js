import axiosInstance from '../utils/axiosConfig';

const buildParams = (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      params.append(key, value);
    }
  });
  return params.toString();
};

export const reportService = {
  getSalesSummary: async (filters = {}) => {
    const response = await axiosInstance.get(`/reports/sales-summary?${buildParams(filters)}`);
    return response.data;
  },

  getInventoryStatus: async (filters = {}) => {
    const response = await axiosInstance.get(`/reports/inventory-status?${buildParams(filters)}`);
    return response.data;
  },

  getDispatchSummary: async (filters = {}) => {
    const response = await axiosInstance.get(`/reports/dispatch-summary?${buildParams(filters)}`);
    return response.data;
  },

  getBookingAnalysis: async (filters = {}) => {
    const response = await axiosInstance.get(`/reports/booking-analysis?${buildParams(filters)}`);
    return response.data;
  },

  getTopModels: async (filters = {}) => {
    const response = await axiosInstance.get(`/reports/top-models?${buildParams(filters)}`);
    return response.data;
  },
};
