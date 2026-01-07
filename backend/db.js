// db.js - Postgres-only
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables.');
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Render Postgres
});

/* ================= INIT ================= */
async function init() {
  try {
    // Test connection
    await pool.connect();
    console.log('Connected to Postgres database.');

    // Drop users table if exists (BE CAREFUL: all data will be lost)
    await pool.query(`DROP TABLE IF EXISTS users`);
    console.log('Dropped existing users table.');

    // Create users table with all required fields
    await pool.query(`
      CREATE TABLE users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        role TEXT,
        phone TEXT,
        facility_name TEXT,
        facility_type TEXT
      )
    `);
    console.log('Created users table with all columns.');

    // Seed admin user
    await pool.query(
      `INSERT INTO users (id, email, password, name, role, phone, facility_name, facility_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        'u-admin',
        'admin@smartcare360.co.ke',
        bcrypt.hashSync('password', 10),
        'System Admin',
        'admin',
        '',
        '',
        '',
      ]
    );
    console.log('Seeded admin user.');

    return pool;
  } catch (err) {
    console.error('Postgres initialization failed:', err);
    throw err;
  }
}

module.exports = { pool, init };
