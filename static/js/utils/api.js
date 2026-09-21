// ============================================================================
// utils/api.js — Shared API Client
// ============================================================================
//
// Centralises the API base URL and endpoint paths so feature modules don't
// hardcode URLs. Loaded before all ui modules as a plain <script> (no ES
// modules) so its bindings are shared global scope.
//
// Depends on nothing.

// Base path derived from the served index.html URL, so BOTH serving modes
// work: bare (app at /, baseURI "http://host/" -> API_BASE "") and prefixed
// (mounted under a path prefix, nginx strips the prefix, baseURI
// "http://host/<prefix>/" -> API_BASE "/<prefix>"). Audit F9 (MC 1310.1).
const API_BASE = new URL('.', document.baseURI).pathname.replace(/\/$/, '');

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
