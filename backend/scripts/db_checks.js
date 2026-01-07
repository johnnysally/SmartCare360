require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Client } = require('pg');

async function run() {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    console.error('No DATABASE_URL found in environment');
    process.exit(2);
  }

  const client = new Client({ connectionString: DATABASE_URL, ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : false });
  try {
    await client.connect();
    console.log('Connected to Postgres');

    const usersCount = await client.query("SELECT COUNT(*)::int AS cnt FROM users");
    console.log('users.count =', usersCount.rows[0].cnt);

    const email = process.env.DEBUG_EMAIL || 'debug+render@example.com';
    const userRow = await client.query('SELECT id,email, length(password) as password_len, password IS NOT NULL AS has_password FROM users WHERE email = $1', [email]);
    if (userRow.rows.length === 0) {
      console.log(`No user found with email=${email}`);
    } else {
      console.log('user:', userRow.rows[0]);
    }

    await client.end();
  } catch (err) {
    console.error('DB check failed:', err && err.message ? err.message : err);
    try { await client.end(); } catch (e) {}
    process.exit(1);
  }
}

run();
