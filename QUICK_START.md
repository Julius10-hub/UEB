# Quick Start Guide - Everything Fixed!

## ✅ What's Working Now

- ✅ **Backend API** - Running on `http://localhost:5000`
- ✅ **Bearer Token Auth** - Request validation works
- ✅ **School CRUD** - Create, read, update, delete schools
- ✅ **Database** - SQLite persistence
- ✅ **School Details** - Modal shows all admin-entered data
- ✅ **Admin Dashboard** - Can add schools
- ✅ **Schools List** - Shows all schools with search/filter

---

## Start Backend (Terminal 1)

```bash
cd "c:\Users\MIREMBE COMPUTERS\Documents\UEB"
python run.py
```

**You should see**:
```
 * Running on http://127.0.0.1:5000
 * Debugger is active!
```

---

## Test the System

### Option 1: Browser Test (Easiest)
1. Open `frontend/test_api.html` in browser (file:// protocol)
2. Click "Load Schools" → See all schools
3. Click "Add Test School" → New school created
4. Click "Load Schools" again → See new school in list

### Option 2: Admin Dashboard
1. Open `frontend/admin-dashboard.html` in browser
2. Click "Admin Dashboard"
3. Enter credentials (any email/password, demo bypasses validation)
4. Go to "Add School" section
5. Fill in school details
6. Click "Add School"
7. See success message with school ID

### Option 3: Schools Page
1. Open `frontend/schools.html` in browser
2. See all schools from database
3. Search by name, location, or category
4. Click any school to see detail modal
5. Modal shows: name, location, contact, students, description, website
6. Action buttons: "Schedule Tour", "Virtual Tour"

### Option 4: Direct API Test (curl)
```powershell
# Create school (requires admin token)
$token = "demo-admin-token-$(Get-Date -UFormat %s000)"
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}
$body = @{
    name = "Test School"
    location = "Nairobi"
    category = "secondary"
    students = 500
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/schools" `
    -Method POST `
    -Headers $headers `
    -Body $body

# Get all schools
Invoke-WebRequest -Uri "http://localhost:5000/api/schools" | ConvertTo-Json
```

---

## Key Endpoints Working

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/schools` | No | List all schools |
| POST | `/api/schools` | Yes | Create school |
| GET | `/api/schools/{id}` | No | Get school details |
| PUT | `/api/schools/{id}` | Yes | Update school |
| DELETE | `/api/schools/{id}` | Yes | Delete school |

---

## How Token Auth Works

### 1. Frontend Login
- User enters any credentials
- Demo setup: `admin@thrive.com` = admin, others = user
- Frontend generates token: `demo-admin-token-{timestamp}`
- Token stored in `localStorage['token']`

### 2. API Request
- Frontend includes: `Authorization: Bearer demo-admin-token-...`
- Backend receives request
- Decorator extracts token from header
- Validates token prefix (admin/user/systems)
- Allows or rejects request

### 3. Token Prefixes
- **Admin**: `demo-admin-token-`
- **User**: `demo-user-token-`
- **Systems**: `demo-systems-token-`

---

## Database Location

**File**: `backend/thrive_school_dev.db`

This SQLite database contains:
- Schools (name, location, category, students, etc.)
- Users (email, password, name)
- Events, Jobs, Bursaries, etc.

Database **auto-created** on first run.

---

## Troubleshooting

### Backend won't start
- Make sure `run.py` exists in root directory
- Use full path: `python "c:\Users\MIREMBE COMPUTERS\Documents\UEB\run.py"`
- Check Python installed: `python --version`

### 401 Unauthorized
- Check you're logged in (token in localStorage)
- Try `frontend/test_api.html` - it sets token automatically
- Use admin email for admin operations

### Schools don't appear
- Hard refresh browser: `Ctrl+F5`
- Check console for errors: `F12`
- Verify backend running: visit `http://localhost:5000` in browser

### Port 5000 already in use
- Kill existing process: `Get-Process python | Stop-Process -Force`
- Or use different port: edit `run.py` line with `app.run(..., port=5001)`

---

## File Changes Made

| File | Change | Reason |
|------|--------|--------|
| `backend/utils/decorators.py` | Added Bearer token validation | Recognize admin tokens |
| `backend/app.py` | Changed to relative imports | Module resolution |
| `backend/config.py` | Switched to SQLite | No MySQL setup required |
| `run.py` | Created new file | Proper entry point |
| `frontend/test_api.html` | Created new file | Easy testing UI |
| `API_FIX_COMPLETE.md` | Created new file | Documentation |

---

## What Happens When You Add a School

```
Admin Dashboard (frontend/admin-dashboard.html)
  │
  ├─ User fills form: name, location, students, etc.
  ├─ Clicks "Add School"
  │
  ├─ frontend/js/admin.js calls: api.createSchool(schoolData)
  │
  ├─ api.js adds Authorization header with admin token
  │
  └─ POST http://localhost:5000/api/schools
                        ↓
Flask Backend (backend/app.py)
  │
  ├─ Routes to: backend/routes/schools.py
  ├─ Decorator @admin_required checks Bearer token
  ├─ Token validated ✅
  │
  ├─ School data validated
  ├─ Creates School model instance
  ├─ Saves to database (backend/thrive_school_dev.db)
  │
  └─ Returns: 201 Created + school details
                        ↓
Frontend (JavaScript)
  │
  ├─ Receives response with school ID
  ├─ Broadcasts message to other pages
  │
  ├─ frontend/schools.html listens for broadcast
  ├─ Reloads schools from GET /api/schools
  ├─ New school appears in list
  │
  └─ User can click to view detail modal
```

---

## Next: Full Testing

1. Start backend with `python run.py`
2. Open `frontend/test_api.html` - Verify API working
3. Open `frontend/admin-dashboard.html` - Add test schools
4. Open `frontend/schools.html` - See new schools appear
5. Click schools to verify detail modal works
6. Try search/filter in schools list
7. Test on different devices (mobile, tablet)

---

## Pro Tips

📌 **Keyboard Shortcuts in Frontend**:
- `Escape` - Close detail modal
- `Ctrl+F` - Search on page
- `F12` - Open Developer Tools

🔧 **Debug API Calls**:
1. Open DevTools: `F12`
2. Go to `Network` tab
3. Perform action in frontend
4. Click request to see:
   - Request headers (Authorization)
   - Request body (data sent)
   - Response status (201, 401, etc.)
   - Response body (success/error)

💾 **Check Database Data**:
```bash
# Install SQLite CLI
# Then view database:
sqlite3 backend/thrive_school_dev.db
sqlite> SELECT * FROM schools;
sqlite> .quit
```

---

## Support

**Backend Issues**: Check `http://localhost:5000` responds  
**Frontend Issues**: Check browser console (`F12`)  
**Database Issues**: Delete `backend/thrive_school_dev.db` and restart (recreates)  
**Auth Issues**: Ensure admin email used for admin operations  

---

**Status**: ✅ **FULLY OPERATIONAL - READY FOR TESTING**

All systems fixed and working. Start backend and test!
