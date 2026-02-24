# Authentication System Overview - Architecture & Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend (Browser)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐         ┌──────────────────────────┐     │
│  │  login.html      │         │  admin-dashboard.html   │     │
│  ├──────────────────┤         ├──────────────────────────┤     │
│  │ • Email input    │         │ • checkAdminAccess()    │     │
│  │ • Password input │         │ • handleSubmit()        │     │
│  │ • Form submit    │────────→│ • Add School Form       │     │
│  │ • api.login()    │         │ • broadcastNewSchool()  │     │
│  └──────────────────┘         └──────────────────────────┘     │
│         ↓                                   ↓                   │
│      Stores in                    Checks authentication          │
│    localStorage                   if type === 'schools'        │
│    (session)                       ↓                            │
│                            api.createSchool(data)              │
│                                   ↓                            │
│                         ┌──────────────────┐                   │
│                         │   api.js         │                   │
│                         ├──────────────────┤                   │
│                         │ POST /api/schools│                   │
│                         │ + credentials    │                   │
│                         │ + auth headers   │                   │
│                         └────────┬──────────┘                   │
│                                  │                             │
└──────────────────────────────────┼─────────────────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │ HTTP Request with Session  │
                    │ (cookies included)         │
                    └──────────────┬──────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────┐
│                   Backend (Flask API)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  @schools_bp.route('', methods=['POST'])                │  │
│  │  @admin_required  ← AUTHENTICATION CHECK               │  │
│  │  def create_school():                                  │  │
│  │      • Validates session/credentials                  │  │
│  │      • Verifies user.is_admin == True                │  │
│  │      • If OK → Saves to MySQL                         │  │
│  │      • If ERROR → Returns 401/403                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│         ↓                            ↓                         │
│    ┌────────────┐            ┌──────────────┐                │
│    │  MySQL     │            │  Session     │                │
│    │ Database   │            │  Manager     │                │
│    │ (schools)  │            │  (Flask)     │                │
│    └────────────┘            └──────────────┘                │
│         ↑                            │                        │
│         └────────────┬───────────────┘                        │
│                      │ Return Response                        │
│                      │ (201 Created)                          │
│                      │ (401 Unauthorized)                     │
│                      │ (403 Forbidden)                        │
│                      ↓                                        │
└─────────────────────────────────────────────────────────────────┘
         ↑
         │ Response
         │
         ↓
┌─────────────────────────────────────────────────────────────────┐
│            Frontend Response Handling                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  if (response.school) → Success → broadcastNewSchool()         │
│  if (response.error && 401) → Redirect to login                │
│  if (response.error && 403) → Show "Permission Denied"         │
│  if (error.message) → Show network error                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Authentication Flow - Step by Step

### 1. User Access Admin Dashboard

```
User visits: /admin-dashboard.html
    ↓
DOMContentLoaded triggered
    ↓
Call: checkAdminAccess()
    ↓
    ↙─────────────────────────┘
    │
    ↓ Call: api.getCurrentUser()
    ├─→ Check localStorage for 'cpace_user'
    ├─→ If exists: Return user object
    ├─→ If missing: Try backend /api/auth/me
    ├─→ If both fail: Return null
    │
    ↓ Check result
    ├─→ If null: Redirect to login.html
    ├─→ If not admin: Redirect to login.html
    └─→ If admin: Continue to dashboard

Dashboard loads
    ↓
Display user name: "Admin"
Display user email: "admin@thrive.com"
```

### 2. User Adds School

```
User fills form:
    • School Name
    • Category
    • District
    • Email
    • Phone
    • Students count
    ↓
User clicks "Add School" → Form submitted
    ↓
handleSubmit(event, 'schools') called
    ↓
    ├─→ Check: type === 'schools'?
    ├─→ Call: api.getCurrentUser()
    │
    ├─→ Check 1: Is user authenticated?
    │   ├─→ If NO: Show error + Redirect to login
    │   └─→ If YES: Continue
    │
    ├─→ Check 2: Is user admin?
    │   ├─→ If NO: Show "Admin access required" error
    │   └─→ If YES: Continue
    │
    ├─→ Extract form data
    ├─→ Show loading message: "Creating school..."
    │
    └─→ Call: api.createSchool(data)
        ↓
        Sends POST to /api/schools
        Includes: credentials: 'include'
        (Session cookies sent)
        ↓
        Backend receives:
        ├─→ @admin_required checks session
        ├─→ Verifies user.is_admin = true
        ├─→ Saves to MySQL database
        └─→ Returns school object with ID
        ↓
    Check response
    ├─→ response.school exists?
    │   ├─→ YES: Success! Show "School added"
    │   ├─→ Call: broadcastNewSchool(response.school)
    │   └─→ Close modal, refresh display
    │
    ├─→ response.error includes "401"?
    │   ├─→ YES: Session expired
    │   ├─→ Show error + Redirect to login
    │   └─→ Abort operation
    │
    ├─→ response.error includes "403"?
    │   ├─→ YES: Permission denied
    │   ├─→ Show: "You don't have permission..."
    │   └─→ Abort operation
    │
    └─→ response.error with other message?
        ├─→ YES: Show: "Error: [message]"
        └─→ Abort operation
```

### 3. Real-Time Broadcast

