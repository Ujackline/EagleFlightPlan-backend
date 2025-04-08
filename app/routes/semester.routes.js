module.exports = (app) => {
  const semester = require("../controllers/semester.controller.js");
  const { authenticate } = require("../authorization/authorization.js");
  const { isAdmin } = require("../controllers/user.controller.js");
  var router = require("express").Router();

  // Create a new semester
  router.post("/", [authenticate, isAdmin], semester.create);

  // Retrieve all semesters
  router.get("/", [authenticate], semester.findAll);

  // Retrieve active semester
  router.get("/active", [authenticate], semester.findActive);

  // Retrieve a single semester with id
  router.get("/:id", [authenticate], semester.findOne);

  // Update a semester with id
  router.put("/:id", [authenticate, isAdmin], semester.update);

  // Set a semester as active
  router.patch("/:id/setActive", [authenticate, isAdmin], semester.setActive);

  // Delete a semester with id
  router.delete("/:id", [authenticate, isAdmin], semester.delete);

  // Delete all semesters
  router.delete("/", [authenticate, isAdmin], semester.deleteAll);

  app.use("/flight-plan-t9/semester", router);
};