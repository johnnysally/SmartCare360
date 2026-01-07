const express = require('express');
const router = express.Router();
const dbModule = require('../db');
const { v4: uuidv4 } = require('uuid');

router.get('/', (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  db.all('SELECT * FROM patients', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(rows || []);
  });
});

router.get('/:id', (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  db.get('SELECT * FROM patients WHERE id = $1', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!row) return res.status(404).json({ message: 'Not found' });
    res.json(row);
  });
});

router.post('/', (req, res) => {
  const { name, age, phone, lastVisit, status } = req.body;
  const id = `P${Math.floor(Math.random() * 100000)}`;
  const db2 = dbModule.db;
  if (!db2) return res.status(500).json({ message: 'DB not initialized' });
  db2.run('INSERT INTO patients (id,name,age,phone,lastVisit,status) VALUES ($1,$2,$3,$4,$5,$6)', [id, name, age || null, phone || '', lastVisit || '', status || 'Active'], function (err) {
    if (err) return res.status(500).json({ message: 'DB error' });
    db2.get('SELECT * FROM patients WHERE id = $1', [id], (e, row) => {
      if (e) return res.status(500).json({ message: 'DB error' });
      res.status(201).json(row);
    });
  });
});

router.put('/:id', (req, res) => {
  const { name, age, phone, lastVisit, status } = req.body;
  const db3 = dbModule.db;
  if (!db3) return res.status(500).json({ message: 'DB not initialized' });
  db3.run('UPDATE patients SET name = $1, age = $2, phone = $3, lastVisit = $4, status = $5 WHERE id = $6', [name, age, phone, lastVisit, status, req.params.id], function (err) {
    if (err) return res.status(500).json({ message: 'DB error' });
    db3.get('SELECT * FROM patients WHERE id = $1', [req.params.id], (e, row) => {
      if (e) return res.status(500).json({ message: 'DB error' });
      res.json(row);
    });
  });
});

router.delete('/:id', (req, res) => {
  const db4 = dbModule.db;
  if (!db4) return res.status(500).json({ message: 'DB not initialized' });
  db4.run('DELETE FROM patients WHERE id = $1', [req.params.id], function (err) {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json({ success: true });
  });
});

module.exports = router;
