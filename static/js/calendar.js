/**
 * calendar.js — Calendar Page (Month Grid View)
 *
 * Renders a month calendar grid showing room availability for each day.
 * Supports month navigation, room type filtering, and today highlighting.
 */

/* global API */
const calendarModule = (() => {
  // ---- State ----
  let currentYear = new Date().getFullYear();
  let currentMonth = new Date().getMonth() + 1; // 1-indexed
  let rooms = []; // Cached rooms list
  let roomsLoaded = false;

  // ---- Swedish month/day names ----
  const MONTH_NAMES = [
    'Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni',
    'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December',
  ];

  const DAY_NAMES = ['Man', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'];

  // ---- Room type colors (from design spec) ----
  const ROOM_TYPE_COLORS = {
    single: { bg: '#e0f2fe', border: '#0369a1', text: '#075985' },   // primary-100/600/700
    double: { bg: '#d1fae5', border: '#047857', text: '#065f46' },   // accent-100/600/700
    four_person: { bg: '#fef3c7', border: '#d97706', text: '#92400e' }, // warning-100/warning/secondary-800
  };

  // ---- API ----
  async function fetchCalendar(year, month) {
    try {
      const res = await fetch(`/api/calendar/${year}/${month}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('Failed to load calendar:', err);
      return { days: [] };
    }
  }

  async function fetchRooms() {
    if (roomsLoaded) return rooms;
    try {
      const res = await fetch(`${API}/api/rooms/`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      rooms = await res.json();
      roomsLoaded = true;
    } catch (err) {
      console.error('Failed to load rooms:', err);
      rooms = [];
    }
    return rooms;
  }

  // ---- Date helpers ----
  function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }

  function getFirstDayOfMonth(year, month) {
    // 0=Sunday, we want 0=Monday
    const day = new Date(year, month - 1, 1).getDay();
    return day === 0 ? 6 : day - 1; // Convert to Monday=0
  }

  function formatDate(year, month, day) {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  function isToday(year, month, day) {
    const now = new Date();
    return now.getFullYear() === year &&
           now.getMonth() + 1 === month &&
           now.getDate() === day;
  }

  function isPrevMonthDay(year, month, day) {
    // For padding days from previous month
    return day < 7 - getFirstDayOfMonth(year, month);
  }

  function isNextMonthDay(year, month, day) {
    const totalDays = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const totalSlots = firstDay + totalDays;
    const weekNum = Math.floor((firstDay + day - 1) / 7);
    const currentWeekEnd = weekNum * 7 + 7;
    return day > totalDays && (firstDay + day - 1) >= totalSlots;
  }

  // ---- Rendering: Month Label ----
  function updateMonthLabel() {
    const label = document.getElementById('calendar-month-label');
    if (label) {
      label.textContent = `${MONTH_NAMES[currentMonth - 1]} ${currentYear}`;
    }
  }

  // ---- Rendering: Grid ----
  function renderCalendarGrid(year, month, data, container) {
    if (!container) container = document.getElementById('calendar-weeks');
    if (!container) return;

    // Get room type filter
    const roomTypeFilter = document.getElementById('filter-room-type');
    const selectedType = roomTypeFilter ? roomTypeFilter.value : '';

    // Filter rooms by type
    const filteredRooms = rooms.filter(r => {
      if (!selectedType) return true;
      return r.room_type === selectedType;
    });

    if (filteredRooms.length === 0) {
      container.innerHTML = `
        <div class="calendar-empty">
          <div class="calendar-empty__icon">📅</div>
          <p>Inga rum tillgängliga för valt filter.</p>
        </div>`;
      return;
    }

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const daysInPrevMonth = new Date(year, month - 1, 0).getDate();

    // Build a lookup: date string -> { room_id: { available, booking_id } }
    const dayLookup = {};
    (data.days || []).forEach(day => {
      dayLookup[day.date] = {};
      Object.entries(day).forEach(([key, val]) => {
        if (key.startsWith('room_')) {
          const roomId = parseInt(key.replace('room_', ''), 10);
          dayLookup[day.date][roomId] = val;
        }
      });
    });

    // Build weeks array
    const weeks = [];
    let currentWeek = [];

    // Padding from previous month
    for (let i = 0; i < firstDay; i++) {
      const day = daysInPrevMonth - firstDay + 1 + i;
      currentWeek.push({
        type: 'prev',
        day,
        date: formatDate(prevYear, prevMonth, day),
        roomData: {},
      });
    }

    // Days in current month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(year, month, day);
      currentWeek.push({
        type: 'current',
        day,
        date: dateStr,
        roomData: dayLookup[dateStr] || {},
        isTodayFlag: isToday(year, month, day),
      });
    }

    // Padding for next month to complete last week
    while (currentWeek.length < 7) {
      const day = currentWeek.length - firstDay + 1;
      const nextMonth = month === 12 ? 1 : month + 1;
      const nextYear = month === 12 ? year + 1 : year;
      currentWeek.push({
        type: 'next',
        day,
        date: formatDate(nextYear, nextMonth, day),
        roomData: {},
      });
    }

    weeks.push(currentWeek);

    // Render rows
    let html = '<div class="calendar-grid__header" role="row">';
    DAY_NAMES.forEach(d => {
      html += `<div class="calendar-grid__header-cell" role="columnheader">${d}</div>`;
    });
    html += '</div>';
    html += '<div class="calendar-grid__body" role="rowgroup">';

    weeks.forEach((week, weekIdx) => {
      html += `<div class="calendar-grid__row" role="row">`;
      week.forEach(dayInfo => {
        const cellClass = ['calendar-grid__cell'];
        if (dayInfo.type === 'prev') cellClass.push('calendar-grid__cell--prev');
        if (dayInfo.type === 'next') cellClass.push('calendar-grid__cell--next');
        if (dayInfo.isTodayFlag) cellClass.push('calendar-grid__cell--today');

        // Build room status cells for this day
        let roomStatuses = filteredRooms.map(room => {
          const color = ROOM_TYPE_COLORS[room.room_type] || ROOM_TYPE_COLORS.single;
          const dayData = dayInfo.roomData[room.id];
          const available = dayData ? dayData.available : true;
          const booked = dayData ? !dayData.available : false;

          return `<div class="calendar-grid__room-slot ${booked ? 'calendar-grid__room-slot--booked' : 'calendar-grid__room-slot--available'}"
                        style="background:${color.bg}; border-left: 3px solid ${color.border}"
                        title="Rum ${room.room_number}: ${booked ? 'Bokad' : 'Ledig'}">
          </div>`;
        }).join('');

        html += `<div class="${cellClass.join(' ')}" role="gridcell" data-date="${dayInfo.date}">
          <span class="calendar-grid__cell-day">${dayInfo.day}</span>
          <div class="calendar-grid__cell-rooms">${roomStatuses}</div>
        </div>`;
      });
      html += '</div>';
    });

    html += '</div>';
    container.innerHTML = html;
  }

  // ---- Rendering: Room Legend ----
  function renderRoomLegend(container) {
    if (!container) container = document.getElementById('calendar-room-legend');
    if (!container) return;

    const roomTypeFilter = document.getElementById('filter-room-type');
    const selectedType = roomTypeFilter ? roomTypeFilter.value : '';
    const filteredRooms = rooms.filter(r => {
      if (!selectedType) return true;
      return r.room_type === selectedType;
    });

    if (filteredRooms.length === 0) {
      container.innerHTML = '<p class="calendar-empty__text">Inga rum tillgängliga.</p>';
      return;
    }

    container.innerHTML = filteredRooms.map(room => {
      const color = ROOM_TYPE_COLORS[room.room_type] || ROOM_TYPE_COLORS.single;
      return `<div class="calendar-legend__item" title="Rum ${room.room_number} (${room.room_type})">
        <span class="calendar-legend__dot" style="background:${color.border}"></span>
        <span class="calendar-legend__label">Rum ${room.room_number}</span>
      </div>`;
    }).join('');
  }

  // ---- Rendering: Today Highlight ----
  function highlightToday() {
    const todayCell = document.querySelector('.calendar-grid__cell--today');
    if (todayCell) {
      todayCell.style.outline = `2px solid var(--color-primary-600)`;
      todayCell.style.outlineOffset = `2px`;
    }
  }

  // ---- Month Navigation ----
  function navigateMonth(direction) {
    currentMonth += direction;
    if (currentMonth > 12) {
      currentMonth = 1;
      currentYear++;
    } else if (currentMonth < 1) {
      currentMonth = 12;
      currentYear--;
    }
    loadCalendar();
  }

  function goToday() {
    const now = new Date();
    currentYear = now.getFullYear();
    currentMonth = now.getMonth() + 1;
    loadCalendar();
  }

  // ---- Load & Render ----
  async function loadCalendar() {
    await fetchRooms();
    const data = await fetchCalendar(currentYear, currentMonth);
    updateMonthLabel();
    renderCalendarGrid(currentYear, currentMonth, data);
    highlightToday();
    renderRoomLegend();
  }

  // ---- Public API ----
  function getCurrentYear() { return currentYear; }
  function getCurrentMonth() { return currentMonth; }

  // ---- Initialization ----
  function init() {
    // Month navigation
    const prevBtn = document.getElementById('cal-prev-month');
    const nextBtn = document.getElementById('cal-next-month');
    const todayBtn = document.getElementById('cal-today');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => navigateMonth(-1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => navigateMonth(1));
    }
    if (todayBtn) {
      todayBtn.addEventListener('click', goToday);
    }

    // Room type filter
    const roomTypeFilter = document.getElementById('filter-room-type');
    if (roomTypeFilter) {
      roomTypeFilter.addEventListener('change', () => loadCalendar());
    }

    // Load initial data
    loadCalendar();
  }

  return {
    init,
    loadCalendar,
    navigateMonth,
    goToday,
    getCurrentYear,
    getCurrentMonth,
  };
})();
