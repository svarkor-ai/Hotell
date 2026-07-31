/**
 * rooms.js — Rooms Page UI Module
 *
 * Handles room listing, filtering, sorting, and detail modal for
 * Sea View Hotel's rooms page. Uses vanilla JS — no framework.
 *
 * Depends on: design-system.css (CSS custom properties)
 * API: GET /api/rooms/
 */

// ============================================================
// Constants
// ============================================================

const API_ROOMS_URL = '/api/rooms/';

const ROOM_TYPE_LABELS = {
  single: 'Enkel',
  double: 'Dubbel',
  four_person: 'Fyrasäng',
};

const ROOM_TYPE_COLORS = {
  single: '#0ea5e9',
  double: '#8b5cf6',
  four_person: '#f59e0b',
};

// Hardcoded amenities per room type (API doesn't expose amenities)
const AMENITIES = {
  single: ['Havsvy', 'WiFi', 'TV', 'Minikök', 'Luftkonditionering'],
  double: ['Havsvy', 'WiFi', 'TV', 'Minikök', 'Luftkonditionering', 'Skrivbord'],
  four_person: ['Havsvy', 'WiFi', 'TV', 'Minikök', 'Luftkonditionering', 'Skrivbord', 'Extra badrum'],
};

// Default sort
const DEFAULT_SORT = 'price-asc';

// ============================================================
// State
// ============================================================

let allRooms = [];          // Fetched from API
let currentFilters = {
  type: '',
  capacity: '',
  priceRange: '',
  search: '',
};
let currentSort = DEFAULT_SORT;

// ============================================================
// DOM References (set during init)
// ============================================================

let gridContainer = null;
let roomCountEl = null;
let clearFiltersBtn = null;
let dialog = null;

// ============================================================
// Utility: Escape HTML to prevent XSS
// ============================================================

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ============================================================
// Utility: Format price in SEK
// ============================================================

function formatPrice(price) {
  return new Intl.NumberFormat('sv-SE').format(price) + ' kr';
}

// ============================================================
// Fetching
// ============================================================

/**
 * Fetch all rooms from the API.
 * @returns {Promise<Array>} Array of room objects
 */
async function fetchRooms() {
  try {
    const response = await fetch(API_ROOMS_URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch rooms:', error);
    throw error;
  }
}

// ============================================================
// Filtering & Sorting
// ============================================================

/**
 * Filter rooms by type, capacity, price range, and search text.
 * @param {Array} rooms - Full room array
 * @param {Object} filters - { type, capacity, priceRange, search }
 * @returns {Array} Filtered rooms
 */
function applyFilters(rooms, filters) {
  return rooms.filter((room) => {
    // Room type filter
    if (filters.type && room.room_type !== filters.type) return false;

    // Capacity filter
    if (filters.capacity && room.capacity !== parseInt(filters.capacity, 10)) return false;

    // Price range filter (format: "min-max" e.g. "0-900")
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (room.price_per_night < min || room.price_per_night > max) return false;
    }

    // Search filter — matches room number, type, or room type label
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      const searchable = `${room.room_number} ${room.room_type} ${ROOM_TYPE_LABELS[room.room_type] || ''}`.toLowerCase();
      if (!searchable.includes(q)) return false;
    }

    return true;
  });
}

/**
 * Sort rooms by criteria.
 * @param {Array} rooms - Room array to sort
 * @param {string} criteria - Sort key
 * @returns {Array} Sorted rooms (new array)
 */
function sortRooms(rooms, criteria) {
  const sorted = [...rooms];
  switch (criteria) {
    case 'price-asc':
      sorted.sort((a, b) => a.price_per_night - b.price_per_night);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.price_per_night - a.price_per_night);
      break;
    case 'capacity-desc':
      sorted.sort((a, b) => b.capacity - a.capacity);
      break;
    case 'room-number':
      sorted.sort((a, b) => parseInt(a.room_number, 10) - parseInt(b.room_number, 10));
      break;
    default:
      // Default: keep API order
      break;
  }
  return sorted;
}

// ============================================================
// Render: Skeleton Loading State
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
// Render: Room Card
// ============================================================

/**
 * Render an individual room card as HTML string.
 * @param {Object} room - Room object
 * @returns {string} HTML string
 */
