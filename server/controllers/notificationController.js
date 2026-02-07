const { Notification, User, Enrollment, Batch, BatchStudent } = require('../models');

exports.getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findOne({
            where: { id, userId: req.user.id }
        });

        if (!notification) return res.status(404).json({ message: 'Notification not found' });

        notification.isRead = true;
        await notification.save();

        res.json(notification);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.update(
            { isRead: true },
            { where: { userId: req.user.id, isRead: false } }
        );
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findOne({
            where: { id, userId: req.user.id }
        });

        if (!notification) return res.status(404).json({ message: 'Notification not found' });

        await notification.destroy();
        res.json({ message: 'Notification deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.sendTargetedNotification = async (req, res) => {
    try {
        const { targetType, targetId, title, message, type, link } = req.body;
        let recipientIds = [];

        if (targetType === 'individual') {
            recipientIds = [targetId];
        } else if (targetType === 'course') {
            const enrollments = await Enrollment.findAll({
                where: { courseId: targetId },
                attributes: ['userId']
            });
            recipientIds = enrollments.map(e => e.userId);
        } else if (targetType === 'batch') {
            const batchStudents = await BatchStudent.findAll({
                where: { batchId: targetId },
                attributes: ['studentId']
            });
            recipientIds = batchStudents.map(bs => bs.studentId);
        } else if (targetType === 'all') {
            const students = await User.findAll({
                where: { role: 'student' },
                attributes: ['id']
            });
            recipientIds = students.map(s => s.id);
        }

        if (recipientIds.length === 0) {
            return res.status(400).json({ message: 'No recipients found for the selected target.' });
        }

        const notifications = recipientIds.map(userId => ({
            userId,
            title,
            message,
            type: type || 'info',
            link: link || null
        }));

        await Notification.bulkCreate(notifications);

        res.json({ message: `Notification sent to ${recipientIds.length} recipients.` });
    } catch (error) {
        console.error("SEND_NOTIFICATION_ERROR:", error);
        res.status(500).json({ message: 'Failed to send notifications', error: error.message });
    }
};
