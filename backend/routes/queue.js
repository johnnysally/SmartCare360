const express = require('express');
const router = express.Router();
const dbModule = require('../db');

// GET /queue - list appointments in queue with optional filter
router.get('/', (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  
  const { status } = req.query;
  let sql = 'SELECT * FROM appointments WHERE status IN ($1, $2, $3, $4) ORDER BY time ASC';
  let params = ['pending', 'confirmed', 'in-progress', 'completed'];
  
  if (status && ['pending', 'confirmed', 'in-progress', 'completed', 'skipped'].includes(status)) {
    sql = 'SELECT * FROM appointments WHERE status = $1 ORDER BY time ASC';
    params = [status];
  }
  
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(rows || []);
  });
});

// GET /queue/stats - get queue statistics
router.get('/stats', (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  
  const statsSql = `
    SELECT 
      COUNT(CASE WHEN status IN ('pending', 'confirmed') THEN 1 END) as waiting,
      COUNT(CASE WHEN status = 'in-progress' THEN 1 END) as serving,
      COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
      COUNT(CASE WHEN status = 'skipped' THEN 1 END) as skipped,
      COUNT(*) as total
    FROM appointments
    WHERE DATE(time) = CURRENT_DATE
  `;
  
  db.get(statsSql, [], (err, stats) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    
    // Calculate average wait time
    const waitSql = `
      SELECT AVG(EXTRACT(EPOCH FROM (called_at - time))) as avg_wait_seconds
      FROM appointments
      WHERE status IN ('in-progress', 'completed')
      AND DATE(time) = CURRENT_DATE
      AND called_at IS NOT NULL
    `;
    
    db.get(waitSql, [], (err2, waitData) => {
      if (err2) {
        return res.json({ ...stats, avg_wait_minutes: 0 });
      }
      
      const avgWaitMinutes = waitData?.avg_wait_seconds 
        ? Math.round(waitData.avg_wait_seconds / 60) 
        : 0;
      
      res.json({ ...stats, avg_wait_minutes: avgWaitMinutes });
    });
  });
});

// POST /queue/call - mark first in-queue as in-progress
router.post('/call', (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  
  const selectSql = 'SELECT * FROM appointments WHERE status IN ($1, $2) ORDER BY time ASC LIMIT 1';
  const selectParams = ['pending', 'confirmed'];

  db.get(selectSql, selectParams, (err, appt) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!appt) return res.status(404).json({ message: 'No appointments in queue' });
    
    const now = new Date().toISOString();
    const updateSql = 'UPDATE appointments SET status = $1, called_at = $2 WHERE id = $3';
    const updateParams = ['in-progress', now, appt.id];
    
    db.run(updateSql, updateParams, (e) => {
      if (e) return res.status(500).json({ message: 'DB error' });
      
      const getSql = 'SELECT * FROM appointments WHERE id = $1';
      const getParams = [appt.id];
      
      db.get(getSql, getParams, (er, updated) => {
        if (er) return res.status(500).json({ message: 'DB error' });
        res.json(updated);
      });
    });
  });
});

// POST /queue/:id/complete - mark appointment as completed
router.post('/:id/complete', (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  
  const now = new Date().toISOString();
  const updateSql = 'UPDATE appointments SET status = $1, completed_at = $2 WHERE id = $3';
  const updateParams = ['completed', now, req.params.id];
  
  db.run(updateSql, updateParams, (err) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    
    const getSql = 'SELECT * FROM appointments WHERE id = $1';
    db.get(getSql, [req.params.id], (e, row) => {
      if (e) return res.status(500).json({ message: 'DB error' });
      res.json(row);
    });
  });
});

// POST /queue/:id/skip - skip patient in queue
router.post('/:id/skip', (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  
  const { reason } = req.body;
  const updateSql = 'UPDATE appointments SET status = $1, skip_reason = $2 WHERE id = $3';
  const updateParams = ['skipped', reason || 'Patient skipped', req.params.id];
  
  db.run(updateSql, updateParams, (err) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    
    const getSql = 'SELECT * FROM appointments WHERE id = $1';
    db.get(getSql, [req.params.id], (e, row) => {
      if (e) return res.status(500).json({ message: 'DB error' });
      res.json(row);
    });
  });
});

// PUT /queue/:id/status - update appointment status
router.put('/:id/status', (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  
  const { status } = req.body;
  if (!['pending', 'confirmed', 'in-progress', 'completed', 'skipped'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  
  const updateSql = 'UPDATE appointments SET status = $1 WHERE id = $2';
  const updateParams = [status, req.params.id];
  
  db.run(updateSql, updateParams, (err) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    
    const getSql = 'SELECT * FROM appointments WHERE id = $1';
    db.get(getSql, [req.params.id], (e, row) => {
      if (e) return res.status(500).json({ message: 'DB error' });
      res.json(row);
    });
  });
});

// DELETE /queue/:id - remove from queue
router.delete('/:id', (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });
  
  const deleteSql = 'DELETE FROM appointments WHERE id = $1';
  db.run(deleteSql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json({ success: true });
  });
});

module.exports = router;
