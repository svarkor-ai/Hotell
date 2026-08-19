// ============================================================================
// Shared Loading / Empty / Error State Helpers
// ============================================================================

let lastError = null;

// ============================================================
// Render: Skeleton Loading State (rooms grid)
// ============================================================

function renderSkeletons() {
  // Show 6 skeleton cards
  gridContainer.innerHTML = '';
  const skeletonHTML = Array.from({ length: 6 }, () => `
    <article class="skeleton-card">
      <div class="skeleton-card__image"></div>
      <div class="skeleton-card__content">
        <div class="skeleton-line skeleton-line--title"></div>
        <div class="skeleton-line skeleton-line--meta"></div>
        <div class="skeleton-line skeleton-line--desc"></div>
        <div class="skeleton-line skeleton-line--price"></div>
      </div>
    </article>
  `).join('');
  gridContainer.innerHTML = skeletonHTML;
  updateRoomCount(''); // hide count during loading
}

// ============================================================
// Render: Empty State
// ============================================================

function renderEmptyState() {
  gridContainer.innerHTML = `
    <div class="empty-state" role="status">
      <div class="empty-state__icon" aria-hidden="true">🏜</div>
      <p class="empty-state__message">
        Inga rum matchar dina filter<br>
        Försök att ändra sökningen.
      </p>
      <button class="btn btn-primary" id="empty-clear-filters" type="button">
        ↻ Rensa alla filter
      </button>
    </div>
  `;
  // Wire up empty-state clear button
  const emptyBtn = gridContainer.querySelector('#empty-clear-filters');
  if (emptyBtn) {
    emptyBtn.addEventListener('click', () => {
      clearAllFilters();
      applyFiltersAndRender();
    });
  }
  updateRoomCount(0);
}

// ============================================================
// Render: Error State
// ============================================================

function renderErrorState(message) {
  lastError = message || 'Kunde inte ladda rum. Kontrollera nätverket och försök igen.';
  gridContainer.innerHTML = `
    <div class="empty-state" role="alert">
      <div class="empty-state__icon" aria-hidden="true">⚠️</div>
      <p class="empty-state__message">${escapeHtml(lastError)}</p>
      <button class="btn btn-primary" id="error-retry" type="button">
        ↻ Försök igen
      </button>
    </div>
  `;
  const retryBtn = gridContainer.querySelector('#error-retry');
  if (retryBtn) {
    retryBtn.addEventListener('click', init);
  }
  updateRoomCount('');
}

// ============================================================
// Render: Skeleton Loading (bookings table)
// ============================================================

function renderSkeletonLoading(container) {
  const loadingEl = document.getElementById('bookings-loading');
  const tbody = document.getElementById('bookings-tbody');
  const emptyEl = document.getElementById('bookings-empty');

  if (tbody) tbody.innerHTML = '';
  if (emptyEl) emptyEl.hidden = true;
  if (loadingEl) {
    loadingEl.hidden = false;
    loadingEl.innerHTML = Array.from({ length: 6 }, () => `
      <div class="skeleton-row">
        <div class="skeleton-row__cell skeleton-row__cell--short"></div>
        <div class="skeleton-row__cell skeleton-row__cell--long"></div>
        <div class="skeleton-row__cell skeleton-row__cell--short"></div>
        <div class="skeleton-row__cell skeleton-row__cell--medium"></div>
        <div class="skeleton-row__cell skeleton-row__cell--short"></div>
        <div class="skeleton-row__cell skeleton-row__cell--short"></div>
        <div class="skeleton-row__cell skeleton-row__cell--short"></div>
      </div>
    `).join('');
  }
}
