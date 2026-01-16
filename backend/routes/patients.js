const express = require('express');
const router = express.Router();
const dbModule = require('../db');
const { v4: uuidv4 } = require('uuid');

router.get('/', (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  db.all('SELECT * FROM patients', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(rows || []);
  });
});

// Return aggregated patient statistics: status counts, age buckets, visits per month
router.get('/stats', async (req, res) => {
  const pool = dbModule.pool;
  if (!pool) return res.status(500).json({ message: 'DB not initialized' });
  try {
    // Status counts
    const statusRes = await pool.query('SELECT COALESCE(status,\'Unknown\') as status, COUNT(*)::int as count FROM patients GROUP BY status');
    const statusCounts = {};
    statusRes.rows.forEach(r => { statusCounts[r.status] = Number(r.count); });

    // Age buckets
    const ageRes = await pool.query(`SELECT
      SUM(CASE WHEN age IS NOT NULL AND age <= 18 THEN 1 ELSE 0 END)::int as "0-18",
      SUM(CASE WHEN age IS NOT NULL AND age >= 19 AND age <= 35 THEN 1 ELSE 0 END)::int as "19-35",
      SUM(CASE WHEN age IS NOT NULL AND age >= 36 AND age <= 60 THEN 1 ELSE 0 END)::int as "36-60",
      SUM(CASE WHEN age IS NOT NULL AND age >= 61 THEN 1 ELSE 0 END)::int as "61+"
      FROM patients`);
    const ageBuckets = ageRes.rows[0] || { '0-18':0,'19-35':0,'36-60':0,'61+':0 };

    // Visits per month (last 6 months)
    const visitsRes = await pool.query("SELECT to_char(lastvisit::timestamp, 'Mon YYYY') as mon, COUNT(*)::int as count FROM patients WHERE lastvisit IS NOT NULL AND lastvisit <> '' GROUP BY mon");
    const visitsMap = {};
    visitsRes.rows.forEach(r => { visitsMap[r.mon] = Number(r.count); });

    // Build last 6 months labels and counts
    const months = [];
    const monthCounts = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = d.toLocaleString(undefined, { month: 'short', year: 'numeric' });
      months.push(key);
      monthCounts[key] = visitsMap[key] || 0;
    }

    res.json({ statusCounts, ageBuckets, visits: { months, counts: Object.values(monthCounts) } });
  } catch (err) {
    console.error('Error computing patient stats', err && err.message);
    res.status(500).json({ message: 'DB error' });
  }
});

router.get('/:id', (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  db.get('SELECT * FROM patients WHERE id = $1', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!row) return res.status(404).json({ message: 'Not found' });
    res.json(row);
  });
});

router.post('/', (req, res) => {
  const { name, age, phone, lastVisit, status } = req.body;
  const id = `P${Math.floor(Math.random() * 100000)}`;
  const db2 = dbModule.db;
  if (!db2) return res.status(500).json({ message: 'DB not initialized' });
  db2.run('INSERT INTO patients (id,name,age,phone,lastVisit,status) VALUES ($1,$2,$3,$4,$5,$6)', [id, name, age || null, phone || '', lastVisit || '', status || 'Active'], function (err) {
    if (err) return res.status(500).json({ message: 'DB error' });
    db2.get('SELECT * FROM patients WHERE id = $1', [id], (e, row) => {
      if (e) return res.status(500).json({ message: 'DB error' });
      res.status(201).json(row);
    });
  });
});

router.put('/:id', (req, res) => {
  const { name, age, phone, lastVisit, status } = req.body;
  const db3 = dbModule.db;
  if (!db3) return res.status(500).json({ message: 'DB not initialized' });
  db3.run('UPDATE patients SET name = $1, age = $2, phone = $3, lastVisit = $4, status = $5 WHERE id = $6', [name, age, phone, lastVisit, status, req.params.id], function (err) {
    if (err) return res.status(500).json({ message: 'DB error' });
    db3.get('SELECT * FROM patients WHERE id = $1', [req.params.id], (e, row) => {
      if (e) return res.status(500).json({ message: 'DB error' });
      res.json(row);
    });
  });
});

router.delete('/:id', (req, res) => {
  const db4 = dbModule.db;
  if (!db4) return res.status(500).json({ message: 'DB not initialized' });
  db4.run('DELETE FROM patients WHERE id = $1', [req.params.id], function (err) {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json({ success: true });
  });
});

module.exports = router;
