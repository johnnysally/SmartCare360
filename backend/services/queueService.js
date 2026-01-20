// Queue Service - Core business logic for queue management
const { db, pool } = require('../db');

const PRIORITY_LEVELS = {
  EMERGENCY: 1,
  URGENT: 2,
  NORMAL: 3,
  FOLLOW_UP: 4
};

const DEPARTMENTS = ['OPD', 'Emergency', 'Laboratory', 'Radiology', 'Pharmacy', 'Billing'];

// Generate queue number format: DEPT-XXX
function generateQueueNumber(department) {
  const deptCode = department.substring(0, 3).toUpperCase();
  const randomNum = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
  return `${deptCode}-${randomNum}`;
}

// Check in patient and create queue entry
async function checkInPatient(patientId, patientName, phone, department, priority = PRIORITY_LEVELS.NORMAL) {
  return new Promise((resolve, reject) => {
    if (!DEPARTMENTS.includes(department)) {
      return reject({ message: 'Invalid department' });
    }

    const queueId = `Q${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    const queueNumber = generateQueueNumber(department);
    const arrivalTime = new Date().toISOString();

    const sql = `
      INSERT INTO queues (id, patient_id, patient_name, department, priority, queue_number, status, arrival_time, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `;

    const params = [queueId, patientId, patientName, department, priority, queueNumber, 'waiting', arrivalTime, arrivalTime, arrivalTime];

    db.run(sql, params, function(err) {
      if (err) return reject({ message: 'DB error', err });

      // Create welcome notification
      createNotification(patientId, phone, 'REGISTRATION', 
        `Welcome ${patientName}`, 
        `Hello ${patientName}, you are successfully registered.\nYour queue number is ${queueNumber}.\nPlease wait, you will be notified shortly.`
      ).catch(e => console.error('Notification error:', e));

      db.get(`SELECT * FROM queues WHERE id = $1`, [queueId], (e, queue) => {
        if (e) return reject({ message: 'DB error', e });
        resolve(queue);
      });
    });
  });
}

// Get next patient from queue (FIFO + Priority)
async function getNextPatient(department) {
  return new Promise((resolve, reject) => {
    // Query: Get highest priority waiting patient, ordered by arrival time
    const sql = `
      SELECT * FROM queues 
      WHERE department = $1 AND status = 'waiting'
      ORDER BY priority ASC, arrival_time ASC
      LIMIT 1
    `;

    db.get(sql, [department], (err, patient) => {
      if (err) return reject({ message: 'DB error', err });
      if (!patient) return resolve(null);
      resolve(patient);
    });
  });
}

// Call next patient (update status and record call time)
async function callNextPatient(department, staffId) {
  return new Promise((resolve, reject) => {
    getNextPatient(department).then(patient => {
      if (!patient) return resolve(null);

      const callTime = new Date().toISOString();
      const updateSql = `
        UPDATE queues 
        SET status = 'serving', call_time = $1, service_start_time = $1, updated_at = $1
        WHERE id = $2
      `;

      db.run(updateSql, [callTime, patient.id], (err) => {
        if (err) return reject({ message: 'DB error', err });

        // Calculate waiting time
        const waitingSeconds = (new Date(callTime) - new Date(patient.arrival_time)) / 1000;

        // Send notification to patient
        createNotification(patient.patient_id, null, 'CALLED',
          `It's your turn, ${patient.patient_name}!`,
          `Dear ${patient.patient_name}, it is now your turn.\nPlease proceed to the ${department} counter.`
        ).catch(e => console.error('Notification error:', e));

        // Update analytics
        updateQueueAnalytics(department).catch(e => console.error('Analytics error:', e));

        db.get(`SELECT * FROM queues WHERE id = $1`, [patient.id], (e, updated) => {
          if (e) return reject({ message: 'DB error', e });
          updated.waiting_time_seconds = Math.round(waitingSeconds);
          resolve(updated);
        });
      });
    }).catch(reject);
  });
}

