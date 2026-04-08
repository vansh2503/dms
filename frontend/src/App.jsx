import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Bookings from './pages/Bookings';
import Customers from './pages/Customers';
import TestDrives from './pages/TestDrives';
import Exchange from './pages/Exchange';
import Accessories from './pages/Accessories';
import Variants from './pages/Variants';
import Reports from './pages/Reports';
import AdminSettings from './pages/AdminSettings';
import Unauthorized from './pages/Unauthorized';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="customers" element={<Customers />} />
              <Route path="test-drives" element={<TestDrives />} />
              <Route path="exchange" element={<Exchange />} />
              <Route path="accessories" element={<Accessories />} />
              <Route path="variants" element={<Variants />} />
              <Route path="reports" element={<Reports />} />
              <Route 
                path="admin" 
                element={
                  <PrivateRoute allowedRoles={['SUPER_ADMIN']}>
                    <AdminSettings />
                  </PrivateRoute>
                } 
              />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
