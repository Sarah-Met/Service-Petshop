# Start All Services Script
# This script starts the monolithic backend and React frontend

Write-Host "Starting Pet Shop Application..." -ForegroundColor Green
Write-Host ""

# Get the current directory
$baseDir = $PSScriptRoot

# Start Backend
Write-Host "Starting Backend (Port 3000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$baseDir\backend'; npm run start:dev"
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "Starting Frontend (Port 3001)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$baseDir\client'; npm start"

Write-Host ""
Write-Host "All services are starting..." -ForegroundColor Green
Write-Host ""
Write-Host "Services:" -ForegroundColor Yellow
Write-Host "  - Backend API: http://localhost:3000/api/v1" -ForegroundColor White
Write-Host "  - Frontend: http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit this window (services will continue running)..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
