import axiosInstance from '../utils/axiosConfig';

export const modelService = {
  getAllModels: async () => {
    const response = await axiosInstance.get('/models');
    return response.data;
  }
};