function renderRoomCard(room) {
  const typeLabel = ROOM_TYPE_LABELS[room.room_type] || room.room_type;
  const typeColor = ROOM_TYPE_COLORS[room.room_type] || '#0ea5e9';
  const capacityLabel = room.capacity === 1
    ? '1 person'
    : `${room.capacity} personer`;

  const imgPath = `/static/images/rooms/${room.room_type}-room.jpg`;
  return `
    <article class="room-card" role="button" tabindex="0"
             data-room-id="${room.id}"
             aria-label="Rum ${escapeHtml(room.room_number)}, ${typeLabel}, ${capacityLabel}, ${formatPrice(room.price_per_night)}"
             style="border-top: 4px solid ${typeColor};">
      <div class="room-card__image" style="background: linear-gradient(135deg, ${typeColor}40 0%, ${typeColor}80 50%, ${typeColor} 100%);">
        <img src="${imgPath}" alt="${typeLabel} rum med havsvy — Room ${escapeHtml(room.room_number)}" loading="lazy" onerror="this.style.display='none';this.parentElement.style.backgroundSize='cover';" class="room-card__img">
        <span class="room-card__image-icon" aria-hidden="true">🌊</span>
        <span class="room-card__badge room-card__badge--sea-view" aria-label="Havsvy">🏖 Havsvy</span>
        <span class="room-card__badge room-card__badge--room-number"># ${escapeHtml(room.room_number)}</span>
      </div>
      <div class="room-card__info">
        <h3 class="room-card__title">Room ${escapeHtml(room.room_number)}</h3>
        <p class="room-card__meta">
          ${escapeHtml(typeLabel)}
          <span aria-hidden="true">·</span>
          👤 ${escapeHtml(capacityLabel)}
        </p>
        <p class="room-card__price">
          ${formatPrice(room.price_per_night)}
          <span class="room-card__price-unit">/ natt</span>
        </p>
        <button class="room-card__cta"
                data-room-id="${room.id}"
                data-room-number="${escapeHtml(room.room_number)}"
                aria-label="Boka Room ${escapeHtml(room.room_number)}">
          Boka nu
        </button>
      </div>
    </article>
  `;
}

/**
 * Render a grid of room cards into the container.
 * Handles loading, empty, and error states.
 * @param {Array} rooms - Rooms to render
 */
function renderRoomCards(rooms) {
  if (rooms.length === 0) {
    renderEmptyState();
    return;
  }

  gridContainer.innerHTML = rooms.map((room, index) => renderRoomCard(room)).join('');

  // Stagger animation: fade-in each card with 60ms delay
  const cards = gridContainer.querySelectorAll('.room-card');
  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(10px)';
    card.style.transition = `opacity 300ms ease-out ${i * 60}ms, transform 300ms ease-out ${i * 60}ms`;
    // Trigger animation next frame
    requestAnimationFrame(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    });
  });

  updateRoomCount(rooms.length);
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

let lastError = null;

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
// Update Room Count
// ============================================================

function updateRoomCount(count) {
  if (!roomCountEl) return;
  if (count === '') {
    roomCountEl.textContent = '';
  } else if (count === 0) {
    roomCountEl.textContent = 'Inga rum hittades';
  } else {
    roomCountEl.textContent = `Visar ${count} rum`;
  }
}

// ============================================================
// Modal: Detail View
// ============================================================

/**
 * Open the detail modal for a given room.
 * @param {Object} room - Room object
 */
