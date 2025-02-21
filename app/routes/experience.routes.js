module.exports = (app) => {
    const experience = require("../controllers/experience.controller.js");
    const { authenticate } = require("../authorization/authorization.js");
    var router = require("express").Router();
  
    // Create a new experience
    router.post("/", [authenticate], experience.create);
  
    // Retrieve all experiences
    router.get("/", [authenticate], experience.findAll);
  
    // Retrieve a single experience with id
    router.get("/:id", [authenticate], experience.findOne);
  
    // Update an experience with id
    router.put("/:id", [authenticate], experience.update);
  
    // Delete an experience with id
    router.delete("/:id", [authenticate], experience.delete);
  
    // Delete all experiences
    router.delete("/", [authenticate], experience.deleteAll);
  
    app.use("/flight-plan-t9/experience", router);
  };
  