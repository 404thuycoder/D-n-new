/**
 * durationFilter.js
 * Bộ lọc "Thời gian du lịch" (dành riêng cho các dịch vụ loại Tour)
 *
 * Load order:
 *   mockData.js → ... → searchServices.js → durationFilter.js
 *
 * Cách dùng:
 *   <div id="duration-filter-wrap"></div>
 *   initDurationFilter('duration-filter-wrap');
 */

// Biến global lưu state của duration filter
window._durationRange = 'all';

// ─────────────────────────────────────────
//  Inject CSS Phân trang
// ─────────────────────────────────────────
(function injectDurationStyles() {
  if (document.getElementById('duration-filter-styles')) return;
  const style = document.createElement('style');
  style.id = 'duration-filter-styles';
  style.textContent = `
    .duration-filter {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
      flex-wrap: wrap;
    }
    .duration-lbl {
      font-size: 13px;
      font-weight: 700;
      color: #1a1a2e;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .duration-chip {
      padding: 6px 14px;
      border-radius: 20px;
      border: 1px solid #e8e8f0;
      background: #fff;
      color: #666;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-family: inherit;
    }
    .duration-chip:hover {
      border-color: #c4b5fd;
      color: #764ba2;
      background: #faf8ff;
    }
    .duration-chip.is-active {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: #fff;
      border-color: transparent;
      box-shadow: 0 4px 10px rgba(118, 75, 162, 0.2);
    }
  `;
  document.head.appendChild(style);
})();

// ─────────────────────────────────────────
//  Hàm Chính: filterByDuration
// ─────────────────────────────────────────
/**
 * Lọc danh sách tour theo duration
 * @param {string} range - 'all' | '1' | '2-3' | '4-7' | '7+'
 */
function filterByDuration(range) {
  window._durationRange = range;
  
  // Update UI chips
  const wrap = document.getElementById('duration-filter-wrap');
  if (wrap) {
    wrap.querySelectorAll('.duration-chip').forEach(btn => {
      if (btn.dataset.range === range) {
        btn.classList.add('is-active');
      } else {
        btn.classList.remove('is-active');
      }
    });
  }
  
  // Trigger filter & render lại
  if (typeof _applyFilters === 'function') {
    const countEl = document.getElementById('_svc_result_count');
    _applyFilters('service-grid', countEl);
  } else if (typeof renderServices === 'function') {
    // Fallback nếu không có hệ thống filter
    renderServices(getAllServices(), 'service-grid');
  }
}

// ─────────────────────────────────────────
//  Hàm Khởi Tạo
// ─────────────────────────────────────────
function initDurationFilter(wrapId = 'duration-filter-wrap') {
  const wrap = document.getElementById(wrapId);
  if (!wrap) return;

  const RANGES = [
    { value: 'all', label: 'Tất cả' },
    { value: '1',   label: '1 ngày' },
    { value: '2-3', label: '2-3 ngày' },
    { value: '4-7', label: '4-7 ngày' },
    { value: '7+',  label: '7+ ngày' }
  ];

  let html = `<div class="duration-filter">
    <div class="duration-lbl">⏱️ Thời gian:</div>
  `;
  
  RANGES.forEach(r => {
    const active = r.value === window._durationRange ? 'is-active' : '';
    html += `<button class="duration-chip ${active}" data-range="${r.value}" onclick="filterByDuration('${r.value}')">${r.label}</button>`;
  });
  
  html += `</div>`;
  wrap.innerHTML = html;
}
