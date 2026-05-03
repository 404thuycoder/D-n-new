/**
 * bookingTable.js
 * Bảng hiển thị đơn đặt chỗ gần đây
 *
 * Load order:
 *   mockData.js → bookingTable.js
 *
 * Cách dùng:
 *   <div id="booking-table"></div>
 *   renderBookings(getBookings());
 */

// ─────────────────────────────────────────
//  Inject CSS
// ─────────────────────────────────────────
(function injectStyles() {
  if (document.getElementById('booking-table-styles')) return;
  const s = document.createElement('style');
  s.id = 'booking-table-styles';
  s.textContent = `
    .booking-wrap {
      background: #fff;
      border-radius: 16px;
      border: 1px solid #ede8ff;
      overflow: hidden;
    }

    .booking-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 20px 14px;
      border-bottom: 1px solid #f3f0ff;
    }

    .booking-title {
      font-size: 15px;
      font-weight: 700;
      color: #1a1a2e;
    }

    .booking-view-all {
      background: none;
      border: 1.5px solid #c4b5fd;
      color: #764ba2;
      font-size: 13px;
      font-weight: 600;
      padding: 6px 16px;
      border-radius: 8px;
      cursor: pointer;
      font-family: inherit;
      transition: background 0.2s, color 0.2s;
    }
    .booking-view-all:hover {
      background: #764ba2;
      color: #fff;
    }

    .booking-table-scroll { overflow-x: auto; }

    .booking-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13.5px;
    }

    .booking-table thead tr {
      background: #f8f5ff;
    }

    .booking-table th {
      padding: 11px 16px;
      text-align: left;
      font-size: 11.5px;
      font-weight: 700;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }

    .booking-table tbody tr {
      border-top: 1px solid #f5f3ff;
      transition: background 0.15s;
    }
    .booking-table tbody tr:hover { background: #faf8ff; }

    .booking-table td {
      padding: 12px 16px;
      color: #1a1a2e;
      white-space: nowrap;
    }

    .booking-id   { font-weight: 700; color: #764ba2; }
    .booking-name { font-weight: 600; }
    .booking-svc  { color: #444; max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .booking-date { color: #888; }
    .booking-val  { font-weight: 700; color: #1a1a2e; }

    /* Status badges */
    .bk-status {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      white-space: nowrap;
    }
    .bk-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .bk-confirmed { background: #dcfce7; color: #16a34a; }
    .bk-confirmed .bk-dot { background: #16a34a; }

    .bk-pending   { background: #fef9c3; color: #b45309; }
    .bk-pending .bk-dot { background: #f59e0b; }

    .bk-cancelled { background: #fee2e2; color: #dc2626; }
    .bk-cancelled .bk-dot { background: #dc2626; }

    /* Empty */
    .booking-empty {
      text-align: center;
      padding: 3rem;
      color: #aaa;
      font-size: 14px;
    }

    /* Footer */
    .booking-footer {
      padding: 12px 20px;
      border-top: 1px solid #f3f0ff;
      text-align: center;
    }
    .booking-footer-link {
      color: #764ba2;
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      background: none;
      border: none;
      font-family: inherit;
    }
    .booking-footer-link:hover { text-decoration: underline; }
  `;
  document.head.appendChild(s);
})();

// ─────────────────────────────────────────
//  Config trạng thái
// ─────────────────────────────────────────
const BOOKING_STATUS = {
  confirmed: { cls: 'bk-confirmed', label: 'Đã xác nhận' },
  pending:   { cls: 'bk-pending',   label: 'Chờ xác nhận' },
  cancelled: { cls: 'bk-cancelled', label: 'Đã hủy'       },
};

// ─────────────────────────────────────────
//  renderBookings(bookings, containerId?)
// ─────────────────────────────────────────
/**
 * Render bảng đơn đặt chỗ vào container
 * @param {Array}  bookings    - Mảng đơn đặt chỗ
 * @param {string} containerId - ID div chứa (mặc định: 'booking-table')
 * @param {Object} options
 *   @param {number} options.limit      - Số dòng tối đa hiển thị (mặc định: tất cả)
 *   @param {string} options.title      - Tiêu đề bảng
 *   @param {Function} options.onViewAll - Callback khi nhấn "Xem tất cả"
 */
