/**
 * paginationServices.js
 * Chức năng phân trang cho danh sách dịch vụ
 *
 * Load order:
 *   mockData.js → serviceCard.js → filterServices.js → searchServices.js → paginationServices.js
 */

// ─────────────────────────────────────────
//  Trạng thái Phân trang
// ─────────────────────────────────────────
const _pageState = {
  page: 1,
  limit: 8,
  dataPool: [],     // Dữ liệu đã qua filter/search
  keyword: '',      // Keyword hiện tại để highlight
  gridId: 'service-grid'
};

// ─────────────────────────────────────────
//  Inject CSS Phân trang
// ─────────────────────────────────────────
(function injectPaginationStyles() {
  if (document.getElementById('pagination-styles')) return;
  const style = document.createElement('style');
  style.id = 'pagination-styles';
  style.textContent = `
    .svc-pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 24px;
      padding: 16px 0;
      border-top: 1px solid #f0ecff;
    }
    
    .svc-page-btn {
      min-width: 36px;
      height: 36px;
      border-radius: 10px;
      border: 1.5px solid #ede8ff;
      background: #fff;
      color: #666;
      font-size: 13px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      padding: 0 12px;
      font-family: inherit;
    }
    
    .svc-page-btn:hover:not(:disabled) {
      border-color: #c4b5fd;
      color: #764ba2;
    }
    
    .svc-page-btn.is-active {
      background: #764ba2;
      border-color: #764ba2;
      color: #fff;
    }
    
    .svc-page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: #faf8ff;
    }

    .svc-page-info {
      font-size: 13px;
      color: #888;
      margin: 0 12px;
    }
  `;
  document.head.appendChild(style);
})();

// ─────────────────────────────────────────
//  Hàm Render UI Phân trang
// ─────────────────────────────────────────
function _renderPaginationUI(totalItems) {
  // Tìm hoặc tạo container phân trang ngay dưới grid
  const grid = document.getElementById(_pageState.gridId);
  if (!grid) return;
  
  let wrap = document.getElementById('svc-pagination-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'svc-pagination-wrap';
    // Chèn ngay sau grid
    grid.parentNode.insertBefore(wrap, grid.nextSibling);
  }

  const totalPages = Math.ceil(totalItems / _pageState.limit);
  
  // Ẩn phân trang nếu chỉ có 1 trang hoặc không có data
  if (totalPages <= 1) {
    wrap.innerHTML = '';
    return;
  }

  const { page } = _pageState;
  let html = `<div class="svc-pagination">`;
  
  // Nút Prev
  html += `<button class="svc-page-btn" ${page === 1 ? 'disabled' : ''} onclick="paginateServices(${page - 1})">Trước</button>`;
  
  // Các số trang
  for (let i = 1; i <= totalPages; i++) {
    if (i === page) {
      html += `<button class="svc-page-btn is-active">${i}</button>`;
    } else {
      html += `<button class="svc-page-btn" onclick="paginateServices(${i})">${i}</button>`;
    }
  }
  
  // Nút Next
  html += `<button class="svc-page-btn" ${page === totalPages ? 'disabled' : ''} onclick="paginateServices(${page + 1})">Sau</button>`;
  
  html += `</div>`;
  wrap.innerHTML = html;
}

// ─────────────────────────────────────────
//  Hàm Chính: paginateServices
// ─────────────────────────────────────────
/**
 * Chuyển trang và render lại danh sách
 * @param {number} page  - Trang cần chuyển đến
 * @param {number} limit - Số item trên 1 trang (optional, mặc định giữ nguyên)
 */
function paginateServices(page, limit) {
  if (limit) _pageState.limit = limit;
  
  const totalItems = _pageState.dataPool.length;
  const totalPages = Math.ceil(totalItems / _pageState.limit);
  
  // Validate page
  if (page < 1) page = 1;
  if (page > totalPages) page = totalPages || 1;
  
  _pageState.page = page;

  // Lấy data cho trang hiện tại
  const start = (page - 1) * _pageState.limit;
  const end = start + _pageState.limit;
  const pageData = _pageState.dataPool.slice(start, end);

  // Hiển thị Skeleton Loading (Giả lập loading data)
  if (typeof renderSkeletonServices === 'function') {
    renderSkeletonServices(_pageState.gridId, pageData.length || _pageState.limit);
  }

  // Set thời gian đợi 400ms để hiệu ứng skeleton kịp hiển thị
  setTimeout(() => {
    // Render HTML card thật
    if (typeof _renderWithHighlight === 'function') {
      _renderWithHighlight(pageData, _pageState.gridId, _pageState.keyword);
    } else if (typeof renderServices === 'function') {
      renderServices(pageData, _pageState.gridId);
    }
    
    // Render nút phân trang
    _renderPaginationUI(totalItems);
  }, 400);
}

// ─────────────────────────────────────────
//  Hàm Intercept Data (Gắn vào search/filter)
// ─────────────────────────────────────────
/**
 * Nhận dữ liệu từ Search/Filter, reset về trang 1 và bắt đầu phân trang
 */
function applyPaginationToData(data, gridId, keyword = '') {
  _pageState.dataPool = data;
  _pageState.gridId = gridId;
  _pageState.keyword = keyword;
  
  // Mặc định luôn reset về trang 1 khi filter/search mới
  paginateServices(1);
}
