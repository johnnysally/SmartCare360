const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log('[DEBUG] API BASE URL:', BASE);
console.log('[DEBUG] VITE_API_URL env:', import.meta.env.VITE_API_URL);

async function apiFetch(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('sc360_token') : null;
  if (token) headers['Authorization'] = `Bearer ${token}`;

  console.log('[DEBUG] API Call:', `${BASE}${path}`, { method: options.method || 'GET' });
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const err = body && body.message ? body : { message: res.statusText || 'Request failed' };
    throw err;
  }
  return res.json().catch(() => ({}));
}

export async function postNewsletter(email) {
  return apiFetch('/newsletter', { method: 'POST', body: JSON.stringify({ email }) });
}

export async function login(email, password) {
  return apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}

export async function signup(payload) {
  return apiFetch('/auth/signup', { method: 'POST', body: JSON.stringify(payload) });
}

export async function getPatients() {
  return apiFetch('/patients');
}

export async function getPatientStats() {
  return apiFetch('/patients/stats');
}

// Download CSV report (type: 'patients' | 'billing' | 'pharmacy')
export async function downloadReport(type: string) {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('sc360_token') : null;
  const headers: Record<string,string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}/${type}/report`, { headers });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw { message: res.statusText || 'Request failed', body };
  }
  const blob = await res.blob();
  return blob;
}

export async function createPatient(payload) {
  return apiFetch('/patients', { method: 'POST', body: JSON.stringify(payload) });
}

export async function getAppointments() {
  return apiFetch('/appointments');
}

export async function createAppointment(payload) {
  return apiFetch('/appointments', { method: 'POST', body: JSON.stringify(payload) });
}

export async function getPatientAppointments(patientId) {
  return apiFetch(`/appointments/patient/${patientId}`);
}

export async function getPatient(patientId) {
  return apiFetch(`/patients/${patientId}`);
}

export async function getDoctorAppointments(doctorId) {
  return apiFetch(`/appointments/doctor/${doctorId}`);
}

export async function getDoctorAvailability(doctorId, date) {
  return apiFetch(`/appointments/doctor/${doctorId}/availability?date=${date}`);
}

export async function updateAppointment(appointmentId, payload) {
  return apiFetch(`/appointments/${appointmentId}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export async function rescheduleAppointment(appointmentId, newTime) {
  return apiFetch(`/appointments/${appointmentId}/reschedule`, { method: 'PUT', body: JSON.stringify({ newTime }) });
}

export async function cancelAppointment(appointmentId) {
  return apiFetch(`/appointments/${appointmentId}/cancel`, { method: 'PUT' });
}

export async function confirmAppointment(appointmentId) {
  return apiFetch(`/appointments/${appointmentId}/confirm`, { method: 'PUT' });
}

export async function deleteAppointment(appointmentId) {
  return apiFetch(`/appointments/${appointmentId}`, { method: 'DELETE' });
}

export async function getAppointmentStats() {
  return apiFetch('/appointments/stats/summary');
}

export async function getQueue() {
  return apiFetch('/queue');
}

export async function getQueueStats() {
  return apiFetch('/queue/stats');
}

// New Queue Management System
export async function checkInPatient(payload) {
  return apiFetch('/queues/check-in', { method: 'POST', body: JSON.stringify(payload) });
}

export async function getDepartmentQueue(department) {
  return apiFetch(`/queues/department/${department}`);
}

export async function getAllQueues() {
  return apiFetch('/queues/all');
}

export async function callNextPatient(department, staffId) {
  const queue = await getDepartmentQueue(department);
  if (queue.length === 0) throw new Error('No patients in queue');
  
  const firstPatient = queue[0];
  return apiFetch(`/queues/${firstPatient.id}/call`, { 
    method: 'POST', 
    body: JSON.stringify({ department, staffId }) 
  });
}

export async function completeService(queueId, nextDepartment = null) {
  return apiFetch(`/queues/${queueId}/complete`, { 
    method: 'POST', 
    body: JSON.stringify({ nextDepartment }) 
  });
}

export async function setPriorityLevel(queueId, priority) {
  return apiFetch(`/queues/${queueId}/priority`, { 
    method: 'PUT', 
    body: JSON.stringify({ priority }) 
  });
}

export async function getQueueStatsByDepartment(department) {
  return apiFetch(`/queues/stats/${department}`);
}

