# DMS Backend - Spring Boot Application

## ✅ LATEST UPDATE: Spring Boot Version Fixed

**Issue Resolved**: Changed Spring Boot from non-existent version 4.0.3 to stable version 3.2.5  
**Status**: Ready to build and run  
**Details**: See `../VERSION_FIX_COMPLETE.md`

---

## 🚀 Quick Start

### Automated Setup (Recommended)
```powershell
# PowerShell
.\setup-and-run.ps1

# Or CMD
setup-and-run.bat
```

### Manual Setup
```powershell
# 1. Set environment variables
$env:DB_PASSWORD="1234"
$env:JWT_SECRET="f8a9c3d4e5b6a7f8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2"

# 2. Build and run
mvn clean install -U -s .m2\settings.xml
mvn spring-boot:run -s .m2\settings.xml
```

---

## 📋 Prerequisites

- **Java 21**: [Download](https://adoptium.net/temurin/releases/?version=21)
- **Maven 3.6+**: [Download](https://maven.apache.org/download.cgi) or `choco install maven`
- **MySQL 8.0**: Running on port 3306 with database `newdb`
- **Corporate Proxy**: Pre-configured (Zscaler: 10.108.27.29:8080)

---

## 🔧 Configuration

### Environment Variables
```bash
DB_URL=jdbc:mysql://localhost:3306/newdb
DB_USERNAME=root
DB_PASSWORD=1234
JWT_SECRET=your-secret-key
JWT_EXPIRATION=86400000
```

### Database Setup
```sql
CREATE DATABASE IF NOT EXISTS newdb;
```

### Proxy Configuration
Maven proxy is pre-configured in `.m2/settings.xml` for Zscaler corporate network.

---

## 📁 Project Structure

```
backend/
├── src/main/java/com/dms/demo/
│   ├── config/          # Security, CORS, JPA, Cache configs
│   ├── controller/      # REST API endpoints
│   ├── dto/            # Request/Response DTOs
│   ├── entity/         # JPA entities
│   ├── repository/     # Data access layer
│   ├── service/        # Business logic
│   └── security/       # JWT authentication
├── src/main/resources/
│   ├── application.properties  # App configuration
│   └── data.sql               # Initial data
└── pom.xml             # Maven dependencies
```

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:8080
```

### Swagger UI
```
http://localhost:8080/swagger-ui.html
```

### Key Endpoints
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/vehicles` - List vehicles
- `GET /api/customers` - List customers
- `GET /api/bookings` - List bookings
- `GET /api/dashboard` - Dashboard statistics

---

## 🧪 Testing

### Test Proxy Connection
```powershell
.\test-proxy.ps1
```

### Run Tests
```bash
mvn test -s .m2\settings.xml
```

### Test API
```bash
# Health check
curl http://localhost:8080/actuator/health

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear Maven cache
Remove-Item -Recurse -Force $env:USERPROFILE\.m2\repository
mvn clean install -U -s .m2\settings.xml
```

### Port Already in Use
```bash
# Find and kill process on port 8080
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### MySQL Connection Error
```bash
# Check MySQL service
sc query MySQL80
net start MySQL80

# Verify database exists
mysql -u root -p
SHOW DATABASES;
```

### Proxy Issues
```bash
# Test proxy connectivity
curl -x http://10.108.27.29:8080 -I https://repo.maven.apache.org/maven2/

# Verify Maven proxy settings
mvn help:system -s .m2\settings.xml | findstr proxy
```

---

## 📚 Documentation

- **Full Setup Guide**: `../BACKEND_FIX_GUIDE.md`
- **Quick Commands**: `../QUICK_FIX_COMMANDS.md`
- **Proxy Setup**: `../PROXY_SETUP_COMPLETE.md`
- **Environment Variables**: `.env.example`

---

## 🔐 Security

### Development
- Credentials use environment variables with fallback defaults
- JWT secret should be changed for production

### Production
```powershell
# Generate secure JWT secret
$bytes = New-Object byte[] 32
[Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes)
[Convert]::ToBase64String($bytes)

# Set permanent environment variables
# Win + X → System → Advanced → Environment Variables
```

---

## 🛠️ Tech Stack

- **Framework**: Spring Boot 4.0.3
- **Language**: Java 21
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA / Hibernate
- **Security**: Spring Security + JWT
- **API Docs**: Springdoc OpenAPI (Swagger)
- **Build Tool**: Maven 3.x
- **Cache**: Spring Cache

---

## 📦 Dependencies

- Spring Boot Starter Web
- Spring Boot Starter Data JPA
- Spring Boot Starter Security
- Spring Boot Starter Validation
- MySQL Connector
- JJWT (JWT library)
- Lombok
- Springdoc OpenAPI

---

## 🚦 Application Status

### Success Indicators
```
Started DMSApplication in X.XXX seconds
Tomcat started on port(s): 8080 (http)
```

### Health Check
```bash
curl http://localhost:8080/actuator/health
```

Expected response:
```json
{"status":"UP"}
```

---

## 📝 Notes

- Maven wrapper (`mvnw.cmd`) is blocked by group policy - use system Maven
- Corporate proxy (Zscaler) is pre-configured in `.m2/settings.xml`
- Database schema is auto-created/updated via Hibernate
- Default admin user may be created via `data.sql`

---

## 🤝 Support

For issues or questions:
1. Check troubleshooting section above
2. Review full documentation in parent directory
3. Run proxy test: `.\test-proxy.ps1`
4. Check application logs in `target/`

---

**Version**: 0.0.1-SNAPSHOT  
**Last Updated**: 2026-03-30
