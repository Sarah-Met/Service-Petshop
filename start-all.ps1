# Start All Services Script
# This script starts the backend microservices and React frontend

Write-Host "Starting Pet Shop Application..." -ForegroundColor Green
Write-Host ""

# Get the current directory
$baseDir = $PSScriptRoot

# Start Backend Services
$backendDir = "$baseDir\backend-microservices"

Write-Host "Starting Auth Service..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendDir'; npm run start:dev auth-service"
Start-Sleep -Seconds 2

Write-Host "Starting Pet Service..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendDir'; npm run start:dev pet-service"
Start-Sleep -Seconds 2

Write-Host "Starting Order Service..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendDir'; npm run start:dev order-service"
Start-Sleep -Seconds 2

Write-Host "Starting Appointment Service..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendDir'; npm run start:dev appointment-service"
Start-Sleep -Seconds 2

Write-Host "Starting API Gateway (Port 4000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendDir'; npm run start:dev api-gateway"
Start-Sleep -Seconds 5

# Start Frontend
Write-Host "Starting Frontend (Port 3001)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$baseDir\client'; npm start"

Write-Host ""
Write-Host "All services are starting..." -ForegroundColor Green
Write-Host ""
Write-Host "Services:" -ForegroundColor Yellow
Write-Host "  - Backend API: http://localhost:4000/api/v1" -ForegroundColor White
Write-Host "  - Frontend: http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit this window (services will continue running)..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
