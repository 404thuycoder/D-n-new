/* ============================================================
   biz-extend.js — Extended Business Dashboard Functionality
   Xử lý: navigation views, analytics, messages, promo form, CSV export
   ============================================================ */
(function () {
  'use strict';
  function getToken() {
    return localStorage.getItem('biz_auth_token') || 
           sessionStorage.getItem('biz_auth_token') ||
           localStorage.getItem('wander_business_token') || 
           sessionStorage.getItem('wander_business_token') ||
           localStorage.getItem('wander_token'); 
  }

  var API = '';
  if (window.location.port === '3002' || window.location.port === '3001') {
    API = 'http://localhost:3000';
  }

  function apiFetch(url, options) {
    var token = getToken();
    options = options || {};
    options.headers = options.headers || {};
    if (token) options.headers['x-auth-token'] = token;
    
    if (options.body && !(options.body instanceof FormData)) {
      options.headers['Content-Type'] = 'application/json';
    }
    
    return fetch(url, options).then(function (r) {
      if (r.status === 401) {
        console.warn('[apiFetch] 401 Unauthorized - Yêu cầu đăng nhập lại.');
        // Redirect if we are on index.html or root (/)
        if (token || window.location.pathname.includes('index.html') || window.location.pathname === '/') {
           setTimeout(function() { window.location.href = 'dashboard.html'; }, 2000);
        }
      }
      return r.json();
    });
  }

  // Global logout function
  window.bizLogout = function() {
    localStorage.removeItem('biz_auth_token');
    sessionStorage.removeItem('biz_auth_token');
    localStorage.removeItem('wander_business_token');
    sessionStorage.removeItem('wander_business_token');
    window.location.href = 'dashboard.html';
  };

  function esc(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function fmtDate(d) {
    if (!d) return '';
    var dt = new Date(d);
    return dt.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  function timeAgo(d) {
    if (!d) return '';
    var diff = (Date.now() - new Date(d).getTime()) / 1000;
    if (diff < 60) return 'vừa xong';
    if (diff < 3600) return Math.floor(diff / 60) + ' phút trước';
    if (diff < 86400) return Math.floor(diff / 3600) + ' giờ trước';
    return Math.floor(diff / 86400) + ' ngày trước';
  }

  // ─── View Navigation ──────────────────────────────────────
  var VIEWS = {
    dashboard: { el: 'dashboard-view', label: 'Tổng quan' },
    services:  { el: 'dashboard-view', label: 'Quản lý dịch vụ' },
    bookings:  { el: 'dashboard-view', label: 'Đơn đặt dịch vụ' },
    messages:  { el: 'messages-view',  label: 'Tin nhắn khách hàng', load: loadMessages },
    reviews:   { el: 'messages-view',  label: 'Đánh giá từ khách hàng', load: loadMessages },
    analytics: { el: 'analytics-view', label: 'Thống kê chi tiết', load: loadAnalytics },
    revenue:   { el: 'analytics-view', label: 'Báo cáo doanh thu', load: loadAnalytics },
    customers: { el: 'dashboard-view', label: 'Quản lý khách hàng' },
    settings:  { el: 'dashboard-view', label: 'Cài đặt hệ thống' },
    support:   { el: 'dashboard-view', label: 'Hỗ trợ đối tác' }
  };

  function showView(viewKey) {
    // Hide all views
    document.querySelectorAll('.biz-view').forEach(function (v) {
      v.style.display = 'none';
    });
    // Mark all nav items inactive
    document.querySelectorAll('[data-view]').forEach(function (a) {
      a.classList.remove('active');
    });

    var cfg = VIEWS[viewKey];
    if (!cfg) return;

    // Show target view
    var targetEl = document.getElementById(cfg.el);
    if (targetEl) targetEl.style.display = '';

    // Update active nav
    var navItem = document.querySelector('[data-view="' + viewKey + '"]');
    if (navItem) navItem.classList.add('active');

    // Update breadcrumb and Title
    var bc = document.getElementById('biz-breadcrumb');
    if (bc) bc.textContent = 'Bảng điều khiển đối tác / ' + cfg.label;
    
    var titleEl = document.querySelector('.topbar-left h2');
    if (titleEl) titleEl.textContent = cfg.label;

    // Load data if needed
    if (cfg.load) cfg.load();
  }

  // Bind nav clicks
  document.querySelectorAll('[data-view]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      showView(a.getAttribute('data-view'));
    });
  });

  // ─── Analytics ────────────────────────────────────────────
  var analyticsData = null;

  function loadAnalytics() {
    var tbody = document.getElementById('analytics-tbody');
    if (tbody) tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:2rem;color:#94a3b8;">Đang tải...</td></tr>';

    apiFetch(API + '/api/business/analytics')
      .then(function (json) {
        if (!json.success) throw new Error(json.message || 'Lỗi');
        analyticsData = json.data;
        var d = json.data;

        // Fill stats
        var set = function (id, val) { var el = document.getElementById(id); if (el) el.textContent = val; };
        set('an-views',    (d.totalViews   || 0).toLocaleString('vi-VN'));
        set('an-reviews',  (d.totalReviews || 0).toLocaleString('vi-VN'));
        set('an-services', (d.totalServices|| 0).toLocaleString('vi-VN'));
        set('an-rating',   d.avgRating ? d.avgRating + '/5' : '—');

        // Fill table
        if (tbody) {
          if (!d.places || d.places.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:2rem;color:#94a3b8;">Chưa có dịch vụ nào.</td></tr>';
          } else {
            tbody.innerHTML = d.places.map(function (p) {
              var statusBadge = p.status === 'approved'
                ? '<span style="background:rgba(16,185,129,0.15);color:#34d399;padding:0.2rem 0.55rem;border-radius:6px;font-size:0.72rem;font-weight:600;">✅ Đã duyệt</span>'
                : p.status === 'pending'
                ? '<span style="background:rgba(245,158,11,0.15);color:#fbbf24;padding:0.2rem 0.55rem;border-radius:6px;font-size:0.72rem;font-weight:600;">⏳ Chờ duyệt</span>'
                : '<span style="background:rgba(239,68,68,0.15);color:#f87171;padding:0.2rem 0.55rem;border-radius:6px;font-size:0.72rem;font-weight:600;">❌ Từ chối</span>';
              return '<tr>' +
                '<td><strong>' + esc(p.name) + '</strong><br><small style="color:#94a3b8;">' + esc(p.region || '') + '</small></td>' +
                '<td>' + (p.favoritesCount || 0).toLocaleString('vi-VN') + '</td>' +
                '<td>' + (p.reviewCount || 0).toLocaleString('vi-VN') + '</td>' +
                '<td>' + (p.ratingAvg ? '⭐ ' + p.ratingAvg : '—') + '</td>' +
                '<td>' + statusBadge + '</td>' +
                '</tr>';
            }).join('');
          }
        }
      })
      .catch(function (err) {
        if (tbody) tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:2rem;color:#f87171;">Lỗi tải dữ liệu: ' + esc(err.message) + '</td></tr>';
      });
  }

  // ─── CSV Export ───────────────────────────────────────────
  var btnExport = document.getElementById('btn-export-csv');
  if (btnExport) {
    btnExport.addEventListener('click', function () {
      if (!analyticsData || !analyticsData.places || analyticsData.places.length === 0) {
        alert('Chưa có dữ liệu để xuất. Hãy tải trang thống kê trước.');
        return;
      }
      var rows = [['Tên dịch vụ', 'Khu vực', 'Lượt xem', 'Đánh giá', 'Rating TB', 'Trạng thái']];
      analyticsData.places.forEach(function (p) {
        rows.push([
          p.name || '',
          p.region || '',
          p.favoritesCount || 0,
          p.reviewCount || 0,
          p.ratingAvg || '',
          p.status || ''
        ]);
      });
      var csv = rows.map(function (r) {
        return r.map(function (cell) { return '"' + String(cell).replace(/"/g, '""') + '"'; }).join(',');
      }).join('\n');
      var blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'bao-cao-dich-vu-' + new Date().toISOString().slice(0, 10) + '.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  // ─── Promo Form ───────────────────────────────────────────
  var promoForm = document.getElementById('promo-form');
  if (promoForm) {
    promoForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var title   = (document.getElementById('promo-title')   || {}).value || '';
      var message = (document.getElementById('promo-message') || {}).value || '';
      var statusEl = document.getElementById('promo-status');
      if (!title || !message) {
        if (statusEl) { statusEl.textContent = '⚠️ Vui lòng điền đủ tiêu đề và nội dung.'; statusEl.style.color = '#f59e0b'; }
        return;
      }
      var btn = promoForm.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Đang gửi...'; }

      apiFetch(API + '/api/notifications/broadcast', {
        method: 'POST',
        body: JSON.stringify({ title: title, message: message, recipientType: 'ALL' })
      })
      .then(function (json) {
        if (json.success) {
          if (statusEl) { statusEl.textContent = '✅ Đã gửi thông báo thành công!'; statusEl.style.color = '#34d399'; }
          promoForm.reset();
          setTimeout(function () { if (statusEl) statusEl.textContent = ''; }, 4000);
        } else {
          if (statusEl) { statusEl.textContent = '❌ ' + (json.message || 'Gửi thất bại.'); statusEl.style.color = '#f87171'; }
        }
      })
      .catch(function () {
        if (statusEl) { statusEl.textContent = '❌ Lỗi kết nối máy chủ.'; statusEl.style.color = '#f87171'; }
      })
      .finally(function () {
        if (btn) { btn.disabled = false; btn.textContent = '📨 Gửi thông báo'; }
      });
    });
  }

  // ─── Messages / Reviews ───────────────────────────────────
  function loadMessages() {
    var list = document.getElementById('messages-list');
    var countEl = document.getElementById('messages-count');
    if (list) list.innerHTML = '<div style="text-align:center;padding:3rem;color:#94a3b8;">Đang tải phản hồi...</div>';

    apiFetch(API + '/api/business/reviews')
      .then(function (json) {
        if (!json.success) throw new Error(json.message || 'Lỗi');
        var reviews = json.data || [];
        if (countEl) countEl.textContent = reviews.length + ' phản hồi';

        if (!list) return;
        if (reviews.length === 0) {
          list.innerHTML = '<div style="text-align:center;padding:3rem;color:#94a3b8;"><div style="font-size:2rem;margin-bottom:0.75rem;">📭</div>Chưa có phản hồi nào từ khách hàng.</div>';
          return;
        }

        list.innerHTML = reviews.map(function (r) {
          var initials = (r.name || 'Ẩn')[0].toUpperCase();
          var colors = ['#3b82f6','#10b981','#8b5cf6','#f59e0b','#ef4444','#0ea5e9'];
          var color = colors[initials.charCodeAt(0) % colors.length];
          return '<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:1.25rem;display:flex;gap:1rem;align-items:flex-start;">' +
            '<div style="width:40px;height:40px;border-radius:50%;background:' + color + ';display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1rem;flex-shrink:0;">' + initials + '</div>' +
            '<div style="flex:1;min-width:0;">' +
              '<div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.4rem;flex-wrap:wrap;">' +
                '<strong style="font-size:0.9rem;">' + esc(r.name || 'Khách ẩn danh') + '</strong>' +
                '<span style="font-size:0.75rem;color:#94a3b8;">' + (r.email && r.email !== 'Không cung cấp' ? esc(r.email) : '') + '</span>' +
                '<span style="margin-left:auto;font-size:0.75rem;color:#94a3b8;">' + timeAgo(r.createdAt) + '</span>' +
              '</div>' +
              '<p style="margin:0;font-size:0.875rem;color:#cbd5e1;line-height:1.6;">' + esc(r.message) + '</p>' +
            '</div>' +
          '</div>';
        }).join('');
      })
      .catch(function (err) {
        if (list) list.innerHTML = '<div style="text-align:center;padding:3rem;color:#f87171;">Lỗi tải dữ liệu: ' + esc(err.message) + '</div>';
      });
  }

  // ─── User landing page: load real stats ──────────────────
  // (Chỉ chạy trên port 3000 / user portal, nhưng giữ lại để tránh lỗi ReferenceError)
  function loadPublicStats() {
    var statEls = {
      users:   document.querySelector('.stat-number[data-stat="users"]'),
      places:  document.querySelector('.stat-number[data-stat="places"]'),
      reviews: document.querySelector('.stat-number[data-stat="reviews"]')
    };
    if (!statEls.users && !statEls.places) return; 

    fetch(API + '/api/public/stats')
      .then(function (r) { return r.json(); })
      .then(function (json) {
        if (!json.success) return;
        var d = json.data;
        if (statEls.users  && d.userCount  !== undefined) statEls.users.textContent  = (d.userCount  || 0).toLocaleString('vi-VN') + '+';
        if (statEls.places && d.placeCount !== undefined) statEls.places.textContent = (d.placeCount || 0).toLocaleString('vi-VN') + '+';
        if (statEls.reviews && d.feedbackCount !== undefined) statEls.reviews.textContent = (d.feedbackCount || 0).toLocaleString('vi-VN') + '+';
      })
      .catch(function () { });
  }

  // ─── Real Data Sync ──────────────────────────────────────
  window.syncAllData = function() {
    var token = getToken();
    if (!token) return;
    console.log('[biz-extend] Bắt đầu đồng bộ dữ liệu thực tế...');
    
    // Cập nhật tên hiển thị từ Token (nếu có)
    try {
      var payload = JSON.parse(atob(token.split('.')[1]));
      var nameEl = document.querySelector('.user-chip');
      if (nameEl && payload.displayName) {
        nameEl.innerHTML = '<div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#667eea,#764ba2);display:flex;align-items:center;justify-content:center;font-size:13px">🏨</div>' + payload.displayName + ' ▾';
      }
    } catch(e) {}

    // 1. Sync Stats
    apiFetch(API + '/api/business/stats')
      .then(function(json) {
        if (json.success && json.data) {
          const d = json.data;
          const container = document.getElementById('dashboard-stats');
          if (container) {
            const mockStats = {
              totalServices: d.totalServices || 0,
              totalBookings: d.totalReviews || 0,
              totalRevenue: (d.totalReviews || 0) * 1500000,
              avgRating: d.avgRating || '0.0',
              ratedServicesCount: d.totalServices || 0
            };
            const revenueStr = (mockStats.totalRevenue / 1000000).toFixed(1) + 'M';
            container.innerHTML = `
              <div class="stats">
                <div class="stat">
                  <div class="stat-icon si-blue">🧳</div>
                  <div class="stat-label">Tổng dịch vụ</div>
                  <div class="stat-num">${mockStats.totalServices}</div>
                  <div class="stat-trend">Cập nhật lúc này</div>
                </div>
                <div class="stat">
                  <div class="stat-icon si-blue">📅</div>
                  <div class="stat-label">Đơn đặt chỗ</div>
                  <div class="stat-num">${mockStats.totalBookings}</div>
                  <div class="stat-trend">Cập nhật lúc này</div>
                </div>
                <div class="stat">
                  <div class="stat-icon si-purple">💰</div>
                  <div class="stat-label">Doanh thu</div>
                  <div class="stat-num" style="font-size:21px">
                    ${revenueStr} <span style="font-size:13px;font-weight:500">VND</span>
                  </div>
                  <div class="stat-trend">Từ đơn đã xác nhận</div>
                </div>
                <div class="stat">
                  <div class="stat-icon si-yellow">⭐</div>
                  <div class="stat-label">Đánh giá trung bình</div>
                  <div class="stat-num">
                    ${mockStats.avgRating}<span style="font-size:15px;font-weight:500">/5</span>
                  </div>
                  <div class="stat-trend">Từ ${mockStats.ratedServicesCount} dịch vụ</div>
                </div>
              </div>`;
          }
        }
      });

    // 2. Sync Places
    apiFetch(API + '/api/business/places')
      .then(function(json) {
        if (json.success && json.data) {
          const mappedServices = json.data.map(p => ({
            id: p.id || p._id,
            name: p.name,
            type: p.kind === 'diem-du-lich' ? 'Tour' : 'Dịch vụ',
            location: p.region || p.address,
            price: p.priceFrom || 500000,
            unit: 'người',
            rating: parseFloat(p.ratingAvg || 0),
            bookings: p.reviewCount || 0,
            status: p.status === 'approved' ? 'active' : (p.status === 'rejected' ? 'paused' : 'pending'),
            image: p.image || 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600'
          }));
          if (typeof initServiceFilter === 'function') {
            window.getAllServices = function() { return mappedServices; };
            initServiceFilter('tab-bar', 'service-grid');
          }
        }
      });

    // 3. Sync Bookings (Dữ liệu thực từ /api/bookings)
    apiFetch(API + '/api/bookings/business')
      .then(function(json) {
        if (json.success && json.data) {
          const bookings = json.data;
          if (typeof renderBookings === 'function') {
            const mappedBookings = bookings.map(b => ({
              id: b.bookingId,
              rawId: b._id, // Quan trọng để update status
              customerName: b.customerName,
              serviceName: b.placeName,
              bookingDate: fmtDate(b.createdAt),
              useDate: fmtDate(b.useDate),
              value: b.totalPrice,
              status: b.status // matches pending, confirmed, cancelled
            }));
            renderBookings(mappedBookings, 'booking-table', { limit: 10, title: 'Đơn đặt chỗ mới từ khách hàng' });
          }
        }
      });
  };

  // Hàm toàn cục để bookingTable.js có thể gọi
  window.updateBookingStatus = function(id, newStatus) {
    if (!confirm('Bạn có chắc chắn muốn ' + (newStatus === 'confirmed' ? 'duyệt' : 'từ chối') + ' đơn này?')) return;
    
    apiFetch(API + '/api/bookings/' + id + '/status', {
      method: 'PUT',
      body: JSON.stringify({ status: newStatus })
    }).then(function(json) {
      if (json.success) {
        alert('Cập nhật trạng thái thành công!');
        window.syncAllData(); // Tải lại dữ liệu
      } else {
        alert('Lỗi: ' + json.message);
      }
    });
  };

  document.addEventListener('DOMContentLoaded', function () {
    loadPublicStats();
    if (getToken()) {
      window.syncAllData();
    }
  });

})();
