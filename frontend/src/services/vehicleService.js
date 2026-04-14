import axiosInstance from '../utils/axiosConfig';

export const vehicleService = {
  getAllVehicles: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await axiosInstance.get(`/vehicles?${params}`);
    return response.data;
  },

  // New method for advanced filtering with pagination
  getVehiclesWithFilters: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params.append(key, value);
      }
    });
    const response = await axiosInstance.get(`/vehicles?${params}`);
    return response.data;
  },

  getVehicleById: async (id) => {
    const response = await axiosInstance.get(`/vehicles/${id}`);
    return response.data;
  },

  createVehicle: async (vehicleData) => {
    const response = await axiosInstance.post('/vehicles', vehicleData);
    return response.data;
  },

  updateVehicle: async (id, vehicleData) => {
    const response = await axiosInstance.put(`/vehicles/${id}`, vehicleData);
    return response.data;
  },

  updateVehicleStatus: async (id, status) => {
    const params = new URLSearchParams({ status });
    const response = await axiosInstance.patch(`/vehicles/${id}/status?${params}`);
    return response.data;
  },

  updateVehiclePrice: async (id, price) => {
    const response = await axiosInstance.patch(`/vehicles/${id}/price`, { price });
    return response.data;
  },

  deleteVehicle: async (id) => {
    // Backend returns 204 No Content, so no response.data
    await axiosInstance.delete(`/vehicles/${id}`);
    return { success: true };
  },

  getStockyardVehicles: async () => {
    const response = await axiosInstance.get('/vehicles/stockyard');
    return response.data;
  }
};
