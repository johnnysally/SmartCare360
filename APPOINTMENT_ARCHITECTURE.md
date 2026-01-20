# 📊 Appointment System - Visual Architecture

## System Overview Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         SMARTCARE 360 - APPOINTMENTS                    │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ FRONTEND (React + TypeScript)                                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Patient View              Admin View              Doctor View          │
│  ────────────              ──────────              ────────────         │
│  ┌──────────┐            ┌──────────┐            ┌──────────┐         │
│  │ MyAppointments         │ Appointments          │ Schedule │         │
│  │ - Book                 │ - View All            │ - View   │         │
│  │ - View Upcoming        │ - Search              │ - Check  │         │
│  │ - Reschedule           │ - Filter              │          │         │
│  │ - Cancel               │ - Confirm             │          │         │
│  │ - Check In             │ - Cancel              │          │         │
│  │ - View Past            │ - Statistics          │          │         │
│  └──────────┘            └──────────┘            └──────────┘         │
│       │                        │                       │                │
│       └────────────┬───────────┴───────────┬──────────┘                │
│                    │                       │                           │
│              ┌──────▼──────────────────┐   │                           │
│              │  BookAppointmentDialog   │   │                           │
│              │  (5-Step Wizard)         │   │                           │
│              │ 1. Department            │   │                           │
│              │ 2. Doctor                │   │                           │
│              │ 3. Date/Time             │   │                           │
│              │ 4. Type/Priority         │   │                           │
│              │ 5. Confirm               │   │                           │
│              └──────┬──────────────────┘   │                           │
│                     │                       │                           │
└─────────────────────┼───────────────────────┼─────────────────────────┘
                      │                       │
           API Layer  │                       │
           (api.ts)   │                       │
                      ▼                       ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ BACKEND (Node.js/Express)                                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Appointment Routes                  Queue Routes                       │
│  ──────────────────                  ─────────────                      │
│  ┌─────────────────────────┐        ┌──────────────────┐               │
│  │ POST /appointments      │        │ POST /queues/    │               │
│  │ GET /appointments       │        │     check-in     │               │
│  │ GET /appointments/:id   │        │ GET /queues      │               │
│  │ PUT /appointments/:id   │        │ GET /queues/     │               │
│  │ PUT /:id/confirm        │        │     department   │               │
│  │ PUT /:id/cancel         │        │ PUT /queues/:id  │               │
│  │ PUT /:id/reschedule     │        │     /complete    │               │
│  │ DELETE /appointments/:id│        └──────────────────┘               │
│  │ GET /doctor/:id/        │                                           │
│  │     availability        │        Validation & Error                 │
│  │ GET /stats/summary      │        ────────────────────               │
│  └─────────────────────────┘        ✅ Required fields                 │
│           │                          ✅ Valid department                │
│           │                          ✅ Valid type                      │
│           │                          ✅ Valid doctor                    │
│           │                          ✅ Date validation                 │
│           │                          ✅ Time validation                 │
└───────────┼──────────────────────────────────────────────────────────┘
            │
Database    │
(PostgreSQL)│
            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ APPOINTMENTS TABLE (21 Columns)                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Primary Info              Contact Info          Doctor Info           │
│  ─────────────              ────────────          ──────────           │
│  ├─ id (PK)                ├─ patientName ✅      ├─ doctorId ✅       │
│  ├─ patientId (FK)         ├─ phone ✅            ├─ doctorName ✅     │
│  ├─ time                   └─ email (optional)    └─ department        │
│  ├─ type                                                               │
│  ├─ status                 Service Info          Management            │
│  ├─ priority               ────────────          ──────────           │
│  ├─ queue_number           ├─ arrival_time       ├─ created_at ✅     │
│  └─ created_at ✅          ├─ service_start_     ├─ updated_at ✅     │
│                            │     time             ├─ called_at         │
│  Status Values             ├─ service_end_       ├─ completed_at      │
│  ──────────────            │     time             └─ skip_reason       │
│  • pending                 └─ next_department                         │
│  • confirmed                                                           │
│  • completed               Indices (Performance)                      │
│  • cancelled               ──────────────────────                     │
│  • no-show                 ├─ idx_patientId                          │
│                            ├─ idx_doctorId                           │
│                            ├─ idx_department                         │
│                            ├─ idx_status                             │
│                            └─ idx_priority                           │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Complete Appointment Lifecycle

