# Hyundai Dealer Management System - Frontend

A modern, responsive web application for managing Hyundai dealership operations including inventory, bookings, test drives, customers, and more.

## 🚀 Features

- **Dashboard** - Real-time KPIs, sales trends, and inventory status
- **Inventory Management** - Vehicle tracking with stockyard map view
- **Bookings** - Complete booking lifecycle management
- **Test Drives** - Schedule and manage test drives with calendar view
- **Customer Management** - 360° customer view with history
- **Exchange Management** - Vehicle exchange and trade-in handling
- **Accessories** - Accessory catalog and sales
- **Variants** - Vehicle variant management
- **Reports** - Comprehensive sales and inventory reports
- **Admin Panel** - User, dealership, and system management

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **TanStack Query** - Server state management
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Data visualization
- **React Big Calendar** - Calendar component
- **Lucide React** - Icon library
- **date-fns** - Date utility library

## 📋 Prerequisites

- Node.js 18+ and npm
- Spring Boot backend running on `http://localhost:8080`

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vansh2503/hyundai-dms-frontend.git
   cd hyundai-dms-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   VITE_USE_MOCK_DATA=false
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   ```
   http://localhost:5173
   ```

## 🔐 Authentication

The application uses JWT-based authentication. Login credentials should be configured in your Spring Boot backend.

### Mock Mode (for testing without backend)
Set in `.env`:
```env
VITE_USE_MOCK_DATA=true
```

Mock credentials:
- **Super Admin:** admin@hyundai.com / admin123
- **Dealer Manager:** manager@hyundai.com / manager123
- **Sales Executive:** sales@hyundai.com / sales123

## 📁 Project Structure

```
hyundai-dms-frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── admin/          # Admin-specific components
│   │   ├── bookings/       # Booking components
│   │   ├── inventory/      # Inventory components
│   │   └── testdrives/     # Test drive components
│   ├── context/            # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   ├── services/           # API service layer
│   ├── styles/             # Global styles
│   ├── utils/              # Utility functions
│   ├── App.jsx             # Root component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global CSS
├── public/                 # Static assets
├── md/                     # Documentation
├── .env.example            # Environment template
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
└── tailwind.config.js      # Tailwind configuration
```

## 🎨 Styling

The application uses Tailwind CSS with custom Hyundai brand colors:

- **Primary Blue:** #002C5F
- **Light Blue:** #00AAD2
- **Dark Blue:** #001A3D
- **Accent:** #0E4C92

Custom styles are defined in `src/index.css` and follow the Hyundai brand design system.

## 🔌 API Integration

The frontend connects to a Spring Boot backend via Axios. All API calls are configured in `src/utils/axiosConfig.js` with:

- Automatic JWT token injection
- Request/response interceptors
- Error handling
- 401 redirect to login

### Service Layer

Each feature has a dedicated service file in `src/services/`:
- `authService.js` - Authentication
- `vehicleService.js` - Vehicle operations
- `bookingService.js` - Booking operations
- `testDriveService.js` - Test drive operations
- `customerService.js` - Customer operations
- And more...

## 🧪 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Code Style

- ESLint configuration included
- Follow React best practices
- Use functional components with hooks
- Implement proper error handling

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Environment Variables for Production

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_USE_MOCK_DATA=false
```

### Deploy to Vercel/Netlify

1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

## 🔒 Security

- JWT tokens stored in localStorage
- Automatic token refresh on API calls
- Protected routes with authentication guards
- Role-based access control (RBAC)
- CORS configured for backend communication

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1366px+)
- Tablet (768px+)
- Mobile (320px+)

## 🐛 Troubleshooting

### Backend Connection Issues

1. Verify backend is running on `http://localhost:8080`
2. Check CORS configuration in Spring Boot
3. Ensure `.env` has correct `VITE_API_BASE_URL`
4. Check browser console for errors

### Build Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

### Authentication Issues

1. Check JWT token in localStorage
2. Verify token expiration
3. Check backend authentication endpoint
4. Clear browser cache and localStorage

## 📚 Documentation

Additional documentation available in the `md/` directory:
- API Endpoints
- Component Integration
- Dashboard Guide
- Developer Guide
- Deployment Guide
- And more...

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software for Hyundai dealership management.

## 👥 Authors

- **Vansh** - Initial work - [vansh2503](https://github.com/vansh2503)

## 🙏 Acknowledgments

- Hyundai Motor Company for brand guidelines
- React community for excellent tools and libraries
- All contributors who helped with the project

## 📞 Support

For support, email support@hyundai-dms.com or open an issue in the repository.

---

**Built with ❤️ for Hyundai Dealerships**
