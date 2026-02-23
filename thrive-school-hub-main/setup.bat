@echo off
REM Thrive School Hub - Setup Script for Windows
REM This script sets up both backend and frontend

color 0A
cls

echo.
echo ========================================
echo  Thrive School Hub - Setup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/
    pause
    exit /b 1
)

echo [1/5] Python found. Installing backend dependencies...
cd backend
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

echo [2/5] Creating database and seeding sample data...
python seed_data.py
if errorlevel 1 (
    echo WARNING: Database seeding failed. You can run it manually later.
)

echo.
echo [3/5] Setup complete!
echo.
echo ========================================
echo  Quick Start Guide
echo ========================================
echo.
echo Backend (Flask API):
echo   1. Open Terminal/PowerShell in the 'backend' folder
echo   2. Run: python app.py
echo   3. API will be available at http://localhost:5000
echo.
echo Frontend (Web Server):
echo   1. Open Terminal/PowerShell in the 'frontend' folder
echo   2. Run: python -m http.server 3000
echo   3. Website will be available at http://localhost:3000
echo.
echo Test Credentials:
echo   Email: admin@cpace.com
echo   Password: password
echo.
echo ========================================
echo.
pause
