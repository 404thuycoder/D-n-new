/**
 * dashboardStats.js
 * Tính toán và hiển thị Dashboard Thống kê
 *
 * Load order:
 *   mockData.js → dashboardStats.js
 *
 * Cách dùng:
 *   <div id="dashboard-stats"></div>
 *   renderStats('dashboard-stats');
 */

// ─────────────────────────────────────────
//  Hàm tính toán (Business Logic)
// ─────────────────────────────────────────
/**
 * Tính toán các chỉ số từ dữ liệu thật
 * @returns {Object} object chứa các chỉ số
 */
function calculateStats() {
  const services = getAllServices();
  const bookings = getBookings();

  // 1. Tổng dịch vụ
  const totalServices = services.length;

  // 2. Tổng đơn đặt chỗ
  const totalBookings = bookings.length;

  // 3. Tổng doanh thu (chỉ tính đơn 'confirmed')
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.value, 0);

  // 4. Rating trung bình (chỉ tính các dịch vụ có rating > 0)
  const ratedServices = services.filter(s => s.rating > 0);
  const avgRating = ratedServices.length > 0
    ? ratedServices.reduce((sum, s) => sum + s.rating, 0) / ratedServices.length
    : 0;

  return {
    totalServices,
    totalBookings,
    totalRevenue,
    avgRating: avgRating.toFixed(1),
    ratedServicesCount: ratedServices.length
  };
}

// ─────────────────────────────────────────
//  Hàm Render UI (View)
// ─────────────────────────────────────────
/**
 * Render thẻ thống kê ra UI
 * @param {string} containerId - ID của container
 */
function renderStats(containerId = 'dashboard-stats') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const stats = calculateStats();
  
  // Format doanh thu thành triệu đồng (M)
  const revenueStr = (stats.totalRevenue / 1000000).toFixed(1) + 'M';

  // Note: CSS cho các class này (.stats, .stat, .stat-icon...) đã có sẵn trong index.html
  container.innerHTML = `
    <div class="stats">
      <!-- Card Tổng dịch vụ -->
      <div class="stat">
        <div class="stat-icon si-blue">🧳</div>
        <div class="stat-label">Tổng dịch vụ</div>
        <div class="stat-num" id="stat-val-services">${stats.totalServices}</div>
        <div class="stat-trend">Cập nhật lúc này</div>
      </div>

      <!-- Card Tổng đơn -->
      <div class="stat">
        <div class="stat-icon si-green">📅</div>
        <div class="stat-label">Đơn đặt chỗ</div>
        <div class="stat-num" id="stat-val-bookings">${stats.totalBookings}</div>
        <div class="stat-trend">Cập nhật lúc này</div>
      </div>

      <!-- Card Doanh thu -->
      <div class="stat">
        <div class="stat-icon si-purple">💰</div>
        <div class="stat-label">Doanh thu</div>
        <div class="stat-num" style="font-size:21px" id="stat-val-revenue">
          ${revenueStr} <span style="font-size:13px;font-weight:500">VND</span>
        </div>
        <div class="stat-trend">Từ đơn đã xác nhận</div>
      </div>

      <!-- Card Đánh giá -->
      <div class="stat">
        <div class="stat-icon si-yellow">⭐</div>
        <div class="stat-label">Đánh giá trung bình</div>
        <div class="stat-num" id="stat-val-rating">
          ${stats.avgRating}<span style="font-size:15px;font-weight:500">/5</span>
        </div>
        <div class="stat-trend">Từ ${stats.ratedServicesCount} dịch vụ</div>
      </div>
    </div>
  `;
}
