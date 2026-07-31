# ROOMS PAGE DESIGN SPECIFICATION

**Project:** Sea View Hotel — Hotel Booking System
**Component:** Rooms Listing + Detail View
**Status:** Design Specification (read-only — no code written)
**Date:** 2025-07-27

---

## 0. DESIGN SYSTEM TOKEN ALIGNMENT

This spec uses placeholder CSS custom properties. **T1 (Design System) will define the canonical tokens.** Map the following:

| Placeholder Token      | Purpose                          | Suggested T1 Token Name        |
|------------------------|----------------------------------|--------------------------------|
| `--color-primary`      | Brand ocean blue                 | `--color-brand-primary`        |
| `--color-primary-hover`| Hover state                      | `--color-brand-primary-hover`  |
| `--color-success`      | Green accents (price)            | `--color-status-success`       |
| `--color-text-heading` | Dark headings                    | `--color-text-heading`         |
| `--color-text-muted`   | Secondary text                   | `--color-text-muted`           |
| `--color-bg-surface`   | Card / panel backgrounds         | `--color-bg-surface`           |
| `--color-bg-page`      | Page background                  | `--color-bg-page`              |
| `--color-border`       | Subtle borders                   | `--color-border`               |
| `--radius-md`          | Card / input border-radius       | `--radius-md`                  |
| `--radius-sm`          | Badge / small element radius     | `--radius-sm`                  |
| `--shadow-card`        | Card elevation                   | `--shadow-card`                |
| `--shadow-elevated`    | Hover / modal elevation          | `--shadow-elevated`            |
| `--font-sans`          | System font stack                | `--font-sans`                  |
| `--spacing-xs`         | 0.25rem                          | `--spacing-xxs` or `--spacing-xs` |
| `--spacing-sm`         | 0.5rem                           | `--spacing-xs`                 |
| `--spacing-md`         | 1rem                             | `--spacing-sm`                 |
| `--spacing-lg`         | 1.5rem                           | `--spacing-md`                 |
| `--spacing-xl`         | 2rem                             | `--spacing-lg`                 |
| `--transition-fast`    | 200ms ease                       | `--transition-fast`            |
| `--transition-normal`  | 300ms ease                       | `--transition-normal`          |

---

## 1. LAYOUT & INFORMATION ARCHITECTURE

### 1.1 Page Structure (Wireframe)

```
┌─────────────────────────────────────────────────────────┐
│  HEADER — Hero Section (full-width)                     │
│  🌊 Sea View Hotel — Våra Rum                           │
│  "20 rum med havsvy — Välj ditt drömrum"               │
├─────────────────────────────────────────────────────────┤
│  FILTER & SORT BAR (sticky on scroll)                   │
│  [Type▼] [Capacity▼] [Price▼] [Sort▼] [↻ Rensa]       │
│  "Visar 8 rum" (result count)                           │
├─────────────────────────────────────────────────────────┤
│  ROOMS GRID (responsive)                                │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│  │ Room    │ │ Room    │ │ Room    │ │ Room    │      │
│  │ Card 1  │ │ Card 2  │ │ Card 3  │ │ Card 4  │      │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│  │ Room 5  │ │ Room 6  │ │ Room 7  │ │ Room 8  │      │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘      │
├─────────────────────────────────────────────────────────┤
│  FOOTER                                                 │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Semantic HTML Structure

```html
<page id="page-rooms" class="rooms-page">

  <section class="rooms-hero">
    <h1>Våra Rum</h1>
    <p class="rooms-hero__subtitle">
      20 rum med havsvy — Välj ditt drömrum
    </p>
  </section>

  <aside class="filter-bar" role="search" aria-label="Rumfilter">
    <div class="filter-group">
      <label for="filter-type">Rumtyp</label>
      <select id="filter-type" class="filter-select">
        <option value="">Alla rumtyper</option>
        <option value="single">Enkel</option>
        <option value="double">Dubbel</option>
        <option value="four_person">Fyrasäng</option>
      </select>
    </div>

    <div class="filter-group">
      <label for="filter-capacity">Gäster</label>
      <select id="filter-capacity" class="filter-select">
        <option value="">Alla</option>
        <option value="1">1 person</option>
        <option value="2">2 personer</option>
        <option value="4">4 personer</option>
      </select>
    </div>

    <div class="filter-group">
      <label for="filter-price">Pris (kr/natt)</label>
      <select id="filter-price" class="filter-select">
        <option value="">Alla priser</option>
        <option value="0-900">Under 900 kr</option>
        <option value="900-1500">900–1 500 kr</option>
        <option value="1500-99999">Över 1 500 kr</option>
      </select>
    </div>

    <div class="filter-group">
      <label for="sort-by">Sortera</label>
      <select id="sort-by" class="filter-select">
        <option value="price-asc">Pris — lägst först</option>
        <option value="price-desc">Pris — högst först</option>
        <option value="capacity-desc">Gäster — mest först</option>
        <option value="room-number">Rumsnummer</option>
      </select>
    </div>

    <div class="filter-group filter-actions">
      <button type="button" class="btn btn-ghost" id="clear-filters" aria-label="Rensa alla filter">
        ↻ Rensa
      </button>
      <span class="filter-count" id="room-count" aria-live="polite"></span>
    </div>
  </aside>

  <div id="rooms-container" role="region" aria-label="Rum">
    <!-- LOADING STATE: skeleton cards -->
    <!-- ROOM GRID: populated by JS -->
    <!-- EMPTY STATE: shown when no rooms match -->
  </div>

  <!-- ROOM DETAIL MODAL (overlay) -->
  <dialog id="room-detail-dialog" class="room-detail-modal" aria-labelledby="detail-title">
    <!-- See Section 3 -->
  </dialog>

