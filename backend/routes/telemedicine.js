const express = require('express');
const router = express.Router();
const dbModule = require('../db');
const { v4: uuidv4 } = require('uuid');

router.get('/', (req, res) => {
  const db = dbModule.db; if (!db) return res.status(500).json({ message: 'DB not initialized' });
  db.all('SELECT * FROM telemedicine_sessions', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(rows || []);
  });
});

router.post('/', (req, res) => {
  const { patientId, doctorId, scheduledAt, status } = req.body;
  const id = uuidv4();
  const db = dbModule.db; if (!db) return res.status(500).json({ message: 'DB not initialized' });
  const sql = 'INSERT INTO telemedicine_sessions (id,patientId,doctorId,scheduledAt,status) VALUES ($1,$2,$3,$4,$5)';
  const params = [id, patientId, doctorId, scheduledAt || new Date().toISOString(), status || 'scheduled'];
  db.run(sql, params, (err) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    const getSql = 'SELECT * FROM telemedicine_sessions WHERE id = $1';
    db.get(getSql, [id], (e, row) => {
      if (e) return res.status(500).json({ message: 'DB error' });
      res.status(201).json(row);
    });
  });
});

// PUT /telemedicine/:id
router.put('/:id', (req, res) => {
  const { scheduledAt, status } = req.body;
  const db = dbModule.db; if (!db) return res.status(500).json({ message: 'DB not initialized' });
  const sql = 'UPDATE telemedicine_sessions SET scheduledAt = $1, status = $2 WHERE id = $3';
  const params = [scheduledAt, status, req.params.id];
  db.run(sql, params, (err) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    const getSql = 'SELECT * FROM telemedicine_sessions WHERE id = $1';
    db.get(getSql, [req.params.id], (e, row) => {
      if (e) return res.status(500).json({ message: 'DB error' });
      res.json(row);
    });
  });
});

// DELETE /telemedicine/:id
router.delete('/:id', (req, res) => {
  const db = dbModule.db; if (!db) return res.status(500).json({ message: 'DB not initialized' });
  const sql = 'DELETE FROM telemedicine_sessions WHERE id = $1';
  db.run(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json({ success: true });
  });
});

module.exports = router;
