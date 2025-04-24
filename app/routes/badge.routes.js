module.exports = (app) => {
    const badge = require("../controllers/badge.controller.js");
    const { authenticate } = require("../authorization/authorization.js");
    var router = require("express").Router();
  
    // Create a new badge
    router.post("/", [authenticate], badge.create);
  
    // Retrieve all badges
    router.get("/", [authenticate], badge.findAll);
  
    // Retrieve a single badge with id
    router.get("/:id", [authenticate], badge.findOne);

    router.get("/student/:studentId", badge.findAllByStudentId);
  
    // Update a badge with id
    router.put("/:id", [authenticate], badge.update);
  
    // Delete a badge with id
    router.delete("/:id", [authenticate], badge.delete);
  
    // Delete all badges
    router.delete("/", [authenticate], badge.deleteAll);
    
    router.post("/check-auto-award", [authenticate], badge.checkAutomaticBadges);

  
    app.use("/flight-plan-t9/badge", router);

    // Award automatic badges based on student points

  };
  