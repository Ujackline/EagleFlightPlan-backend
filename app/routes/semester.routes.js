module.exports = (app) => {
  const semester = require("../controllers/semester.controller.js");
  const { authenticate } = require("../authorization/authorization.js");
  const { isAdmin } = require("../controllers/user.controller.js");
  var router = require("express").Router();

  // Create a new semester (Admin only)
  router.post("/", [authenticate, isAdmin], semester.create);

  // Retrieve all semesters (Authenticated users)
  router.get("/", [authenticate], semester.findAll);

  // Retrieve active semester (Authenticated users)
  router.get("/active", [authenticate], semester.findActive);

  // // Retrieve current semester with flight plans (Authenticated users)
  // router.get("/current/with-plans", [authenticate], semester.findCurrentWithPlans);

  // Retrieve a single semester with id (Authenticated users)
  router.get("/:id", [authenticate], semester.findOne);

  // // Get students enrolled in semester (Admin only)
  // router.get("/:id/students", [authenticate, isAdmin], semester.findStudents);

  // Update a semester with id (Admin only)
  router.put("/:id", [authenticate, isAdmin], semester.update);

  // Set a semester as active (Admin only)
  router.patch("/:id/activate", [authenticate, isAdmin], semester.setActive);

  // Delete a semester with id (Admin only)
  router.delete("/:id", [authenticate, isAdmin], semester.delete);

  app.use("/flight-plan-t9/semester", router);
};

