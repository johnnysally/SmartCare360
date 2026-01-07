const express = require('express');
const router = express.Router();
const { db } = require('../db');

router.get('/', (req, res) => {
  db.all('SELECT * FROM appointments', (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(rows);
  });
});

router.post('/', (req, res) => {
  const { patientId, time, type, status } = req.body;
  const id = `A${Math.floor(Math.random() * 100000)}`;
  db.run('INSERT INTO appointments (id,patientId,time,type,status) VALUES (?,?,?,?,?)', [id, patientId, time, type || '', status || 'pending'], function (err) {
    if (err) return res.status(500).json({ message: 'DB error' });
    db.get('SELECT * FROM appointments WHERE id = ?', [id], (e, row) => {
      if (e) return res.status(500).json({ message: 'DB error' });
      res.status(201).json(row);
    });
  });
});

router.get('/:id', (req, res) => {
  db.get('SELECT * FROM appointments WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!row) return res.status(404).json({ message: 'Not found' });
    res.json(row);
  });
});

router.put('/:id', (req, res) => {
  const { patientId, time, type, status } = req.body;
  db.run('UPDATE appointments SET patientId = ?, time = ?, type = ?, status = ? WHERE id = ?', [patientId, time, type, status, req.params.id], function (err) {
    if (err) return res.status(500).json({ message: 'DB error' });
    db.get('SELECT * FROM appointments WHERE id = ?', [req.params.id], (e, row) => {
      if (e) return res.status(500).json({ message: 'DB error' });
      res.json(row);
    });
  });
});

router.delete('/:id', (req, res) => {
  db.run('DELETE FROM appointments WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json({ success: true });
  });
});

module.exports = router;
