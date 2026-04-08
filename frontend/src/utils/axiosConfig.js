import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Clean up empty URLSearchParams to prevent Spring Boot 500 errors (casting empty string to Long/Enum)
    if (config.url && config.url.includes('?')) {
      const [baseUrl, queryString] = config.url.split('?');
      if (queryString) {
        const params = new URLSearchParams(queryString);
        const keysToDelete = [];
        params.forEach((value, key) => {
          if (value === '' || value === 'null' || value === 'undefined') {
            keysToDelete.push(key);
          }
        });
        keysToDelete.forEach(key => params.delete(key));
        const newQueryString = params.toString();
        config.url = newQueryString ? `${baseUrl}?${newQueryString}` : baseUrl;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Return response as-is, preserving the ApiResponse wrapper the frontend expects
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
