// Mock API service cho việc đăng nhập/đăng ký doanh nghiệp
const MOCK_DELAY = 1000;

export const authService = {
  async login(email, password) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === 'admin@company.com' && password === '123456') {
          resolve({
            success: true,
            token: 'mock_biz_token_123',
            user: {
              id: 'biz_001',
              name: 'Doanh nghiệp Admin',
              email: 'admin@company.com',
              displayName: 'Admin Company'
            }
          });
        } else {
          resolve({
            success: false,
            message: 'Email hoặc mật khẩu không chính xác.'
          });
        }
      }, MOCK_DELAY);
    });
  },

  async register(name, email, password) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          token: 'mock_biz_token_new',
          user: {
            id: 'biz_' + Date.now(),
            name,
            email,
            displayName: name
          }
        });
      }, MOCK_DELAY);
    });
  },

  async checkAuth(token) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (token === 'mock_biz_token_123' || token === 'mock_biz_token_new') {
          resolve({
            success: true,
            user: {
              id: 'biz_001',
              name: 'Doanh nghiệp Admin',
              email: 'admin@company.com',
              displayName: 'Admin Company'
            }
          });
        } else {
          resolve({ success: false });
        }
      }, 500);
    });
  }
};
