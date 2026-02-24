# Real-Time Update Testing Guide - COMPLETE

**Purpose**: Validate complete synchronization between Admin Dashboard → Database → Website

---

## Prerequisites

✅ Backend running on `http://localhost:5000`
✅ Admin logged in (Bearer token available)
✅ Browser with BroadcastChannel support (Chrome, Firefox)
✅ Two browser tabs/windows ready

---

## Test Suite

### TEST 1: Basic School Creation (5 min)

**Objective**: Verify form captures all data and saves to database

**Steps**:
1. Open `admin-dashboard.html`
2. Scroll to "Schools Management" section
3. Click "Add School" button
4. Fill form with test data:
   - Name: "Test Academy"
   - Category: "Secondary"
   - Location: "Kampala"
   - City: "Kampala"
   - Country: "Uganda"
   - Established: "2015"
   - Students: "1500"
   - Faculty: "120"
   - Email: "info@testacademy.edu"
   - Phone: "+256 700 123456"
   - Website: "https://testacademy.edu"
   - Description: "A leading secondary school"
   - Long Description: "Dedicated to excellence in education"
   - Programs: "Science, Arts, Commercial"
   - Keywords: "secondary, kampala, uganda"
   - Meta Description: "Top rated secondary school in Kampala"
5. Click "Save School"

**Expected Results**:
- ✅ Loading spinner shows
- ✅ Success notification appears: "School saved successfully!"
- ✅ Form clears
- ✅ Modal stays open

**Validation**:
- Check browser DevTools → Network tab
- Should see: `POST /api/schools` with status 201
- Response should contain: school object with all fields
- Response includes: `id`, `created_at`, `updated_at`

**If this passes**: ✅ Backend API working correctly

---

### TEST 2: Real-Time Update (Same Browser, Two Tabs)

**Objective**: Verify BroadcastChannel updates across tabs

**Setup**:
- Tab 1: `admin-dashboard.html` (open and ready)
- Tab 2: `schools.html` (open on schools list)

**Steps**:
1. In Tab 2 (schools.html): Note current school count
2. Record timestamp: ___________
3. In Tab 1 (admin): Click "Add School"
4. Fill form with different data:
   - Name: "Green Valley School"
   - Category: "Primary"
   - Location: "Entebbe"
   - City: "Entebbe"
   - Country: "Uganda"
   - Other fields: Optional (fill 2-3)
5. Click "Save School"
6. Immediately check Tab 2 (don't refresh!)

**Expected Results**:
- ✅ Tab 1: Success notification shows
- ✅ Tab 1: Form clears
- ✅ Tab 2: NEW school appears in list automatically
- ✅ No page refresh occurred
- ✅ Total time for update: < 2 seconds
- ✅ New school shows all data correctly

**Validation in Tab 2**:
- Look for "Green Valley School" in the list
- Verify: School appears without manual refresh
- Verify: School shows with Entebbe location
- Verify: School shows all submitted data

**Success Indicator**: List updated automatically (NOT via page refresh)

**If this passes**: ✅ Real-time BroadcastChannel working

---

### TEST 3: Detail Modal Display (All Fields)

**Objective**: Verify detail modal shows all school information

**Steps**:
1. In `schools.html`
2. Find school added in Test 2 ("Green Valley School")
3. Click on school card to open detail modal

**Expected Modal Content**:

**Header**:
- ✅ School name: "Green Valley School"
- ✅ Category: "Primary"
- ✅ Location: "Entebbe"
- ✅ Verified badge (if applicable)

**Key Metrics Section**:
- ✅ Established: "Unknown" (if not provided) OR year
- ✅ Students: "Unknown" OR number
- ✅ Faculty: "Unknown" OR number
- ✅ Rating: Display (may be empty initially)

**About Section**:
- ✅ Description shows text
- ✅ Detailed Information section shows (if provided)
- ✅ Programs show as badges (if provided)

**Contact Section**:
- ✅ City: "Entebbe"
- ✅ Country: "Uganda"
- ✅ Email link (clickable mailto:)
- ✅ Phone link (clickable tel:)
- ✅ Website link (clickable https://)

**Action Buttons Bottom**:
- ✅ "Schedule Tour" button present
- ✅ "Virtual Tour" button present
- ✅ "Apply Here" button present

**Validation Checklist**:
```
Header:
  [ ] Name displays
  [ ] Category displays
  [ ] Location correct
  
Metrics:
  [ ] All 4 metrics shown or "Unknown"
  
Content:
  [ ] Description visible
  [ ] Long desc visible (if provided)
  [ ] Programs as badges (if provided)
  
Contact:
  [ ] City displays
  [ ] Country displays
  [ ] Email is clickable link
  [ ] Phone is clickable link
  [ ] Website is clickable link
  
Actions:
  [ ] 3 buttons present at bottom
```

**If all checked**: ✅ Detail modal complete

---

### TEST 4: Phone, Email, Website Links

**Objective**: Verify contact links work correctly

**Steps**:
1. Open detail modal (from Test 3)
2. Test Email Link:
   - Right-click on email
   - Should show: "Copy email address"
   - Or left-click: Should open email client
   - Expected: `mailto:info@testacademy.edu`
3. Test Phone Link:
   - Right-click on phone
   - Should show: "Copy phone number"
   - Or left-click: Should open calling app
   - Expected: `tel:+256700123456`
4. Test Website Link:
   - Left-click on website
   - Should open in new tab
   - Expected: Starts with `https://`

**Validation**:
```
Email:
  [ ] Href = mailto:info@...
  [ ] Click opens email
  [ ] Right-click shows copy
  
Phone:
  [ ] Href = tel:+256...
  [ ] Click shows calling app
  [ ] Right-click shows copy
  
Website:
  [ ] Href = https://...
  [ ] Opens in new tab
  [ ] URL valid
```

**If all pass**: ✅ Links working correctly

---

### TEST 5: Programs Display as Badges

**Objective**: Verify programs show as individual badges

**Steps**:
1. Open detail modal
2. Find "Academic Programs" section
3. Look at how programs display

**Expected Display**:
- Each program as a separate badge/chip
- Visual separation between programs
- Example: "Science • Arts • Commercial"
- Or badge style with icon

**Validation**:
```
Programs Section:
  [ ] Shows all programs
  [ ] Each on separate badge
  [ ] Visually distinct from text
  [ ] Easy to read
  [ ] Proper formatting
```

**If passes**: ✅ Programs display working

---

## Quick Test (5 minutes)

**If short on time, run this critical path**:
1. Add school (TEST 1) ✓
2. Real-time update (TEST 2) ✓
3. Detail modal shows all fields (TEST 3) ✓
4. Links work (TEST 4) ✓

**If all 4 pass**: System is operational ✅

---

**Current Status**: Ready for testing - All code implemented successfully