function openRoomDetail(room) {
  if (!dialog) return;

  const typeLabel = ROOM_TYPE_LABELS[room.room_type] || room.room_type;
  const typeColor = ROOM_TYPE_COLORS[room.room_type] || '#0ea5e9';
  const capacityLabel = room.capacity === 1 ? '1 person' : `${room.capacity} personer`;
  const bedsLabel = room.capacity === 1 ? '1 bädd' : `${room.capacity} bäddar`;
  const amenitiesList = AMENITIES[room.room_type] || AMENITIES.single;

  const description = room.description
    ? escapeHtml(room.description)
    : 'Ingen beskrivning tillgänglig.';

  const amenitiesHTML = amenitiesList
    .map((amenity) => `
      <div class="room-detail__amenity" aria-label="${escapeHtml(amenity)}">
        ☑ ${escapeHtml(amenity)}
      </div>
    `).join('');

  const imgPath = `/static/images/rooms/${room.room_type}-room.jpg`;

  dialog.innerHTML = `
    <div class="room-detail__image" style="background: linear-gradient(135deg, ${typeColor}40 0%, ${typeColor}80 50%, ${typeColor} 100%);">
      <img src="${imgPath}" alt="${typeLabel} rum med havsvy — Room ${escapeHtml(room.room_number)}" class="room-detail__img" onerror="this.style.display='none';">
      <div class="room-detail__image-nav">
        <span style="font-size: 2rem; opacity: 0.6;" aria-hidden="true">🌊</span>
      </div>
    </div>
    <div class="room-detail__content">
      <div class="room-detail__header">
        <div>
          <h2 id="detail-title" class="room-detail__title">Room ${escapeHtml(room.room_number)}</h2>
          <p class="room-detail__meta">
            ${escapeHtml(typeLabel)}
            <span aria-hidden="true">·</span>
            👤 ${escapeHtml(capacityLabel)}
            <span aria-hidden="true">·</span>
            🛏 ${escapeHtml(bedsLabel)}
          </p>
        </div>
        <button class="room-detail__close" id="detail-close" type="button" aria-label="Stäng">✕</button>
      </div>

      <p class="room-detail__price">${formatPrice(room.price_per_night)} <span class="room-detail__price-unit">/ natt</span></p>

      <div class="room-detail__section">
        <h3 class="room-detail__section-title">Beskrivning</h3>
        <p class="room-detail__description">${description}</p>
      </div>

      <div class="room-detail__section">
        <h3 class="room-detail__section-title">Utrustning</h3>
        <div class="room-detail__amenities">${amenitiesHTML}</div>
      </div>

      <div class="room-detail__section">
        <p style="color: var(--color-text-muted); font-size: 0.9rem;">
          Tillgängliga datum kontrolleras vid bokning.
        </p>
      </div>

      <button class="room-detail__cta"
              data-room-id="${room.id}"
              data-room-number="${escapeHtml(room.room_number)}"
              type="button">
        Boka Room ${escapeHtml(room.room_number)}
      </button>
    </div>
  `;

  // Close button handler
  const closeBtn = dialog.querySelector('#detail-close');
  closeBtn.addEventListener('click', closeRoomDetail);

  // Booking CTA handler — delegate to parent's booking function
  const ctaBtn = dialog.querySelector('.room-detail__cta');
  ctaBtn.addEventListener('click', () => {
    closeRoomDetail();
    if (typeof openBooking === 'function') {
      openBooking(room.id, room.room_number);
    }
  });

  // Show modal
  dialog.showModal();
}

/**
 * Close the detail modal and restore focus.
 */
function closeRoomDetail() {
  if (dialog && dialog.open) {
    dialog.close();
  }
}

// ============================================================
// Filter Bar Setup
// ============================================================

function setupFilterBar() {
  const typeSelect = document.getElementById('filter-type');
  const capacitySelect = document.getElementById('filter-capacity');
  const priceSelect = document.getElementById('filter-price');
  const sortSelect = document.getElementById('sort-by');

  // Active filter indicator: add data-active attribute when value is set
  function updateActiveIndicator(select) {
    if (select.value) {
      select.setAttribute('data-active', 'true');
    } else {
      select.removeAttribute('data-active');
    }
  }

  // Type filter change
  if (typeSelect) {
    typeSelect.addEventListener('change', () => {
      currentFilters.type = typeSelect.value;
      updateActiveIndicator(typeSelect);
      applyFiltersAndRender();
    });
  }

  // Capacity filter change
  if (capacitySelect) {
    capacitySelect.addEventListener('change', () => {
      currentFilters.capacity = capacitySelect.value;
      updateActiveIndicator(capacitySelect);
      applyFiltersAndRender();
    });
  }

  // Price filter change
  if (priceSelect) {
    priceSelect.addEventListener('change', () => {
      currentFilters.priceRange = priceSelect.value;
      updateActiveIndicator(priceSelect);
      applyFiltersAndRender();
    });
  }

  // Search input — debounce
  const searchInput = document.getElementById('filter-search');
  let searchTimeout = null;
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        currentFilters.search = searchInput.value;
        applyFiltersAndRender();
      }, 300);
    });
  }

  // Sort change
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      currentSort = sortSelect.value;
      applyFiltersAndRender();
    });
  }

  // Clear filters button
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      clearAllFilters();
      applyFiltersAndRender();
    });
  }
}

/**
 * Clear all filter inputs and reset state.
 */
