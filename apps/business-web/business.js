/* =====================================================================
   WanderViệt — Business Partner Dashboard
   Đây là dashboard dành riêng cho đối tác doanh nghiệp
   ===================================================================== */
'use strict';

function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
document.addEventListener('DOMContentLoaded', function () {
  var API = '';
  var token = localStorage.getItem('wander_business_token');
  var placesData = [];
  var bizLayout = document.querySelector('.biz-layout');
  if (bizLayout) bizLayout.style.visibility = 'hidden';

  // ─────────────────────────────────────────────
  //  AUTH CHECK & UI BOOTSTRAP
  // ─────────────────────────────────────────────
  function checkAuth() {
    return _checkAuth.apply(this, arguments);
  }
  function _checkAuth() {
    _checkAuth = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
      var res, data, user, isAllowed, _t3;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            if (token) {
              _context3.n = 1;
              break;
            }
            var bootMsgEl = document.getElementById('biz-login-msg');
            if (bootMsgEl) {
              bootMsgEl.textContent = 'Bạn cần đăng nhập tài khoản doanh nghiệp để truy cập khu vực này.';
            }
            return _context3.a(2);
          case 1:
            _context3.p = 1;
            _context3.n = 2;
            return fetch("".concat(API, "/api/auth/business/me"), {
              headers: {
                'x-auth-token': token
              }
            });
          case 2:
            res = _context3.v;
            if (res.ok) {
              _context3.n = 3;
              break;
            }
            throw new Error('Invalid token');
          case 3:
            _context3.n = 4;
            return res.json();
          case 4:
            data = _context3.v;
            user = data.user;
            isAllowed = ['business'].includes(user.role);
            if (!(!user || !isAllowed)) {
              _context3.n = 5;
              break;
            }
            localStorage.removeItem('wander_business_token');
            var roleMsgEl = document.getElementById('biz-login-msg');
            if (roleMsgEl) {
              roleMsgEl.textContent = 'Khu vực này chỉ dành cho tài khoản Đối tác Doanh nghiệp.';
            }
            return _context3.a(2);
          case 5:
            showDashboard(user);
            _context3.n = 6;
            return Promise.all([loadStats(), loadServices()]);
          case 6:
            _context3.n = 8;
            break;
          case 7:
            _context3.p = 7;
            _t3 = _context3.v;
            localStorage.removeItem('wander_business_token');
            var errMsgEl = document.getElementById('biz-login-msg');
            if (errMsgEl) {
              errMsgEl.textContent = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
            }
          case 8:
            return _context3.a(2);
        }
      }, _callee3, null, [[1, 7]]);
    }));
    return _checkAuth.apply(this, arguments);
  }

  function showDashboard(user) {
    if (bizLayout) bizLayout.style.visibility = 'visible';
    var displayName = user.displayName || user.name || user.email.split('@')[0];
    var userProfile = document.getElementById('biz-user-profile');
    if (userProfile) {
      userProfile.innerHTML = `
        <img src="${user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(displayName) + '&background=0284c7&color=fff'}" alt="Partner" class="biz-user-avatar" />
        <div style="display:flex; flex-direction:column">
          <span class="biz-user-name">${escHtml(displayName)}</span>
          <span style="font-size:0.7rem; color:rgba(255,255,255,0.5)">ID: ${user.customId || 'business'}</span>
        </div>
      `;
    }

    var sidebarFooter = document.querySelector('.biz-sidebar-footer');
    if (sidebarFooter && !document.getElementById('btn-logout-biz')) {
      var logoutBtn = document.createElement('button');
      logoutBtn.id = 'btn-logout-biz';
      logoutBtn.className = 'biz-nav-item logout-trigger';
      logoutBtn.style.width = '100%';
      logoutBtn.style.border = 'none';
      logoutBtn.style.background = 'transparent';
      logoutBtn.style.cursor = 'pointer';
      logoutBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        Đăng xuất
      `;
      logoutBtn.addEventListener('click', function () {
        localStorage.removeItem('wander_business_token');
        sessionStorage.removeItem('wander_redirect_msg');
        if (typeof WanderUI !== 'undefined') WanderUI.showToast('Đã đăng xuất thành công.', 'info');
        setTimeout(function () {
          window.location.replace('index.html');
        }, 600);
      });
      sidebarFooter.appendChild(logoutBtn);
    }

    if (window.WanderUI && window.WanderUI.updateNotificationBadge) {
      window.WanderUI.updateNotificationBadge();
    }
  }

  // ─────────────────────────────────────────────
  //  API HELPER
  // ─────────────────────────────────────────────
  function apiFetch(_x) {
    return _apiFetch.apply(this, arguments);
  }
  function _apiFetch() {
    _apiFetch = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(url) {
      var options,
        res,
        json,
        _args4 = arguments;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            options = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : {};
            options.headers = options.headers || {};
            options.headers['x-auth-token'] = token;
            if (options.body && !(options.body instanceof FormData)) {
              options.headers['Content-Type'] = 'application/json';
            }
            _context4.n = 1;
            return fetch(url, options);
          case 1:
            res = _context4.v;
            _context4.n = 2;
            return res.json();
          case 2:
            json = _context4.v;
            if (res.ok) {
              _context4.n = 3;
              break;
            }
            throw new Error(json.message || "L\u1ED7i API: ".concat(res.status));
          case 3:
            return _context4.a(2, json);
        }
      }, _callee4);
    }));
    return _apiFetch.apply(this, arguments);
  }
  function escHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ─────────────────────────────────────────────
  //  STATS
  // ─────────────────────────────────────────────
  function loadStats() {
    return _loadStats.apply(this, arguments);
  } // ─────────────────────────────────────────────
  //  SERVICES TABLE
  // ─────────────────────────────────────────────
  function _loadStats() {
    _loadStats = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
      var json, d, el, _t4;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.p = _context5.n) {
          case 0:
            _context5.p = 0;
            _context5.n = 1;
            return apiFetch("".concat(API, "/api/business/stats"));
          case 1:
            json = _context5.v;
            if (json.success && json.data) {
              d = json.data;
              el = function el(id) {
                return document.getElementById(id);
              };
              if (el('stat-views')) el('stat-views').textContent = (d.totalViews || 0).toLocaleString('vi-VN');
              if (el('stat-reviews')) el('stat-reviews').textContent = (d.totalReviews || 0).toLocaleString('vi-VN');
              if (el('stat-services')) el('stat-services').textContent = (d.totalServices || 0).toLocaleString('vi-VN');
              if (el('stat-rating')) el('stat-rating').textContent = d.avgRating ? "".concat(d.avgRating, "/5") : '—';
            }
            _context5.n = 3;
            break;
          case 2:
            _context5.p = 2;
            _t4 = _context5.v;
            console.warn('Không tải được thống kê:', _t4.message);
          case 3:
            return _context5.a(2);
        }
      }, _callee5, null, [[0, 2]]);
    }));
    return _loadStats.apply(this, arguments);
  }
  function loadServices() {
    return _loadServices.apply(this, arguments);
  } // Search filter
  function _loadServices() {
    _loadServices = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
      var tbody, json, _t5;
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.p = _context6.n) {
          case 0:
            tbody = document.getElementById('services-tbody');
            tbody.innerHTML = '<tr><td colspan="6" class="table-empty">Đang tải...</td></tr>';
            _context6.p = 1;
            _context6.n = 2;
            return apiFetch("".concat(API, "/api/business/places"));
          case 2:
            json = _context6.v;
            placesData = json.data || [];
            renderServices(placesData);
            _context6.n = 4;
            break;
          case 3:
            _context6.p = 3;
            _t5 = _context6.v;
            tbody.innerHTML = "<tr><td colspan=\"6\" class=\"table-empty table-error\">L\u1ED7i t\u1EA3i d\u1EEF li\u1EC7u: ".concat(escHtml(_t5.message), "</td></tr>");
          case 4:
            return _context6.a(2);
        }
      }, _callee6, null, [[1, 3]]);
    }));
    return _loadServices.apply(this, arguments);
  }
  var searchInput = document.getElementById('biz-search');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      var q = searchInput.value.toLowerCase();
      var filtered = placesData.filter(function (p) {
        return (p.name || '').toLowerCase().includes(q) || (p.region || '').toLowerCase().includes(q) || (p.tags || []).some(function (t) {
          return t.toLowerCase().includes(q);
        });
      });
      renderServices(filtered);
    });
  }
  function renderServices(list) {
    var tbody = document.getElementById('services-tbody');
    tbody.innerHTML = '';
    if (!list || list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="table-empty">Chưa có dịch vụ nào. Bấm "Đăng dịch vụ mới" để bắt đầu.</td></tr>';
      return;
    }
    var BUDGET_LABELS = {
      1: '💰',
      2: '💰💰',
      3: '💰💰💰',
      4: '💰💰💰💰'
    };
    list.forEach(function (item) {
      var type = item.tags && item.tags.length > 0 ? item.tags[0] : 'Chung';

      // Safe image resolution
      var imgSrc = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=80&h=60&fit=crop';
      if (item.image) {
        imgSrc = item.image.startsWith('/') ? "".concat(API).concat(item.image) : item.image;
      } else if (item.images && item.images.length > 0) {
        var img0 = item.images[0];
        imgSrc = img0.startsWith('/') ? "".concat(API).concat(img0) : img0;
      }
      var budget = BUDGET_LABELS[item.budget] || '—';
      var rating = item.ratingAvg ? "\u2B50 ".concat(item.ratingAvg) : 'Chưa có';
      var reviews = item.reviewCount || 0;
      var views = item.favoritesCount || 0;

      // Status Badge logic
      var statusBadge = '';
      var status = item.status || 'approved'; // default to approved for legacy
      if (status === 'pending') {
        statusBadge = "<span class=\"status-badge status-badge--pending\">\u23F3 Ch\u1EDD duy\u1EC7t</span>";
      } else if (status === 'rejected') {
        statusBadge = "<span class=\"status-badge status-badge--rejected\" title=\"L\xFD do: ".concat(escHtml(item.rejectReason || 'Không rõ'), "\">\u274C T\u1EEB ch\u1ED1i</span>");
      } else {
        statusBadge = "<span class=\"status-badge status-badge--approved\">\u2705 \u0110ang ch\u1EA1y</span>";
      }
      var tr = document.createElement('tr');
      tr.innerHTML = "\n        <td>\n          <div class=\"service-name-cell\">\n            <img src=\"".concat(escHtml(imgSrc), "\" alt=\"\" class=\"service-thumb\" onerror=\"this.src='https://images.unsplash.com/photo-1566073771259-6a8506099945?w=80&h=60&fit=crop'\" />\n            <div>\n              <strong>").concat(escHtml(item.name), "</strong>\n              <small class=\"service-address\">").concat(escHtml(item.region || '')).concat(item.address ? ' — ' + escHtml(item.address) : '', "</small>\n            </div>\n          </div>\n        </td>\n        <td><span class=\"biz-tag\">").concat(escHtml(type), "</span> ").concat(budget, "</td>\n        <td>").concat(views.toLocaleString('vi-VN'), " \u2665</td>\n        <td>").concat(rating, " <small style=\"color:var(--text-muted)\">(").concat(reviews, ")</small></td>\n        <td>").concat(statusBadge, "</td>\n        <td>\n          <button class=\"btn btn--ghost btn--sm edit-btn\" data-id=\"").concat(escHtml(item.id), "\" title=\"Ch\u1EC9nh s\u1EEDa\">\n            <svg width=\"13\" height=\"13\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7\"/><path d=\"M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z\"/></svg>\n            S\u1EEDa\n          </button>\n        </td>\n      ");
      tbody.appendChild(tr);
    });
    tbody.querySelectorAll('.edit-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-id');
        var place = placesData.find(function (p) {
          return p.id === id;
        });
        if (place) openPlaceModal(place);
      });
    });
  }

  // ─────────────────────────────────────────────
  //  MODAL
  // ─────────────────────────────────────────────
  var modal = document.getElementById('modal-place-form');
  var backdrop = document.getElementById('biz-modal-backdrop');
  var placeForm = document.getElementById('place-form');
  var formStatus = document.getElementById('place-form-status');
  var btnDelete = document.getElementById('btn-delete-place');
  document.getElementById('btn-add-service').addEventListener('click', function () {
    return openPlaceModal();
  });
  function closePlaceModal() {
    if (modal) modal.hidden = true;
    if (backdrop) backdrop.hidden = true;
    document.body.style.overflow = '';
  }
  document.querySelectorAll('[data-close-modal]').forEach(function (b) {
    return b.addEventListener('click', closePlaceModal);
  });
  if (backdrop) backdrop.addEventListener('click', closePlaceModal);
  function openPlaceModal() {
    var place = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    if (!placeForm) return;
    placeForm.reset();
    if (formStatus) formStatus.textContent = '';
    var title = document.getElementById('place-modal-title');
    if (title) title.textContent = place ? 'Sửa Dịch Vụ' : 'Đăng Dịch Vụ Mới';
    if (btnDelete) btnDelete.hidden = !place;

    // Uncheck all amenity checkboxes first
    placeForm.querySelectorAll('input[name="amenities"]').forEach(function (cb) {
      return cb.checked = false;
    });
    if (place) {
      var setField = function setField(name, val) {
        if (placeForm.elements[name] && val !== undefined && val !== null) placeForm.elements[name].value = val;
      };
      setField('id', place.id);
      setField('name', place.name);
      setField('region', place.region);
      setField('address', place.address);
      setField('text', place.text);
      setField('budget', place.budget || 2);
      setField('pace', place.pace || 'vua');
      setField('priceFrom', place.priceFrom);
      setField('priceTo', place.priceTo);
      setField('tags', (place.tags || []).join(', '));
      setField('openTime', place.openTime);
      setField('closeTime', place.closeTime);
      setField('openDays', place.openDays);
      setField('contactPhone', place.contactPhone);
      setField('contactEmail', place.contactEmail);
      setField('website', place.website);

      // Amenities
      var amenities = place.amenities || [];
      placeForm.querySelectorAll('input[name="amenities"]').forEach(function (cb) {
        cb.checked = amenities.includes(cb.value);
      });

      // Images
      var imgs = place.images && place.images.length > 0 ? place.images : place.image ? [place.image] : [];
      renderDropzonePreview(imgs.map(function (url) {
        return {
          url: url.startsWith('/') ? "".concat(API).concat(url) : url
        };
      }));
    } else {
      placeForm.elements['id'].value = '';
      renderDropzonePreview([]);
    }
    if (modal) modal.hidden = false;
    if (backdrop) backdrop.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  // ─────────────────────────────────────────────
  //  DROPZONE / IMAGE UPLOAD
  // ─────────────────────────────────────────────
  var currentDropzoneFiles = [];
  var placeDropzone = document.getElementById('place-dropzone');
  var placeDropzonePreview = document.getElementById('place-dropzone-preview');
  var placeImageInput = document.getElementById('place-image-input');
  function renderDropzonePreview(files) {
    currentDropzoneFiles = files || [];
    if (!placeDropzonePreview) return;
    placeDropzonePreview.innerHTML = '';
    currentDropzoneFiles.forEach(function (f, idx) {
      var wrapper = document.createElement('div');
      wrapper.className = 'preview-thumb';
      var img = document.createElement('img');
      img.src = f.preview || f.url || '';
      img.alt = '';
      var removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'preview-remove';
      removeBtn.innerHTML = '&times;';
      removeBtn.title = 'Xóa ảnh';
      removeBtn.onclick = function (e) {
        e.preventDefault();
        currentDropzoneFiles.splice(idx, 1);
        renderDropzonePreview(_toConsumableArray(currentDropzoneFiles));
      };
      wrapper.append(img, removeBtn);
      placeDropzonePreview.appendChild(wrapper);
    });
  }
  if (placeDropzone && placeImageInput) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function (ev) {
      placeDropzone.addEventListener(ev, function (e) {
        e.preventDefault();
        e.stopPropagation();
      });
    });
    placeDropzone.addEventListener('dragover', function () {
      return placeDropzone.classList.add('is-drag');
    });
    placeDropzone.addEventListener('dragleave', function () {
      return placeDropzone.classList.remove('is-drag');
    });
    placeDropzone.addEventListener('drop', function (e) {
      var _e$dataTransfer;
      placeDropzone.classList.remove('is-drag');
      if ((_e$dataTransfer = e.dataTransfer) !== null && _e$dataTransfer !== void 0 && _e$dataTransfer.files) handleDropzoneFiles(e.dataTransfer.files);
    });
    placeImageInput.addEventListener('change', function (e) {
      if (e.target.files) handleDropzoneFiles(e.target.files);
    });
  }
  function handleDropzoneFiles(fileList) {
    Array.from(fileList).forEach(function (file) {
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
        WanderUI.showToast("\u0110\u1ECBnh d\u1EA1ng \"".concat(file.name, "\" kh\xF4ng h\u1ED7 tr\u1EE3."), 'error');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        WanderUI.showToast("\u1EA2nh \"".concat(file.name, "\" v\u01B0\u1EE3t qu\xE1 5MB."), 'error');
        return;
      }
      var reader = new FileReader();
      reader.onload = function (e) {
        currentDropzoneFiles.push({
          file: file,
          preview: e.target.result
        });
        renderDropzonePreview(_toConsumableArray(currentDropzoneFiles));
      };
      reader.readAsDataURL(file);
    });
    if (placeImageInput) placeImageInput.value = '';
  }

  // ─────────────────────────────────────────────
  //  FORM SUBMIT (CREATE / UPDATE)
  // ─────────────────────────────────────────────
  if (placeForm) {
    placeForm.addEventListener('submit', /*#__PURE__*/function () {
      var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(e) {
        var id, formData, tagsRaw, amenityVals, retainedUrls, btnSave, url, method, res, json, errMsg, _errMsg, _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              e.preventDefault();
              id = placeForm.elements['id'].value;
              if (formStatus) {
                formStatus.textContent = 'Đang lưu...';
                formStatus.className = 'form-status';
              }
              formData = new FormData(placeForm); // Process tags
              tagsRaw = (formData.get('tags') || '').split(',').map(function (t) {
                return t.trim();
              }).filter(Boolean);
              formData.set('tags', tagsRaw.join(','));

              // Process amenities (checkboxes)
              amenityVals = Array.from(placeForm.querySelectorAll('input[name="amenities"]:checked')).map(function (cb) {
                return cb.value;
              });
              formData.delete('amenities');
              formData.set('amenities', JSON.stringify(amenityVals));

              // Process retained image URLs vs new files
              retainedUrls = currentDropzoneFiles.filter(function (f) {
                return !f.file;
              }).map(function (f) {
                return f.url;
              });
              formData.set('images', JSON.stringify(retainedUrls));
              formData.delete('imageFile');
              currentDropzoneFiles.filter(function (f) {
                return f.file;
              }).forEach(function (f) {
                return formData.append('imageFile', f.file);
              });
              btnSave = document.getElementById('btn-save-place');
              if (typeof WanderUI !== 'undefined') WanderUI.setButtonLoading(btnSave, true);
              _context.p = 1;
              url = id ? "".concat(API, "/api/business/places/").concat(id) : "".concat(API, "/api/business/places");
              method = id ? 'PUT' : 'POST';
              _context.n = 2;
              return fetch(url, {
                method: method,
                headers: {
                  'x-auth-token': token
                },
                body: formData
              });
            case 2:
              res = _context.v;
              _context.n = 3;
              return res.json();
            case 3:
              json = _context.v;
              if (!(res.ok && json.success)) {
                _context.n = 5;
                break;
              }
              if (typeof WanderUI !== 'undefined') WanderUI.showToast(id ? 'Đã cập nhật dịch vụ!' : 'Đã đăng dịch vụ mới!', 'success');
              if (formStatus) {
                formStatus.textContent = '✔ Lưu thành công!';
                formStatus.className = 'form-status ok';
              }
              _context.n = 4;
              return Promise.all([loadStats(), loadServices()]);
            case 4:
              setTimeout(closePlaceModal, 700);
              _context.n = 6;
              break;
            case 5:
              errMsg = json.message || 'Lỗi lưu thông tin';
              if (formStatus) {
                formStatus.textContent = errMsg;
                formStatus.className = 'form-status error';
              }
              if (typeof WanderUI !== 'undefined') WanderUI.showToast(errMsg, 'error');
            case 6:
              _context.n = 8;
              break;
            case 7:
              _context.p = 7;
              _t = _context.v;
              _errMsg = "L\u1ED7i k\u1EBFt n\u1ED1i m\xE1y ch\u1EE7: ".concat(_t.message);
              if (formStatus) {
                formStatus.textContent = _errMsg;
                formStatus.className = 'form-status error';
              }
              if (typeof WanderUI !== 'undefined') WanderUI.showToast(_errMsg, 'error');
            case 8:
              _context.p = 8;
              if (typeof WanderUI !== 'undefined') WanderUI.setButtonLoading(btnSave, false);
              return _context.f(8);
            case 9:
              return _context.a(2);
          }
        }, _callee, null, [[1, 7, 8, 9]]);
      }));
      return function (_x2) {
        return _ref.apply(this, arguments);
      };
    }());
  }

  // ─────────────────────────────────────────────
  //  DELETE
  // ─────────────────────────────────────────────
  if (btnDelete) {
    btnDelete.addEventListener('click', /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
      var _placeForm$elements$n;
      var id, name, json, _t2;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            id = placeForm.elements['id'].value;
            name = ((_placeForm$elements$n = placeForm.elements['name']) === null || _placeForm$elements$n === void 0 ? void 0 : _placeForm$elements$n.value) || 'dịch vụ này';
            if (!(!id || !confirm("X\xF3a v\u0129nh vi\u1EC5n \"".concat(name, "\"?\nH\xE0nh \u0111\u1ED9ng n\xE0y kh\xF4ng th\u1EC3 ho\xE0n t\xE1c!")))) {
              _context2.n = 1;
              break;
            }
            return _context2.a(2);
          case 1:
            _context2.p = 1;
            _context2.n = 2;
            return apiFetch("".concat(API, "/api/business/places/").concat(id), {
              method: 'DELETE'
            });
          case 2:
            json = _context2.v;
            if (!json.success) {
              _context2.n = 3;
              break;
            }
            if (typeof WanderUI !== 'undefined') WanderUI.showToast('Đã xóa dịch vụ.', 'success');
            closePlaceModal();
            _context2.n = 3;
            return Promise.all([loadStats(), loadServices()]);
          case 3:
            _context2.n = 5;
            break;
          case 4:
            _context2.p = 4;
            _t2 = _context2.v;
            if (typeof WanderUI !== 'undefined') WanderUI.showToast("Kh\xF4ng th\u1EC3 x\xF3a: ".concat(_t2.message), 'error');
          case 5:
            return _context2.a(2);
        }
      }, _callee2, null, [[1, 4]]);
    })));
  }

  // ─────────────────────────────────────────────
  //  BOOT
  // ─────────────────────────────────────────────
  checkAuth();
});
