require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { init } = require('./db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, PORT } = require('./config');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize DB first, then require routes so they get the initialized db
(async () => {
  try {
    await init();

    // now require routes after DB init
    const authRoutes = require('./routes/auth');
    const patientsRoutes = require('./routes/patients');
    const appointmentsRoutes = require('./routes/appointments');
    const queueRoutes = require('./routes/queue');
    const queuesRoutes = require('./routes/queues');
    const billingRoutes = require('./routes/billing');
    const pharmacyRoutes = require('./routes/pharmacy');
    const telemedicineRoutes = require('./routes/telemedicine');
    const referralsRoutes = require('./routes/referrals');
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
        console.error('JWT verification failed:', e.message);
        console.error('JWT_SECRET length:', JWT_SECRET.length);
        console.error('Token preview:', token.substring(0, 50) + '...');
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
    app.use('/queue', requireAuth, queueRoutes);
    app.use('/queues', requireAuth, queuesRoutes);
    app.use('/billing', requireAuth, billingRoutes);
    app.use('/pharmacy', requireAuth, pharmacyRoutes);
    app.use('/telemedicine', requireAuth, telemedicineRoutes);
    app.use('/referrals', requireAuth, referralsRoutes);
    app.use('/users', requireAuth, usersRoutes);

    app.listen(PORT, () => console.log(`SmartCare360 backend running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to initialize DB', err);
    process.exit(1);
  }
})();

// Process-level error handlers to ensure logs are visible
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception', err && (err.stack || err.message || err));
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection', reason && (reason.stack || reason.message || reason));
});
