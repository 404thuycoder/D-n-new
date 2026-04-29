/**
 * filterServices.js
 * Chức năng filter dịch vụ theo tab (Tất cả | Đang hoạt động | Chờ duyệt | Tạm dừng)
 *
 * Yêu cầu load trước:
 *   <script src="mockData.js"></script>
 *   <script src="serviceCard.js"></script>
 *   <script src="filterServices.js"></script>
 *
 * Cách dùng:
 *   initServiceFilter('tab-bar', 'service-grid');
 */

// ─────────────────────────────────────────
//  Cấu hình tabs
// ─────────────────────────────────────────
const TAB_CONFIG = [
  { label: 'Tất cả',          status: 'all',     fn: () => getAllServices() },
  { label: 'Đang hoạt động',  status: 'active',  fn: () => getActiveServices() },
  { label: 'Chờ duyệt',       status: 'pending', fn: () => getPendingServices() },
  { label: 'Tạm dừng',        status: 'paused',  fn: () => getPausedServices() },
];

// ─────────────────────────────────────────
//  Inject CSS tab
// ─────────────────────────────────────────
(function injectTabStyles() {
  if (document.getElementById('filter-tab-styles')) return;
  const style = document.createElement('style');
  style.id = 'filter-tab-styles';
  style.textContent = `
    .filter-tab-bar {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-bottom: 20px;
      border-bottom: 2px solid #f0ecff;
      padding-bottom: 0;
      flex-wrap: wrap;
    }

    .filter-tab {
      position: relative;
      padding: 10px 18px;
      font-size: 13.5px;
      font-weight: 500;
      color: #888;
      cursor: pointer;
      border: none;
      background: none;
      border-radius: 8px 8px 0 0;
      transition: color 0.2s, background 0.2s;
      white-space: nowrap;
      bottom: -2px;
      border-bottom: 2px solid transparent;
      font-family: inherit;
    }

    .filter-tab:hover {
      color: #764ba2;
      background: #f8f5ff;
    }

    .filter-tab.is-active {
      color: #764ba2;
      font-weight: 700;
      border-bottom: 2px solid #764ba2;
      background: #f8f5ff;
    }

    .filter-tab__count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 20px;
      height: 20px;
      padding: 0 6px;
      background: #f0ecff;
      color: #764ba2;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 700;
      margin-left: 6px;
      transition: background 0.2s, color 0.2s;
    }

    .filter-tab.is-active .filter-tab__count {
      background: #764ba2;
      color: #fff;
    }

    /* Transition khi render lại danh sách */
    .svc-grid {
      transition: opacity 0.15s ease;
    }
    .svc-grid.is-fading {
      opacity: 0;
    }
  `;
  document.head.appendChild(style);
})();

// ─────────────────────────────────────────
//  Core: filterServices(status)
// ─────────────────────────────────────────
/**
 * Lọc dịch vụ theo trạng thái và render lại danh sách
 * @param {string} status - 'all' | 'active' | 'pending' | 'paused'
 * @param {string} gridId - ID của div chứa card (mặc định: 'service-grid')
 */
function filterServices(status, gridId = 'service-grid') {
  const tab = TAB_CONFIG.find(t => t.status === status) || TAB_CONFIG[0];
  const result = tab.fn();

  const grid = document.getElementById(gridId);
  if (!grid) return;

  // Fade out → render → fade in
  grid.classList.add('is-fading');
  setTimeout(() => {
    renderServices(result, gridId);
    grid.classList.remove('is-fading');
  }, 140);
}

// ─────────────────────────────────────────
//  Đếm số lượng theo trạng thái
// ─────────────────────────────────────────
function _countByStatus(status) {
  if (status === 'all') return getAllServices().length;
  return getAllServices().filter(s => s.status === status).length;
}

// ─────────────────────────────────────────
//  Render thanh tab vào container
// ─────────────────────────────────────────
function _renderTabBar(barEl, gridId, activeStatus) {
  barEl.innerHTML = TAB_CONFIG.map(tab => {
    const count = _countByStatus(tab.status);
    const isActive = tab.status === activeStatus;
    return `
      <button
        class="filter-tab ${isActive ? 'is-active' : ''}"
        data-status="${tab.status}"
        aria-selected="${isActive}"
      >
        ${tab.label}
        <span class="filter-tab__count">${count}</span>
      </button>`;
  }).join('');

  // Gắn sự kiện click
  barEl.querySelectorAll('.filter-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const status = btn.dataset.status;

      // Cập nhật active tab
      barEl.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      // Lọc và render lại
      filterServices(status, gridId);
    });
  });
}

// ─────────────────────────────────────────
//  initServiceFilter — Entry point
// ─────────────────────────────────────────
/**
 * Khởi tạo toàn bộ hệ thống tab filter
 * @param {string} tabBarId    - ID của div chứa tabs
 * @param {string} gridId      - ID của div chứa cards
 * @param {string} defaultTab  - Tab active mặc định ('all')
 */
function initServiceFilter(tabBarId = 'tab-bar', gridId = 'service-grid', defaultTab = 'all') {
  const barEl = document.getElementById(tabBarId);
  if (!barEl) {
    console.warn(`[filterServices] Không tìm thấy #${tabBarId}`);
    return;
  }

  barEl.className = 'filter-tab-bar';

  // Render tabs
  _renderTabBar(barEl, gridId, defaultTab);

  // Render danh sách mặc định
  filterServices(defaultTab, gridId);
}
