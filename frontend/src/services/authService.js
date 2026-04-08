import axiosInstance from '../utils/axiosConfig';

// Mock users for testing without backend
const mockUsers = [
  {
    id: 1,
    email: 'admin@hyundai.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'SUPER_ADMIN',
    dealershipId: null,
    dealershipName: 'All Dealerships'
  },
  {
    id: 2,
    email: 'manager@hyundai.com',
    password: 'manager123',
    name: 'Dealer Manager',
    role: 'DEALER_MANAGER',
    dealershipId: 1,
    dealershipName: 'Hyundai Delhi Showroom'
  },
  {
    id: 3,
    email: 'sales@hyundai.com',
    password: 'sales123',
    name: 'Sales Executive',
    role: 'SALES_EXECUTIVE',
    dealershipId: 1,
    dealershipName: 'Hyundai Delhi Showroom'
  }
];

const useMockAuth = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const authService = {
  login: async (email, password) => {
    if (useMockAuth) {
      // Mock login - simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const user = mockUsers.find(u => u.email === email && u.password === password);
      
      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        return {
          success: true,
          data: {
            token: 'mock-jwt-token-' + Date.now(),
            user: userWithoutPassword
          }
        };
      } else {
        throw new Error('Invalid credentials');
      }
    }
    
    // Backend expects 'usernameOrEmail' field, not 'email'
    const loginData = { 
      usernameOrEmail: email, 
      password 
    };
    
    const response = await axiosInstance.post('/auth/login', loginData);
    const data = response.data;
    
    // Backend returns { token, username, role, userId, dealershipId, fullName }
    if (data.token) {
      return { 
        success: true, 
        data: { 
          token: data.token, 
          user: { 
            userId: data.userId,
            username: data.username, 
            role: data.role,
            dealershipId: data.dealershipId,
            fullName: data.fullName,
            email: email // Keep email for display purposes
          } 
        } 
      };
    }
    return data;
  },

  register: async (userData) => {
    if (useMockAuth) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        message: 'Registration successful',
        data: {
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            id: Date.now(),
            ...userData,
            role: 'SALES_EXECUTIVE'
          }
        }
      };
    }
    
    // Transform frontend data to match backend expectations
    const backendData = {
      email: userData.email,
      password: userData.password,
      fullName: userData.name, // Backend expects 'fullName', not 'name'
      phone: userData.phone,
      role: userData.role,
      // Backend expects dealershipId (Long), not dealershipName
      // For now, we'll omit it - backend will handle null dealershipId
      // In production, you'd need to resolve dealershipName to dealershipId first
    };
    
    const response = await axiosInstance.post('/auth/register', backendData);
    const data = response.data;
    
    // Backend returns { token, username, role }, transform to { token, user }
    if (data.token) {
      return { 
        success: true, 
        data: { 
          token: data.token, 
          user: { 
            username: data.username, 
            role: data.role,
            email: userData.email
          } 
        } 
      };
    }
    return data;
  },

  getCurrentUser: async () => {
    if (useMockAuth) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        return {
          success: true,
          data: JSON.parse(storedUser)
        };
      }
      throw new Error('Not authenticated');
    }
    
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  }
};
