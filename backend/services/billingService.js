const { v4: uuidv4 } = require('uuid');
const dbModule = require('../db');

/**
 * SmartCare360 Billing Service
 * Comprehensive billing system supporting:
 * - Multiple billing types (outpatient, inpatient, emergency, referral)
 * - Multiple payment methods (cash, mobile money, insurance, cards)
 * - Insurance & government schemes
 * - Multi-currency & tax
 * - Audit trail & compliance
 */

class BillingService {
  // ============= PATIENT VISIT MANAGEMENT =============

  /**
   * Create or retrieve patient visit record
   */
  static async createPatientVisit(patientId, patientName, visitType, department, doctorId, notes = '') {
    return new Promise((resolve, reject) => {
      const db = dbModule.db;
      if (!db) return reject(new Error('DB not initialized'));

      const visitId = uuidv4();
      const now = new Date().toISOString();

      // Validate visit type
      const validTypes = ['outpatient', 'inpatient', 'emergency', 'referral', 'teleconsult'];
      if (!validTypes.includes(visitType)) {
        return reject(new Error(`Invalid visit type: ${visitType}`));
      }

      db.run(
        `INSERT INTO patient_visits 
         (id, patientId, patientName, visitType, department, doctorId, status, notes, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [visitId, patientId, patientName, visitType, department, doctorId, 'active', notes, now, now],
        function (err) {
          if (err) return reject(err);
          
          db.get('SELECT * FROM patient_visits WHERE id = $1', [visitId], (e, row) => {
            if (e) return reject(e);
            resolve(row);
          });
        }
      );
    });
  }

  /**
   * Add billing item to visit (service, procedure, test, medication, etc.)
   */
  static async addBillItem(visitId, itemType, description, quantity, unitPrice, department = 'General', taxable = true) {
    return new Promise((resolve, reject) => {
      const db = dbModule.db;
      if (!db) return reject(new Error('DB not initialized'));

      const billItemId = uuidv4();
      const subtotal = quantity * unitPrice;
      const now = new Date().toISOString();

      const validTypes = ['consultation', 'procedure', 'lab_test', 'imaging', 'pharmacy', 'ward', 'theatre', 'icu', 'ambulance', 'supplies', 'other'];
      if (!validTypes.includes(itemType)) {
        return reject(new Error(`Invalid item type: ${itemType}`));
      }

      db.run(
        `INSERT INTO bill_items 
         (id, visitId, itemType, description, quantity, unitPrice, subtotal, department, taxable, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [billItemId, visitId, itemType, description, quantity, unitPrice, subtotal, department, taxable, 'pending', now],
        function (err) {
          if (err) return reject(err);
          
          db.get('SELECT * FROM bill_items WHERE id = $1', [billItemId], (e, row) => {
            if (e) return reject(e);
            resolve(row);
          });
        }
      );
    });
  }

  /**
   * Get all bill items for a visit
   */
  static async getVisitBillItems(visitId) {
    return new Promise((resolve, reject) => {
      const db = dbModule.db;
      if (!db) return reject(new Error('DB not initialized'));

      db.all(
        'SELECT * FROM bill_items WHERE visitId = $1 ORDER BY created_at ASC',
        [visitId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows || []);
        }
      );
    });
  }

  // ============= BILLING & CALCULATIONS =============

