module.exports = (app) => {
    const student = require("../controllers/student.controller.js");
    const { authenticate } = require("../authorization/authorization.js");
    var router = require("express").Router();
  
    // Create a new student
    router.post("/", [authenticate], student.create);
  
    // Retrieve all students
    router.get("/", [authenticate], student.findAll);
  
    // Retrieve a single student with id
    router.get("/:id", [authenticate], student.findOne);
  
    // Update a student with id
    router.put("/:id", [authenticate], student.update);
  
    // Delete a student with id
    router.delete("/:id", [authenticate], student.delete);
  
    // Delete all students
    router.delete("/", [authenticate], student.deleteAll);
  
    app.use("/EagleFlightPlan/student", router);
  };
  