# Authentication Guide - Schools Database Setup

## Overview

The admin dashboard now requires **proper authentication** to add schools. Only authenticated admin users can create schools, which are then saved to the backend database and broadcast to all users in real-time.

## Authentication Flow

### Step 1: Login
1. Go to `login.html` or click "Admin" button on any page
2. Enter admin credentials:
   - **Email**: `admin@thrive.com`
   - **Password**: `admin123`
3. Session is created (stored in localStorage for demo, in cookies for production)

### Step 2: Access Admin Dashboard
1. After login, navigate to admin dashboard
2. `checkAdminAccess()` verifies admin status on page load
3. If not authenticated, redirected to login
4. Display shows logged-in admin name and email

### Step 3: Add School
1. Fill school form in dashboard
2. Click "Add School" button
3. `handleSubmit()` now:
   - Checks if user is authenticated
   - Checks if user has admin role
   - Calls `api.createSchool()` with authentication
   - Broadcasts to all open pages

### Step 4: Real-Time Sync
1. School saved to MySQL database with authenticated user session
2. Broadcast sent to listeners
3. Real-time notification appears on schools page
4. School persists permanently

## Authentication Checks

### Check #1: Page Load
```javascript
document.addEventListener('DOMContentLoaded', async () => {
    const user = await checkAdminAccess();
    if (!user) { 
        window.location.href = 'login.html'; 
        return; 
    }
    // Dashboard loads only for authenticated admins
});
```

### Check #2: Before Adding School
```javascript
if (type === 'schools') {
    const currentUser = await api.getCurrentUser();
    if (!currentUser) {
        showAlert('✗ Authentication required. Please log in first.');
        window.location.href = 'login.html';
        return;
    }
    
    if (!currentUser.is_admin) {
        showAlert('✗ Admin access required to add schools.');
        return;
    }
}
```

### Check #3: API Call
```javascript
const response = await api.createSchool(data);
// Includes credentials: 'include' to send session
// Backend verifies @admin_required decorator
```

## Error Handling

### Authentication Errors

| Error | Meaning | Action |
|-------|---------|--------|
| "Authentication required" | User not logged in | Redirect to login |
| "Admin access required" | User not admin | Show error message |
| "401 Unauthorized" | Session expired | Redirect to login |
| "403 Forbidden" | Permission denied | Show error message |
| "Network error" | Backend unreachable | Show error message |

## API Authentication Details

### Credentials Used
- **Demo**: localStorage with `cpace_user` object containing `is_admin: true`
- **Production**: Session cookies from backend authentication

### API Request Format
```javascript
await fetch('http://localhost:5000/api/schools', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',  // ← IMPORTANT: Sends session/cookies
    body: JSON.stringify(schoolData)
})
```

### Backend Validation
```python
@schools_bp.route('', methods=['POST'])
@admin_required  # ← Requires valid admin session
def create_school():
    # Only executed if admin_required passes
    return create school...
```

## Testing Authentication

### Test 1: Unauthenticated Access
1. Open new browser/incognito window
2. Go directly to admin dashboard
3. ✅ Should redirect to login

### Test 2: Non-Admin Login
1. Login with user account (non-admin)
2. Go to admin dashboard
3. ✅ Should see "not authenticated" message

### Test 3: Admin School Creation
1. Login as admin
2. Fill school form
3. Click "Add School"
4. ✅ Should show success and broadcast

### Test 4: Session Persistence
1. Login as admin
2. Close browser tab
3. Go back to dashboard with same browser
4. ✅ Should still be logged in (session persists)

### Test 5: Session Expiry
1. Login as admin
2. Wait (or manually clear localStorage)
3. Try to add school
4. ✅ Should prompt to login again

## Admin Credentials

### Demo Credentials
- **Email**: `admin@thrive.com`
- **Password**: `admin123`

### Create New Admin (if implementing user management)
1. Register with admin role
2. Backend sets `is_admin: true`
3. Can now add schools

## Security Measures

### ✅ Implemented
- Session-based authentication
- Admin role verification
- Two-level checks (page load + action)
- Error handling with user feedback
- Automatic redirect on auth failure

### 🔒 Additional Recommendations
- Use HTTPS in production
- Set secure cookies (HttpOnly, Secure flags)
- Implement session timeout (30 minutes)
- Add CSRF token to forms
- Log all admin actions (schools added, modified, deleted)
- Implement 2FA for admin accounts
- Regular security audits

## Session Management

### Session Data Stored
```javascript
{
    email: "admin@thrive.com",
    name: "Admin",
    role: "admin",
    is_admin: true,
    is_systems: false
}
```

### Session Duration
- **Demo**: Browser session (cleared on close)
- **Production**: Backend configured (typically 30-60 minutes)

### Logout
1. Click "Logout" button in sidebar
2. Session cleared from localStorage/cookies
3. Redirect to login page
4. Next access requires re-login

## Troubleshooting

### Issue: "Authentication required" keeps appearing
**Cause**: Session expired or cookies not working
**Fix**:
1. Clear browser cache and cookies
2. Log out and log in again
3. Check if localStorage is enabled

### Issue: Added as admin but can't add schools
**Cause**: Role not properly set
**Fix**:
1. Check `is_admin: true` in user object
2. Re-login to refresh session
3. Check backend logs for errors

### Issue: API returns 401 on school creation
**Cause**: Session not being sent with request
**Fix**:
1. Check `credentials: 'include'` in fetch call
2. Verify CORS allows credentials
3. Check backend session configuration

### Issue: Redirects to login on every action
**Cause**: Session not persisting
**Fix**:
1. Enable cookies in browser
2. Check localStorage is writable
3. Verify backend session persistence

## Implementation Checklist

- ✅ Added authentication check on DOMContentLoaded
- ✅ Added authentication check before school creation
- ✅ Added error handling for auth failures
- ✅ Automatic redirect to login on auth failure
- ✅ Display authenticated user info in sidebar
- ✅ Logout functionality implemented
- ✅ API calls include credentials
- ✅ Backend has @admin_required decorator
- ✅ Error messages show auth-specific errors

## Next Steps

1. **Test authentication flow** (see Testing Authentication section)
2. **Test with multiple browsers** to verify cross-browser session handling
3. **Test session expiry** to ensure timeout behavior
4. **Implement production security** (HTTPS, secure cookies, etc.)
5. **Add admin activity logging** (who created what school, when)
6. **Set up user management** (create/delete admin accounts)

## Demo Credentials

Use these to test:

```
Email: admin@thrive.com
Password: admin123
```

This account has admin privileges and can:
- Add schools to database
- Broadcast in real-time
- Access admin dashboard
- Manage other data types

---

**Authentication Status**: ✅ Fully Implemented
**Last Updated**: February 24, 2026
**Version**: 1.0