  /**
   * Generate bill for visit with coverage calculation
   */
  static async generateBill(visitId, insuranceId = null, governmentSchemeId = null, currencyCode = 'KES') {
    return new Promise((resolve, reject) => {
      const db = dbModule.db;
      if (!db) return reject(new Error('DB not initialized'));

      // Get visit
      db.get('SELECT * FROM patient_visits WHERE id = $1', [visitId], async (err, visit) => {
        if (err) return reject(err);
        if (!visit) return reject(new Error('Visit not found'));

        try {
          // Get bill items
          const items = await this.getVisitBillItems(visitId);
          
          // Calculate subtotal
          let subtotal = items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
          
          // Get tax configuration
          const taxRate = 0.16; // 16% VAT default
          let taxableAmount = items.filter(i => i.taxable).reduce((sum, i) => sum + (i.subtotal || 0), 0);
          const tax = taxableAmount * taxRate;
          
          // Get insurance/scheme coverage
          let insuranceCoverage = 0;
          let patientShare = subtotal + tax;
          
          if (insuranceId) {
            const coverage = await this.getInsuranceCoverage(insuranceId, subtotal + tax);
            insuranceCoverage = coverage.amount;
            patientShare = coverage.patientShare;
          } else if (governmentSchemeId) {
            const schemeData = await this.getGovernmentSchemeCoverage(governmentSchemeId, subtotal + tax);
            insuranceCoverage = schemeData.coverage;
            patientShare = schemeData.patientShare;
          }

          const total = subtotal + tax;
          
          // Create bill
          const billId = uuidv4();
          const now = new Date().toISOString();

          db.run(
            `INSERT INTO bills 
             (id, visitId, patientId, subtotal, tax, total, insuranceCoverage, patientPayable, 
              currencyCode, insuranceId, governmentSchemeId, status, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
            [billId, visitId, visit.patientId, subtotal, tax, total, insuranceCoverage, patientShare, 
             currencyCode, insuranceId || null, governmentSchemeId || null, 'pending', now, now],
            function (err) {
              if (err) return reject(err);
              
              db.get('SELECT * FROM bills WHERE id = $1', [billId], (e, row) => {
                if (e) return reject(e);
                resolve({
                  bill: row,
                  itemCount: items.length,
                  itemsBreakdown: items
                });
              });
            }
          );
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  /**
   * Get insurance coverage for amount
   */
  static async getInsuranceCoverage(insuranceId, amount) {
    return new Promise((resolve, reject) => {
      const db = dbModule.db;
      if (!db) return reject(new Error('DB not initialized'));

      db.get('SELECT * FROM insurance_policies WHERE id = $1', [insuranceId], (err, policy) => {
        if (err) return reject(err);
        if (!policy) return reject(new Error('Insurance policy not found'));

        const copay = policy.copay || 0;
        const deductible = policy.deductible || 0;
        const coveragePercentage = policy.coveragePercentage || 80;

        let patientShare = copay + deductible;
        let coverage = Math.max(0, (amount - copay - deductible) * (coveragePercentage / 100));

        resolve({
          coverage: coverage,
          patientShare: patientShare,
          copay: copay,
          deductible: deductible,
          coveragePercentage: coveragePercentage
        });
      });
    });
  }

  /**
   * Get government scheme coverage
   */
  static async getGovernmentSchemeCoverage(schemeId, amount) {
    return new Promise((resolve, reject) => {
      const db = dbModule.db;
      if (!db) return reject(new Error('DB not initialized'));

      db.get('SELECT * FROM government_schemes WHERE id = $1', [schemeId], (err, scheme) => {
        if (err) return reject(err);
        if (!scheme) return reject(new Error('Government scheme not found'));

        const coveragePercentage = scheme.coveragePercentage || 100;
        const coverage = amount * (coveragePercentage / 100);
        const patientShare = amount - coverage;

        resolve({
          coverage: coverage,
          patientShare: patientShare,
          coveragePercentage: coveragePercentage,
          schemeType: scheme.schemeType
        });
      });
    });
  }

  // ============= PAYMENT PROCESSING =============

  /**
   * Record payment for bill
   */
  static async recordPayment(billId, amount, paymentMethod, reference = '', notes = '') {
    return new Promise((resolve, reject) => {
      const db = dbModule.db;
      if (!db) return reject(new Error('DB not initialized'));

      const validMethods = ['cash', 'mobile_money', 'bank_transfer', 'card', 'cheque', 'insurance', 'scheme'];
      if (!validMethods.includes(paymentMethod)) {
        return reject(new Error(`Invalid payment method: ${paymentMethod}`));
      }

      // Get bill
      db.get('SELECT * FROM bills WHERE id = $1', [billId], (err, bill) => {
        if (err) return reject(err);
        if (!bill) return reject(new Error('Bill not found'));

        const paymentId = uuidv4();
        const now = new Date().toISOString();

        db.run(
          `INSERT INTO payments 
           (id, billId, amount, paymentMethod, reference, status, notes, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [paymentId, billId, amount, paymentMethod, reference, 'completed', notes, now],
          function (err) {
            if (err) return reject(err);
            
            // Update bill status if fully paid
            db.get('SELECT SUM(amount) as totalPaid FROM payments WHERE billId = $1 AND status = $2', 
              [billId, 'completed'], (e, row) => {
              if (e) return reject(e);

              const totalPaid = row?.totalPaid || 0;
              const newStatus = totalPaid >= bill.total ? 'paid' : 
                               totalPaid > 0 ? 'partial' : 'pending';

              db.run('UPDATE bills SET status = $1, updated_at = $2 WHERE id = $3',
                [newStatus, now, billId], (uerr) => {
                if (uerr) return reject(uerr);

                db.get('SELECT * FROM payments WHERE id = $1', [paymentId], (geterr, payment) => {
                  if (geterr) return reject(geterr);
                  resolve(payment);
                });
              });
            });
          }
        );
      });
    });
  }

  /**
   * Process refund
   */
  static async processRefund(billId, amount, reason = '') {
    return new Promise((resolve, reject) => {
      const db = dbModule.db;
      if (!db) return reject(new Error('DB not initialized'));

      const refundId = uuidv4();
      const now = new Date().toISOString();

      db.run(
        `INSERT INTO refunds 
         (id, billId, amount, reason, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [refundId, billId, amount, reason, 'pending', now],
        function (err) {
          if (err) return reject(err);
          
          db.get('SELECT * FROM refunds WHERE id = $1', [refundId], (e, row) => {
            if (e) return reject(e);
            resolve(row);
          });
        }
      );
    });
  }

  /**
   * Apply adjustment/discount
   */
  static async applyAdjustment(billId, amount, adjustmentType, reason = '') {
    return new Promise((resolve, reject) => {
      const db = dbModule.db;
      if (!db) return reject(new Error('DB not initialized'));

      const validTypes = ['discount', 'waiver', 'correction'];
      if (!validTypes.includes(adjustmentType)) {
        return reject(new Error(`Invalid adjustment type: ${adjustmentType}`));
      }

      const adjustmentId = uuidv4();
      const now = new Date().toISOString();

      db.run(
        `INSERT INTO adjustments 
         (id, billId, amount, type, reason, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [adjustmentId, billId, amount, adjustmentType, reason, now],
        function (err) {
          if (err) return reject(err);
          
          db.get('SELECT * FROM adjustments WHERE id = $1', [adjustmentId], (e, row) => {
            if (e) return reject(e);
            resolve(row);
          });
        }
      );
    });
  }

  // ============= INSURANCE MANAGEMENT =============

  /**
   * Create insurance policy
   */
  static async createInsurancePolicy(patientId, insurerName, policyNumber, coveragePercentage, copay = 0, deductible = 0, coverageLimit = null) {
    return new Promise((resolve, reject) => {
      const db = dbModule.db;
      if (!db) return reject(new Error('DB not initialized'));

      const policyId = uuidv4();
      const now = new Date().toISOString();

      db.run(
        `INSERT INTO insurance_policies 
         (id, patientId, insurerName, policyNumber, coveragePercentage, copay, deductible, coverageLimit, status, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [policyId, patientId, insurerName, policyNumber, coveragePercentage, copay, deductible, coverageLimit, 'active', now, now],
        function (err) {
          if (err) return reject(err);
          
          db.get('SELECT * FROM insurance_policies WHERE id = $1', [policyId], (e, row) => {
            if (e) return reject(e);
            resolve(row);
          });
        }
      );
    });
  }

  /**
   * Link patient to government scheme
   */
  static async linkPatientToScheme(patientId, schemeId, schemeNumber, status = 'active') {
    return new Promise((resolve, reject) => {
      const db = dbModule.db;
      if (!db) return reject(new Error('DB not initialized'));

      const linkId = uuidv4();
      const now = new Date().toISOString();

      db.run(
        `INSERT INTO patient_scheme_links 
         (id, patientId, schemeId, schemeNumber, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [linkId, patientId, schemeId, schemeNumber, status, now],
        function (err) {
          if (err) return reject(err);
          
          db.get('SELECT * FROM patient_scheme_links WHERE id = $1', [linkId], (e, row) => {
            if (e) return reject(e);
            resolve(row);
          });
        }
      );
    });
  }

  // ============= REPORTING & ANALYTICS =============

  /**
   * Get daily revenue summary
   */
  static async getDailyRevenue(date = new Date().toISOString().split('T')[0]) {
    return new Promise((resolve, reject) => {
      const db = dbModule.db;
      if (!db) return reject(new Error('DB not initialized'));

      db.get(
        `SELECT 
          COUNT(DISTINCT billId) as billCount,
          SUM(amount) as totalCollected,
          COUNT(DISTINCT paymentMethod) as paymentMethods,
          SUM(CASE WHEN paymentMethod = 'cash' THEN amount ELSE 0 END) as cashCollected,
          SUM(CASE WHEN paymentMethod = 'mobile_money' THEN amount ELSE 0 END) as mobileMoneyCollected,
          SUM(CASE WHEN paymentMethod = 'card' THEN amount ELSE 0 END) as cardCollected,
          SUM(CASE WHEN paymentMethod = 'insurance' THEN amount ELSE 0 END) as insuranceCollected
        FROM payments
        WHERE DATE(created_at) = $1 AND status = $2`,
        [date, 'completed'],
        (err, row) => {
          if (err) return reject(err);
          resolve(row || {});
        }
      );
    });
  }

  /**
   * Get outstanding balances
   */
  static async getOutstandingBalances() {
    return new Promise((resolve, reject) => {
      const db = dbModule.db;
      if (!db) return reject(new Error('DB not initialized'));

      db.all(
        `SELECT 
          b.id,
          b.visitId,
          pv.patientId,
          pv.patientName,
          b.total,
          COALESCE(SUM(p.amount), 0) as totalPaid,
          b.total - COALESCE(SUM(p.amount), 0) as outstanding,
          b.created_at,
          b.status
        FROM bills b
        JOIN patient_visits pv ON b.visitId = pv.id
        LEFT JOIN payments p ON b.id = p.billId AND p.status = 'completed'
        WHERE b.status != 'paid'
        GROUP BY b.id, pv.id
        ORDER BY b.created_at DESC`,
        [],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows || []);
        }
      );
    });
  }

  /**
   * Get revenue by department
   */
  static async getRevenueByDepartment(startDate = null, endDate = null) {
    return new Promise((resolve, reject) => {
      const db = dbModule.db;
      if (!db) return reject(new Error('DB not initialized'));

      let query = `
        SELECT 
          bi.department,
          COUNT(DISTINCT bi.visitId) as patientCount,
          SUM(bi.subtotal) as revenue,
          COUNT(bi.id) as itemCount
        FROM bill_items bi
        WHERE 1=1
      `;
      const params = [];

      if (startDate) {
        query += ` AND DATE(bi.created_at) >= $${params.length + 1}`;
        params.push(startDate);
      }
      if (endDate) {
        query += ` AND DATE(bi.created_at) <= $${params.length + 1}`;
        params.push(endDate);
      }

      query += ` GROUP BY bi.department ORDER BY revenue DESC`;

      db.all(query, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      });
    });
  }

  /**
   * Get insurance claims status
   */
  static async getInsuranceClaimsStatus() {
    return new Promise((resolve, reject) => {
      const db = dbModule.db;
      if (!db) return reject(new Error('DB not initialized'));

      db.all(
        `SELECT 
          insurerName,
          COUNT(DISTINCT billId) as claimCount,
          SUM(insuranceCoverage) as claimedAmount,
          'pending' as status
        FROM bills
        WHERE insuranceId IS NOT NULL
        GROUP BY insurerName`,
        [],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows || []);
        }
      );
    });
  }

  /**
   * Get payment method breakdown
   */
  static async getPaymentMethodBreakdown(startDate = null, endDate = null) {
    return new Promise((resolve, reject) => {
      const db = dbModule.db;
      if (!db) return reject(new Error('DB not initialized'));

      let query = `
        SELECT 
          paymentMethod,
          COUNT(*) as transactionCount,
          SUM(amount) as totalAmount
        FROM payments
        WHERE status = 'completed'
      `;
      const params = [];

      if (startDate) {
        query += ` AND DATE(created_at) >= $${params.length + 1}`;
        params.push(startDate);
      }
      if (endDate) {
        query += ` AND DATE(created_at) <= $${params.length + 1}`;
        params.push(endDate);
      }

      query += ` GROUP BY paymentMethod ORDER BY totalAmount DESC`;

      db.all(query, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      });
    });
  }

  /**
   * Generate monthly revenue report
   */
  static async getMonthlyRevenueReport(year, month) {
    return new Promise((resolve, reject) => {
      const db = dbModule.db;
      if (!db) return reject(new Error('DB not initialized'));

      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const endDate = new Date(year, month, 0).toISOString().split('T')[0];

      db.get(
        `SELECT 
          COUNT(DISTINCT billId) as billCount,
          SUM(amount) as totalCollected,
          AVG(amount) as avgPayment,
          COUNT(DISTINCT CASE WHEN paymentMethod = 'cash' THEN billId END) as cashTransactions,
          COUNT(DISTINCT CASE WHEN paymentMethod = 'mobile_money' THEN billId END) as mmTransactions,
          COUNT(DISTINCT CASE WHEN paymentMethod = 'insurance' THEN billId END) as insuranceTransactions
        FROM payments
        WHERE DATE(created_at) >= $1 AND DATE(created_at) <= $2 AND status = $3`,
        [startDate, endDate, 'completed'],
        (err, row) => {
          if (err) return reject(err);
          resolve(row || {});
        }
      );
    });
  }

  /**
   * Get tax report
   */
  static async getTaxReport(startDate, endDate) {
    return new Promise((resolve, reject) => {
      const db = dbModule.db;
      if (!db) return reject(new Error('DB not initialized'));

      db.get(
        `SELECT 
          SUM(tax) as totalTax,
          SUM(subtotal) as grossRevenue,
          SUM(subtotal) + SUM(tax) as netRevenue,
          COUNT(DISTINCT visitId) as billCount
        FROM bills
        WHERE DATE(created_at) >= $1 AND DATE(created_at) <= $2`,
        [startDate, endDate],
        (err, row) => {
          if (err) return reject(err);
          resolve(row || {});
        }
      );
    });
  }

  /**
   * Get audit trail
   */
  static async getAuditTrail(billId) {
    return new Promise((resolve, reject) => {
      const db = dbModule.db;
      if (!db) return reject(new Error('DB not initialized'));

      db.all(
        `SELECT * FROM audit_trail WHERE billId = $1 ORDER BY created_at ASC`,
        [billId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows || []);
        }
      );
    });
  }

  /**
   * Create audit trail entry
   */
  static async createAuditEntry(billId, action, userId, details = '') {
    return new Promise((resolve, reject) => {
      const db = dbModule.db;
      if (!db) return reject(new Error('DB not initialized'));

      const entryId = uuidv4();
      const now = new Date().toISOString();

      db.run(
        `INSERT INTO audit_trail 
         (id, billId, action, userId, details, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [entryId, billId, action, userId, details, now],
        function (err) {
          if (err) return reject(err);
          resolve({ id: entryId });
        }
      );
    });
  }
}

module.exports = BillingService;
