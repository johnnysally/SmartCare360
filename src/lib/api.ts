const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function apiFetch(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('sc360_token') : null;
  if (token) headers['Authorization'] = `Bearer ${token}`;

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

export async function getQueue() {
  return apiFetch('/queue');
}

export async function getQueueStats() {
  return apiFetch('/queue/stats');
}

export async function callNextPatient() {
  return apiFetch('/queue/call', { method: 'POST', body: JSON.stringify({}) });
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
};
