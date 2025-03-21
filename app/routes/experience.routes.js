module.exports = (app) => {
  const experience = require("../controllers/experience.controller.js");
  const {isAdmin} = require("../controllers/user.controller.js");
  const { authenticate } = require("../authorization/authorization.js"); // Import authentication & admin authorization middleware
  var router = require("express").Router();

  // Standard CRUD Routes
  router.post("/", [authenticate], experience.create);  // Create a new experience
  router.get("/", [authenticate], experience.findAll);  // Retrieve all experiences
  router.get("/:id", [authenticate], experience.findOne); // Retrieve a single experience
  router.put("/:id", [authenticate], experience.update); // Update an experience
  router.delete("/:id", [authenticate], experience.delete); // Delete an experience
  router.delete("/", [authenticate], experience.deleteAll); // Delete all experiences

  // Approval Workflow Routes
  router.patch("/:id/mark-complete", [authenticate], experience.markAsComplete); // Student marks as complete
  router.patch("/:id/approve", [authenticate, isAdmin], experience.approveExperience); // Admin approval
  router.patch("/:id/reject", [authenticate, isAdmin], experience.rejectExperience); // Admin rejection

  app.use("/flight-plan-t9/experience", router);
};
