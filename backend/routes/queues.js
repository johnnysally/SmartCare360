const express = require('express');
const router = express.Router();
const {
  checkInPatient,
  callNextPatient,
  completeService,
  getDepartmentQueue,
  getAllQueueStatus,
  getPatientNotifications,
  getQueueStats,
  getAnalyticsReport,
  setPriority,
  DEPARTMENTS,
  PRIORITY_LEVELS
} = require('../services/queueService');

// POST /queues/check-in - Patient check-in
router.post('/check-in', async (req, res) => {
  try {
    const { patientId, patientName, phone, department, priority } = req.body;
    
    if (!patientId || !patientName || !department) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const queue = await checkInPatient(patientId, patientName, phone, department, priority || PRIORITY_LEVELS.NORMAL);
    res.status(201).json(queue);
  } catch (err) {
    console.error('Check-in error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// GET /queues/department/:dept - Get department queue
router.get('/department/:dept', (req, res) => {
  const { dept } = req.params;
  
  if (!DEPARTMENTS.includes(dept)) {
    return res.status(400).json({ message: 'Invalid department' });
  }

  getDepartmentQueue(dept).then(queue => {
    res.json(queue);
  }).catch(err => {
    res.status(500).json({ message: err.message });
  });
});

// GET /queues/all - Get all departments' queues
router.get('/all', (req, res) => {
  getAllQueueStatus().then(queues => {
    res.json(queues);
  }).catch(err => {
    res.status(500).json({ message: err.message });
  });
});

// POST /queues/:id/call - Call next patient for department
router.post('/:id/call', async (req, res) => {
  try {
    const { id } = req.params;
    const { department, staffId } = req.body;

    if (!department) {
      return res.status(400).json({ message: 'Department required' });
    }

    const patient = await callNextPatient(department, staffId);
    
    if (!patient) {
      return res.status(404).json({ message: 'No patients in queue' });
    }

    res.json(patient);
  } catch (err) {
    console.error('Call patient error:', err);
    res.status(500).json({ message: err.message });
  }
});

// POST /queues/:id/complete - Complete service
router.post('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const { nextDepartment } = req.body;

    const result = await completeService(id, nextDepartment);
    res.json(result);
  } catch (err) {
    console.error('Complete service error:', err);
    res.status(500).json({ message: err.message });
  }
});

// PUT /queues/:id/priority - Set priority
router.put('/:id/priority', async (req, res) => {
  try {
    const { id } = req.params;
    const { priority } = req.body;

    if (![1, 2, 3, 4].includes(priority)) {
      return res.status(400).json({ message: 'Invalid priority level (1-4)' });
    }

    const queue = await setPriority(id, priority);
    res.json(queue);
  } catch (err) {
    console.error('Priority update error:', err);
    res.status(500).json({ message: err.message });
  }
});

// GET /queues/stats/:dept - Get department statistics
router.get('/stats/:dept', (req, res) => {
  const { dept } = req.params;

  getQueueStats(dept).then(stats => {
    res.json(stats);
  }).catch(err => {
    res.status(500).json({ message: err.message });
  });
});

// GET /queues/stats - Get overall statistics
router.get('/stats', (req, res) => {
  getQueueStats().then(stats => {
    res.json(stats);
  }).catch(err => {
    res.status(500).json({ message: err.message });
  });
});

// GET /queues/analytics - Get analytics report
router.get('/analytics', (req, res) => {
  const { department, days } = req.query;

  getAnalyticsReport(department, parseInt(days) || 7).then(report => {
    res.json(report);
  }).catch(err => {
    res.status(500).json({ message: err.message });
  });
});

// GET /queues/notifications/:patientId - Get patient notifications
router.get('/notifications/:patientId', (req, res) => {
  const { patientId } = req.params;

  getPatientNotifications(patientId).then(notifications => {
    res.json(notifications);
  }).catch(err => {
    res.status(500).json({ message: err.message });
  });
});

module.exports = router;
