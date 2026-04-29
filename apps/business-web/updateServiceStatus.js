/**
 * updateServiceStatus.js
 * Chức năng đổi trạng thái dịch vụ (active | pending | paused)
 *
 * Yêu cầu:
 *   mockData.js
 */

/**
 * Cập nhật trạng thái của dịch vụ
 * @param {string} id - ID dịch vụ
 * @param {string} newStatus - Trạng thái mới (active | pending | paused)
 */
function updateServiceStatus(id, newStatus) {
  const allServices = getAllServices();
  const index = allServices.findIndex(s => s.id === id);
  
  if (index !== -1) {
    allServices[index].status = newStatus;
    console.log(`[updateServiceStatus] Đã đổi ${id} thành ${newStatus}`);
    
    // ── Cập nhật lại giao diện ──
    if (typeof _applyFilters === 'function') {
        // Đang ở luồng Search + Filter
        const countEl = document.getElementById('_svc_result_count');
        _applyFilters('service-grid', countEl);
        
        // Cập nhật lại số lượng badge trên Tab
        const tabBar = document.getElementById('tab-bar');
        if (tabBar && typeof _renderTabBar === 'function') {
           const activeTab = tabBar.querySelector('.filter-tab.is-active');
           const currentStatus = activeTab ? activeTab.dataset.status : 'all';
           _renderTabBar(tabBar, 'service-grid', currentStatus);
        }
    } else if (typeof filterServices === 'function') {
        // Chỉ có luồng Filter
        const activeTab = document.querySelector('.filter-tab.is-active');
        const status = activeTab ? activeTab.dataset.status : 'all';
        filterServices(status);
    } else if (typeof renderServices === 'function') {
        // Luồng cơ bản
        renderServices(allServices, 'service-grid');
    }
  } else {
    console.warn(`[updateServiceStatus] Không tìm thấy dịch vụ ID: ${id}`);
  }
}
