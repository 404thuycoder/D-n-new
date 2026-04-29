const Broadcast = require('../models/Broadcast');
const Notification = require('../models/Notification');

/**
 * Broadcast Worker
 * Kiểm tra các thông báo được hẹn giờ và thực hiện gửi khi đến thời điểm.
 */
function initBroadcastWorker() {
    console.log('⏰ [BroadcastWorker] Initialized.');
    
    // Kiểm tra mỗi 30 giây
    setInterval(async () => {
        try {
            const now = new Date();
            
            // Tìm các bản ghi đang chờ gửi và đã đến hoặc quá hạn giờ gửi
            const pendingBroadcasts = await Broadcast.find({
                isScheduled: true,
                status: 'pending',
                scheduledTime: { $lte: now }
            });
            
            if (pendingBroadcasts.length === 0) return;
            
            console.log(`⏰ [BroadcastWorker] Found ${pendingBroadcasts.length} scheduled broadcasts to send.`);
            
            for (const b of pendingBroadcasts) {
                try {
                    // 1. Tạo Notification cho người dùng
                    const notification = new Notification({
                        recipientId: b.targetId,
                        senderId: b.senderId,
                        title: b.title,
                        message: b.message,
                        type: b.type || 'broadcast'
                    });
                    await notification.save();
                    
                    // 2. Cập nhật trạng thái Broadcast
                    b.status = 'sent';
                    await b.save();
                    
                    console.log(`✅ [BroadcastWorker] Sent: "${b.title}" to ${b.targetId}`);
                } catch (err) {
                    console.error(`❌ [BroadcastWorker] Error sending broadcast ${b._id}:`, err);
                }
            }
        } catch (error) {
            console.error('❌ [BroadcastWorker] Critical Error:', error);
        }
    }, 30000); // 30 seconds
}

module.exports = { initBroadcastWorker };
