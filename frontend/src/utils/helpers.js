// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format datetime
export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Get status badge color
export const getStatusColor = (status) => {
  const colors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    CANCELLED: 'bg-red-100 text-red-800',
    COMPLETED: 'bg-green-100 text-green-800',
    SCHEDULED: 'bg-blue-100 text-blue-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    EVALUATED: 'bg-purple-100 text-purple-800',
    IN_TRANSIT: 'bg-blue-100 text-blue-800',
    IN_STOCKYARD: 'bg-gray-100 text-gray-800',
    IN_SHOWROOM: 'bg-indigo-100 text-indigo-800',
    BOOKED: 'bg-yellow-100 text-yellow-800',
    DISPATCHED: 'bg-orange-100 text-orange-800',
    SOLD: 'bg-green-100 text-green-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone
export const isValidPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

// Generate booking number
export const generateBookingNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `HYN-${year}-${random}`;
};

// Download data as CSV
export const downloadCSV = (rows, filename) => {
  if (!rows || !rows.length) {
    alert('No data to export');
    return;
  }
  
  // Extract headers
  const headers = Object.keys(rows[0]).join(',');
  
  // Format body
  const body = rows.map((r) => 
    Object.values(r)
      .map((v) => {
        // Escape quotes and wrap in quotes for CSV safety
        const str = String(v ?? '');
        return '"' + str.replace(/"/g, '""') + '"';
      })
      .join(',')
  ).join('\n');
  
  const blob = new Blob([headers + '\n' + body], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'export.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
