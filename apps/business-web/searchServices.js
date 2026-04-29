/**
 * searchServices.js
 * Thanh tìm kiếm realtime kết hợp với filter tab
 *
 * Load order:
 *   mockData.js → serviceCard.js → filterServices.js → searchServices.js
 *
 * Cách dùng:
 *   initSearchServices('search-input', 'tab-bar', 'service-grid');
 */

// ─────────────────────────────────────────
//  STATE — lưu trạng thái hiện tại
// ─────────────────────────────────────────
const _state = {
  keyword: '',
  status: 'all',
};

// ─────────────────────────────────────────
//  Inject CSS
// ─────────────────────────────────────────
(function injectSearchStyles() {
  if (document.getElementById('search-svc-styles')) return;
  const style = document.createElement('style');
  style.id = 'search-svc-styles';
  style.textContent = `
    .svc-search-wrap {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .svc-search-box {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
      max-width: 480px;
      background: #fff;
      border: 1.5px solid #ede8ff;
      border-radius: 12px;
      padding: 10px 16px;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .svc-search-box:focus-within {
      border-color: #764ba2;
      box-shadow: 0 0 0 3px rgba(118,75,162,0.1);
    }

    .svc-search-icon {
      font-size: 16px;
      color: #aaa;
      flex-shrink: 0;
    }

    .svc-search-input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 14px;
      color: #1a1a2e;
      background: transparent;
      font-family: inherit;
    }
    .svc-search-input::placeholder { color: #bbb; }

    .svc-search-clear {
      background: none;
      border: none;
      cursor: pointer;
      color: #bbb;
      font-size: 18px;
      line-height: 1;
      padding: 0;
      display: none;
      transition: color 0.15s;
    }
    .svc-search-clear:hover { color: #764ba2; }
    .svc-search-clear.visible { display: block; }

    .svc-result-count {
      font-size: 13px;
      color: #888;
      white-space: nowrap;
    }
    .svc-result-count strong { color: #764ba2; font-weight: 700; }

    /* Highlight từ khóa trong card */
    mark.svc-hl {
      background: #f3e8ff;
      color: #764ba2;
      border-radius: 2px;
      padding: 0 2px;
      font-weight: 700;
    }

    /* Empty state */
    .svc-no-result {
      grid-column: 1 / -1;
      text-align: center;
      padding: 4rem 2rem;
      color: #aaa;
    }
    .svc-no-result .no-result-icon { font-size: 48px; margin-bottom: 12px; }
    .svc-no-result h3 { font-size: 16px; font-weight: 700; color: #666; margin-bottom: 6px; }
    .svc-no-result p  { font-size: 13px; }
  `;
  document.head.appendChild(style);
})();

// ─────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────
function _normalize(str) {
  return str.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase().trim();
}

function _highlight(text, keyword) {
  if (!keyword) return text;
  const normText = _normalize(text);
  const normKw   = _normalize(keyword);
  if (!normText.includes(normKw)) return text;

  let result = '';
  let lastIdx = 0;
  let idx = normText.indexOf(normKw);
  while (idx !== -1) {
    result += text.slice(lastIdx, idx);
    result += `<mark class="svc-hl">${text.slice(idx, idx + normKw.length)}</mark>`;
    lastIdx = idx + normKw.length;
    idx = normText.indexOf(normKw, lastIdx);
  }
  return result + text.slice(lastIdx);
}

// ─────────────────────────────────────────
//  searchServices(keyword)
//  Lọc theo keyword (tên + địa điểm), kết hợp status hiện tại
// ─────────────────────────────────────────
/**
 * @param {string} keyword - Từ khóa tìm kiếm
 * @returns {Array} Danh sách dịch vụ đã lọc
 */
function searchServices(keyword) {
  _state.keyword = keyword;

  // 1. Lấy pool theo status tab hiện tại
  let pool = getAllServices();
  if (_state.status !== 'all') {
    pool = pool.filter(s => s.status === _state.status);
  }

  // 2. Filter theo keyword
  const kw = _normalize(keyword);
  if (!kw) return pool;

  return pool.filter(s =>
    _normalize(s.name).includes(kw) ||
    _normalize(s.location).includes(kw)
  );
}

