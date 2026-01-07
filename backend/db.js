const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { Client } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL || null;
const DB_FILE = process.env.DATABASE_FILE || path.resolve(__dirname, './smartcare360.db');

let usingPostgres = false;
let db = null;

function createSqliteDb() {
  const exists = fs.existsSync(DB_FILE);
  const sdb = new sqlite3.Database(DB_FILE);
  return sdb;
}

function createPgWrapper(client) {
  // Provide a sqlite-like API: run(sql, params, cb), get(sql, params, cb), all(sql, params, cb)
  return {
    run(sql, params, cb) {
      client
        .query(sql, params)
        .then((res) => cb && cb(null))
        .catch((err) => cb && cb(err));
    },
    get(sql, params, cb) {
      client
        .query(sql, params)
        .then((res) => cb && cb(null, res.rows[0]))
        .catch((err) => cb && cb(err));
    },
    all(sql, params, cb) {
      client
        .query(sql, params)
        .then((res) => cb && cb(null, res.rows))
        .catch((err) => cb && cb(err));
    },
    serialize(cb) {
      // no-op for pg wrapper
      cb && cb();
    },
  };
}

async function init() {
  if (DATABASE_URL) {
    usingPostgres = true;
    const client = new Client({ connectionString: DATABASE_URL, ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : false });
    await client.connect();
    db = createPgWrapper(client);

    // Create tables in Postgres
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
        status TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS newsletter (
        email TEXT PRIMARY KEY,
        subscribedAt TEXT
      )`,
    ];

    for (const q of createQueries) {
      // use client.query directly for schema creation
      await client.query(q);
    }

    // Seed admin if none
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
  } else {
    usingPostgres = false;
    db = createSqliteDb();
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        password TEXT,
        name TEXT,
        role TEXT
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS patients (
        id TEXT PRIMARY KEY,
        name TEXT,
        age INTEGER,
        phone TEXT,
        lastVisit TEXT,
        status TEXT
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS appointments (
        id TEXT PRIMARY KEY,
        patientId TEXT,
        time TEXT,
        type TEXT,
        status TEXT
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS newsletter (
        email TEXT PRIMARY KEY,
        subscribedAt TEXT
      )`);

      // Seed admin user if none exists
      db.get('SELECT COUNT(*) as cnt FROM users', (err, row) => {
        if (err) return console.error(err);
        if (row && row.cnt === 0) {
          const id = 'u-admin';
          const email = 'admin@smartcare360.co.ke';
          const password = bcrypt.hashSync('password', 10);
          const name = 'System Admin';
          const role = 'admin';
          db.run(
            'INSERT INTO users (id,email,password,name,role) VALUES (?,?,?,?,?)',
            [id, email, password, name, role],
            (e) => {
              if (e) console.error('Failed seeding admin user', e);
              else console.log('Seeded admin user: admin@smartcare360.co.ke / password');
            },
          );
        }
      });
    });
  }
}

module.exports = { db, init, usingPostgres };
