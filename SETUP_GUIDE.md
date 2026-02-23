# Thrive School Hub - Installation & Setup Guide

## 📋 Table of Contents
1. [System Requirements](#system-requirements)
2. [Installation](#installation)
3. [Running the Application](#running-the-application)
4. [Accessing the Website](#accessing-the-website)
5. [Database Management](#database-management)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

---

## System Requirements

### Minimum Requirements
- **Python 3.8+** - For Flask backend
- **Modern Web Browser** - Chrome, Firefox, Safari, or Edge
- **Internet Connection** - For initial setup

### Recommended
- **8GB RAM** - For smooth operation
- **SSD Storage** - For faster database operations
- **Terminal/PowerShell** - For running commands

### Operating Systems
- ✅ Windows 10/11
- ✅ macOS 10.15+
- ✅ Linux (Ubuntu, Debian, etc.)

---

## Installation

### Step 1: Download the Project
```bash
# Clone the repository or download the ZIP file
git clone <repository-url>
cd thrive-school-hub
```

### Step 2: Automatic Setup (Recommended)

#### For Windows:
```bash
# Double-click setup.bat
# OR run from PowerShell:
.\setup.bat
```

#### For Linux/macOS:
```bash
# Make the script executable and run it
chmod +x setup.sh
./setup.sh
```

### Step 3: Manual Setup (Alternative)

#### Install Backend Dependencies:
```bash
cd backend
pip install -r requirements.txt
```

#### Initialize Database with Sample Data:
```bash
# Still in backend directory
python seed_data.py
```

---

## Running the Application

### Start Backend (Flask API)

#### Windows (PowerShell):
```powershell
cd backend
python app.py
```

#### Linux/macOS (Terminal):
```bash
cd backend
python3 app.py
```

**Expected Output:**
```
 * Running on http://127.0.0.1:5000
 * Press CTRL+C to quit
```

### Start Frontend (Web Server)

#### Windows (PowerShell):
```powershell
cd frontend
python -m http.server 3000
```

#### Linux/macOS (Terminal):
```bash
cd frontend
python3 -m http.server 3000
```

**Expected Output:**
```
Serving HTTP on 0.0.0.0 port 3000 ...
```

---

## Accessing the Website

1. **Open your browser** and go to:
   ```
   http://localhost:3000
   ```

2. **You should see the Thrive School Hub homepage**

3. **Test the application:**
   - Browse schools
   - Click Activities, Bursaries, etc.
   - Try creating an account
   - Sign in with test credentials

---

## Test Credentials

Use these credentials to access the admin dashboard:

| Field | Value |
|-------|-------|
| **Email** | `admin@cpace.com` |
| **Password** | `password` |
| **Role** | Admin |

### What You Can Do as Admin:
- ✅ View admin dashboard
- ✅ Manage schools
- ✅ View user suggestions
- ✅ Add new schools
- ✅ See platform statistics

---

## Database Management

### Check Database Status
The database file is located at: `backend/thrive_school.db`

### Reset Database
To start fresh with a clean database:

```bash
cd backend

# 1. Delete the existing database
# Windows: del thrive_school.db
# Linux/Mac: rm thrive_school.db

# 2. Reseed the database
python seed_data.py
```

### View Database Contents
You can use SQLite Browser (free tool) to view the database:
- Download: https://sqlitebrowser.org/
- Open `backend/thrive_school.db`
- Explore tables and data

---

## API Endpoints

### Authentication Endpoints
```
POST   /api/auth/register     - Create new account
POST   /api/auth/login        - Sign in
POST   /api/auth/logout       - Sign out
GET    /api/auth/me           - Get current user
```

### Schools Endpoints
```
GET    /api/schools           - List all schools
GET    /api/schools?category=Primary  - Filter by category
GET    /api/schools/<id>      - Get single school
POST   /api/schools           - Create school (admin only)
```

### Other Endpoints
```
GET    /api/events            - List events
GET    /api/jobs              - List jobs
GET    /api/bursaries         - List bursaries
GET    /api/agents            - List agents
GET    /api/past-papers       - List past papers
POST   /api/suggestions       - Submit suggestion
GET    /api/suggestions       - View suggestions (admin only)
GET    /api/stats             - Get platform statistics
```

---

## Testing the API

### Using curl (Command Line):

#### Get all schools:
```bash
curl http://localhost:5000/api/schools
```

#### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cpace.com","password":"password"}'
```

### Using Postman (GUI):
1. Download Postman: https://www.postman.com/downloads/
2. Create a new request
3. Select POST method
4. URL: `http://localhost:5000/api/auth/login`
5. Add JSON body with credentials
6. Click Send

---

## Troubleshooting

### Issue: Port Already in Use

**Problem:** `Address already in use` error

**Solution:**
```bash
# Change backend port (edit backend/.env)
# Or kill the process using the port:

# Windows (PowerShell):
Get-Process | Where-Object {$_.Name -eq 'python'} | Stop-Process

# Linux/Mac:
lsof -ti:5000 | xargs kill -9
```

### Issue: Python Not Found

**Problem:** `'python' is not recognized` or `command not found`

**Solution:**
1. Install Python from: https://www.python.org/
2. Make sure to check "Add Python to PATH" during installation
3. Restart your terminal

### Issue: Module Not Found

**Problem:** `ModuleNotFoundError: No module named 'flask'`

**Solution:**
```bash
# Reinstall dependencies
cd backend
pip install --upgrade pip
pip install -r requirements.txt
```

### Issue: CORS Errors

**Problem:** Frontend can't connect to backend

**Solution:**
1. Ensure backend is running on `localhost:5000`
2. Check `frontend/js/api.js` has correct API_BASE_URL
3. Make sure CORS is enabled in `backend/app.py`

### Issue: Database Locked

**Problem:** `database is locked` error

**Solution:**
```bash
# Stop all processes and delete the database file
# then reseed it
cd backend
rm thrive_school.db  # Linux/Mac
# OR del thrive_school.db  # Windows
python seed_data.py
```

### Issue: Static Files Not Loading

**Problem:** CSS/JS files return 404

**Solution:**
1. Make sure you're in the `frontend` directory when starting the server
2. Check the URL includes directory (http://localhost:3000/styles/main.css)
3. Clear browser cache (Ctrl+Shift+Delete)

---

## Performance Tips

### Optimize Backend
```bash
# Install production WSGI server
pip install gunicorn

# Run with Gunicorn
gunicorn app:app
```

### Optimize Frontend
1. Use browser DevTools (F12) to check performance
2. Minimize CSS/JS files for production
3. Compress images
4. Enable gzip compression in server

### Database Optimization
1. Create indexes for frequently queried columns
2. Vacuum database regularly
3. Archive old data periodically

---

## Development Tips

### Enable Debug Mode
```python
# In backend/app.py
app.run(debug=True)  # Already enabled by default
```

### Live Reload Frontend
1. Use VS Code Live Server extension
2. Or use Python's `-m http.server` (which doesn't auto-reload)
3. Implement watch task with Node.js/Gulp

### Check Logs
```bash
# Backend logs appear in terminal where app.py is running
# Frontend errors visible in browser console (F12)
```

---

## Security Notes for Production

⚠️ **Before deploying to production:**

1. **Change SECRET_KEY** in `.env`:
   ```env
   SECRET_KEY=your-very-long-random-secret-key-here
   ```

2. **Set DEBUG to False**:
   ```env
   FLASK_ENV=production
   DEBUG=False
   ```

3. **Use HTTPS** - Install SSL certificate

4. **Change default password**:
   ```python
   # Edit seed_data.py before first run
   # Change admin password to something strong
   ```

5. **Use environment variables**:
   ```env
   DATABASE_URL=postgresql://...
   API_SECRET=your-secret-key
   ```

---

## Next Steps

1. ✅ **Explore the Application**
   - Browse all pages
   - Test search and filters
   - Try authentication

2. 📝 **Customize Content**
   - Add your schools
   - Upload event information
   - Create bursary listings

3. 🚀 **Deploy Online**
   - Choose hosting provider
   - Configure domain
   - Set up SSL certificate

4. 📱 **Scale the Application**
   - Add more data
   - Implement caching
   - Optimize database

---

## Getting Help

### Documentation
- Flask: https://flask.palletsprojects.com/
- SQLAlchemy: https://www.sqlalchemy.org/
- JavaScript: https://developer.mozilla.org/en-US/docs/Web/JavaScript/

### Community
- Stack Overflow: Tag your questions with [python] [flask] [javascript]
- GitHub Issues: Report bugs with detailed information
- Discord/Forums: Join developer communities

### Support
- Check README.md for more info
- Review error messages carefully
- Test endpoints individually

---

**Congratulations! Your Thrive School Hub is now set up and ready to use!** 🎉
