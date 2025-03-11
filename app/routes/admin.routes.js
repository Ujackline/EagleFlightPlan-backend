module.exports = (app) => {
  const admin = require("../controllers/admin.controller.js");
  const { authenticate, isAdmin } = require("../authorization/authorization.js");
  var router = require("express").Router();

  // Create a new admin (Only admins can create other admins)
  router.post("/", [authenticate, isAdmin], admin.create);

  // Retrieve all admins (Only admins)
  router.get("/", [authenticate, isAdmin], admin.findAll);

  // Retrieve a single admin (Only admins can fetch admin details)
  router.get("/:id", [authenticate, isAdmin], admin.findOne);

  // Update an admin (Only admins)
  router.put("/:id", [authenticate, isAdmin], admin.update);

  // Delete an admin (Only admins)
  router.delete("/:id", [authenticate, isAdmin], admin.delete);

  // Delete all admins (Only admins)
  router.delete("/", [authenticate, isAdmin], admin.deleteAll);

  app.use("/flight-plan-t9/admin", router);
};