// ─────────────────────────────────────────
//  Render có highlight
// ─────────────────────────────────────────
function _renderWithHighlight(services, gridId, keyword) {
  const fmt = new Intl.NumberFormat('vi-VN');
  const container = document.getElementById(gridId);
  if (!container) return;

  container.className = 'svc-grid';

  if (!services.length) {
    container.innerHTML = `
      <div class="svc-no-result">
        <div class="no-result-icon">🔍</div>
        <h3>Không tìm thấy kết quả</h3>
        <p>Thử tìm với từ khóa khác hoặc chọn tab khác.</p>
      </div>`;
    return;
  }

  const STATUS_LABEL = {
    active:  { text: 'Đang hoạt động', cls: 'svc-badge--active' },
    pending: { text: 'Chờ duyệt',      cls: 'svc-badge--pending' },
    paused:  { text: 'Tạm dừng',       cls: 'svc-badge--paused' },
  };

  container.innerHTML = services.map(svc => {
    const st = STATUS_LABEL[svc.status] || STATUS_LABEL.paused;
    const hName = _highlight(svc.name, keyword);
    const hLoc  = _highlight(svc.location, keyword);
    const rating = svc.rating
      ? `⭐ ${svc.rating} <span class="count">(${svc.bookings})</span>`
      : '<span class="count">Chưa có đánh giá</span>';

    return `
      <div class="svc-card" data-id="${svc.id}">
        <div class="svc-card__img">
          <img src="${svc.image}" alt="${svc.name}" loading="lazy">
          <select class="svc-badge ${st.cls}" onchange="updateServiceStatus('${svc.id}', this.value)" onclick="event.stopPropagation()">
            <option value="active" ${svc.status === 'active' ? 'selected' : ''}>Đang hoạt động</option>
            <option value="pending" ${svc.status === 'pending' ? 'selected' : ''}>Chờ duyệt</option>
            <option value="paused" ${svc.status === 'paused' ? 'selected' : ''}>Tạm dừng</option>
          </select>
          <div class="svc-type-chip">${svc.type}</div>
        </div>
        <div class="svc-card__body">
          <div class="svc-card__name">${hName}</div>
          <div class="svc-card__loc">📍 ${hLoc}</div>
          <div class="svc-card__price">
            ${fmt.format(svc.price)}<span>VND / ${svc.unit}</span>
          </div>
          <div class="svc-card__foot">
            <div class="svc-rating">${rating}</div>
            <div class="svc-bookings">Đã đặt: <strong>${svc.bookings}</strong></div>
          </div>
        </div>
      </div>`;
  }).join('');
}

// ─────────────────────────────────────────
//  Hàm tổng hợp: apply cả filter + search
// ─────────────────────────────────────────
function _applyFilters(gridId, countEl) {
  const result = searchServices(_state.keyword);

  // Truyền data qua module Phân trang nếu có, nếu không thì render trực tiếp
  if (typeof applyPaginationToData === 'function') {
    applyPaginationToData(result, gridId, _state.keyword);
  } else {
    // Fade (fallback)
    const grid = document.getElementById(gridId);
    if (grid) grid.classList.add('is-fading');

    setTimeout(() => {
      _renderWithHighlight(result, gridId, _state.keyword);
      if (grid) grid.classList.remove('is-fading');
    }, 140);
  }

  // Cập nhật số lượng kết quả
  if (countEl) {
    countEl.innerHTML = _state.keyword
      ? `<strong>${result.length}</strong> kết quả cho "<strong>${_state.keyword}</strong>"`
      : `<strong>${result.length}</strong> dịch vụ`;
  }
}

// ─────────────────────────────────────────
//  Patch filterServices để sync state
// ─────────────────────────────────────────
function _patchTabFilter(tabBarId, gridId, countEl) {
  const bar = document.getElementById(tabBarId);
  if (!bar) return;

  bar.addEventListener('click', e => {
    const btn = e.target.closest('.filter-tab');
    if (!btn) return;

    // Cập nhật active tab UI
    bar.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');

    // Sync state và apply
    _state.status = btn.dataset.status || 'all';
    _applyFilters(gridId, countEl);
  });
}

// ─────────────────────────────────────────
//  initSearchServices — Entry point
// ─────────────────────────────────────────
/**
 * Khởi tạo thanh tìm kiếm kết hợp với tab filter
 * @param {string} wrapId   - ID div chứa search box (sẽ inject HTML vào đây)
 * @param {string} tabBarId - ID div chứa tabs
 * @param {string} gridId   - ID div chứa card grid
 */
function initSearchServices(wrapId = 'search-wrap', tabBarId = 'tab-bar', gridId = 'service-grid') {
  const wrap = document.getElementById(wrapId);
  if (!wrap) {
    console.warn(`[searchServices] Không tìm thấy #${wrapId}`);
    return;
  }

  // Render search UI
  wrap.className = 'svc-search-wrap';
  wrap.innerHTML = `
    <div class="svc-search-box">
      <span class="svc-search-icon">🔍</span>
      <input
        id="_svc_search_input"
        class="svc-search-input"
        type="text"
        placeholder="Tìm theo tên dịch vụ, địa điểm..."
        autocomplete="off"
      >
      <button id="_svc_search_clear" class="svc-search-clear" title="Xóa">✕</button>
    </div>
    <div id="_svc_result_count" class="svc-result-count"></div>
  `;

  const input    = document.getElementById('_svc_search_input');
  const clearBtn = document.getElementById('_svc_search_clear');
  const countEl  = document.getElementById('_svc_result_count');

  // Input event — debounce 200ms
  let debounceTimer;
  input.addEventListener('input', () => {
    const kw = input.value;
    clearBtn.classList.toggle('visible', kw.length > 0);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => _applyFilters(gridId, countEl), 200);
  });

  // Clear button
  clearBtn.addEventListener('click', () => {
    input.value = '';
    _state.keyword = '';
    clearBtn.classList.remove('visible');
    _applyFilters(gridId, countEl);
    input.focus();
  });

  // Patch tab click để sync với search
  _patchTabFilter(tabBarId, gridId, countEl);

  // Render lần đầu
  _applyFilters(gridId, countEl);
}
