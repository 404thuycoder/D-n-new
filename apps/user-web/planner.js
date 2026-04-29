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
      document.getElementById('stepBasic').style.display = 'block';
      document.getElementById('stepDiscovery').style.display = 'none';
    });
    btnModeDiscovery.addEventListener('click', () => {
      btnModeDiscovery.classList.add('active');
      btnModeForm.classList.remove('active');
      document.getElementById('stepDiscovery').style.display = 'block';
      document.getElementById('stepBasic').style.display = 'none';
      if (discoveryHistory.length === 0) {
        addDiscoveryBubble("Chào bạn! Bạn đang phân vân không biết đi đâu? Hãy cho tôi biết ngân sách và sở thích (VD: 5 triệu đi đâu mát mẻ?), tôi sẽ gợi ý cho bạn nhé! ✨", "ai");
      }
    });
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
      this.data.destination = document.getElementById('dest').value;
      this.data.days = parseInt(document.getElementById('days').value);
      this.data.budget = document.getElementById('budget').value;
      this.data.tripDate = document.getElementById('tripDate').value;
      this.data.companion = document.getElementById('companion').value;
      this.data.objective = [document.getElementById('objective').value];

      stepBasic.style.display = 'none';
      document.getElementById('stepDiscovery').style.display = 'none';
      stepSmartWizard.style.display = 'block';
      this.dom.chatArea.innerHTML = '';
      this.history = [];
      this.handleMessage(`Tôi muốn đi ${this.data.destination} trong ${this.data.days} ngày với ngân sách ${this.data.budget}. Tôi đi cùng ${this.data.companion} với mục tiêu ${this.data.objective[0]}. Hãy gợi ý tiếp các chi tiết khác.`);
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
        const result = await response.json();
        if (result.success) {
          this.addBubble(result.aiMessage, 'ai');
          this.history.push({ role: 'user', content: text }, { role: 'assistant', content: result.aiMessage });
          if (result.detectedData) this.data = { ...this.data, ...result.detectedData };
          
          // Xử lý hiển thị dựa trên bước tiếp theo
          if (result.nextStep === 'ready') {
            this.renderOptions(null); // Xóa các options cũ
            this.showConfirmation();
          } else if (result.uiOptions) {
            this.dom.confirmationArea.style.display = 'none';
            this.dom.inputArea.style.display = 'flex';
            this.renderOptions(result.uiOptions);
          } else {
            this.renderOptions(null);
          }
        }
      } catch (error) { console.error(error); }
    },

    addBubble(text, role) {
      const bubble = document.createElement('div');
      bubble.className = `chat-bubble ${role}`;
      if (role === 'ai') {
        let ft = text.trim();
        // Xóa dấu phẩy thừa ở đầu nếu có
        if (ft.startsWith(',')) ft = ft.substring(1).trim();

        ft = ft.replace(/(\d+ ĐẾN \d+ TRIỆU VNĐ)/gi, '<strong style="color: #06b6d4;">$1</strong>')
               .replace(/(\d+ ngày)/gi, '<strong style="color: #06b6d4;">$1</strong>')
               .replace(/(\d+ TR VNĐ)/gi, '<strong style="color: #06b6d4;">$1</strong>');
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
        label.style = 'font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.5rem; margin-top: 1rem; font-weight: 700; text-transform: uppercase;';
        label.textContent = group.title;
        container.appendChild(label);
        
        const chips = document.createElement('div');
        chips.className = 'planner-chat-chips';
        chips.style = 'display: flex; flex-wrap: wrap; gap: 0.5rem;';
        
        group.options.forEach(opt => {
          const chip = document.createElement('button');
          chip.type = 'button';
          chip.className = 'chat-chip';
          if (this.isOptionSelected(group.id, opt.id)) chip.classList.add('is-selected');
          
          chip.innerHTML = `${opt.icon} ${opt.label}`;
          
          // Sử dụng addEventListener thay vì onclick để ổn định hơn
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
      btn.className = 'planner-btn';
      btn.style.marginTop = '1.5rem';
      btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      btn.textContent = 'Tôi đã chọn xong';
      btn.addEventListener('click', () => this.handleMessage("Tôi đã chọn xong"));
      this.dom.optionsArea.appendChild(btn);

      const back = document.createElement('a');
      back.className = 'back-link';
      back.style.display = 'block';
      back.style.textAlign = 'center';
      back.style.marginTop = '1rem';
      back.innerHTML = '← Nhập lại thông tin cơ bản';
      back.onclick = (e) => { 
        e.preventDefault(); 
        stepSmartWizard.style.display = 'none'; 
        document.getElementById('stepBasic').style.display = 'block'; 
      };
      this.dom.optionsArea.appendChild(back);
    },

    isOptionSelected(g, id) {
      const v = this.data[g];
      if (Array.isArray(v)) return v.includes(id);
      return v === id;
    },

    toggleOption(g, opt, chip, type) {
      if (type === 'single_select') {
        chip.parentElement.querySelectorAll('.chat-chip').forEach(c => c.classList.remove('is-selected'));
        this.data[g] = opt.id;
        chip.classList.add('is-selected');
      } else {
        if (!Array.isArray(this.data[g])) {
           this.data[g] = this.data[g] ? [this.data[g]] : [];
        }
        const idx = this.data[g].indexOf(opt.id);
        if (idx > -1) {
          this.data[g].splice(idx, 1);
          chip.classList.remove('is-selected');
        } else {
          this.data[g].push(opt.id);
          chip.classList.add('is-selected');
        }
      }
      console.log('Wizard Data Updated:', this.data);
    },

    showConfirmation() {
      this.dom.optionsArea.innerHTML = '';
      this.dom.confirmationArea.style.display = 'block';
      this.dom.inputArea.style.display = 'none';
      
      const d = this.data;
      const dateStr = d.tripDate ? new Date(d.tripDate).toLocaleDateString('vi-VN') : '---';
      
      this.dom.summary.innerHTML = `
        <div style="margin-bottom: 1.25rem; text-align: center;">
          <h4 style="color: var(--accent, #10b981); margin-bottom: 0.25rem; font-size: 0.9rem; letter-spacing: 1px;">XÁC NHẬN HÀNH TRÌNH</h4>
          <p style="font-size: 0.75rem; color: var(--text-muted);">AI đã sẵn sàng, hãy kiểm tra lại thông tin</p>
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
          <div class="summary-item" style="grid-column: span 2;">
            <span class="summary-icon">👥</span>
            <div class="summary-text"><p>ĐI CÙNG</p><h4>${d.companion}</h4></div>
          </div>
        </div>
        <div style="margin-top: 1rem; padding: 0.75rem; background: rgba(16, 185, 129, 0.05); border-radius: 0.75rem; border: 1px solid rgba(16, 185, 129, 0.15);">
          <p style="font-size: 0.7rem; color: var(--accent, #10b981); margin-bottom: 0.25rem; font-weight: 800; text-transform: uppercase;">Chi tiết phong cách</p>
          <p style="font-size: 0.85rem; line-height: 1.4;">${d.style ? (Array.isArray(d.style) ? d.style.join(', ') : d.style) : 'AI tự đề xuất phong cách phù hợp nhất'}</p>
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
      const json = await res.json();
      if (json.success) {
        currentItineraryId = json.itineraryId;
        planHistory.push(json.plan);
        currentPlanIndex = planHistory.length - 1;
        renderVersionTabs();
        renderItinerary(json.plan, data.destination, data.days, data.tripDate);
        resultContainer.style.display = 'block';
        refineBox.style.display = 'block';
      }
    } catch(err) { console.error(err); }
    finally { loader.style.display = 'none'; }
  }

  function renderItinerary(plan, dest, days, date) {
    const html = `
      <div class="timeline-header">
        <h2 class="activity-title" style="font-size: 1.5rem;">Hành trình: ${dest}</h2>
        <p class="timeline-summary">${plan.tripSummary || plan.summary || ''}</p>
        <div class="timeline-meta">
          <div class="meta-card"><div class="meta-icon-wrapper">📅</div><div class="meta-content"><p>THỜI GIAN</p><h4>${days} Ngày</h4></div></div>
          <div class="meta-card"><div class="meta-icon-wrapper">💰</div><div class="meta-content"><p>DỰ KIẾN</p><h4>${plan.estimatedCost || plan.totalEstimatedCost || '---'}</h4></div></div>
        </div>
      </div>
      <div class="timeline-body">
        ${(plan.itinerary || []).map(day => {
          const dayNum = (day.day || '').toString();
          return `
          <div class="timeline-day">
            <div class="day-badge">Ngày ${dayNum}</div>
            <div class="day-activities">
              ${(day.activities || []).map(act => `
                <div class="activity-card">
                  <div class="activity-time">${act.time || '--:--'}</div>
                  <h4 class="activity-title">${act.task || act.activity || act.name || ''}</h4>
                  <p class="activity-location">📍 ${act.location || 'Địa điểm chưa rõ'}</p>
                  <p class="activity-details">${act.description || act.desc || ''}</p>
                  <div class="activity-cost">Dự kiến: ${act.cost || 'Miễn phí'}</div>
                </div>
              `).join('')}
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
