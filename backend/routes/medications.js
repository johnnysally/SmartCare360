const express = require('express');
const router = express.Router();
const dbModule = require('../db');
const { v4: uuidv4 } = require('uuid');

// GET all medications (with optional filters)
router.get('/', (req, res) => {
  const { status, patientId, wardId } = req.query;
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });

  let sql = 'SELECT * FROM medication_orders WHERE 1=1';
  const params = [];

  if (status) {
    sql += ' AND status = $' + (params.length + 1);
    params.push(status);
  }
  if (patientId) {
    sql += ' AND patient_id = $' + (params.length + 1);
    params.push(patientId);
  }
  if (wardId) {
    sql += ' AND ward_id = $' + (params.length + 1);
    params.push(wardId);
  }

  sql += ' ORDER BY due_time ASC';

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error('DB error', err);
      return res.status(500).json({ message: 'DB error' });
    }
    res.json(rows || []);
  });
});

// GET medication by ID
router.get('/:id', (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });

  const sql = 'SELECT * FROM medication_orders WHERE id = $1';
  db.get(sql, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!row) return res.status(404).json({ message: 'Medication not found' });
    res.json(row);
  });
});

// POST - Create new medication order (Doctor prescribes)
router.post('/', (req, res) => {
  const { patientId, patientName, wardId, drugName, dose, route, frequency, startTime, endTime, specialInstructions, doctorId, doctorName } = req.body;
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });

  if (!patientId || !drugName || !dose || !route || !frequency) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const id = uuidv4();
  const createdAt = new Date().toISOString();
  const dueTime = startTime;

  const sql = `
    INSERT INTO medication_orders 
    (id, patient_id, patient_name, ward_id, drug_name, dose, route, frequency, 
     start_time, end_time, special_instructions, status, doctor_id, doctor_name, 
     created_at, due_time, created_by)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
  `;

  const params = [
    id,
    patientId,
    patientName || 'Unknown',
    wardId || 'General',
    drugName,
    dose,
    route,
    frequency,
    startTime,
    endTime,
    specialInstructions || '',
    'pending',
    doctorId || 'unknown-doctor',
    doctorName || 'Unknown Doctor',
    createdAt,
    dueTime,
    'doctor'
  ];

  db.run(sql, params, (err) => {
    if (err) {
      console.error('DB error', err);
      return res.status(500).json({ message: 'DB error' });
    }

    const getSql = 'SELECT * FROM medication_orders WHERE id = $1';
    db.get(getSql, [id], (e, row) => {
      if (e) return res.status(500).json({ message: 'DB error' });
      res.status(201).json(row);
    });
  });
});

// PUT - Update medication status (Pharmacy dispense, Nurse administer)
router.put('/:id', (req, res) => {
  const { status, pharmacyNotes, administeredAt, administeredBy, administeredByNurse, notes } = req.body;
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });

  let sql = 'UPDATE medication_orders SET status = $1';
  const params = [status, req.params.id];

  if (pharmacyNotes) {
    sql += ', pharmacy_notes = $' + (params.length);
    params.splice(1, 0, pharmacyNotes);
  }

  if (administeredAt) {
    sql += ', administered_at = $' + (params.length);
    params.splice(1, 0, administeredAt);
  }

  if (administeredBy) {
    sql += ', administered_by = $' + (params.length);
    params.splice(1, 0, administeredBy);
  }

  if (administeredByNurse) {
    sql += ', administered_by_nurse = $' + (params.length);
    params.splice(1, 0, administeredByNurse);
  }

  if (notes) {
    sql += ', administration_notes = $' + (params.length);
    params.splice(1, 0, notes);
  }

  sql += ' WHERE id = $' + params.length;

  db.run(sql, params, (err) => {
    if (err) {
      console.error('DB error', err);
      return res.status(500).json({ message: 'DB error' });
    }

    const getSql = 'SELECT * FROM medication_orders WHERE id = $1';
    db.get(getSql, [req.params.id], (e, row) => {
      if (e) return res.status(500).json({ message: 'DB error' });
      res.json(row);
    });
  });
});

// DELETE medication order
router.delete('/:id', (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });

  const sql = 'DELETE FROM medication_orders WHERE id = $1';
  db.run(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json({ success: true });
  });
});

// GET medication history for patient
router.get('/patient/:patientId', (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });

  const sql = 'SELECT * FROM medication_orders WHERE patient_id = $1 ORDER BY created_at DESC';
  db.all(sql, [req.params.patientId], (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(rows || []);
  });
});

// GET medication administration audit log
router.get('/admin/audit-log', (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });

  const sql = `
    SELECT id, patient_id, patient_name, drug_name, dose, route, status, 
           administered_at, administered_by_nurse, created_at
    FROM medication_orders
    WHERE status IN ('given', 'missed', 'held')
    ORDER BY administered_at DESC
    LIMIT 1000
  `;

  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(rows || []);
  });
});

module.exports = router;
