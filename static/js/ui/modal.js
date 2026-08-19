// ============================================================================
// Generic Modal Shell
// ============================================================================
//
// Shared, framework-free helpers for HTML <dialog>-based modals.
// Module-specific modal logic (room detail, booking flow) stays in its
// own render module — this file only provides the generic shell.

/**
 * Open a modal <dialog> element (declarative fallback safe).
 * @param {HTMLDialogElement} dialog - The <dialog> to open
 */
function openModal(dialog) {
  if (!dialog) return;
  if (dialog.showModal) {
    dialog.showModal();
  } else {
    dialog.setAttribute('open', '');
  }
}

/**
 * Close a modal <dialog> element.
 * @param {HTMLDialogElement} dialog - The <dialog> to close
 */
function closeModal(dialog) {
  if (!dialog) return;
  if (dialog.close) {
    dialog.close();
  } else {
    dialog.removeAttribute('open');
  }
}

/**
 * Generic keyboard handling for a modal <dialog>:
 * closes on Escape and closes when the backdrop is clicked.
 * @param {HTMLDialogElement} dialog - The <dialog> to wire up
 */
function bindKeyboard(dialog) {
  if (!dialog) return;
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dialog.open) {
      closeModal(dialog);
    }
  });
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      closeModal(dialog);
    }
  });
}
