const { v4: uuidv4 } = require('uuid');
const dbModule = require('../db');

/**
 * Telemedicine Service
 * Handles all telemedicine business logic including sessions, prescriptions, and analytics
 */

class TelemedicineService {
  /**
   * Create a new telemedicine session
   */
  static async createSession(patientId, doctorId, scheduledAt, patientName = 'Patient', doctorName = 'Doctor') {
    return new Promise((resolve, reject) => {
      const db = dbModule.db;
      if (!db) return reject(new Error('DB not initialized'));

      const sessionId = uuidv4();
      const now = new Date().toISOString();

      db.run(
        `INSERT INTO telemedicine_sessions 
         (id, patientId, patientName, doctorId, doctorName, scheduledAt, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [sessionId, patientId, patientName, doctorId, doctorName, scheduledAt, 'scheduled', now, now],
        function (err) {
          if (err) return reject(err);
          
          db.get('SELECT * FROM telemedicine_sessions WHERE id = $1', [sessionId], (e, row) => {
            if (e) return reject(e);
            resolve(row);
          });
        }
      );
    });
  }

  /**
   * Start a telemedicine session
   */
  static async startSession(sessionId) {
    return new Promise((resolve, reject) => {
      const db = dbModule.db;
      if (!db) return reject(new Error('DB not initialized'));

      const now = new Date().toISOString();

      db.run(
        'UPDATE telemedicine_sessions SET status = $1, startedAt = $2, updated_at = $3 WHERE id = $4',
        ['active', now, now, sessionId],
        function (err) {
          if (err) return reject(err);
          
          db.get('SELECT * FROM telemedicine_sessions WHERE id = $1', [sessionId], (e, row) => {
            if (e) return reject(e);
            resolve(row);
          });
        }
      );
    });
  }

  /**
   * End a telemedicine session
   */
  static async endSession(sessionId, callQuality = 'good', recordingUrl = null) {
    return new Promise((resolve, reject) => {
      const db = dbModule.db;
      if (!db) return reject(new Error('DB not initialized'));

      db.get('SELECT startedAt FROM telemedicine_sessions WHERE id = $1', [sessionId], (err, row) => {
        if (err) return reject(err);
        if (!row) return reject(new Error('Session not found'));

        const startTime = new Date(row.startedAt);
        const endTime = new Date();
        const duration = Math.round((endTime - startTime) / 60000); // Duration in minutes

        const now = new Date().toISOString();

        db.run(
          `UPDATE telemedicine_sessions 
           SET status = $1, endedAt = $2, duration = $3, callQuality = $4, recordingUrl = $5, updated_at = $6
           WHERE id = $7`,
          ['completed', now, duration, callQuality, recordingUrl, now, sessionId],
          function (err) {
            if (err) return reject(err);
            
            db.get('SELECT * FROM telemedicine_sessions WHERE id = $1', [sessionId], (e, row) => {
              if (e) return reject(e);
              resolve(row);
            });
          }
        );
      });
    });
  }

  /**
   * Send a chat message in a session
   */
  static async sendChatMessage(sessionId, senderId, message, senderName = 'User', senderRole = 'patient', messageType = 'text') {
    return new Promise((resolve, reject) => {
      const db = dbModule.db;
      if (!db) return reject(new Error('DB not initialized'));

      const messageId = uuidv4();
      const now = new Date().toISOString();

      db.run(
        `INSERT INTO telemedicine_chat 
         (id, sessionId, senderId, senderName, senderRole, message, messageType, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [messageId, sessionId, senderId, senderName, senderRole, message, messageType, now],
        function (err) {
          if (err) return reject(err);
          
          db.get('SELECT * FROM telemedicine_chat WHERE id = $1', [messageId], (e, row) => {
            if (e) return reject(e);
            resolve(row);
          });
        }
      );
    });
  }

  /**
   * Get chat history for a session
   */
  static async getChatHistory(sessionId) {
    return new Promise((resolve, reject) => {
      const db = dbModule.db;
      if (!db) return reject(new Error('DB not initialized'));

      db.all(
        'SELECT * FROM telemedicine_chat WHERE sessionId = $1 ORDER BY created_at ASC',
        [sessionId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows || []);
        }
      );
    });
  }

