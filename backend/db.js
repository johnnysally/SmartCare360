const bcrypt = require('bcryptjs');
const { Client } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL;

let usingPostgres = false;
let db = null;
let pool = null;

function createPgWrapper(client) {
  return {
    run(sql, params, cb) {
      client
        .query(sql, params)
        .then((res) => cb && cb(null, res))
        .catch((err) => {
          console.error('PG run error', { err: err && err.message, sql, params });
          cb && cb(err);
        });
    },
    get(sql, params, cb) {
      client
        .query(sql, params)
        .then((res) => cb && cb(null, res.rows[0]))
        .catch((err) => {
          console.error('PG get error', { err: err && err.message, sql, params });
          cb && cb(err);
        });
    },
    all(sql, params, cb) {
      client
        .query(sql, params)
        .then((res) => cb && cb(null, res.rows))
        .catch((err) => {
          console.error('PG all error', { err: err && err.message, sql, params });
          cb && cb(err);
        });
    },
    serialize(cb) {
      cb && cb();
    },
  };
}

async function init() {
  if (!DATABASE_URL) {
    console.error('DATABASE_URL is not set. SmartCare360 backend requires a Postgres DATABASE_URL.');
    throw new Error('DATABASE_URL is required');
  }

  usingPostgres = true;
  const client = new Client({ connectionString: DATABASE_URL, ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : false });
  await client.connect();
  pool = client;
  db = createPgWrapper(client);
  module.exports.db = db;
  module.exports.usingPostgres = usingPostgres;
  module.exports.pool = pool;

  const createQueries = [
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      password TEXT,
      name TEXT,
      role TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS patients (
      id TEXT PRIMARY KEY,
      name TEXT,
      age INTEGER,
      phone TEXT,
      lastVisit TEXT,
      status TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      patientId TEXT,
      time TEXT,
      type TEXT,
      status TEXT,
      called_at TEXT,
      completed_at TEXT,
      skip_reason TEXT,
      priority INTEGER DEFAULT 3,
      department TEXT,
      queue_number TEXT,
      arrival_time TEXT,
      service_start_time TEXT,
      service_end_time TEXT,
      next_department TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS queues (
      id TEXT PRIMARY KEY,
      patient_id TEXT,
      patient_name TEXT,
      department TEXT,
      priority INTEGER DEFAULT 3,
      queue_number TEXT,
      status TEXT,
      arrival_time TEXT,
      call_time TEXT,
      service_start_time TEXT,
      service_end_time TEXT,
      waiting_time_seconds INTEGER DEFAULT 0,
      service_time_seconds INTEGER DEFAULT 0,
      created_at TEXT,
      updated_at TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      patient_id TEXT,
      patient_phone TEXT,
      notification_type TEXT,
      title TEXT,
      message TEXT,
      channel TEXT,
      status TEXT,
      created_at TEXT,
      sent_at TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS queue_analytics (
      id TEXT PRIMARY KEY,
      department TEXT,
      date TEXT,
      total_patients INTEGER DEFAULT 0,
      avg_wait_time_seconds INTEGER DEFAULT 0,
      max_wait_time_seconds INTEGER DEFAULT 0,
      peak_hour TEXT,
      congestion_level TEXT,
      created_at TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS consultations (
      id TEXT PRIMARY KEY,
      patientId TEXT,
      doctorId TEXT,
      notes TEXT,
      createdAt TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS prescriptions (
      id TEXT PRIMARY KEY,
      consultationId TEXT,
      medication TEXT,
      dosage TEXT,
      instructions TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS lab_results (
      id TEXT PRIMARY KEY,
      patientId TEXT,
      testName TEXT,
      result TEXT,
      recordedAt TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS telemedicine_sessions (
      id TEXT PRIMARY KEY,
      patientId TEXT,
      doctorId TEXT,
      scheduledAt TEXT,
      status TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS pharmacy_orders (
      id TEXT PRIMARY KEY,
      patientId TEXT,
      items TEXT,
      total REAL,
      status TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS referrals (
      id TEXT PRIMARY KEY,
      patientId TEXT,
      fromFacility TEXT,
      toFacility TEXT,
      reason TEXT,
      createdAt TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS billing (
      id TEXT PRIMARY KEY,
      patientId TEXT,
      amount REAL,
      status TEXT,
      createdAt TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS newsletter (
      email TEXT PRIMARY KEY,
      subscribedAt TEXT
    )`,
  ];

  for (const q of createQueries) {
    await client.query(q);
  }

  // Ensure common indexes for performance
  const indexQueries = [
    `CREATE INDEX IF NOT EXISTS idx_appointments_patientId ON appointments (patientId)`,
    `CREATE INDEX IF NOT EXISTS idx_appointments_department ON appointments (department)`,
    `CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments (status)`,
    `CREATE INDEX IF NOT EXISTS idx_appointments_priority ON appointments (priority)`,
    `CREATE INDEX IF NOT EXISTS idx_consultations_patientId ON consultations (patientId)`,
    `CREATE INDEX IF NOT EXISTS idx_prescriptions_consultationId ON prescriptions (consultationId)`,
    `CREATE INDEX IF NOT EXISTS idx_lab_results_patientId ON lab_results (patientId)`,
    `CREATE INDEX IF NOT EXISTS idx_telemedicine_sessions_patientId ON telemedicine_sessions (patientId)`,
    `CREATE INDEX IF NOT EXISTS idx_pharmacy_orders_patientId ON pharmacy_orders (patientId)`,
    `CREATE INDEX IF NOT EXISTS idx_referrals_patientId ON referrals (patientId)`,
    `CREATE INDEX IF NOT EXISTS idx_billing_patientId ON billing (patientId)`,
    `CREATE INDEX IF NOT EXISTS idx_queues_department ON queues (department)`,
    `CREATE INDEX IF NOT EXISTS idx_queues_status ON queues (status)`,
    `CREATE INDEX IF NOT EXISTS idx_queues_priority ON queues (priority)`,
    `CREATE INDEX IF NOT EXISTS idx_queues_patient_id ON queues (patient_id)`,
    `CREATE INDEX IF NOT EXISTS idx_notifications_patient_id ON notifications (patient_id)`,
    `CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications (status)`,
    `CREATE INDEX IF NOT EXISTS idx_queue_analytics_department ON queue_analytics (department)`
  ];

  for (const iq of indexQueries) {
    try {
      await client.query(iq);
    } catch (err) {
      console.error('Failed to create index', { err: err && err.message, iq });
    }
  }

  const { rows } = await client.query('SELECT COUNT(*)::int as cnt FROM users');
  if (rows[0].cnt === 0) {
    const id = 'u-admin';
    const email = 'admin@smartcare360.co.ke';
    const password = bcrypt.hashSync('password', 10);
    const name = 'System Admin';
    const role = 'admin';
    await client.query('INSERT INTO users (id,email,password,name,role) VALUES ($1,$2,$3,$4,$5)', [id, email, password, name, role]);
    console.log('Seeded admin user: admin@smartcare360.co.ke / password');
  }
}

module.exports = { db: db, init, usingPostgres, pool };
