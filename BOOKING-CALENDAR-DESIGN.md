# BOOKING SYSTEM DESIGN SPECIFICATION

**Project:** Sea View Hotel — Hotel Booking System
**Component:** Bookings Management + Calendar + Booking Flow
**Status:** Design Specification (read-only — no code written)
**Date:** 2025-07-27

---

## 0. DESIGN SYSTEM TOKEN ALIGNMENT

This spec extends the token mapping established in ROOMS-PAGE-DESIGN.md (T2). **T1 (Design System) will define the canonical tokens.** The following mapping applies:

| Placeholder Token       | Purpose                           | Suggested T1 Token Name         |
|-------------------------|-----------------------------------|---------------------------------|
| `--color-warning`       | Yellow/orange accents             | `--color-status-warning`        |
| `--color-danger`        | Danger / cancel / error           | `--color-status-danger`         |
| `--color-status-info`   | Info state                        | `--color-status-info`           |
| `--color-bg-overlay`    | Modal/overlay backdrop            | `--color-bg-overlay`            |
| `--z-modal`             | Modal z-index                     | `--z-modal`                     |
| `--z-toast`             | Toast z-index                     | `--z-toast`                     |
| `--radius-pill`         | Pill/badge border-radius          | `--radius-pill`                 |

All other tokens from the ROOMS-PAGE-DESIGN.md table apply identically.

---

## 1. BOOKINGS PAGE DESIGN

### 1.1 Architecture Decision

**Decision: Keep the existing `<section id="page-bookings">` as-is, but significantly enhance the table and interaction layer.** The current HTML structure is semantically sound; the new design refines the table layout, adds sorting, status badges as pills, and a proper cancellation flow.

### 1.2 Page Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│  <section id="page-bookings">                                   │
│                                                                 │
│  ┌─ Bookings Header ──────────────────────────────────────────┐ │
│  │  <h2>Aktiva Bokningar</h2>                                  │ │
│  │  [Filter: All Statuses ▼]  [Sort: Date ↓]  [↻ Rensa]       │ │
│  │  Visar 12 bokningar (3 filtrerade)                          │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─ Bookings Data Table ──────────────────────────────────────┐ │
│  │  ┌───────────────────────────────────────────────────────┐  │ │
│  │  │ #   │ Gäst            │ Rum      │ Datum             │ Status        │ Åtgärder    │  │ │
│  │  ├───────────────────────────────────────────────────────┤  │ │
│  │  │ #3  │ Anna Lindqvist  │ Rum 102  │ 2025-08-01 → 05   │ ● Confirmed   │ [Avbryt]    │  │ │
│  │  │ #2  │ Erik Johansson  │ Rum 204  │ 2025-07-20 → 25   │ ● Completed   │ —           │  │ │
│  │  │ #1  │ Maria Berg      │ Rum 301  │ 2025-07-15 → 18   │ ● Cancelled   │ —           │  │ │
│  │  └───────────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─ Empty State (shown when 0 bookings) ──────────────────────┐ │
│  │  📋                                                      │ │
│  │  Inga bokningar ännu                                     │ │
│  │  Bokningar från rumssidan kommer att visas här.          │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─ Cancel Confirmation Dialog ───────────────────────────────┐ │
│  │  ┌───────────────────────────────────────────────────────┐  │ │
│  │  │  Avbryt bokning?                                      │  │ │
│  │  │                                                       │  │ │
│  │  │  Vill du verkligen avbryta bokning #3                 │  │ │
│  │  │  (Anna Lindqvist, Rum 102, 1 aug – 5 aug)?           │  │ │
│  │  │                                                       │  │ │
│  │  │  [ Avbryt bokning ]  [ Nej, behåll ]                 │  │ │
│  │  └───────────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  </section>                                                     │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 Semantic HTML Structure

```html
<section id="page-bookings" class="bookings-page" role="region" aria-label="Bokningar">

  <!-- Header + Filter Bar -->
  <header class="bookings-header">
    <h2>Aktiva Bokningar</h2>
    <div class="bookings-toolbar">
      <div class="filter-group">
        <label for="filter-status">Status</label>
        <select id="filter-status" class="filter-select">
          <option value="">Alla</option>
          <option value="confirmed">Bekräftade</option>
          <option value="completed">Slutförda</option>
          <option value="cancelled">Avbrutna</option>
        </select>
      </div>
      <div class="filter-group">
        <label for="sort-by">Sortera</label>
        <select id="sort-by" class="filter-select">
          <option value="date-desc">Incheckning — senast först</option>
          <option value="date-asc">Incheckning — först först</option>
          <option value="guest-asc">Gästnamn — A–Ö</option>
          <option value="room-asc">Rumsnummer</option>
        </select>
      </div>
      <div class="filter-group filter-actions">
        <button type="button" class="btn btn-ghost" id="clear-bookings-filter" aria-label="Rensa filter">
          ↻ Rensa
        </button>
        <span class="filter-count" id="booking-count" aria-live="polite"></span>
      </div>
    </div>
  </header>

  <!-- Table Container -->
  <div id="bookings-table-wrap" class="table-wrap" role="table" aria-label="Bokningstabell">
    <table class="bookings-table" id="bookings-table">
      <thead>
        <tr>
          <th scope="col" data-sort-key="id" class="sortable" tabindex="0" role="columnheader" aria-sort="none">#</th>
          <th scope="col" data-sort-key="guest" class="sortable" tabindex="0" role="columnheader" aria-sort="none">Gäst</th>
          <th scope="col" data-sort-key="room" class="sortable" tabindex="0" role="columnheader" aria-sort="none">Rum</th>
          <th scope="col" data-sort-key="dates" class="sortable" tabindex="0" role="columnheader" aria-sort="none">Datum</th>
          <th scope="col" data-sort-key="price" class="sortable" tabindex="0" role="columnheader" aria-sort="none">Pris</th>
          <th scope="col" data-sort-key="status" class="sortable" tabindex="0" role="columnheader" aria-sort="none">Status</th>
          <th scope="col" role="columnheader">Åtgärder</th>
        </tr>
      </thead>
      <tbody id="bookings-tbody">
        <!-- Rows populated by JS -->
      </tbody>
    </table>
  </div>

  <!-- Empty State (hidden by default) -->
  <div id="bookings-empty" class="empty-state" role="status" aria-live="polite" hidden>
    <div class="empty-state__icon">📋</div>
    <h3>Inga bokningar ännu</h3>
    <p>Bokningar från rumssidan kommer att visas här.</p>
  </div>

  <!-- Loading State (skeleton rows) -->
  <div id="bookings-loading" class="skeleton-table" hidden>
    <!-- 6 skeleton rows -->
  </div>

  <!-- Cancel Confirmation Dialog -->
  <dialog id="cancel-confirm-dialog" class="confirm-dialog" aria-labelledby="cancel-title">
    <div class="confirm-dialog__body">
      <h3 id="cancel-title">Avbryt bokning?</h3>
      <p id="cancel-detail"></p>
      <div class="confirm-dialog__actions">
        <button type="button" id="confirm-cancel-btn" class="btn btn-danger">Avbryt bokning</button>
        <button type="button" id="cancel-dialog-btn" class="btn">Nej, behåll</button>
      </div>
    </div>
  </dialog>

</section>
```

