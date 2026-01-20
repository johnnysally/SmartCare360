const express = require('express');
const router = express.Router();
const dbModule = require('../db');
const { v4: uuidv4 } = require('uuid');

// ============= TELEMEDICINE SESSIONS =============

// Get all telemedicine sessions
router.get('/sessions', (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  
  const { patientId, doctorId, status } = req.query;
  let query = 'SELECT * FROM telemedicine_sessions WHERE 1=1';
  const params = [];
  
  if (patientId) {
    query += ' AND patientId = $' + (params.length + 1);
    params.push(patientId);
  }
  if (doctorId) {
    query += ' AND doctorId = $' + (params.length + 1);
    params.push(doctorId);
  }
  if (status) {
    query += ' AND status = $' + (params.length + 1);
    params.push(status);
  }
  
  query += ' ORDER BY scheduledAt DESC';
  
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err.message });
    res.json(rows || []);
  });
});

// Get single telemedicine session
router.get('/sessions/:id', (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  
  db.get('SELECT * FROM telemedicine_sessions WHERE id = $1', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err.message });
    if (!row) return res.status(404).json({ message: 'Session not found' });
    res.json(row);
  });
});

// Create telemedicine session
router.post('/sessions', (req, res) => {
  const { patientId, patientName, doctorId, doctorName, scheduledAt, status } = req.body;
  
  if (!patientId || !doctorId || !scheduledAt) {
    return res.status(400).json({ message: 'Missing required fields: patientId, doctorId, scheduledAt' });
  }
  
  const id = uuidv4();
  const now = new Date().toISOString();
  
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  
  db.run(
    `INSERT INTO telemedicine_sessions 
     (id, patientId, patientName, doctorId, doctorName, scheduledAt, status, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [id, patientId, patientName || 'Patient', doctorId, doctorName || 'Doctor', scheduledAt, status || 'scheduled', now, now],
    function (err) {
      if (err) return res.status(500).json({ message: 'DB error', error: err.message });
      
      db.get('SELECT * FROM telemedicine_sessions WHERE id = $1', [id], (e, row) => {
        if (e) return res.status(500).json({ message: 'DB error', error: e.message });
        res.status(201).json(row);
      });
    }
  );
});

// Update session status (start/end call)
router.put('/sessions/:id/status', (req, res) => {
  const { status, startedAt, endedAt, duration, callQuality, recordingUrl } = req.body;
  
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  
  const updates = [];
  const params = [];
  let paramIndex = 1;
  
  if (status) {
    updates.push(`status = $${paramIndex++}`);
    params.push(status);
  }
  if (startedAt) {
    updates.push(`startedAt = $${paramIndex++}`);
    params.push(startedAt);
  }
  if (endedAt) {
    updates.push(`endedAt = $${paramIndex++}`);
    params.push(endedAt);
  }
  if (duration !== undefined) {
    updates.push(`duration = $${paramIndex++}`);
    params.push(duration);
  }
  if (callQuality) {
    updates.push(`callQuality = $${paramIndex++}`);
    params.push(callQuality);
  }
  if (recordingUrl) {
    updates.push(`recordingUrl = $${paramIndex++}`);
    params.push(recordingUrl);
  }
  
  updates.push(`updated_at = $${paramIndex++}`);
  params.push(new Date().toISOString());
  params.push(req.params.id);
  
  const query = `UPDATE telemedicine_sessions SET ${updates.join(', ')} WHERE id = $${paramIndex}`;
  
  db.run(query, params, function (err) {
    if (err) return res.status(500).json({ message: 'DB error', error: err.message });
    
    db.get('SELECT * FROM telemedicine_sessions WHERE id = $1', [req.params.id], (e, row) => {
      if (e) return res.status(500).json({ message: 'DB error', error: e.message });
      res.json(row);
    });
  });
});

// ============= TELEMEDICINE CHAT =============

// Get chat messages for session
router.get('/sessions/:sessionId/chat', (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  
  db.all(
    'SELECT * FROM telemedicine_chat WHERE sessionId = $1 ORDER BY created_at ASC',
    [req.params.sessionId],
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err.message });
      res.json(rows || []);
    }
  );
});

// Send chat message
router.post('/sessions/:sessionId/chat', (req, res) => {
  const { senderId, senderName, senderRole, message, messageType } = req.body;
  
  if (!senderId || !message) {
    return res.status(400).json({ message: 'Missing required fields: senderId, message' });
  }
  
  const id = uuidv4();
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  
  db.run(
    `INSERT INTO telemedicine_chat 
     (id, sessionId, senderId, senderName, senderRole, message, messageType, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [id, req.params.sessionId, senderId, senderName || 'User', senderRole || 'patient', message, messageType || 'text', new Date().toISOString()],
    function (err) {
      if (err) return res.status(500).json({ message: 'DB error', error: err.message });
      
      db.get('SELECT * FROM telemedicine_chat WHERE id = $1', [id], (e, row) => {
        if (e) return res.status(500).json({ message: 'DB error', error: e.message });
        res.status(201).json(row);
      });
    }
  );
});

// ============= TELEMEDICINE PRESCRIPTIONS =============

// Get prescriptions for session
router.get('/sessions/:sessionId/prescriptions', (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  
  db.all(
    'SELECT * FROM telemedicine_prescriptions WHERE sessionId = $1 ORDER BY created_at DESC',
    [req.params.sessionId],
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err.message });
      res.json(rows || []);
    }
  );
});

