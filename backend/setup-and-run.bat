@echo off
echo ========================================
echo DMS Backend Setup and Run Script
echo ========================================
echo.

REM Set environment variables
echo Setting environment variables...
set DB_URL=jdbc:mysql://localhost:3306/newdb
set DB_USERNAME=root
set DB_PASSWORD=1234
set JWT_SECRET=f8a9c3d4e5b6a7f8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2
set JWT_EXPIRATION=86400000
echo Environment variables set!
echo.

REM Check Java installation
echo Checking Java installation...
java --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java 21 from: https://adoptium.net/
    pause
    exit /b 1
)
echo Java found!
echo.

REM Check Maven installation
echo Checking Maven installation...
mvn --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Maven is not installed or not in PATH
    echo Please install Maven from: https://maven.apache.org/download.cgi
    echo Or use Chocolatey: choco install maven
    pause
    exit /b 1
)
echo Maven found!
echo.

REM Check MySQL
echo Checking MySQL service...
sc query MySQL80 | find "RUNNING" >nul
if %errorlevel% neq 0 (
    echo WARNING: MySQL service may not be running
    echo Please start MySQL service or check if it's installed
    echo.
)

REM Configure Maven to use local settings with proxy
echo Configuring Maven proxy settings...
set MAVEN_OPTS=-s .m2\settings.xml
echo.

REM Clean and build
echo Starting Maven build with proxy configuration...
echo Running: mvn clean install -U -s .m2\settings.xml
echo.
mvn clean install -U -s .m2\settings.xml

if %errorlevel% neq 0 (
    echo.
    echo ========================================
    echo BUILD FAILED!
    echo ========================================
    echo.
    echo Troubleshooting steps:
    echo 1. Check internet connection to Maven Central
    echo 2. Clear Maven cache: rmdir /s /q %USERPROFILE%\.m2\repository
    echo 3. Check proxy settings in %USERPROFILE%\.m2\settings.xml
    echo 4. Try: mvn dependency:purge-local-repository
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo BUILD SUCCESS!
echo ========================================
echo.
echo Starting Spring Boot application...
echo Server will start on: http://localhost:8080
echo Swagger UI: http://localhost:8080/swagger-ui.html
echo.
echo Press Ctrl+C to stop the server
echo.

REM Run the application
mvn spring-boot:run -s .m2\settings.xml