</page>
```

### 1.3 Responsive Breakpoints

| Breakpoint       | Screen Width     | Layout Behavior                                    |
|------------------|------------------|-----------------------------------------------------|
| `sm`             | ≥ 640px          | 2-column grid, filter bar single row                |
| `md`             | ≥ 768px          | 3-column grid, filter bar wraps gracefully          |
| `lg`             | ≥ 1024px         | 4-column grid, full filter bar horizontal            |
| `xl`             | ≥ 1280px         | Max-width container (1280px), 4 columns maintained  |

- Mobile (`< 640px`): 1-column grid, filter bar becomes a horizontal scroll row (overflow-x)
- Detail modal: full-screen on mobile, centered card on desktop

---

## 2. ROOM CARD DESIGN (VISUAL SPEC)

### 2.1 Card Wireframe

```
┌──────────────────────────────────────┐
│  ┌────────────────────────────────┐  │
│  │                                │  │
│  │     🌊 Gradient Image BG       │  │  ← 200px height (md/lg), 180px (sm/mobile)
│  │                                │  │
│  │                                │  │
│  │                                │  │
│  │  [🏖 Havsvy]    [# 101]       │  │  ← Floating badges, top-right
│  │                                │  │
│  └────────────────────────────────┘  │
│                                      │
│  Room 101                            │  ← 1.1rem, --color-text-heading
│  Enkel  ·  👤 1 person               │  ← 0.9rem, --color-text-muted
│                                      │
│  800 kr / natt                       │  ← 1.4rem bold, --color-success
│                                      │
│  ┌────────────────────────────────┐  │
│  │       [ Boka nu ]              │  │  ← Full-width, --color-primary
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

### 2.2 Card Component CSS Spec

```css
.room-card {
  background: var(--color-bg-surface);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  cursor: pointer;
}

.room-card:hover,
.room-card:focus-visible {
  transform: translateY(-4px);
  box-shadow: var(--shadow-elevated);
}

/* --- Image Area --- */
.room-card__image {
  width: 100%;
  height: 200px;            /* 180px on sm breakpoint */
  background: linear-gradient(135deg, #bae6fd 0%, #7dd3fc 50%, #38bdf8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.room-card__image-icon {
  font-size: 3rem;
  opacity: 0.6;
}

/* Floating Badges (absolute positioned on image) */
.room-card__badge {
  position: absolute;
  top: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
}

.room-card__badge--sea-view {
  right: var(--spacing-sm);
  background: rgba(255, 255, 255, 0.95);
  color: #1d4ed8;
  backdrop-filter: blur(4px);
}

.room-card__badge--room-number {
  left: var(--spacing-sm);
  background: rgba(12, 74, 110, 0.9);
  color: white;
  backdrop-filter: blur(4px);
}

/* --- Info Area --- */
.room-card__info {
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  flex: 1;
}

.room-card__title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text-heading);
  margin: 0;
}

.room-card__meta {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.room-card__price {
  font-size: 1.4rem;
  font-weight: 700;
  color: #059669;  /* or --color-success */
}

.room-card__price-unit {
  font-size: 0.85rem;
  font-weight: 400;
  color: var(--color-text-muted);
}

/* --- CTA Button --- */
.room-card__cta {
  display: block;
  width: 100%;
  padding: 0.7rem 1.5rem;
  margin-top: var(--spacing-sm);
  border: none;
  border-radius: var(--radius-sm);
  background: var(--color-primary);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background var(--transition-fast);
  text-align: center;
}

.room-card__cta:hover {
  background: var(--color-primary-hover);
}

/* --- Mobile (sm breakpoint) --- */
@media (max-width: 639px) {
  .room-card__image { height: 160px; }
  .room-card__price { font-size: 1.2rem; }
}

/* --- Grid integration --- */
.rooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

@media (min-width: 640px) {
  .rooms-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 768px) {
  .rooms-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (min-width: 1024px) {
  .rooms-grid { grid-template-columns: repeat(4, 1fr); }
}
```

### 2.3 Hover & Focus States

| State           | Transform          | Shadow               | Notes                          |
|-----------------|--------------------|----------------------|--------------------------------|
| Default         | `none`             | `--shadow-card`      | —                              |
| Hover / Focus   | `translateY(-4px)` | `--shadow-elevated`  | Smooth 200ms transition        |
| Active (click)  | `translateY(-2px)` | `--shadow-card`      | Brief press state              |

### 2.4 Room Type Color Coding

Suggest subtle accent colors on the card image bar or badge to distinguish room types:

| Room Type      | Color     | Label (sv) |
|----------------|-----------|------------|
| `single`       | `#0ea5e9` | Enkel      |
| `double`       | `#8b5cf6` | Dubbel     |
| `four_person`  | `#f59e0b` | Fyrasäng   |

These can be applied as a thin colored top-border on the card (4px) or as a tint overlay on the image area.

### 2.5 Mobile Responsive Behavior

- **Grid:** collapses from 4 → 3 → 2 → 1 column
- **Image:** height reduces from 200px → 180px → 160px
- **Filter bar:** becomes horizontally scrollable (`overflow-x: auto`) with `white-space: nowrap`
- **Card:** full-width on mobile, tap targets ≥ 44px for CTA
- **Modal:** full-screen overlay on mobile (`100vw × 100vh`)

---

## 3. ROOM DETAIL VIEW (MODAL)

### 3.1 Architecture Decision: Modal vs. Separate Page

**Decision: Use a modal (`<dialog>` element) for detail view.**

Rationale:
- Single-page app already uses modal pattern for booking form
- Keeps users in context without navigation
- Faster interaction loop (click room → see details → book)
- `<dialog>` provides native accessibility (focus trap, Escape to close)
- For future extensibility, a separate page route can be added without redesign

### 3.2 Detail Modal Wireframe

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │ ┌───────────────────────────────────────────────┐ │  │
│  │ │                                               │ │  │
│  │ │  🌊 Full-width Image (600px max)              │ │  │
│  │ │  [ ← ] [  ● ○ ○ ] [ → ]   ← Gallery nav      │ │  │
│  │ │                                               │ │  │
│  │ └───────────────────────────────────────────────┘ │  │
│  │                                                   │ │  │
│  │  Room 101                     [ ✕ Close ]        │  │
│  │  Enkel  ·  👤 1 person  ·  🛏 1 bädd               │  │
│  │                                                   │  │
│  │  Havsvy  ·  800 kr / natt                         │  │
│  │                                                   │  │
│  │  ── Beskrivning ───────────────────────────────  │  │
│  │  [description text or "Ingen beskrivning"]        │  │
│  │                                                   │  │
│  │  ── Utrustning ────────────────────────────────  │  │
│  │  ☑ Havsvy   ☑ WiFi   ☑ TV   ☑ Minikök           │  │
│  │  ☑ Luftkonditionering                            │  │
│  │                                                   │  │
│  │  ── Tillgängliga datum ───────────────────────── │  │
│  │  [Mini-calendar placeholder or "Kontrollera..."] │  │
│  │                                                   │  │
│  │  ┌─────────────────────────────────────────────┐ │  │
│  │  │            [ Boka Room 101 ]                │ │  │
│  │  └─────────────────────────────────────────────┘ │  │
│  │                                                   │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 3.3 Detail Modal CSS Spec

```css
.room-detail-modal {
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: var(--radius-md);
  background: var(--color-bg-surface);
  box-shadow: var(--shadow-elevated);
  padding: 0;
}

.room-detail-modal::backdrop {
  background: rgba(0, 0, 0, 0.5);
}

/* Mobile: full screen */
@media (max-width: 639px) {
  .room-detail-modal {
    width: 100%;
    max-width: none;
    max-height: 100vh;
    border-radius: 0;
    height: 100vh;
  }
}

.room-detail__image {
  width: 100%;
  height: 250px;
  background: linear-gradient(135deg, #bae6fd 0%, #7dd3fc 50%, #38bdf8 100%);
  position: relative;
}

.room-detail__image-nav {
  position: absolute;
  bottom: var(--spacing-sm);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.room-detail__content {
  padding: var(--spacing-lg);
}

.room-detail__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-sm);
}

.room-detail__close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--color-text-muted);
  padding: 0.25rem;
  line-height: 1;
}

.room-detail__close:hover {
  color: var(--color-text-heading);
}

.room-detail__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
  font-size: 0.95rem;
  color: var(--color-text-muted);
}

.room-detail__price {
  font-size: 1.6rem;
  font-weight: 700;
  color: #059669;
  margin-bottom: var(--spacing-md);
}

.room-detail__section {
  margin-bottom: var(--spacing-lg);
}

.room-detail__section-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text-heading);
  margin-bottom: var(--spacing-sm);
  padding-bottom: var(--spacing-xs);
  border-bottom: 2px solid var(--color-primary);
  display: inline-block;
}

/* Amenities grid */
.room-detail__amenities {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-sm);
}

.room-detail__amenity {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 0.9rem;
  color: var(--color-text-heading);
}

/* Booking CTA */
.room-detail__cta {
  display: block;
  width: 100%;
  padding: 0.85rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background var(--transition-fast);
  margin-top: var(--spacing-lg);
}

.room-detail__cta:hover {
  background: var(--color-primary-hover);
}
```

### 3.4 Amenities List (Standardized)

Since the API doesn't return amenities, define a fixed set:

```javascript
const AMENITIES = {
  single:   ['Havsvy', 'WiFi', 'TV', 'Minikök', 'Luftkonditionering'],
  double:   ['Havsvy', 'WiFi', 'TV', 'Minikök', 'Luftkonditionering', 'Skrivbord'],
  four_person: ['Havsvy', 'WiFi', 'TV', 'Minikök', 'Luftkonditionering', 'Skrivbord', 'Extra badrum'],
};
```

---

## 4. FILTER BAR DESIGN

### 4.1 Filter Bar Wireframe

```
┌──────────────────────────────────────────────────────────────────────┐
│  [Alla rumtyper ▼]  [Alla ▼]  [Alla priser ▼]  [Pris ↑ ▼]    ↻ Rensa │
│                                            Visar 8 rum            │
└──────────────────────────────────────────────────────────────────────┘
```

### 4.2 Filter Components

#### Filter Group (Generic)
```css
.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 160px;
}

.filter-group label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.filter-select {
  padding: 0.6rem 2rem 0.6rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg-surface);
  font-size: 0.95rem;
  color: var(--color-text-heading);
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,...");  /* custom chevron */
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  transition: border-color var(--transition-fast);
}

.filter-select:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(3, 105, 161, 0.15);
}

/* Active filter state */
.filter-select[data-active="true"] {
  border-color: var(--color-primary);
  background-color: rgba(3, 105, 161, 0.04);
  font-weight: 600;
}
```

#### Clear Filters Button
```css
.btn-ghost {
  padding: 0.6rem 1rem;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  align-self: flex-end;
}

.btn-ghost:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: rgba(3, 105, 161, 0.05);
}

/* Active filter count badge */
.filter-count {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  padding: 0.6rem 0;
}

.filter-count strong {
  color: var(--color-text-heading);
}
```

### 4.3 Active Filter Indicators

- **Dropdown:** When a filter is active (non-empty value), add `data-active="true"` attribute → blue border + slight background tint
- **Visual feedback:** Show a pill/chip below the filter bar for each active filter that can be individually dismissed

```
Active filters:  [Enkel ✕]  [Under 900 kr ✕]
```

### 4.4 Filter Bar CSS Spec

```css
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  align-items: flex-end;
  padding: var(--spacing-md);
  background: var(--color-bg-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  margin-bottom: var(--spacing-lg);
  position: sticky;
  top: 0;
  z-index: 10;
}

@media (max-width: 639px) {
  .filter-bar {
    overflow-x: auto;
    flex-wrap: nowrap;
    white-space: nowrap;
    padding-bottom: 0.75rem;
  }
  .filter-group {
    min-width: 140px;
  }
}
```

---

## 5. INTERACTION DESIGN

### 5.1 Loading State (Skeleton Cards)

```css
/* Skeleton card animation */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton-card {
  background: var(--color-bg-surface);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-card);
}

.skeleton-card__image {
  width: 100%;
  height: 200px;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-card__body {
  padding: var(--spacing-md);
}

.skeleton-card__line {
  height: 1rem;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-sm);
}

.skeleton-card__line--short { width: 60%; }
.skeleton-card__line--price { height: 1.4rem; width: 40%; }
```

**Behavior:** Show 4–8 skeleton cards (matching the grid layout) while rooms are being fetched. Replace with actual cards on success or show error state on failure.

### 5.2 Empty State

```
┌──────────────────────────────────────┐
│                                      │
│         🏜                           │
│      (empty state icon)              │
│                                      │
│      Inga rum matchar dina filter    │
│      Försök att ändra sökningen.     │
│                                      │
│      [ ↻ Rensa alla filter ]         │
│                                      │
└──────────────────────────────────────┘
```

**Behavior:** Displayed when filtered results = 0 rooms. Show centered in the grid area with a "Rensa filter" button.

### 5.3 Error State

```
┌──────────────────────────────────────┐
│                                      │
│         ⚠️                           │
│      Kunde inte ladda rum            │
│      Kontrollera nätverket och       │
│      försök igen.                    │
│                                      │
│      [ ↻ Försök igen ]               │
│                                      │
└──────────────────────────────────────┘
```

**Behavior:** Displayed on API failure. Shows error icon, Swedish message, and retry button.

### 5.4 Transition Animations

| Transition                    | Duration | Easing        |
|-------------------------------|----------|---------------|
| Card hover lift               | 200ms    | ease          |
| Card appearance (fade-in)     | 300ms    | ease-out      |
| Modal open (scale + fade)     | 250ms    | ease-out      |
| Modal close (scale + fade)    | 200ms    | ease-in       |
| Filter bar sticky appearance  | 150ms    | ease          |
| Skeleton shimmer              | 1.5s     | linear (loop) |
| Room count update             | 100ms    | ease          |

**Card stagger animation:** When rooms load, each card fades in with a 60ms stagger (card 1 → 0ms, card 2 → 60ms, card 3 → 120ms, etc.) for a cascading reveal effect.

---

## 6. CSS COMPONENT SPECS (Design Token Summary)

### 6.1 Component Classes Reference

| Component                | Class(es)                            |
|--------------------------|--------------------------------------|
| Page wrapper             | `.rooms-page`                        |
| Hero section             | `.rooms-hero`, `.rooms-hero__subtitle`|
| Filter bar               | `.filter-bar`                        |
| Filter group             | `.filter-group`                      |
| Filter select            | `.filter-select`                     |
| Filter select (active)   | `.filter-select[data-active="true"]` |
| Clear button             | `.btn-ghost`                         |
| Result count             | `.filter-count`                      |
| Room grid                | `.rooms-grid`                        |
| Room card                | `.room-card`                         |
| Card image               | `.room-card__image`                  |
| Card badges              | `.room-card__badge`, `--sea-view`, `--room-number` |
| Card info                | `.room-card__info`                   |
| Card title               | `.room-card__title`                  |
| Card meta                | `.room-card__meta`                   |
| Card price               | `.room-card__price`, `--price-unit`  |
| Card CTA                 | `.room-card__cta`                    |
| Detail modal             | `.room-detail-modal`                 |
| Modal image              | `.room-detail__image`                |
| Modal content            | `.room-detail__content`              |
| Modal section            | `.room-detail__section`              |
| Modal amenities          | `.room-detail__amenities`, `--amenity` |
| Modal CTA                | `.room-detail__cta`                  |
| Skeleton card            | `.skeleton-card`, `--image`, `--body`, `--line` |

### 6.2 Spacing Scale (rem)

| Token           | Value  |
|-----------------|--------|
| `--spacing-xs`  | 0.25   |
| `--spacing-sm`  | 0.5    |
| `--spacing-md`  | 1      |
| `--spacing-lg`  | 1.5    |
| `--spacing-xl`  | 2      |
| `--spacing-2xl` | 3      |

### 6.3 Border Radius Scale

| Token            | Value  |
|------------------|--------|
| `--radius-sm`    | 0.5rem (8px) |
| `--radius-md`    | 0.75rem (12px) |
| `--radius-full`  | 9999px (pill) |

---

## 7. JS MODULE INTERFACE

### 7.1 Module: `rooms-ui.js`

Exported functions and their responsibilities:

```javascript
/**
 * ROOMS UI MODULE
 * Handles rooms listing, filtering, sorting, and detail modal.
 * Depends on: app.js (showPage), or be integrated into it.
 */

/**
 * Initialize the rooms page — sets up event listeners and renders.
 * @param {Object} options
 * @param {HTMLDivElement} options.gridContainer - #rooms-grid or #rooms-container
 * @param {Object} options.apis - API endpoint URLs
 * @param {Function} options.onBook - callback to open booking modal with room id
 * @param {Function} options.showMessage - shared message display function
 */
export function initRooms(options);

/**
 * Render a grid of room cards from room data array.
 * Handles loading/empty/error states.
 * @param {Array} rooms - Room objects from API
 * @param {Object} filters - Current filter state
 */
export function renderRooms(rooms, filters);

/**
 * Open the room detail modal for a specific room.
 * @param {Object} room - Full room object
 */
export function openRoomDetail(room);

/**
 * Close the room detail modal.
 */
export function closeRoomDetail();

/**
 * Apply filters and sorting, then re-render.
 * Called on filter/sort change events.
 * @param {Object} filters - { type, capacity, priceRange }
 * @param {string} sortBy - Sort key
 */
export function applyFilters(filters, sortBy);

/**
 * Reset all filters and reload all rooms.
 */
export function clearFilters();

/**
 * Handle keyboard: Escape to close modal, Enter to open detail.
 */
export function bindKeyboard();
```

### 7.2 Data Flow

```
User clicks nav "Rum"
  → showPage('rooms') [app.js]
  → initRooms() [rooms-ui.js]
  → fetch('/api/rooms/')
  → renderRooms(rooms)
    → renderSkeleton() while loading
    → renderCards(rooms) on success
    → renderEmptyState() if 0 results
    → renderErrorState() on failure

User changes filter
  → applyFilters(filters, sortBy)
  → filter rooms in-memory
  → renderRooms(filteredRooms)

User clicks room card
  → openRoomDetail(room)
    → populate modal DOM
    → dialog.showModal()

User clicks "Boka nu" (card or modal)
  → closeRoomDetail()
  → onBook(roomId, roomNumber)
    → openBooking() [existing app.js modal]
```

### 7.3 Integration Notes

- **Existing `loadRooms()` in app.js (line 28–52):** The new `renderRooms()` replaces the inline template literals in `loadRooms()`. The `loadRooms()` function should be refactored to call the module functions.
- **Existing booking modal:** The detail modal is separate from the existing booking modal. Clicking "Boka nu" from either the card or the detail modal should close the detail modal (if open) and open the existing booking modal with the room ID.
- **No API changes required:** All data comes from existing endpoints.
- **Amenities:** Hardcoded in JS (see Section 3.4) since the API doesn't expose them yet.

---

## 8. ACCESSIBILITY REQUIREMENTS

| Requirement                    | Implementation                                |
|--------------------------------|-----------------------------------------------|
| Semantic HTML                  | `<section>`, `<aside>`, `<dialog>`, `<main>`  |
| ARIA live regions              | `aria-live="polite"` on room count            |
| Keyboard navigation            | Tab through cards, Enter to open detail       |
| Escape to close                | `<dialog>` native + manual ESC handler        |
| Focus management               | Focus trapped in modal; restored on close     |
| Color contrast                 | All text ≥ 4.5:1 (WCAG AA)                   |
| Screen reader labels           | `aria-label` on filter bar and CTA buttons    |
| Reduced motion                 | Respect `prefers-reduced-motion` — disable animations |
| Form labels                    | Explicit `<label>` elements for all filters   |
| Focus indicators               | Visible `:focus-visible` ring on all interactive elements |

---

## 9. EDGE CASES & BOUNDARY CONDITIONS

| Scenario                     | Behavior                                       |
|------------------------------|-------------------------------------------------|
| 0 rooms in DB               | Empty state shown immediately                  |
| All rooms booked              | Cards still shown; "Boka nu" disabled with tooltip |
| API timeout (> 5s)           | Error state with retry button                   |
| API returns empty array      | Same as 0 rooms — empty state                  |
| Window resize during load    | Grid reflows on next render; no mid-flight change |
| Detail modal opened on mobile| Full-screen overlay, no backdrop (native `<dialog>`) |
| User navigates away while modal open | Modal closes automatically (page hidden) |
| Same room clicked twice      | No-op if modal already open for that room      |

---

## 10. EXISTING CODE DEPENDENCIES

### 10.1 Files to Modify (Future Implementation)

| File                              | Change Required                              |
|-----------------------------------|-----------------------------------------------|
| `templates/index.html`            | Restructure `#page-rooms` section; add detail `<dialog>` |
| `static/js/app.js`                | Refactor `loadRooms()`; integrate `rooms-ui.js` module |
| `static/css/style.css`            | Add new component styles; migrate to CSS custom properties |

### 10.2 Files to Keep Unchanged

| File                              | Reason                                        |
|-----------------------------------|-----------------------------------------------|
| `app/routers/rooms.py`            | API is sufficient; no changes needed           |
| `app/models/room.py`              | Room model is complete                        |
| `app/models/booking.py`           | Booking flow unchanged                        |

### 10.3 New Files to Create

| File                              | Purpose                                       |
|-----------------------------------|-----------------------------------------------|
| `static/js/rooms-ui.js`           | New module: render/filter/sort/detail logic    |
| `ROOMS-PAGE-DESIGN.md` (this file)| Design specification                           |

---

## 11. ROOM DATA REFERENCE

Current database contents (20 rooms, all sea_view=true):

**Single (6 rooms):** 101 (800kr), 102 (850kr), 201 (900kr), 202 (900kr), 301 (950kr), 302 (950kr)
**Double (8 rooms):** 110 (1200kr), 111 (1250kr), 210 (1300kr), 211 (1300kr), 212 (1350kr), 310 (1400kr), 311 (1400kr), 312 (1400kr)
**Four-person (6 rooms):** 120 (1800kr), 121 (1800kr), 220 (1900kr), 221 (1900kr), 320 (2000kr), 321 (2200kr)

**Price range:** 800–2200 kr/night
**Floors:** 1 (rooms 1xx), 2 (rooms 2xx), 3 (rooms 3xx)

---

## 12. SUMMARY OF DESIGN DECISIONS

1. **Detail view as modal** — Uses native `<dialog>`, consistent with existing booking modal pattern, keeps SPA flow
2. **Filter in-memory** — 20 rooms is small enough to filter/sort client-side after initial fetch; no server-side pagination needed
3. **Skeleton loading** — Provides visual feedback during API call, matches modern UX expectations
4. **Hardcoded amenities** — API doesn't expose amenities yet; fixed sets per room type cover current needs
5. **Sticky filter bar** — Improves UX on longer lists; becomes scrollable on mobile
6. **CSS custom properties throughout** — Ready for T1's design system tokens; one mapping layer

---

*End of specification.*
