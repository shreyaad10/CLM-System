// =============================================
// api.js - All API calls to the backend
// =============================================

const BASE_URL = 'https://clm-system-backend.onrender.com';

// Helper: read the JWT token stored after login
const getToken = () => localStorage.getItem('crm_token');

// Helper: build Authorization header
const authHeader = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

// ── Auth ───────────────────────────────────

export const loginAdmin = async (username, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data; // { token, message }
};

// ── Leads ──────────────────────────────────

export const fetchLeads = async () => {
  const res = await fetch(`${BASE_URL}/leads`, { headers: authHeader() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch leads');
  return data;
};

export const createLead = async (leadData) => {
  const res = await fetch(`${BASE_URL}/leads`, {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(leadData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create lead');
  return data;
};

export const updateLead = async (id, leadData) => {
  const res = await fetch(`${BASE_URL}/leads/${id}`, {
    method: 'PUT',
    headers: authHeader(),
    body: JSON.stringify(leadData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update lead');
  return data;
};

export const deleteLead = async (id) => {
  const res = await fetch(`${BASE_URL}/leads/${id}`, {
    method: 'DELETE',
    headers: authHeader(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete lead');
  return data;
};
