// ============================================================
//  MOCK DATA — Hệ thống quản lý dịch vụ du lịch
//  File: mockData.js
//  Sử dụng: <script src="mockData.js"></script>
// ============================================================

// ─────────────────────────────────────────
//  1. DANH SÁCH DỊCH VỤ
// ─────────────────────────────────────────
const services = [];

// ─────────────────────────────────────────
//  2. DANH SÁCH ĐƠN ĐẶT CHỖ
// ─────────────────────────────────────────
const bookings = [];

// ─────────────────────────────────────────
//  3. CÁC HÀM TRUY VẤN DỮ LIỆU
// ─────────────────────────────────────────

/** Lấy toàn bộ dịch vụ */
function getAllServices() {
  return services;
}

/** Lấy dịch vụ đang hoạt động */
function getActiveServices() {
  return services.filter(s => s.status === 'active');
}

/** Lấy dịch vụ đang chờ duyệt */
function getPendingServices() {
  return services.filter(s => s.status === 'pending');
}

/** Lấy dịch vụ đã tạm dừng */
function getPausedServices() {
  return services.filter(s => s.status === 'paused');
}

/** Lấy toàn bộ đơn đặt chỗ */
function getBookings() {
  return bookings;
}

/** Lấy đơn đặt chỗ theo trạng thái */
function getBookingsByStatus(status) {
  return bookings.filter(b => b.status === status);
}

/** Lấy dịch vụ theo loại */
function getServicesByType(type) {
  return services.filter(s => s.type === type);
}

// ─────────────────────────────────────────
//  4. HÀM RENDER CARD DỊCH VỤ
// ─────────────────────────────────────────

const STATUS_LABEL = {
  active:  { text: 'Đang hoạt động', cls: 's-green' },
  pending: { text: 'Chờ duyệt',       cls: 's-yellow' },
  paused:  { text: 'Tạm dừng',        cls: 's-gray' }
};

const BOOKING_STATUS_LABEL = {
  confirmed: { text: 'Đã xác nhận',  cls: 'st-green' },
  pending:   { text: 'Chờ xác nhận', cls: 'st-yellow' },
  cancelled: { text: 'Đã hủy',       cls: 'st-red' }
};

/**
 * Render danh sách card dịch vụ vào một container
 * @param {HTMLElement|string} container - DOM element hoặc CSS selector
 * @param {Array} data - Mảng dịch vụ (mặc định: tất cả)
 */
function renderServiceCards(container, data = getAllServices()) {
  const el = typeof container === 'string'
    ? document.querySelector(container)
    : container;
  if (!el) return;

  const fmt = new Intl.NumberFormat('vi-VN');

  el.innerHTML = data.map(svc => {
    const st = STATUS_LABEL[svc.status] || STATUS_LABEL.paused;
    const stars = svc.rating > 0
      ? `⭐ ${svc.rating} (${svc.bookings})`
      : '⭐ Chưa có đánh giá';
    return `
      <div class="svc-card" data-id="${svc.id}">
        <div class="svc-img">
          <img src="${svc.image}" alt="${svc.name}" loading="lazy">
          <div class="svc-status ${st.cls}">${st.text}</div>
        </div>
        <div class="svc-body">
          <div class="svc-name">${svc.name}</div>
          <div class="svc-loc">📍 ${svc.location}</div>
          <div class="svc-price">${fmt.format(svc.price)} <span>VND / ${svc.unit}</span></div>
          <div class="svc-meta">
            <span>${stars}</span>
            <span>Đã đặt: ${svc.bookings}</span>
          </div>
        </div>
      </div>`;
  }).join('');
}

/**
 * Render bảng đơn đặt chỗ vào một container
 * @param {HTMLElement|string} container - DOM element hoặc CSS selector
 * @param {Array} data - Mảng đơn đặt (mặc định: tất cả)
 */
function renderBookingsTable(container, data = getBookings()) {
  const el = typeof container === 'string'
    ? document.querySelector(container)
    : container;
  if (!el) return;

  const fmt = new Intl.NumberFormat('vi-VN');

  el.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Mã đơn</th>
          <th>Khách hàng</th>
          <th>Dịch vụ</th>
          <th>Ngày đặt</th>
          <th>Ngày sử dụng</th>
          <th>Giá trị</th>
          <th>Trạng thái</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(b => {
          const st = BOOKING_STATUS_LABEL[b.status] || BOOKING_STATUS_LABEL.pending;
          return `
            <tr>
              <td>${b.id}</td>
              <td>${b.customerName}</td>
              <td>${b.serviceName}</td>
              <td>${b.bookingDate}</td>
              <td>${b.useDate}</td>
              <td>${fmt.format(b.value)} VND</td>
              <td><span class="st ${st.cls}">${st.text}</span></td>
            </tr>`;
        }).join('')}
      </tbody>
    </table>`;
}

// Export cho môi trường Node/module (nếu cần)
if (typeof module !== 'undefined') {
  module.exports = {
    services, bookings,
    getAllServices, getActiveServices, getPendingServices,
    getPausedServices, getBookings, getBookingsByStatus,
    getServicesByType, renderServiceCards, renderBookingsTable
  };
}