export async function getQueueAnalytics(department = null, days = 7) {
  const params = new URLSearchParams();
  if (department) params.append('department', department);
  params.append('days', days.toString());
  return apiFetch(`/queues/analytics?${params.toString()}`);
}

export async function getPatientNotifications(patientId) {
  return apiFetch(`/queues/notifications/${patientId}`);
}

export async function completeAppointment(id) {
  return apiFetch(`/queue/${id}/complete`, { method: 'POST', body: JSON.stringify({}) });
}

export async function skipPatient(id, reason) {
  return apiFetch(`/queue/${id}/skip`, { method: 'POST', body: JSON.stringify({ reason }) });
}

export async function updateQueueStatus(id, status) {
  return apiFetch(`/queue/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
}

export async function removeFromQueue(id) {
  return apiFetch(`/queue/${id}`, { method: 'DELETE' });
}

export async function getBilling() {
  return apiFetch('/billing');
}

export async function createBilling(payload) {
  return apiFetch('/billing', { method: 'POST', body: JSON.stringify(payload) });
}

export async function getPharmacyOrders() {
  return apiFetch('/pharmacy');
}

export async function createPharmacyOrder(payload) {
  return apiFetch('/pharmacy', { method: 'POST', body: JSON.stringify(payload) });
}

export async function updatePharmacyOrder(id, payload) {
  return apiFetch(`/pharmacy/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export async function deletePharmacyOrder(id) {
  return apiFetch(`/pharmacy/${id}`, { method: 'DELETE' });
}

export async function getTelemedicine() {
  return apiFetch('/telemedicine');
}

export async function createTelemedicine(payload) {
  return apiFetch('/telemedicine', { method: 'POST', body: JSON.stringify(payload) });
}

export async function getReferrals() {
  return apiFetch('/referrals');
}

export async function createReferral(payload) {
  return apiFetch('/referrals', { method: 'POST', body: JSON.stringify(payload) });
}

export async function getUsers() {
  return apiFetch('/users');
}

export async function createUser(payload) {
  return apiFetch('/users', { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateUser(id, payload) {
  return apiFetch(`/users/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export async function changeUserPassword(id, payload) {
  return apiFetch(`/users/${id}/change-password`, { method: 'POST', body: JSON.stringify(payload) });
}

export async function deleteUser(id) {
  return apiFetch(`/users/${id}`, { method: 'DELETE' });
}

// Medication functions
export async function getMedications(status?: string, patientId?: string, wardId?: string) {
  let path = '/medications';
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (patientId) params.append('patientId', patientId);
  if (wardId) params.append('wardId', wardId);
  if (params.toString()) path += '?' + params.toString();
  return apiFetch(path);
}

export async function getMedicationById(id: string) {
  return apiFetch(`/medications/${id}`);
}

export async function prescribeMedication(payload) {
  return apiFetch('/medications', { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateMedicationStatus(medicationId: string, payload) {
  return apiFetch(`/medications/${medicationId}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export async function deleteMedication(medicationId: string) {
  return apiFetch(`/medications/${medicationId}`, { method: 'DELETE' });
}

export async function getMedicationHistory(patientId: string) {
  return apiFetch(`/medications/patient/${patientId}`);
}

export async function getMedicationAuditLog() {
  return apiFetch('/medications/admin/audit-log');
}

export default {
  postNewsletter,
  login,
  signup,
  getPatients,
  getPatientStats,
  downloadReport,
  createPatient,
  getAppointments,
  createAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  getDoctorAvailability,
  updateAppointment,
  rescheduleAppointment,
  cancelAppointment,
  confirmAppointment,
  deleteAppointment,
  getAppointmentStats,
  getQueue,
  getQueueStats,
  callNextPatient,
  completeAppointment,
  skipPatient,
  updateQueueStatus,
  removeFromQueue,
  getBilling,
  createBilling,
  getPharmacyOrders,
  createPharmacyOrder,
  updatePharmacyOrder,
  deletePharmacyOrder,
  getTelemedicine,
  createTelemedicine,
  getReferrals,
  createReferral,
  getUsers,
  createUser,
  updateUser,
  changeUserPassword,
  deleteUser,
  checkInPatient,
  getDepartmentQueue,
  getAllQueues,
  completeService,
  setPriorityLevel,
  getQueueStatsByDepartment,
  getQueueAnalytics,
  getPatientNotifications,
  getMedications,
  getMedicationById,
  prescribeMedication,
  updateMedicationStatus,
  deleteMedication,
  getMedicationHistory,
  getMedicationAuditLog,
};
