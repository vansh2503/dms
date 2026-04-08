import axiosInstance from '../utils/axiosConfig';

export const bookingService = {
  getAllBookings: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await axiosInstance.get(`/bookings?${params}`);
    return response.data;
  },

  // New method for advanced filtering with pagination
  getBookingsWithFilters: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params.append(key, value);
      }
    });
    const response = await axiosInstance.get(`/bookings/filter?${params}`);
    return response.data;
  },

  getBookingById: async (id) => {
    const response = await axiosInstance.get(`/bookings/${id}`);
    return response.data;
  },

  createBooking: async (bookingData) => {
    const response = await axiosInstance.post('/bookings', bookingData);
    return response.data;
  },

  updateBooking: async (id, bookingData) => {
    const response = await axiosInstance.put(`/bookings/${id}`, bookingData);
    return response.data;
  },

  cancelBooking: async (id, cancellationData) => {
    const response = await axiosInstance.post(`/bookings/${id}/cancel`, cancellationData);
    return response.data;
  },

  getBookingReport: async (filters) => {
    const params = new URLSearchParams(filters);
    const response = await axiosInstance.get(`/bookings/report?${params}`);
    return response.data;
  },

  updateBookingStatus: async (id, status) => {
    const response = await axiosInstance.patch(`/bookings/${id}/status`, { status });
    return response.data;
  },

  updateDeliveryDate: async (id, date) => {
    const response = await axiosInstance.patch(`/bookings/${id}/delivery-date`, { expectedDeliveryDate: date });
    return response.data;
  }
};
