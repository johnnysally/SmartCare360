const express = require('express');
const router = express.Router();
const { db } = require('../db');

router.get('/', (req, res) => {
  db.all('SELECT id, email, name, role FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(rows || []);
  });
});

module.exports = router;
