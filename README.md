# 🚗 Hyundai Dealer Management System (DMS)

A comprehensive, enterprise-grade dealer management system built for Hyundai dealerships. This full-stack application streamlines vehicle inventory, bookings, customer management, test drives, and sales analytics.

![Hyundai DMS](https://img.shields.io/badge/Hyundai-DMS-002C5F?style=for-the-badge&logo=hyundai)
![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=spring-boot)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🔐 Authentication & Authorization
- **Role-Based Access Control (RBAC)**: Super Admin, Dealer Manager, Sales Executive, Senior Official
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Login**: Users can only login with their registered role
- **Password Encryption**: BCrypt password hashing

### 📊 Dashboard & Analytics
- **Real-time KPI Cards**: Total vehicles, bookings, deliveries, revenue
- **Interactive Charts**: Monthly sales trends, inventory distribution
- **Today's Schedule**: Test drives and bookings
- **Alert System**: Vehicles due for dispatch

### 🚙 Vehicle Inventory Management
- **Complete Vehicle Tracking**: VIN, model, variant, color, fuel type
- **Status Management**: In Transit, In Stockyard, In Showroom, Booked, Dispatched, Sold
- **Stockyard Map View**: Visual representation of vehicle locations
- **Advanced Filters**: Search by model, status, fuel type, transmission
- **Bulk Import**: CSV import for multiple vehicles
- **Export Functionality**: Excel export for inventory reports

### 📝 Booking Management
- **End-to-End Booking Flow**: From booking to delivery
- **Booking Status Tracking**: Pending, Confirmed, Delivered, Cancelled
- **Customer Information**: Linked to customer profiles
- **Payment Tracking**: Booking amount and payment status
- **Cancellation Management**: With reason tracking
- **Receipt Generation**: Printable booking receipts

### 👥 Customer Management
- **360° Customer View**: Complete customer profile
- **Purchase History**: All bookings and transactions
- **Test Drive History**: Past and scheduled test drives
- **Contact Management**: Email, phone, address
- **Customer Segmentation**: By purchase behavior
- **Bulk Import**: CSV import for customer data

### 🏎️ Test Drive Management
- **Scheduling System**: Date, time, vehicle selection
- **Status Tracking**: Scheduled, Completed, Cancelled, No Show
- **Customer Linking**: Associated with customer profiles
- **Vehicle Availability**: Real-time vehicle status check
- **Calendar View**: Visual schedule management
- **Feedback Collection**: Post test drive feedback

### 🔄 Exchange Management
- **Old Vehicle Evaluation**: Make, model, year, condition
- **Valuation System**: Estimated exchange value
- **Status Workflow**: Pending, Approved, Rejected, Completed
- **Document Management**: Vehicle documents and photos
- **Integration with Bookings**: Seamless exchange-to-purchase flow

### 🛠️ Accessories Management
- **Accessory Catalog**: Name, description, price, stock
- **Order Management**: Customer orders for accessories
- **Inventory Tracking**: Stock levels and reordering
- **Installation Scheduling**: Service appointments
- **Pricing Management**: Dynamic pricing and discounts

### 📈 Reports & Analytics
- **Sales Summary**: Total sales, units sold, average sale value
- **Inventory Status**: Distribution by status
- **Dispatch Summary**: On-time vs delayed deliveries
- **Booking Analysis**: Status-wise breakdown
- **Top Models**: Best-selling vehicles
- **Export Options**: PDF and Excel reports
- **Date Range Filters**: Custom reporting periods

### 🏢 Dealership Management (Admin)
- **Multi-Dealership Support**: Manage multiple locations
- **User Management**: Create and manage dealership users
- **Role Assignment**: Assign roles to users
- **Dealership Settings**: Location, contact, branding

### 🎨 UI/UX Features
- **Modern Design**: Professional automotive-grade interface
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Dark Mode Ready**: Prepared for dark theme
- **Accessibility**: WCAG compliant
- **Loading States**: Skeleton screens and spinners
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Real-time feedback

---

## 🛠️ Tech Stack

### Backend
- **Java 17**: Latest LTS version
- **Spring Boot 3.x**: Framework for building the REST API
- **Spring Security**: Authentication and authorization
- **Spring Data JPA**: Database access layer
- **MySQL**: Relational database
- **JWT**: JSON Web Tokens for authentication
- **Lombok**: Reduce boilerplate code
- **Maven**: Dependency management
- **Swagger/OpenAPI**: API documentation

### Frontend
- **React 18**: UI library
- **Vite 5**: Build tool and dev server
- **React Router v6**: Client-side routing
- **TanStack Query (React Query)**: Server state management
- **Axios**: HTTP client
- **Recharts**: Data visualization
- **Lucide React**: Icon library
- **Tailwind CSS**: Utility-first CSS framework
- **React Big Calendar**: Calendar component

### Development Tools
- **Git**: Version control
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **VS Code**: Recommended IDE

---

## 🏗️ Architecture

### System Architecture
```
┌─────────────────┐
│   React SPA     │
│   (Frontend)    │
└────────┬────────┘
         │ HTTP/REST
         │ JWT Token
┌────────▼────────┐
│  Spring Boot    │
│   REST API      │
│   (Backend)     │
└────────┬────────┘
         │ JPA/Hibernate
┌────────▼────────┐
│     MySQL       │
│   (Database)    │
└─────────────────┘
```

### Backend Architecture
```
Controller Layer (REST Endpoints)
         ↓
Service Layer (Business Logic)
         ↓
Repository Layer (Data Access)
         ↓
Database (MySQL)
```

### Frontend Architecture
```
Pages (Route Components)
         ↓
Components (Reusable UI)
         ↓
Services (API Calls)
         ↓
Context (Global State)
```

---

## 🚀 Getting Started

### Prerequisites
- **Java 17** or higher
- **Node.js 18** or higher
- **MySQL 8.0** or higher
- **Maven 3.8** or higher
- **Git**

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/vansh2503/dms.git
cd dms/backend
```

2. **Configure MySQL Database**
```bash
# Create database
mysql -u root -p
CREATE DATABASE hyundai_dms;
exit;
```

3. **Update application.properties**
```properties
# backend/src/main/resources/application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/hyundai_dms
spring.datasource.username=your_username
spring.datasource.password=your_password
```

4. **Run the application**
```bash
# Using Maven
./mvnw spring-boot:run

# Or using Maven Wrapper (Windows)
mvnw.cmd spring-boot:run
```

Backend will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ../frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
# Create .env file
cp .env.example .env

# Edit .env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_USE_MOCK_DATA=false
```

4. **Run the development server**
```bash
npm run dev
```

Frontend will start on `http://localhost:5173`

### Default Login Credentials

**Super Admin**
- Email: `admin@hyundai.com`
- Password: `Admin@123`
- Role: Super Admin

**Dealer Manager**
- Email: `manager@hyundai.com`
- Password: `Manager@123`
- Role: Dealer Manager

**Sales Executive**
- Email: `sales@hyundai.com`
- Password: `Sales@123`
- Role: Sales Executive

---

## 📁 Project Structure

```
dms/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/dms/demo/
│   │   │   │   ├── config/          # Configuration classes
│   │   │   │   ├── controller/      # REST controllers
│   │   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   ├── entity/          # JPA entities
│   │   │   │   ├── enums/           # Enumerations
│   │   │   │   ├── exception/       # Custom exceptions
│   │   │   │   ├── repository/      # JPA repositories
│   │   │   │   ├── security/        # Security configuration
│   │   │   │   ├── service/         # Business logic
│   │   │   │   └── DMSApplication.java
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── database_schema.sql
│   │   └── test/                    # Unit tests
│   ├── pom.xml
│   └── README.md
│
├── frontend/
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   ├── context/                 # React Context
│   │   ├── pages/                   # Page components
│   │   ├── services/                # API services
│   │   ├── styles/                  # CSS files
│   │   ├── utils/                   # Utility functions
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── .gitignore
├── README.md
└── ROLE_BASED_LOGIN.md
```

---

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password@123",
  "fullName": "John Doe",
  "phone": "+919876543210",
  "role": "SALES_EXECUTIVE"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "usernameOrEmail": "user@example.com",
  "password": "Password@123",
  "expectedRole": "SALES_EXECUTIVE"
}
```

### Vehicle Endpoints

#### Get All Vehicles
```http
GET /api/vehicles?status=IN_SHOWROOM&model=Creta
Authorization: Bearer {token}
```

#### Create Vehicle
```http
POST /api/vehicles
Authorization: Bearer {token}
Content-Type: application/json

