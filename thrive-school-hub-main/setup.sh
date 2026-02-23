#!/bin/bash

# Thrive School Hub - Setup Script for Linux/macOS
# This script sets up both backend and frontend

echo ""
echo "=========================================="
echo " Thrive School Hub - Setup"
echo "=========================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed."
    echo "Please install Python from https://www.python.org/"
    exit 1
fi

echo "✓ Python 3 found"

# Navigate to backend directory
cd backend || { echo "ERROR: Backend directory not found"; exit 1; }

echo "[1/5] Installing backend dependencies..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install backend dependencies"
    exit 1
fi

echo "[2/5] Creating database and seeding sample data..."
python3 seed_data.py
if [ $? -ne 0 ]; then
    echo "WARNING: Database seeding failed. You can run it manually later."
fi

cd ..

echo "[3/5] Setup complete!"
echo ""
echo "=========================================="
echo " Quick Start Guide"
echo "=========================================="
echo ""
echo "Backend (Flask API):"
echo "  1. Open Terminal in the 'backend' folder"
echo "  2. Run: python3 app.py"
echo "  3. API will be available at http://localhost:5000"
echo ""
echo "Frontend (Web Server):"
echo "  1. Open Terminal in the 'frontend' folder"
echo "  2. Run: python3 -m http.server 3000"
echo "  3. Website will be available at http://localhost:3000"
echo ""
echo "Test Credentials:"
echo "  Email: admin@cpace.com"
echo "  Password: password"
echo ""
echo "=========================================="
echo ""