```
START
  │
  ▼
┌─────────────────────────────┐
│ PATIENT CREATES APPOINTMENT │
├─────────────────────────────┤
│ ✅ Fill 5-step wizard       │
│ ✅ Select department        │
│ ✅ Select doctor            │
│ ✅ Pick date & time         │
│ ✅ Choose type & priority   │
│ ✅ Confirm booking          │
│                             │
│ Data Stored:                │
│ - patientId, patientName    │
│ - phone, doctorId,          │
│ - doctorName, department    │
│ - time, type, priority      │
│ - status: 'pending'         │
│ - queue_number generated    │
└────────────┬────────────────┘
             │ (Auto-confirmed)
             ▼
┌─────────────────────────────┐
│ APPOINTMENT CONFIRMED       │
├─────────────────────────────┤
│ ✅ Shows in MyAppointments  │
│ ✅ Shows in Admin view      │
│ ✅ Status: 'confirmed'      │
│ ✅ Queue number visible     │
│ ✅ Can reschedule/cancel    │
│ ✅ Can check in to queue    │
└────────────┬────────────────┘
             │
             ▼
         ┌───────┴───────┐
         │               │
         ▼               ▼
   ┌──────────────┐  ┌──────────────┐
   │ RESCHEDULE   │  │ CHECK IN TO  │
   │ (Optional)   │  │ QUEUE        │
   │ New date/    │  │ (When ready) │
   │ time picked  │  │              │
   │ Status reset │  │ Creates queue│
   │ to pending   │  │ entry with   │
   │              │  │ same queue # │
   └──────────────┘  │ Sends notif. │
         │           └──────┬───────┘
         │                  │
         ▼                  ▼
   ┌──────────────┐  ┌──────────────────────┐
   │ PENDING      │  │ IN QUEUE             │
   │ (Awaiting    │  │ ✅ Queue Management  │
   │  admin       │  │ ✅ Shows position    │
   │  confirm)    │  │ ✅ Waiting to be     │
   │              │  │    called            │
   └──────────────┘  │ ✅ Doctor sees       │
         │           │    queue number      │
         │           └──────┬───────────────┘
         │                  │
         └──────────┬───────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ DOCTOR CALLS PATIENT │
         ├──────────────────────┤
         │ ✅ Calls queue #     │
         │ ✅ Patient arrives   │
         │ ✅ Service provided  │
         │ ✅ Updates times     │
         └──────────┬───────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
  ┌──────────────┐       ┌──────────────┐
  │ COMPLETE     │       │ ROUTE TO     │
  │ SERVICE      │       │ NEXT DEPT    │
  │              │       │              │
  │ Status:      │       │ Transfers to │
  │ 'completed'  │       │ next queue   │
  │ Record times │       │ Repeats flow │
  │ Notify user  │       └──────────────┘
  └──────┬───────┘              │
         │                      │
         └──────────┬───────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ APPOINTMENT ARCHIVED │
         ├──────────────────────┤
         │ ✅ Moved to past     │
         │ ✅ Can be deleted    │
         │ ✅ Appears in history│
         │ ✅ Service times     │
         │    recorded          │
         └──────────────────────┘
                    │
                   END
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ BOOKING FLOW (Patient Books Appointment)                        │
└─────────────────────────────────────────────────────────────────┘

Patient Input Form
  │
  ├─ patientId: "p-123"
  ├─ patientName: "John Doe"
  ├─ phone: "254712345678"
  ├─ time: "2024-01-25T14:00:00Z"
  ├─ type: "In-person"
  ├─ department: "OPD"
  ├─ doctorId: "D001"
  ├─ doctorName: "Dr. Otieno"
  ├─ priority: 3
  │
  ▼
Frontend Validation
  ├─ ✅ All required fields present
  ├─ ✅ Date is in future
  ├─ ✅ Time is 30-min interval
  │
  ▼
API Call: createAppointment(data)
  │
  ├─ Method: POST /appointments
  ├─ Headers: { Authorization: "Bearer <token>" }
  ├─ Body: { patientId, patientName, phone, ... }
  │
  ▼
Backend Validation
  ├─ ✅ patientId exists
  ├─ ✅ department in DEPARTMENTS
  ├─ ✅ type in APPOINTMENT_TYPES
  ├─ ✅ time is valid ISO string
  │
  ▼
Generate Identifiers
  ├─ id = "A" + random(100000)     → "A98765"
  ├─ queue_number = "OPD-456"      → "OPD-456"
  ├─ status = "pending"
  ├─ created_at = NOW()
  ├─ updated_at = NOW()
  │
  ▼
Database Insert
  │
  INSERT INTO appointments (
    id, patientId, patientName, phone, time, type,
    department, doctorId, doctorName, priority,
    queue_number, status, created_at, updated_at
  ) VALUES (...)
  │
  ▼
Return Created Object
  │
  ├─ id: "A98765"
  ├─ queue_number: "OPD-456"
  ├─ status: "pending"
  ├─ created_at: "2024-01-20T10:30:00Z"
  ├─ updated_at: "2024-01-20T10:30:00Z"
  ├─ (all input fields)
  │
  ▼
Auto-Confirm
  │
  PUT /appointments/A98765/confirm
  │
  ├─ Update status to "confirmed"
  ├─ Set updated_at to NOW()
  │
  ▼
Frontend Notification
  │
  ✅ Toast: "Appointment booked successfully!"
  ✅ Display: "Your queue number: OPD-456"
  │
  ▼
Update Patient View
  │
  ├─ Reload MyAppointments
  ├─ Show in "Upcoming Appointments"
  ├─ Display "Check In to Queue" button
  │
  END
```

