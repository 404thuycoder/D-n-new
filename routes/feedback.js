const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Feedback = require('../models/Feedback');

const { auth } = require('./auth');

// GET /api/feedback/my-feedbacks (Get user's own feedback history)
router.get('/my-feedbacks', auth, async (req, res) => {
  try {
    const email = req.user.email;
    const feedbacks = await Feedback.find({ email: email }).sort({ createdAt: -1 });
    res.json({ success: true, data: feedbacks });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy lịch sử phản hồi' });
  }
});

// POST /api/feedback (Public endpoint for users to submit feedback)
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Nội dung phản hồi không được để trống' });
    }

    // Luôn lưu vào DB
    const newFeedback = await Feedback.create({
      name: name || 'Khách Ẩn Danh',
      email: email || 'Không cung cấp',
      message
    });

    // Cố gắng gửi email báo cáo (không bắt buộc thành công mới trả về response)
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const adminEmail = process.env.ADMIN_EMAIL;

    if (emailUser && emailPass && adminEmail) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail', // Mặc định là Gmail
          auth: {
            user: emailUser,
            pass: emailPass
          }
        });

        const mailOptions = {
          from: `"WanderViệt System" <${emailUser}>`,
          to: adminEmail,
          subject: '[WanderViệt] Phản hồi mới từ người dùng',
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; border: 1px solid #eee;">
              <h2 style="color: #00F0FF;">Có phản hồi mới từ hệ thống</h2>
              <p><strong>Người gửi:</strong> ${newFeedback.name}</p>
              <p><strong>Email:</strong> ${newFeedback.email}</p>
              <p><strong>Thời gian:</strong> ${new Date(newFeedback.createdAt).toLocaleString('vi-VN')}</p>
              <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
              <h3 style="color: #333;">Nội dung:</h3>
              <p style="background: #f9f9f9; padding: 15px; border-left: 4px solid #0055FF; font-size: 14px; line-height: 1.6;">
                ${newFeedback.message.replace(/\n/g, '<br>')}
              </p>
              <p style="font-size: 12px; color: #888; margin-top: 30px;">
                Đây là email tự động. Bạn cũng có thể xem toàn bộ trên Admin Panel.
              </p>
            </div>
          `
        };

        transporter.sendMail(mailOptions).catch(console.error);
      } catch (mailErr) {
        console.error('Lỗi khi cấu hình Nodemailer:', mailErr);
      }
    }

    res.status(201).json({ success: true, message: 'Gửi thành công', data: newFeedback });
  } catch (err) {
    console.error('Feedback Error:', err);
    res.status(500).json({ success: false, message: 'Lỗi server khi lưu phản hồi' });
  }
});

module.exports = router;