### 1.4 Status Badge Design

Status badges use a pill-style design with a colored dot indicator:

```
● Confirmed    ● Cancelled    ● Completed
```

| Status     | Dot Color  | Text Color      | Label (sv)  |
|------------|-----------|-----------------|-------------|
| `confirmed`| `#059669` (green) | `#065f46` | Bekräftad   |
| `cancelled`| `#dc2626` (red)   | `#991b1b` | Avbruten    |
| `completed`| `#6b7280` (gray)  | `#4b5563` | Slutförd    |

### 1.5 CSS Component Spec

```css
/* --- Bookings Page --- */
.bookings-page { }

.bookings-header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.bookings-header > h2 {
  font-size: 1.4rem;
  color: var(--color-text-heading);
  margin: 0;
}

.bookings-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  align-items: flex-end;
}

/* --- Table --- */
.bookings-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.bookings-table thead {
  background: var(--color-bg-surface);
  border-bottom: 2px solid var(--color-border);
}

.bookings-table th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--color-text-heading);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  transition: background var(--transition-fast);
  border-bottom: 2px solid var(--color-border);
}

.bookings-table th:hover {
  background: rgba(3, 105, 161, 0.04);
}

.bookings-table th.sortable::after {
  content: ' ↕';
  opacity: 0.3;
  font-size: 0.8em;
}

.bookings-table th.sort-asc::after { content: ' ↑'; opacity: 1; color: var(--color-primary); }
.bookings-table th.sort-desc::after { content: ' ↓'; opacity: 1; color: var(--color-primary); }

.bookings-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
  vertical-align: middle;
}

.bookings-table tbody tr {
  transition: background var(--transition-fast);
}

.bookings-table tbody tr:hover {
  background: rgba(3, 105, 161, 0.03);
}

/* --- Status Badge Pill --- */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-pill);
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}

.status-badge--confirmed {
  background: rgba(5, 150, 105, 0.1);
  color: #065f46;
}

.status-badge--cancelled {
  background: rgba(220, 38, 38, 0.1);
  color: #991b1b;
}

.status-badge--completed {
  background: rgba(107, 114, 128, 0.1);
  color: #4b5563;
}

.status-badge__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.status-badge--confirmed .status-badge__dot { background: #059669; }
.status-badge--cancelled .status-badge__dot { background: #dc2626; }
.status-badge--completed .status-badge__dot { background: #6b7280; }

/* --- Action Button --- */
.bookings-table .btn-danger {
  padding: 0.35rem 0.85rem;
  font-size: 0.8rem;
  border-radius: var(--radius-sm);
}

/* --- Date Column --- */
.date-range {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.date-range__checkin,
.date-range__checkout {
  font-size: 0.9rem;
}

.date-range__arrow {
  color: var(--color-text-muted);
  font-size: 0.75rem;
}

/* --- Empty State --- */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--color-text-muted);
}

.empty-state__icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
}

.empty-state h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: var(--color-text-heading);
}

/* --- Confirm Dialog --- */
.confirm-dialog {
  max-width: 450px;
  width: 90%;
  border: none;
  border-radius: var(--radius-md);
  background: var(--color-bg-surface);
  box-shadow: var(--shadow-elevated);
  padding: var(--spacing-xl);
}

.confirm-dialog::backdrop {
  background: rgba(0, 0, 0, 0.4);
}

.confirm-dialog__body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.confirm-dialog__body h3 {
  font-size: 1.15rem;
  color: var(--color-text-heading);
  margin: 0;
}

.confirm-dialog__body p {
  font-size: 0.95rem;
  color: var(--color-text-muted);
  margin: 0;
  line-height: 1.5;
}

.confirm-dialog__actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  margin-top: var(--spacing-sm);
}

/* --- Skeleton Loading Table --- */
@keyframes shimmer-table {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton-row {
  display: flex;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
}

.skeleton-row__cell {
  height: 1rem;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  animation: shimmer-table 1.5s infinite;
  border-radius: var(--radius-sm);
}

.skeleton-row__cell--short { width: 60px; }
.skeleton-row__cell--medium { width: 120px; }
.skeleton-row__cell--long { width: 200px; }
```

### 1.6 Table Column Mapping

| API Field          | Table Column | Display Format                         | Sort Key     |
|--------------------|-------------|----------------------------------------|-------------|
| `id`               | `#`         | `#{id}`                               | `id`        |
| `guest_name`       | Gäst         | Plain text, truncated at 25 chars     | `guest`     |
| `room_id`          | Rum          | `Rum {room_number}` — look up room via API or join | `room`   |
| `check_in`         | Datum (in)   | `YYYY-MM-DD`                          | `dates`     |
| `check_out`        | Datum (ut)   | `YYYY-MM-DD`                          | (paired)    |
| `total_price`      | Pris         | `{price} kr`                          | `price`     |
| `status`           | Status       | `<span class="status-badge status-badge--{status}">...</span>` | `status` |

### 1.7 Empty State

```html
<div id="bookings-empty" class="empty-state" role="status" aria-live="polite" hidden>
  <div class="empty-state__icon">📋</div>
  <h3>Inga bokningar ännu</h3>
  <p>Bokningar från rumssidan kommer att visas här.</p>
</div>
```

- Displayed when bookings list is empty or no bookings match the current filter.
- Centered in the table area with the same max-width constraint.
- Icon: 📋 (calendar/notebook emoji — no external assets needed).
- Swedish text, consistent with the rest of the app.

---

## 2. CALENDAR PAGE DESIGN

### 2.1 Architecture Decision

**Decision: Use a horizontal month-grid layout (traditional calendar view) where each day column shows all rooms.** This provides a dense, scannable view of the entire month at a glance, which is more useful than the current vertical day-list approach.

The calendar uses the existing `GET /api/calendar/{year}/{month}` endpoint.

### 2.2 Page Wireframe

