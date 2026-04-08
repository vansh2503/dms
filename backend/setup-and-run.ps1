# DMS Backend Setup and Run Script (PowerShell)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "DMS Backend Setup and Run Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Set environment variables
Write-Host "Setting environment variables..." -ForegroundColor Yellow
$env:DB_URL = "jdbc:mysql://localhost:3306/newdb"
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "1234"
$env:JWT_SECRET = "f8a9c3d4e5b6a7f8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2"
$env:JWT_EXPIRATION = "86400000"
Write-Host "Environment variables set!" -ForegroundColor Green
Write-Host ""

# Check Java installation
Write-Host "Checking Java installation..." -ForegroundColor Yellow
try {
    $javaVersion = java --version 2>&1
    Write-Host "Java found!" -ForegroundColor Green
    Write-Host $javaVersion[0] -ForegroundColor Gray
} catch {
    Write-Host "ERROR: Java is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Java 21 from: https://adoptium.net/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Check Maven installation
Write-Host "Checking Maven installation..." -ForegroundColor Yellow
try {
    $mavenVersion = mvn --version 2>&1
    Write-Host "Maven found!" -ForegroundColor Green
    Write-Host $mavenVersion[0] -ForegroundColor Gray
} catch {
    Write-Host "ERROR: Maven is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Maven from: https://maven.apache.org/download.cgi" -ForegroundColor Yellow
    Write-Host "Or use Chocolatey: choco install maven" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Check MySQL
Write-Host "Checking MySQL service..." -ForegroundColor Yellow
$mysqlService = Get-Service -Name "MySQL*" -ErrorAction SilentlyContinue | Where-Object {$_.Status -eq "Running"}
if ($mysqlService) {
    Write-Host "MySQL service is running!" -ForegroundColor Green
} else {
    Write-Host "WARNING: MySQL service may not be running" -ForegroundColor Yellow
    Write-Host "Please start MySQL service or check if it's installed" -ForegroundColor Yellow
}
Write-Host ""

# Configure Maven to use local settings with proxy
Write-Host "Configuring Maven proxy settings..." -ForegroundColor Yellow
$env:MAVEN_OPTS = "-s .m2\settings.xml"
Write-Host ""

# Clean and build
Write-Host "Starting Maven build with proxy configuration..." -ForegroundColor Yellow
Write-Host "Running: mvn clean install -U -s .m2\settings.xml" -ForegroundColor Gray
Write-Host ""

$buildResult = & mvn clean install -U -s .m2\settings.xml
$buildExitCode = $LASTEXITCODE

if ($buildExitCode -ne 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "BUILD FAILED!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting steps:" -ForegroundColor Yellow
    Write-Host "1. Check internet connection to Maven Central" -ForegroundColor White
    Write-Host "2. Clear Maven cache: Remove-Item -Recurse -Force $env:USERPROFILE\.m2\repository" -ForegroundColor White
    Write-Host "3. Check proxy settings in $env:USERPROFILE\.m2\settings.xml" -ForegroundColor White
    Write-Host "4. Try: mvn dependency:purge-local-repository" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "BUILD SUCCESS!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Starting Spring Boot application..." -ForegroundColor Yellow
Write-Host "Server will start on: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Swagger UI: http://localhost:8080/swagger-ui.html" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Run the application
& mvn spring-boot:run -s .m2\settings.xml
