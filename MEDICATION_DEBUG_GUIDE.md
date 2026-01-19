# Medication System - Debugging Guide

## Issue: "Send to Pharmacy" and "Add New Prescription" Not Working

### Quick Diagnostic Steps

**Step 1: Open Browser Developer Console**
- Press `F12` or right-click → "Inspect"
- Go to "Console" tab
- Look for any red error messages with "[DEBUG]" prefix

**Step 2: Check Authentication**
- Look for messages: `[DEBUG] Has auth token: true`
- If it shows `false`, the user isn't logged in properly
- Solution: Log out and log back in

**Step 3: Check Network Requests**
- Click "Network" tab in dev tools
- Click "Prescribe Medication" or "Send to Pharmacy"
- Look for API calls to:
  - `POST /medications` (for adding prescription)
  - `PUT /medications/:id` (for sending to pharmacy)
- Check the response:
  - Status 200-201 = Success
  - Status 401 = Authentication failed
  - Status 500 = Server error

### Common Issues & Solutions

#### Issue 1: "Failed to create medication - no ID returned"
**Cause**: Backend didn't create the record  
**Solutions**:
1. Check if patient has appointments/check-ins
2. Verify all required fields are filled:
   - Patient (must select from dropdown)
   - Drug Name
   - Dose
   - Route
   - Frequency
   - Start Time
3. Check backend server is running on Render

#### Issue 2: Status 401 Unauthorized
**Cause**: Token expired or invalid  
**Solutions**:
1. Logout and login again
2. Clear browser cache: `Ctrl+Shift+Delete`
3. Check localStorage has `sc360_token`:
   ```javascript
   // In console:
   console.log(localStorage.getItem('sc360_token'))
   ```

#### Issue 3: Status 500 Server Error
**Cause**: Backend processing error  
**Solutions**:
1. Check Render deployment logs:
   - Go to: https://dashboard.render.com
   - Select SmartCare360 project
   - View logs for errors
2. Verify database connection is working
3. Check if table `medication_orders` exists

#### Issue 4: Nothing Happens (No Toast Message)
**Cause**: JavaScript error preventing execution  
**Solutions**:
1. Check console for any JavaScript errors
2. Verify form validation passes:
   - All required fields filled
   - Patient selected from dropdown (not empty)
   - Start time set
3. Try in incognito/private window
4. Refresh page and try again

### Detailed Debugging Steps

**To trace medication creation:**

```javascript
// In browser console:

// 1. Check if user is logged in
const token = localStorage.getItem('sc360_token');
console.log('Token exists:', !!token);

// 2. Check API URL
console.log('API URL:', localStorage.getItem('VITE_API_URL') || 'https://smartcare360-jyho.onrender.com');

// 3. Try a manual API call
const payload = {
  patientId: 'test-patient',
  patientName: 'Test Patient',
  drugName: 'Paracetamol',
  dose: '500mg',
  route: 'Oral',
  frequency: 'Once daily',
  startTime: '09:00',
  endTime: '17:00',
  specialInstructions: 'Test',
  doctorId: 'doctor-id',
  doctorName: 'Dr. Test'
};

fetch('https://smartcare360-jyho.onrender.com/medications', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(payload)
})
.then(r => r.json())
.then(d => console.log('Response:', d))
.catch(e => console.error('Error:', e));
```

### Console Output Analysis

**Look for these DEBUG messages:**

1. **Successful Prescription:**
   ```
   [DEBUG] Submitting medication: {...}
   [DEBUG] Has auth token: true
   [DEBUG] Prescription created: {id: "...", ...}
   ```

2. **Failed Send to Pharmacy:**
   ```
   [DEBUG] Sending medication to pharmacy - ID: xxx
   [DEBUG] Send to pharmacy error: {message: "..."}
   ```

3. **API Connection Issue:**
   ```
   [API] POST /medications
   [API Response] POST /medications {status: 401, ...}
   [API Error] /medications: {message: "Invalid token"}
   ```

### Render Backend Logs

1. Go to https://dashboard.render.com
2. Click "SmartCare360" service
3. Click "Logs"
4. Look for:
   - `DB error` messages
   - `Missing authorization` messages
   - `POST /medications` requests

### Database Verification

To verify the database is working:

```javascript
// In browser console (while logged in)
fetch('https://smartcare360-jyho.onrender.com/patients', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('sc360_token')}`
  }
})
.then(r => r.json())
.then(d => {
  console.log('Database works:', d.length > 0 ? 'YES' : 'NO');
  console.log('Patients:', d);
})
.catch(e => console.error('DB Error:', e));
```

### Real-Time Debugging Flow

**When adding a prescription:**

1. ✅ Select patient from dropdown
2. ✅ Fill in Drug Name, Dose, Route, Frequency, Start Time
3. ✅ Click "Prescribe Medication"
4. ✅ Check console - should show "[DEBUG] Submitting medication..."
5. ✅ Should see success toast OR error toast with details
6. ✅ Medications list should refresh after 0.5 seconds
7. ✅ New medication should appear in the table

**When sending to pharmacy:**

1. ✅ Click "Send to Pharmacy" on a pending medication
2. ✅ Check console - should show "[DEBUG] Sending medication..."
3. ✅ Status should change from "Pending" to "Ready"
4. ✅ Button should disappear (no longer pending)
5. ✅ Medication moves to pharmacy queue

### Success Criteria

✅ Prescription created and appears in list  
✅ Status shows as "Pending"  
✅ Can see "Send to Pharmacy" button  
✅ After clicking, status changes to "Ready"  
✅ Pharmacy sees it in their queue  
✅ Toast messages appear for success/error  
✅ No red errors in console  

### If Still Not Working

1. **Save this info from console:**
   ```javascript
   console.log({
     token: localStorage.getItem('sc360_token')?.substring(0, 50),
     apiUrl: import.meta.env.VITE_API_URL,
     timestamp: new Date().toISOString()
   });
   ```

2. **Check these in Network tab:**
   - Request Headers (should have Authorization)
   - Response Status (401, 500, 200, etc)
   - Response Body (error message)

3. **Contact support with:**
   - Screenshot of error
   - Console output
   - Network tab response
   - Render deployment logs