{
  "vin": "MAL1234567890",
  "model": "Creta",
  "variant": "SX Diesel",
  "color": "Phantom Black",
  "fuelType": "DIESEL",
  "transmissionType": "MANUAL",
  "price": 1500000,
  "status": "IN_SHOWROOM"
}
```

### Booking Endpoints

#### Create Booking
```http
POST /api/bookings
Authorization: Bearer {token}
Content-Type: application/json

{
  "customerId": 1,
  "vehicleId": 1,
  "bookingAmount": 50000,
  "expectedDeliveryDate": "2024-02-15"
}
```

For complete API documentation, visit: `http://localhost:8080/swagger-ui.html`

---

## 📸 Screenshots

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Vehicle Inventory
![Inventory](docs/screenshots/inventory.png)

### Booking Management
![Bookings](docs/screenshots/bookings.png)

### Reports & Analytics
![Reports](docs/screenshots/reports.png)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Follow Java naming conventions
- Use meaningful variable names
- Write unit tests for new features
- Update documentation
- Follow the existing code style

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Vansh** - *Initial work* - [vansh2503](https://github.com/vansh2503)

---

## 🙏 Acknowledgments

- Hyundai Motor Company for brand guidelines
- Spring Boot community
- React community
- All contributors

---

## 📞 Support

For support, email support@hyundaidms.com or open an issue in the repository.

---

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Real-time notifications (WebSocket)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Service booking module
- [ ] Insurance management
- [ ] Finance calculator
- [ ] Customer portal
- [ ] Dealer network integration

---

**Made with ❤️ for Hyundai Dealerships**
