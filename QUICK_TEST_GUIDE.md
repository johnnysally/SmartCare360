# Quick Start - Testing Medication System

## Before You Start
✅ You must be logged in as a Doctor  
✅ There must be at least one patient with an appointment (for check-in list)  
✅ Browser console should be open (F12)

## Quick Test (5 minutes)

### Test 1: Add New Prescription

```
1. Click "New Prescription" button
2. Select patient from dropdown
3. Fill fields:
   - Drug Name: Paracetamol
   - Dose: 500mg
   - Route: Oral
   - Frequency: Once daily
   - Start Time: 09:00
   - End Time: 17:00
4. Click "Prescribe Medication"
```

**Expected Result**:
- ✅ Success toast appears: "Medication prescribed for [Patient Name] successfully!"
- ✅ Form clears/resets
- ✅ New medication appears in list with "Pending" status
- ✅ Console shows: `[DEBUG] Prescription created: {id: "..."}`

**If it fails**:
- Check console for error message
- Verify all required fields filled (marked with *)
- Make sure patient is selected from dropdown
- See MEDICATION_DEBUG_GUIDE.md

### Test 2: Send to Pharmacy

```
1. Find a "Pending" medication in the list
2. Click green "Send to Pharmacy" button
3. Watch status change
```

**Expected Result**:
- ✅ Toast appears: "Medication sent for approval and is now in queue"
- ✅ Status changes from "Pending" to "Ready"
- ✅ Button disappears (no longer pending)
- ✅ Console shows: `[DEBUG] Pharmacy send result: {id: "..."}`

**If it fails**:
- Check console for error
- Verify user is logged in (check token in console)
- See MEDICATION_DEBUG_GUIDE.md

### Test 3: Verify in Pharmacy

```
1. Log out (top right menu)
2. Log in as Pharmacist
3. Go to Pharmacy → Medications
4. Should see the medication in "Pending Review"
```

**Expected Result**:
- ✅ Prescription appears in pharmacist's queue
- ✅ Can see full details: patient, drug, dose, etc
- ✅ Can approve or hold

## Console Debugging Commands

**Copy/paste these in browser console (F12) to debug:**

```javascript
// Check if logged in
console.log('Token:', localStorage.getItem('sc360_token')?.substring(0, 50) + '...');

// Check API URL
console.log('API:', import.meta.env.VITE_API_URL);

// Get all medications
fetch('https://smartcare360-jyho.onrender.com/medications', {
  headers: {'Authorization': `Bearer ${localStorage.getItem('sc360_token')}`}
}).then(r => r.json()).then(d => console.log('Medications:', d));

// Get check-in patients
fetch('https://smartcare360-jyho.onrender.com/appointments', {
  headers: {'Authorization': `Bearer ${localStorage.getItem('sc360_token')}`}
}).then(r => r.json()).then(d => console.log('Appointments:', d));
```

## Common Error Messages & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| "Please select a patient" | Patient dropdown empty | Select patient from list |
| "Please enter drug name" | Drug name field empty | Fill in drug name |
| "Failed to send medication" | API error | Log out/in, check console |
| Status 401 in console | Authentication expired | Log out and log back in |
| No medications showing | API not responding | Check Render backend |
| Toast not appearing | JavaScript error | Check console for red errors |

## Network Tab Debugging

1. Open Dev Tools (F12)
2. Click "Network" tab
3. Perform action (Add prescription or Send to pharmacy)
4. Look for:
   - **POST /medications** (for add)
   - **PUT /medications/xxx** (for send to pharmacy)

**Check Response**:
- 📊 Status 200-201 = Success ✅
- 📊 Status 400 = Missing field ❌
- 📊 Status 401 = Auth failed ❌
- 📊 Status 500 = Server error ❌

Click response, look for error message.

## Step-by-Step Debug if Nothing Happens

1. **Check console for [DEBUG] logs**:
   ```
   ✅ [DEBUG] Submitting medication: {...}
   ✅ [DEBUG] Has auth token: true
   ✅ [DEBUG] Prescription created: {...}
   ```

2. **If no logs, JavaScript error occurred**:
   - Look for red text in console
   - Check syntax errors

3. **If error 401 Unauthorized**:
   - Token expired
   - Logout: Click user menu → Logout
   - Login again
   - Retry

4. **If error 500 Server**:
   - Backend issue
   - Check Render dashboard for logs
   - Restart backend if needed

5. **If no error but nothing happens**:
   - Try different browser
   - Clear cache: Ctrl+Shift+Delete
   - Reload page: Ctrl+R
   - Try again

## Database Verification

To confirm database is working:

```javascript
// In console:
fetch('https://smartcare360-jyho.onrender.com/patients', {
  headers: {'Authorization': `Bearer ${localStorage.getItem('sc360_token')}`}
})
.then(r => r.json())
.then(d => console.log('DB Status:', d.length > 0 ? 'WORKING' : 'ERROR'));
```

Should print: `DB Status: WORKING`

## Success Indicators

- ✅ Console shows [DEBUG] messages (no red errors)
- ✅ Toast appears (colored box with message)
- ✅ Medications appear in list
- ✅ Status updates correctly
- ✅ No 401 errors
- ✅ No 500 errors
- ✅ Dropdown shows patients

## Need More Help?

1. Check: MEDICATION_DEBUG_GUIDE.md
2. Check: MEDICATION_FLOW.md
3. Check: Browser console (F12)
4. Check: Network tab responses
5. Check: Render backend logs

