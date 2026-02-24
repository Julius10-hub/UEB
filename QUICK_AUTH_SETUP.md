# Quick Authentication Setup - Admin School Creation

## 5-Minute Setup

### Step 1: Start Backend
```bash
cd backend
python app.py
```
**Expected output**: `Running on http://localhost:5000`

### Step 2: Open Dashboard (No Login Required First Time)
1. Open: `http://localhost:3000/admin-dashboard.html`
2. You'll be redirected to login automatically

### Step 3: Login as Admin
**URL**: `http://localhost:3000/login.html`

**Demo Admin Credentials:**
```
Email:    admin@thrive.com
Password: admin123
```

**Expected**: Successful login → Redirected to dashboard

### Step 4: Verify You're Logged In
- Look for your name in the left sidebar
- See "Admin" label next to your email
- Logout button is visible

### Step 5: Add a School
1. Find "Add School" button in dashboard
2. Fill in form:
   - **School Name**: Test School
   - **Category**: Secondary
   - **District**: Kampala
   - **Email**: test@school.ug
   - **Phone**: +256700123456
   - **Students**: 500
3. Click "Add School"

**Expected Results**:
- ✅ Success message appears
- ✅ School appears in schools.html in real-time
- ✅ Green notification shows on schools page
- ✅ School persists after page refresh

## Authentication Tests

### Test 1: Direct Dashboard Access (No Login)
```
1. Clear all cookies/localStorage
2. Go to: http://localhost:3000/admin-dashboard.html
3. Expected: Redirect to login.html
```

### Test 2: Non-Admin User
```
1. Create account with email: user@test.com
2. Assign role: "user" (not admin)
3. Login with that account
4. Go to admin dashboard
5. Expected: "Admin access required" message
```

### Test 3: Add School Without Login
```
1. Open incognito/private window
2. Try to add school via console: api.createSchool({...})
3. Expected: 401 Unauthorized error
```

### Test 4: Session Persistence
```
1. Login as admin
2. Close tab (not entire browser)
3. Go back to dashboard
4. Expected: Still logged in
5. Add a school
6. Expected: Works normally
```

### Test 5: Logout
```
1. Click "Logout" button
2. Confirm logout
3. Try to add school
4. Expected: Redirected to login
```

## Demo User Accounts

| Email | Password | Role | Can Add Schools? |
|-------|----------|------|------------------|
| admin@thrive.com | admin123 | Admin | ✅ YES |
| systems@thrive.com | systems123 | Systems | ❌ NO |
| user@test.com | pass123 | User | ❌ NO |

## Verify Everything Works

### Checklist
- [ ] Backend running on port 5000
- [ ] Can login with admin@thrive.com
- [ ] Admin dashboard loads after login
- [ ] Your name shows in sidebar
- [ ] Can add school from form
- [ ] School appears in schools.html
- [ ] Green notification shows
- [ ] Schools page updates in real-time
- [ ] School persists after page refresh

## Quick Debug

### If you see "Authentication required" error:

1. **Check admin credentials**
   ```
   Email must be: admin@thrive.com
   Password must be: admin123
   ```

2. **Check backend is running**
   - Terminal should show: `Running on http://localhost:5000`
   - Visit: `http://localhost:5000/api/schools` (should return JSON)

3. **Check localStorage**
   - Press F12 → Application → LocalStorage
   - Look for key: `cpace_user`
   - Should contain: `{"email":"admin@thrive.com","is_admin":true}`

4. **Clear and retry**
   ```
   1. Clear localStorage/cookies
   2. Logout completely
   3. Close all tabs/windows
   4. Open fresh incognito window
   5. Login again
   ```

### If you see API error:

```
1. Check backend logs for error message
2. Verify API_BASE_URL in api.js is correct: http://localhost:5000/api
3. Check if MySQL is running (if configured)
4. Check network tab in F12 for actual error
```

## Console Commands

### Check current user
```javascript
await api.getCurrentUser()
// Returns: {email, name, role, is_admin, ...}
```

### Check authentication status
```javascript
const user = await api.getCurrentUser();
console.log('Admin?', user?.is_admin);
console.log('Logged in?', user ? 'YES' : 'NO');
```

### Manually logout
```javascript
await api.logout();
// Session cleared
```

### Check localStorage session
```javascript
console.log(JSON.parse(localStorage.getItem('cpace_user')))
```

## Production Considerations

When deploying to production:

1. **Enable HTTPS** - All auth requests must use HTTPS
2. **Set secure cookies** - Use HttpOnly and Secure flags
3. **Change demo credentials** - Don't use admin@thrive.com
4. **Implement session timeout** - Logout after 30 minutes
5. **Add rate limiting** - Prevent brute force attacks
6. **Enable CSRF protection** - Prevent cross-site attacks
7. **Log admin actions** - Track who created each school
8. **Use environment variables** - Store secrets safely

## Troubleshooting Flowchart

```
Try to add school
    ↓
No → "Authentication required" error
    ↓
    Check: Are you logged in?
    No → Go to login.html
    Yes ↓
    Check localStorage for cpace_user
    Missing → Re-login
    Present ↓
    Check: is_admin = true?
    No → You're not admin, need different account
    Yes ↓
    Check: Backend running?
    No → python backend/app.py
    Yes ↓
    Check browser console for error
    Follow error message
    
Yes → School added successfully! ✓
    ↓
    Check schools.html
    See school? ✓ Everything works!
    Not see? → Check real-time listeners
```

## Getting Help

If authentication doesn't work:

1. **Check logs:**
   - Backend terminal for errors
   - Browser console (F12) for JavaScript errors
   - Network tab (F12) to see API calls

2. **Verify setup:**
   - Backend running: `http://localhost:5000/`
   - Admin logged in: Email = admin@thrive.com
   - Database accessible: Check backend logs

3. **Test endpoints directly:**
   - GET `/api/schools` should return JSON
   - POST `/api/schools` should require auth

4. **Review documentation:**
   - See: AUTHENTICATION_GUIDE.md (full details)
   - See: BACKEND_INTEGRATION_GUIDE.md (API details)

---

**Quick Start**: Login → Add School → See Real-Time Update ✨

**Status**: ✅ Authentication Fully Implemented
