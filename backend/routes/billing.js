const express = require('express');
const router = express.Router();
const BillingService = require('../services/billingService');
const dbModule = require('../db');
const { checkPermission, checkPatientAccess, auditLog } = require('../middleware/permissions');

/**
 * SmartCare360 Billing API Routes
 * Comprehensive billing system for all healthcare scenarios
 */

// ============= PATIENT VISIT MANAGEMENT =============

/**
 * POST /api/billing/visits
 * Create patient visit
 */
router.post('/visits', checkPermission('visits', 'create'), auditLog('visits', 'create'), (req, res) => {
  const { patientId, patientName, visitType, department, doctorId, notes } = req.body;

  if (!patientId || !patientName || !visitType || !department) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  BillingService.createPatientVisit(patientId, patientName, visitType, department, doctorId, notes)
    .then(visit => res.status(201).json(visit))
    .catch(err => res.status(500).json({ message: 'Error creating visit', error: err.message }));
});

/**
 * GET /api/billing/visits/:visitId
 * Get visit details
 */
router.get('/visits/:visitId', checkPermission('visits', 'read'), (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });

  db.get('SELECT * FROM patient_visits WHERE id = $1', [req.params.visitId], (err, row) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err.message });
    if (!row) return res.status(404).json({ message: 'Visit not found' });
    res.json(row);
  });
});

// ============= BILLING ITEMS =============

/**
 * POST /api/billing/items
 * Add item to bill
 */
router.post('/items', checkPermission('items', 'create'), auditLog('items', 'create'), (req, res) => {
  const { visitId, itemType, description, quantity, unitPrice, department, taxable } = req.body;

  if (!visitId || !itemType || !description || !quantity || unitPrice === undefined) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  BillingService.addBillItem(visitId, itemType, description, quantity, unitPrice, department, taxable)
    .then(item => res.status(201).json(item))
    .catch(err => res.status(500).json({ message: 'Error adding bill item', error: err.message }));
});

/**
 * GET /api/billing/visits/:visitId/items
 * Get all items for visit
 */
router.get('/visits/:visitId/items', checkPermission('items', 'read'), (req, res) => {
  BillingService.getVisitBillItems(req.params.visitId)
    .then(items => res.json(items))
    .catch(err => res.status(500).json({ message: 'Error getting bill items', error: err.message }));
});

// ============= BILL GENERATION & CALCULATIONS =============

/**
 * POST /api/billing/generate
 * Generate bill for visit
 */
router.post('/generate', checkPermission('bills', 'generate'), auditLog('bills', 'generate'), (req, res) => {
  const { visitId, insuranceId, governmentSchemeId, currencyCode } = req.body;

  if (!visitId) {
    return res.status(400).json({ message: 'visitId required' });
  }

  BillingService.generateBill(visitId, insuranceId, governmentSchemeId, currencyCode)
    .then(result => res.status(201).json(result))
    .catch(err => res.status(500).json({ message: 'Error generating bill', error: err.message }));
});

/**
 * GET /api/billing/bills/:billId
 * Get bill details
 */
router.get('/bills/:billId', checkPermission('bills', 'read'), (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });

  db.get('SELECT * FROM bills WHERE id = $1', [req.params.billId], (err, row) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err.message });
    if (!row) return res.status(404).json({ message: 'Bill not found' });
    res.json(row);
  });
});

/**
 * GET /api/billing/patient/:patientId/bills
 * Get all bills for patient
 */
router.get('/patient/:patientId/bills', checkPatientAccess, checkPermission('bills', 'read'), (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });

  db.all(
    `SELECT b.*, pv.visitType, pv.department 
     FROM bills b 
     JOIN patient_visits pv ON b.visitId = pv.id 
     WHERE b.patientId = $1 
     ORDER BY b.created_at DESC`,
    [req.params.patientId],
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err.message });
      res.json(rows || []);
    }
  );
});

// ============= PAYMENTS =============

/**
 * POST /api/billing/payments
 * Record payment
 */
router.post('/payments', checkPermission('payments', 'create'), auditLog('payments', 'create'), (req, res) => {
  const { billId, amount, paymentMethod, reference, notes } = req.body;

  if (!billId || !amount || !paymentMethod) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  BillingService.recordPayment(billId, amount, paymentMethod, reference, notes)
    .then(payment => res.status(201).json(payment))
    .catch(err => res.status(500).json({ message: 'Error recording payment', error: err.message }));
});

/**
 * GET /api/billing/bills/:billId/payments
 * Get all payments for bill
 */
router.get('/bills/:billId/payments', checkPermission('payments', 'read'), (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });

  db.all('SELECT * FROM payments WHERE billId = $1 ORDER BY created_at DESC', [req.params.billId], (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err.message });
    res.json(rows || []);
  });
});

/**
 * POST /api/billing/refunds
 * Process refund
 */
router.post('/refunds', checkPermission('payments', 'refund'), auditLog('payments', 'refund'), (req, res) => {
  const { billId, amount, reason } = req.body;

  if (!billId || !amount) {
    return res.status(400).json({ message: 'billId and amount required' });
  }

  BillingService.processRefund(billId, amount, reason)
    .then(refund => res.status(201).json(refund))
    .catch(err => res.status(500).json({ message: 'Error processing refund', error: err.message }));
});

