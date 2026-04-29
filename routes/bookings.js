const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Place = require('../models/Place');
const { auth, businessAuth } = require('./auth');

// 1. User: Create a booking
router.post('/', auth, async (req, res) => {
  try {
    const { placeId, useDate, peopleCount, customerName, customerPhone, customerEmail } = req.body;
    
    const place = await Place.findOne({ id: placeId });
    if (!place) return res.status(404).json({ success: false, message: 'Không tìm thấy địa điểm' });
    if (!place.ownerId) return res.status(400).json({ success: false, message: 'Địa điểm này chưa được quản lý bởi doanh nghiệp' });

    const totalPrice = (place.priceFrom || 0) * (peopleCount || 1);
    
    const newBooking = new Booking({
      bookingId: 'BK-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      placeId,
      placeName: place.name,
      userId: req.user.id,
      customerName,
      customerEmail: customerEmail || req.user.email,
      customerPhone,
      useDate: new Date(useDate),
      peopleCount,
      totalPrice,
      ownerId: place.ownerId,
      status: 'pending'
    });

    await newBooking.save();
    res.json({ success: true, data: newBooking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. User: Get my bookings
router.get('/my', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. Business: Get bookings for my places
router.get('/business', businessAuth, async (req, res) => {
  try {
    const bookings = await Booking.find({ ownerId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. Business: Update booking status
router.put('/:id/status', businessAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user.id },
      { status },
      { new: true }
    );
    if (!booking) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hoặc sai quyền' });
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
