# Sea View Hotel — Design System

> A complete design system and component library for the Sea View Hotel booking frontend.
> Stack: Vanilla HTML / CSS / JS — no frameworks. Mobile-first responsive. Themed with CSS custom properties.

---

## Table of Contents

1. [Color Palette](#1-color-palette)
2. [Typography Scale](#2-typography-scale)
3. [Spacing Scale](#3-spacing-scale)
4. [Border Radius Scale](#4-border-radius-scale)
5. [Shadow Scale](#5-shadow-scale)
6. [Responsive Breakpoints](#6-responsive-breakpoints)
7. [Animation / Transition Spec](#7-animation--transition-spec)
8. [Component Specifications](#8-component-specifications)

---

## 1. Color Palette

All colors are exposed as CSS custom properties under `:root`. Light-mode is primary; a `[data-theme="dark"]` override block is defined at the end.

### Light Mode — Primary Tokens

```css
/* --- Ocean Primary --- */
--color-primary-50:    #e0f2fe;   /* 5% — tint for subtle backgrounds */
--color-primary-100:   #bae6fd;   /* 10% — hero gradient start */
--color-primary-200:   #7dd3fc;   /* 20% — image placeholder */
--color-primary-300:   #38bdf8;   /* 30% — accent borders */
--color-primary-400:   #0ea5e9;   /* 40% — hover states */
--color-primary-500:   #0284c7;   /* 50% — primary button default */
--color-primary-600:   #0369a1;   /* 60% — nav bg, headings (existing) */
--color-primary-700:   #075985;   /* 70% — primary button hover */
--color-primary-800:   #0c4a6e;   /* 80% — deep navy, page titles */
--color-primary-900:   #082f49;   /* 90% — dark text fallback */

/* --- Sand / Beige Secondary --- */
--color-secondary-50:   #fdf8f0;   /* 5%  — warm page background */
--color-secondary-100:  #f5ead6;   /* 10% — subtle borders, card accents */
--color-secondary-200:  #e6d5b8;   /* 20% — divider lines */
--color-secondary-300:  #d4be96;   /* 30% — muted text */
--color-secondary-400:  #bfa370;   /* 40% — disabled controls */
--color-secondary-500:  #9c7e4a;   /* 50% — secondary text */
--color-secondary-600:  #7a6235;   /* 60% — label text */
--color-secondary-700:  #5c4828;   /* 70% — dark secondary text */
--color-secondary-800:  #43341d;   /* 80% — footer text */
--color-secondary-900:  #2d2413;   /* 90% — darkest sand */

/* --- Accent (Teal / Coastal) --- */
--color-accent-50:    #ecfdf5;
--color-accent-100:   #d1fae5;
--color-accent-200:   #a7f3d0;
--color-accent-300:   #6ee7b7;
--color-accent-400:   #34d399;
--color-accent-500:   #059669;   /* price text green (existing) */
--color-accent-600:   #047857;   /* accent button hover */
--color-accent-700:   #065f46;   /* success body text */
--color-accent-800:   #064e3b;   /* deep accent */
--color-accent-900:   #022c22;

/* --- Neutrals (Slate) --- */
--color-neutral-50:   #f8fafc;
--color-neutral-100:  #f1f5f9;
--color-neutral-200:  #e2e8f0;
--color-neutral-300:  #d1d5db;
--color-neutral-400:  #94a3b8;
--color-neutral-500:  #64748b;
--color-neutral-600:  #475569;
--color-neutral-700:  #334155;
--color-neutral-800:  #1e293b;
--color-neutral-900:  #0f172a;

/* --- Semantic --- */
--color-success:  #059669;   /* accent-500 */
--color-success-bg: #d1fae5; /* accent-100 */
--color-warning:  #d97706;
--color-warning-bg: #fef3c7;
--color-error:    #dc2626;
--color-error-bg: #fee2e2;
--color-info:     #0284c7;
--color-info-bg:  #e0f2fe;

/* --- Surface / Text --- */
--color-surface:     #ffffff;
--color-surface-alt: #f8fafc;
--color-text:        #1e293b;
--color-text-muted:  #64748b;
--color-text-inverse:#ffffff;
--color-border:      #e2e8f0;
--color-border-focus:#0284c7;
--color-overlay:     rgba(8, 47, 73, 0.5);
```

### Dark Mode Override

```css
[data-theme="dark"] {
  --color-primary-50:   #082f49;
  --color-primary-600:  #38bdf8;
  --color-primary-800:  #bae6fd;
  --color-secondary-50:  #2d2413;
  --color-neutral-50:   #1e293b;
  --color-neutral-100:  #334155;
  --color-neutral-900:  #f1f5f9;
  --color-surface:      #0f172a;
  --color-surface-alt:  #1e293b;
  --color-text:         #f1f5f9;
  --color-text-muted:   #94a3b8;
  --color-text-inverse: #0f172a;
  --color-border:       #334155;
}
```

### Semantic Mapping (Usage)

| Semantic Token | Light Value | Dark Value | Usage |
|---|---|---|---|
| `--color-brand` | `--color-primary-600` | `--color-primary-300` | Primary interactive elements |
| `--color-brand-hover` | `--color-primary-700` | `--color-primary-200` | Hover state for brand |
| `--color-surface` | `#ffffff` | `#0f172a` | Card/page backgrounds |
| `--color-text` | `#1e293b` | `#f1f5f9` | Body text |
| `--color-text-muted` | `#64748b` | `#94a3b8` | Secondary text |
| `--color-success` | `#059669` | `#34d399` | Success states |
| `--color-error` | `#dc2626` | `#f87171` | Error states |
| `--color-warning` | `#d97706` | `#fbbf24` | Warning states |

---

## 2. Typography Scale

### Font Families

```css
--font-display: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-body:    'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-mono:    'JetBrains Mono', 'SF Mono', 'Cascadia Code', 'Consolas', monospace;
```

> **Google Fonts preload**: Inter (weights 400, 500, 600, 700) + JetBrains Mono (400, 500).

### Type Scale

```css
/* --- Sizes (rem) --- */
--text-xs:    0.75rem;   /* 12px */
--text-sm:    0.875rem;  /* 14px */
--text-base:  1rem;      /* 16px */
--text-lg:    1.125rem;  /* 18px */
--text-xl:    1.25rem;   /* 20px */
--text-2xl:   1.5rem;    /* 24px */
--text-3xl:   1.875rem;  /* 30px */
--text-4xl:   2.25rem;   /* 36px */
--text-5xl:   3rem;      /* 48px */

/* --- Weights --- */
--font-normal:    400;
--font-medium:    500;
--font-semibold:  600;
--font-bold:      700;

/* --- Line Heights --- */
--leading-tight:    1.25;
--leading-snug:     1.375;
--leading-normal:   1.6;
--leading-relaxed:  1.75;
--leading-loose:    2;

/* --- Heading Presets --- */
--heading-1:  var(--text-4xl) / var(--leading-tight) var(--font-display) var(--font-bold);
--heading-2:  var(--text-3xl) / var(--leading-tight) var(--font-display) var(--font-bold);
--heading-3:  var(--text-2xl) / var(--leading-tight) var(--font-display) var(--font-semibold);
--heading-4:  var(--text-xl)  / var(--leading-tight) var(--font-display) var(--font-semibold);
--heading-5:  var(--text-lg)  / var(--leading-tight) var(--font-display) var(--font-semibold);
--heading-6:  var(--text-base)/ var(--leading-tight) var(--font-display) var(--font-medium);

/* --- Body Presets --- */
--body-lg:    var(--text-lg) / var(--leading-relaxed) var(--font-body) var(--font-normal);
--body-base:  var(--text-base) / var(--leading-normal) var(--font-body) var(--font-normal);
--body-sm:    var(--text-sm) / var(--leading-snug) var(--font-body) var(--font-normal);
--body-xs:    var(--text-xs) / var(--leading-snug) var(--font-body) var(--font-medium);
--body-caption: var(--text-xs) / var(--leading-snug) var(--font-body) var(--font-normal);
--body-label:   var(--text-xs) / var(--leading-tight) var(--font-body) var(--font-semibold);
```

### Semantic Typography Mapping

| Token | CSS | Usage |
|---|---|---|
| `--display-h1` | `--heading-1` | Hero title / page main heading |
| `--display-h2` | `--heading-2` | Section titles (card headers) |
| `--display-h3` | `--heading-3` | Room names, sub-sections |
| `--display-h4` | `--heading-4` | Table column headers |
| `--display-h5` | `--heading-5` | Inline titles |
| `--display-h6` | `--heading-6` | Label groups |
| `--body-lg` | `--body-lg` | Lead paragraphs |
| `--body-base` | `--body-base` | Default body text |
| `--body-sm` | `--body-sm` | Descriptions, captions |
| `--body-xs` | `--body-xs` | Badges, tags, meta text |
| `--body-label` | `--body-label` | Form labels, button text |
| `--mono` | `var(--text-sm) / var(--leading-normal) var(--font-mono) var(--font-normal)` | Code, IDs |

---

## 3. Spacing Scale

Consistent 4px baseline grid. All values in `rem` (assuming 16px base).

```css
--space-0:  0;
--space-0-5: 0.125rem;   /* 2px */
--space-1:  0.25rem;     /* 4px */
--space-2:  0.5rem;      /* 8px */
--space-3:  0.75rem;     /* 12px */
--space-4:  1rem;        /* 16px */
--space-5:  1.25rem;     /* 20px */
--space-6:  1.5rem;      /* 24px */
--space-8:  2rem;        /* 32px */
--space-10: 2.5rem;      /* 40px */
--space-12: 3rem;        /* 48px */
--space-16: 4rem;        /* 64px */
--space-20: 5rem;        /* 80px */
--space-24: 6rem;        /* 96px */
--space-32: 8rem;        /* 128px */
```

### Common Spacing Patterns

| Pattern | Tokens | Usage |
|---|---|---|
| Component padding (sm) | `--space-3` | Small cards, badges |
| Component padding (base) | `--space-4` | Medium cards |
| Component padding (lg) | `--space-6` | Hero, large sections |
| Section gap | `--space-6` | Between sections |
| Card gap | `--space-4` | Grid items inside cards |
| Form field gap | `--space-3` | Between form inputs |
| Button gap | `--space-2` | Between button groups |
| Page margin | `--space-6` | Body top/bottom margin |

---

## 4. Border Radius Scale

```css
--radius-none:    0;
--radius-sm:      0.25rem;   /* 4px  — badge, input */
--radius-md:      0.5rem;    /* 8px  — button, filter */
--radius-lg:      0.75rem;   /* 12px — card, modal */
--radius-xl:      1rem;      /* 16px — large card */
--radius-2xl:     1.5rem;    /* 24px — hero section */
--radius-full:    9999px;    /* pill badges */
```

### Radius Mapping

| Element | Radius |
|---|---|
| Badges, tags, inputs | `--radius-sm` |
| Buttons, filter controls | `--radius-md` |
| Cards, modals, dropdowns | `--radius-lg` |
| Hero section, large containers | `--radius-2xl` |
| Status pills, type labels | `--radius-full` |

---

## 5. Shadow Scale

Elevation tokens for z-depth layering.

```css
--shadow-xs:    0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-sm:    0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
--shadow-md:    0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.04);
--shadow-lg:    0 10px 15px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.04);
--shadow-xl:    0 20px 25px rgba(0, 0, 0, 0.1), 0 8px 10px rgba(0, 0, 0, 0.04);
--shadow-2xl:   0 25px 50px rgba(0, 0, 0, 0.15);
--shadow-inner: inset 0 2px 4px rgba(0, 0, 0, 0.06);
--shadow-focus: 0 0 0 3px rgba(2, 132, 199, 0.4);
```

### Shadow Mapping

| Element | Shadow |
|---|---|
| Card (default) | `--shadow-sm` |
| Card (hover) | `--shadow-md` |
| Modal / overlay | `--shadow-xl` |
| Dropdown / popover | `--shadow-lg` |
| Hero / banner | `--shadow-md` |
| Nav bar | `--shadow-sm` |
| Toast notification | `--shadow-md` |
| Focus ring | `--shadow-focus` |

---

## 6. Responsive Breakpoints

Mobile-first approach. All component styles target mobile first, then expand with `min-width` media queries.

| Breakpoint | Token | Width | Target |
|---|---|---|---|
| Mobile | — | 0–639px | Phones |
| Small (sm) | `@media (min-width: 640px)` | ≥640px | Large phones / phablets |
| Medium (md) | `@media (min-width: 768px)` | ≥768px | Tablets portrait |
| Large (lg) | `@media (min-width: 1024px)` | ≥1024px | Tablets landscape / small desktops |
| Extra large (xl) | `@media (min-width: 1280px)` | ≥1280px | Desktops |
| Extra extra large (2xl) | `@media (min-width: 1536px)` | ≥1536px | Wide screens |

### Key Responsive Behaviors

- **Navigation**: Stacks vertically on mobile (`flex-direction: column`), horizontal on `≥768px`
- **Room grid**: 1 column mobile → 2 columns at `≥768px` → 3 columns at `≥1024px`
- **Filter bar**: Stacks vertically on mobile, horizontal row on `≥640px`
- **Form fields**: 1 column on mobile → 2 columns on `≥768px`
- **Table**: Horizontally scrollable wrapper on mobile, full width on `≥768px`
- **Calendar**: 1 day card per column on mobile → auto-fill at `≥768px`
- **Hero**: Reduced padding and font size on mobile

---

## 7. Animation / Transition Spec

All transitions use `ease-out` or `ease-in-out` timing for smooth, natural feel. No jarring linear transitions.

### Standard Transitions

```css
--transition-fast:   150ms ease-out;
--transition-base:   200ms ease-out;
--transition-slow:   300ms ease-out;
--transition-slower: 500ms ease-out;
```

### Component Animation Rules

| Component | Animation | Duration | Easing |
|---|---|---|---|
| Room card hover | `transform: translateY(-2px)`, shadow increase | 200ms | ease-out |
| Button hover | Background color shift | 150ms | ease-out |
| Button active | `transform: scale(0.98)` | 100ms | ease-out |
| Modal entrance | `opacity 0→1, transform translateY(10px)→0` | 250ms | ease-out |
| Modal exit | `opacity 1→0, transform translateY(0)→10px` | 200ms | ease-in |
| Page transition | Fade in from opacity 0.8 | 300ms | ease-out |
| Toast entrance | Slide in from top, `opacity 0→1` | 200ms | ease-out |
| Toast exit | Fade out | 200ms | ease-in |
| Loading spinner | Rotate 360° | 800ms | linear (infinite) |
| Skeleton shimmer | Background gradient shift | 1500ms | ease-in-out (loop) |
| Nav active | Background color shift | 150ms | ease-out |
| Badge pulse | Subtle scale on status change | 200ms | ease-out |
| Calendar day hover | Background highlight | 150ms | ease-out |
| Form field focus | Border color + shadow ring | 150ms | ease-out |

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. Component Specifications

### 8.1 Navigation

**Structure:**
```
<header>
  <h1 class="site-title">🌊 Sea View Hotel</h1>
  <p class="site-tagline">Din semester börjar här — rum med havsutsikt direkt vid kusten</p>
</header>
<nav class="main-nav" role="navigation">
  <a data-page="rooms" class="nav-link" href="#">Rum</a>
  <a data-page="bookings" class="nav-link" href="#">Bokningar</a>
  <a data-page="calendar" class="nav-link" href="#">Kalender</a>
</nav>
```

**Visual Design:**
- **Header**: Full-width, background `linear-gradient(135deg, var(--color-primary-800), var(--color-primary-600))`, white text, centered
- **Nav bar**: Full-width, background `var(--color-primary-600)`, sticky top (`position: sticky; top: 0; z-index: 50`)
- **Nav links**: Inline-block, `padding: var(--space-2) var(--space-4)`, `border-radius: var(--radius-md)`, `font-weight: var(--font-semibold)`, white text
- **Nav active/hover**: `background: rgba(255,255,255,0.2)`, white text

**States:**
- `:hover` — background tint at 20% white
- `.active` — same as hover (distinguishable from unselected)
- **Mobile** (`<768px`): Stack links vertically, full width, larger tap targets (`min-height: 44px`)

**Accessibility:**
- `role="navigation"` on nav element
- `aria-current="page"` on active nav link
- Keyboard navigation: Tab between links, Enter to activate

---

### 8.2 Hero Section

**Structure:**
```html
<header class="hero">
  <span class="hero-icon">🌊</span>
  <h1 class="hero-title">Sea View Hotel</h1>
  <p class="hero-tagline">Din semester börjar här — rum med havsutsikt direkt vid kusten</p>
  <button class="btn btn-primary btn-lg" onclick="showPage('rooms')">Utforska Rum</button>
</header>
```

**Visual Design:**
- **Background**: `linear-gradient(135deg, var(--color-primary-800), var(--color-primary-600))`
- **Icon**: Centered, `font-size: 3rem`, margin-bottom `var(--space-4)`
- **Title**: `--heading-2` (2.25rem), white, bold
- **Tagline**: `--body-lg` (1.125rem), white at 85% opacity
- **CTA button**: `--btn-lg` variant (padding `0.75rem 2rem`, font `1.125rem`)
- **Padding**: `var(--space-12)` mobile, `var(--space-16)` desktop

**States:**
- Button hover: `background: var(--color-primary-700)`

---

### 8.3 Room Cards

**Structure:**
```html
<div class="room-card" data-room-id="1">
  <div class="room-card__image">
    <span class="room-card__image-icon">🌊</span>
  </div>
  <div class="room-card__content">
    <div class="room-card__header">
      <h3 class="room-card__title">Room 101</h3>
      <span class="badge badge-sea">Havsvy</span>
    </div>
    <div class="room-card__meta">
      <span class="room-card__type">Enkel</span>
      <span class="room-card__divider">·</span>
      <span class="room-card__capacity">2 personer</span>
    </div>
    <p class="room-card__description">Beskrivning av rummet.</p>
    <div class="room-card__footer">
      <span class="room-card__price">1200 kr <span class="room-card__price-unit">/ natt</span></span>
      <button class="btn btn-primary btn-sm" onclick="openBooking(1, '101')">Boka nu</button>
    </div>
  </div>
</div>
```

**Visual Design:**
- **Container**: `background: var(--color-surface)`, `border-radius: var(--radius-lg)`, `box-shadow: var(--shadow-sm)`, overflow hidden
- **Image area**: Height `180px` mobile, `200px` desktop, gradient background (`linear-gradient(135deg, var(--color-primary-100), var(--color-primary-300))`), centered emoji/icon at 2.5rem
- **Content**: Padding `var(--space-4)`
- **Title**: `--heading-4`, `var(--color-primary-800)`
- **Sea badge**: `badge-badge` + `badge-sea` (see 8.9)
- **Meta**: `--body-sm`, `var(--color-text-muted)`, flex row with `·` divider
- **Description**: `--body-sm`, `var(--color-text-muted)`, max 2 lines truncated with `text-overflow: ellipsis`
- **Price**: `--text-xl` (1.25rem), `var(--color-success)`, bold
- **Price unit**: `--text-sm`, normal weight, same color
- **Button**: Full width, `margin-top: var(--space-3)`

**States:**
- `:hover` — `transform: translateY(-2px)`, `box-shadow: var(--shadow-md)`
- **Booking disabled** (if room unavailable): Grey out price, button text "Ej tillgänglig"
- **Mobile layout**: Single column, full width
- **Desktop layout**: Part of `grid` with `minmax(300px, 1fr)`

**API Integration:**
- Data from `GET /api/rooms/` — fields: `id`, `room_number`, `room_type`, `capacity`, `price_per_night`, `sea_view`, `description`

---

### 8.4 Booking Modal / Form

**Structure:**
```html
<div id="booking-modal" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <div class="modal">
    <div class="modal__header">
      <h2 id="modal-title">Boka <span id="modal-room-label">Room 101</span></h2>
      <button class="modal__close" aria-label="Stäng" onclick="closeBooking()">✕</button>
    </div>
    <form id="booking-form" class="modal__body" onsubmit="submitBooking(event)" data-room-id="">
      <div class="form-grid">
        <div class="form-group">
          <label for="guest_name">Namn *</label>
          <input id="guest_name" name="guest_name" type="text" required
                 placeholder="Ditt fullständiga namn"
                 class="form-input">
          <span class="form-error" hidden></span>
        </div>
        <div class="form-group">
          <label for="guest_email">E-post *</label>
          <input id="guest_email" name="guest_email" type="email" required
                 placeholder="namn@exempel.se"
                 class="form-input">
          <span class="form-error" hidden></span>
        </div>
        <div class="form-group">
          <label for="guest_phone">Telefon</label>
          <input id="guest_phone" name="guest_phone" type="tel"
                 placeholder="+46 70 123 4567"
                 class="form-input">
        </div>
        <div class="form-group">
          <label for="check_in">Incheckning *</label>
          <input id="check_in" name="check_in" type="date" required
                 class="form-input">
          <span class="form-error" hidden></span>
        </div>
        <div class="form-group">
          <label for="check_out">Utcheckning *</label>
          <input id="check_out" name="check_out" type="date" required
                 class="form-input">
          <span class="form-error" hidden></span>
        </div>
      </div>
      <div class="modal__footer">
        <button type="submit" class="btn btn-primary">Bekräfta bokning</button>
        <button type="button" class="btn btn-secondary" onclick="closeBooking()">Avbryt</button>
      </div>
    </form>
  </div>
</div>
```

**Visual Design:**
- **Overlay**: Fixed position, full viewport, `background: var(--color-overlay)`, `z-index: 100`
- **Modal container**: `max-width: 540px`, `width: 90%`, `max-height: 90vh`, `overflow-y: auto`, `background: var(--color-surface)`, `border-radius: var(--radius-xl)`, `box-shadow: var(--shadow-xl)`, padding `var(--space-6)`
- **Header**: Flex row, `gap: var(--space-4)`, `justify-content: space-between`, `margin-bottom: var(--space-5)`, `align-items: center`
- **Close button**: `font-size: 1.25rem`, background none, border none, cursor pointer, color `var(--color-text-muted)`, hover: `var(--color-text)`
- **Form grid**: `grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))`, `gap: var(--space-4)`
- **Form inputs**: See 8.8 (Form Controls)
- **Footer**: Flex row, `gap: var(--space-3)`, `margin-top: var(--space-6)`, `justify-content: flex-end`

**Validation UI:**
- Required fields: `*` appended to label text, red
- Invalid state: `border-color: var(--color-error)`, `--form-error` text shown below input in red `--text-sm`
- Date comparison: JS validates `check_out > check_in` before submission
- On error response: `showMessage()` displays error in `--form-error` styling

**API Integration:**
- Submit to `POST /api/rooms/{id}/book` with body `{guest_name, guest_email, guest_phone?, check_in, check_out}`
- On success: `showMessage('Bokning bekräftad!', 'success')`, close modal, reload bookings
- On error: `showMessage('Fel: {detail}', 'error')`, stay open

---

### 8.5 Data Table (Bookings List)

**Structure:**
```html
<div class="table-container">
  <table class="data-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Gäst</th>
        <th>Incheckning</th>
        <th>Utcheckning</th>
        <th>Pris</th>
        <th>Status</th>
        <th>Åtgärd</th>
      </tr>
    </thead>
    <tbody id="bookings-tbody"></tbody>
  </table>
</div>
```

**Visual Design:**
- **Table**: `width: 100%`, `border-collapse: collapse`, `font-size: var(--text-sm)`
- **Header**: `background: var(--color-surface-alt)`, `font-weight: var(--font-semibold)`, `color: var(--color-text)`, `padding: var(--space-3) var(--space-4)`, `text-align: left`, `border-bottom: 2px solid var(--color-border)`
- **Cells**: `padding: var(--space-3) var(--space-4)`, `border-bottom: 1px solid var(--color-border)`, `color: var(--color-text)`
- **Row hover**: `background: var(--color-neutral-50)`
- **Row active/selected**: `background: var(--color-primary-50)`

**Status Badges (inline):**
| Status | Token |
|---|---|
| `confirmed` | `badge` + `badge-success` — green text on green-tinted bg |
| `cancelled` | `badge` + `badge-danger` — red text on red-tinted bg |
| `completed` | `badge` + `badge-neutral` — grey text on grey-tinted bg |

**Action Buttons:**
- Cancel button: Only shown for `confirmed` status, `btn-danger btn-sm`
- On hover: `background: var(--color-error-hover)`

**Empty State:**
```html
<tr><td colspan="7" class="table-empty">Inga bokningar ännu</td></tr>
```
- Centered text, `--text-muted`, `padding: var(--space-8)`

**Responsive:**
- `min-width: 768px`: Full table display
- `<768px`: Container with `overflow-x: auto`, table scrolls horizontally

**API Integration:**
- Data from `GET /api/bookings/` — fields: `id`, `guest_name`, `guest_email`, `room_id`, `check_in`, `check_out`, `total_price`, `status`
- Cancel action: `PUT /api/bookings/{id}/cancel`

---

### 8.6 Calendar Grid

**Structure:**
```html
<div class="calendar-grid">
  <div class="calendar-day-card">
    <div class="calendar-day-card__date">Måndag 27 juli</div>
    <div class="calendar-day-card__slots">
      <div class="slot available">
        <span class="slot__room">Room 101</span>
        <span class="slot__status">✓ Ledig</span>
      </div>
      <div class="slot booked">
        <span class="slot__room">Room 102</span>
        <span class="slot__status">✗ Bokad</span>
      </div>
    </div>
  </div>
  <!-- ... more day cards ... -->
</div>
```

**Visual Design:**
- **Grid**: `display: grid`, `grid-template-columns: 1fr` mobile, `repeat(auto-fill, minmax(280px, 1fr))` at `≥768px`, `gap: var(--space-4)`
- **Day card**: `background: var(--color-surface)`, `border-radius: var(--radius-md)`, `box-shadow: var(--shadow-xs)`, padding `var(--space-4)`
- **Date header**: `--heading-5`, `var(--color-primary-800)`, `margin-bottom: var(--space-3)`, bottom border `1px solid var(--color-border)`
- **Slot**: `display: flex`, `justify-content: space-between`, `align-items: center`, `padding: var(--space-2) 0`, `border-bottom: 1px solid var(--color-neutral-100)`, last child: no border
- **Slot status available**: `color: var(--color-success)`, bold checkmark
- **Slot status booked**: `color: var(--color-error)`, bold cross
- **Slot hover** (booked): Subtle background highlight to indicate clickable (if booking detail link added)

**Legend (optional, below grid):**
```html
<div class="calendar-legend">
  <span class="legend-item"><span class="legend-dot legend-dot--available"></span> Tillgänglig</span>
  <span class="legend-item"><span class="legend-dot legend-dot--booked"></span> Bokad</span>
</div>
```

**API Integration:**
- Data from `GET /api/calendar/{year}/{month}` — response: `{month, days: [{date, room_1: {room_number, available, booking_id}, ...}]}`

---

### 8.7 Filter Bar

**Structure:**
```html
<div class="filter-bar">
  <div class="filter-group">
    <label for="filter-type" class="filter-label">Rumstyp</label>
    <select id="filter-type" class="form-input form-select">
      <option value="">Alla rumtyper</option>
      <option value="single">Enkel</option>
      <option value="double">Dubbel</option>
      <option value="four_person">Fyrasäng</option>
    </select>
  </div>
  <button class="btn btn-primary" onclick="loadRooms()">
    <span class="btn__icon">🔍</span> Filtrera
  </button>
</div>
```

**Visual Design:**
- **Layout**: Flex row, `gap: var(--space-3)`, `flex-wrap: wrap`, `align-items: flex-end`
- **Filter group**: Flex column, `gap: var(--space-1)`
- **Filter label**: `--body-label`, `var(--color-text-muted)`, `margin-bottom: var(--space-1)`
- **Select / input**: `--form-input` styling (see 8.8)
- **Button**: `--btn-primary` (see 8.8)
- **Mobile** (`<640px`): `flex-direction: column`, full-width inputs

**States:**
- Select: Standard select styling with custom border color, focus ring
- Button: Primary button with optional icon

**API Integration:**
- `GET /api/rooms/?room_type=X` — filters rooms by type
- Calendar page: `GET /api/calendar/{year}/{month}` — year/month from inputs

---

### 8.8 Buttons

**Button Sizes:**

| Class | Padding | Font Size | Use Case |
|---|---|---|---|
| `btn btn-sm` | `0.4rem 0.75rem` | `0.8rem` | Table actions, inline buttons |
| `btn btn-base` (default) | `0.6rem 1.25rem` | `0.95rem` | Standard buttons, form submit |
| `btn btn-lg` | `0.75rem 2rem` | `1.125rem` | Hero CTA, primary actions |

**Button Variants:**

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background var(--transition-fast), transform var(--transition-fast);
  font-family: var(--font-body);
  font-weight: var(--font-semibold);
  line-height: var(--leading-tight);
}
```

| Variant | Background | Text Color | Hover | Active |
|---|---|---|---|---|
| `btn-primary` | `var(--color-primary-600)` | white | `var(--color-primary-700)` | `var(--color-primary-800)` + `scale(0.98)` |
| `btn-secondary` | `var(--color-neutral-200)` | `var(--color-text)` | `var(--color-neutral-300)` | `var(--color-neutral-400)` |
| `btn-success` | `var(--color-accent-600)` | white | `var(--color-accent-700)` | `var(--color-accent-800)` + `scale(0.98)` |
| `btn-danger` | `var(--color-error)` | white | `#b91c1c` | `#991b1b` + `scale(0.98)` |
| `btn-outline` | transparent | `var(--color-primary-600)` | `var(--color-primary-50)` + border `2px solid var(--color-primary-600)` | — |
| `btn-ghost` | transparent | `var(--color-text-muted)` | `var(--color-neutral-100)` | — |

**Button with icon:**
- Icon on left: `btn__icon` span, `font-size: 1.1em`
- Icon on right: `btn__icon--end` span

**Disabled state:**
- `opacity: 0.5`, `cursor: not-allowed`, no pointer events, no hover effects

---

### 8.9 Badges

**Base Badge:**
```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-0-5) var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  line-height: 1;
  white-space: nowrap;
}
```

| Variant | Background | Text Color | Use Case |
|---|---|---|---|
| `badge-sea` | `var(--color-primary-100)` | `var(--color-primary-700)` | "Havsvy" label |
| `badge-success` | `var(--color-success-bg)` | `var(--color-success)` | Confirmed status |
| `badge-danger` | `var(--color-error-bg)` | `var(--color-error)` | Cancelled status |
| `badge-neutral` | `var(--color-neutral-100)` | `var(--color-neutral-600)` | Completed / neutral |
| `badge-warning` | `var(--color-warning-bg)` | `var(--color-warning)` | Warning / pending |
| `badge-info` | `var(--color-info-bg)` | `var(--color-info)` | Info / in-progress |
| `badge-accent` | `var(--color-accent-100)` | `var(--color-accent-700)` | Room type labels |

**Room Type Badges (inline with title):**
```html
<h3>Room 101 <span class="badge badge-info">Enkel</span></h3>
```

---

### 8.10 Form Controls

**Inputs / Selects / Textareas:**
```css
.form-input {
  display: block;
  width: 100%;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  color: var(--color-text);
  background: var(--color-surface);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}
```

**States:**
| State | Border | Background | Box Shadow |
|---|---|---|---|
| Default | `1px solid var(--color-border)` | `var(--color-surface)` | none |
| Focus | `2px solid var(--color-primary-600)` | `var(--color-surface)` | `var(--shadow-focus)` |
| Invalid | `2px solid var(--color-error)` | `var(--color-surface)` | none |
| Disabled | `1px solid var(--color-neutral-200)` | `var(--color-neutral-50)` | none, `opacity: 0.6` |

**Form Group:**
```html
<div class="form-group">
  <label class="form-label">Label text *</label>
  <input class="form-input" type="text" required>
  <span class="form-error" hidden>Valideringsfeltext</span>
</div>
```

**Label:**
- `--body-label`, `var(--color-text)`, `font-weight: var(--font-semibold)`
- Required marker `*` in `var(--color-error)`

**Error:**
- `--body-xs`, `var(--color-error)`, `margin-top: var(--space-1)`, hidden by default, shown on invalid

**Form Grid:**
- `display: grid`
- Mobile: `grid-template-columns: 1fr`
- `≥768px`: `grid-template-columns: repeat(2, 1fr)`
- Gap: `var(--space-4)`

---

### 8.11 Loading States

**Global Loading Spinner:**
- Centered overlay, `z-index: 200`
- Spinner: CSS-only rotating circle, 40px diameter, border `3px solid var(--color-neutral-200)`, `border-top-color: var(--color-primary-600)`
- Overlay: `background: rgba(255,255,255,0.7)` or dark mode equivalent
- Text label below: "Laddar..."

**Skeleton Loader (for room cards):**
```html
<div class="skeleton-card">
  <div class="skeleton-card__image"></div>
  <div class="skeleton-card__content">
    <div class="skeleton-line skeleton-line--title"></div>
    <div class="skeleton-line skeleton-line--meta"></div>
    <div class="skeleton-line skeleton-line--desc"></div>
    <div class="skeleton-line skeleton-line--price"></div>
    <div class="skeleton-line skeleton-line--button"></div>
  </div>
</div>
```

**Skeleton Styles:**
- Background: `linear-gradient(90deg, var(--color-neutral-100) 25%, var(--color-neutral-200) 50%, var(--color-neutral-100) 75%)`
- `background-size: 200% 100%`
- Animation: `shimmer` keyframes (background-position 0% → 200%, 1500ms ease-in-out infinite)
- Border radius: `var(--radius-sm)` for all skeleton lines
- Heights: title 24px, meta 16px, desc 16px, price 20px, button 40px
- Widths: title 60%, meta 40%, desc 100%, price 30%, button 80%

**Empty State:**
- Centered icon (48px), `margin-bottom: var(--space-4)`
- Message text: `--body-base`, `var(--color-text-muted)`, centered
- Optional: secondary action button below message
- Example: "Inga bokningar ännu" with a "Gå till Rum"-link

---

### 8.12 Toast / Notification Messages

**Structure:**
```html
<div id="toast-container" class="toast-container" aria-live="polite" aria-atomic="true">
  <div class="toast toast--success" role="alert">
    <span class="toast__icon">✅</span>
    <span class="toast__message">Bokning bekräftad!</span>
    <button class="toast__close" aria-label="Stäng" onclick="this.parentElement.remove()">✕</button>
  </div>
</div>
```

**Visual Design:**
- **Container**: Fixed position, top `var(--space-4)`, right `var(--space-4)`, `z-index: 200`, `max-width: 400px`, `width: calc(100% - var(--space-8))`
- **Toast**: `background: var(--color-surface)`, `border-radius: var(--radius-lg)`, `box-shadow: var(--shadow-lg)`, padding `var(--space-4)`, `display: flex`, `gap: var(--space-3)`, `align-items: flex-start`, `margin-bottom: var(--space-2)`
- **Left border**: `4px solid` accent color per variant

**Variants:**

| Variant | Left Border | Icon | Use Case |
|---|---|---|---|
| `toast--success` | `var(--color-success)` | ✅ | Booking confirmed, cancel successful |
| `toast--error` | `var(--color-error)` | ❌ | API errors, validation failures |
| `toast--warning` | `var(--color-warning)` | ⚠️ | Date conflicts, limited availability |
| `toast--info` | `var(--color-info)` | ℹ️ | General info messages |

**Behavior:**
- Enter: `transform: translateX(100%) → translateX(0)`, `opacity: 0 → 1`, duration 250ms
- Exit: `transform: translateX(0) → translateX(100%)`, `opacity: 1 → 0`, duration 200ms
- Auto-dismiss: 4000ms after show
- Max visible: 3 toasts stacked (others queue)
- Close button: X icon, top-right of toast
- **Mobile**: Full width minus margins, `top: auto`, `bottom: var(--space-4)` for bottom sheet behavior

**Implementation Note:**
- Replace the existing `showMessage()` inline bar with the toast system
- The old `#message-box` can be deprecated or repurposed for page-level persistent messages (not auto-dismissed)

---

## File Structure for Implementation

The coder should organize styles and scripts in modular files:

```
static/
├── css/
│   ├── design-system.css    /* All CSS custom properties (tokens) */
│   ├── base.css             /* Reset, body, base typography */
│   ├── components/
│   │   ├── nav.css          /* Header + nav styles */
│   │   ├── hero.css         /* Hero section */
│   │   ├── cards.css        /* Room cards, card containers */
│   │   ├── buttons.css      /* All button variants */
│   │   ├── badges.css       /* Badge styles */
│   │   ├── forms.css        /* Inputs, selects, form groups */
│   │   ├── table.css        /* Data table */
│   │   ├── calendar.css     /* Calendar grid */
│   │   ├── modal.css        /* Modal overlay */
│   │   ├── filters.css      /* Filter bar */
│   │   ├── toasts.css       /* Toast notifications */
│   │   ├── loading.css      /* Skeleton, spinner, empty states */
│   │   └── footer.css       /* Footer */
│   └── responsive.css       /* Media queries for breakpoints */
├── js/
│   ├── app.js               /* Main app logic (existing) */
│   ├── ui/
│   │   ├── render-rooms.js  /* Room card rendering */
│   │   ├── render-bookings.js /* Booking table rendering */
│   │   ├── render-calendar.js /* Calendar rendering */
│   │   ├── modal.js         /* Modal open/close logic */
│   │   ├── toasts.js        /* Toast notification system */
│   │   └── loading.js       /* Loading/skeleton state management */
│   └── utils/
│       └── api.js           /* API call helpers */
└── templates/
    └── index.html           /* Single-page template */
```

---

## Migration Notes from Current Code

| Current Pattern | New Pattern | Notes |
|---|---|---|
| Inline `onclick` in HTML | Delegated JS event listeners in `app.js` / `ui/` modules | Improve separation of concerns |
| `.hidden` class for visibility | `data-page` attribute for SPA routing | Keep current pattern, add visual transitions |
| `#message-box` inline messages | Toast system with container | Backwards compatible |
| Hardcoded hex colors | CSS custom properties | Systematic, themeable |
| `data-room-id` on form | `data-room-id` on `#booking-modal` itself | Clean up form dataset |
| `#booking-form` missing `#booking-room-id` hidden input | Add hidden input or use modal dataset | Fix existing bug in app.js |
| `filter-bar button` inner text has leading space | Clean up HTML | Minor cleanup |
