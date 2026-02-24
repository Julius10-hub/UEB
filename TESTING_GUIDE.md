# Quick Testing Guide - Schools Database Integration

## Pre-Test Checklist

- [ ] Python is installed
- [ ] Backend dependencies are installed
- [ ] MySQL/Database is configured
- [ ] Browser supports Broadcast Channel API (Chrome, Edge, Firefox)
- [ ] Ports 5000 (backend) and 3000/8000 (frontend) are available

## Test Steps

### Step 1: Start the Backend Server

```powershell
# Open PowerShell and run:
cd "c:\Users\MIREMBE COMPUTERS\Documents\UEB"
cd backend
python app.py
```

**Expected Output:**
```
* Running on http://localhost:5000
* Debug mode: on
* WARNING: This is a development server. Do not use it in production.
```

### Step 2: Verify Backend is Working

Open browser and visit: `http://localhost:5000/api/schools`

**Expected Result:**
```json
{
  "schools": [...],
  "total": 8,
  "pages": 1,
  "current_page": 1
}
```

### Step 3: Open Two Browser Windows

**Window 1 (Dashboard - Admin Panel)**
- URL: `http://localhost:3000/admin-dashboard.html`
- (or wherever your frontend is served)

**Window 2 (Schools Page)**
- URL: `http://localhost:3000/schools.html`

### Step 4: Add a School

In **Window 1 (Admin Dashboard)**:

1. Look for the "Add School" button
2. Fill in the form:
   - **School Name**: "Test School 2024"
   - **Category**: "Secondary"
   - **District**: "Kampala"
   - **Email**: "test@school.ug"
   - **Phone**: "+256700123456"
   - **Students**: "500"

3. Click "Add School" button

### Step 5: Verify Real-Time Update

In **Window 2 (Schools Page)**:

**Expected results**:
1. ✅ Green notification banner appears at top: "✨ Test School 2024 just added to the platform"
2. ✅ New school appears at the top of the schools grid
3. ✅ School card has a pulse animation around border (2 seconds)
4. ✅ Notification disappears after 5 seconds (or click X to close)
5. ✅ New school remains visible in the list
6. ✅ Category dropdown updates to include new category if applicable

### Step 6: Additional Validations

#### Test 6a: Search Filter
1. In Window 2, search for "Test School 2024" in the search box
2. School should appear in results

#### Test 6b: Category Filter  
1. Filter by category of the school you added
2. New school should appear in filtered results

#### Test 6c: Reload Page
1. Refresh the schools.html page (Window 2)
2. New school should still be there
3. Browser should fetch fresh data from API

#### Test 6d: Multiple Additions
1. Add 3 more schools from dashboard
2. Each should appear in real-time on schools page
3. All should persist after page reload

#### Test 6e: Cross-Browser Test
1. Open schools.html in a different browser (if available)
2. Add school from dashboard
3. Check if it appears in the other browser too

## Expected Behavior

| Action | Expected Result | Status |
|--------|-----------------|--------|
| Add school in dashboard | Appears in schools page within 1 second | ✅ |
| Notification shows | Green banner at top with school name | ✅ |
| Search works | New school found by name | ✅ |
| Filter works | School appears in category filter | ✅ |
| Page reload | School persists (from database) | ✅ |
| Multiple schools | All appear without conflicts | ✅ |

## Troubleshooting During Testing

### Issue: Schools page shows "No schools found"

**Cause**: API might not be returning data

**Fix**:
1. Check backend is running
2. Check browser console (F12) for errors
3. Visit `http://localhost:5000/api/schools` directly in browser
4. Check database connection

**Code to debug**:
```javascript
// Add this to browser console:
fetch('http://localhost:5000/api/schools')
  .then(r => r.json())
  .then(data => console.log(data))
```

### Issue: Notification doesn't appear

**Cause**: Real-time broadcast not working

**Fix**:
1. Check both pages are actually open
2. Check browser supports Broadcast Channel API
3. Check browser console for JavaScript errors
4. Try manual refresh - school should appear anyway

**Browser support**:
- ✅ Chrome 54+
- ✅ Firefox 38+
- ✅ Edge 79+
- ❌ Safari (uses fallback)
- ❌ Internet Explorer (not supported)

### Issue: Added school doesn't save (disappears after reload)

**Cause**: School was only added to local cache, not database

**Fix**:
1. Check backend API is being called (look for POST request in network tab)
2. Check backend console for errors
3. Verify admin authentication
4. Check database connection

**Verify with**:
```javascript
// In browser console:
document.addEventListener('DOMContentLoaded', async () => {
  const res = await fetch('http://localhost:5000/api/schools');
  const data = await res.json();
  console.log('Schools from database:', data.schools);
});
```

### Issue: "CORS error" in browser console

**Cause**: Backend CORS configuration issue

**Fix**:
1. Check backend has CORS enabled
2. Frontend URL should be in CORS whitelist
3. Restart backend after config changes

**Check in backend app.py**:
```python
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000"]}})
```

## Performance Metrics to Check

While testing, monitor these:

1. **Initial Page Load**: Should show all existing schools
2. **Add School**: Should broadcast within 500ms
3. **Search**: Should filter instantly (client-side)
4. **Pagination**: Should navigate smoothly
5. **Notification**: Should display and auto-dismiss correctly

## Data Validation

When a school is added, verify these are saved:

```javascript
// Check newly added school in database
{
  "id": 1,                              // Auto-generated
  "name": "Test School 2024",           // ✅ Verified
  "location": "Kampala, Uganda",        // ✅ Verified
  "city": "Kampala",                    // ✅ Verified
  "category": "secondary",              // ✅ Verified
  "students": 500,                      // ✅ Verified
  "contact_email": "test@school.ug",    // ✅ Verified
  "contact_phone": "+256700123456",     // ✅ Verified
  "is_active": true,                    // ✅ Default
  "created_at": "2024-02-24T...",       // ✅ Auto-set
  "updated_at": "2024-02-24T..."        // ✅ Auto-set
}
```

## Send Test Results

After testing, verify:

- [ ] Schools added appear in real-time
- [ ] Notification banner shows correctly
- [ ] Search/filter work with new schools
- [ ] Data persists after page reload
- [ ] No console errors
- [ ] All tests pass (8/8 minimum)

## Next Steps After Testing

1. ✅ **Test complete**: Share test results
2. **Add image support**: Implement file uploads for school logos
3. **Add edit functionality**: Update existing schools
4. **Add delete functionality**: Remove schools (soft delete)
5. **Advanced features**: Reviews, ratings, schedule tours

---

**Need Help?**
- Check browser console (F12) for JavaScript errors
- Check Network tab to verify API calls are being made
- Check backend terminal for server errors
- Review BACKEND_INTEGRATION_GUIDE.md for more details
