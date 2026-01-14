// routes/auth.js
const express = require('express');
const router = express.Router();
const { pool } = require('../db'); // <-- fixed
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { JWT_SECRET } = require('../config');

/* ===================== LOGIN ===================== */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
    console.log('Login successful - JWT_SECRET length:', JWT_SECRET.length);
    console.log('Generated token preview:', token.substring(0, 50) + '...');

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        facility_name: user.facility_name,
        facility_type: user.facility_type,
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Database error' });
  }
});

/* ===================== SIGNUP ===================== */
router.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password, phone, facilityName, facilityType } = req.body;

  if (!email || !password || !firstName)
    return res.status(400).json({ message: 'Missing required fields' });

  const name = `${firstName} ${lastName || ''}`.trim();
  const hashedPassword = bcrypt.hashSync(password, 10);
  const id = uuidv4();

  try {
    const insertQuery = `
      INSERT INTO users (id, email, password, name, role, phone, facility_name, facility_type)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, email, name, role, phone, facility_name, facility_type;
    `;

    const values = [id, email, hashedPassword, name, 'admin', phone || '', facilityName || '', facilityType || ''];

    const result = await pool.query(insertQuery, values);
    const user = result.rows[0];

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '8h' });

    res.json({ token, user });
  } catch (err) {
    console.error('Signup Error:', err);

    if (err.code === '23505') return res.status(400).json({ message: 'Email already exists' });

    res.status(500).json({ message: 'Database error' });
  }
});

module.exports = router;
