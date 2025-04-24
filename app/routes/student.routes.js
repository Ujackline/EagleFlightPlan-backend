module.exports = (app) => {
  const student = require("../controllers/student.controller.js");
  const { authenticate } = require("../authorization/authorization.js");
  var router = require("express").Router();

  // Create a new student
  router.post("/", [authenticate], student.create);

  // Retrieve all students
  router.get("/", [authenticate], student.findAll);

  // Retrieve current student
  router.get("/current", [authenticate], student.getCurrentStudent);

  // Get student by userId
  router.get("/user/:userId", [authenticate], student.findByUserId);

  // Retrieve a single student with id
  router.get("/:id", [authenticate], student.findOne);

  // Update a student with id
  router.put("/:id", [authenticate], student.update);

  // Delete a student with id
  router.delete("/:id", [authenticate], student.delete);

  // Delete all students
  router.delete("/", [authenticate], student.deleteAll);

  // Point-related routes
  router.get("/:id/points", [authenticate], student.getPoints);
  router.patch("/:id/addPoints", [authenticate], student.addPoints);
  router.patch("/:id/redeemPoints", [authenticate], student.redeemPoints);
  
  // Add the new route for updating total points
  router.patch("/:id/points", [authenticate], student.updatePoints);

  app.use("/flight-plan-t9/student", router);
};