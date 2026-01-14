const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// List users
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, name, role FROM users ORDER BY name');
    res.json(result.rows || []);
  } catch (err) {
    console.error('GET /users error', err && err.message);
    res.status(500).json({ message: 'Database error' });
  }
});

// Create user (admin creates staff)
router.post('/', async (req, res) => {
  const { email, password, name, role } = req.body || {};
  if (!email || !password || !name) return res.status(400).json({ message: 'Missing required fields' });

  try {
    const id = uuidv4();
    const hashed = bcrypt.hashSync(password, 10);
    await pool.query(
      'INSERT INTO users (id,email,password,name,role) VALUES ($1,$2,$3,$4,$5)',
      [id, email, hashed, name, role || 'staff']
    );
    const created = { id, email, name, role: role || 'staff' };
    res.json(created);
  } catch (err) {
    console.error('POST /users error', err && err.message);
    if (err.code === '23505') return res.status(400).json({ message: 'Email already exists' });
    res.status(500).json({ message: 'Database error' });
  }
});

// Update user (name, role)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, role } = req.body || {};
  if (!id) return res.status(400).json({ message: 'Missing id' });

  try {
    await pool.query('UPDATE users SET name = $1, role = $2 WHERE id = $3', [name, role, id]);
    const result = await pool.query('SELECT id, email, name, role FROM users WHERE id = $1', [id]);
    res.json(result.rows[0] || null);
  } catch (err) {
    console.error('PUT /users/:id error', err && err.message);
    res.status(500).json({ message: 'Database error' });
  }
});

// Change password
router.post('/:id/change-password', async (req, res) => {
  const { id } = req.params;
  const { password } = req.body || {};
  if (!id || !password) return res.status(400).json({ message: 'Missing parameters' });

  try {
    const hashed = bcrypt.hashSync(password, 10);
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashed, id]);
    res.json({ message: 'Password updated' });
  } catch (err) {
    console.error('POST /users/:id/change-password error', err && err.message);
    res.status(500).json({ message: 'Database error' });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: 'Missing id' });
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('DELETE /users/:id error', err && err.message);
    res.status(500).json({ message: 'Database error' });
  }
});

module.exports = router;