```
┌─────────────────────────────────────────────────────────────────────────┐
│  <section id="page-calendar">                                            │
│                                                                           │
│  ┌─ Calendar Header ────────────────────────────────────────────────────┐│
│  │  <h2>Bokningskalender</h2>                                            ││
│  │  [ ◀ Juli 2025 ▶ ]                                                   ││
│  │  Rumstyp: [Alla ▼]  [Rum 101 ▼]                                     ││
│  └──────────────────────────────────────────────────────────────────────┘│
│                                                                           │
│  ┌─ Legend ─────────────────────────────────────────────────────────────┐│
│  │  ● Ledig    ● Bokad    ● Idag                                        ││
│  └──────────────────────────────────────────────────────────────────────┘│
│                                                                           │
│  ┌─ Month Grid ─────────────────────────────────────────────────────────┐│
│  │  ┌─────────────────────────────────────────────────────────────────┐  ││
│  │  │  Man   Tis   Ons   Tor   Fre   Lör   Sön                        │  ││
│  │  │  ────────────────────────────────────────────────────────────    │  ││
│  │  │  ░    ░    ░    ░    ░    ░    ░    ← 4 July (gray = prev month)│  ││
│  │  │  [✓][✓][✗][✓][✓][✓][✓]  ← 5 July (row: each cell = room status)│  ││
│  │  │  [✓][✓][✓][✓][✗][✓][✓]  ← 6 July                             │  ││
│  │  │  [✓][✗][✗][✓][✓][✓][✓]  ← 7 July                             │  ││
│  │  │  ...                                                             │  ││
│  │  │  [✓][✓][✓][✓][✓][✓][✓]  ← 31 July                             │  ││
│  │  └─────────────────────────────────────────────────────────────────┘  ││
│  │                                                                       ││
│  │  (Mobile: horizontally scrollable grid)                               ││
│  └──────────────────────────────────────────────────────────────────────┘│
│                                                                           │
│  ┌─ Room Legend (per-room color) ───────────────────────────────────────┐│
│  │  Rum 101 ●  Rum 102 ●  Rum 201 ● ...  (click to filter)             ││
│  └──────────────────────────────────────────────────────────────────────┘│
│                                                                           │
│  </section>                                                               │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Semantic HTML Structure

```html
<section id="page-calendar" class="calendar-page" role="region" aria-label="Kalender">

  <header class="calendar-header">
    <h2>Bokningskalender</h2>

    <div class="calendar-nav">
      <button type="button" class="btn btn-ghost" id="cal-prev-month" aria-label="Föregående månad">◀</button>
      <span class="calendar-nav__label" id="calendar-month-label" aria-live="polite">Juli 2025</span>
      <button type="button" class="btn btn-ghost" id="cal-next-month" aria-label="Nästa månad">▶</button>
      <button type="button" class="btn btn-ghost" id="cal-today" aria-label="Gå till idag">Idag</button>
    </div>

    <div class="calendar-filters">
      <div class="filter-group">
        <label for="filter-room-type">Rumstyp</label>
        <select id="filter-room-type" class="filter-select">
          <option value="">Alla rumtyper</option>
          <option value="single">Enkel</option>
          <option value="double">Dubbel</option>
          <option value="four_person">Fyrasäng</option>
        </select>
      </div>
      <div class="filter-group">
        <label for="filter-room-specific">Rum</label>
        <select id="filter-room-specific" class="filter-select">
          <option value="">Alla rum</option>
          <!-- Populated dynamically from /api/rooms/ -->
        </select>
      </div>
    </div>
  </header>

  <!-- Legend -->
  <div class="calendar-legend" aria-label="Teckenförklaring">
    <div class="legend-item">
      <span class="legend-dot legend-dot--available"></span>
      <span>Ledig</span>
    </div>
    <div class="legend-item">
      <span class="legend-dot legend-dot--booked"></span>
      <span>Bokad</span>
    </div>
    <div class="legend-item">
      <span class="legend-dot legend-dot--today"></span>
      <span>Idag</span>
    </div>
  </div>

  <!-- Calendar Grid Container -->
  <div id="calendar-grid-wrap" class="calendar-grid-wrap" role="grid" aria-label="Månadsraster">
    <!-- Header row with day names -->
    <div class="calendar-grid__header" role="row">
      <div class="calendar-grid__header-cell" role="columnheader">Man</div>
      <div class="calendar-grid__header-cell" role="columnheader">Tis</div>
      <div class="calendar-grid__header-cell" role="columnheader">Ons</div>
      <div class="calendar-grid__header-cell" role="columnheader">Tor</div>
      <div class="calendar-grid__header-cell" role="columnheader">Fre</div>
      <div class="calendar-grid__header-cell" role="columnheader">Lör</div>
      <div class="calendar-grid__header-cell" role="columnheader">Sön</div>
    </div>
    <!-- Weeks (rows) populated by JS -->
    <div id="calendar-weeks" class="calendar-grid__body" role="rowgroup">
      <!-- Each week is a <div class="calendar-grid__row" role="row"> -->
      <!-- Each cell is <div class="calendar-grid__cell" role="gridcell"> -->
    </div>
  </div>

  <!-- Room Mini-Filter (shown when "Alla rum" is selected) -->
  <div id="room-chip-bar" class="room-chip-bar" role="toolbar" aria-label="Rumfilter">
    <!-- Pill chips: [Alla ✕] [Rum 101] [Rum 102] ... -->
  </div>

</section>
```

### 2.4 Calendar Grid CSS Spec

```css
/* --- Calendar Navigation --- */
.calendar-header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.calendar-header > h2 {
  font-size: 1.4rem;
  color: var(--color-text-heading);
  margin: 0;
}

.calendar-nav {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.calendar-nav__label {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-text-heading);
  min-width: 180px;
  text-align: center;
}

.calendar-nav .btn-ghost {
  padding: 0.5rem 0.75rem;
}

