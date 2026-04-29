const SocialHub = {
    user: null,
    posts: [],

    init: async function() {
        console.log("📖 Social Hub Initializing...");
        const token = localStorage.getItem('wander_token');
        if (!token) {
            alert("Vui lòng đăng nhập để xem Nhật ký du lịch!");
            window.location.href = "index.html#auth";
            return;
        }

        await this.loadUserProfile();
        await this.fetchFeed();
        this.renderStories();
        this.setupEventListeners();
    },

    loadUserProfile: async function() {
        try {
            const res = await fetch('/api/auth/user/me', {
                headers: { 'x-auth-token': localStorage.getItem('wander_token') }
            });
            const data = await res.json();
            if (data.success) {
                this.user = data.user;
                if (document.getElementById('mini-name')) document.getElementById('mini-name').textContent = this.user.displayName || this.user.name;
                if (document.getElementById('mini-rank')) document.getElementById('mini-rank').textContent = `Hạng ${this.user.rank || 'Đồng'} ${this.user.rankTier || 'I'}`;
                if (this.user.avatar) {
                    const avatars = document.querySelectorAll('#mini-avatar, #post-avatar');
                    avatars.forEach(img => img.src = this.user.avatar);
                }
            }
        } catch (err) {
            console.error("Lỗi tải hồ sơ:", err);
        }
    },

    renderStories: function() {
        const storiesContainer = document.createElement('div');
        storiesContainer.className = 'stories-tray';
        storiesContainer.innerHTML = `
            <div class="story-card create-story">
                <div class="story-thumb" style="background-image: url('${this.user?.avatar || 'default-avatar.png'}')"></div>
                <div class="story-add">+</div>
                <span>Tạo tin</span>
            </div>
            ${[1,2,3,4].map(i => `
                <div class="story-card">
                    <div class="story-thumb" style="background-image: url('https://picsum.photos/200/300?random=${i}')"></div>
                    <img src="https://i.pravatar.cc/150?u=${i}" class="story-user-avatar">
                    <span>User ${i}</span>
                </div>
            `).join('')}
        `;
        const feed = document.querySelector('.social-feed');
        if (feed) feed.prepend(storiesContainer);
    },

    fetchFeed: async function() {
        const feedContainer = document.getElementById('feed-container');
        try {
            const res = await fetch('/api/social/feed', {
                headers: { 'x-auth-token': localStorage.getItem('wander_token') }
            });
            const data = await res.json();
            if (data.success) {
                this.posts = data.data;
                this.renderFeed();
            }
        } catch (err) {
            if (feedContainer) feedContainer.innerHTML = '<p class="error">Không thể tải bảng tin lúc này.</p>';
        }
    },

    renderFeed: function() {
        const feedContainer = document.getElementById('feed-container');
        if (!feedContainer) return;

        if (this.posts.length === 0) {
            feedContainer.innerHTML = '<div class="glass-card" style="text-align:center;padding:40px;">Chưa có bài viết nào. Hãy là người đầu tiên chia sẻ khoảnh khắc!</div>';
            return;
        }

        feedContainer.innerHTML = this.posts.map(post => `
            <div class="glass-card post-card" data-post-id="${post._id}">
                <div class="post-header">
                    <div class="post-user">
                        <img src="${post.userAvatar || 'default-avatar.png'}" alt="Avatar" class="avatar-sm">
                        <div>
                            <h4>${post.userName}</h4>
                            <span class="post-time">${this.formatTime(post.createdAt)}</span>
                        </div>
                    </div>
                    <button class="btn-icon">•••</button>
                </div>
                <div class="post-content">${post.content}</div>
                ${post.media && post.media.length > 0 ? `
                    <div class="post-media">
                        ${post.media.map(m => m.type === 'image' ? `<img src="${m.url}" alt="Post media">` : '').join('')}
                    </div>
                ` : ''}
                <div class="post-footer">
                    <button class="post-action ${post.likes.includes(this.user?._id) ? 'active' : ''}" onclick="SocialHub.likePost('${post._id}')">
                        ❤️ Thích (${post.likes.length})
                    </button>
                    <button class="post-action" onclick="SocialHub.showComments('${post._id}')">💬 Bình luận</button>
                    <button class="post-action">🔗 Chia sẻ</button>
                </div>
            </div>
        `).join('');
    },

    setupEventListeners: function() {
        const modal = document.getElementById('post-modal');
        const openBtn = document.getElementById('open-post-modal');
        const closeBtn = document.querySelector('.close-modal');
        const submitBtn = document.getElementById('submit-post');
        const tagLocBtn = document.getElementById('tag-location');
        let selectedPlace = null;

        if (openBtn) openBtn.onclick = () => modal.style.display = 'flex';
        if (closeBtn) closeBtn.onclick = () => modal.style.display = 'none';
        window.onclick = (e) => { if (e.target == modal) modal.style.display = 'none'; };

        if (tagLocBtn) {
            tagLocBtn.onclick = () => {
                const placeName = prompt("Nhập tên địa điểm bạn muốn gắn thẻ:");
                if (placeName) {
                    selectedPlace = { name: placeName };
                    tagLocBtn.innerHTML = `📍 Đã gắn thẻ: ${placeName}`;
                    tagLocBtn.style.color = 'var(--accent)';
                }
            };
        }

        if (submitBtn) {
            submitBtn.onclick = async () => {
                const content = document.getElementById('post-content').value;
                if (!content.trim()) return alert("Vui lòng nhập nội nội dung!");

                submitBtn.disabled = true;
                submitBtn.textContent = "Đang đăng...";

                try {
                    const res = await fetch('/api/social/posts', {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'x-auth-token': localStorage.getItem('wander_token') 
                        },
                        body: JSON.stringify({ 
                            content,
                            location: selectedPlace
                        })
                    });
                    const data = await res.json();
                    if (data.success) {
                        modal.style.display = 'none';
                        document.getElementById('post-content').value = '';
                        selectedPlace = null;
                        tagLocBtn.innerHTML = '📍 Gắn thẻ địa điểm';
                        await this.fetchFeed();
                    }
                } catch (err) {
                    alert("Lỗi khi đăng bài!");
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Đăng bài";
                }
            };
        }

        this.fetchPendingFriends();
    },

    fetchPendingFriends: async function() {
        const container = document.getElementById('friend-suggestions');
        if (!container) return;
        try {
            const res = await fetch('/api/social/friends/pending', {
                headers: { 'x-auth-token': localStorage.getItem('wander_token') }
            });
            const data = await res.json();
            if (data.success && data.data.length > 0) {
                container.innerHTML = `<h5>Lời mời kết bạn (${data.data.length})</h5>` + data.data.map(f => `
                    <div class="suggestion-item">
                        <img src="${f.requester.avatar || 'default-avatar.png'}" class="avatar-xs">
                        <div class="info">
                            <strong>${f.requester.displayName || f.requester.name}</strong>
                            <span>Hạng ${f.requester.rank || 'Đồng'}</span>
                        </div>
                        <div class="actions">
                            <button class="btn-xs btn--primary" onclick="SocialHub.respondFriend('${f._id}', 'accept')">✅</button>
                            <button class="btn-xs btn--ghost" onclick="SocialHub.respondFriend('${f._id}', 'decline')">❌</button>
                        </div>
                    </div>
                `).join('');
            } else {
                container.innerHTML = '<p style="font-size:0.8rem;color:var(--text-muted);padding:10px;">Không có lời mời mới.</p>';
            }
        } catch (err) { }
    },

    respondFriend: async function(id, action) {
        try {
            const res = await fetch('/api/social/friends/respond', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('wander_token') 
                },
                body: JSON.stringify({ friendshipId: id, action })
            });
            if ((await res.json()).success) {
                this.fetchPendingFriends();
            }
        } catch (err) { }
    },

    likePost: async function(postId) {
        try {
            const res = await fetch('/api/social/like', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('wander_token') 
                },
                body: JSON.stringify({ targetId: postId, targetType: 'post' })
            });
            const data = await res.json();
            if (data.success) {
                await this.fetchFeed();
            }
        } catch (err) { }
    },

    showComments: function(postId) {
        const content = prompt("Nhập bình luận của bạn:");
        if (content) {
            this.addComment(postId, content);
        }
    },

    addComment: async function(postId, content) {
        try {
            const res = await fetch(`/api/social/posts/${postId}/comment`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('wander_token') 
                },
                body: JSON.stringify({ content })
            });
            if ((await res.json()).success) {
                await this.fetchFeed();
            }
        } catch (err) { }
    },

    formatTime: function(dateStr) {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = (now - date) / 1000;
        if (diff < 60) return 'Vừa xong';
        if (diff < 3600) return Math.floor(diff / 60) + ' phút trước';
        if (diff < 86400) return Math.floor(diff / 3600) + ' giờ trước';
        return date.toLocaleDateString('vi-VN');
    }
};

window.SocialHub = SocialHub;
document.addEventListener('DOMContentLoaded', () => SocialHub.init());
