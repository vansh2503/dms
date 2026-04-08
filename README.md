<<<<<<< HEAD
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
=======
# crud-application



## Getting started

To make it easy for you to get started with GitLab, here's a list of recommended next steps.

Already a pro? Just edit this README.md and make it your own. Want to make it easy? [Use the template at the bottom](#editing-this-readme)!

## Add your files

- [ ] [Create](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#create-a-file) or [upload](https://docs.gitlab.com/ee/user/project/repository/web_editor.html#upload-a-file) files
- [ ] [Add files using the command line](https://docs.gitlab.com/ee/gitlab-basics/add-file.html#add-a-file-using-the-command-line) or push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin https://gitlab.haei.net/GDC-Interns-2026/crud-application.git
git branch -M master
git push -uf origin master
```

## Integrate with your tools

- [ ] [Set up project integrations](https://gitlab.haei.net/GDC-Interns-2026/crud-application/-/settings/integrations)

## Collaborate with your team

- [ ] [Invite team members and collaborators](https://docs.gitlab.com/ee/user/project/members/)
- [ ] [Create a new merge request](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)
- [ ] [Automatically close issues from merge requests](https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#closing-issues-automatically)
- [ ] [Enable merge request approvals](https://docs.gitlab.com/ee/user/project/merge_requests/approvals/)
- [ ] [Set auto-merge](https://docs.gitlab.com/ee/user/project/merge_requests/merge_when_pipeline_succeeds.html)

## Test and Deploy

Use the built-in continuous integration in GitLab.

- [ ] [Get started with GitLab CI/CD](https://docs.gitlab.com/ee/ci/quick_start/index.html)
- [ ] [Analyze your code for known vulnerabilities with Static Application Security Testing (SAST)](https://docs.gitlab.com/ee/user/application_security/sast/)
- [ ] [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/ee/topics/autodevops/requirements.html)
- [ ] [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/ee/user/clusters/agent/)
- [ ] [Set up protected environments](https://docs.gitlab.com/ee/ci/environments/protected_environments.html)

***

# Editing this README

When you're ready to make this README your own, just edit this file and use the handy template below (or feel free to structure it however you want - this is just a starting point!). Thanks to [makeareadme.com](https://www.makeareadme.com/) for this template.

## Suggestions for a good README

Every project is different, so consider which of these sections apply to yours. The sections used in the template are suggestions for most open source projects. Also keep in mind that while a README can be too long and detailed, too long is better than too short. If you think your README is too long, consider utilizing another form of documentation rather than cutting out information.

## Name
Choose a self-explaining name for your project.

## Description
Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Badges
On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals
Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation
Within a particular ecosystem, there may be a common way of installing things, such as using Yarn, NuGet, or Homebrew. However, consider the possibility that whoever is reading your README is a novice and would like more guidance. Listing specific steps helps remove ambiguity and gets people to using your project as quickly as possible. If it only runs in a specific context like a particular programming language version or operating system or has dependencies that have to be installed manually, also add a Requirements subsection.

## Usage
Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Support
Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap
If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing
State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment
Show your appreciation to those who have contributed to the project.

## License
For open source projects, say how it is licensed.

## Project status
If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.
>>>>>>> b7f0470fe485bbd12f01ce269763b05f879e7b55
