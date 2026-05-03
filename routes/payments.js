const express = require('express');
const router = express.Router();
const PaymentMethod = require('../models/PaymentMethod');
const Transaction = require('../models/Transaction');
const Booking = require('../models/Booking');
const { auth } = require('./auth');

// ════════════════════════════════════════════
//  PAYMENT METHODS
// ════════════════════════════════════════════

// GET /api/payments/methods — Lấy danh sách PTTT
router.get('/methods', auth, async (req, res) => {
  try {
    const methods = await PaymentMethod.find({ userId: req.user.id }).sort({ isDefault: -1, createdAt: -1 });
    res.json({ success: true, data: methods });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/payments/methods — Thêm PTTT mới
router.post('/methods', auth, async (req, res) => {
  try {
    const { type, label, cardLast4, cardBrand, cardExpiry, cardHolder, walletPhone, bankName, bankAccount, bankOwner, setDefault } = req.body;

    if (!type) return res.status(400).json({ success: false, message: 'Thiếu loại phương thức thanh toán' });

    // Nếu set làm mặc định, bỏ mặc định các cái cũ
    if (setDefault) {
      await PaymentMethod.updateMany({ userId: req.user.id }, { isDefault: false });
    }

    // Tạo label tự động nếu không có
    let autoLabel = label;
    if (!autoLabel) {
      if (type === 'card') autoLabel = `Thẻ ${cardBrand || ''} **** ${cardLast4 || ''}`.trim();
      else if (type === 'momo') autoLabel = `Ví MoMo - ${walletPhone || ''}`;
      else if (type === 'zalopay') autoLabel = `ZaloPay - ${walletPhone || ''}`;
      else if (type === 'vnpay') autoLabel = `VNPay - ${walletPhone || ''}`;
      else if (type === 'bank_transfer') autoLabel = `${bankName || 'Ngân hàng'} - ${bankAccount || ''}`;
    }

    const method = new PaymentMethod({
      userId: req.user.id,
      type, label: autoLabel,
      cardLast4, cardBrand, cardExpiry, cardHolder,
      walletPhone,
      bankName, bankAccount, bankOwner,
      isDefault: setDefault || false
    });

    // Nếu chưa có PTTT nào → tự động làm mặc định
    const count = await PaymentMethod.countDocuments({ userId: req.user.id });
    if (count === 0) method.isDefault = true;

    await method.save();
    res.json({ success: true, data: method });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/payments/methods/:id/default — Đặt làm mặc định
router.put('/methods/:id/default', auth, async (req, res) => {
  try {
    await PaymentMethod.updateMany({ userId: req.user.id }, { isDefault: false });
    const method = await PaymentMethod.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isDefault: true },
      { new: true }
    );
    if (!method) return res.status(404).json({ success: false, message: 'Không tìm thấy phương thức thanh toán' });
    res.json({ success: true, data: method });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/payments/methods/:id — Xóa PTTT
router.delete('/methods/:id', auth, async (req, res) => {
  try {
    const method = await PaymentMethod.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!method) return res.status(404).json({ success: false, message: 'Không tìm thấy phương thức thanh toán' });

    // Nếu đang là mặc định → chọn cái mới nhất làm mặc định
    if (method.isDefault) {
      const next = await PaymentMethod.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
      if (next) await PaymentMethod.findByIdAndUpdate(next._id, { isDefault: true });
    }

    res.json({ success: true, message: 'Đã xóa phương thức thanh toán' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ════════════════════════════════════════════
//  TRANSACTIONS
// ════════════════════════════════════════════

// GET /api/payments/transactions — Lịch sử giao dịch
router.get('/transactions', auth, async (req, res) => {
  try {
    const { type, status, limit = 20, skip = 0 } = req.query;
    const query = { userId: req.user.id };
    if (type) query.type = type;
    if (status) query.status = status;

    const [transactions, total] = await Promise.all([
      Transaction.find(query).sort({ createdAt: -1 }).limit(parseInt(limit)).skip(parseInt(skip)),
      Transaction.countDocuments(query)
    ]);

    res.json({ success: true, data: transactions, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ════════════════════════════════════════════
//  UPGRADE PLANS
// ════════════════════════════════════════════

const UPGRADE_PLANS = {
  premium: {
    name: 'Premium ⭐',
    price: 99000,
    duration: 30,    // ngày
    features: ['Lên lịch trình không giới hạn', 'AI thông minh hơn', 'Ưu tiên hỗ trợ', 'Không quảng cáo']
  },
  elite: {
    name: 'Elite 👑',
    price: 249000,
    duration: 30,
    features: ['Tất cả tính năng Premium', 'Tour độc quyền', 'Concierge riêng', 'Giảm giá 15% tất cả tour', 'Huy hiệu Elite đặc biệt']
  }
};

// GET /api/payments/plans — Lấy danh sách gói
router.get('/plans', async (req, res) => {
  res.json({ success: true, data: UPGRADE_PLANS });
});

// POST /api/payments/upgrade — Mua gói nâng cấp (demo flow)
router.post('/upgrade', auth, async (req, res) => {
  try {
    const { plan, paymentMethodId } = req.body;
    if (!UPGRADE_PLANS[plan]) return res.status(400).json({ success: false, message: 'Gói không hợp lệ' });

    const planInfo = UPGRADE_PLANS[plan];

    // Tạo transaction
    const txn = new Transaction({
      transactionId: 'TXN-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
      userId: req.user.id,
      type: 'upgrade',
      amount: planInfo.price,
      status: 'success', // Demo: luôn thành công
      upgradePlan: plan,
      paymentMethodId: paymentMethodId || null,
      description: `Mua gói ${planInfo.name} (${planInfo.duration} ngày)`,
    });

    await txn.save();

    res.json({
      success: true,
      message: `Đã kích hoạt gói ${planInfo.name} thành công!`,
      data: { transaction: txn, plan: planInfo }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/payments/pay-booking — Thanh toán đơn đặt tour
router.post('/pay-booking', auth, async (req, res) => {
  try {
    const { bookingId, paymentMethodId } = req.body;

    const booking = await Booking.findOne({ bookingId, userId: req.user.id });
    if (!booking) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn đặt' });
    if (booking.paymentStatus === 'paid') return res.status(400).json({ success: false, message: 'Đơn này đã được thanh toán' });

    // Tạo transaction
    const txn = new Transaction({
      transactionId: 'TXN-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
      userId: req.user.id,
      type: 'tour_booking',
      amount: booking.totalPrice,
      status: 'success',
      bookingId: booking.bookingId,
      paymentMethodId: paymentMethodId || null,
      description: `Thanh toán tour: ${booking.placeName}`,
      placeName: booking.placeName
    });

    await txn.save();

    // Cập nhật trạng thái booking
    booking.paymentStatus = 'paid';
    booking.paymentMethod = 'card'; // Demo
    await booking.save();

    res.json({ success: true, message: 'Thanh toán thành công!', data: { transaction: txn } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
