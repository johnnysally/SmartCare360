const express = require('express');
const router = express.Router();
const dbModule = require('../db');
const { v4: uuidv4 } = require('uuid');

router.get('/', (req, res) => {
  const db = dbModule.db; if (!db) return res.status(500).json({ message: 'DB not initialized' });
  db.all('SELECT * FROM pharmacy_orders', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(rows || []);
  });
});

router.post('/', (req, res) => {
  const { patientId, items, total, status } = req.body;
  const id = uuidv4();
  const db = dbModule.db; if (!db) return res.status(500).json({ message: 'DB not initialized' });
  const sql = 'INSERT INTO pharmacy_orders (id,patientId,items,total,status) VALUES ($1,$2,$3,$4,$5)';
  const params = [id, patientId, JSON.stringify(items || []), total || 0, status || 'pending'];
  db.run(sql, params, (err) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    const getSql = 'SELECT * FROM pharmacy_orders WHERE id = $1';
    db.get(getSql, [id], (e, row) => {
      if (e) return res.status(500).json({ message: 'DB error' });
      res.status(201).json(row);
    });
  });
});

// PUT /pharmacy/:id
router.put('/:id', (req, res) => {
  const { items, total, status } = req.body;
  const db = dbModule.db; if (!db) return res.status(500).json({ message: 'DB not initialized' });
  const sql = 'UPDATE pharmacy_orders SET items = $1, total = $2, status = $3 WHERE id = $4';
  const params = [JSON.stringify(items || []), total, status, req.params.id];
  db.run(sql, params, (err) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    const getSql = 'SELECT * FROM pharmacy_orders WHERE id = $1';
    db.get(getSql, [req.params.id], (e, row) => {
      if (e) return res.status(500).json({ message: 'DB error' });
      res.json(row);
    });
  });
});

// DELETE /pharmacy/:id
router.delete('/:id', (req, res) => {
  const db = dbModule.db; if (!db) return res.status(500).json({ message: 'DB not initialized' });
  const sql = 'DELETE FROM pharmacy_orders WHERE id = $1';
  db.run(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json({ success: true });
  });
});

// CSV report for pharmacy orders
router.get('/report', async (req, res) => {
  const pool = dbModule.pool;
  if (!pool) return res.status(500).json({ message: 'DB not initialized' });
  try {
    const q = `SELECT po.id, po.patientId, p.name as patientName, po.items, po.total, po.status FROM pharmacy_orders po LEFT JOIN patients p ON po.patientId = p.id ORDER BY po.createdat DESC`;
    const result = await pool.query(q);
    const rows = result.rows || [];
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="pharmacy_orders_report.csv"');
    const header = ['id','patientId','patientName','items','total','status'];
    const lines = [header.join(',')].concat(rows.map(r => [r.id, r.patientid || r.patientId || '', (r.patientname || r.patientName || '').replace(/,/g,' '), (typeof r.items === 'string' ? r.items.replace(/,/g,';') : JSON.stringify(r.items||'')).replace(/\n/g,' '), r.total, r.status].join(',')));
    res.send(lines.join('\n'));
  } catch (err) {
    console.error('Failed to generate pharmacy report', err && err.message);
    res.status(500).json({ message: 'DB error' });
  }
});

module.exports = router;
