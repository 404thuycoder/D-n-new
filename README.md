# WanderViệt — Du lịch thông minh

Nền tảng du lịch cá nhân hóa cho người Việt. Gồm 3 cổng: **User Portal**, **Business Partner**, và **Admin Dashboard**.

---

## Cài đặt & Chạy

### 1. Yêu cầu
- [Node.js](https://nodejs.org/) v18 trở lên
- MongoDB (Atlas cloud hoặc local)

### 2. Cài thư viện

```bash
cd d:\VietFuture\travel-landing
npm install
```

### 3. Cấu hình môi trường

Tạo file `.env` trong thư mục gốc (hoặc copy từ `.env.example`):

```env
MONGODB_URI=mongodb+srv://...   # URI MongoDB Atlas hoặc local
JWT_SECRET=your-strong-secret
GROQ_API_KEY=...                # Cho AI chat (tùy chọn)
GOOGLE_AI_KEY=...               # Cho AI Navigation (tùy chọn)
PORT=5000
```

### 4. Tạo tài khoản Super Admin

```bash
node createAdmin.js
```
Sẽ tạo/cập nhật: `admin@wanderviet.com` / `admin123@`

### 5. Chạy server

```bash
node server.js
```

Server chạy tại: **http://localhost:5000**

---

## Truy cập các trang

| Đường dẫn | Mô tả |
|----------|-------|
| http://localhost:5000/ | Trang người dùng chính |
| http://localhost:5000/business.html | Kênh doanh nghiệp (cần đăng nhập business) |
| http://localhost:5000/admin | Admin Dashboard |
| http://localhost:5000/my-trips.html | Chuyến đi của tôi |

---

## Credentials mặc định

| Vai trò | Email | Mật khẩu |
|--------|-------|----------|
| Super Admin | admin@wanderviet.com | admin123@ |
| Business (tạo qua UI) | — | — |
| User thường (tạo qua UI) | — | — |

---

## Checklist luồng chính

### ✅ Đăng ký / Đăng nhập
- [ ] Vào http://localhost:5000 → Bấm "Đăng nhập"
- [ ] Tab "Đăng ký (Khách)" → Nhập tên/email/mật khẩu → Submit → Avatar hiện trên header
- [ ] Tab "Đăng ký (Doanh nghiệp)" → Submit → Redirect sang `/business.html`
- [ ] Đăng nhập tài khoản đã có → Toast thành công

### ✅ Dropdown người dùng
- [ ] Click avatar → Dropdown mở với tên + email
- [ ] "Hồ sơ của tôi" → Modal cài đặt mở đúng tab Profile
- [ ] "Chuyến đi của tôi" → Mở my-trips.html
- [ ] "Kênh Doanh nghiệp" (user thường) / "Workspace" (business) → Điều hướng đúng
- [ ] "Đăng xuất" → Toast, avatar biến mất, nút Đăng nhập hiện lại

### ✅ Business Partner Portal
- [ ] Đăng nhập business → Trang `business.html` hiện stats (lượt xem, đánh giá, số DV)
- [ ] Bấm "Đăng dịch vụ mới" → Form mở đầy đủ fields
- [ ] Điền thông tin + upload ảnh → Lưu → Dịch vụ hiện trong bảng
- [ ] Bấm "Sửa" → Sửa tên/mô tả → Lưu → Cập nhật ngay
- [ ] Bấm "Xóa dịch vụ" → Confirm → Xóa khỏi bảng
- [ ] Dịch vụ mới xuất hiện trên trang người dùng (API `/api/places`)

### ✅ Admin Dashboard
- [ ] Vào http://localhost:5000/admin → Màn đăng nhập
- [ ] Đăng nhập `admin@wanderviet.com` / `admin123@` → Dashboard hiện
- [ ] Tab Users: xem danh sách, chỉnh sửa vai trò
- [ ] Tab Places: xem / xóa địa điểm
- [ ] Tab Logs: xem lịch sử hoạt động

---

## API Endpoints

```
POST /api/auth/register       Đăng ký (user/business)
POST /api/auth/login          Đăng nhập
GET  /api/auth/me             Thông tin tài khoản (cần JWT)
PUT  /api/auth/profile        Cập nhật hồ sơ
PUT  /api/auth/password       Đổi mật khẩu

GET  /api/places              Danh sách địa điểm (public)
POST /api/places/:id/review   Gửi đánh giá (cần auth)
POST /api/places/:id/favorite Thả tim

GET    /api/business/places   Dịch vụ của business (cần biz auth)
GET    /api/business/stats    Thống kê business
POST   /api/business/places   Tạo dịch vụ (upload ảnh)
PUT    /api/business/places/:id Cập nhật dịch vụ
DELETE /api/business/places/:id Xóa dịch vụ

GET  /api/admin/stats         Thống kê tổng quan (admin)
GET  /api/admin/users         Danh sách user (admin)
GET  /api/admin/places        Danh sách địa điểm (admin)
GET  /api/admin/logs          Lịch sử hoạt động (admin)
GET  /api/admin/feedbacks     Phản hồi người dùng

POST /api/chat                AI chatbot
POST /api/planner             Lập lịch trình AI
```

---

## Cấu trúc thư mục

```
travel-landing/
├── apps/
│   ├── user-web/          # Frontend người dùng + business portal
│   │   ├── index.html     # Trang chủ
│   │   ├── main.js        # Logic trang chủ
│   │   ├── business.html  # Partner portal
│   │   ├── business.js    # Partner logic
│   │   ├── business.css   # Partner styles
│   │   ├── my-trips.html  # Chuyến đi
│   │   ├── styles.css     # Global styles
│   │   └── global-tokens.css
│   └── admin-web/         # Admin Dashboard
│       ├── index.html
│       ├── admin.js
│       └── admin.css
├── models/                # Mongoose schemas
├── routes/                # Express routes
├── middlewares/           # Auth, upload...
├── utils/                 # Logger...
├── uploads/               # Ảnh đã upload
├── server.js              # Entry point
└── .env                   # Biến môi trường
```
