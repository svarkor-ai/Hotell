// Sea View Hotel — lightweight JS

const API = "";

// --- Navigation ---
document.querySelectorAll('nav a[data-page]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const page = link.dataset.page;
    showPage(page);
    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
    link.classList.add('active');
  });
});

function showPage(page) {
  document.querySelectorAll('main > section').forEach(s => s.classList.add('hidden'));
  const target = document.getElementById(`page-${page}`);
  if (target) {
    target.classList.remove('hidden');
    if (page === 'rooms') loadRooms();
    if (page === 'bookings') loadBookings();
    if (page === 'calendar') loadMonthCalendar();
  }
}

// --- Rooms ---
async function loadRooms() {
  const typeFilter = document.getElementById('filter-type')?.value || '';
  try {
    const url = typeFilter ? `/api/rooms/?sea_view_only=false&room_type=${typeFilter}` : '/api/rooms/';
    const res = await fetch(API + '/api/rooms/');
    const rooms = await res.json();
    const grid = document.getElementById('rooms-grid');
    grid.innerHTML = rooms.map(r => `
      <div class="room-card">
        <div class="room-img">🌊</div>
        <div class="room-info">
          <h3>Room ${r.room_number} <span class="sea-badge">Havsvy</span></h3>
          <div class="type">${r.room_type} · ${r.capacity} personer</div>
          <div class="price">${r.price_per_night} kr <span>/ natt</span></div>
          ${r.description ? `<p style="margin-top:0.5rem;font-size:0.85rem;color:#64748b">${r.description}</p>` : ''}
          <button class="btn btn-primary" style="margin-top:0.75rem;width:100%" onclick="openBooking(${r.id}, '${r.room_number}')">
            Boka nu
          </button>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Failed to load rooms:', err);
  }
}

// --- Booking Modal ---
function openBooking(roomId, roomNumber) {
  document.getElementById('booking-room-id').value = roomId;
  document.getElementById('booking-room-label').textContent = `Room ${roomNumber}`;
  document.getElementById('booking-modal').classList.remove('hidden');
}

function closeBooking() {
  document.getElementById('booking-modal').classList.add('hidden');
  document.getElementById('booking-form').reset();
}

async function submitBooking(e) {
  e.preventDefault();
  const form = e.target;
  const data = {
    guest_name: form.guest_name.value,
    guest_email: form.guest_email.value,
    guest_phone: form.guest_phone.value || '',
    check_in: form.check_in.value,
    check_out: form.check_out.value,
  };

  try {
    const res = await fetch(`/api/rooms/${form.dataset.roomId}/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      showMessage('Bokning bekräftad! ✅', 'success');
      closeBooking();
      loadBookings();
    } else {
      const err = await res.json();
      showMessage(`Fel: ${err.detail}`, 'error');
    }
  } catch (err) {
    showMessage('Kunde inte skicka bokning. Försök igen.', 'error');
  }
}

// --- Bookings ---
async function loadBookings() {
  try {
    const res = await fetch(API + '/api/bookings/');
    const bookings = await res.json();
    const tbody = document.getElementById('bookings-tbody');
    if (bookings.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#94a3b8">Inga bokningar ännu</td></tr>';
      return;
    }
    tbody.innerHTML = bookings.map(b => `
      <tr>
        <td>#${b.id}</td>
        <td>${b.guest_name}</td>
        <td>${b.check_in}</td>
        <td>${b.check_out}</td>
        <td>${b.total_price} kr</td>
        <td>
          <span class="status-${b.status}">${b.status}</span>
          ${b.status === 'confirmed' ? `<button class="btn btn-danger" style="margin-left:0.5rem;padding:0.3rem 0.7rem;font-size:0.8rem" onclick="cancelBooking(${b.id})">Avbryt</button>` : ''}
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Failed to load bookings:', err);
  }
}

async function cancelBooking(id) {
  try {
    await fetch(`/api/bookings/${id}/cancel`, { method: 'PUT' });
    showMessage('Bokning avbruten', 'success');
    loadBookings();
  } catch (err) {
    showMessage('Kunde inte avbryta bokning', 'error');
  }
}

// --- Calendar ---
async function loadMonthCalendar() {
  const year = document.getElementById('cal-year')?.value || new Date().getFullYear();
  const month = document.getElementById('cal-month')?.value || (new Date().getMonth() + 1);
  try {
    const res = await fetch(`/api/calendar/${year}/${month}`);
    const data = await res.json();
    const container = document.getElementById('calendar-container');
    container.innerHTML = data.days.map(day => `
      <div class="calendar-day">
        <div class="date">${new Date(day.date).toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
        ${Object.entries(day)
          .filter(([k]) => k.startsWith('room_'))
          .map(([k, v]) => `
            <div class="slot ${v.available ? 'available' : 'booked'}">
              <span class="room-name">${v.room_number}</span>
              <span>${v.available ? '✓ Ledig' : '✗ Bokad'}</span>
            </div>
          `).join('')}
      </div>
    `).join('');
  } catch (err) {
    console.error('Failed to load calendar:', err);
  }
}

// --- Helpers ---
function showMessage(text, type) {
  const box = document.getElementById('message-box');
  box.textContent = text;
  box.className = `msg-${type}`;
  setTimeout(() => { box.textContent = ''; box.className = ''; }, 4000);
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  showPage('rooms');
  document.getElementById('page-rooms').classList.remove('hidden');
  document.querySelector('nav a[data-page="rooms"]').classList.add('active');
});
