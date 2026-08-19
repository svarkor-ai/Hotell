// ============================================================================
// Toast Notification System
// ============================================================================

/**
 * showToastGlobal — displays a toast notification.
 * Used by bookings.js and booking-flow.js as a global fallback.
 */
function showToastGlobal(message, type = "info") {
  const toastEl = document.getElementById("toast-notification");
  const msgEl = document.getElementById("toast-message");
  const closeBtn = document.getElementById("toast-close-btn");

  if (!toastEl || !msgEl) return;

  // Clear previous
  msgEl.textContent = message;
  toastEl.className = `toast toast--${type}`;
  toastEl.classList.remove("hidden");

  // Auto-dismiss after 5 seconds
  clearTimeout(toastGlobalTimer);
  toastGlobalTimer = setTimeout(() => {
    toastEl.classList.add("hidden");
  }, 5000);

  // Close button
  if (closeBtn) {
    closeBtn.onclick = () => toastEl.classList.add("hidden");
  }
}

let toastGlobalTimer = null;
