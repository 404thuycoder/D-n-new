/**
 * Render business list from businessData.js into HTML
 * Requirements: 
 * - A div with id="business-list" must exist in the HTML
 * - businessData.js must be loaded before this script
 */

function renderBusinesses() {
  const container = document.getElementById('business-list');
  if (!container) {
    console.error('Element with id "business-list" not found!');
    return;
  }

  // Clear container
  container.innerHTML = '';

  // Currency formatter
  const formatter = new Intl.NumberFormat('vi-VN');

  // Loop through data
  businessData.forEach(business => {
    const card = document.createElement('div');
    card.className = 'card';
    
    // Construct Card HTML
    card.innerHTML = `
      <div class="card-thumb">
        <div class="badge bd-${business.rank.toLowerCase()}">
          ${business.rank.toUpperCase()}
        </div>
        <img src="${business.image}" alt="${business.name}" loading="lazy">
      </div>
      <div class="card-info">
        <h3 class="card-name">${business.name}</h3>
        <div class="card-loc">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="margin-right: 4px; color: #ef4444;">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
          </svg>
          ${business.location}
        </div>
        <div style="display:flex; alignItems:center; gap:0.5rem; margin-bottom:1.2rem;">
          <span style="color:#facc15; font-weight:800; font-size:0.95rem;">★ ${business.rating}</span>
          <span style="color:#64748B; font-size:0.85rem;">(${business.reviews} đánh giá)</span>
        </div>
        <div class="card-foot">
          <div class="price-part">
            <div class="lbl">Từ</div>
            <div class="val">${formatter.format(business.price)}<span>VND</span></div>
          </div>
          <div class="tag">${business.category}</div>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

// Auto-run when DOM is ready
document.addEventListener('DOMContentLoaded', renderBusinesses);
