module.exports = (app) => {
    const flightplan = require("../controllers/flightplan.controller.js");
    const { authenticate } = require("../authorization/authorization.js");
    var router = require("express").Router();
  
    // Create a new flightplan
    router.post("/", [authenticate], flightplan.create);
  
    // Retrieve all flightplans
    router.get("/", [authenticate], flightplan.findAll);
  
    // Retrieve a single flightplan with id
    router.get("/:id", [authenticate], flightplan.findOne);
  
    // Update a flightplan with id
    router.put("/:id", [authenticate], flightplan.update);
  
    // Delete a flightplan with id
    router.delete("/:id", [authenticate], flightplan.delete);
  
    // Delete all flightplans
    router.delete("/", [authenticate], flightplan.deleteAll);
  
    app.use("/EagleFlightPlan/flightplan", router);
  };
  