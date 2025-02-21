module.exports = (app) => {
    const event = require("../controllers/event.controller.js");
    const { authenticate } = require("../authorization/authorization.js");
    var router = require("express").Router();
  
    // Create a new event
    router.post("/", [authenticate], event.create);
  
    // Retrieve all events
    router.get("/", [authenticate], event.findAll);
  
    // Retrieve a single event with id
    router.get("/:id", [authenticate], event.findOne);
  
    // Update a event with id
    router.put("/:id", [authenticate], event.update);
  
    // Delete an event with id
    router.delete("/:id", [authenticate], event.delete);
  
    // Delete all events
    router.delete("/", [authenticate], event.deleteAll);
  
    app.use("/flight-plan-t9/event", router);
  };
  