function renderBookings(bookings, containerId = 'booking-table', options = {}) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`[renderBookings] Không tìm thấy #${containerId}`);
    return;
  }

  const {
    limit     = null,
    title     = 'Đơn đặt chỗ gần đây',
    onViewAll = null,
  } = options;

  const fmt  = new Intl.NumberFormat('vi-VN');
  const data = limit ? bookings.slice(0, limit) : bookings;

  // ── Build rows ──
  const rows = data.length === 0
    ? `<tr><td colspan="7" class="booking-empty">Chưa có đơn đặt chỗ nào.</td></tr>`
    : data.map(b => {
        const st = BOOKING_STATUS[b.status] || BOOKING_STATUS.pending;
        const PM_LABELS = { contact: 'Liên hệ', transfer: 'C/K', momo: 'MoMo', zalopay: 'ZaloPay', card: 'Thẻ' };
        const pmLabel = PM_LABELS[b.paymentMethod] || '—';
        const payStr = b.paymentStatus === 'paid' 
          ? `<span style="color:#16a34a;font-weight:700;font-size:11px;background:#dcfce7;padding:3px 8px;border-radius:12px;">Đã thanh toán (${pmLabel})</span>` 
          : `<span style="color:#dc2626;font-size:11px;background:#fee2e2;padding:3px 8px;border-radius:12px;">Chưa thanh toán</span>`;
        return `
          <tr>
            <td class="booking-id">${b.id}</td>
            <td class="booking-name">${b.customerName}</td>
            <td class="booking-svc" title="${b.serviceName}">${b.serviceName}</td>
            <td class="booking-date">${b.useDate}</td>
            <td class="booking-val">
              ${fmt.format(b.value)} <span style="font-weight:400;color:#aaa;font-size:11px">VND</span>
              <div style="margin-top:4px;">${payStr}</div>
            </td>
            <td>
              <span class="bk-status ${st.cls}">
                <span class="bk-dot"></span>${st.label}
              </span>
            </td>
            <td class="booking-actions">
              ${b.status === 'pending' ? `
                <button class="btn-action-mini btn-approve" onclick="updateBookingStatus('${b.rawId}', 'confirmed')" title="Duyệt đơn">✅</button>
                <button class="btn-action-mini btn-reject" onclick="updateBookingStatus('${b.rawId}', 'cancelled')" title="Từ chối">❌</button>
              ` : '<span style="color:#aaa;font-size:12px">Xong</span>'}
            </td>
          </tr>`;
      }).join('');

  // ── Render full component ──
  container.innerHTML = `
    <div class="booking-wrap">
      <div class="booking-header">
        <span class="booking-title">${title}</span>
        <button class="booking-view-all" id="${containerId}__view-all">Xem tất cả</button>
      </div>
      <div class="booking-table-scroll">
        <table class="booking-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Dịch vụ</th>
              <th>Ngày sử dụng</th>
              <th>Giá trị</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      ${bookings.length > data.length ? `
        <div class="booking-footer">
          <button class="booking-footer-link" id="${containerId}__see-more">
            Xem thêm ${bookings.length - data.length} đơn ↓
          </button>
        </div>` : ''}
    </div>`;

  // ── Sự kiện "Xem tất cả" ──
  const viewAllBtn = document.getElementById(`${containerId}__view-all`);
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', () => {
      if (typeof onViewAll === 'function') {
        onViewAll(bookings);
      } else {
        // Mặc định: render lại không giới hạn
        renderBookings(bookings, containerId, { ...options, limit: null, onViewAll });
      }
    });
  }

  // ── Sự kiện "Xem thêm" ──
  const seeMoreBtn = document.getElementById(`${containerId}__see-more`);
  if (seeMoreBtn) {
    seeMoreBtn.addEventListener('click', () => {
      renderBookings(bookings, containerId, { ...options, limit: null });
    });
  }

  // ── Dispatch event ──
  document.dispatchEvent(new CustomEvent('bookings:rendered', {
    detail: { total: bookings.length, shown: data.length }
  }));
}
