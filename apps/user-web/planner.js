/* ===================== PLANNER.JS ===================== */
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('aiPlannerForm');
  const resultContainer = document.getElementById('timelineResult');
  const loader = document.getElementById('aiLoader');
  const placeholder = document.getElementById('resultPlaceholder');
  const refineBox = document.getElementById('refineBox');
  const refineForm = document.getElementById('refineForm');
  const refineInput = document.getElementById('refineInput');
  const refineBtn = document.getElementById('refineBtn');
  const btnModeForm = document.getElementById('btnModeForm');
  const btnModeDiscovery = document.getElementById('btnModeDiscovery');
  const stepBasic = document.getElementById('stepBasic');
  const stepSmartWizard = document.getElementById('stepSmartWizard');
  const btnSaveTrip = document.getElementById('btnSaveTrip');
  const versionTabs = document.getElementById('versionTabs');

  let currentItineraryId = null;
  let planHistory = [];
  let currentPlanIndex = -1;

  // --- Discovery Logic ---
  const discoveryForm = document.getElementById('discoveryForm');
  const discoveryInput = document.getElementById('discoveryInput');
  const discoveryMessages = document.getElementById('discoveryMessages');
  let discoveryHistory = [];

  function addDiscoveryBubble(text, role) {
    const b = document.createElement('div');
    b.className = `chat-bubble ${role}`;
    b.innerHTML = role === 'ai' ? `<strong>✨ WanderAI</strong>${text}` : text;
    discoveryMessages.appendChild(b);
    discoveryMessages.scrollTop = discoveryMessages.scrollHeight;
  }

  if (btnModeForm && btnModeDiscovery) {
    btnModeForm.addEventListener('click', () => {
      btnModeForm.classList.add('active');
      btnModeDiscovery.classList.remove('active');
      document.getElementById('stepBasic').style.display = 'flex';
      document.getElementById('stepDiscovery').style.display = 'none';
      document.getElementById('stepSmartWizard').style.display = 'none';
    });
    btnModeDiscovery.addEventListener('click', () => {
      btnModeDiscovery.classList.add('active');
      btnModeForm.classList.remove('active');
      document.getElementById('stepDiscovery').style.display = 'flex';
      document.getElementById('stepBasic').style.display = 'none';
      document.getElementById('stepSmartWizard').style.display = 'none';
      
      if (discoveryHistory.length === 0 && discoveryMessages.children.length === 0) {
        addDiscoveryBubble("Chào bạn! Tôi là WanderAI. Hãy cho tôi biết ngân sách và sở thích, tôi sẽ gợi ý cho bạn nhé! ✨", "ai");
        renderDiscoverySuggestions();
      }
    });

  function renderDiscoverySuggestions() {
    const chipsContainer = document.getElementById('discoveryChips');
    if (!chipsContainer) return;
    chipsContainer.innerHTML = '';
    const suggestions = [
      { id: 'low_budget', label: '5 triệu VNĐ', icon: '💰' },
      { id: 'beach', label: 'Đi biển', icon: '🏖️' },
      { id: 'mountain', label: 'Leo núi', icon: '🏔️' },
      { id: 'cool', label: 'Chỗ nào mát mẻ?', icon: '❄️' },
      { id: 'food', label: 'Thiên đường ăn uống', icon: '🍜' }
    ];
    
    suggestions.forEach(s => {
      const chip = document.createElement('button');
      chip.className = 'chat-chip-premium';
      chip.innerHTML = `<span class="chip-icon">${s.icon}</span> ${s.label}`;
      chip.onclick = () => {
        discoveryInput.value = s.label;
        discoveryForm.dispatchEvent(new Event('submit'));
      };
      chipsContainer.appendChild(chip);
    });
  }
  }

  if (discoveryForm) {
    discoveryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const val = discoveryInput.value.trim();
      if (!val) return;
      addDiscoveryBubble(val, 'user');
      discoveryInput.value = '';
      document.getElementById('discoveryChips').innerHTML = '';

      try {
        const res = await fetch('/api/planner/discover', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: val, history: discoveryHistory })
        });
        const data = await res.json();
        if (data.success) {
          addDiscoveryBubble(data.answer, 'ai');
          discoveryHistory.push({ role: 'user', content: val }, { role: 'assistant', content: data.answer });
          if (data.suggestions) {
            data.suggestions.forEach(s => {
              const chip = document.createElement('button');
              chip.className = 'chat-chip';
              chip.textContent = s;
              chip.onclick = () => { discoveryInput.value = s; discoveryForm.dispatchEvent(new Event('submit')); };
              document.getElementById('discoveryChips').appendChild(chip);
            });
          }
          if (data.finalSelection) {
            document.getElementById('discoveryActionBox').style.display = 'block';
            discoveryForm.dataset.final = data.finalSelection;
            discoveryForm.dataset.budget = data.suggestedBudget;
            discoveryForm.dataset.days = data.suggestedDays || 3;
          }
        }
      } catch(err) { console.error(err); }
    });
  }

  document.getElementById('btnAcceptDiscovery')?.addEventListener('click', () => {
    document.getElementById('dest').value = discoveryForm.dataset.final;
    document.getElementById('budget').value = discoveryForm.dataset.budget;
    document.getElementById('days').value = discoveryForm.dataset.days;
    SmartWizard.startSmartWizardFromForm();
  });

  // ==========================================
  // SMART WIZARD UI LOGIC
  // ==========================================
  const SmartWizard = {
    data: {
      destination: '', days: 0, budget: '3 đến 7 triệu VNĐ',
      objective: [], style: [], pace: 'Vừa phải',
      companion: 'Bạn bè', interests: [], tripDate: ''
    },
    history: [],

    init() {
      this.dom = {
        chatArea: document.getElementById('smartChatArea'),
        optionsArea: document.getElementById('smartOptionsArea'),
        inputArea: document.getElementById('smartInputArea'),
        chatForm: document.getElementById('smartChatForm'),
        chatInput: document.getElementById('smartChatInput'),
        confirmationArea: document.getElementById('smartConfirmationArea'),
        summary: document.getElementById('detectedDataSummary'),
        btnFinal: document.getElementById('btnFinalGenerate'),
        basicForm: document.getElementById('aiPlannerForm')
      };

      this.dom.chatForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleMessage(this.dom.chatInput.value);
        this.dom.chatInput.value = '';
      });
      this.dom.btnFinal?.addEventListener('click', () => this.generateItinerary());
      this.dom.basicForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        this.startSmartWizardFromForm();
      });
    },

    startSmartWizardFromForm() {
      const dest = document.getElementById('dest').value.trim();
      const days = parseInt(document.getElementById('days').value);
      
      if (!dest || isNaN(days)) {
        if (window.WanderToast) WanderToast.error("Vui lòng điền đầy đủ thông tin");
        else alert("Vui lòng điền đầy đủ thông tin");
        return;
      }

      this.data.destination = dest;
      this.data.days = days;
      this.data.budget = document.getElementById('budget').value;
      this.data.tripDate = document.getElementById('tripDate').value;
      this.data.companion = document.getElementById('companion').value;

      document.getElementById('stepBasic').style.display = 'none';
      document.getElementById('stepDiscovery').style.display = 'none';
      document.getElementById('stepSmartWizard').style.display = 'flex';
      this.dom.chatArea.innerHTML = '';
      this.history = [];
      this.handleMessage(`Tôi muốn đi ${this.data.destination} trong ${this.data.days} ngày. Hãy tư vấn thêm để hoàn thiện lịch trình.`);
    },

    async handleMessage(text) {
      if (!text.trim()) return;
      if (text !== "Tôi đã chọn xong") this.addBubble(text, 'user');

      try {
        const response = await fetch('/api/planner/smart-wizard', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, currentData: this.data, history: this.history })
        });
        
        if (!response.ok) throw new Error("API Wizard Error");
        
        const result = await response.json();
        if (result.success) {
          this.addBubble(result.aiMessage, 'ai');
          this.history.push({ role: 'user', content: text }, { role: 'assistant', content: result.aiMessage });
          if (result.detectedData) this.data = { ...this.data, ...result.detectedData };
          
          if (result.nextStep === 'ready') {
            this.renderOptions(null);
            this.showConfirmation();
          } else if (result.uiOptions) {
            this.dom.confirmationArea.style.display = 'none';
            this.dom.inputArea.style.display = 'flex';
            this.renderOptions(result.uiOptions);
          } else {
            this.renderOptions(null);
          }
        }
      } catch (error) { 
        console.error(error); 
        this.addBubble("Rất tiếc, AI đang gặp chút trục trặc. Bạn có thể thử nhập lại hoặc nhấn nút bên dưới để lên lịch ngay với thông tin hiện có.", 'ai');
        this.showConfirmation();
      }
    },

    addBubble(text, role) {
      const bubble = document.createElement('div');
      bubble.className = `chat-bubble ${role}`;
      if (role === 'ai') {
        let ft = text.trim();
        if (ft.startsWith(',')) ft = ft.substring(1).trim();
        ft = ft.replace(/(\d+ ĐẾN \d+ TRIỆU VNĐ)/gi, '<strong style="color: var(--accent);">$1</strong>')
               .replace(/(\d+ ngày)/gi, '<strong style="color: var(--accent);">$1</strong>');
        bubble.innerHTML = `<div class="chat-header"><span class="chat-icon">✨</span><span class="chat-name">WANDERAI</span></div><div class="chat-content">${ft}</div>`;
      } else { bubble.textContent = text; }
      this.dom.chatArea.appendChild(bubble);
      this.dom.chatArea.scrollTop = this.dom.chatArea.scrollHeight;
    },

    renderOptions(uiOptions) {
      this.dom.optionsArea.innerHTML = '';
      if (!uiOptions || !uiOptions.groups || uiOptions.groups.length === 0) {
        this.dom.optionsArea.style.display = 'none';
        return;
      }
      this.dom.optionsArea.style.display = 'block';
      const container = document.createElement('div');
      container.className = 'smart-chat-options-wrapper';
      
      uiOptions.groups.forEach(group => {
        const label = document.createElement('p');
        label.className = 'group-label-premium';
        label.textContent = group.title;
        container.appendChild(label);
        
        const chips = document.createElement('div');
        chips.className = 'planner-chat-chips-v2';
        
        group.options.forEach(opt => {
          const chip = document.createElement('button');
          chip.type = 'button';
          chip.className = 'chat-chip-premium';
          if (this.isOptionSelected(group.id, opt.id)) chip.classList.add('active');
          chip.innerHTML = `<span class="chip-icon">${opt.icon}</span> <span class="chip-text">${opt.label}</span>`;
          chip.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleOption(group.id, opt, chip, uiOptions.type);
          });
          chips.appendChild(chip);
        });
        container.appendChild(chips);
      });

      this.dom.optionsArea.appendChild(container);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'planner-btn main-action-small';
      btn.innerHTML = '<span>Xác nhận & Tiếp tục</span> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
      btn.addEventListener('click', () => this.handleMessage("Tôi đã lựa chọn xong các yêu cầu trên"));
      this.dom.optionsArea.appendChild(btn);
    },

    isOptionSelected(g, id) {
      const v = this.data[g];
      if (Array.isArray(v)) return v.includes(id);
      return v === id;
    },

    toggleOption(g, opt, chip, type) {
      if (type === 'single_select') {
        // Support both legacy and premium chip classes
        const allChips = chip.parentElement.querySelectorAll('.chat-chip, .chat-chip-premium');
        allChips.forEach(c => c.classList.remove('active', 'is-selected'));
        
        this.data[g] = opt.id;
        chip.classList.add('active');
      } else {
        // Ensure data[g] is an array for multi_select
        if (!Array.isArray(this.data[g])) {
          this.data[g] = this.data[g] ? [this.data[g]] : [];
        }
        
        const idx = this.data[g].indexOf(opt.id);
        if (idx > -1) {
          this.data[g].splice(idx, 1);
          chip.classList.remove('active', 'is-selected');
        } else {
          this.data[g].push(opt.id);
          chip.classList.add('active');
        }
      }
    },

    showConfirmation() {
      this.dom.optionsArea.innerHTML = '';
      this.dom.confirmationArea.style.display = 'block';
      this.dom.inputArea.style.display = 'none';
      
      const d = this.data;
      const dateStr = d.tripDate ? new Date(d.tripDate).toLocaleDateString('vi-VN') : 'Tùy chọn';
      
      this.dom.summary.innerHTML = `
        <div style="margin-bottom: 1.25rem; text-align: center;">
          <h4 style="color: var(--accent); margin-bottom: 0.25rem; font-size: 0.9rem; letter-spacing: 1px; font-weight: 900;">XÁC NHẬN HÀNH TRÌNH</h4>
          <p style="font-size: 0.75rem; color: var(--text-muted);">AI đã sẵn sàng thiết kế lịch trình cho bạn</p>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
          <div class="summary-item">
            <span class="summary-icon">📍</span>
            <div class="summary-text"><p>ĐIỂM ĐẾN</p><h4>${d.destination}</h4></div>
          </div>
          <div class="summary-item">
            <span class="summary-icon">📅</span>
            <div class="summary-text"><p>NGÀY ĐI</p><h4>${dateStr}</h4></div>
          </div>
          <div class="summary-item">
            <span class="summary-icon">📆</span>
            <div class="summary-text"><p>THỜI GIAN</p><h4>${d.days} Ngày</h4></div>
          </div>
          <div class="summary-item">
            <span class="summary-icon">💰</span>
            <div class="summary-text"><p>NGÂN SÁCH</p><h4>${d.budget}</h4></div>
          </div>
        </div>
      `;
    },

    generateItinerary() { doGenerate(this.data); }
  };

  SmartWizard.init();

  async function doGenerate(data) {
    placeholder.style.display = 'none';
    resultContainer.style.display = 'none';
    refineBox.style.display = 'none';
    loader.style.display = 'flex';
    
    try {
      const token = localStorage.getItem('wander_token');
      const res = await fetch('/api/planner/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token || '' },
        body: JSON.stringify({ ...data, tripDate: data.tripDate || '' })
      });
      
      if (!res.ok) throw new Error("API Generation Failed");
      
      const json = await res.json();
      if (json.success) {
        currentItineraryId = json.itineraryId;
        planHistory = [json.plan];
        currentPlanIndex = 0;
        renderVersionTabs();
        renderItinerary(json.plan, data.destination, data.days, data.tripDate);
        resultContainer.style.display = 'block';
        refineBox.style.display = 'block';
      } else {
        throw new Error(json.message || "Không thể tạo lịch trình");
      }
    } catch(err) { 
      console.error(err);
      placeholder.style.display = 'flex';
      placeholder.innerHTML = `
        <div style="padding: 2rem; color: #f43f5e;">
          <h2 style="color: #f43f5e;">⚠️ Có lỗi xảy ra</h2>
          <p>${err.message || 'Hệ thống AI đang quá tải. Vui lòng thử lại sau giây lát.'}</p>
          <button class="planner-btn" onclick="location.reload()" style="margin-top: 1rem; width: auto;">Thử lại ngay</button>
        </div>
      `;
    }
    finally { loader.style.display = 'none'; }
  }

  function renderItinerary(plan, dest, days, date) {
    const html = `
      <div class="timeline-header-premium">
        <div class="timeline-header-content">
          <div class="destination-badge">📍 ${dest}</div>
          <h2 class="main-itinerary-title">Hành trình khám phá ${days} ngày</h2>
          <p class="timeline-summary-v2">${plan.tripSummary || plan.summary || 'Kế hoạch du lịch được tối ưu hóa bởi WanderAI.'}</p>
        </div>
        
        <div class="itinerary-stats-grid">
          <div class="stat-box">
            <span class="stat-label">Thời gian</span>
            <span class="stat-value">${days} Ngày</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Dự kiến chi phí</span>
            <span class="stat-value">${plan.estimatedCost || plan.totalEstimatedCost || '---'}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Phong cách</span>
            <span class="stat-value">Trải nghiệm</span>
          </div>
        </div>
      </div>

      <div class="timeline-container-premium">
        ${(plan.itinerary || []).map((day, idx) => {
          const dayNum = day.day || (idx + 1);
          return `
          <div class="itinerary-day-block" style="animation-delay: ${idx * 0.1}s">
            <div class="day-indicator">
              <div class="day-circle"><span>${dayNum.toString().replace(/Ngày /g, '')}</span></div>
              <div class="day-line"></div>
            </div>
            <div class="day-content">
              <div class="day-header-meta">
                <h3>Ngày ${dayNum.toString().replace(/Ngày /g, '')}</h3>
                <span class="day-subtitle">${day.theme || 'Khám phá & Trải nghiệm'}</span>
              </div>
              <div class="activities-list">
                ${(day.activities || []).map(act => `
                  <div class="premium-activity-card">
                    <div class="activity-time-slot">${act.time || '--:--'}</div>
                    <div class="activity-main-info">
                      <h4 class="activity-name">${act.task || act.activity || act.name || ''}</h4>
                      <div class="activity-location-tag">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        <span>${act.location || 'Địa điểm chưa rõ'}</span>
                      </div>
                      <p class="activity-desc-v2">${act.description || act.desc || ''}</p>
                      ${act.cost ? `<div class="activity-budget-pill">💰 ${act.cost}</div>` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
          `;
        }).join('')}
      </div>
    `;
    document.getElementById('timelineContent').innerHTML = html;
  }

  function renderVersionTabs() {
    versionTabs.innerHTML = planHistory.map((p, i) => `
      <button class="version-tab ${i === currentPlanIndex ? 'active' : ''}" onclick="switchVersion(${i})">Bản ${i + 1}</button>
    `).join('');
  }

  window.switchVersion = (idx) => {
    currentPlanIndex = idx;
    renderVersionTabs();
    renderItinerary(planHistory[idx], SmartWizard.data.destination, SmartWizard.data.days, SmartWizard.data.tripDate);
  };

  refineForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const feedback = refineInput.value;
    if (!feedback) return;
    loader.style.display = 'flex';
    try {
      const res = await fetch('/api/planner/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': localStorage.getItem('wander_token') || '' },
        body: JSON.stringify({ oldPlanJson: planHistory[currentPlanIndex], userFeedback: feedback, itineraryId: currentItineraryId })
      });
      const d = await res.json();
      if (d.success) {
        planHistory.push(d.plan);
        currentPlanIndex = planHistory.length - 1;
        renderVersionTabs();
        renderItinerary(d.plan, SmartWizard.data.destination, SmartWizard.data.days, SmartWizard.data.tripDate);
        refineInput.value = '';
      }
    } catch(err) { console.error(err); }
    finally { loader.style.display = 'none'; }
  });

  btnSaveTrip?.addEventListener('click', async () => {
    if (!currentItineraryId) return;
    const token = localStorage.getItem('wander_token');
    if (!token) {
      alert("Vui lòng đăng nhập để lưu lịch trình.");
      if (window.WanderUI && WanderUI.openModal) WanderUI.openModal('auth');
      return;
    }
    btnSaveTrip.disabled = true;
    btnSaveTrip.textContent = "Đang lưu...";
    try {
      const res = await fetch('/api/planner/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ itineraryId: currentItineraryId })
      });
      const data = await res.json();
      if (data.success) {
        btnSaveTrip.textContent = "✓ Đã lưu thành công";
        btnSaveTrip.style.background = "#10b981";
        const statusEl = document.getElementById('saveTripStatus');
        if (statusEl) {
          statusEl.style.display = 'block';
          statusEl.textContent = "Lịch trình đã được thêm vào Chuyến đi của bạn.";
        }
      } else {
        btnSaveTrip.disabled = false;
        btnSaveTrip.textContent = "Thử lại";
      }
    } catch(e) { 
      console.error(e);
      btnSaveTrip.disabled = false;
      btnSaveTrip.textContent = "Lỗi lưu";
    }
  });
});
