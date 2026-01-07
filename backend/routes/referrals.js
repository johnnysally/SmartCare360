const express = require('express');
const router = express.Router();
const dbModule = require('../db');
const { v4: uuidv4 } = require('uuid');

router.get('/', (req, res) => {
  const db = dbModule.db; if (!db) return res.status(500).json({ message: 'DB not initialized' });
  db.all('SELECT * FROM referrals', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(rows || []);
  });
});

router.post('/', (req, res) => {
  const { patientId, fromFacility, toFacility, reason } = req.body;
  const id = uuidv4();
  const createdAt = new Date().toISOString();
  const db = dbModule.db; if (!db) return res.status(500).json({ message: 'DB not initialized' });
  const sql = 'INSERT INTO referrals (id,patientId,fromFacility,toFacility,reason,createdAt) VALUES ($1,$2,$3,$4,$5,$6)';
  const params = [id, patientId, fromFacility || '', toFacility || '', reason || '', createdAt];
  db.run(sql, params, (err) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    const getSql = 'SELECT * FROM referrals WHERE id = $1';
    db.get(getSql, [id], (e, row) => {
      if (e) return res.status(500).json({ message: 'DB error' });
      res.status(201).json(row);
    });
  });
});

// PUT /referrals/:id
router.put('/:id', (req, res) => {
  const { fromFacility, toFacility, reason } = req.body;
  const db = dbModule.db; if (!db) return res.status(500).json({ message: 'DB not initialized' });
  const sql = 'UPDATE referrals SET fromFacility=$1,toFacility=$2,reason=$3 WHERE id=$4';
  const params = [fromFacility, toFacility, reason, req.params.id];
  db.run(sql, params, (err) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    const getSql = 'SELECT * FROM referrals WHERE id = $1';
    db.get(getSql, [req.params.id], (e, row) => {
      if (e) return res.status(500).json({ message: 'DB error' });
      res.json(row);
    });
  });
});

// DELETE /referrals/:id
router.delete('/:id', (req, res) => {
  const db = dbModule.db; if (!db) return res.status(500).json({ message: 'DB not initialized' });
  const sql = 'DELETE FROM referrals WHERE id = $1';
  db.run(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json({ success: true });
  });
});

module.exports = router;
