const express = require('express');
const router = express.Router();
const dbModule = require('../db');

// GET /queue - list appointments in queue (pending/confirmed)
router.get('/', (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  const sql = 'SELECT * FROM appointments WHERE status = $1 OR status = $2 ORDER BY time ASC';
  const params = ['confirmed', 'pending'];
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(rows || []);
  });
});

// POST /queue/call - mark first in-queue as served and return it
router.post('/call', (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  const selectSql = 'SELECT * FROM appointments WHERE status = $1 OR status = $2 ORDER BY time ASC LIMIT 1';
  const selectParams = ['confirmed', 'pending'];

  db.get(selectSql, selectParams, (err, appt) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!appt) return res.status(404).json({ message: 'No appointments in queue' });
    const now = new Date().toISOString();
    const updateSql = 'UPDATE appointments SET status = $1 WHERE id = $2';
    const updateParams = ['served', appt.id];
    db.run(updateSql, updateParams, (e) => {
      if (e) return res.status(500).json({ message: 'DB error' });
      // return the updated appointment
      const getSql = 'SELECT * FROM appointments WHERE id = $1';
      const getParams = [appt.id];
      db.get(getSql, getParams, (er, updated) => {
        if (er) return res.status(500).json({ message: 'DB error' });
        res.json(updated);
      });
    });
  });
});

module.exports = router;
