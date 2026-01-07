const express = require('express');
const router = express.Router();
const dbModule = require('../db');
const { v4: uuidv4 } = require('uuid');

router.get('/', (req, res) => {
  const db = dbModule.db; if (!db) return res.status(500).json({ message: 'DB not initialized' });
  db.all('SELECT * FROM billing', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(rows || []);
  });
});

router.post('/', (req, res) => {
  const { patientId, amount, status } = req.body;
  const id = uuidv4();
  const db = dbModule.db; if (!db) return res.status(500).json({ message: 'DB not initialized' });
  const sql = 'INSERT INTO billing (id,patientId,amount,status,createdAt) VALUES ($1,$2,$3,$4,$5)';
  const params = [id, patientId, amount, status || 'pending', new Date().toISOString()];
  db.run(sql, params, (err) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    const getSql = 'SELECT * FROM billing WHERE id = $1';
    db.get(getSql, [id], (e, row) => {
      if (e) return res.status(500).json({ message: 'DB error' });
      res.status(201).json(row);
    });
  });
});

// PUT /billing/:id - update billing record
router.put('/:id', (req, res) => {
  const { amount, status } = req.body;
  const db = dbModule.db; if (!db) return res.status(500).json({ message: 'DB not initialized' });
  const sql = 'UPDATE billing SET amount = $1, status = $2 WHERE id = $3';
  const params = [amount, status, req.params.id];
  db.run(sql, params, (err) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    const getSql = 'SELECT * FROM billing WHERE id = $1';
    db.get(getSql, [req.params.id], (e, row) => {
      if (e) return res.status(500).json({ message: 'DB error' });
      res.json(row);
    });
  });
});

// DELETE /billing/:id
router.delete('/:id', (req, res) => {
  const db = dbModule.db; if (!db) return res.status(500).json({ message: 'DB not initialized' });
  const sql = 'DELETE FROM billing WHERE id = $1';
  db.run(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json({ success: true });
  });
});

module.exports = router;

