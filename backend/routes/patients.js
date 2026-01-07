const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { v4: uuidv4 } = require('uuid');

router.get('/', (req, res) => {
  db.all('SELECT * FROM patients', (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(rows);
  });
});

router.get('/:id', (req, res) => {
  db.get('SELECT * FROM patients WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!row) return res.status(404).json({ message: 'Not found' });
    res.json(row);
  });
});

router.post('/', (req, res) => {
  const { name, age, phone, lastVisit, status } = req.body;
  const id = `P${Math.floor(Math.random() * 100000)}`;
  db.run('INSERT INTO patients (id,name,age,phone,lastVisit,status) VALUES (?,?,?,?,?,?)', [id, name, age || null, phone || '', lastVisit || '', status || 'Active'], function (err) {
    if (err) return res.status(500).json({ message: 'DB error' });
    db.get('SELECT * FROM patients WHERE id = ?', [id], (e, row) => {
      if (e) return res.status(500).json({ message: 'DB error' });
      res.status(201).json(row);
    });
  });
});

router.put('/:id', (req, res) => {
  const { name, age, phone, lastVisit, status } = req.body;
  db.run('UPDATE patients SET name = ?, age = ?, phone = ?, lastVisit = ?, status = ? WHERE id = ?', [name, age, phone, lastVisit, status, req.params.id], function (err) {
    if (err) return res.status(500).json({ message: 'DB error' });
    db.get('SELECT * FROM patients WHERE id = ?', [req.params.id], (e, row) => {
      if (e) return res.status(500).json({ message: 'DB error' });
      res.json(row);
    });
  });
});

router.delete('/:id', (req, res) => {
  db.run('DELETE FROM patients WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json({ success: true });
  });
});

module.exports = router;
