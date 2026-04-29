/**
 * WanderViệt Shared UI Logic
 * Handles Theme, Settings Drawer, and Toast system across all portals.
 */
window.WanderUI = Object.assign(window.WanderUI || {}, (function() {
  'use strict';

  const STORAGE_THEME = 'wander_theme';
  
  // --- Theme Management ---
  function setTheme(theme, syncWithBackend = false) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_THEME, theme);
    
    if (syncWithBackend) {
      const token = localStorage.getItem('wander_admin_token') || 
                    localStorage.getItem('wander_business_token') || 
                    localStorage.getItem('wander_token');
      if (token) {
        fetch('/api/auth/theme', {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'x-auth-token': token
          },
          body: JSON.stringify({ theme })
        }).catch(err => console.debug('Sync theme failed:', err));
      }
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(current === 'dark' ? 'light' : 'dark', true);
  }

  function initTheme() {
    const saved = localStorage.getItem(STORAGE_THEME);
    if (saved) {
      setTheme(saved);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }

  // --- Toast System ---
  function showToast(message, type = 'info') {
    const container = document.getElementById('wander-toast-container') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = `wander-toast wander-toast--${type}`;
    toast.innerHTML = `
      <div class="wander-toast__content">${message}</div>
      <button class="wander-toast__close">&times;</button>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('wander-toast--fade-out');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
    toast.querySelector('.wander-toast__close').onclick = () => toast.remove();
  }

  function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'wander-toast-container';
    container.style.cssText = `position:fixed;bottom:2rem;right:2rem;display:flex;flex-direction:column;gap:0.75rem;z-index:9999;pointer-events:none;`;
    document.body.appendChild(container);
    return container;
  }

  // --- Loading States ---
  function setButtonLoading(btn, isLoading) {
    if (!btn) return;
    if (isLoading) {
      btn.dataset.originalText = btn.innerHTML;
      btn.classList.add('btn-loading');
      btn.disabled = true;
    } else {
      btn.classList.remove('btn-loading');
      btn.disabled = false;
      if (btn.dataset.originalText) btn.innerHTML = btn.dataset.originalText;
    }
  }

  initTheme();

  return { setTheme, toggleTheme, showToast, setButtonLoading };
})());

(function injectSharedStyles() {
  if (document.getElementById('wander-shared-styles')) return;
  const style = document.createElement('style');
  style.id = 'wander-shared-styles';
  style.textContent = `
    .wander-toast {
      pointer-events: auto; min-width: 280px; padding: 1rem 1.25rem; border-radius: 12px;
      background: var(--bg-elevated); color: var(--text); box-shadow: var(--shadow-lg);
      border: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between;
      animation: wander-toast-in 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28); font-family: var(--font-sans); font-size: 0.9rem;
    }
    .wander-toast--success { border-left: 4px solid var(--success); }
    .wander-toast--error { border-left: 4px solid var(--danger); }
    .wander-toast--info { border-left: 4px solid var(--primary); }
    .wander-toast__close { background: none; border: none; cursor: pointer; opacity: 0.5; font-size: 1.2rem; color: inherit; }
    .wander-toast--fade-out { opacity: 0; transform: translateY(10px); transition: all 0.4s ease; }
    @keyframes wander-toast-in { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
    
    /* Loading Spinner */
    .btn-loading { position: relative; color: transparent !important; pointer-events: none; }
    .btn-loading::after {
      content: ""; position: absolute; width: 1.2rem; height: 1.2rem; top: calc(50% - 0.6rem); left: calc(50% - 0.6rem);
      border: 2px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: #fff; animation: wander-spin 0.6s linear infinite;
    }
    @keyframes wander-spin { to { transform: rotate(360deg); } }
  `;
  document.head.appendChild(style);
})();
