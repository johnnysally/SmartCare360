const express = require('express');
const router = express.Router();
const dbModule = require('../db');
const { v4: uuidv4 } = require('uuid');

router.get('/', (req, res) => {
  const db = dbModule.db; if (!db) return res.status(500).json({ message: 'DB not initialized' });
  db.all('SELECT * FROM billing', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(rows || []);
  });
});

router.post('/', (req, res) => {
  const { patientId, amount, status } = req.body;
  const id = uuidv4();
  const db = dbModule.db; if (!db) return res.status(500).json({ message: 'DB not initialized' });
  const sql = 'INSERT INTO billing (id,patientId,amount,status,createdAt) VALUES ($1,$2,$3,$4,$5)';
  const params = [id, patientId, amount, status || 'pending', new Date().toISOString()];
  db.run(sql, params, (err) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    const getSql = 'SELECT * FROM billing WHERE id = $1';
    db.get(getSql, [id], (e, row) => {
      if (e) return res.status(500).json({ message: 'DB error' });
      res.status(201).json(row);
    });
  });
});

// PUT /billing/:id - update billing record
router.put('/:id', (req, res) => {
  const { amount, status } = req.body;
  const db = dbModule.db; if (!db) return res.status(500).json({ message: 'DB not initialized' });
  const sql = 'UPDATE billing SET amount = $1, status = $2 WHERE id = $3';
  const params = [amount, status, req.params.id];
  db.run(sql, params, (err) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    const getSql = 'SELECT * FROM billing WHERE id = $1';
    db.get(getSql, [req.params.id], (e, row) => {
      if (e) return res.status(500).json({ message: 'DB error' });
      res.json(row);
    });
  });
});

// DELETE /billing/:id
router.delete('/:id', (req, res) => {
  const db = dbModule.db; if (!db) return res.status(500).json({ message: 'DB not initialized' });
  const sql = 'DELETE FROM billing WHERE id = $1';
  db.run(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json({ success: true });
  });
});

// CSV report for billing
router.get('/report', async (req, res) => {
  const pool = dbModule.pool;
  if (!pool) return res.status(500).json({ message: 'DB not initialized' });
  try {
    const q = `SELECT b.id, b.patientId, p.name as patientName, b.amount, b.status, b.createdAt
      FROM billing b LEFT JOIN patients p ON b.patientId = p.id ORDER BY b.createdAt DESC`;
    const result = await pool.query(q);
    const rows = result.rows || [];
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="billing_report.csv"');
    const header = ['id','patientId','patientName','amount','status','createdAt'];
    const lines = [header.join(',')].concat(rows.map(r => [r.id,r.patientid || r.patientId || '', (r.patientname || r.patientName || '').replace(/,/g, ' '), r.amount, r.status, r.createdat || r.createdAt].join(',')));
    res.send(lines.join('\n'));
  } catch (err) {
    console.error('Failed to generate billing report', err && err.message);
    res.status(500).json({ message: 'DB error' });
  }
});

module.exports = router;

