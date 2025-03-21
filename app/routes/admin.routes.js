module.exports = (app) => {
  const admin = require("../controllers/admin.controller.js");
  const { isAdmin } = require("../controllers/user.controller");
  const notification =require("../controllers/notification.controller.js")
  const { authenticate } = require("../authorization/authorization.js");
  var router = require("express").Router();

  // Create a new admin (Only admins can create other admins)
  router.post("/", [authenticate, isAdmin ], admin.create);

  // Retrieve all admins (Only admins)
  router.get("/", [authenticate, isAdmin], admin.getAllUsers);
  router.get("/info", [authenticate, isAdmin], admin.getAdminInfo);

  
  // Retrieve notifications to an admin (Only admins can fetch notification details)
  router.get("/notifications", [authenticate, isAdmin], admin.getNotifications);

  // Retrieve a single admin (Only admins can fetch admin details)
  router.get("/:id", [authenticate, isAdmin], admin.findOne);

  


  // Update an admin (Only admins)
  router.put("/:id", [authenticate, isAdmin], admin.updateUserRole);

  // Delete an admin (Only admins)
  router.delete("/:id", [authenticate, isAdmin], admin.deleteUser);


  app.use("/flight-plan-t9/admin", router);
};

