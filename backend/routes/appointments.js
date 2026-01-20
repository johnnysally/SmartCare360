const express = require('express');
const router = express.Router();
const dbModule = require('../db');

// Constants
const DEPARTMENTS = ['OPD', 'Emergency', 'Laboratory', 'Radiology', 'Pharmacy', 'Billing'];
const APPOINTMENT_TYPES = ['In-person', 'Telemedicine', 'Follow-up', 'Check-up', 'Consultation'];
const APPOINTMENT_STATUS = ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'];

// ============= GET APPOINTMENTS =============

// Get all appointments (with optional filtering)
router.get('/', (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  
  const { patientId, status, department, doctorId } = req.query;
  let query = 'SELECT * FROM appointments WHERE 1=1';
  const params = [];
  
  if (patientId) {
    query += ' AND patientId = $' + (params.length + 1);
    params.push(patientId);
  }
  if (status) {
    query += ' AND status = $' + (params.length + 1);
    params.push(status);
  }
  if (department) {
    query += ' AND department = $' + (params.length + 1);
    params.push(department);
  }
  if (doctorId) {
    query += ' AND doctor_id = $' + (params.length + 1);
    params.push(doctorId);
  }
  
  query += ' ORDER BY time DESC';
  
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err.message });
    res.json(rows || []);
  });
});

// Get single appointment
router.get('/:id', (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  
  db.get('SELECT * FROM appointments WHERE id = $1', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err.message });
    if (!row) return res.status(404).json({ message: 'Appointment not found' });
    res.json(row);
  });
});

// Get appointments by patient ID
router.get('/patient/:patientId', (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  
  db.all(
    'SELECT * FROM appointments WHERE patientId = $1 ORDER BY time DESC',
    [req.params.patientId],
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err.message });
      res.json(rows || []);
    }
  );
});

// Get appointments by doctor ID
router.get('/doctor/:doctorId', (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  
  db.all(
    'SELECT * FROM appointments WHERE doctorId = $1 OR doctor_id = $1 ORDER BY time DESC',
    [req.params.doctorId],
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err.message });
      res.json(rows || []);
    }
  );
});

// Get available slots for a specific doctor and date
router.get('/doctor/:doctorId/availability', (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ message: 'Date is required' });
  
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  
  // Fetch booked slots for the doctor on that date
  const dateStart = new Date(date).toISOString().split('T')[0];
  
  db.all(
    `SELECT time FROM appointments 
     WHERE (doctorId = $1 OR doctor_id = $1) AND DATE(time) = $2 AND status != $3
     ORDER BY time ASC`,
    [req.params.doctorId, dateStart, 'cancelled'],
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err.message });
      
      const bookedTimes = (rows || []).map(r => new Date(r.time).toISOString());
      const availableSlots = generateAvailableSlots(dateStart, bookedTimes);
      res.json({ date: dateStart, availableSlots });
    }
  );
});

// Helper: Generate available time slots (30-min intervals, 9 AM to 5 PM)
function generateAvailableSlots(dateStr, bookedTimes = []) {
  const slots = [];
  
  // Parse the date string safely
  const dateOnly = dateStr.split('T')[0]; // Get YYYY-MM-DD
  const baseDate = new Date(dateOnly + 'T09:00:00Z');
  const endDate = new Date(dateOnly + 'T17:00:00Z');
  
  // Make sure we don't go backwards
  if (isNaN(baseDate.getTime()) || isNaN(endDate.getTime())) {
    console.warn('Invalid date string:', dateStr);
    return [];
  }
  
  const slotDate = new Date(baseDate);
  while (slotDate <= endDate) {
    const slotTime = slotDate.toISOString();
    if (!bookedTimes.includes(slotTime)) {
      slots.push(slotTime);
    }
    slotDate.setMinutes(slotDate.getMinutes() + 30);
  }
  
  return slots;
}

// ============= CREATE APPOINTMENT =============