function clearAllFilters() {
  currentFilters = {
    type: '',
    capacity: '',
    priceRange: '',
    search: '',
  };
  currentSort = DEFAULT_SORT;

  const typeSelect = document.getElementById('filter-type');
  const capacitySelect = document.getElementById('filter-capacity');
  const priceSelect = document.getElementById('filter-price');
  const sortSelect = document.getElementById('sort-by');
  const searchInput = document.getElementById('filter-search');

  if (typeSelect) {
    typeSelect.value = '';
    typeSelect.removeAttribute('data-active');
  }
  if (capacitySelect) {
    capacitySelect.value = '';
    capacitySelect.removeAttribute('data-active');
  }
  if (priceSelect) {
    priceSelect.value = '';
    priceSelect.removeAttribute('data-active');
  }
  if (sortSelect) {
    sortSelect.value = DEFAULT_SORT;
  }
  if (searchInput) {
    searchInput.value = '';
  }
}

// ============================================================
// Apply Filters & Render
// ============================================================

function applyFiltersAndRender() {
  const filtered = applyFilters(allRooms, currentFilters);
  const sorted = sortRooms(filtered, currentSort);
  renderRoomCards(sorted);

  // Wire card click events for detail modal
  const cards = gridContainer.querySelectorAll('.room-card');
  cards.forEach((card) => {
    card.addEventListener('click', (e) => {
      // If clicked the CTA button, open booking instead
      if (e.target.closest('.room-card__cta')) {
        e.stopPropagation();
        const roomId = parseInt(e.target.dataset.roomId, 10);
        const roomNumber = e.target.dataset.roomNumber;
        const room = allRooms.find((r) => r.id === roomId);
        if (room) {
          closeRoomDetail();
          if (typeof openBooking === 'function') {
            openBooking(roomId, roomNumber);
          }
        }
        return;
      }
      // Otherwise open detail modal
      const roomId = parseInt(card.dataset.roomId, 10);
      const room = allRooms.find((r) => r.id === roomId);
      if (room) {
        openRoomDetail(room);
      }
    });

    // Keyboard: Enter to open detail
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const roomId = parseInt(card.dataset.roomId, 10);
        const room = allRooms.find((r) => r.id === roomId);
        if (room) {
          openRoomDetail(room);
        }
      }
    });
  });
}

// ============================================================
// Keyboard: Escape to close modal
// ============================================================

function bindKeyboard() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dialog && dialog.open) {
      closeRoomDetail();
    }
  });

  // Close modal when clicking backdrop
  if (dialog) {
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) {
        closeRoomDetail();
      }
    });
  }
}

// ============================================================
// Public API / Entry Point
// ============================================================

/**
 * Initialize the rooms page — wire up event listeners and fetch+render rooms.
 *
 * This function should be called when the rooms page becomes visible.
 * It sets up the filter bar, fetches rooms from the API, and renders the grid.
 *
 * Expects DOM elements to exist:
 *   - #rooms-container (grid area)
 *   - #room-count (result count span)
 *   - #clear-filters (clear filters button)
 *   - #room-detail-dialog (<dialog> element)
 *   - Filter selects: #filter-type, #filter-capacity, #filter-price, #sort-by
 *   - Search input: #filter-search
 */
function init() {
  // Cache DOM references
  gridContainer = document.getElementById('rooms-container');
  roomCountEl = document.getElementById('room-count');
  clearFiltersBtn = document.getElementById('clear-filters');
  dialog = document.getElementById('room-detail-dialog');

  if (!gridContainer || !dialog) {
    console.error('Rooms page DOM elements not found — check that #rooms-container and #room-detail-dialog exist');
    return;
  }

  // Clear any existing content
  gridContainer.innerHTML = '';

  // Setup filter bar event listeners
  setupFilterBar();

  // Setup keyboard handling
  bindKeyboard();

  // Show skeleton loading state
  renderSkeletons();

  // Fetch rooms
  fetchRooms()
    .then((rooms) => {
      allRooms = rooms;
      applyFiltersAndRender();
    })
    .catch((error) => {
      renderErrorState('Kunde inte ladda rum. Kontrollera nätverket och försök igen.');
      console.error(error);
    });
}

// ============================================================
// Exports (for module usage)
// ============================================================

// These are available as global functions when loaded as a <script> tag
// Exports (for module usage)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    fetchRooms,
    renderRoomCards,
    renderRoomCard,
    applyFilters,
    sortRooms,
    openRoomDetail,
    closeRoomDetail,
    setupFilterBar,
    clearAllFilters,
    bindKeyboard,
    init,
  };
}

// --- Global aliases ---
// Make rooms.js functions accessible as globals for app.js integration
window.initRooms = typeof init !== 'undefined' ? init : function() {
  console.warn('rooms.js not loaded — initRooms unavailable');
};