// Complete service and optionally route to next department
async function completeService(queueId, nextDepartment = null) {
  return new Promise((resolve, reject) => {
    const serviceEndTime = new Date().toISOString();

    const sql = `
      SELECT * FROM queues WHERE id = $1
    `;

    db.get(sql, [queueId], (err, queue) => {
      if (err) return reject({ message: 'DB error', err });
      if (!queue) return reject({ message: 'Queue entry not found' });

      const serviceTime = (new Date(serviceEndTime) - new Date(queue.service_start_time)) / 1000;

      const updateSql = `
        UPDATE queues 
        SET status = 'completed', service_end_time = $1, updated_at = $1
        WHERE id = $2
      `;

      db.run(updateSql, [serviceEndTime, queueId], (e) => {
        if (e) return reject({ message: 'DB error', e });

        // If next department specified, auto-route patient
        if (nextDepartment && DEPARTMENTS.includes(nextDepartment)) {
          checkInPatient(queue.patient_id, queue.patient_name, null, nextDepartment, queue.priority)
            .then(newQueue => {
              // Send routing notification
              createNotification(queue.patient_id, null, 'ROUTED',
                'Next Department',
                `Your consultation is complete.\nPlease proceed to ${nextDepartment}.\nYour new queue number is ${newQueue.queue_number}.`
              ).catch(e => console.error('Notification error:', e));

              resolve({ completed: queue, routed: newQueue });
            })
            .catch(reject);
        } else {
          // Notify patient service is complete
          createNotification(queue.patient_id, null, 'COMPLETED',
            'Service Complete',
            `Thank you ${queue.patient_name}. Your service has been completed. Please exit through the exit counter.`
          ).catch(e => console.error('Notification error:', e));

          resolve({ completed: queue });
        }
      });
    });
  });
}

// Get department queue status
async function getDepartmentQueue(department, limit = 20) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM queues 
      WHERE department = $1 AND status IN ('waiting', 'serving')
      ORDER BY status DESC, priority ASC, arrival_time ASC
      LIMIT $2
    `;

    db.all(sql, [department, limit], (err, rows) => {
      if (err) return reject({ message: 'DB error', err });
      resolve(rows || []);
    });
  });
}

// Get all department queues
async function getAllQueueStatus() {
  return new Promise((resolve, reject) => {
    const promises = DEPARTMENTS.map(dept => getDepartmentQueue(dept, 10));

    Promise.all(promises).then(results => {
      const queueStatus = {};
      DEPARTMENTS.forEach((dept, idx) => {
        queueStatus[dept] = results[idx];
      });
      resolve(queueStatus);
    }).catch(reject);
  });
}

// Create notification
async function createNotification(patientId, phoneNumber, type, title, message) {
  return new Promise((resolve, reject) => {
    const notifId = `N${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    const createdAt = new Date().toISOString();

    const sql = `
      INSERT INTO notifications (id, patient_id, patient_phone, notification_type, title, message, channel, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;

    // Use 'SMS' if phone provided, else 'IN_APP'
    const channel = phoneNumber ? 'SMS' : 'IN_APP';
    const params = [notifId, patientId, phoneNumber, type, title, message, channel, 'sent', createdAt];

    db.run(sql, params, (err) => {
      if (err) return reject({ message: 'DB error', err });
      
      // TODO: Integrate with SMS service (Twilio, etc.) if SMS channel
      if (channel === 'SMS' && phoneNumber) {
        console.log(`[SMS] ${phoneNumber}: ${title}\n${message}`);
      }

      db.get(`SELECT * FROM notifications WHERE id = $1`, [notifId], (e, notif) => {
        if (e) return reject({ message: 'DB error', e });
        resolve(notif);
      });
    });
  });
}

// Get patient notifications
async function getPatientNotifications(patientId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM notifications 
      WHERE patient_id = $1
      ORDER BY created_at DESC
      LIMIT 50
    `;

    db.all(sql, [patientId], (err, rows) => {
      if (err) return reject({ message: 'DB error', err });
      resolve(rows || []);
    });
  });
}

