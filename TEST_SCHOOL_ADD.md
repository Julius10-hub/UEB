# Test: Adding Schools to the Platform

## Quick Start Guide

### Step 1: Start the Flask Backend

```bash
cd "c:\Users\Mahd\Desktop\UEB-main website+\UEB"
python app.py
```

The server should start on `http://localhost:5000`

### Step 2: Login as Admin

1. Open browser to `http://localhost:5000/admin-dashboard.html`
2. Use credentials:
   - Email: `admin@thrive.com`
   - Password: `admin123`

### Step 3: Add a School

1. Click the "Add School" button
2. Fill in the form:
   - **School Name**: "Test Secondary School"
   - **Category**: "Secondary"
   - **Location/District**: "Kampala"
   - **City**: "Kampala"
   - **Country**: "Uganda"
   - **Year Established**: "2010"
   - **Students**: "500"
   - **Faculty**: "45"
   - **Email**: "test@school.edu"
   - **Phone**: "+256 700 123456"
   - **Website**: "https://testschool.edu"
   - **Description**: "A quality secondary school in Kampala"
3. Click "Save School"
4. You should see a success message

### Step 4: Verify on Schools Page

1. Open `http://localhost:5000/schools.html` in a NEW browser tab or window
2. The new school should appear instantly!
3. You should see a green notification: "✨ Test Secondary School just added to the platform"
4. The school will appear in the schools grid and dropdown

## How It Works

### Flow Diagram

```
Admin Dashboard (Add School)
    ↓
Form validates data
    ↓
POST /api/schools (with Bearer token)
    ↓
Backend creates school in MySQL database
    ↓
Returns school object with ID
    ↓
broadcastNewSchool() broadcasts via BroadcastChannel
    ↓
Schools page receives message
    ↓
New school added to list
    ↓
Page updates without refresh
```

## Changes Made

### 1. Form Submission Handler (admin-dashboard.html)

- **Fixed**: Changed from `handleSchoolSubmit(event)` to `handleSubmit(event, 'schools')`
- **Why**: The old handler didn't exist, causing silent failures

### 2. School Data Extractor (admin-dashboard.html)

- **Fixed**: Updated field IDs to match your form:
  - `schoolName`, `schoolCategory`, `schoolCity`, `schoolLocation`
  - `schoolEmail`, `schoolPhone`, `schoolWebsite`
  - `schoolStudents`, `schoolFaculty`, `schoolEstablished`
  - `schoolDescription`, `schoolLongDescription`
  - `schoolPrograms`, `schoolKeywords`, `schoolMetaDesc`

### 3. Real-Time Broadcast (admin-dashboard.html)

- **Fixed**: Changed broadcast channel name to match schools.html listener
- **From**: `'edubridge_schools'` → **To**: `'school-updates'`
- **Fixed**: Message action type `'SCHOOL_ADDED'` → `'schoolAdded'`
- **Why**: Schools page was listening on different channel names

## Troubleshooting

### Issue: "Unauthorized" or "403 Forbidden"

- Make sure you're logged in as admin
- Check that the token is being sent with the request
- Verify `admin@thrive.com` is configured as admin

### Issue: School doesn't appear on Schools page

- Make sure the Schools page loads AFTER you add the school
- Check browser console for errors (F12 → Console tab)
- Verify both pages are using the same API endpoint

### Issue: Form doesn't submit

- Check browser console for JavaScript errors
- Make sure all required fields are filled
- Verify the backend API is running on port 5000

## Testing Checklist

- [ ] Backend server starts without errors
- [ ] Can login to admin dashboard
- [ ] Can open "Add School" form
- [ ] Form accepts all data
- [ ] Click "Save School" shows success message
- [ ] New school appears on schools page
- [ ] Green notification banner appears
- [ ] School shows in category dropdown
- [ ] Can view school details by clicking on it
