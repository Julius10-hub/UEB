# Bearer Token Authentication Implementation

## Overview
The authentication system has been updated to use Bearer token authentication (JWT-style tokens) instead of just session cookies. This provides better security and compatibility with modern APIs.

## Changes Made

### 1. **js/api.js Updates**

#### New Helper Function
```javascript
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}
```

#### Login Method
- Now stores a Bearer token in localStorage after successful login
- Demo credentials create demo tokens:
  - `admin@thrive.com` → `demo-admin-token-{timestamp}`
  - `systems@thrive.com` → `demo-systems-token-{timestamp}`
  - Backend login → uses token from server response (if provided)

#### Create School Method
```javascript
async createSchool(schoolData) {
    const token = localStorage.getItem('token');
    if (!token) {
        return { error: 'Authentication required. Please log in first.' };
    }
    
    const response = await fetch(`${API_BASE_URL}/schools`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(schoolData)
    });
    
    // Handle auth errors
    if (response.status === 401) {
        localStorage.removeItem('token');
        return { error: 'Unauthorized - Session expired. Please log in again.' };
    }
    
    if (response.status === 403) {
        return { error: 'Forbidden - You do not have permission to add schools.' };
    }
    
    return await response.json();
}
```

#### Logout Method
- Now removes the token from localStorage
- Sends Bearer token with logout request to backend

## How It Works

### Flow Diagram
```
1. User Login (admin@thrive.com / admin123)
   ↓
2. localStorage stores token: 'demo-admin-token-{timestamp}'
   ↓
3. Add School → createSchool() is called
   ↓
4. Token retrieved from localStorage
   ↓
5. Authorization header: `Bearer token-value-here`
   ↓
6. Server validates Bearer token
   ↓
7. Creates school or returns 401/403 error
```

### Token Storage
- **Storage Location**: `localStorage['token']`
- **Format**: Bearer token (JWT or custom UUID)
- **Lifetime**: Session-based (cleared on logout)
- **Fallback**: Demo tokens for demo credentials

## Demo Credentials

| Email | Password | Role | Token Type |
|-------|----------|------|-----------|
| `admin@thrive.com` | `admin123` | Admin | Demo token |
| `systems@thrive.com` | `systems123` | Systems | Demo token |

## Error Handling

| Status Code | Error Message | Action |
|-------------|--------------|--------|
| 401 | Unauthorized | Clear token, redirect to login |
| 403 | Forbidden | Show permission denied message |
| Network error | Connection failed | Show error message |

## Testing the Bearer Token

### In Browser Console
```javascript
// Check if token is stored
console.log(localStorage.getItem('token'));

// Manually add school with token
const token = localStorage.getItem('token');
fetch('http://localhost:5000/api/schools', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'Test School',
    category: 'secondary',
    city: 'Kampala',
    location: 'Downtown'
  })
});
```

### Steps to Verify
1. **Login**: Use admin credentials (admin@thrive.com / admin123)
2. **Check Token**: Open DevTools → Storage → localStorage → look for "token"
3. **Add School**: Fill school form and submit
4. **Verify Request**: DevTools → Network → POST /api/schools
   - Check Headers → Authorization: `Bearer {token}`
5. **Check Result**: School should be created and appear in list

## Backend Requirements

Your Flask backend should:

1. **Accept Bearer tokens** in Authorization header
2. **Extract token** from: `Authorization: Bearer <token>`
3. **Validate token** (JWT decode, signature verification)
4. **Return 401** if token is missing or invalid
5. **Return 403** if token is valid but user lacks admin permission

### Example Flask Decorator
```python
def require_bearer_token(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return {'error': 'Missing authorization header'}, 401
        
        try:
            parts = auth_header.split()
            if len(parts) != 2 or parts[0] != 'Bearer':
                return {'error': 'Invalid authorization header'}, 401
            
            token = parts[1]
            # Validate token (decode JWT, etc.)
            # user = decode_token(token)
            
        except Exception as e:
            return {'error': 'Invalid token'}, 401
        
        return f(*args, **kwargs)
    return decorated_function

# Usage
@app.route('/api/schools', methods=['POST'])
@login_required
@admin_required
def create_school():
    # Token already validated by decorator
    pass
```

## Security Notes

1. **HTTPS in Production**: Always use HTTPS with Bearer tokens
2. **Token Expiration**: Implement token expiration (30-60 minutes)
3. **Refresh Tokens**: Consider implementing refresh token flow
4. **Secure Storage**: In production, consider using HTTPOnly cookies instead of localStorage
5. **CORS**: Ensure backend has proper CORS configuration

## Callbacks Used

After login success, the system:
- ✅ Stores user in localStorage['cpace_user']
- ✅ Stores token in localStorage['token']
- ✅ Updates admin dashboard UI
- ✅ Enables school creation form

## Debug Commands

```javascript
// View current user
JSON.parse(localStorage.getItem('cpace_user'))

// View stored token
localStorage.getItem('token')

// View all auth data
{ user: JSON.parse(localStorage.getItem('cpace_user')), token: localStorage.getItem('token') }

// Clear all auth data
localStorage.removeItem('cpace_user'); localStorage.removeItem('token');

// Simulate logout
api.logout()
```

## Troubleshooting

### Issue: "401 Unauthorized" when creating school
**Solution**: 
- Verify token exists: `localStorage.getItem('token')`
- Re-login to refresh token
- Check backend token validation logic

### Issue: "403 Forbidden" when creating school
**Solution**:
- Verify user is admin: `JSON.parse(localStorage.getItem('cpace_user')).is_admin === true`
- Check backend @admin_required decorator

### Issue: Token not being sent
**Solution**:
- Verify Authorization header is correct: `Bearer {token}`
- Check DevTools Network tab → Request Headers
- Ensure token was stored during login

## Next Steps

1. **Backend Integration**: Update Flask routes to validate Bearer tokens
2. **Token Refresh**: Implement token expiration and refresh flow
3. **Production Security**: Switch to HTTPOnly cookies and HTTPS
4. **Admin Roles**: Add more granular role-based access control