// Get queue statistics
async function getQueueStats(department = null) {
  return new Promise((resolve, reject) => {
    const whereDept = department ? `AND department = '${department}'` : '';
    
    const sql = `
      SELECT 
        COUNT(CASE WHEN status = 'waiting' THEN 1 END) as waiting,
        COUNT(CASE WHEN status = 'serving' THEN 1 END) as serving,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
        ROUND(AVG(EXTRACT(EPOCH FROM (call_time::timestamptz - arrival_time::timestamptz)))::numeric, 0)::integer as avg_wait_seconds,
        MAX(EXTRACT(EPOCH FROM (call_time::timestamptz - arrival_time::timestamptz)))::integer as max_wait_seconds
      FROM queues 
      WHERE (created_at::date) = CURRENT_DATE ${whereDept}
    `;

    db.get(sql, [], (err, stats) => {
      if (err) return reject({ message: 'DB error', err });
      
      const avgWaitMinutes = stats?.avg_wait_seconds ? Math.round(stats.avg_wait_seconds / 60) : 0;
      const maxWaitMinutes = stats?.max_wait_seconds ? Math.round(stats.max_wait_seconds / 60) : 0;
      
      resolve({
        waiting: stats?.waiting || 0,
        serving: stats?.serving || 0,
        completed: stats?.completed || 0,
        avg_wait_minutes: avgWaitMinutes,
        max_wait_minutes: maxWaitMinutes
      });
    });
  });
}

// Update queue analytics
async function updateQueueAnalytics(department) {
  return new Promise((resolve, reject) => {
    getQueueStats(department).then(stats => {
      const analyticsId = `A${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
      const date = new Date().toISOString().split('T')[0];
      
      // Determine congestion level
      let congestionLevel = 'LOW';
      if (stats.waiting > 10) congestionLevel = 'HIGH';
      else if (stats.waiting > 5) congestionLevel = 'MODERATE';

      const sql = `
        INSERT INTO queue_analytics (id, department, date, total_patients, avg_wait_time_seconds, max_wait_time_seconds, congestion_level, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO UPDATE SET 
          total_patients = total_patients + 1,
          avg_wait_time_seconds = $5,
          max_wait_time_seconds = $6,
          congestion_level = $7
      `;

      const params = [analyticsId, department, date, 1, stats.avg_wait_minutes * 60, stats.max_wait_minutes * 60, congestionLevel, new Date().toISOString()];

      db.run(sql, params, (err) => {
        if (err) return reject({ message: 'DB error', err });
        resolve();
      });
    }).catch(reject);
  });
}

// Get analytics report
async function getAnalyticsReport(department = null, days = 7) {
  return new Promise((resolve, reject) => {
    const whereDept = department ? `AND department = '${department}'` : '';
    
    const sql = `
      SELECT 
        department,
        date,
        total_patients,
        avg_wait_time_seconds,
        max_wait_time_seconds,
        congestion_level
      FROM queue_analytics 
      WHERE (date::date) >= (CURRENT_DATE - INTERVAL '${days} days') ${whereDept}
      ORDER BY date DESC, department
    `;

    db.all(sql, [], (err, rows) => {
      if (err) return reject({ message: 'DB error', err });
      resolve(rows || []);
    });
  });
}

// Set priority level for patient in queue
async function setPriority(queueId, priority) {
  return new Promise((resolve, reject) => {
    if (![1, 2, 3, 4].includes(priority)) {
      return reject({ message: 'Invalid priority level' });
    }

    const sql = `UPDATE queues SET priority = $1, updated_at = $2 WHERE id = $3`;
    const params = [priority, new Date().toISOString(), queueId];

    db.run(sql, params, (err) => {
      if (err) return reject({ message: 'DB error', err });

      db.get(`SELECT * FROM queues WHERE id = $1`, [queueId], (e, queue) => {
        if (e) return reject({ message: 'DB error', e });
        resolve(queue);
      });
    });
  });
}

module.exports = {
  checkInPatient,
  getNextPatient,
  callNextPatient,
  completeService,
  getDepartmentQueue,
  getAllQueueStatus,
  createNotification,
  getPatientNotifications,
  getQueueStats,
  updateQueueAnalytics,
  getAnalyticsReport,
  setPriority,
  PRIORITY_LEVELS,
  DEPARTMENTS,
  generateQueueNumber
};
