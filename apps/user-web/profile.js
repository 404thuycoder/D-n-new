const UserProfile = {
    user: null,
    activeTab: 'diary',

    init: async function() {
        console.log("👤 Profile Page Initializing...");
        const token = localStorage.getItem('wander_token');
        if (!token) {
            window.location.href = "index.html";
            return;
        }

        await this.loadFullProfile();
        this.setupEventListeners();
        this.switchTab('diary');
    },

    loadFullProfile: async function() {
        try {
            const res = await fetch('/api/auth/user/me', {
                headers: { 'x-auth-token': localStorage.getItem('wander_token') }
            });
            const data = await res.json();
            if (data.success) {
                this.user = data.user;
                this.updateUI();
            }
        } catch (err) {
            console.error("Lỗi tải dữ liệu hồ sơ:", err);
        }
    },

    updateUI: function() {
        if (!this.user) return;
        
        document.getElementById('user-display-name').textContent = this.user.displayName || this.user.name;
        document.getElementById('user-bio').textContent = this.user.notes || 'Chưa có tiểu sử.';
        document.getElementById('user-id-tag').textContent = `ID: ${this.user.customId || 'user'}`;
        document.getElementById('user-rank-badge').textContent = `Hạng ${this.user.rank || 'Đồng'} ${this.user.rankTier || 'I'}`;
        document.getElementById('user-points').textContent = this.user.points || 0;
        
        if (this.user.avatar) {
            document.getElementById('user-avatar-big').src = this.user.avatar;
        }

        const joinDate = new Date(this.user.createdAt);
        document.getElementById('user-joined').textContent = `${joinDate.getMonth() + 1}/${joinDate.getFullYear()}`;
    },

    setupEventListeners: function() {
        // Tab switching
        document.querySelectorAll('.tab-item').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('.tab-item').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.switchTab(btn.dataset.tab);
            };
        });

        // Edit Profile Modal
        const modal = document.getElementById('edit-profile-modal');
        const editBtn = document.getElementById('edit-profile-btn');
        const closeBtn = document.querySelector('.close-modal');
        const saveBtn = document.getElementById('save-profile');

        if (editBtn) {
            editBtn.onclick = () => {
                document.getElementById('edit-name').value = this.user.displayName || this.user.name;
                document.getElementById('edit-bio').value = this.user.notes || '';
                document.getElementById('edit-phone').value = this.user.phone || '';
                modal.style.display = 'flex';
            };
        }

        if (closeBtn) closeBtn.onclick = () => modal.style.display = 'none';

        if (saveBtn) {
            saveBtn.onclick = async () => {
                const updatedData = {
                    displayName: document.getElementById('edit-name').value,
                    notes: document.getElementById('edit-bio').value,
                    phone: document.getElementById('edit-phone').value
                };

                try {
                    const res = await fetch('/api/auth/profile', {
                        method: 'PUT',
                        headers: { 
                            'Content-Type': 'application/json',
                            'x-auth-token': localStorage.getItem('token')
                        },
                        body: JSON.stringify(updatedData)
                    });
                    const data = await res.json();
                    if (data.success) {
                        modal.style.display = 'none';
                        location.reload();
                    }
                } catch (err) {
                    alert("Lỗi khi cập nhật hồ sơ!");
                }
            };
        }
    },

    switchTab: async function(tab) {
        this.activeTab = tab;
        const container = document.getElementById('profile-tab-content');
        container.innerHTML = '<div class="loading-shimmer">Đang tải...</div>';

        switch(tab) {
            case 'diary':
                await this.loadMyPosts();
                break;
            case 'trips':
                await this.loadMyTrips();
                break;
            case 'friends':
                container.innerHTML = '<div class="glass-card">Tính năng bạn bè đang được cập nhật...</div>';
                break;
            case 'medals':
                container.innerHTML = '<div class="glass-card">Hệ thống thành tích đang được đồng bộ...</div>';
                break;
        }
    },

    loadMyPosts: async function() {
        const container = document.getElementById('profile-tab-content');
        try {
            // Re-use logic from social-hub for my posts only
            const res = await fetch('/api/social/feed', {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            const data = await res.json();
            if (data.success) {
                const myPosts = data.data.filter(p => p.userId === this.user._id);
                if (myPosts.length === 0) {
                    container.innerHTML = '<div class="glass-card" style="text-align:center;padding:40px;">Bạn chưa có bài viết nào.</div>';
                } else {
                    container.innerHTML = myPosts.map(post => `
                        <div class="glass-card post-card">
                            <div class="post-content">${post.content}</div>
                            <div class="post-footer">
                                <span>❤️ ${post.likes.length} lượt thích</span>
                                <span>🕒 ${new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                            </div>
                        </div>
                    `).join('');
                }
            }
        } catch (err) {
            container.innerHTML = 'Lỗi tải bài viết.';
        }
    },

    loadMyTrips: async function() {
        const container = document.getElementById('profile-tab-content');
        try {
            const res = await fetch('/api/planner/my-trips', {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            const data = await res.json();
            if (data.success && data.itineraries) {
                container.innerHTML = data.itineraries.map(trip => `
                    <div class="glass-card trip-card-mini" style="margin-bottom:16px; display:flex; gap:16px; align-items:center;">
                        <div style="background:var(--primary); padding:12px; border-radius:12px; font-weight:700;">${trip.days}N</div>
                        <div style="flex:1">
                            <h4 style="margin:0">${trip.destination}</h4>
                            <p style="font-size:0.8rem; color:var(--text-muted); margin:4px 0;">${new Date(trip.createdAt).toLocaleDateString('vi-VN')}</p>
                        </div>
                        <button class="btn btn--sm" onclick="window.location.href='planner.html?itineraryId=${trip._id}'">Xem lại</button>
                    </div>
                `).join('');
            }
        } catch (err) {
            container.innerHTML = 'Lỗi tải chuyến đi.';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => UserProfile.init());
