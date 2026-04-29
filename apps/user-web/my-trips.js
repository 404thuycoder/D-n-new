"use strict";

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('wander_token');
  const unauthorizedMsg = document.getElementById('unauthorizedMsg');
  const tripsContainer = document.getElementById('tripsContainer');
  const tripsList = document.getElementById('tripsList');
  const tabBtns = document.querySelectorAll('.tab-btn');

  let allTrips = [];
  let currentTab = 'planning';

  if (!token) {
    unauthorizedMsg.style.display = 'block';
    return;
  }

  tripsContainer.style.display = 'block';

  // --- Functions ---

  async function fetchTrips() {
    try {
      const res = await fetch('/api/planner/my-trips', {
        headers: { 'x-auth-token': token }
      });
      if (res.status === 401 || res.status === 403) {
        unauthorizedMsg.style.display = 'block';
        tripsContainer.style.display = 'none';
        return;
      }
      const json = await res.json();
      if (json.success) {
        allTrips = json.data;
        renderCurrentTab();
      } else {
        tripsList.innerHTML = `<p style="color:red; text-align:center;">Lỗi: ${json.message}</p>`;
      }
    } catch (err) {
      console.error(err);
      tripsList.innerHTML = `<p style="color:red; text-align:center;">Lỗi kết nối máy chủ.</p>`;
    }
  }

  function renderCurrentTab() {
    tripsList.innerHTML = '';
    
    const filtered = allTrips.filter(t => {
      if (currentTab === 'trash') return t.isDeleted === true;
      if (t.isDeleted) return false;
      const status = t.status || 'planning';
      return status === currentTab;
    });

    if (filtered.length === 0) {
      const msgs = {
        planning: 'Bạn không có chuyến đi nào đang lên lịch.',
        completed: 'Bạn chưa hoàn thành chuyến đi nào.',
        missed: 'Danh sách bỏ lỡ đang trống.',
        trash: 'Thùng rác trống.'
      };
      tripsList.innerHTML = `
        <div style="background:var(--bg-card); padding:3rem; border-radius:1.5rem; text-align:center; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid var(--border);">
          <p style="font-size:1.1rem; color:var(--text-muted); margin-bottom:1.5rem;">${msgs[currentTab]}</p>
          ${currentTab === 'planning' ? '<a href="planner.html" class="btn btn--primary">✨ Lên lịch ngay</a>' : ''}
        </div>
      `;
      return;
    }

    filtered.forEach(it => {
      const card = createTripCard(it);
      tripsList.appendChild(card);
    });
  }

  function createTripCard(it) {
    const card = document.createElement('div');
    card.className = 'trip-card-v2'; // Có thể thêm CSS sau
    card.style.cssText = 'background:var(--bg-card); border-radius:1.25rem; padding:1.5rem; box-shadow:0 4px 20px rgba(0,0,0,0.04); display:flex; flex-direction:column; gap:1.25rem; border:1px solid var(--border); position:relative; overflow:hidden;';

    const dbDate = new Date(it.createdAt).toLocaleDateString('vi-VN');
    const jsonStr = JSON.stringify(it.planJson);
    
    // Status Badge & Date logic
    let statusBadge = '';
    let tripDateLabel = '';
    if (it.tripDate) {
      const d = new Date(it.tripDate);
      const dateStr = d.toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric' });
      tripDateLabel = `• 📅 Khởi hành: ${dateStr}`;
    }

    const isTrash = it.isDeleted;
    const currentStatus = it.status || 'planning';
    const isPlanning = currentStatus === 'planning' && !isTrash;

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:1rem;">
        <div>
          <h2 style="font-size:1.4rem; color:var(--text); margin:0 0 0.4rem; font-family:'Outfit', sans-serif;">${it.destination}</h2>
          <p style="color:var(--text-muted); font-size:0.9rem; margin:0;">
            ⏱️ ${it.days} ngày • 💰 ${it.budget} ${tripDateLabel}
          </p>
          <p style="color:var(--text-muted); font-size:0.8rem; margin-top:0.4rem;">Đã lưu: ${dbDate}</p>
        </div>
        <div style="display:flex; flex-direction:column; gap:0.5rem; align-items:flex-end;">
          <div style="display:flex; gap:0.5rem;">
            <button class="btn-v2 btn-view" data-id="${it._id}" title="Xem chi tiết">👁️</button>
            ${isPlanning ? `<button class="btn-v2 btn-go btn--primary" data-id="${it._id}">🚀 Lên đường</button>` : ''}
          </div>
        </div>
      </div>

      <div style="display:flex; gap:0.6rem; border-top:1px solid var(--border); padding-top:1rem; justify-content: flex-end;">
        ${renderActionButtons(it, currentStatus)}
      </div>
    `;

    // Add events
    card.querySelector('.btn-view').onclick = () => {
      if (window.WanderUI && WanderUI.openItineraryDetail) {
        WanderUI.openItineraryDetail(it._id, it);
      } else {
        window.location.href = 'planner.html?itin=' + it._id;
      }
    };
    const goBtn = card.querySelector('.btn-go');
    if (goBtn) goBtn.onclick = () => {
      sessionStorage.setItem('wander_active_itinerary', jsonStr);
      sessionStorage.setItem('wander_active_dest', it.destination);
      window.location.href = 'navigator.html';
    };

    attachActionEvents(card, it);

    return card;
  }

  function renderActionButtons(it, currentStatus) {
    if (it.isDeleted) {
      return `
        <button class="btn-text btn-restore" data-id="${it._id}">🔄 Lên lịch lại</button>
        <button class="btn-text btn-delete-perm" data-id="${it._id}" style="color:#ef4444;">🗑️ Xóa vĩnh viễn</button>
      `;
    }
    if (currentStatus === 'planning') {
      return `
        <button class="btn-text btn-complete" data-id="${it._id}" style="color:#10b981;">✅ Hoàn thành</button>
        <button class="btn-text btn-miss" data-id="${it._id}" style="color:#f59e0b;">⏳ Bỏ lỡ</button>
        <button class="btn-text btn-trash" data-id="${it._id}" style="color:#ef4444;">🗑️ Xóa</button>
      `;
    }
    // Completed or Missed
    return `
      <button class="btn-text btn-restore" data-id="${it._id}">🔄 Lên lịch lại</button>
      <button class="btn-text btn-trash" data-id="${it._id}" style="color:#ef4444;">🗑️ Xóa</button>
    `;
  }

  function attachActionEvents(card, it) {
    const btnMap = {
      '.btn-complete': () => updateStatus(it._id, 'completed'),
      '.btn-miss': () => updateStatus(it._id, 'missed'),
      '.btn-trash': () => moveToTrash(it._id),
      '.btn-restore': () => restoreTrip(it._id),
      '.btn-delete-perm': () => permanentDelete(it._id)
    };

    Object.entries(btnMap).forEach(([selector, fn]) => {
      const btn = card.querySelector(selector);
      if (btn) btn.onclick = fn;
    });
  }

  // --- API Calls ---

  async function updateStatus(id, status) {
    const res = await fetch(`/api/planner/status/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
      body: JSON.stringify({ status })
    });
    const json = await res.json();
    if (json.success) {
      if (window.WanderUI) WanderUI.showToast(`Đã chuyển vào mục ${status === 'completed' ? 'Đã đi' : 'Bỏ lỡ'}`);
      fetchTrips();
    }
  }

  async function moveToTrash(id) {
    if (!confirm('Chuyển chuyến đi này vào Thùng rác?')) return;
    const res = await fetch(`/api/planner/itinerary/${id}`, {
      method: 'DELETE',
      headers: { 'x-auth-token': token }
    });
    const json = await res.json();
    if (json.success) {
      if (window.WanderUI) WanderUI.showToast('Đã chuyển vào Thùng rác');
      fetchTrips();
    }
  }

  async function restoreTrip(id) {
    const res = await fetch(`/api/planner/restore/${id}`, {
      method: 'PUT',
      headers: { 'x-auth-token': token }
    });
    const json = await res.json();
    if (json.success) {
      if (window.WanderUI) WanderUI.showToast('Đã khôi phục vào Đang lên lịch');
      fetchTrips();
    }
  }

  async function permanentDelete(id) {
    if (!confirm('Xóa vĩnh viễn? Hành động này không thể khôi phục.')) return;
    const res = await fetch(`/api/planner/permanent/${id}`, {
      method: 'DELETE',
      headers: { 'x-auth-token': token }
    });
    const json = await res.json();
    if (json.success) {
      if (window.WanderUI) WanderUI.showToast('Đã xóa vĩnh viễn');
      fetchTrips();
    }
  }

  // --- Tab Switch ---
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTab = btn.getAttribute('data-tab');
      renderCurrentTab();
    });
  });

  // Init
  fetchTrips();

  // Voice Helper integration
  if (window.voiceGuide) {
    const voiceBtn = document.getElementById('voice-btn');
    voiceBtn.addEventListener('click', () => {
      if (window.voiceGuide.isListening) window.voiceGuide.stop();
      else window.voiceGuide.start();
    });
    window.voiceGuide.onResultCallback = async (text) => {
      // Logic tương tự main.js nếu cần
    };
  }
});