---

## API Integration Points

```
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND API CALLS (src/lib/api.ts)                             │
└─────────────────────────────────────────────────────────────────┘

createAppointment(payload)
  └─ POST /appointments
     ├─ Sends: All appointment fields
     └─ Returns: Created appointment object

getAppointments()
  └─ GET /appointments
     ├─ Retrieves: All appointments
     └─ Returns: Array of appointments

getPatientAppointments(patientId)
  └─ GET /appointments/patient/:patientId
     ├─ Retrieves: Specific patient's appointments
     └─ Returns: Array of appointments

getDoctorAvailability(doctorId, date)
  └─ GET /appointments/doctor/:doctorId/availability?date=
     ├─ Retrieves: Available time slots
     └─ Returns: { availableSlots: [...] }

confirmAppointment(appointmentId)
  └─ PUT /appointments/:id/confirm
     ├─ Updates: Status to 'confirmed'
     └─ Returns: Updated appointment

rescheduleAppointment(appointmentId, newTime)
  └─ PUT /appointments/:id/reschedule
     ├─ Updates: Time to new value
     └─ Returns: Updated appointment

cancelAppointment(appointmentId)
  └─ PUT /appointments/:id/cancel
     ├─ Updates: Status to 'cancelled'
     └─ Returns: Updated appointment

checkInPatient(payload)
  └─ POST /queues/check-in
     ├─ Sends: Patient queue info
     └─ Returns: Queue entry

getAppointmentStats()
  └─ GET /appointments/stats/summary
     ├─ Retrieves: Appointment statistics
     └─ Returns: { total, confirmed, pending, ... }
```

---

## Status Transition Diagram

```
            ┌─────────────┐
            │   PENDING   │ ◄──── Created (auto-confirm)
            │   (start)   │
            └──────┬──────┘
                   │
        ┌──────────┼──────────┐
        │          │          │
        ▼          ▼          ▼
   ┌────────┐ ┌────────┐ ┌────────┐
   │RESCHED.│ │CANCEL  │ │CONFIRM │
   └────┬───┘ └────┬───┘ └────┬───┘
        │          │          │
        │          ▼          ▼
        │     ┌──────────┐  ┌───────────┐
        │     │CANCELLED │  │ CONFIRMED │
        │     │(end)     │  │           │
        │     └──────────┘  └────┬──────┘
        │                        │
        └─────────────────┬──────┤
                          │      │
                          ▼      ▼
                     ┌─────────────────┐
                     │  IN QUEUE       │
                     │  (Checked in)   │
                     └────────┬────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │  IN SERVICE     │
                     │  (Being served) │
                     └────────┬────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
              ┌──────────┐         ┌──────────┐
              │COMPLETED │         │NO-SHOW   │
              │(end)     │         │(end)     │
              └──────────┘         └──────────┘
```

---

## Component Hierarchy

```
App.tsx
├── /patient/dashboard
│   └── MyAppointments.tsx
│       ├── BookAppointmentDialog.tsx
│       │   └── 5-step wizard
│       ├── Upcoming Appointments section
│       └── Past Appointments section
│
├── /appointments (Admin)
│   └── Appointments.tsx
│       ├── Search bar
│       ├── Filter dropdowns
│       ├── Statistics cards
│       ├── Today's schedule
│       └── Upcoming appointments
│
└── /queue (Queue Management)
    └── DepartmentQueueManager.tsx
        ├── Queue list by department
        └── Call next patient
```

---

## Success Criteria Met ✅

```
✅ Database
  ├─ All 21 columns present
  ├─ Indexes created
  ├─ Foreign keys set
  └─ Constraints validated

✅ Backend API
  ├─ 12+ endpoints functional
  ├─ Input validation working
  ├─ Error handling in place
  └─ Database integration complete

✅ Frontend UI
  ├─ Booking wizard (5 steps)
  ├─ Patient dashboard
  ├─ Admin management
  ├─ Queue integration
  └─ Error notifications

✅ Data Flow
  ├─ Create → Confirm → Check-in → Queue
  ├─ All fields stored correctly
  ├─ Status transitions working
  └─ Timestamps recorded

✅ User Experience
  ├─ Mobile responsive
  ├─ Clear instructions
  ├─ Real-time feedback
  ├─ Search & filter working
  └─ No broken links
```

---

**System Status**: ✅ **FULLY OPERATIONAL**

All components integrated and ready for production use.
