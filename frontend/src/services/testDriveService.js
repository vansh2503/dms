import axiosInstance from '../utils/axiosConfig';

export const testDriveService = {
  getAllTestDrives: async () => {
    const response = await axiosInstance.get('/test-drives');
    return response.data;
  },

  getTestDriveById: async (id) => {
    const response = await axiosInstance.get(`/test-drives/${id}`);
    return response.data;
  },

  createTestDrive: async (testDriveData) => {
    const response = await axiosInstance.post('/test-drives', testDriveData);
    return response.data;
  },

  updateStatus: async (id, status, feedback = null) => {
    const params = new URLSearchParams({ status });
    if (feedback) params.append('feedback', feedback);
    const response = await axiosInstance.patch(`/test-drives/${id}/status?${params.toString()}`);
    return response.data;
  },

  cancelTestDrive: async (id) => {
    const response = await axiosInstance.delete(`/test-drives/${id}`);
    return response.data;
  }
};
