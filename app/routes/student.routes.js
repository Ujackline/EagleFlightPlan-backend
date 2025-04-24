module.exports = (app) => {
  const student = require("../controllers/student.controller.js");
  const { authenticate } = require("../authorization/authorization.js");
  var router = require("express").Router();


  // ✅ PLACE THIS ABOVE `/:id` route
  router.get("/email/:email", student.searchByEmail);

  // Create a new student
  router.post("/", [authenticate], student.create);

  // Retrieve all students
  router.get("/", [authenticate], student.findAll);

  // Retrieve a single student with id
  router.get("/:id", [authenticate], student.findOne);

  // Update a student with id
  router.put("/:id", [authenticate], student.update);

  // Current student
  router.get("/current", [authenticate], student.getCurrentStudent);

  // Delete a student with id
  router.delete("/:id", [authenticate], student.delete);

  // Delete all students
  router.delete("/", [authenticate], student.deleteAll);

  // ✅ Point-related routes
  router.get("/:id/points", [authenticate], student.getPoints);
  router.patch("/:id/addPoints", [authenticate], student.addPoints);
  router.patch("/:id/redeemPoints", [authenticate], student.redeemPoints);

  app.use("/flight-plan-t9/student", router);
};
