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

    // Create users table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
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

    // Seed admin user if table is empty
    const { rows } = await pool.query(`SELECT COUNT(*)::int AS cnt FROM users`);
    if (rows[0].cnt === 0) {
      await pool.query(
        `INSERT INTO users (id, email, password, name, role)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          'u-admin',
          'admin@smartcare360.co.ke',
          bcrypt.hashSync('password', 10),
          'System Admin',
          'admin',
        ]
      );
      console.log('Seeded admin user.');
    }

    return pool;
  } catch (err) {
    console.error('Postgres initialization failed:', err);
    throw err;
  }
}

module.exports = { pool, init };
