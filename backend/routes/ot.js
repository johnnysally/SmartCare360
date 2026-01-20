const express = require('express');
const router = express.Router();
const dbModule = require('../db');
const { v4: uuidv4 } = require('uuid');

// GET /ot/bookings - list all OT bookings
router.get('/bookings', (req, res) => {
  const db = dbModule.db; if (!db) return res.status(500).json({ message: 'DB not initialized' });
  db.all('SELECT * FROM ot_bookings ORDER BY scheduledAt DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(rows || []);
  });
});

// POST /ot/bookings - create booking
router.post('/bookings', (req, res) => {
  const { patientId, patientName, scheduledAt, operatingRoom, surgeonId, notes } = req.body;
  const id = uuidv4();
  const created_at = new Date().toISOString();
  const db = dbModule.db; if (!db) return res.status(500).json({ message: 'DB not initialized' });
  const sql = `INSERT INTO ot_bookings (id, patientId, patientName, scheduledAt, operatingRoom, surgeonId, status, notes, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`;
  const params = [id, patientId || '', patientName || '', scheduledAt || '', operatingRoom || '', surgeonId || '', 'scheduled', notes || '', created_at];
  db.run(sql, params, (err) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    db.get('SELECT * FROM ot_bookings WHERE id = $1', [id], (e, row) => {
      if (e) return res.status(500).json({ message: 'DB error' });
      res.status(201).json(row);
    });
  });
});

// GET /ot/bookings/:id
router.get('/bookings/:id', (req, res) => {
  const db = dbModule.db; if (!db) return res.status(500).json({ message: 'DB not initialized' });
  db.get('SELECT * FROM ot_bookings WHERE id = $1', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!row) return res.status(404).json({ message: 'Not found' });
    res.json(row);
  });
});

// PUT /ot/bookings/:id
router.put('/bookings/:id', (req, res) => {
  const { scheduledAt, operatingRoom, surgeonId, status, notes } = req.body;
  const db = dbModule.db; if (!db) return res.status(500).json({ message: 'DB not initialized' });
  const sql = `UPDATE ot_bookings SET scheduledAt = $1, operatingRoom = $2, surgeonId = $3, status = $4, notes = $5 WHERE id = $6`;
  const params = [scheduledAt, operatingRoom, surgeonId, status, notes, req.params.id];
  db.run(sql, params, (err) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    db.get('SELECT * FROM ot_bookings WHERE id = $1', [req.params.id], (e, row) => {
      if (e) return res.status(500).json({ message: 'DB error' });
      res.json(row);
    });
  });
});

// DELETE /ot/bookings/:id
router.delete('/bookings/:id', (req, res) => {
  const db = dbModule.db; if (!db) return res.status(500).json({ message: 'DB not initialized' });
  db.run('DELETE FROM ot_bookings WHERE id = $1', [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json({ success: true });
  });
});

module.exports = router;
