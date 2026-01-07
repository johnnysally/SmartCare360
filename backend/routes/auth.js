const express = require('express');
const router = express.Router();
const dbModule = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });

  db.get('SELECT * FROM users WHERE email = $1', [email], (err, user) => {
    if (err) {
      console.error('Auth login DB error', err && (err.message || err));
      return res.status(500).json({ message: 'DB error' });
    }
    if (!user) {
      console.warn('Auth login failed - user not found', { email });
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    let valid = false;
    try {
      valid = bcrypt.compareSync(password, user.password);
    } catch (e) {
      console.error('Auth bcrypt error', e && e.message);
      return res.status(500).json({ message: 'Server error' });
    }
    if (!valid) {
      console.warn('Auth login failed - bad password', { email });
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  });
});

router.post('/signup', (req, res) => {
  const { email, password, name, role = 'user' } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
  const hashed = bcrypt.hashSync(password, 10);
  const id = uuidv4();
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });

  db.run('INSERT INTO users (id,email,password,name,role) VALUES ($1,$2,$3,$4,$5)', [id, email, hashed, name || '', role], function (err) {
    if (err) {
      if (err.message && err.message.includes('UNIQUE')) return res.status(400).json({ message: 'Email already exists' });
      return res.status(500).json({ message: 'DB error' });
    }
    const token = jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id, email, name, role } });
  });
});

module.exports = router;
