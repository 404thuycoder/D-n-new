const express = require('express');
const router = express.Router();
const Knowledge = require('../models/Knowledge');
const { adminTokenAuth } = require('./auth');
const logAction = require('../utils/logger');

// Middleware to check admin role
const adminAuth = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Forbidden' });
  }
};

// Get all knowledge entries
router.get('/', adminTokenAuth, adminAuth, async (req, res) => {
  try {
    const entries = await Knowledge.find().sort({ createdAt: -1 });
    res.json({ success: true, data: entries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create new entry
router.post('/', adminTokenAuth, adminAuth, async (req, res) => {
  try {
    const entry = new Knowledge(req.body);
    await entry.save();
    await logAction('KNOWLEDGE_CREATED', `Thêm kiến thức AI: ${entry.question.substring(0, 30)}...`, req);
    res.json({ success: true, data: entry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update entry
router.put('/:id', adminTokenAuth, adminAuth, async (req, res) => {
  try {
    const entry = await Knowledge.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    await logAction('KNOWLEDGE_UPDATED', `Cập nhật kiến thức AI ID: ${req.params.id}`, req);
    res.json({ success: true, data: entry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete entry
router.delete('/:id', adminTokenAuth, adminAuth, async (req, res) => {
  try {
    await Knowledge.findByIdAndDelete(req.params.id);
    await logAction('KNOWLEDGE_DELETED', `Xóa kiến thức AI ID: ${req.params.id}`, req);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Bulk seed from seedChatbot script
router.post('/seed', adminTokenAuth, adminAuth, async (req, res) => {
  try {
    const { exec } = require('child_process');
    exec('node seedChatbot.js', (err, stdout, stderr) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Seed failed', error: stderr });
      }
      res.json({ success: true, message: 'Seeding completed', output: stdout });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
