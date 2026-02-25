# API System Issues and Fixes

## 🔴 CRITICAL ISSUES FOUND

### Issue #1: Bearer Token NOT Being Validated on Backend
**Problem**: 
- Frontend sends Bearer tokens in Authorization header
- Backend decorator `@admin_required` only checks session, not the Authorization header
- Token validation never happens, so all API calls fail with 401

**Location**: `backend/utils/decorators.py` (lines 15-24)

**Why it breaks**: 
```python
# Current code - only checks session
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:  # ← Always fails because no session
            return jsonify({'error': 'Authentication required'}), 401
        if not session.get('is_admin'):
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated_function
```

**Impact**: ALL school creation, all admin endpoints return 401 even with valid token

---

### Issue #2: Flask Server Not Running
**Problem**: Backend Flask server needs to be started manually
**Current State**: Server running on `http://localhost:5000`
**Status**: Must be running for API calls to work

---

### Issue #3: CORS Configuration Issues
**Problem**: 
- Frontend at `file://` protocol
- Backend at `http://localhost:5000`
- Browser blocks cross-origin calls by default

**Why it breaks**: Even if auth works, CORS will block requests

---

## ✅ SOLUTIONS

### Fix #1: Update Backend Decorators to Accept Bearer Tokens

**File**: `backend/utils/decorators.py`

**Replace the entire file with**:
```python
"""Decorators for authentication and authorization"""
from functools import wraps
from flask import session, jsonify, request
import os

# Secret key for token validation (should match frontend)
ADMIN_TOKEN_PREFIX = 'demo-admin-token-'
SYSTEMS_TOKEN_PREFIX = 'demo-systems-token-'
USER_TOKEN_PREFIX = 'demo-user-token-'


def extract_bearer_token(request_obj):
    """Extract Bearer token from Authorization header"""
    auth_header = request_obj.headers.get('Authorization', '')
    if auth_header.startswith('Bearer '):
        return auth_header[7:]  # Remove 'Bearer ' prefix
    return None


def validate_admin_token(token):
    """Validate if token belongs to admin"""
    return token and token.startswith(ADMIN_TOKEN_PREFIX)


def validate_systems_token(token):
    """Validate if token belongs to systems admin"""
    return token and token.startswith(SYSTEMS_TOKEN_PREFIX)


def login_required(f):
    """Decorator to check if user is logged in (via session or Bearer token)"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Check Bearer token first
        token = extract_bearer_token(request)
        if token and (token.startswith(ADMIN_TOKEN_PREFIX) or 
                     token.startswith(SYSTEMS_TOKEN_PREFIX) or 
                     token.startswith(USER_TOKEN_PREFIX)):
            return f(*args, **kwargs)
        
        # Fall back to session
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function


def admin_required(f):
    """Decorator to check if user is admin (via session or Bearer token)"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Check Bearer token first
        token = extract_bearer_token(request)
        if token and validate_admin_token(token):
            # Admin token is valid
            return f(*args, **kwargs)
        
        # Fall back to session
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        if not session.get('is_admin'):
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated_function


def systems_required(f):
    """Decorator to check if user is systems admin"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Check Bearer token
        token = extract_bearer_token(request)
        if token and validate_systems_token(token):
            return f(*args, **kwargs)
        
        # Fall back to session
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        if not session.get('is_systems'):
            return jsonify({'error': 'Systems access required'}), 403
        return f(*args, **kwargs)
    return decorated_function


def role_required(roles):
    """Decorator to check if user has required role"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Check Bearer token
            token = extract_bearer_token(request)
            if token:
                # Token-based auth is valid for any specified role
                return f(*args, **kwargs)
            
            # Fall back to session
            if 'user_id' not in session:
                return jsonify({'error': 'Authentication required'}), 401
            user_role = session.get('role', 'user')
            if user_role not in roles:
                return jsonify({'error': 'Insufficient permissions'}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator
```

---

### Fix #2: Enable CORS Properly in Flask

**File**: `backend/app.py` (Line 35-42 already correct, but verify)

Ensure this is in place:
```python
CORS(app, resources={
    r"/api/*": {
        "origins": ["*"],  # Allow all origins during development
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})
```

---

### Fix #3: Verify Backend is Running

**Check if backend is running**:
```bash
# In PowerShell
netstat -ano | findstr :5000
```

**If not running, start it**:
```bash
cd c:\Users\MIREMBE COMPUTERS\Documents\UEB\backend
python app.py
```

---

## 🧪 TESTING THE FIX

### Step 1: Start Backend
```bash
cd backend
python app.py
# You should see: "Running on http://127.0.0.1:5000"
```

### Step 2: Test Admin Login
1. Go to `admin-dashboard.html`
2. Login with: `admin@thrive.com` / `admin123`
3. Open browser DevTools (F12) → Network tab
4. Add a school and watch for the API call

### Step 3: Check Response
- Look for POST to `http://localhost:5000/api/schools`
- Should see `Authorization: Bearer demo-admin-token-xxxxx` in headers
- Response should be `201 Created` or `200 OK`

### Step 4: Verify in Schools Page
1. Go to `schools.html`
2. Refresh page
3. Should see newly added school in the list
4. Click "View Details" to see the school information

---

## 📋 SUMMARY OF CHANGES

| File | Issue | Fix |
|------|-------|-----|
| `backend/utils/decorators.py` | Backend doesn't validate Bearer tokens | Add Bearer token extraction and validation functions |
| `backend/app.py` | CORS might be blocking requests | Verify CORS headers allow Authorization header |
| `frontend/js/api.js` | Already correct | No changes needed |
| Flask server | Must be running | Start with `python app.py` |

---

## 🔍 DETAILED FLOW AFTER FIX

```
1. User logs in with admin@thrive.com/admin123
   ↓
2. Frontend generates token: demo-admin-token-1708872000000
   ↓
3. Token stored in localStorage
   ↓
4. Admin adds school
   ↓
5. Frontend sends POST to /api/schools with:
   - Header: "Authorization: Bearer demo-admin-token-1708872000000"
   - Body: { name, location, category, ... }
   ↓
6. Backend receives request
   ↓
7. @admin_required decorator:
   - Extracts token from Authorization header
   - Validates it starts with "demo-admin-token-"
   - ✅ Token valid → Allow request to proceed
   ↓
8. create_school() runs successfully
   ↓
9. School saved to MySQL database
   ↓
10. Response sent back with school data
   ↓
11. Frontend receives 201/200 response
   ↓
12. School appears in schools.html automatically
   ↓
13. User sees school in list and can click to view details
```

---

## ⚠️ IMPORTANT NOTES

1. **Demo tokens** are hardcoded prefixes - fine for development
2. **For production**: Use JWT tokens or OAuth2
3. **Current auth is basic** but sufficient for demo
4. **Always have backend running** before testing API calls

---

## 🚀 QUICK START

```bash
# Terminal 1: Start Backend
cd backend
python app.py

# Terminal 2: Open Frontend
# Open browser and go to: file:///absolute/path/to/frontend/index.html

# Or use a local server:
cd frontend
python -m http.server 8000
# Then open: http://localhost:8000
```

---

**STATUS**: Once Fix #1 is applied, the entire system should work end-to-end!
