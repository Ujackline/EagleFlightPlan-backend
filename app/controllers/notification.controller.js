const db = require("../models");
const Notification = db.Notification;

// **1. Get all notifications for the logged-in admin**
exports.findAll = async (req, res) => {
    console.log('notification controller findall');
    console.log(req.user.id);
    
    try {
        const notifications = await Notification.findAll({
            where: { recipientId: req.user.id }, // Only show notifications for the logged-in admin
            order: [["createdAt", "DESC"]],
        });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notifications", error });
    }
};

// **2. Mark a notification as read**
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByPk(req.params.id);
        if (!notification) return res.status(404).json({ message: "Notification not found" });

        notification.status = "read";
        await notification.save();

        res.json({ message: "Notification marked as read", notification });
    } catch (error) {
        res.status(500).json({ message: "Error updating notification", error });
    }
};

// **3. Delete a notification**
exports.deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findByPk(req.params.id);
        if (!notification) return res.status(404).json({ message: "Notification not found" });

        await notification.destroy();
        res.json({ message: "Notification deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting notification", error });
    }
};

// **4. Send a notification (used internally when an experience is marked as complete)**
// notification.controller.js
exports.sendNotification = async (
    recipientId,
    message,
    type = "general",
    options = {} // new flexible input
  ) => {
    try {
      const notificationData = {
        recipientId,
        message,
        type,
        status: "unread",
        experienceId: options.experienceId || null,
        eventId: options.eventId || null,
        taskId: options.taskId || null,
      };
  
      await Notification.create(notificationData);
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };
  