router.post('/', (req, res) => {
  const {
    patientId,
    patientName,
    phone,
    time,
    type,
    department,
    doctorId,
    doctorName,
    priority,
    status,
    // admission-specific
    bed_number,
    room_number,
    admitting_doctor,
    admission_type,
    expected_length_of_stay,
    provisional_diagnosis,
    comorbidities,
    allergies,
    guardian_name,
    guardian_phone,
    consent_obtained,
    insurance_provider,
    insurance_policy_number,
    preauth_required,
    preauth_number,
    payment_method,
    estimated_charges,
    surgery_planned,
    surgeon_name,
    anesthesia_type,
    gravidity,
    parity,
    expected_delivery_date,
    admission_datetime,
    notes
  } = req.body;

  // Basic validation: patientId, department, payment_method and consent (unless emergency) required for admissions
  if (!patientId || !department) {
    return res.status(400).json({ message: 'Missing required fields: patientId, department' });
  }
  if (!payment_method) {
    return res.status(400).json({ message: 'Payment method is required' });
  }
  // consent required except for emergency admissions
  if ((!consent_obtained || consent_obtained === false) && admission_type !== 'Emergency') {
    return res.status(400).json({ message: 'Consent is required for non-emergency admissions' });
  }

  if (!DEPARTMENTS.includes(department) && department !== 'IPD' && department !== 'Emergency') {
    // allow IPD and Emergency as department values for admissions
    // but accept common departments
  }

  const id = `A${Math.floor(Math.random() * 100000)}`;
  const queueNumber = `${department.toUpperCase().substring(0, 3)}-${Math.floor(Math.random() * 1000)}`;
  const now = new Date().toISOString();

  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });

  db.run(
    `INSERT INTO appointments 
     (id, patientId, patientName, phone, time, type, department, doctorId, doctorName, priority, queue_number, status, arrival_time, created_at, updated_at, bed_number, room_number, admitting_doctor, admission_type, expected_length_of_stay, provisional_diagnosis, comorbidities, allergies, guardian_name, guardian_phone, consent_obtained, insurance_provider, insurance_policy_number, preauth_required, preauth_number, payment_method, estimated_charges, surgery_planned, surgeon_name, anesthesia_type, gravidity, parity, expected_delivery_date, admission_datetime, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39)`,
    [
      id,
      patientId,
      patientName || 'Unknown Patient',
      phone || '',
      time || null,
      type || 'Admission',
      department,
      doctorId || null,
      doctorName || admitting_doctor || null,
      priority || 3,
      queueNumber,
      status || 'admitted',
      null,
      now,
      now,
      bed_number || null,
      room_number || null,
      admitting_doctor || null,
      admission_type || null,
      expected_length_of_stay || null,
      provisional_diagnosis || null,
      comorbidities || null,
      allergies || null,
      guardian_name || null,
      guardian_phone || null,
      consent_obtained ? true : false,
      insurance_provider || null,
      insurance_policy_number || null,
      preauth_required ? true : false,
      preauth_number || null,
      payment_method || null,
      estimated_charges || null,
      surgery_planned ? true : false,
      surgeon_name || null,
      anesthesia_type || null,
      gravidity || null,
      parity || null,
      expected_delivery_date || null,
      admission_datetime || now,
      notes || null
    ],
    function (err) {
      if (err) return res.status(500).json({ message: 'DB error', error: err.message });

      db.get('SELECT * FROM appointments WHERE id = $1', [id], (e, row) => {
        if (e) return res.status(500).json({ message: 'DB error', error: e.message });
        res.status(201).json(row);
      });
    }
  );
});

// ============= UPDATE APPOINTMENT =============