// Create prescription from telemedicine session
router.post('/sessions/:sessionId/prescriptions', (req, res) => {
  const { patientId, doctorId, doctorName, medicineName, dosage, frequency, duration, instructions } = req.body;
  
  if (!medicineName || !dosage || !frequency) {
    return res.status(400).json({ message: 'Missing required fields: medicineName, dosage, frequency' });
  }
  
  const id = uuidv4();
  const now = new Date().toISOString();
  
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  
  db.run(
    `INSERT INTO telemedicine_prescriptions 
     (id, sessionId, patientId, doctorId, doctorName, medicineName, dosage, frequency, duration, instructions, status, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
    [id, req.params.sessionId, patientId, doctorId, doctorName || 'Doctor', medicineName, dosage, frequency, duration || '5 days', instructions || '', 'pending', now, now],
    function (err) {
      if (err) return res.status(500).json({ message: 'DB error', error: err.message });
      
      db.get('SELECT * FROM telemedicine_prescriptions WHERE id = $1', [id], (e, row) => {
        if (e) return res.status(500).json({ message: 'DB error', error: e.message });
        res.status(201).json(row);
      });
    }
  );
});

// Approve prescription
router.put('/prescriptions/:id/approve', (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  
  db.run(
    'UPDATE telemedicine_prescriptions SET status = $1, updated_at = $2 WHERE id = $3',
    ['approved', new Date().toISOString(), req.params.id],
    function (err) {
      if (err) return res.status(500).json({ message: 'DB error', error: err.message });
      
      db.get('SELECT * FROM telemedicine_prescriptions WHERE id = $1', [req.params.id], (e, row) => {
        if (e) return res.status(500).json({ message: 'DB error', error: e.message });
        res.json(row);
      });
    }
  );
});

// ============= DOCTOR PROFILES =============

// Get all doctor profiles
router.get('/doctors', (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  
  db.all('SELECT * FROM doctor_profiles WHERE isAvailable = true ORDER BY rating DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err.message });
    res.json(rows || []);
  });
});

// Get doctor profile
router.get('/doctors/:doctorId', (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  
  db.get('SELECT * FROM doctor_profiles WHERE doctorId = $1', [req.params.doctorId], (err, row) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err.message });
    if (!row) return res.status(404).json({ message: 'Doctor not found' });
    res.json(row);
  });
});

// Create/Update doctor profile
router.post('/doctors', (req, res) => {
  const { doctorId, firstName, lastName, email, phone, specialty, qualifications, experience, bio, consultationFee, languages } = req.body;
  
  if (!doctorId || !firstName || !lastName) {
    return res.status(400).json({ message: 'Missing required fields: doctorId, firstName, lastName' });
  }
  
  const id = uuidv4();
  const now = new Date().toISOString();
  
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  
  db.run(
    `INSERT INTO doctor_profiles 
     (id, doctorId, firstName, lastName, email, phone, specialty, qualifications, experience, bio, consultationFee, languages, isAvailable, totalConsultations, rating, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
    [id, doctorId, firstName, lastName, email, phone, specialty || '', qualifications || '', experience || 0, bio || '', consultationFee || 0, languages || '', true, 0, 5.0, now, now],
    function (err) {
      if (err) return res.status(500).json({ message: 'DB error', error: err.message });
      
      db.get('SELECT * FROM doctor_profiles WHERE doctorId = $1', [doctorId], (e, row) => {
        if (e) return res.status(500).json({ message: 'DB error', error: e.message });
        res.status(201).json(row);
      });
    }
  );
});

// ============= DOCTOR AVAILABILITY =============

// Get doctor availability
router.get('/doctors/:doctorId/availability', (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  
  db.all('SELECT * FROM doctor_availability WHERE doctorId = $1 ORDER BY dayOfWeek', [req.params.doctorId], (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err.message });
    res.json(rows || []);
  });
});

// Set doctor availability
router.post('/doctors/:doctorId/availability', (req, res) => {
  const { dayOfWeek, startTime, endTime, maxPatientsPerDay } = req.body;
  
  if (!dayOfWeek || !startTime || !endTime) {
    return res.status(400).json({ message: 'Missing required fields: dayOfWeek, startTime, endTime' });
  }
  
  const id = uuidv4();
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  
  db.run(
    `INSERT INTO doctor_availability 
     (id, doctorId, dayOfWeek, startTime, endTime, maxPatientsPerDay, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [id, req.params.doctorId, dayOfWeek, startTime, endTime, maxPatientsPerDay || 10, new Date().toISOString()],
    function (err) {
      if (err) return res.status(500).json({ message: 'DB error', error: err.message });
      
      db.get('SELECT * FROM doctor_availability WHERE id = $1', [id], (e, row) => {
        if (e) return res.status(500).json({ message: 'DB error', error: e.message });
        res.status(201).json(row);
      });
    }
  );
});

// ============= ANALYTICS =============

// Get doctor analytics
router.get('/doctors/:doctorId/analytics', (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  
  db.all('SELECT * FROM telemedicine_analytics WHERE doctorId = $1 ORDER BY date DESC LIMIT 30', [req.params.doctorId], (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err.message });
    res.json(rows || []);
  });
});

// Get telemedicine statistics
router.get('/statistics', (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  
  db.get(
    `SELECT 
      COUNT(*) as totalSessions,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completedSessions,
      SUM(CASE WHEN status = 'scheduled' THEN 1 ELSE 0 END) as scheduledSessions,
      SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelledSessions,
      AVG(duration) as avgDuration,
      COUNT(DISTINCT doctorId) as totalDoctors,
      COUNT(DISTINCT patientId) as totalPatients
     FROM telemedicine_sessions`,
    [],
    (err, row) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err.message });
      res.json(row || {});
    }
  );
});

module.exports = router;