  /**
   * Write a prescription during a telemedicine session
   */
  static async writePrescription(sessionId, patientId, doctorId, doctorName, medicineName, dosage, frequency, duration = '5 days', instructions = '') {
    return new Promise((resolve, reject) => {
      const db = dbModule.db;
      if (!db) return reject(new Error('DB not initialized'));

      const prescriptionId = uuidv4();
      const now = new Date().toISOString();

      db.run(
        `INSERT INTO telemedicine_prescriptions 
         (id, sessionId, patientId, doctorId, doctorName, medicineName, dosage, frequency, duration, instructions, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [prescriptionId, sessionId, patientId, doctorId, doctorName, medicineName, dosage, frequency, duration, instructions, 'pending', now, now],
        function (err) {
          if (err) return reject(err);
          
          db.get('SELECT * FROM telemedicine_prescriptions WHERE id = $1', [prescriptionId], (e, row) => {
            if (e) return reject(e);
            resolve(row);
          });
        }
      );
    });
  }

  /**
   * Get prescriptions for a session
   */
  static async getSessionPrescriptions(sessionId) {
    return new Promise((resolve, reject) => {
      const db = dbModule.db;
      if (!db) return reject(new Error('DB not initialized'));

      db.all(
        'SELECT * FROM telemedicine_prescriptions WHERE sessionId = $1 ORDER BY created_at DESC',
        [sessionId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows || []);
        }
      );
    });
  }

  /**
   * Create or update a doctor profile
   */
  static async createDoctorProfile(doctorId, firstName, lastName, email, phone, specialty, qualifications, experience, bio, consultationFee, languages = '') {
    return new Promise((resolve, reject) => {
      const db = dbModule.db;
      if (!db) return reject(new Error('DB not initialized'));

      const profileId = uuidv4();
      const now = new Date().toISOString();

      db.run(
        `INSERT INTO doctor_profiles 
         (id, doctorId, firstName, lastName, email, phone, specialty, qualifications, experience, bio, consultationFee, languages, isAvailable, totalConsultations, rating, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
        [profileId, doctorId, firstName, lastName, email, phone, specialty, qualifications, experience, bio, consultationFee, languages, true, 0, 5.0, now, now],
        function (err) {
          if (err) return reject(err);
          
          db.get('SELECT * FROM doctor_profiles WHERE doctorId = $1', [doctorId], (e, row) => {
            if (e) return reject(e);
            resolve(row);
          });
        }
      );
    });
  }

  /**
   * Get doctor profile
   */
  static async getDoctorProfile(doctorId) {
    return new Promise((resolve, reject) => {
      const db = dbModule.db;
      if (!db) return reject(new Error('DB not initialized'));

      db.get('SELECT * FROM doctor_profiles WHERE doctorId = $1', [doctorId], (err, row) => {
        if (err) return reject(err);
        resolve(row || null);
      });
    });
  }

  /**
   * Set doctor availability for a day
   */
  static async setDoctorAvailability(doctorId, dayOfWeek, startTime, endTime, maxPatientsPerDay = 10) {
    return new Promise((resolve, reject) => {
      const db = dbModule.db;
      if (!db) return reject(new Error('DB not initialized'));

      const availabilityId = uuidv4();
      const now = new Date().toISOString();

      db.run(
        `INSERT INTO doctor_availability 
         (id, doctorId, dayOfWeek, startTime, endTime, maxPatientsPerDay, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [availabilityId, doctorId, dayOfWeek, startTime, endTime, maxPatientsPerDay, now],
        function (err) {
          if (err) return reject(err);
          
          db.get('SELECT * FROM doctor_availability WHERE id = $1', [availabilityId], (e, row) => {
            if (e) return reject(e);
            resolve(row);
          });
        }
      );
    });
  }

  /**
   * Get doctor availability
   */
  static async getDoctorAvailability(doctorId) {
    return new Promise((resolve, reject) => {
      const db = dbModule.db;
      if (!db) return reject(new Error('DB not initialized'));

      db.all('SELECT * FROM doctor_availability WHERE doctorId = $1 ORDER BY dayOfWeek', [doctorId], (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      });
    });
  }

  /**
   * Get available doctors for a specialty
   */
  static async getAvailableDoctors(specialty = null) {
    return new Promise((resolve, reject) => {
      const db = dbModule.db;
      if (!db) return reject(new Error('DB not initialized'));

      let query = 'SELECT * FROM doctor_profiles WHERE isAvailable = true';
      const params = [];

      if (specialty) {
        query += ' AND specialty = $1';
        params.push(specialty);
      }

      query += ' ORDER BY rating DESC';

      db.all(query, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      });
    });
  }

  /**
   * Get doctor analytics
   */
  static async getDoctorAnalytics(doctorId, days = 30) {
    return new Promise((resolve, reject) => {
      const db = dbModule.db;
      if (!db) return reject(new Error('DB not initialized'));

      // Calculate from sessions
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      db.all(
        `SELECT 
          DATE(created_at) as date,
          COUNT(*) as totalSessions,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completedSessions,
          AVG(duration) as avgDuration,
          AVG(CASE WHEN callQuality IS NOT NULL THEN 
            CASE WHEN callQuality = 'excellent' THEN 5 
                 WHEN callQuality = 'good' THEN 4 
                 WHEN callQuality = 'fair' THEN 3 
                 WHEN callQuality = 'poor' THEN 2 ELSE 1 END 
          END) as avgRating
        FROM telemedicine_sessions
        WHERE doctorId = $1 AND created_at >= $2
        GROUP BY DATE(created_at)
        ORDER BY date DESC`,
        [doctorId, startDate.toISOString()],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows || []);
        }
      );
    });
  }

  /**
   * Get system-wide telemedicine statistics
   */
  static async getSystemStatistics() {
    return new Promise((resolve, reject) => {
      const db = dbModule.db;
      if (!db) return reject(new Error('DB not initialized'));

      db.get(
        `SELECT 
          COUNT(*) as totalSessions,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completedSessions,
          SUM(CASE WHEN status = 'scheduled' THEN 1 ELSE 0 END) as scheduledSessions,
          SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelledSessions,
          SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as activeSessions,
          AVG(duration) as avgDuration,
          COUNT(DISTINCT doctorId) as totalDoctors,
          COUNT(DISTINCT patientId) as totalPatients
        FROM telemedicine_sessions`,
        [],
        (err, row) => {
          if (err) return reject(err);
          resolve(row || {});
        }
      );
    });
  }

  /**
   * Cancel a session
   */
  static async cancelSession(sessionId, reason = '') {
    return new Promise((resolve, reject) => {
      const db = dbModule.db;
      if (!db) return reject(new Error('DB not initialized'));

      const now = new Date().toISOString();

      db.run(
        'UPDATE telemedicine_sessions SET status = $1, notes = $2, updated_at = $3 WHERE id = $4',
        ['cancelled', reason || 'Cancelled by user', now, sessionId],
        function (err) {
          if (err) return reject(err);
          
          db.get('SELECT * FROM telemedicine_sessions WHERE id = $1', [sessionId], (e, row) => {
            if (e) return reject(e);
            resolve(row);
          });
        }
      );
    });
  }
}

module.exports = TelemedicineService;
