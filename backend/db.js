const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { Client } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL || null;
const DB_FILE = process.env.DATABASE_FILE || path.resolve(__dirname, './smartcare360.db');

let usingPostgres = false;
let db = null;

/* ================= SQLITE ================= */
function createSqliteDb() {
  if (!fs.existsSync(path.dirname(DB_FILE))) {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  }
  return new sqlite3.Database(DB_FILE);
}

/* ================= PG WRAPPER ================= */
function createPgWrapper(client) {
  return {
    run(sql, params = [], cb) {
      client
        .query(sql, params)
        .then(() => cb && cb(null))
        .catch((err) => cb && cb(err));
    },
    get(sql, params = [], cb) {
      client
        .query(sql, params)
        .then((res) => cb && cb(null, res.rows[0]))
        .catch((err) => cb && cb(err));
    },
    all(sql, params = [], cb) {
      client
        .query(sql, params)
        .then((res) => cb && cb(null, res.rows))
        .catch((err) => cb && cb(err));
    },
    serialize(cb) {
      // For sqlite compatibility
      cb && cb();
    },
    client, // expose raw client if needed
  };
}

/* ================= INIT ================= */
async function init() {
  /* ---------- POSTGRES ---------- */
  if (DATABASE_URL) {
    usingPostgres = true;

    const client = new Client({
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // required for Render
    });

    try {
      await client.connect();
      db = createPgWrapper(client);

      // Create users table if it doesn't exist
      await client.query(`
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

      // Seed admin user if table empty
      const { rows } = await client.query(`SELECT COUNT(*)::int AS cnt FROM users`);
      if (rows[0].cnt === 0) {
        await client.query(
          `INSERT INTO users (id, email, password, name, role) VALUES ($1,$2,$3,$4,$5)`,
          [
            'u-admin',
            'admin@smartcare360.co.ke',
            bcrypt.hashSync('password', 10),
            'System Admin',
            'admin',
          ]
        );
        console.log('Seeded admin user (Postgres)');
      }

      module.exports.db = db;
      module.exports.usingPostgres = usingPostgres;
      return db;
    } catch (err) {
      console.error('Postgres connection failed:', err);
      throw err;
    }
  }

  /* ---------- SQLITE ---------- */
  usingPostgres = false;
  db = createSqliteDb();

  db.serialize(() => {
    db.run(`
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

    db.get(`SELECT COUNT(*) AS cnt FROM users`, (err, row) => {
      if (err) return console.error(err);
      if (row.cnt === 0) {
        db.run(
          `INSERT INTO users (id, email, password, name, role) VALUES (?,?,?,?,?)`,
          [
            'u-admin',
            'admin@smartcare360.co.ke',
            bcrypt.hashSync('password', 10),
            'System Admin',
            'admin',
          ],
          () => console.log('Seeded admin user (SQLite)')
        );
      }
    });
  });

  module.exports.db = db;
  module.exports.usingPostgres = usingPostgres;
  return db;
}

module.exports = { db, init, usingPostgres };
