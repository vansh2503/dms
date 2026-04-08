import axiosInstance from '../utils/axiosConfig';

export const adminService = {
  // User Management
  getAllUsers: async () => {
    const response = await axiosInstance.get('/users');
    return response.data;
  },

  createUser: async (userData) => {
    const response = await axiosInstance.post('/users', userData);
    return response.data;
  },

  updateUser: async (userId, userData) => {
    const response = await axiosInstance.put(`/users/${userId}`, userData);
    return response.data;
  },

  toggleUserStatus: async (userId) => {
    const response = await axiosInstance.patch(`/users/${userId}/toggle-status`);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await axiosInstance.delete(`/users/${userId}`);
    return response.data;
  },

  // Dealership Management
  getAllDealerships: async () => {
    const response = await axiosInstance.get('/dealerships');
    return response.data;
  },

  createDealership: async (dealershipData) => {
    const response = await axiosInstance.post('/dealerships', dealershipData);
    return response.data;
  },

  updateDealership: async (dealershipId, dealershipData) => {
    const response = await axiosInstance.put(`/dealerships/${dealershipId}`, dealershipData);
    return response.data;
  },

  deleteDealership: async (dealershipId) => {
    const response = await axiosInstance.delete(`/dealerships/${dealershipId}`);
    return response.data;
  },

  // System Settings
  getSystemSettings: async () => {
    const response = await axiosInstance.get('/settings');
    return response.data;
  },

  updateSystemSettings: async (settings) => {
    const response = await axiosInstance.put('/settings', settings);
    return response.data;
  },

  // Audit Log
  getAuditLogs: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await axiosInstance.get(`/audit-logs?${params}`);
    return response.data;
  }
};
