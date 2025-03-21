module.exports = (app) => {
    const notification = require("../controllers/notification.controller.js");
    const {isAdmin} = require("../controllers/user.controller.js");

    const { authenticate } = require("../authorization/authorization.js");

    var router = require("express").Router();

    // Get all notifications for the logged-in admin
    router.get("/", [authenticate, isAdmin], notification.findAll);

    // Mark a notification as read
    router.patch("/:id/read", [authenticate, isAdmin], notification.markAsRead);

    // Delete a notification
    router.delete("/:id", [authenticate, isAdmin], notification.deleteNotification);

    app.use("/flight-plan-t9/admin/notifications", router);
};
