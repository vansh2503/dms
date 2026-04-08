import axiosInstance from '../utils/axiosConfig';

export const dashboardService = {
  // KPI Data
  getKPIData: async (dealershipId = null) => {
    const params = dealershipId ? `?dealershipId=${dealershipId}` : '';
    const response = await axiosInstance.get(`/dashboard/kpi${params}`);
    return response.data;
  },

  // Monthly Sales Chart Data
  getMonthlySales: async (dealershipId = null) => {
    const params = dealershipId ? `?dealershipId=${dealershipId}` : '';
    const response = await axiosInstance.get(`/dashboard/monthly-sales${params}`);
    return response.data;
  },

  // Inventory Status Pie Chart
  getInventoryByStatus: async (dealershipId = null) => {
    const params = dealershipId ? `?dealershipId=${dealershipId}` : '';
    const response = await axiosInstance.get(`/dashboard/inventory-status${params}`);
    return response.data;
  },

  // Today's Test Drives
  getTodayTestDrives: async (dealershipId = null) => {
    const params = dealershipId ? `?dealershipId=${dealershipId}` : '';
    const response = await axiosInstance.get(`/dashboard/today-test-drives${params}`);
    return response.data;
  },

  // Recent Bookings
  getRecentBookings: async (dealershipId = null, limit = 10) => {
    const params = new URLSearchParams();
    if (dealershipId) params.append('dealershipId', dealershipId);
    params.append('limit', limit);
    const response = await axiosInstance.get(`/dashboard/recent-bookings?${params}`);
    return response.data;
  },

  // Vehicles Due for Dispatch
  getVehiclesDueForDispatch: async (dealershipId = null) => {
    const params = dealershipId ? `?dealershipId=${dealershipId}` : '';
    const response = await axiosInstance.get(`/dashboard/due-for-dispatch${params}`);
    return response.data;
  }
};
