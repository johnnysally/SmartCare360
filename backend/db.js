const bcrypt = require('bcryptjs');
const { Client } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL;

let usingPostgres = false;
let db = null;
let pool = null;

function createPgWrapper(client) {
  return {
    run(sql, params, cb) {
      client
        .query(sql, params)
        .then((res) => cb && cb(null, res))
        .catch((err) => {
          console.error('PG run error', { err: err && err.message, sql, params });
          cb && cb(err);
        });
    },
    get(sql, params, cb) {
      client
        .query(sql, params)
        .then((res) => cb && cb(null, res.rows[0]))
        .catch((err) => {
          console.error('PG get error', { err: err && err.message, sql, params });
          cb && cb(err);
        });
    },
    all(sql, params, cb) {
      client
        .query(sql, params)
        .then((res) => cb && cb(null, res.rows))
        .catch((err) => {
          console.error('PG all error', { err: err && err.message, sql, params });
          cb && cb(err);
        });
    },
    serialize(cb) {
      cb && cb();
    },
  };
}

async function init() {
  if (!DATABASE_URL) {
    console.error('DATABASE_URL is not set. SmartCare360 backend requires a Postgres DATABASE_URL.');
    throw new Error('DATABASE_URL is required');
  }

  usingPostgres = true;
  const client = new Client({ connectionString: DATABASE_URL, ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : false });
  await client.connect();
  pool = client;
  db = createPgWrapper(client);
  module.exports.db = db;
  module.exports.usingPostgres = usingPostgres;
  module.exports.pool = pool;

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
      status TEXT,
      patient_type TEXT,
      patient_subtype TEXT,
      preferred_payment_method TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      patientId TEXT,
      patientName TEXT,
      phone TEXT,
      time TEXT,
      type TEXT,
      status TEXT,
      called_at TEXT,
      completed_at TEXT,
      skip_reason TEXT,
      priority INTEGER DEFAULT 3,
      department TEXT,
      queue_number TEXT,
      doctorId TEXT,
      doctorName TEXT,
      arrival_time TEXT,
      service_start_time TEXT,
      service_end_time TEXT,
      next_department TEXT,
      created_at TEXT,
      updated_at TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS queues (
      id TEXT PRIMARY KEY,
      patient_id TEXT,
      patient_name TEXT,
      department TEXT,
      priority INTEGER DEFAULT 3,
      queue_number TEXT,
      status TEXT,
      arrival_time TEXT,
      call_time TEXT,
      service_start_time TEXT,
      service_end_time TEXT,
      waiting_time_seconds INTEGER DEFAULT 0,
      service_time_seconds INTEGER DEFAULT 0,
      created_at TEXT,
      updated_at TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      patient_id TEXT,
      patient_phone TEXT,
      notification_type TEXT,
      title TEXT,
      message TEXT,
      channel TEXT,
      status TEXT,
      created_at TEXT,
      sent_at TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS queue_analytics (
      id TEXT PRIMARY KEY,
      department TEXT,
      date TEXT,
      total_patients INTEGER DEFAULT 0,
      avg_wait_time_seconds INTEGER DEFAULT 0,
      max_wait_time_seconds INTEGER DEFAULT 0,
      peak_hour TEXT,
      congestion_level TEXT,
      created_at TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS consultations (
      id TEXT PRIMARY KEY,
      patientId TEXT,
      doctorId TEXT,
      notes TEXT,
      createdAt TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS prescriptions (
      id TEXT PRIMARY KEY,
      consultationId TEXT,
      medication TEXT,
      dosage TEXT,
      instructions TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS lab_results (
      id TEXT PRIMARY KEY,
      patientId TEXT,
      testName TEXT,
      result TEXT,
      recordedAt TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS telemedicine_sessions (
      id TEXT PRIMARY KEY,
      patientId TEXT,
      patientName TEXT,
      doctorId TEXT,
      doctorName TEXT,
      scheduledAt TEXT,
      startedAt TEXT,
      endedAt TEXT,
      status TEXT,
      duration INTEGER,
      callQuality TEXT,
      recordingUrl TEXT,
      recordingDuration INTEGER,
      notes TEXT,
      created_at TEXT,
      updated_at TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS telemedicine_chat (
      id TEXT PRIMARY KEY,
      sessionId TEXT,
      senderId TEXT,
      senderName TEXT,
      senderRole TEXT,
      message TEXT,
      messageType TEXT,
      created_at TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS telemedicine_prescriptions (
      id TEXT PRIMARY KEY,
      sessionId TEXT,
      patientId TEXT,
      doctorId TEXT,
      doctorName TEXT,
      medicineName TEXT,
      dosage TEXT,
      frequency TEXT,
      duration TEXT,
      instructions TEXT,
      status TEXT,
      created_at TEXT,
      updated_at TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS doctor_profiles (
      id TEXT PRIMARY KEY,
      doctorId TEXT UNIQUE,
      firstName TEXT,
      lastName TEXT,
      email TEXT,
      phone TEXT,
      specialty TEXT,
      qualifications TEXT,
      experience INTEGER,
      bio TEXT,
      profileImage TEXT,
      isAvailable BOOLEAN,
      consultationFee REAL,
      languages TEXT,
      clinicAddress TEXT,
      rating REAL,
      totalConsultations INTEGER,
      created_at TEXT,
      updated_at TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS doctor_availability (
      id TEXT PRIMARY KEY,
      doctorId TEXT,
      dayOfWeek TEXT,
      startTime TEXT,
      endTime TEXT,
      maxPatientsPerDay INTEGER,
      created_at TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS telemedicine_analytics (
      id TEXT PRIMARY KEY,
      doctorId TEXT,
      date TEXT,
      totalSessions INTEGER,
      avgDuration INTEGER,
      avgRating REAL,
      totalEarnings REAL,
      patientsServed INTEGER,
      created_at TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS ot_bookings (
      id TEXT PRIMARY KEY,
      patientId TEXT,
      patientName TEXT,
      scheduledAt TEXT,
      operatingRoom TEXT,
      surgeonId TEXT,
      status TEXT,
      notes TEXT,
      created_at TEXT,
      updated_at TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS sterilization_cycles (
      id TEXT PRIMARY KEY,
      instrument_set_id TEXT,
      cycleStart TEXT,
      cycleEnd TEXT,
      status TEXT,
      technicianId TEXT,
      notes TEXT,
      created_at TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS pharmacy_orders (
      id TEXT PRIMARY KEY,
      patientId TEXT,
      items TEXT,
      total REAL,
      status TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS referrals (
      id TEXT PRIMARY KEY,
      patientId TEXT,
      fromFacility TEXT,
      toFacility TEXT,
      reason TEXT,
      createdAt TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS billing (
      id TEXT PRIMARY KEY,
      patientId TEXT,
      amount REAL,
      status TEXT,
      createdAt TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS newsletter (
      email TEXT PRIMARY KEY,
      subscribedAt TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS medication_orders (
      id TEXT PRIMARY KEY,
      patient_id TEXT,
      patient_name TEXT,
      ward_id TEXT,
      drug_name TEXT,
      dose TEXT,
      route TEXT,
      frequency TEXT,
      start_time TEXT,
      end_time TEXT,
      special_instructions TEXT,
      status TEXT,
      doctor_id TEXT,
      doctor_name TEXT,
      pharmacy_id TEXT,
      pharmacy_notes TEXT,
      administered_at TEXT,
      administered_by TEXT,
      administered_by_nurse TEXT,
      administration_notes TEXT,
      created_at TEXT,
      updated_at TEXT,
      due_time TEXT,
      created_by TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS medication_administration_logs (
      id TEXT PRIMARY KEY,
      medication_order_id TEXT,
      patient_id TEXT,
      nurse_id TEXT,
      nurse_name TEXT,
      time_given TEXT,
      status TEXT,
      notes TEXT,
      verified_by TEXT,
      created_at TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS patient_visits (
      id TEXT PRIMARY KEY,
      patientId TEXT,
      patientName TEXT,
      visitType TEXT,
      department TEXT,
      doctorId TEXT,
      status TEXT,
      notes TEXT,
      created_at TEXT,
      updated_at TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS bill_items (
      id TEXT PRIMARY KEY,
      visitId TEXT,
      itemType TEXT,
      description TEXT,
      quantity REAL,
      unitPrice REAL,
      subtotal REAL,
      department TEXT,
      taxable BOOLEAN,
      status TEXT,
      created_at TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS bills (
      id TEXT PRIMARY KEY,
      visitId TEXT,
      patientId TEXT,
      subtotal REAL,
      tax REAL,
      total REAL,
      insuranceCoverage REAL,
      patientPayable REAL,
      currencyCode TEXT,
      insuranceId TEXT,
      governmentSchemeId TEXT,
      status TEXT,
      created_at TEXT,
      updated_at TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      billId TEXT,
      amount REAL,
      paymentMethod TEXT,
      reference TEXT,
      status TEXT,
      notes TEXT,
      created_at TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS insurance_policies (
      id TEXT PRIMARY KEY,
      patientId TEXT,
      insurerName TEXT,
      policyNumber TEXT,
      coveragePercentage REAL,
      copay REAL,
      deductible REAL,
      coverageLimit REAL,
      status TEXT,
      created_at TEXT,
      updated_at TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS government_schemes (
      id TEXT PRIMARY KEY,
      schemeType TEXT,
      schemeCode TEXT,
      name TEXT,
      coveragePercentage REAL,
      status TEXT,
      created_at TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS refunds (
      id TEXT PRIMARY KEY,
      billId TEXT,
      amount REAL,
      reason TEXT,
      status TEXT,
      created_at TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS adjustments (
      id TEXT PRIMARY KEY,
      billId TEXT,
      amount REAL,
      adjustmentType TEXT,
      reason TEXT,
      created_at TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS audit_trail (
      id TEXT PRIMARY KEY,
      billId TEXT,
      action TEXT,
      userId TEXT,
      details TEXT,
      created_at TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS patient_scheme_links (
      id TEXT PRIMARY KEY,
      patientId TEXT,
      schemeId TEXT,
      schemeNumber TEXT,
      status TEXT,
      created_at TEXT
    )`,
  ];

  for (const q of createQueries) {
    await client.query(q);
  }

  // Add missing columns to appointments table if they don't exist
  const alterQueries = [
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS patientName TEXT`,
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS phone TEXT`,
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS department TEXT`,
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS doctorId TEXT`,
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS doctorName TEXT`,
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 3`,
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS queue_number TEXT`,
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS arrival_time TEXT`,
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS service_start_time TEXT`,
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS service_end_time TEXT`,
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS next_department TEXT`,
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS called_at TEXT`,
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS completed_at TEXT`,
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS skip_reason TEXT`,
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS created_at TEXT`,
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS updated_at TEXT`,
  ];

  // Ensure patient table has new columns for patient type, subtype and payment preferences
  alterQueries.push(
    `ALTER TABLE patients ADD COLUMN IF NOT EXISTS patient_type TEXT`,
    `ALTER TABLE patients ADD COLUMN IF NOT EXISTS patient_subtype TEXT`,
    `ALTER TABLE patients ADD COLUMN IF NOT EXISTS preferred_payment_method TEXT`,
    `ALTER TABLE patients ADD COLUMN IF NOT EXISTS email TEXT`,
    `ALTER TABLE patients ADD COLUMN IF NOT EXISTS gender TEXT`,
    `ALTER TABLE patients ADD COLUMN IF NOT EXISTS address TEXT`,
    `ALTER TABLE patients ADD COLUMN IF NOT EXISTS insurancetype TEXT`
  );

  // Additional patient identification and contact fields
  alterQueries.push(
    `ALTER TABLE patients ADD COLUMN IF NOT EXISTS uhid TEXT`,
    `ALTER TABLE patients ADD COLUMN IF NOT EXISTS national_id TEXT`,
    `ALTER TABLE patients ADD COLUMN IF NOT EXISTS marital_status TEXT`,
    `ALTER TABLE patients ADD COLUMN IF NOT EXISTS nationality TEXT`,
    `ALTER TABLE patients ADD COLUMN IF NOT EXISTS alt_phone TEXT`,
    `ALTER TABLE patients ADD COLUMN IF NOT EXISTS county TEXT`,
    `ALTER TABLE patients ADD COLUMN IF NOT EXISTS city TEXT`,
    `ALTER TABLE patients ADD COLUMN IF NOT EXISTS country TEXT`,
    `ALTER TABLE patients ADD COLUMN IF NOT EXISTS dob TEXT`
  );

  // Admission / appointment extra fields for inpatient workflows
  alterQueries.push(
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS bed_number TEXT`,
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS room_number TEXT`,
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS admitting_doctor TEXT`,
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS admission_type TEXT`,
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS expected_length_of_stay INTEGER`,
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS provisional_diagnosis TEXT`,
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS comorbidities TEXT`,
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS allergies TEXT`,
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS guardian_name TEXT`,
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS guardian_phone TEXT`,
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS consent_obtained BOOLEAN DEFAULT FALSE`,
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS insurance_provider TEXT`,
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS insurance_policy_number TEXT`,
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS preauth_required BOOLEAN DEFAULT FALSE`,
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS preauth_number TEXT`,
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS payment_method TEXT`,
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS estimated_charges REAL`,
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS surgery_planned BOOLEAN DEFAULT FALSE`,
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS surgeon_name TEXT`,
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS anesthesia_type TEXT`,
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS gravidity INTEGER`,
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS parity INTEGER`,
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS expected_delivery_date TEXT`,
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS admission_datetime TEXT`,
    `ALTER TABLE appointments ADD COLUMN IF NOT EXISTS notes TEXT`
  );

  for (const aq of alterQueries) {
    try {
      await client.query(aq);
    } catch (err) {
      console.log('Column may already exist:', { msg: err && err.message });
    }
  }

  // Ensure common indexes for performance
  const indexQueries = [
    `CREATE INDEX IF NOT EXISTS idx_appointments_patientId ON appointments (patientId)`,
    `CREATE INDEX IF NOT EXISTS idx_appointments_department ON appointments (department)`,
    `CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments (status)`,
    `CREATE INDEX IF NOT EXISTS idx_appointments_priority ON appointments (priority)`,
    `CREATE INDEX IF NOT EXISTS idx_consultations_patientId ON consultations (patientId)`,
    `CREATE INDEX IF NOT EXISTS idx_prescriptions_consultationId ON prescriptions (consultationId)`,
    `CREATE INDEX IF NOT EXISTS idx_lab_results_patientId ON lab_results (patientId)`,
    `CREATE INDEX IF NOT EXISTS idx_telemedicine_sessions_patientId ON telemedicine_sessions (patientId)`,
    `CREATE INDEX IF NOT EXISTS idx_pharmacy_orders_patientId ON pharmacy_orders (patientId)`,
    `CREATE INDEX IF NOT EXISTS idx_referrals_patientId ON referrals (patientId)`,
    `CREATE INDEX IF NOT EXISTS idx_billing_patientId ON billing (patientId)`,
    `CREATE INDEX IF NOT EXISTS idx_queues_department ON queues (department)`,
    `CREATE INDEX IF NOT EXISTS idx_queues_status ON queues (status)`,
    `CREATE INDEX IF NOT EXISTS idx_queues_priority ON queues (priority)`,
    `CREATE INDEX IF NOT EXISTS idx_queues_patient_id ON queues (patient_id)`,
    `CREATE INDEX IF NOT EXISTS idx_notifications_patient_id ON notifications (patient_id)`,
    `CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications (status)`,
    `CREATE INDEX IF NOT EXISTS idx_queue_analytics_department ON queue_analytics (department)`,
    `CREATE INDEX IF NOT EXISTS idx_medication_orders_patient_id ON medication_orders (patient_id)`,
    `CREATE INDEX IF NOT EXISTS idx_medication_orders_status ON medication_orders (status)`,
    `CREATE INDEX IF NOT EXISTS idx_medication_orders_ward_id ON medication_orders (ward_id)`,
    `CREATE INDEX IF NOT EXISTS idx_medication_orders_due_time ON medication_orders (due_time)`,
    `CREATE INDEX IF NOT EXISTS idx_medication_logs_medication_id ON medication_administration_logs (medication_order_id)`,
    `CREATE INDEX IF NOT EXISTS idx_medication_logs_nurse_id ON medication_administration_logs (nurse_id)`,
    `CREATE INDEX IF NOT EXISTS idx_patient_visits_patientId ON patient_visits (patientId)`,
    `CREATE INDEX IF NOT EXISTS idx_patient_visits_department ON patient_visits (department)`,
    `CREATE INDEX IF NOT EXISTS idx_patient_visits_status ON patient_visits (status)`,
    `CREATE INDEX IF NOT EXISTS idx_ot_bookings_scheduledAt ON ot_bookings (scheduledAt)`,
    `CREATE INDEX IF NOT EXISTS idx_ot_bookings_patientId ON ot_bookings (patientId)`,
    `CREATE INDEX IF NOT EXISTS idx_sterilization_cycles_instrument_set ON sterilization_cycles (instrument_set_id)`,
    `CREATE INDEX IF NOT EXISTS idx_bill_items_visitId ON bill_items (visitId)`,
    `CREATE INDEX IF NOT EXISTS idx_bill_items_itemType ON bill_items (itemType)`,
    `CREATE INDEX IF NOT EXISTS idx_bills_patientId ON bills (patientId)`,
    `CREATE INDEX IF NOT EXISTS idx_bills_visitId ON bills (visitId)`,
    `CREATE INDEX IF NOT EXISTS idx_bills_status ON bills (status)`,
    `CREATE INDEX IF NOT EXISTS idx_bills_insuranceId ON bills (insuranceId)`,
    `CREATE INDEX IF NOT EXISTS idx_payments_billId ON payments (billId)`,
    `CREATE INDEX IF NOT EXISTS idx_payments_paymentMethod ON payments (paymentMethod)`,
    `CREATE INDEX IF NOT EXISTS idx_insurance_policies_patientId ON insurance_policies (patientId)`,
    `CREATE INDEX IF NOT EXISTS idx_refunds_billId ON refunds (billId)`,
    `CREATE INDEX IF NOT EXISTS idx_adjustments_billId ON adjustments (billId)`,
    `CREATE INDEX IF NOT EXISTS idx_audit_trail_billId ON audit_trail (billId)`,
    `CREATE INDEX IF NOT EXISTS idx_patient_scheme_links_patientId ON patient_scheme_links (patientId)`,
    `CREATE INDEX IF NOT EXISTS idx_patient_scheme_links_schemeId ON patient_scheme_links (schemeId)`,
  ];

  for (const iq of indexQueries) {
    try {
      await client.query(iq);
    } catch (err) {
      console.error('Failed to create index', { err: err && err.message, iq });
    }
  }

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
}

module.exports = { db: db, init, usingPostgres, pool };
