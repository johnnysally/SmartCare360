const express = require('express');
const router = express.Router();
const dbModule = require('../db');

router.get('/', (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  db.all('SELECT * FROM appointments', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(rows || []);
  });
});

router.post('/', (req, res) => {
  const { patientId, time, type, status } = req.body;
  const id = `A${Math.floor(Math.random() * 100000)}`;
  const db2 = dbModule.db;
  if (!db2) return res.status(500).json({ message: 'DB not initialized' });
  db2.run('INSERT INTO appointments (id,patientId,time,type,status) VALUES ($1,$2,$3,$4,$5)', [id, patientId, time, type || '', status || 'pending'], function (err) {
    if (err) return res.status(500).json({ message: 'DB error' });
    db2.get('SELECT * FROM appointments WHERE id = $1', [id], (e, row) => {
      if (e) return res.status(500).json({ message: 'DB error' });
      res.status(201).json(row);
    });
  });
});

router.get('/:id', (req, res) => {
  const db3 = dbModule.db;
  if (!db3) return res.status(500).json({ message: 'DB not initialized' });
  db3.get('SELECT * FROM appointments WHERE id = $1', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!row) return res.status(404).json({ message: 'Not found' });
    res.json(row);
  });
});

router.put('/:id', (req, res) => {
  const { patientId, time, type, status } = req.body;
  const db4 = dbModule.db;
  if (!db4) return res.status(500).json({ message: 'DB not initialized' });
  db4.run('UPDATE appointments SET patientId = $1, time = $2, type = $3, status = $4 WHERE id = $5', [patientId, time, type, status, req.params.id], function (err) {
    if (err) return res.status(500).json({ message: 'DB error' });
    db4.get('SELECT * FROM appointments WHERE id = $1', [req.params.id], (e, row) => {
      if (e) return res.status(500).json({ message: 'DB error' });
      res.json(row);
    });
  });
});

router.delete('/:id', (req, res) => {
  const db5 = dbModule.db;
  if (!db5) return res.status(500).json({ message: 'DB not initialized' });
  db5.run('DELETE FROM appointments WHERE id = $1', [req.params.id], function (err) {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json({ success: true });
  });
});

module.exports = router;
