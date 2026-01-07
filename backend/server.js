require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { init } = require('./db');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

// Initialize DB first, then require routes so they get the initialized db
(async () => {
  try {
    await init();

    // now require routes after DB init
    const authRoutes = require('./routes/auth');
    const patientsRoutes = require('./routes/patients');
    const appointmentsRoutes = require('./routes/appointments');
    const newsletterRoutes = require('./routes/newsletter');
    const usersRoutes = require('./routes/users');

    // Simple token middleware
    function requireAuth(req, res, next) {
      const header = req.headers.authorization;
      if (!header) return res.status(401).json({ message: 'Missing authorization' });
      const [type, token] = header.split(' ');
      if (type !== 'Bearer' || !token) return res.status(401).json({ message: 'Invalid authorization' });
      try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        next();
      } catch (e) {
        return res.status(401).json({ message: 'Invalid token' });
      }
    }

    // Health
    app.get('/health', (req, res) => res.json({ status: 'ok' }));

    // Public routes
    app.use('/auth', authRoutes);
    app.use('/newsletter', newsletterRoutes);

    // Protected routes
    app.use('/patients', requireAuth, patientsRoutes);
    app.use('/appointments', requireAuth, appointmentsRoutes);
    app.use('/users', requireAuth, usersRoutes);

    app.listen(PORT, () => console.log(`SmartCare360 backend running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to initialize DB', err);
    process.exit(1);
  }
})();

// (end init wrapper)

// Simple token middleware placeholder (kept for editor readability)
function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'Missing authorization' });
  const [type, token] = header.split(' ');
  if (type !== 'Bearer' || !token) return res.status(401).json({ message: 'Invalid authorization' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
// Note: real route mounting happens after DB init above
