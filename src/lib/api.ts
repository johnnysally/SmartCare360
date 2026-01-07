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

export async function createPatient(payload) {
  return apiFetch('/patients', { method: 'POST', body: JSON.stringify(payload) });
}

export async function getAppointments() {
  return apiFetch('/appointments');
}

export async function createAppointment(payload) {
  return apiFetch('/appointments', { method: 'POST', body: JSON.stringify(payload) });
}

export default {
  postNewsletter,
  login,
  signup,
  getPatients,
  createPatient,
  getAppointments,
  createAppointment,
};