router.put('/:id', (req, res) => {
  const { time, type, department, status, priority, doctorId, doctorName } = req.body;
  
  // Validation
  if (type && !APPOINTMENT_TYPES.includes(type)) {
    return res.status(400).json({ message: `Invalid type. Must be one of: ${APPOINTMENT_TYPES.join(', ')}` });
  }
  
  if (department && !DEPARTMENTS.includes(department)) {
    return res.status(400).json({ message: `Invalid department. Must be one of: ${DEPARTMENTS.join(', ')}` });
  }
  
  if (status && !APPOINTMENT_STATUS.includes(status)) {
    return res.status(400).json({ message: `Invalid status. Must be one of: ${APPOINTMENT_STATUS.join(', ')}` });
  }
  
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  
  // Build dynamic update query
  const updates = [];
  const params = [];
  let paramIndex = 1;
  
  if (time !== undefined) {
    updates.push(`time = $${paramIndex++}`);
    params.push(time);
  }
  if (type !== undefined) {
    updates.push(`type = $${paramIndex++}`);
    params.push(type);
  }
  if (department !== undefined) {
    updates.push(`department = $${paramIndex++}`);
    params.push(department);
  }
  if (status !== undefined) {
    updates.push(`status = $${paramIndex++}`);
    params.push(status);
  }
  if (priority !== undefined) {
    updates.push(`priority = $${paramIndex++}`);
    params.push(priority);
  }
  if (doctorId !== undefined) {
    updates.push(`doctor_id = $${paramIndex++}`);
    params.push(doctorId);
  }
  if (doctorName !== undefined) {
    updates.push(`doctorName = $${paramIndex++}`);
    params.push(doctorName);
  }
  
  if (updates.length === 0) {
    return res.status(400).json({ message: 'No fields to update' });
  }
  
  params.push(req.params.id);
  const query = `UPDATE appointments SET ${updates.join(', ')} WHERE id = $${paramIndex}`;
  
  db.run(query, params, function (err) {
    if (err) return res.status(500).json({ message: 'DB error', error: err.message });
    
    db.get('SELECT * FROM appointments WHERE id = $1', [req.params.id], (e, row) => {
      if (e) return res.status(500).json({ message: 'DB error', error: e.message });
      if (!row) return res.status(404).json({ message: 'Appointment not found' });
      res.json(row);
    });
  });
});

// ============= RESCHEDULE APPOINTMENT =============

router.put('/:id/reschedule', (req, res) => {
  const { newTime } = req.body;
  if (!newTime) return res.status(400).json({ message: 'New time is required' });
  
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  
  db.run(
    'UPDATE appointments SET time = $1, status = $2 WHERE id = $3',
    [newTime, 'pending', req.params.id],
    function (err) {
      if (err) return res.status(500).json({ message: 'DB error', error: err.message });
      
      db.get('SELECT * FROM appointments WHERE id = $1', [req.params.id], (e, row) => {
        if (e) return res.status(500).json({ message: 'DB error', error: e.message });
        res.json(row);
      });
    }
  );
});

// ============= CANCEL APPOINTMENT =============

router.put('/:id/cancel', (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  
  db.run(
    'UPDATE appointments SET status = $1 WHERE id = $2',
    ['cancelled', req.params.id],
    function (err) {
      if (err) return res.status(500).json({ message: 'DB error', error: err.message });
      
      db.get('SELECT * FROM appointments WHERE id = $1', [req.params.id], (e, row) => {
        if (e) return res.status(500).json({ message: 'DB error', error: e.message });
        res.json(row);
      });
    }
  );
});

// ============= CONFIRM APPOINTMENT =============

router.put('/:id/confirm', (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  
  db.run(
    'UPDATE appointments SET status = $1 WHERE id = $2',
    ['confirmed', req.params.id],
    function (err) {
      if (err) return res.status(500).json({ message: 'DB error', error: err.message });
      
      db.get('SELECT * FROM appointments WHERE id = $1', [req.params.id], (e, row) => {
        if (e) return res.status(500).json({ message: 'DB error', error: e.message });
        res.json(row);
      });
    }
  );
});

// ============= DELETE APPOINTMENT =============

router.delete('/:id', (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  
  db.run('DELETE FROM appointments WHERE id = $1', [req.params.id], function (err) {
    if (err) return res.status(500).json({ message: 'DB error', error: err.message });
    res.json({ success: true, message: 'Appointment deleted' });
  });
});

// ============= APPOINTMENTS STATISTICS =============

router.get('/stats/summary', (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  
  db.get(
    `SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
      SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
     FROM appointments`,
    [],
    (err, row) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err.message });
      res.json(row || {});
    }
  );
});

module.exports = router;