/* --- Legend --- */
.calendar-legend {
  display: flex;
  gap: var(--spacing-lg);
  align-items: center;
  padding: var(--spacing-sm) 0;
  margin-bottom: var(--spacing-md);
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.legend-dot--available { background: #059669; }
.legend-dot--booked { background: #dc2626; }
.legend-dot--today {
  background: white;
  border: 3px solid var(--color-primary);
  box-shadow: 0 0 0 2px rgba(3, 105, 161, 0.2);
}

/* --- Calendar Grid --- */
.calendar-grid-wrap {
  background: var(--color-bg-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  overflow-x: auto;
  padding: var(--spacing-sm);
}

.calendar-grid__header {
  display: grid;
  grid-template-columns: repeat(7, minmax(60px, 1fr));
  gap: 2px;
  margin-bottom: 2px;
}

.calendar-grid__header-cell {
  text-align: center;
  padding: 0.5rem;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-text-muted);
  letter-spacing: 0.05em;
}

.calendar-grid__body {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.calendar-grid__row {
  display: grid;
  grid-template-columns: repeat(7, minmax(60px, 1fr));
  gap: 2px;
}

.calendar-grid__cell {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 4px 2px;
  border-radius: var(--radius-sm);
  font-size: 0.7rem;
  cursor: pointer;
  transition: background var(--transition-fast), transform var(--transition-fast);
  min-height: 50px;
}

.calendar-grid__cell:hover {
  background: rgba(3, 105, 161, 0.05);
  transform: scale(1.02);
}

.calendar-grid__cell:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.calendar-grid__cell--prev-month {
  opacity: 0.3;
  pointer-events: none;
}

.calendar-grid__cell--today {
  box-shadow: 0 0 0 2px var(--color-primary);
  font-weight: 700;
}

.calendar-grid__cell--date {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-heading);
  line-height: 1;
}

.calendar-grid__cell--rooms {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  justify-content: center;
  width: 100%;
  margin-top: 2px;
}

.calendar-grid__room-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.calendar-grid__room-dot--available { background: #059669; }
.calendar-grid__room-dot--booked { background: #dc2626; }

/* Room type accent color coding */
.calendar-grid__room-dot--single { border-left: 3px solid #0ea5e9; }
.calendar-grid__room-dot--double { border-left: 3px solid #8b5cf6; }
.calendar-grid__room-dot--four_person { border-left: 3px solid #f59e0b; }

/* --- Room Chip Bar --- */
.room-chip-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: var(--spacing-md);
}

.room-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.75rem;
  border-radius: var(--radius-pill);
  font-size: 0.8rem;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.room-chip:hover {
  border-color: var(--color-primary);
}

.room-chip--active {
  border-color: var(--color-primary);
  background: rgba(3, 105, 161, 0.05);
  font-weight: 600;
}

.room-chip__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

/* --- Mobile --- */
@media (max-width: 639px) {
  .calendar-grid__header,
  .calendar-grid__row {
    grid-template-columns: repeat(7, minmax(44px, 1fr));
  }

  .calendar-grid__cell {
    min-height: 40px;
  }

  .calendar-grid__room-dot {
    width: 6px;
    height: 6px;
  }

  .calendar-nav__label {
    font-size: 1rem;
    min-width: 150px;
  }
}

@media (min-width: 640px) {
  .calendar-grid__header,
  .calendar-grid__row {
    grid-template-columns: repeat(7, minmax(70px, 1fr));
  }
}
```

### 2.5 Calendar Rendering Logic

#### API Response Shape (from `GET /api/calendar/{year}/{month}`)

```json
{
  "month": "2025-07",
  "days": [
    {
      "date": "2025-07-05",
      "room_1": { "room_number": "101", "available": false, "booking_id": 3 },
      "room_2": { "room_number": "102", "available": true, "booking_id": null },
      "room_3": { "room_number": "201", "available": true, "booking_id": null },
      ...
    }
  ]
}
```

#### Rendering Algorithm (Step-by-Step)

1. **Fetch** `GET /api/calendar/{year}/{month}` → `calendarData`
2. **Fetch** `GET /api/rooms/` → `rooms` (for room type mapping and filtering)
3. **Compute grid structure:**
   - Find the first day of the month's day-of-week (0=Mon, 6=Sun in Swedish format)
   - Build 5–6 weeks of grid rows
   - For each week, create 7 cells
   - Cells before the 1st of the month get `--prev-month` class
   - Cells after the last of the month get `--next-month` class
4. **For each cell that falls within the month:**
   - Match the cell's date to `calendarData.days` by `date` field
   - If match found, render room availability dots
   - Each room gets a colored dot: green (`available`) or red (`booked`)
   - If "All rooms" is selected, show up to 5 dots per cell (truncate with overflow indicator)
   - If a specific room is selected, show a single large cell with that room's status
5. **Highlight today** if the cell's date matches the current date
6. **On cell click:**
   - If "All rooms" mode: show a mini-tooltip with availability summary for that day
   - If a single room is selected: open booking flow for that room on that date range

#### Room Color Coding

Same accent colors as ROOMS-PAGE-DESIGN.md (T2):

| Room Type      | Color     | Label (sv) |
|----------------|-----------|------------|
| `single`       | `#0ea5e9` | Enkel      |
| `double`       | `#8b5cf6` | Dubbel     |
| `four_person`  | `#f59e0b` | Fyrasäng   |

### 2.6 Room Selection in Calendar

Two modes:

**Mode A — All Rooms (default):**
- Compact grid showing all rooms as small dots per day
- Clicking a day shows a popover/tooltip with a per-room breakdown
- Room filter at top to narrow to a specific type or individual room

**Mode B — Single Room View:**
- When a specific room is selected from the dropdown
- Grid shows only that room's availability per day
- Each day cell displays a single large indicator (available/booked)
- Clicking a day opens the booking flow with that room pre-filled

---

## 3. BOOKING FLOW DESIGN

### 3.1 Architecture Decision

**Decision: Use a modal-based booking flow (`<dialog>` element), extending the existing booking modal pattern in `app.js`.**

Rationale (consistent with T2's decision):
- Single-page app already uses modal for room detail
- Keeps users in context (no page navigation)
- Native `<dialog>` provides focus trap, Escape to close, and backdrop
- Faster interaction loop
- The existing `booking-modal` div can be refactored into a proper `<dialog>` element

### 3.2 Booking Flow Entry Points

1. **From Room Card** (Rooms page): Click "Boka nu" → opens booking modal with room pre-filled
2. **From Room Detail Modal** (Rooms page): Click "Boka Rum 101" → opens booking modal with room pre-filled
3. **From Calendar**: Click on an available day in single-room view → opens booking modal with room + date pre-filled

### 3.3 Booking Modal Wireframe

```
┌─────────────────────────────────────────────────────────────────────┐
│  ┌─ Booking Modal ────────────────────────────────────────────────┐ │
│  │  ┌─ Header ─────────────────────────────────────────────────┐   │ │
│  │  │  <h2>Boka <span id="booking-room-label">Rum 101</span>   │   │ │
│  │  │  [ ✕ Close ]                                             │   │ │
│  │  └──────────────────────────────────────────────────────────┘   │ │
│  │                                                                  │ │
│  │  ┌─ Form ─────────────────────────────────────────────────────┐  │ │
│  │  │  ┌─ Guest Info ──────────────────────────────────────────┐ │  │ │
│  │  │  │  Namn *          [_______________________________]     │ │  │ │
│  │  │  │  E-post *        [_______________________________]     │ │  │ │
│  │  │  │  Telefon         [_______________________________]     │ │  │ │
│  │  │  └────────────────────────────────────────────────────────┘ │  │ │
│  │  │                                                             │  │ │
│  │  │  ┌─ Stay Dates ──────────────────────────────────────────┐ │  │ │
│  │  │  │  Incheckning *   [2025-08-01]     (min: today)         │ │  │ │
│  │  │  │  Utcheckning *   [2025-08-05]     (min: checkin + 1d)  │ │  │ │
│  │  │  │  Antal gäster    [▼ 2 personer]                      │ │  │ │
│  │  │  └────────────────────────────────────────────────────────┘ │  │ │
│  │  │                                                             │  │ │
│  │  │  ┌─ Price Summary ──────────────────────────────────────┐  │ │  │ │
│  │  │  │  4 nätter × 800 kr = 3 200 kr                        │  │ │  │ │
│  │  │  └────────────────────────────────────────────────────────┘ │  │ │
│  │  │                                                             │  │ │
│  │  │  ┌─ Error Message (hidden by default) ──────────────────┐  │  │ │
│  │  │  │  ⚠ Rummet är inte tillgängligt för dessa datum        │  │  │ │
│  │  │  └────────────────────────────────────────────────────────┘ │  │ │
│  │  │                                                             │  │ │
│  │  │  ┌─ Actions ─────────────────────────────────────────────┐  │  │ │
│  │  │  │  [Bekräfta bokning]  [Avbryt]                          │  │  │ │
│  │  │  └────────────────────────────────────────────────────────┘ │  │ │
│  │  └──────────────────────────────────────────────────────────────┘ │ │
│  │                                                                  │ │
│  │  ┌─ Success State (shown after successful booking) ───────────┐  │ │
│  │  │  ✅ Bokning bekräftad!                                      │  │  │
│  │  │                                                             │  │  │
│  │  │  Bokningsreferens: #42                                     │  │  │
│  │  │  Rum 101  ·  1 aug – 5 aug 2025                           │  │  │
│  │  │  Anna Lindqvist  ·  3 200 kr                              │  │  │
│  │  │                                                             │  │  │
│  │  │  [Stäng]  [Visa mina bokningar]                            │  │  │
│  │  └──────────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.4 Modal CSS Spec

```css
/* --- Booking Modal (dialog) --- */
.booking-modal {
  max-width: 520px;
  width: 92%;
  max-height: 90vh;
  overflow-y: auto;
  border: none;
  border-radius: var(--radius-md);
  background: var(--color-bg-surface);
  box-shadow: var(--shadow-elevated);
  padding: 0;
}

.booking-modal::backdrop {
  background: rgba(0, 0, 0, 0.4);
}

.booking-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.booking-modal__header h2 {
  font-size: 1.25rem;
  color: var(--color-text-heading);
  margin: 0;
}

.booking-modal__close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--color-text-muted);
  padding: 0.25rem;
  line-height: 1;
  transition: color var(--transition-fast);
}

.booking-modal__close:hover {
  color: var(--color-text-heading);
}

.booking-modal__body {
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

/* --- Form Groups --- */
.booking-modal__section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.booking-modal__section-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
  padding-bottom: var(--spacing-xs);
  border-bottom: 2px solid var(--color-border);
}

.booking-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.booking-form--single-col {
  grid-template-columns: 1fr;
}

.booking-form__group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.booking-form__group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text-heading);
}

.booking-form__group label .required {
  color: #dc2626;
  margin-left: 0.2rem;
}

.booking-form__group input,
.booking-form__group select {
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 1rem;
  color: var(--color-text-heading);
  background: var(--color-bg-surface);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.booking-form__group input:focus,
.booking-form__group select:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(3, 105, 161, 0.15);
}

.booking-form__group input[aria-invalid="true"],
.booking-form__group select[aria-invalid="true"] {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.booking-form__error {
  font-size: 0.8rem;
  color: #dc2626;
  margin-top: -0.2rem;
}

/* --- Price Summary --- */
.price-summary {
  background: rgba(3, 105, 161, 0.03);
  border-radius: var(--radius-sm);
  padding: var(--spacing-md);
  text-align: center;
}

.price-summary__breakdown {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-xs);
}

.price-summary__total {
  font-size: 1.4rem;
  font-weight: 700;
  color: #059669;
}

/* --- Form Actions --- */
.booking-form__actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
}

.booking-form__submit {
  padding: 0.75rem 2rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.booking-form__submit:hover {
  background: var(--color-primary-hover);
}

.booking-form__submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.booking-form__cancel {
  padding: 0.75rem 1.5rem;
  background: transparent;
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 1rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.booking-form__cancel:hover {
  border-color: var(--color-text-heading);
  color: var(--color-text-heading);
}

/* --- Success State --- */
.booking-success {
  text-align: center;
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.booking-success__icon {
  font-size: 3rem;
}

.booking-success__title {
  font-size: 1.2rem;
  color: #059669;
  font-weight: 700;
  margin: 0;
}

.booking-success__detail {
  font-size: 0.95rem;
  color: var(--color-text-muted);
  line-height: 1.6;
}

.booking-success__ref {
  font-family: monospace;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text-heading);
  background: rgba(3, 105, 161, 0.05);
  padding: 0.3rem 0.75rem;
  border-radius: var(--radius-sm);
}

/* --- Mobile --- */
@media (max-width: 639px) {
  .booking-modal {
    width: 100%;
    max-width: none;
    max-height: 100vh;
    height: 100vh;
    border-radius: 0;
  }

  .booking-form {
    grid-template-columns: 1fr;
  }
}
```

### 3.5 Form Fields Specification

| Field           | Input Type | Required | Validation Rules                          | Min/Max          |
|-----------------|-----------|----------|-------------------------------------------|------------------|
| Guest Name      | text      | ✓        | Non-empty, 2–100 chars, letters/spaces/áéå | —               |
| Email           | email     | ✓        | Valid email format                         | —                |
| Phone           | tel       | ✗        | Optional; digits, spaces, +, - only; 6–20 chars | —           |
| Check-in Date   | date      | ✓        | Must be ≥ today; must be < check-out date  | min: today       |
| Check-out Date  | date      | ✓        | Must be > check-in date; max 30 nights     | min: checkin + 1d, max 30 nights |
| Guest Count     | select    | ✗        | Defaults to room capacity; 1 to capacity   | 1–capacity      |

### 3.6 Form Validation Rules

**Client-side validation (before API call):**

1. **Required fields:** Guest name, email, check-in, check-out are all required. Show inline error if empty.
2. **Email format:** Use HTML5 `type="email"` + `required` attribute for basic validation. Also validate with regex on submit.
3. **Date logic:**
   - Check-in cannot be in the past (must be ≥ today's date)
   - Check-out must be after check-in (minimum 1-night stay)
   - Maximum stay: 30 nights
4. **Guest count:** Cannot exceed room capacity. Default to room capacity when room is pre-selected.
5. **Live availability check:** On check-out date change (blur event), check availability by calling `GET /calendar/{year}/{month}` for the selected room and date range. If any date in the range has `available: false`, show error.

**Server-side validation (API returns 400):**
- Date overlap with existing confirmed booking
- Room not found

### 3.7 Price Calculation Display

When check-in or check-out changes:

```javascript
// Pseudo-code
function updatePriceSummary(checkIn, checkOut, roomPricePerNight) {
  const nights = differenceInDays(checkOut, checkIn);
  if (nights > 0) {
    const total = nights * roomPricePerNight;
    show(`${nights} natt${pluralize(nights)} × ${roomPricePerNight} kr = ${total.toLocaleString('sv-SE')} kr`);
  } else {
    show('—');
  }
}
```

- Format: Swedish locale (`sv-SE`) with space thousands separator
- Update live on date field blur/change

---

## 4. INTERACTION & UX DESIGN

### 4.1 Modal vs Page Navigation

**Decision: Modal-based for booking form (as stated in Section 3.1).**

The existing `<dialog>` or fixed-overlay modal pattern is consistent with the rooms page (T2) and the current `app.js` booking modal. No separate page route needed.

### 4.2 Loading States

| Scenario              | Loading Indicator                                    |
|-----------------------|------------------------------------------------------|
| Bookings page load    | 6 skeleton rows with shimmer animation (see §1.5)   |
| Calendar page load    | Grid outline with shimmer on each cell               |
| Booking submit        | Submit button disabled + spinner (⏳)                 |
| Cancel booking        | Cancel button disabled + spinner on confirmation    |
| Availability check    | Live check on date blur; 1s debounce                  |

### 4.3 Toast Notifications

Replace the existing simple `showMessage()` with a proper toast notification system.

**Toast Position:** Bottom-right corner, stacked vertically with 0.75rem gap.

```css
.toast-container {
  position: fixed;
  bottom: var(--spacing-lg);
  right: var(--spacing-lg);
  z-index: var(--z-toast);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 380px;
}

.toast {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 0.85rem 1.25rem;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: var(--shadow-elevated);
  animation: toast-in 0.3s ease-out;
  border-left: 4px solid transparent;
}

.toast--success {
  background: #d1fae5;
  color: #065f46;
  border-left-color: #059669;
}

.toast--error {
  background: #fee2e2;
  color: #991b1b;
  border-left-color: #dc2626;
}

.toast--info {
  background: #dbeafe;
  color: #1e40af;
  border-left-color: #3b82f6;
}

.toast--dismissing {
  animation: toast-out 0.2s ease-in forwards;
}

@keyframes toast-in {
  from { transform: translateX(100%); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
}

@keyframes toast-out {
  from { transform: translateX(0); opacity: 1; }
  to   { transform: translateX(100%); opacity: 0; }
}
```

**Toast behavior:**
- Auto-dismiss after 4 seconds
- Max 3 toasts visible at once (oldest fades out when new one arrives)
- Clickable dismiss button (✕) on each toast
- Clicking a toast dismisses it immediately
- On mobile: bottom-left corner, full-width minus margins

### 4.4 Confirmation Dialogs

Used for:
- **Cancel booking:** Shown as a `<dialog>` modal (see §1.5 HTML)
- **Behavior:** Clicking "Avbryt" on a booking row opens the confirm dialog
- **Focus trap:** Native `<dialog>` provides this
- **Escape key:** Closes the dialog without action
- **Keyboard:** Tab between buttons, Enter on default action

### 4.5 Keyboard Accessibility

| Action                       | Keyboard Key            |
|------------------------------|-------------------------|
| Navigate between table rows  | ↑ / ↓ Arrow keys        |
| Navigate between table cols  | ← / → Arrow keys        |
| Activate sortable column     | Enter or Space          |
| Cancel booking (row focus)   | Enter or Space          |
| Close any modal/dialog       | Escape                  |
| Tab through all interactive  | Tab / Shift+Tab         |
| Confirm cancel dialog        | Enter (on confirm btn)  |
| Calendar cell focus          | Arrow keys within grid  |
| Calendar month navigation    | ← / → Arrow keys        |

**Additional requirements:**
- All interactive elements must have visible `:focus-visible` outlines
- `tabindex="0"` on sortable table headers for keyboard activation
- `role="grid"`, `role="row"`, `role="gridcell"` on calendar grid
- `aria-sort="ascending|descending|none"` on sortable table headers
- `aria-live="polite"` on calendar month label and booking count

### 4.6 Reduced Motion

All animations respect `@media (prefers-reduced-motion: reduce)`:
- Disable toast slide-in/out animation (instant show/hide)
- Disable calendar cell hover scale
- Disable skeleton shimmer animation (static gray backgrounds)
- Disable modal open/close animations

---

## 5. CALENDAR GRID SPECIFICATION (DETAILED)

### 5.1 API Response Rendering

The `GET /api/calendar/{year}/{month}` returns:

```json
{
  "month": "2025-07",
  "days": [
    {
      "date": "2025-07-05",
      "room_1": { "room_number": "101", "available": false, "booking_id": 3 },
      "room_2": { "room_number": "102", "available": true, "booking_id": null },
      "room_3": { "room_number": "201", "available": true, "booking_id": null },
      "room_4": { "room_number": "202", "available": false, "booking_id": 1 }
    }
    // ... 26 more day entries for July
  ]
}
```

### 5.2 Grid Building Algorithm

```
1. Parse year/month from URL or dropdown
2. Compute first-day-of-month weekday (Monday = 0, Sunday = 6)
3. Compute total days in month
4. Build a weeks array:
   For each week (0–5):
     For each day (0–6, Mon–Sun):
       Calculate absolute date index = week*7 + day - firstWeekdayOffset
       If absolute date index < 0: prev-month cell (gray, no click)
       If absolute date index >= daysInMonth: next-month cell (gray, no click)
       Otherwise: current-month cell with date = `${year}-${month}-${day}`

5. For each current-month cell:
   a. Look up date in calendarData.days[]
   b. If not found: no booking data for this day (should not happen)
   c. Get room availability from day entry's room_N fields
   d. Render based on filter mode:
      - All rooms: show up to 5 room dots (capped), overflow indicator if > 5
      - Single room: show large single indicator
   e. If today: add --today class
   f. If cell clicked: handle click event
```

### 5.3 Visual Encoding

| Condition              | Visual                                          |
|------------------------|-------------------------------------------------|
| Available              | Green dot (8px circle), background: `#059669`   |
| Booked                 | Red dot (8px circle), background: `#dc2626`     |
| Today                  | Blue ring (2px solid `--color-primary`) around the entire cell |
| Previous month         | 30% opacity, pointer-events: none               |
| Hover on available day | Slight blue tint background                     |

### 5.4 Room Selection in Calendar View

**Implementation:**

1. On page load, fetch `GET /api/rooms/` to populate the room dropdown
2. Default view: "Alla rum" — compact grid with small dots
3. When user selects a room type or specific room:
   - Filter the calendar data to only show that room
   - Grid becomes wider (each cell is taller with a single indicator)
   - Room chip bar updates to show the active filter
4. Clicking a room chip toggles that room's visibility (toggle mode)
5. "Alla" chip always present to reset to full view

**Room chip bar HTML:**

```html
<div class="room-chip-bar">
  <button class="room-chip room-chip--active" data-room="all">
    <span class="room-chip__dot" style="background: linear-gradient(135deg, #0ea5e9, #8b5cf6, #f59e0b);"></span>
    Alla
  </button>
  <button class="room-chip" data-room="1">
    <span class="room-chip__dot" style="background: #0ea5e9;"></span>
    Rum 101
  </button>
  <button class="room-chip" data-room="2">
    <span class="room-chip__dot" style="background: #0ea5e9;"></span>
    Rum 102
  </button>
  <!-- ... 18 more room chips -->
</div>
```

### 5.5 Cross-Month Navigation

When navigating between months:

1. User clicks ◀ or ▶ buttons, or uses arrow keys
2. Update `year` and `month` in state
3. Scroll to top of calendar grid (user doesn't lose context)
4. Fetch new data: `GET /api/calendar/{year}/{month}`
5. Re-render grid
6. Update `calendar-month-label` with Swedish month name
7. If the selected room had a booking in the previous/next month, the room chip shows a small indicator badge showing that info

### 5.6 Calendar Cell Interaction

**"All rooms" mode — cell click:**
- Opens a small popover/tooltip below the cell
- Lists all rooms with their availability for that day
- Each room entry is clickable → opens booking flow for that room on that day

**Single room mode — cell click:**
- If available: opens booking modal with that room and that date pre-filled
- If booked: shows a small tooltip with booking reference and guest name (from the `booking_id` field, look up via `GET /api/bookings/{id}/`)

---

## 6. RESPONSIVE BREAKPOINTS

| Breakpoint | Screen Width | Bookings Page                        | Calendar Page                          | Booking Modal           |
|------------|-------------|--------------------------------------|----------------------------------------|-------------------------|
| `xs`       | < 640px     | Table horizontally scrollable; 1-col layout; sticky header | Grid scrollable horizontally; dots 6px; nav label smaller | Full-screen overlay     |
| `sm`       | ≥ 640px     | Table scrollable; all columns visible; 2-col form in modal | Grid 44px min per column; dots 6px     | Full-screen overlay     |
| `md`       | ≥ 768px     | Same as sm; filter bar wraps          | Grid 70px min per column; dots 8px     | 520px max-width card    |
| `lg`       | ≥ 1024px    | Same as md; full-width table          | Grid 70px min per column               | 520px max-width card    |
| `xl`       | ≥ 1280px    | Max-width container (1100px)          | Grid max width constrained             | 520px max-width card    |

**Mobile-specific behaviors:**
- All modals become full-screen overlays (height: 100vh, no border-radius)
- Table wraps in `.table-wrap` with `overflow-x: auto`
- Calendar grid wraps in `.calendar-grid-wrap` with `overflow-x: auto`
- Form fields stack to single column
- Filter bars become horizontally scrollable (`overflow-x: auto`, `white-space: nowrap`)
- Toast notifications appear bottom-left instead of bottom-right

---

## 7. JS MODULE INTERFACE

### 7.1 Module: `bookings.js`

```javascript
/**
 * BOOKINGS UI MODULE
 * Handles bookings listing, filtering, sorting, cancellation, and confirmation.
 */

/**
 * Initialize the bookings page — sets up event listeners, loads data.
 * @param {Object} options
 * @param {HTMLTableBodyElement} options.tbody - #bookings-tbody
 * @param {HTMLElement} options.emptyState - #bookings-empty
 * @param {HTMLElement} options.loadingState - #bookings-loading
 * @param {HTMLDialogElement} options.cancelDialog - #cancel-confirm-dialog
 * @param {Function} options.showMessage - shared toast display
 * @param {Function} options.refreshCalendar - callback to re-render calendar if open
 */
export function initBookings(options);

/**
 * Fetch and render the bookings list.
 * Applies current filters and sort.
 * @param {Object} filters - { status: string|null }
 * @param {string} sortBy - sort key
 */
export function renderBookings(filters, sortBy);

/**
 * Render bookings table rows from data array.
 * Shows loading skeleton first, then rows or empty state.
 * @param {Array} bookings - Booking objects from API
 * @param {Object} rooms - Room lookup map (id → room_number)
 */
export function renderBookingsTable(bookings, rooms);

/**
 * Open cancel confirmation dialog for a booking.
 * @param {Object} booking - Booking object
 * @param {Object} rooms - Room lookup map
 */
export function openCancelConfirm(booking, rooms);

/**
 * Close cancel confirmation dialog.
 */
export function closeCancelConfirm();

/**
 * Cancel a booking by ID.
 * @param {number} id - Booking ID
 * @returns {Promise<boolean>} success
 */
export function cancelBooking(id);

/**
 * Apply filter and sort, then re-render.
 * @param {string|null} statusFilter
 * @param {string} sortBy
 */
export function applyBookingsFilters(statusFilter, sortBy);

/**
 * Clear all filters and reload.
 */
export function clearBookingsFilters();

/**
 * Bind keyboard: Arrow keys for table navigation, Escape to close dialog.
 */
export function bindBookingsKeyboard();
```

### 7.2 Module: `calendar.js`

```javascript
/**
 * CALENDAR UI MODULE
 * Handles calendar grid rendering, month navigation, room filtering.
 */

/**
 * Initialize the calendar page — sets up event listeners, loads data.
 * @param {Object} options
 * @param {HTMLElement} options.weeksContainer - #calendar-weeks
 * @param {HTMLElement} options.monthLabel - #calendar-month-label
 * @param {HTMLElement} options.roomChipBar - #room-chip-bar
 * @param {Function} options.showMessage - shared toast display
 * @param {Function} options.onDayClick - callback(day, room, available)
 * @param {Function} options.onRoomSelect - callback(roomId)
 */
export function initCalendar(options);

/**
 * Load and render the calendar for a given year/month.
 * @param {number} year
 * @param {number} month (1-12)
 */
export function renderCalendar(year, month);

/**
 * Navigate to the previous month.
 */
export function previousMonth();

/**
 * Navigate to the next month.
 */
export function nextMonth();

/**
 * Navigate to the current month (today).
 */
export function goToToday();

/**
 * Filter calendar by room type.
 * @param {string|null} roomType - 'single' | 'double' | 'four_person' | null
 */
export function filterByRoomType(roomType);

/**
 * Filter calendar by specific room ID.
 * @param {number|null} roomId - room ID or null for all rooms
 */
export function filterByRoomId(roomId);

/**
 * Render a single day cell with room availability dots.
 * @param {Object} dayData - One entry from calendar API response
 * @param {Date} cellDate - The Date object for the cell
 * @param {boolean} isToday - Whether this cell is the current day
 * @param {boolean} isCurrentMonth - Whether this cell is in the current month
 * @returns {HTMLElement} The cell element
 */
export function renderDayCell(dayData, cellDate, isToday, isCurrentMonth);

/**
 * Build the full weeks grid from calendar data.
 * @param {Object} calendarData - Full API response
 * @param {Array} rooms - Room list from /api/rooms/
 * @returns {HTMLElement} The weeks container with all rows
 */
export function buildCalendarGrid(calendarData, rooms);

/**
 * Bind keyboard: Arrow keys for month nav, grid navigation.
 */
export function bindCalendarKeyboard();
```

### 7.3 Module: `booking-flow.js`

```javascript
/**
 * BOOKING FLOW MODULE
 * Handles the booking modal form: validation, submission, success state.
 * Shared by rooms page and calendar page.
 */

/**
 * Initialize the booking modal — sets up event listeners and form behavior.
 * @param {Object} options
 * @param {HTMLDialogElement} options.modal - #booking-modal (refactored to <dialog>)
 * @param {HTMLFormElement} options.form - #booking-form
 * @param {HTMLElement} options.roomLabel - #booking-room-label
 * @param {HTMLElement} options.priceSummary - price summary display
 * @param {HTMLElement} options.errorDisplay - error message area
 * @param {HTMLElement} options.successState - booking success view
 * @param {Function} options.showMessage - shared toast display
 * @param {Function} options.onSuccess - callback after successful booking
 */
export function initBookingFlow(options);

/**
 * Open the booking modal for a specific room.
 * Pre-fills room label and sets date constraints.
 * @param {number} roomId - Room ID
 * @param {string} roomNumber - Room number label (e.g., "101")
 * @param {number} roomCapacity - Max guests
 * @param {number} pricePerNight - Price in SEK
 * @param {string|null} prefillCheckIn - Optional pre-filled check-in date
 * @param {string|null} prefillCheckOut - Optional pre-filled check-out date
 */
export function openBookingModal(roomId, roomNumber, roomCapacity, pricePerNight, prefillCheckIn, prefillCheckOut);

/**
 * Close the booking modal and reset form.
 */
export function closeBookingModal();

/**
 * Validate all form fields. Returns { valid: boolean, errors: Map<field, message> }.
 * @param {HTMLFormElement} form - The booking form element
 * @param {Object} constraints - { minCheckIn: Date, maxGuests: number }
 * @returns {{ valid: boolean, errors: Map<string, string> }}
 */
export function validateBookingForm(form, constraints);

/**
 * Submit the booking form via POST to /api/rooms/{roomId}/book.
 * Shows loading state during submission, success or error state after.
 * @param {HTMLFormElement} form - The booking form element
 * @param {number} roomId - Room ID (from form.dataset.roomId)
 * @returns {Promise<{ success: boolean, data?: Object, error?: string }> }
 */
export function submitBookingForm(form, roomId);

/**
 * Calculate and display the price summary.
 * Updates live on check-in/check-out changes.
 * @param {string} checkIn - ISO date string
 * @param {string} checkOut - ISO date string
 * @param {number} pricePerNight - Price per night in SEK
 * @returns {string|null} Formatted summary or null
 */
export function calculatePriceSummary(checkIn, checkOut, pricePerNight);

/**
 * Check availability for a room and date range via the calendar API.
 * @param {number} roomId - Room ID
 * @param {string} checkIn - ISO date string
 * @param {string} checkOut - ISO date string
 * @returns {Promise<{ available: boolean, conflicts: Array<{ date: string, booking_id: number }> }> }
 */
export function checkAvailability(roomId, checkIn, checkOut);

/**
 * Bind form event listeners: change, blur, validation on dates.
 */
export function bindBookingForm();
```

### 7.4 Integration with Existing `app.js`

The existing `app.js` functions (`showPage`, `openBooking`, `closeBooking`, `submitBooking`, `loadBookings`, `cancelBooking`, `loadMonthCalendar`, `showMessage`) are **retained as entry points** but delegate to the new modules:

| Existing Function | Delegates To | Notes |
|-------------------|-------------|-------|
| `showPage('bookings')` | `initBookings()` in `bookings.js` | Initializes the bookings module on first visit |
| `showPage('calendar')` | `initCalendar()` in `calendar.js` | Initializes the calendar module on first visit |
| `openBooking(roomId, roomNumber)` | `initBookingFlow().openBookingModal()` | Reuses same modal |
| `closeBooking()` | `initBookingFlow().closeBookingModal()` | |
| `submitBooking(e)` | `initBookingFlow().submitBookingForm()` | |
| `loadBookings()` | `initBookings().renderBookings()` | |
| `cancelBooking(id)` | `initBookings().cancelBooking()` | |
| `loadMonthCalendar()` | `initCalendar().renderCalendar()` | |
| `showMessage()` | Replaced by toast system in shared `ui.js` or kept as is | |

---

## 8. EDGE CASES & BOUNDARY CONDITIONS

| Scenario                        | Behavior                                                                 |
|---------------------------------|--------------------------------------------------------------------------|
| No bookings in DB               | Empty state shown immediately (see §1.7)                                 |
| API timeout (> 5s) on bookings  | Error state with retry button                                            |
| API timeout on calendar         | Error state with retry button; shows skeleton grid                       |
| Booking for past date           | Client-side validation blocks (check-in must be ≥ today)                 |
| Booking overlapping confirmed   | Server returns 400 → error toast with "Rummet är inte tillgängligt"      |
| Booking for 1 night             | Allowed (check-out = check-in + 1 day minimum)                           |
| Booking for > 30 nights         | Client-side validation blocks (max 30 nights)                            |
| Modal open when navigating away | Modal closes automatically (page hidden via `showPage`)                  |
| Room selected for booking but room no longer exists | Error toast: "Rummet finns inte"                            |
| All rooms booked for a day      | Calendar shows all red dots; tooltip says "Alla rum bokade"              |
| User opens booking modal without room selected | Shows generic "Boka rum" title; user must select room first |
| Mobile: narrow screen booking modal | Full-screen, single-column form fields                             |
| Cancel confirmed booking        | Updates status to "cancelled"; calendar refreshes automatically          |
| Calendar month with no bookings | All green dots; "Alla rum lediga" summary tooltip                       |
| Browser with no <dialog> support | Fallback to fixed-position div with `.hidden` class (existing pattern) |

---

## 9. DATA MODEL REFERENCE

### 9.1 Booking API Response (GET /api/bookings/)

```json
{
  "id": 3,
  "guest_name": "Anna Lindqvist",
  "guest_email": "anna@example.com",
  "room_id": 1,
  "check_in": "2025-08-01",
  "check_out": "2025-08-05",
  "total_price": 3200,
  "status": "confirmed"
}
```

### 9.2 Room API Response (GET /api/rooms/)

```json
{
  "id": 1,
  "room_number": "101",
  "room_type": "single",
  "capacity": 1,
  "price_per_night": 800,
  "sea_view": true,
  "description": ""
}
```

### 9.3 Calendar API Response (GET /api/calendar/2025/7)

See §5.1 for full schema.

### 9.4 Room Booking (POST /api/rooms/{id}/book)

Request body:
```json
{
  "guest_name": "Anna Lindqvist",
  "guest_email": "anna@example.com",
  "guest_phone": "+46701234567",
  "check_in": "2025-08-01",
  "check_out": "2025-08-05"
}
```

Response (201):
```json
{
  "id": 42,
  "guest_name": "Anna Lindqvist",
  "guest_email": "anna@example.com",
  "room_id": 1,
  "check_in": "2025-08-01",
  "check_out": "2025-08-05",
  "total_price": 3200,
  "status": "confirmed"
}
```

### 9.5 Cancel Booking (PUT /api/bookings/{id}/cancel)

Response (200):
```json
{
  "status": "cancelled"
}
```

---

## 10. NEW FILES TO CREATE

| File                                  | Purpose                                           |
|---------------------------------------|---------------------------------------------------|
| `static/js/bookings.js`               | Bookings table rendering, filtering, sorting, cancel flow |
| `static/js/calendar.js`               | Calendar grid rendering, month nav, room filtering |
| `static/js/booking-flow.js`           | Booking modal form, validation, submission, price calculation |
| `static/js/ui.js`                     | Shared utilities: toast notifications, date helpers, availability check |
| `BOOKING-CALENDAR-DESIGN.md` (this file) | Design specification                          |

---

## 11. COORDINATION WITH OTHER TASKS

### 11.1 With T1 (Design System)

- This spec uses CSS custom property placeholders that map to T1's canonical tokens
- Color tokens for room types (single/double/four_person) are shared with ROOMS-PAGE-DESIGN.md
- Spacing, border-radius, and shadow tokens are identical to those defined in T2
- **Do not define new color tokens** — extend the T1 mapping table

### 11.2 With T2 (Rooms Page)

- Booking modal is shared: same `<dialog>` element, same `booking-flow.js` module
- "Boka nu" button on room cards and in room detail modal both call `openBookingModal()` from the booking flow module
- Room type colors are consistent: single=`#0ea5e9`, double=`#8b5cf6`, four_person=`#f59e0b`
- Calendar page is accessible from the rooms page navigation (already in `index.html`)
- Room detail modal (T2) can include a "Visa tillgänglighet" link that navigates to the calendar page with the room pre-selected

### 11.3 Shared State

The following state should be shared across modules via a central store or event system:

```javascript
// Central state object (suggestion)
const AppState = {
  currentMonth: { year: 2025, month: 7 },
  selectedRoomId: null,
  selectedRoomType: null,
  bookingsFilters: { status: null },
  bookingsSort: 'date-desc',
  rooms: [],  // cached from /api/rooms/
  bookings: [],  // cached from /api/bookings/
};
```

---

## 12. SUCCESS METRICS / VERIFICATION

After implementation, verify:

1. **Bookings table** loads from API and displays all columns correctly
2. **Status badges** render with correct colors and dot indicators
3. **Sorting** works on all sortable columns (visual indicator shows direction)
4. **Filtering** by status works; empty state shows when no results
5. **Cancel flow** opens dialog, confirms, updates status, and refreshes table
6. **Calendar grid** renders all days of the month with correct room availability
7. **Month navigation** works; today is highlighted
8. **Room filtering** in calendar toggles between all-rooms and single-room views
9. **Booking modal** opens from any entry point with correct pre-fill
10. **Form validation** blocks invalid submissions with clear error messages
11. **Price summary** updates live on date changes
12. **Success state** shows booking reference after confirmation
13. **Calendar auto-refreshes** after a successful booking
14. **Toasts** appear for success/error/info and auto-dismiss
15. **Keyboard navigation** works for all interactive elements
16. **Responsive layout** works on mobile (≤ 639px), tablet (768px), and desktop (≥ 1024px)
