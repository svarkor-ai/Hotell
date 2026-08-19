// ============================================================================
// utils/api.js — Shared API Client
// ============================================================================
//
// Centralises the API base URL and endpoint paths so feature modules don't
// hardcode URLs. Loaded before all ui modules as a plain <script> (no ES
// modules) so its bindings are shared global scope.
//
// Depends on nothing.

const API_BASE = '';

/**
 * Perform a GET request against the API.
 * @param {string} path - API path (from `Endpoints`)
 * @returns {Promise<Response>} The fetch Response (callers keep res.json())
 * @throws {Error} On 4xx/5xx HTTP status
 */
async function apiGet(path) {
  const res = await fetch(API_BASE + path);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res;
}

// Central registry of API endpoints.
const Endpoints = {
  rooms: '/api/rooms/',
  bookings: '/api/bookings/',
  calendar: (y, m) => `/api/calendar/${y}/${m}`,
  book: (id) => `/api/rooms/${id}/book`,
  cancel: (id) => `/api/bookings/${id}/cancel`,
};
