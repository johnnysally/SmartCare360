const express = require('express');
const router = express.Router();
const dbModule = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

/* ===================== LOGIN ===================== */
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password required' });

  const db = dbModule.db;
  if (!db)
    return res.status(500).json({ message: 'DB not initialized' });

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  });
});

/* ===================== SIGNUP ===================== */
router.post('/signup', (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    facilityName,
    facilityType,
  } = req.body;

  if (!email || !password || !firstName)
    return res.status(400).json({ message: 'Missing required fields' });

  const name = `${firstName} ${lastName || ''}`.trim();
  const hashed = bcrypt.hashSync(password, 10);
  const id = uuidv4();

  const db = dbModule.db;
  if (!db)
    return res.status(500).json({ message: 'DB not initialized' });

  db.run(
    `
    INSERT INTO users (
      id, email, password, name, role, phone, facility_name, facility_type
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      email,
      hashed,
      name,
      'admin',
      phone || '',
      facilityName || '',
      facilityType || '',
    ],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE'))
          return res.status(400).json({ message: 'Email already exists' });

        return res.status(500).json({ message: 'DB error' });
      }

      const token = jwt.sign(
        { id, email, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '8h' }
      );

      res.json({
        token,
        user: {
          id,
          email,
          name,
          role: 'admin',
        },
      });
    }
  );
});

module.exports = router;
