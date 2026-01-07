const express = require('express');
const router = express.Router();
const { db } = require('../db');

// Store newsletter signups locally. Do not forward to demo APIs in production.
router.post('/', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required' });
  const now = new Date().toISOString();
  db.run(
    // Use parameter placeholders compatible with both SQLite and Postgres wrapper
    'INSERT INTO newsletter (email, subscribedAt) VALUES ($1,$2) ON CONFLICT DO NOTHING',
    [email, now],
    (err) => {
      if (err) return res.status(500).json({ message: 'DB error' });
      res.json({ message: 'Subscribed' });
    },
  );
});

module.exports = router;