/**
 * POST /api/billing/adjustments
 * Apply adjustment/discount
 */
router.post('/adjustments', checkPermission('adjustments', 'create'), auditLog('adjustments', 'create'), (req, res) => {
  const { billId, amount, adjustmentType, reason } = req.body;

  if (!billId || !amount || !adjustmentType) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  BillingService.applyAdjustment(billId, amount, adjustmentType, reason)
    .then(adjustment => res.status(201).json(adjustment))
    .catch(err => res.status(500).json({ message: 'Error applying adjustment', error: err.message }));
});

// ============= INSURANCE =============

/**
 * POST /api/billing/insurance/policies
 * Create insurance policy
 */
router.post('/insurance/policies', checkPermission('insurance', 'create'), auditLog('insurance', 'create'), (req, res) => {
  const { patientId, insurerName, policyNumber, coveragePercentage, copay, deductible, coverageLimit } = req.body;

  if (!patientId || !insurerName || !policyNumber) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  BillingService.createInsurancePolicy(patientId, insurerName, policyNumber, coveragePercentage, copay, deductible, coverageLimit)
    .then(policy => res.status(201).json(policy))
    .catch(err => res.status(500).json({ message: 'Error creating policy', error: err.message }));
});

/**
 * GET /api/billing/patient/:patientId/insurance
 * Get insurance policies for patient
 */
router.get('/patient/:patientId/insurance', checkPatientAccess, checkPermission('insurance', 'read'), (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });

  db.all('SELECT * FROM insurance_policies WHERE patientId = $1 AND status = $2', 
    [req.params.patientId, 'active'], 
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'DB error', error: err.message });
      res.json(rows || []);
    }
  );
});

/**
 * POST /api/billing/schemes/link
 * Link patient to government scheme
 */
router.post('/schemes/link', checkPermission('schemes', 'link'), auditLog('schemes', 'link'), (req, res) => {
  const { patientId, schemeId, schemeNumber } = req.body;

  if (!patientId || !schemeId || !schemeNumber) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  BillingService.linkPatientToScheme(patientId, schemeId, schemeNumber)
    .then(link => res.status(201).json(link))
    .catch(err => res.status(500).json({ message: 'Error linking scheme', error: err.message }));
});

/**
 * GET /api/billing/schemes
 * Get all government schemes
 */
router.get('/schemes', checkPermission('schemes', 'read'), (req, res) => {
  const db = dbModule.db;
  if (!db) return res.status(500).json({ message: 'DB not initialized' });

  db.all('SELECT * FROM government_schemes WHERE status = $1', ['active'], (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err.message });
    res.json(rows || []);
  });
});

// ============= REPORTING & ANALYTICS =============

/**
 * GET /api/billing/reports/daily-revenue
 * Get daily revenue
 */
router.get('/reports/daily-revenue', checkPermission('reports', 'view'), (req, res) => {
  const { date } = req.query;

  BillingService.getDailyRevenue(date)
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ message: 'Error getting daily revenue', error: err.message }));
});

/**
 * GET /api/billing/reports/outstanding
 * Get outstanding balances
 */
router.get('/reports/outstanding', checkPermission('reports', 'view'), (req, res) => {
  BillingService.getOutstandingBalances()
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ message: 'Error getting outstanding balances', error: err.message }));
});

/**
 * GET /api/billing/reports/by-department
 * Revenue by department
 */
router.get('/reports/by-department', checkPermission('reports', 'view'), (req, res) => {
  const { startDate, endDate } = req.query;

  BillingService.getRevenueByDepartment(startDate, endDate)
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ message: 'Error getting department revenue', error: err.message }));
});

/**
 * GET /api/billing/reports/insurance-claims
 * Insurance claims status
 */
router.get('/reports/insurance-claims', checkPermission('reports', 'view'), (req, res) => {
  BillingService.getInsuranceClaimsStatus()
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ message: 'Error getting claims status', error: err.message }));
});

/**
 * GET /api/billing/reports/payment-methods
 * Payment method breakdown
 */
router.get('/reports/payment-methods', checkPermission('reports', 'view'), (req, res) => {
  const { startDate, endDate } = req.query;

  BillingService.getPaymentMethodBreakdown(startDate, endDate)
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ message: 'Error getting payment methods', error: err.message }));
});

/**
 * GET /api/billing/reports/monthly
 * Monthly revenue report
 */
router.get('/reports/monthly/:year/:month', checkPermission('reports', 'view'), (req, res) => {
  const { year, month } = req.params;

  BillingService.getMonthlyRevenueReport(year, month)
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ message: 'Error getting monthly report', error: err.message }));
});

/**
 * GET /api/billing/reports/tax
 * Tax report
 */
router.get('/reports/tax', checkPermission('reports', 'view'), (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ message: 'startDate and endDate required' });
  }

  BillingService.getTaxReport(startDate, endDate)
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ message: 'Error getting tax report', error: err.message }));
});

/**
 * GET /api/billing/audit/:billId
 * Get audit trail for bill
 */
router.get('/audit/:billId', checkPermission('audit', 'view'), (req, res) => {
  BillingService.getAuditTrail(req.params.billId)
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ message: 'Error getting audit trail', error: err.message }));
});

module.exports = router;