```
School added successfully (has database ID)
    ↓
broadcastNewSchool(school) called
    ↓
    ├─→ Channel 1: Broadcast Channel API
    │   └─→ Sends school object to 'edubridge_schools' channel
    │
    ├─→ Channel 2: Custom DOM Events
    │   └─→ Dispatches 'schoolAdded' event on document
    │
    └─→ Channel 3: localStorage
        └─→ Sets 'edubridge_last_school_added' key
    ↓
schools.html listeners catch event
    ↓
handleNewSchoolFromDashboard(school) called
    ↓
    ├─→ Add school to schoolsDatabase array
    ├─→ Reset pagination (show page 1)
    ├─→ Update category dropdown
    ├─→ Refresh school display
    ├─→ Show notification banner
    └─→ Add pulse animation to new school card
```

## Authentication Data Flow

### Login Data Structure
```javascript
{
    email: "admin@thrive.com",
    name: "Admin",
    role: "admin",
    is_admin: true,              // ← Key flag for authorization
    is_systems: false
}
```

### Session Storage
```
localStorage['cpace_user'] = JSON.stringify(authObject)
```

### API Request with Auth
```javascript
fetch('http://localhost:5000/api/schools', {
    method: 'POST',
    headers: { 
        'Content-Type': 'application/json' 
    },
    credentials: 'include',      // ← Send cookies/session
    body: JSON.stringify(schoolData)
})
```

### Backend Auth Check
```python
@admin_required  # Decorator checks:
                 # 1. Session exists
                 # 2. User is in session
                 # 3. user.is_admin == True
def create_school():
    # Only runs if all checks pass
    school = School(...)
    db.session.add(school)
    db.session.commit()
    return school
```

## Security Checkpoints

```
┌─────────────────────────────────────────────────────────┐
│ CHECKPOINT 1: Page Access                               │
├─────────────────────────────────────────────────────────┤
│ Location: admin-dashboard.html → DOMContentLoaded       │
│ Check: checkAdminAccess()                               │
│ Result: ✓ Allow | ✗ Redirect to login                  │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ CHECKPOINT 2: User Authentication                       │
├─────────────────────────────────────────────────────────┤
│ Location: handleSubmit() before API call                │
│ Check: await api.getCurrentUser()                       │
│ Result: ✓ User exists| ✗ Redirect to login             │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ CHECKPOINT 3: Admin Authorization                       │
├─────────────────────────────────────────────────────────┤
│ Location: handleSubmit() before API call                │
│ Check: currentUser.is_admin === true                    │
│ Result: ✓ Admin | ✗ Show permission error              │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ CHECKPOINT 4: Backend Session Validation                │
├─────────────────────────────────────────────────────────┤
│ Location: Backend @admin_required decorator             │
│ Check: Validate session + admin flag                    │
│ Result: ✓ Create school | ✗ Return 401/403            │
└─────────────────────────────────────────────────────────┘
```

## Error Scenarios

### Scenario 1: Not Logged In
```
User action: Try to add school (no login)
Checkpoint 1: checkAdminAccess() fails
Result: Redirect to login.html ✓
```

### Scenario 2: Non-Admin User
```
User action: Login as user (not admin) → Try to add school
Checkpoint 1: ✓ Passed (can access dashboard)
Checkpoint 3: is_admin = false
Result: Show "Admin access required" error ✓
```

### Scenario 3: Session Expired
```
User action: Session expires → Try to add school
Checkpoint 2: api.getCurrentUser() returns null
Result: Show error + Redirect to login ✓
```

### Scenario 4: Backend Rejects
```
User action: All checks pass → Backend fails
Checkpoint 4: @admin_required fails
Result: API returns 401/403
Frontend: Show error message ✓
```

## Key Functions

### checkAdminAccess()
```javascript
async function checkAdminAccess() {
    const user = await api.getCurrentUser();
    if (user && user.is_admin) {
        return user;
    }
    return null;
}
// Used: On page load to protect dashboard
```

### handleSubmit() - Schools Only
```javascript
if (type === 'schools') {
    // Check 1: Authenticated?
    const user = await api.getCurrentUser();
    if (!user) {
        // Show error + redirect
    }
    
    // Check 2: Admin?
    if (!user.is_admin) {
        // Show error
    }
    
    // If all checks pass:
    const response = await api.createSchool(data);
}
```

### api.getCurrentUser()
```javascript
async getCurrentUser() {
    // Try localStorage first
    const stored = localStorage.getItem('cpace_user');
    if (stored) {
        return JSON.parse(stored);
    }
    
    // Try backend API
    const response = await fetch('/api/auth/me');
    return response.ok ? response.json().user : null;
}
```

### api.createSchool()
```javascript
async createSchool(schoolData) {
    return await fetch('/api/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',  // ← Auth included
        body: JSON.stringify(schoolData)
    });
}
```

## Test Coverage

### Test Matrix
| Scenario | Check 1 | Check 2 | Check 3 | Check 4 | Result |
|----------|---------|---------|---------|---------|--------|
| Not logged in | ✗ FAIL | - | - | - | Login required ✓ |
| Non-admin | ✓ OK | ✓ OK | ✗ FAIL | - | Permission error ✓ |
| Admin, valid | ✓ OK | ✓ OK | ✓ OK | ✓ OK | School created ✓ |
| Session expired | ✓ OK | ✓ OK | ✓ OK | ✗ FAIL | Re-login required ✓ |
| Backend error | ✓ OK | ✓ OK | ✓ OK | ✓ OK | Error shown ✓ |

---

**Status**: ✅ Complete Multi-Layer Authentication System
**Last Updated**: February 24, 2026
