const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { auth } = require('./auth');
const Interaction = require('../models/Interaction');
const Notification = require('../models/Notification');
const Place = require('../models/Place');
const BusinessAccount = require('../models/BusinessAccount');
const Post = require('../models/Post');
const Friendship = require('../models/Friendship');
const User = require('../models/User');

// 1. LIKE / FAVORITE một dịch vụ
router.post('/like', auth, async (req, res) => {
  try {
    const { targetId, targetType } = req.body;
    const userId = req.user.id;

    // Kiểm tra xem đã like chưa
    const existing = await Interaction.findOne({ userId, targetId, type: 'like' });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Bạn đã thích mục này rồi.' });
    }

    // Lưu tương tác
    const interaction = new Interaction({
      userId,
      targetId,
      targetType,
      type: 'like'
    });
    await interaction.save();

    // Cập nhật số lượt thích trong model Place (nếu là place/service)
    if (targetType === 'place' || targetType === 'service') {
      const place = await Place.findOne({ 
        $or: [
          { id: targetId },
          { _id: mongoose.Types.ObjectId.isValid(targetId) ? targetId : new mongoose.Types.ObjectId() }
        ]
      });
      if (place) {
        place.favoritesCount = (place.favoritesCount || 0) + 1;
        await place.save();

        // GỬI THÔNG BÁO CHO DOANH NGHIỆP (Nếu có chủ sở hữu)
        if (place.ownerId) {
          const notification = new Notification({
            recipientId: place.ownerId,
            recipientType: 'business',
            senderId: userId,
            senderName: req.user.displayName || req.user.name,
            type: 'like',
            title: 'Lượt thích mới! ❤️',
            message: `${req.user.displayName || req.user.name} đã thích dịch vụ "${place.name}" của bạn.`,
            relatedId: place._id,
            link: `/apps/business-web/dashboard.html?view=service&id=${place._id}`
          });
          await notification.save();
        }
      }
    } else if (targetType === 'post') {
      // XỬ LÝ LIKE CHO BÀI VIẾT (SOCIAL POST)
      const post = await Post.findOne({ 
        _id: mongoose.Types.ObjectId.isValid(targetId) ? targetId : new mongoose.Types.ObjectId()
      });
      if (post) {
        if (!post.likes.includes(userId)) {
          post.likes.push(userId);
          await post.save();
          
          // Thông báo cho chủ bài viết
          if (post.userId.toString() !== userId.toString()) {
            const notification = new Notification({
              recipientId: post.userId,
              recipientType: 'user',
              senderId: userId,
              senderName: req.user.displayName || req.user.name,
              type: 'like',
              title: 'Bài viết của bạn có lượt thích mới! ❤️',
              message: `${req.user.displayName || req.user.name} đã thích bài viết "${post.content.substring(0, 20)}..." của bạn.`,
              relatedId: post._id,
              link: `/apps/user-web/social-hub.html`
            });
            await notification.save();
          }
        }
      }
    }

    res.json({ success: true, message: 'Đã thêm vào yêu thích!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. KHÔNG QUAN TÂM (Hide/Not Interested)
router.post('/not-interested', auth, async (req, res) => {
  try {
    const { targetId, targetType } = req.body;
    const userId = req.user.id;

    const interaction = new Interaction({
      userId,
      targetId,
      targetType,
      type: 'not_interested'
    });
    await interaction.save();

    // AI Insight: Lưu vào bộ nhớ để sau này AI không gợi ý doanh nghiệp này nữa
    // (Phần này sẽ tích hợp sâu hơn vào AI Planner)

    res.json({ success: true, message: 'Đã ghi nhận, chúng tôi sẽ hạn chế gợi ý mục này.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. LẤY DANH SÁCH THÔNG BÁO (Dành cho Doanh nghiệp/Admin/User)
router.get('/notifications', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ 
      recipientId: req.user.id 
    }).sort({ createdAt: -1 }).limit(50);
    
    res.json({ success: true, data: notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. ĐÁNH DẤU ĐÃ ĐỌC THÔNG BÁO
router.post('/notifications/read', auth, async (req, res) => {
  try {
    const { notificationId } = req.body;
    if (notificationId) {
      await Notification.findByIdAndUpdate(notificationId, { isRead: true });
    } else {
      await Notification.updateMany({ recipientId: req.user.id }, { isRead: true });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 5. ĐĂNG BÀI VIẾT MỚI (Nhật ký)
router.post('/posts', auth, async (req, res) => {
  try {
    const { content, media, location } = req.body;
    const post = new Post({
      userId: req.user.id,
      userName: req.user.displayName || req.user.name,
      userAvatar: req.user.avatar || '',
      content,
      media: media || [],
      location: location || null
    });
    await post.save();
    res.json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 6. LẤY BẢNG TIN (Feed - Những người bạn đã kết bạn + công khai)
router.get('/feed', auth, async (req, res) => {
  try {
    // Tìm danh sách bạn bè
    const friends = await Friendship.find({
      $or: [
        { requester: req.user.id, status: 'accepted' },
        { recipient: req.user.id, status: 'accepted' }
      ]
    });
    
    const friendIds = friends.map(f => 
      f.requester.toString() === req.user.id ? f.recipient : f.requester
    );
    friendIds.push(req.user.id); // Bao gồm cả bài của chính mình

    const posts = await Post.find({
      $or: [
        { userId: { $in: friendIds } },
        { isPublic: true }
      ]
    }).sort({ createdAt: -1 }).limit(30);

    res.json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 7. KẾT BẠN (Gửi lời mời)
router.post('/friends/request', auth, async (req, res) => {
  try {
    const { recipientId } = req.body;
    if (recipientId === req.user.id) return res.status(400).json({ message: 'Không thể kết bạn với chính mình' });

    const existing = await Friendship.findOne({
      $or: [
        { requester: req.user.id, recipient: recipientId },
        { requester: recipientId, recipient: req.user.id }
      ]
    });

    if (existing) return res.status(400).json({ message: 'Lời mời đã tồn tại hoặc đã là bạn.' });

    const friendship = new Friendship({
      requester: req.user.id,
      recipient: recipientId,
      status: 'pending'
    });
    await friendship.save();

    // Gửi thông báo cho người nhận
    const notification = new Notification({
      recipientId: recipientId,
      recipientType: 'user',
      senderId: req.user.id,
      senderName: req.user.displayName || req.user.name,
      type: 'system',
      title: 'Lời mời kết bạn mới! 👋',
      message: `${req.user.displayName || req.user.name} muốn kết bạn với bạn.`,
      link: `/apps/user-web/profile.html?view=friends`
    });
    await notification.save();

    res.json({ success: true, message: 'Đã gửi lời mời kết bạn!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 8. BÌNH LUẬN BÀI VIẾT
router.post('/posts/:id/comment', auth, async (req, res) => {
  try {
    const text = req.body.text || req.body.content;
    if (!text) return res.status(400).json({ message: 'Nội dung bình luận không được để trống' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Không tìm thấy bài viết' });

    const comment = {
      userId: req.user.id,
      userName: req.user.displayName || req.user.name,
      userAvatar: req.user.avatar || '',
      text,
      createdAt: new Date()
    };

    post.comments.push(comment);
    await post.save();

    // Thông báo cho chủ bài viết
    if (post.userId.toString() !== req.user.id.toString()) {
      const notification = new Notification({
        recipientId: post.userId,
        recipientType: 'user',
        senderId: req.user.id,
        senderName: req.user.displayName || req.user.name,
        type: 'comment',
        title: 'Bình luận mới! 💬',
        message: `${req.user.displayName || req.user.name} đã bình luận về bài viết của bạn.`,
        relatedId: post._id,
        link: `/apps/user-web/social-hub.html?post=${post._id}`
      });
      await notification.save();
    }

    res.json({ success: true, comment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 9. LẤY DANH SÁCH BẠN BÈ
router.get('/friends', auth, async (req, res) => {
  try {
    const friendships = await Friendship.find({
      $or: [{ requester: req.user.id }, { recipient: req.user.id }],
      status: 'accepted'
    });

    const friendIds = friendships.map(f => 
      f.requester.toString() === req.user.id ? f.recipient : f.requester
    );

    const friends = await User.find({ _id: { $in: friendIds } })
      .select('name displayName avatar rank rankTier points')
      .lean();

    res.json({ success: true, data: friends });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 10. LẤY LỜI MỜI KẾT BẠN (Đang chờ)
router.get('/friends/pending', auth, async (req, res) => {
  try {
    const pending = await Friendship.find({
      recipient: req.user.id,
      status: 'pending'
    }).populate('requester', 'name displayName avatar rank points');

    res.json({ success: true, data: pending });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 11. CHẤP NHẬN/TỪ CHỐI LỜI MỜI
router.post('/friends/respond', auth, async (req, res) => {
  try {
    const { friendshipId, action } = req.body; // action: 'accept' or 'decline'
    const friendship = await Friendship.findById(friendshipId);
    
    if (!friendship || friendship.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Thao tác không hợp lệ' });
    }

    if (action === 'accept') {
      friendship.status = 'accepted';
      friendship.updatedAt = new Date();
      await friendship.save();

      // Thông báo cho người gửi
      const notification = new Notification({
        recipientId: friendship.requester,
        recipientType: 'user',
        senderId: req.user.id,
        senderName: req.user.displayName || req.user.name,
        type: 'system',
        title: 'Kết bạn thành công! 🎉',
        message: `${req.user.displayName || req.user.name} đã chấp nhận lời mời kết bạn của bạn.`,
        link: `/apps/user-web/profile.html?id=${req.user.id}`
      });
      await notification.save();
    } else {
      await Friendship.findByIdAndDelete(friendshipId);
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
